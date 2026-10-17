// handles search via ingredient query param

$(document).ready(function () {
  const url = window.location.search;
  const params = new URLSearchParams(url);
  let ingredient = params.get("ingredient");
  if (!ingredient) return;
  ingredient = ingredient.trim();
  console.log("searching for recipes with ", ingredient);
  searchByIngredientName(ingredient);
});

// handles search via category query param

$(document).ready(function () {
  const url = window.location.search;
  const params = new URLSearchParams(url);
  let category = params.get("category");
  if (!category) return;
  category = category.trim();
  console.log("searching for recipes with ", category);
  searchByCategory(category);
});

function renderRecipeList(data, term) {
  $(".section-title, .my-new-list, #category-list").remove();

  if (data.meals === null || data.meals.length === 0) {
    showNoResultsFound();
    $("#search-status").text("No recipes found for " + term);
    return;
  }
  resetEmptyState();
  var items = [];
  $.each(data.meals, function (key, val) {
    const { strMeal, strMealThumb, idMeal } = val;
    console.log(val);

    items.push(
      `
            <a href="meal.html?id=${idMeal}">
                <div class="meal" id="${key}">
                <div class="meal-image">
                    <img src="${strMealThumb}" alt=""/></div>
                    <h3>${strMeal}</h3>
                </div>
            </a>
            `,
    );
  });

  $("<h2/>", {
    class: "section-title",
    text: term + " recipes",
  }).appendTo(".category-wrapper");

  $("<div/>", {
    class: "my-new-list",
    html: items.join(""),
  }).appendTo(".category-wrapper");

  // announce the result to screen readers
  const count = data.meals.length;
  $("#search-status").text(
    count + (count === 1 ? " recipe" : " recipes") + " found for " + term,
  );
}

function searchByIngredientName(ingredient) {
  // https://api.jquery.com/jQuery.getJSON/
  $.getJSON(
    `https://www.themealdb.com/api/json/v2/65232507/filter.php?i=${encodeURIComponent(ingredient)}`,
    function (data) {
      console.log(data);
      renderRecipeList(data, ingredient);
      $("#text-search").val(ingredient);
    },
  );
}

function getRandomMealByIngredient(ingredient) {
  $.getJSON(
    `https://www.themealdb.com/api/json/v2/65232507/filter.php?i=${encodeURIComponent(ingredient)}`,
    function (data) {
      const resultCount = data.meals.length;
      const rand = Math.floor(Math.random() * resultCount);
      const meal = data.meals[rand];
      window.location.href = "meal.html?id=" + meal.idMeal;
    },
  );
}

function searchByCategory(category) {
  $.getJSON(
    `https://www.themealdb.com/api/json/v2/65232507/filter.php?c=${encodeURIComponent(category)}`,
    function (data) {
      console.log(data);
      renderRecipeList(data, category);
    },
  );
}

// fetches and renders all categories

$(document).ready(function () {
  const url = window.location.search;
  const params = new URLSearchParams(url);
  if (params.get("ingredient") || params.get("category")) {
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
  <a href="recipes.html?category=${encodeURIComponent(strCategory)}">
    <div class="category-card">
      <div class="category-image">
        <img src="${strCategoryThumb}" alt="" />
      </div>
      <h3>${strCategory}</h3>
    </div>
  </a>
            `,
        );
      });

      $("<h2/>", {
        class: "section-title",
        text: "Browse categories",
      }).appendTo(".category-wrapper");

      $("<div/>", {
        id: "category-list",
        class: "category-list",
        html: items.join(""),
      }).appendTo(".category-wrapper");
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
  $("#text-search").val("").focus();
});

// handles searching for search terms

$(document).ready(function () {
  let form = document.getElementById("search-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let formData = new FormData(form);
    let meal = formData.get("meal");
    let lucky = formData.get("lucky");
    if (meal.trim() === "") return;
    if (lucky === "Yes") {
      getRandomMealByIngredient(meal);
      return;
    }
    console.log("searching for", meal);

    searchByIngredientName(meal);
  });
});
