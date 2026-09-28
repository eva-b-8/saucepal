let form = document.getElementById("add-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let formData = new FormData(event.currentTarget);
  let ingredient = formData.get("ingredient");
  let quantity = +formData.get("quantity");
  let category = formData.get("category");
  let barcode = formData.get("barcode");
  console.log({ ingredient, quantity, category, barcode });

  let ingredientIsValid = ingredient.trim().length > 2;
  if (!ingredientIsValid) {
    let ingredientError = document.getElementById("ingredientError");
    ingredientError.style.display = "block";
    ingredientError.innerHTML =
      "Ingredient name needs to be at least 3 characters long.";
    let ingredientField = document.getElementById("ingredient");
    let classes = ingredientField.classList;
    classes.toggle("input-error");
  }

  let quantityIsValid = quantity >= 0 && quantity <= 50;
  if (!quantityIsValid) {
    let quantityError = document.getElementById("quantityError");
    quantityError.style.display = "block";
    quantityError.innerHTML = "The weight needs to be between 0.1 and 50 kg.";
    let quantityField = document.getElementById("quantity");
    let classes = quantityField.classList;
    classes.toggle("input-error");
  }

  let barcodeIsValid =
    barcode.length === 8 || barcode.length === 13 || barcode.length === 0;
  if (!barcodeIsValid) {
    let barcodeError = document.getElementById("barcodeError");
    barcodeError.style.display = "block";
    barcodeError.innerHTML = "The barcode needs to be 8 or 13 digits.";
    let barcodeField = document.getElementById("barcode");
    let classes = barcodeField.classList;
    classes.toggle("input-error");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const dayElement = document.getElementById("day-of-week");
  if (dayElement) {
    dayElement.textContent = new Date().toLocaleDateString("en-GB", {
      weekday: "long",
    });
  }
});

function myMove() {
  const elem = document.getElementById("animate");
  const box = elem.parentNode;

  const startX = 0;
  const startY = box.clientHeight - elem.offsetHeight;
  const endX = (box.clientWidth - elem.offsetWidth) / 2;
  const endY = (box.clientHeight - elem.offsetHeight) / 2;

  const totalSteps = 300;
  let step = 0;
  elem.style.display = "block";
  const id = setInterval(frame, 5);

  function frame() {
    step++;
    const progress = step / totalSteps;
    elem.style.left = startX + (endX - startX) * progress + "px";
    elem.style.top = startY + (endY - startY) * progress + "px";
    if (step >= totalSteps) {
      clearInterval(id);
    }
  }
}
