$(document).ready(function () {
  const url = window.location.search;
  const params = new URLSearchParams(url);
  let ingredient = params.get("ingredient");
  if (!ingredient) return;
  ingredient = ingredient.trim();
  console.log("searching for recipes with ", ingredient);

  // https://api.jquery.com/jQuery.getJSON/
  $.getJSON(
    `https://www.themealdb.com/api/json/v2/65232507/filter.php?i=${ingredient}`,
    function (data) {
      console.log(data);

      var items = [];
      $.each(data.meals, function (key, val) {
        const { strMeal, strMealThumb, idMeal, strArea } = val;
        console.log(val);

        items.push(
          `<a href="meal.html?id=${idMeal}">` +
            "<li class='meal' id='" +
            key +
            "'>" +
            `<img class="meal-image" src="${strMealThumb}"></img>` +
            `${strMeal} (${strArea} food)` +
            "</li>" +
            "</a>",
        );
      });

      $("<ul/>", {
        class: "my-new-list",
        html: items.join(""),
      }).appendTo("body");
    },
  );
});

$("#clear-search").click(function () {
  $("#text-search").val("");
});

$(document).ready(function () {
  let form = document.getElementById("search-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let formData = new FormData(form);
    let meal = formData.get("meal");
    console.log("searching fgo==", meal);
    if (meal.trim() === "") return;
    $("#my-search-list").empty();
    $.getJSON(
      `https://www.themealdb.com/api/json/v2/65232507/search.php?s=${meal}`,
      function (data) {
        console.log(data);

        var items = [];
        $.each(data.meals, function (key, val) {
          const { strMeal, strMealThumb, idMeal, strArea } = val;
          console.log(val);

          items.push(
            "<li class='meal' id='" +
              key +
              "'>" +
              `<img class="meal-image" src="${strMealThumb}"></img>` +
              `${strMeal} (${strArea} food)` +
              "</li>",
          );
        });

        $("<ul/>", {
          id: "my-search-list",
          class: "my-search-list",
          html: items.join(""),
        }).appendTo("body");
      },
    );
  });
});
