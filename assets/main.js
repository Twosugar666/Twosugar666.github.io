// Theme toggle with localStorage persistence
(function () {
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");
  if (saved) {
    root.setAttribute("data-theme", saved);
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    root.setAttribute("data-theme", "dark");
  }

  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }
})();

// Blog 收藏夹筛选
(function () {
  const chips = document.querySelectorAll(".blog-filters .chip");
  if (!chips.length) return;
  const items = document.querySelectorAll(".post-list li");
  const hint = document.querySelector(".empty-hint");

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("active"); });
      chip.classList.add("active");
      const f = chip.getAttribute("data-filter");
      let visible = 0;
      items.forEach(function (li) {
        const cats = (li.getAttribute("data-cat") || "").split(/\s+/);
        const show = f === "all" || cats.indexOf(f) !== -1;
        li.classList.toggle("hidden", !show);
        if (show) visible++;
      });
      if (hint) hint.hidden = visible !== 0;
    });
  });
})();
