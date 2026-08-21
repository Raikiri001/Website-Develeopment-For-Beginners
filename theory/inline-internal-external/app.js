/* Inline, Internal, External - renders the annotated code sections and reports reading progress. */
(function () {
  "use strict";

  const ACTIVITY_ID = "inline-internal-external";

  const dom = {
    readProgress: document.getElementById("readProgress"),
    lessonJump: document.getElementById("lessonJump"),
    methods: document.getElementById("methods"),
    ladder: document.getElementById("ladder"),
    playgroundControls: document.getElementById("playgroundControls"),
    playgroundPreview: document.getElementById("playgroundPreview"),
    playgroundRanking: document.getElementById("playgroundRanking"),
    comparison: document.getElementById("comparison"),
  };

  function escapeHtml(str) {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return String(str).replace(/[&<>"']/g, (c) => map[c]);
  }

  /** Pull comments out before the other passes, then put them back highlighted. */
  function protectComments(text, pattern, store) {
    return text.replace(pattern, (m) => {
      store.push(m);
      return "@@C" + (store.length - 1) + "@@";
    });
  }

  function restoreComments(text, store) {
    return text.replace(/@@C(\d+)@@/g, (m, i) => {
      return '<span class="comment">' + store[Number(i)] + "</span>";
    });
  }

  /* The comments carry half the teaching here, so they are protected from
     the tag pass rather than being re-matched as markup. */
  function highlightHtml(source) {
    const store = [];
    let out = protectComments(escapeHtml(source), /&lt;!--[\s\S]*?--&gt;/g, store);

    out = out.replace(
      /(&lt;\/?)([\w-]+)((?:\s+[\w-]+(?:=&quot;[^&]*?&quot;)?)*\s*\/?)(&gt;)/g,
      function (match, open, tag, attrs, close) {
        let html = '<span class="tag">' + open + tag + "</span>";
        if (attrs) {
          html += attrs.replace(
            /([\w-]+)(=)(&quot;)([\s\S]*?)(&quot;)/g,
            '<span class="attr">$1</span>$2<span class="string">$3$4$5</span>'
          );
        }
        return html + '<span class="tag">' + close + "</span>";
      }
    );

    return restoreComments(out, store);
  }

  function highlightCss(source) {
    const store = [];
    let out = protectComments(escapeHtml(source), /\/\*[\s\S]*?\*\//g, store);

    out = out
      .replace(/^([^\n{}]+)(\{)/gm, '<span class="keyword">$1</span>$2')
      .replace(
        /^(\s*)([\w-]+)(\s*:\s*)([^;\n]+)(;)/gm,
        '$1<span class="attr">$2</span>$3<span class="string">$4</span>$5'
      );

    return restoreComments(out, store);
  }

  function highlight(code, lang) {
    return lang === "css" ? highlightCss(code) : highlightHtml(code);
  }

  // ── Rendering ────────────────────────────────────────
  function renderJump() {
    dom.lessonJump.innerHTML = CSS_METHODS.map(function (m) {
      return (
        '<a href="#' + m.id + '" style="--accent:' + m.accent + '">' +
        '<span class="jump-num">' + m.number + "</span>" +
        "<span>" + m.name + "</span></a>"
      );
    }).join("");
  }

  function renderMethods() {
    dom.methods.innerHTML = CSS_METHODS.map(function (m) {
      // Fixed order, so the same question sits in the same place in all three.
      const meta = META_KEYS.map(function (k) {
        return "<div><dt>" + escapeHtml(k) + "</dt><dd>" + escapeHtml(m.meta[k]) + "</dd></div>";
      }).join("");

      const code = m.blocks
        .map(function (b) {
          return (
            '<figure class="code-figure"><figcaption>' +
            '<span class="file-dot"></span>' + escapeHtml(b.label) +
            '<span class="file-lang">' + b.lang.toUpperCase() + "</span>" +
            '</figcaption><pre class="code-block"><code>' +
            highlight(b.code, b.lang) +
            "</code></pre></figure>"
          );
        })
        .join("");

      // Same three questions, same order, labelled so they can be read across.
      const notes = NOTE_LABELS.map(function (label) {
        return (
          '<p><strong class="note-label">' + escapeHtml(label) + ".</strong> " +
          m.notes[label] + "</p>"
        );
      }).join("");

      return (
        '<section class="method" id="' + m.id + '" style="--accent:' + m.accent + '">' +
        '<header class="method-head"><span class="method-num">' + m.number + "</span>" +
        "<div><h2>" + m.name + '</h2><p class="method-tagline">' + m.tagline + "</p></div></header>" +
        '<p class="method-lead">' + m.lead + "</p>" +
        '<dl class="method-meta">' + meta + "</dl>" +
        '<div class="method-code">' + code + "</div>" +
        '<div class="method-notes">' + notes + "</div>" +
        '<div class="tryit" data-method="' + m.id + '"></div>' +
        "</section>"
      );
    }).join("");
  }

  function renderLadder() {
    dom.ladder.innerHTML = CASCADE_ORDER.map(function (step) {
      return (
        '<li class="ladder-step"><span class="ladder-rank">' + step.rank + "</span>" +
        '<div class="ladder-body"><h3>' + step.title + "</h3><p>" + step.body + "</p>" +
        '<pre class="ladder-code"><code>' + escapeHtml(step.code) + "</code></pre></div></li>"
      );
    }).join("");
  }

  // ── Live demo under each method ──────────────────────
  const DEMO_BASE =
    ":host { display: block; }" +
    "h1 { font-size: 19px; margin: 0 0 6px; font-family: inherit; }" +
    "h1:last-child { margin-bottom: 0; }";

  /** One mini page as its own shadow root, so its CSS cannot leak into the other. */
  function makePage(box, headings) {
    const root = box.attachShadow({ mode: "open" });
    const base = document.createElement("style");
    base.textContent = DEMO_BASE;
    root.appendChild(base);
    const sheet = document.createElement("style");
    root.appendChild(sheet);
    headings.forEach(function (text, i) {
      const h = document.createElement("h1");
      h.className = "title";
      if (i === 0) h.id = "headline";
      h.textContent = text;
      root.appendChild(h);
    });
    return { root: root, sheet: sheet };
  }

  /* Every method gets the identical demo: the same editor, the same two
     pages, the same two headings each. Only the result differs, which is
     what makes the three comparable. */
  function buildDemos() {
    CSS_METHODS.forEach(function (m) {
      const demo = METHOD_DEMOS[m.id];
      const host = dom.methods.querySelector('.tryit[data-method="' + m.id + '"]');
      if (!demo || !host) return;

      host.innerHTML =
        '<div class="tryit-head"><span class="tryit-label">Try it</span>' +
        '<span class="tryit-hint">Edit the CSS and watch how far it reaches</span></div>' +
        '<div class="tryit-grid"><div class="tryit-editor">' +
        '<div class="tryit-editor-label">' + escapeHtml(demo.editorLabel) + "</div>" +
        '<textarea data-role="editor" spellcheck="false" aria-label="Editable CSS"></textarea>' +
        "</div>" +
        '<div class="tryit-pages">' +
        DEMO_PAGES.map(function (pg, i) {
          return (
            '<div class="demo-page"><div class="demo-page-label">' +
            escapeHtml(pg.file) + "</div>" +
            '<div class="demo-page-body" data-role="page" data-index="' + i + '"></div></div>'
          );
        }).join("") +
        "</div></div>" +
        '<p class="tryit-note"><strong>Result:</strong> ' + escapeHtml(demo.result) + "</p>";

      const editor = host.querySelector('[data-role="editor"]');
      editor.value = demo.value;

      const pages = Array.prototype.slice
        .call(host.querySelectorAll('[data-role="page"]'))
        .map(function (box, i) {
          return makePage(box, DEMO_PAGES[i].headings);
        });

      function paint() {
        const text = editor.value;
        pages.forEach(function (page, i) {
          // external reaches both pages, internal only the first, inline neither.
          page.sheet.textContent = demo.mode === "external" || (demo.mode === "internal" && i === 0)
            ? text
            : "";
          const first = page.root.querySelector(".title");
          if (first) first.setAttribute("style", demo.mode === "inline" && i === 0 ? text : "");
        });
      }

      editor.addEventListener("input", paint);
      paint();
    });
  }

  // ── Side by side ─────────────────────────────────────
  function renderComparison() {
    const names = {};
    CSS_METHODS.forEach(function (m) {
      names[m.id] = { name: m.name, accent: m.accent };
    });

    const head =
      "<thead><tr><th></th>" +
      COMPARISON.columns
        .map(function (id) {
          return '<th style="--accent:' + names[id].accent + '">' + escapeHtml(names[id].name) + "</th>";
        })
        .join("") +
      "</tr></thead>";

    const body =
      "<tbody>" +
      COMPARISON.rows
        .map(function (row) {
          return (
            "<tr><th scope=\"row\">" + escapeHtml(row.label) + "</th>" +
            row.values
              .map(function (v) {
                return "<td>" + escapeHtml(v) + "</td>";
              })
              .join("") +
            "</tr>"
          );
        })
        .join("") +
      "</tbody>";

    dom.comparison.innerHTML = head + body;
  }

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
      dom.playgroundControls.querySelectorAll(".pg-row")
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
      dom.playgroundControls.querySelectorAll(".pg-row")
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

    const inlineRow = dom.playgroundControls.querySelector('.pg-row[data-id="inline"]');
    const heading = playgroundPreview.root.querySelector(".title");
    if (heading) {
      const on = inlineRow.querySelector('[data-role="on"]').checked;
      const bang = inlineRow.querySelector('[data-role="important"]').checked ? " !important" : "";
      heading.setAttribute(
        "style",
        on ? "color: " + inlineRow.querySelector('[data-role="value"]').value + bang + ";" : ""
      );
    }

    dom.playgroundRanking.innerHTML = ranked.length
      ? ranked
          .map(function (e, i) {
            return (
              '<li class="pg-rank' + (i === 0 ? " is-winner" : "") + '">' +
              '<span class="pg-swatch" style="background:' + escapeHtml(e.value) + '"></span>' +
              '<div class="pg-rank-main"><span class="pg-rank-origin">' + escapeHtml(e.label) + "</span>" +
              '<code>' + escapeHtml(e.selector) + " &rarr; " + escapeHtml(e.value) +
              (e.important ? " !important" : "") + "</code></div>" +
              '<span class="pg-verdict">' + (i === 0 ? "WINS" : "overridden") + "</span></li>"
            );
          })
          .join("")
      : '<li class="pg-empty">Nothing is switched on, so the heading keeps the browser default.</li>';
  }

  function buildPlayground() {
    dom.playgroundControls.innerHTML = PLAYGROUND.sources
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
          '<div class="pg-row" data-id="' + src.id + '" data-label="' + escapeHtml(src.label) + '">' +
          '<label class="pg-on"><input type="checkbox" data-role="on"' +
          (src.on ? " checked" : "") + ' aria-label="Use this one" /></label>' +
          '<span class="pg-label">' + escapeHtml(src.label) + "</span>" +
          selector +
          '<input type="color" data-role="value" value="' + src.value + '" aria-label="Colour" />' +
          '<label class="pg-imp"><input type="checkbox" data-role="important"' +
          (src.important ? " checked" : "") + " /><span>!important</span></label>" +
          "</div>"
        );
      })
      .join("");

    // One heading here, since this section is about which rule wins on it.
    playgroundPreview = makePage(dom.playgroundPreview, ["Sunrise Bakery"]);

    dom.playgroundControls.addEventListener("change", refreshPlayground);
    dom.playgroundControls.addEventListener("input", refreshPlayground);
    refreshPlayground();
  }

  // ── Reading progress ─────────────────────────────────
  /** How far down the page the reader has got, as a whole percentage. */
  function readPercent() {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return 100;
    return Math.max(0, Math.min(100, Math.round((window.scrollY / scrollable) * 100)));
  }

  let reported = 0;

  function updateProgress() {
    const pct = readPercent();
    dom.readProgress.style.width = pct + "%";
    // Only ever report forwards, so scrolling back up cannot undo progress.
    if (pct > reported) {
      reported = pct;
      if (window.WDFBProgress) window.WDFBProgress.setPercent(ACTIVITY_ID, pct);
    }
  }

  function init() {
    if (window.WDFBProgress) window.WDFBProgress.markViewed(ACTIVITY_ID);

    renderJump();
    renderMethods();
    buildDemos();
    renderComparison();
    renderLadder();
    buildPlayground();

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
