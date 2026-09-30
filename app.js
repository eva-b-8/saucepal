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

  let quantityIsValid = quantity >= 0 && quantity <= 50;
  if (!quantityIsValid) {
    quantityError.style.display = "block";
    quantityError.textContent = "The weight needs to be between 0.1 and 50 kg.";
    quantityField.classList.add("input-error");
  }

  if (!ingredientIsValid || !quantityIsValid) {
    return;
  }

  let fridge = JSON.parse(localStorage.getItem("fridge")) || [];
  fridge.push({ ingredient, quantity, category });
  localStorage.setItem("fridge", JSON.stringify(fridge));

  form.reset();
  showFridge();
  showToast("Added to fridge");
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
      let li = document.createElement("li");
      li.textContent = item.ingredient + " – " + item.quantity + " kg";

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

showFridge();

document.addEventListener("DOMContentLoaded", () => {
  const dayElement = document.getElementById("day-of-week");
  if (dayElement) {
    dayElement.textContent = new Date().toLocaleDateString("en-GB", {
      weekday: "long",
    });
  }
});
