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

        const youtubeVideoId = strYoutube.split("=")[1];

        items.push(
          "<li class='meal' id='" +
            key +
            "'>" +
            `<img class="meal-image" src="${strMealThumb}"></img>` +
            `<iframe width="560" height="315" src="https://www.youtube.com/embed/${youtubeVideoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>` +
            `${strMeal} (${strArea} food)` +
            `<p>${strInstructions}</p>` +
            "</li>",
        );
      });

      $("<ul/>", {
        class: "my-new-list",
        html: items.join(""),
      }).appendTo("body");
    },
  );
});
