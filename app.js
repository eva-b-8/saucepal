let categoryIcons = {
  "Fruit & veg":
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-carrot preview-icon"><path d="M15 16a1 1 0 0 0-7-7q-4 4-5.987 12.385a.5.5 0 0 0 .602.602Q11 20 15 16l-3-3"/><path d="M15 9q4 4 7 0-3-4-7 0 4-4 0-7-4 3 0 7"/><path d="m8 15-2.58-2.58"/></svg>',
  "Meat & fish":
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ham preview-icon"><path d="M13.144 21.144A7.274 10.445 45 1 0 2.856 10.856"/><path d="M13.144 21.144A7.274 4.365 45 0 0 2.856 10.856a7.274 4.365 45 0 0 10.288 10.288"/><path d="M16.565 10.435 18.6 8.4a2.501 2.501 0 1 0 1.65-4.65 2.5 2.5 0 1 0-4.66 1.66l-2.024 2.025"/><path d="m8.5 16.5-1-1"/></svg>',
  "Dairy & eggs":
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-egg-fried preview-icon"><circle cx="11.5" cy="12.5" r="3.5"/><path d="M3 8c0-3.5 2.5-6 6.5-6 5 0 4.83 3 7.5 5s5 2 5 6c0 4.5-2.5 6.5-7 6.5-2.5 0-2.5 2.5-6 2.5s-7-2-7-5.5c0-3 1.5-3 1.5-5C3.5 10 3 9 3 8Z"/></svg>',
  "Store cupboard":
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-can preview-icon"><path d="M21 10.5a9 2.5 0 01-18 0v8a9 2.5 0 0018 0z"/><path d="M21 10.5A9 2.5 25.32 004.59 3.47 9 2.5 25.32 0021 10.5"/><path d="M3 10.5a9 2.5 0 016.527-2.405"/><path d="M9 16.858a31 31 0 006 0"/></svg>',
  Frozen:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-snowflake preview-icon"><path d="m10 20-1.25-2.5L6 18"/><path d="M10 4 8.75 6.5 6 6"/><path d="m14 20 1.25-2.5L18 18"/><path d="m14 4 1.25 2.5L18 6"/><path d="m17 21-3-6h-4"/><path d="m17 3-3 6 1.5 3"/><path d="M2 12h6.5L10 9"/><path d="m20 10-1.5 2 1.5 2"/><path d="M22 12h-6.5L14 15"/><path d="m4 10 1.5 2L4 14"/><path d="m7 21 3-6-1.5-3"/><path d="m7 3 3 6h4"/></svg>',
  Other:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-utensils preview-icon"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>',
};

function formatAmount(item) {
  if (!item.quantity) {
    return "";
  }
  let unit = item.unit || "kg";
  if (unit === "units") {
    return item.quantity;
  }
  return item.quantity + " " + unit;
}

function capitalise(text) {
  let trimmed = text.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

let unitSettings = {
  kg: { step: 0.1, placeholder: "0", min: 0.1, max: 50 },
  g: { step: 1, placeholder: "0", min: 1, max: 50000 },
  units: { step: 1, placeholder: "0", min: 1, max: 100 },
};

$("#unit").on("change", function () {
  let settings = unitSettings[$(this).val()];
  $("#quantity").attr({
    step: settings.step,
    placeholder: settings.placeholder,
    min: settings.min,
  });
});

let form = document.getElementById("add-form");
let toastTimer;

function showToast(message) {
  let toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("toast-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("toast-visible");
  }, 4000);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let formData = new FormData(form);
  let ingredient = formData.get("ingredient");
  let quantity = +formData.get("quantity");
  let unit = formData.get("unit");
  let category = formData.get("category");

  let ingredientField = document.getElementById("ingredient");
  let quantityField = document.getElementById("quantity");
  let ingredientError = document.getElementById("ingredientError");
  let quantityError = document.getElementById("quantityError");
  ingredientError.style.display = "none";
  quantityError.style.display = "none";
  ingredientField.classList.remove("input-error");
  quantityField.classList.remove("input-error");

  let ingredientIsValid = ingredient.trim().length > 2;
  if (!ingredientIsValid) {
    ingredientError.style.display = "block";
    ingredientError.textContent =
      "Ingredient name needs to be at least 3 characters long.";
    ingredientField.classList.add("input-error");
  }

  let min = unitSettings[unit].min;
  let max = unitSettings[unit].max;
  let quantityIsEmpty = formData.get("quantity") === "";
  let quantityIsValid = quantityIsEmpty || (quantity >= min && quantity <= max);
  if (!quantityIsValid) {
    quantityError.style.display = "block";
    quantityError.textContent =
      "The amount needs to be between " +
      min +
      " and " +
      max +
      " " +
      unit +
      ".";
    quantityField.classList.add("input-error");
  }

  if (!ingredientIsValid || !quantityIsValid) {
    return;
  }

  let fridge = JSON.parse(localStorage.getItem("fridge")) || [];
  fridge.push({ ingredient, quantity, unit, category });
  localStorage.setItem("fridge", JSON.stringify(fridge));

  form.reset();
  showFridge();
  showToast("Added to fridge");
  $("#unit").trigger("change");
});

function showFridge() {
  let fridge = JSON.parse(localStorage.getItem("fridge")) || [];
  let list = document.getElementById("fridge-list");
  list.innerHTML = "";

  let count = document.getElementById("fridge-count");
  if (fridge.length === 1) {
    count.textContent = "1 item in your fridge";
  } else {
    count.textContent = fridge.length + " items in your fridge";
  }

  let empty = document.getElementById("fridge-empty");
  empty.hidden = fridge.length > 0;
  $("#remove-all").prop("hidden", fridge.length === 0);
  if (fridge.length === 0) return;

  let categories = [
    "Fruit & veg",
    "Meat & fish",
    "Dairy & eggs",
    "Store cupboard",
    "Frozen",
    "Other",
  ];

  categories.forEach((category) => {
    let items = fridge.filter((item) => item.category === category);
    if (items.length === 0) return;

    let shelf = document.createElement("section");
    shelf.className = "shelf";
    shelf.innerHTML = "<h2></h2><ul></ul>";
    shelf.querySelector("h2").textContent = category;

    items.forEach((item) => {
      let $icon = $("<span>", {
        class: "icon-with-background item-icon",
        "aria-hidden": "true",
      }).html(categoryIcons[item.category] || categoryIcons.Other);

      let $info = $("<span>", { class: "item-info" }).append(
        $icon,
        document.createTextNode(
          capitalise(item.ingredient) +
            (formatAmount(item) ? " – " + formatAmount(item) : ""),
        ),
      );

      let li = $("<li>").append($info)[0];

      let removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.className = "secondary-button";
      removeButton.addEventListener("click", () => {
        fridge.splice(fridge.indexOf(item), 1);
        localStorage.setItem("fridge", JSON.stringify(fridge));
        showFridge();
        showToast("Removed from fridge");
      });

      li.appendChild(removeButton);
      shelf.querySelector("ul").appendChild(li);
    });

    list.appendChild(shelf);
  });
}

$("#remove-all").on("click", function () {
  let confirmed = confirm("Remove everything from your fridge?");
  if (!confirmed) return;

  localStorage.removeItem("fridge");
  showFridge();
  showToast("Fridge cleared");
});

showFridge();

document.addEventListener("DOMContentLoaded", () => {
  const dayElement = document.getElementById("day-of-week");
  if (dayElement) {
    dayElement.textContent = new Date().toLocaleDateString("en-GB", {
      weekday: "long",
    });
  }
});
