// apply the saved theme straight away, before the page draws, to avoid a flash
(function () {
  try {
    const saved = localStorage.getItem("theme");
    if (saved) document.documentElement.dataset.theme = saved;
  } catch (e) {}
})();

document.addEventListener("DOMContentLoaded", () => {
  // mobile menu
  const menuToggle = document.getElementById("menu-toggle");
  const menuLinks = document.getElementById("menu-links");

  if (menuToggle && menuLinks) {
    function setMenu(open) {
      menuToggle.setAttribute("aria-expanded", open);
      menuLinks.classList.toggle("is-open", open);
    }

    menuToggle.addEventListener("click", () => {
      setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    menuLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    // Esc closes the menu and returns focus to the button
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuLinks.classList.contains("is-open")) {
        setMenu(false);
        menuToggle.focus();
      }
    });
  }

  // theme toggle
  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) return;

  function currentTheme() {
    return (
      document.documentElement.dataset.theme ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    );
  }

  function updateToggle() {
    themeToggle.setAttribute("aria-checked", currentTheme() === "dark");
  }

  themeToggle.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
    updateToggle();
  });

  updateToggle();

  // enable the animation only after the starting position is set
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      themeToggle.classList.add("is-ready");
    });
  });
});
