/* The cascade playground: bespoke to this lesson, so it lives here rather than in the shared renderer. */
(function () {
  "use strict";

  const els = {
    controls: document.getElementById("playgroundControls"),
    preview: document.getElementById("playgroundPreview"),
    ranking: document.getElementById("playgroundRanking"),
  };

  // ── Cascade playground ───────────────────────────────
  /** Rough CSS specificity as [ids, classes, types]. */
  function specificity(selector) {
    const ids = (selector.match(/#[\w-]+/g) || []).length;
    const classes = (selector.match(/\.[\w-]+/g) || []).length;
    const types = (selector.replace(/[#.][\w-]+/g, " ").match(/[a-zA-Z][\w-]*/g) || []).length;
    return [ids, classes, types];
  }

  /** Read the controls and rank every declaration, strongest first. */
  function rankSources() {
    const rows = Array.prototype.slice.call(
      els.controls.querySelectorAll(".pg-row")
    );
    const entries = [];

    rows.forEach(function (row, i) {
      if (!row.querySelector('[data-role="on"]').checked) return;
      const id = row.dataset.id;
      const value = row.querySelector('[data-role="value"]').value;
      const important = row.querySelector('[data-role="important"]').checked;
      const selectorEl = row.querySelector('[data-role="selector"]');
      const selector = selectorEl ? selectorEl.value : "style attribute";
      const spec = selectorEl ? specificity(selector) : [0, 0, 0];
      entries.push({
        id: id,
        label: row.dataset.label,
        selector: selector,
        value: value,
        important: important,
        weight: selectorEl ? [0, spec[0], spec[1], spec[2]] : [1, 0, 0, 0],
        order: i,
      });
    });

    return entries.sort(function (a, b) {
      if (a.important !== b.important) return a.important ? -1 : 1;
      for (let i = 0; i < 4; i++) {
        if (a.weight[i] !== b.weight[i]) return b.weight[i] - a.weight[i];
      }
      return b.order - a.order;
    });
  }

  let playgroundPreview = null;

  function refreshPlayground() {
    const ranked = rankSources();

    // Feed the browser the real CSS, so the preview is not a simulation.
    const rows = Array.prototype.slice.call(
      els.controls.querySelectorAll(".pg-row")
    );
    let css = "";
    rows.forEach(function (row) {
      if (row.dataset.id === "inline") return;
      if (!row.querySelector('[data-role="on"]').checked) return;
      const selector = row.querySelector('[data-role="selector"]').value;
      const value = row.querySelector('[data-role="value"]').value;
      const bang = row.querySelector('[data-role="important"]').checked ? " !important" : "";
      css += selector + " { color: " + value + bang + "; }\n";
    });
    playgroundPreview.sheet.textContent = css;

    const inlineRow = els.controls.querySelector('.pg-row[data-id="inline"]');
    const heading = playgroundPreview.root.querySelector(".title");
    if (heading) {
      const on = inlineRow.querySelector('[data-role="on"]').checked;
      const bang = inlineRow.querySelector('[data-role="important"]').checked ? " !important" : "";
      heading.setAttribute(
        "style",
        on ? "color: " + inlineRow.querySelector('[data-role="value"]').value + bang + ";" : ""
      );
    }

    els.ranking.innerHTML = ranked.length
      ? ranked
          .map(function (e, i) {
            return (
              '<li class="pg-rank' + (i === 0 ? " is-winner" : "") + '">' +
              '<span class="pg-swatch" style="background:' + LessonKit.escapeHtml(e.value) + '"></span>' +
              '<div class="pg-rank-main"><span class="pg-rank-origin">' + LessonKit.escapeHtml(e.label) + "</span>" +
              '<code>' + LessonKit.escapeHtml(e.selector) + " &rarr; " + LessonKit.escapeHtml(e.value) +
              (e.important ? " !important" : "") + "</code></div>" +
              '<span class="pg-verdict">' + (i === 0 ? "WINS" : "overridden") + "</span></li>"
            );
          })
          .join("")
      : '<li class="pg-empty">Nothing is switched on, so the heading keeps the browser default.</li>';
  }

  function buildPlayground() {
    els.controls.innerHTML = PLAYGROUND.sources
      .map(function (src) {
        const selector =
          src.id === "inline"
            ? '<span class="pg-fixed">no selector</span>'
            : '<select data-role="selector" aria-label="Selector">' +
              PLAYGROUND.selectors
                .map(function (sel) {
                  return (
                    '<option value="' + sel + '"' +
                    (sel === src.selector ? " selected" : "") +
                    ">" + sel + "</option>"
                  );
                })
                .join("") +
              "</select>";

        return (
          '<div class="pg-row" data-id="' + src.id + '" data-label="' + LessonKit.escapeHtml(src.label) + '">' +
          '<label class="pg-on"><input type="checkbox" data-role="on"' +
          (src.on ? " checked" : "") + ' aria-label="Use this one" /></label>' +
          '<span class="pg-label">' + LessonKit.escapeHtml(src.label) + "</span>" +
          selector +
          '<input type="color" data-role="value" value="' + src.value + '" aria-label="Colour" />' +
          '<label class="pg-imp"><input type="checkbox" data-role="important"' +
          (src.important ? " checked" : "") + " /><span>!important</span></label>" +
          "</div>"
        );
      })
      .join("");

    // One heading here, since this section is about which rule wins on it.
    playgroundPreview = LessonKit.makePane(els.preview, '<h1 class="title" id="headline">Sunrise Bakery</h1>');

    els.controls.addEventListener("change", refreshPlayground);
    els.controls.addEventListener("input", refreshPlayground);
    refreshPlayground();
  }


  function start() {
    if (els.controls && !els.controls.children.length) buildPlayground();
  }

  // The shared renderer calls this once the lesson is on the page. The direct
  // call covers the case where it had already finished before this script ran.
  window.onLessonReady = start;
  if (document.getElementById("sections") && document.getElementById("sections").children.length) {
    start();
  }
})();
