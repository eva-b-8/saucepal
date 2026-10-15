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

function formatExpiry(value) {
  // build the date from its parts so it isn't shifted by time zones
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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
    max: settings.max,
  });
});

let form = document.getElementById("add-form");
let toastTimer;

// stop past dates being chosen in the expiry picker
const expiryField = document.getElementById("expiry");

function todayAsInputValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

expiryField.min = todayAsInputValue();

function showToast(message) {
  let toast = document.getElementById("toast");
  toast.textContent = "";
  clearTimeout(toastTimer);

  // short delay so screen readers announce the message even if it repeats
  setTimeout(() => {
    toast.textContent = message;
    toast.classList.add("toast-visible");
    toastTimer = setTimeout(() => {
      toast.classList.remove("toast-visible");
    }, 4000);
  }, 50);
}

function showError(field, errorEl, message) {
  errorEl.textContent = message;
  errorEl.style.display = "block";
  field.classList.add("input-error");
  field.setAttribute("aria-invalid", "true");
}

function clearError(field, errorEl) {
  errorEl.textContent = "";
  errorEl.style.display = "none";
  field.classList.remove("input-error");
  field.removeAttribute("aria-invalid");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let formData = new FormData(form);
  let ingredient = formData.get("ingredient");
  let quantity = +formData.get("quantity");
  let unit = formData.get("unit");
  let category = formData.get("category");
  let expiry = formData.get("expiry");

  let ingredientField = document.getElementById("ingredient");
  let quantityField = document.getElementById("quantity");
  let ingredientError = document.getElementById("ingredientError");
  let quantityError = document.getElementById("quantityError");
  let expiryError = document.getElementById("expiryError");
  clearError(ingredientField, ingredientError);
  clearError(quantityField, quantityError);
  clearError(expiryField, expiryError);

  let ingredientIsValid = ingredient.trim().length > 2;
  if (!ingredientIsValid) {
    showError(
      ingredientField,
      ingredientError,
      "Ingredient name needs to be at least 3 characters long.",
    );
  }

  let min = unitSettings[unit].min;
  let max = unitSettings[unit].max;
  let quantityIsEmpty = formData.get("quantity") === "";
  let quantityIsValid = quantityIsEmpty || (quantity >= min && quantity <= max);
  if (!quantityIsValid) {
    showError(
      quantityField,
      quantityError,
      "The amount needs to be between " +
        min +
        " and " +
        max +
        " " +
        unit +
        ".",
    );
  }

  let expiryIsValid = expiry === "" || expiry >= expiryField.min;
  if (!expiryIsValid) {
    showError(
      expiryField,
      expiryError,
      "The expiry date can't be in the past.",
    );
  }

  // move focus to the first invalid field so its error is read out
  if (!ingredientIsValid) {
    ingredientField.focus();
    return;
  }
  if (!quantityIsValid) {
    quantityField.focus();
    return;
  }
  if (!expiryIsValid) {
    expiryField.focus();
    return;
  }

  let fridge = JSON.parse(localStorage.getItem("fridge")) || [];
  fridge.push({ ingredient, quantity, unit, category, expiry });
  localStorage.setItem("fridge", JSON.stringify(fridge));

  form.reset();
  showFridge();
  showToast("Added " + capitalise(ingredient) + " to fridge");
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

  let empty = document.getElementById("empty-state");
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
    shelf.innerHTML = "<h3></h3><ul></ul>";
    shelf.querySelector("h3").textContent = category;

    items.forEach((item) => {
      let name = capitalise(item.ingredient);

      let $icon = $("<span>", {
        class: "icon-with-background item-icon",
        "aria-hidden": "true",
      }).html(categoryIcons[item.category] || categoryIcons.Other);

      let $text = $("<span>", { class: "item-text" }).append(
        $("<span>", {
          class: "item-name",
          text: name + (formatAmount(item) ? " – " + formatAmount(item) : ""),
        }),
      );

      if (item.expiry) {
        $text.append(
          $("<span>", { class: "item-expiry" }).append(
            "Use by ",
            $("<time>", {
              datetime: item.expiry,
              text: formatExpiry(item.expiry),
            }),
          ),
        );
      }

      let $info = $("<span>", { class: "item-info" }).append($icon, $text);

      let li = $("<li>").append($info)[0];

      let actions = document.createElement("div");
      actions.className = "item-actions";

      let searchLink = document.createElement("a");
      searchLink.textContent = "Search recipes";
      searchLink.href = `recipes.html?ingredient=${encodeURIComponent(item.ingredient)}`;
      searchLink.className = "secondary-button";
      searchLink.setAttribute("aria-label", "Search recipes with " + name);

      let removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.textContent = "Remove";
      removeButton.className = "error-button";
      removeButton.setAttribute("aria-label", "Remove " + name);
      removeButton.addEventListener("click", () => {
        let buttons = [
          ...document.querySelectorAll("#fridge-list .error-button"),
        ];
        let position = buttons.indexOf(removeButton);

        fridge.splice(fridge.indexOf(item), 1);
        localStorage.setItem("fridge", JSON.stringify(fridge));
        showFridge();
        showToast("Removed " + name);

        // keep focus near where it was instead of losing it
        let remaining = document.querySelectorAll("#fridge-list .error-button");
        if (remaining.length > 0) {
          remaining[Math.min(position, remaining.length - 1)].focus();
        } else {
          document.getElementById("ingredient").focus();
        }
      });

      actions.append(searchLink, removeButton);
      li.appendChild(actions);

      shelf.querySelector("ul").appendChild(li);
    });

    list.appendChild(shelf);
  });
}

let removeAllDialog = document.getElementById("remove-all-dialog");

$("#remove-all").on("click", function () {
  removeAllDialog.showModal();
  document.getElementById("cancel-remove-all").focus();
});

$("#cancel-remove-all").on("click", function () {
  removeAllDialog.close();
});

$("#confirm-remove-all").on("click", function () {
  removeAllDialog.close();
  localStorage.removeItem("fridge");
  showFridge();
  showToast("Fridge cleared");
  document.getElementById("ingredient").focus();
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
