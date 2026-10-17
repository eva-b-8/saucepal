function downloadPDF() {
  const mealNameEl = document.querySelector(".meal-name");
  const mealBodyEl = document.querySelector("#meal-body");

  const nameClone = mealNameEl.cloneNode(true);
  const bodyClone = mealBodyEl.cloneNode(true);

  // No images or scripts in the PDF
  [nameClone, bodyClone].forEach((el) =>
    el.querySelectorAll("img, picture, script").forEach((n) => n.remove()),
  );

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <base href="${location.origin}/">
</head>
<body>
  ${nameClone.outerHTML}
  ${bodyClone.outerHTML}
</body>
</html>`;

  const mealName = mealNameEl.textContent.trim();
  const filename =
    (mealName || document.title).replace(/[\\/:*?"<>|]/g, "") + ".pdf";

  $.ajax({
    url: "https://api.eu.apyhub.com/dosvak/html-to-pdf-render",
    method: "POST",
    contentType: "application/json",
    headers: {
      "apy-token":
        "0dcb55caab4edd81e833ba0df5863c1b7b626b35768c5e6f89494f1fd04e9fbc",
    },
    data: JSON.stringify({ html }),
    xhrFields: { responseType: "blob" },
  })
    .done(function (blob) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    })
    .fail(function (xhr, status, err) {
      console.error("PDF request failed:", xhr.status, status, err);
    });
}

function mapIngredients(meal) {
  const items = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== "") {
      items.push({
        ingredient: ingredient.trim(),
        measure: measure ? measure.trim() : "",
      });
    }
  }

  return items;
}

$(document).ready(function () {
  const url = window.location.search;
  const params = new URLSearchParams(url);
  let mealID = params.get("id");
  if (!mealID) return;
  mealID = mealID.trim();
  console.log("searching for recipes with ", mealID);

  // https://api.jquery.com/jQuery.getJSON/
  $.getJSON(
    `https://www.themealdb.com/api/json/v2/65232507/lookup.php?i=${mealID}`,
    function (data) {
      console.log(data);

      $.each(data.meals, function (key, val) {
        const { strMeal, strMealThumb, strInstructions, strYoutube } = val;
        console.log(val);
        $("#meal-name").text(strMeal);

        const youtubeVideoId = strYoutube ? strYoutube.split("=")[1] : "";

        const videoHtml = youtubeVideoId
          ? `<iframe width="560" height="315" src="https://www.youtube.com/embed/${youtubeVideoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
          : "";

        const ingredients = mapIngredients(val);
        console.log(ingredients);

        let ingredientHtml = "";

        ingredients.forEach(
          ({ ingredient, measure }) =>
            (ingredientHtml += `
              <li class="recipe-ingredient">
                <img src="https://www.themealdb.com/images/ingredients/${encodeURIComponent(ingredient)}.png" alt="" />
                <span class="ingredient-name">${ingredient.toLowerCase()}</span>
                <span class="ingredient-measure">${measure.toLowerCase()}</span>
              </li>
            `),
        );

        $("#meal-header").html(`
          <div class="recipe-header">
            <div class="meal-main-photo">
              <img src="${strMealThumb}" alt="" />
            </div>
            <div class="recipe-header-content">
              <h1 class="meal-name">${strMeal}</h1>
              <button onclick="downloadPDF()" class="secondary-button">Download the recipe PDF</button>
              ${videoHtml}
            </div>
          </div>
        `);

        $("#meal-body").html(`
          <section class="recipe-card">
            <h2>Ingredients</h2>
            <ul class="ingredient-list">
              ${ingredientHtml}
            </ul>
          </section>
          <section class="recipe-card">
            <h2>Instructions</h2>
            <p class="recipe">${strInstructions}</p>
          </section>
        `);
        // https://stackoverflow.com/questions/413439/how-to-dynamically-change-a-web-pages-title
        document.title = `${strMeal} - Saucepal`;
      });
    },
  );
});
