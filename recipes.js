// handles search via query param

$(document).ready(function () {
  const url = window.location.search;
  const params = new URLSearchParams(url);
  let ingredient = params.get("ingredient");
  if (!ingredient) return;
  ingredient = ingredient.trim();
  console.log("searching for recipes with ", ingredient);
  searchByIngredientName(ingredient);
});

function searchByIngredientName(ingredient) {
  // https://api.jquery.com/jQuery.getJSON/
  $.getJSON(
    `https://www.themealdb.com/api/json/v2/65232507/filter.php?i=${ingredient}`,
    function (data) {
      console.log(data);

      if (data.meals === null || data.meals.length === 0) {
        showNoResultsFound();
        $("#category-list").empty();
        return;
      }
      resetEmptyState();
      $(".my-new-list").empty();
      var items = [];
      $.each(data.meals, function (key, val) {
        const { strMeal, strMealThumb, idMeal, strArea } = val;
        console.log(val);

        items.push(
          `
            <a href="meal.html?id=${idMeal}">
                <div class="meal" id="${key}">
                    <img class="meal-image" src="${strMealThumb}"/>
                    ${strMeal}
                </div>
            </a>
            `,
        );
      });

      $("<div/>", {
        class: "my-new-list",
        html: items.join(""),
      }).appendTo("body");

      $("#text-search").val(ingredient);
      $("#category-list").empty();
    },
  );
}

// fetches and renders all categories

$(document).ready(function () {
  const url = window.location.search;
  const params = new URLSearchParams(url);
  let ingredient = params.get("ingredient");
  if (ingredient) {
    return;
  }

  $.getJSON(
    `https://www.themealdb.com/api/json/v2/65232507/categories.php`,
    function (data) {
      console.log(data);

      var items = [];
      $.each(data.categories, function (_, val) {
        const { strCategory, strCategoryThumb } = val;
        console.log(val);

        items.push(
          `
            <a href="recipes.html?ingredient=${strCategory}">
                <div class="category-card">
                    <img src="${strCategoryThumb}"/>
                    <h3>${strCategory}</h3>
                </div>
            </a>
            `,
        );
      });

      $("<div/>", {
        id: "category-list",
        class: "category-list",
        html: items.join(""),
      }).appendTo("body");
    },
  );
});

// function to show empty state

function showNoResultsFound() {
  $(".empty-state").removeAttr("hidden");
}

// https://stackoverflow.com/questions/5995628/adding-attribute-in-jquery

function resetEmptyState() {
  $(".empty-state").attr("hidden", true);
}

// handles clear search

$("#clear-search").click(function () {
  $("#text-search").val("");
});

// handles searching for search terms

$(document).ready(function () {
  let form = document.getElementById("search-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let formData = new FormData(form);
    let meal = formData.get("meal");
    console.log("searching for", meal);
    if (meal.trim() === "") return;
    $("#my-search-list").empty();
    searchByIngredientName(meal);
  });
});
