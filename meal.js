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

      var items = [];
      $.each(data.meals, function (key, val) {
        const {
          strMeal,
          strMealThumb,
          idMeal,
          strArea,
          strInstructions,
          strYoutube,
        } = val;
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
                <div class="recipe-ingredient">
                <img src="https://www.themealdb.com/images/ingredients/${ingredient}.png"/>
                <div class="ingredient-row"> ${ingredient.toLowerCase()} - ${measure.toLowerCase()}</div>
                </div>
                `),
        );

        items.push(
          `
            <div class="meal-main" id="${key}">
               <div class="recipe-header">
                <img class="meal-main-photo" src="${strMealThumb}"/>
                <div>
                <div>
                <h1 class="meal-name-handwritten">${strMeal}</h1>
                ${videoHtml}
                </div>
                </div>
               </div>
               <h3>Ingredients</h3>
                <div class="ingredient-list">
                ${ingredientHtml}
                </div>
                <div>
                    <h3>Instructions</h3>
                    <p class="recipe">${strInstructions}</p>
                </div>
            </div>
            `,
        );
      });

      $("<div/>", {
        class: "meal-body",
        html: items.join(""),
      }).appendTo(".page-wrapper");
    },
  );
});
