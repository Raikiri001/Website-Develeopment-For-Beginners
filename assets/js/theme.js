/* Light or dark, chosen by the reader and remembered, defaulting to their system setting. */
(function () {
  "use strict";

  const KEY = "wdfb-theme";
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  function chosen() {
    try {
      const value = localStorage.getItem(KEY);
      return value === "light" || value === "dark" ? value : null;
    } catch (error) {
      return null;
    }
  }

  function remember(theme) {
    try {
      localStorage.setItem(KEY, theme);
    } catch (error) {
      /* A browser with storage blocked still switches, it just forgets. */
    }
  }

  function current() {
    return chosen() || (media.matches ? "dark" : "light");
  }

  /* Runs before the page is painted, so the right theme is the first one drawn. */
  function apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  apply(current());

  // Anyone who has not chosen follows their system, including when it changes.
  media.addEventListener("change", function () {
    if (!chosen()) apply(current());
  });

  function label(theme) {
    return theme === "dark" ? "Light" : "Dark";
  }

  function icon(theme) {
    return theme === "dark" ? "☀" : "☾";
  }

  function describe(theme) {
    return "Switch to " + (theme === "dark" ? "light" : "dark") + " mode";
  }

  /* The header is copied into every page, so the button is added to it here
     rather than being pasted into twenty files that would then drift apart. */
  function build() {
    const nav = document.querySelector(".site-header nav");
    if (!nav || nav.querySelector(".theme-toggle")) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-toggle";

    const glyph = document.createElement("span");
    glyph.className = "theme-toggle-icon";
    glyph.setAttribute("aria-hidden", "true");

    const text = document.createElement("span");
    text.className = "theme-toggle-label";

    button.appendChild(glyph);
    button.appendChild(text);

    function show() {
      const theme = current();
      glyph.textContent = icon(theme);
      text.textContent = label(theme);
      button.setAttribute("aria-label", describe(theme));
      button.title = describe(theme);
    }

    button.addEventListener("click", function () {
      const next = current() === "dark" ? "light" : "dark";
      remember(next);
      apply(next);
      show();
    });

    show();
    nav.appendChild(button);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
