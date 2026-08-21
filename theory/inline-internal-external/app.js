/* Inline, Internal, External - renders the annotated code sections and reports reading progress. */
(function () {
  "use strict";

  const ACTIVITY_ID = "inline-internal-external";

  const dom = {
    readProgress: document.getElementById("readProgress"),
    lessonJump: document.getElementById("lessonJump"),
    methods: document.getElementById("methods"),
    ladder: document.getElementById("ladder"),
    chooseGrid: document.getElementById("chooseGrid"),
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
      const meta = Object.keys(m.meta)
        .map(function (k) {
          return "<div><dt>" + escapeHtml(k) + "</dt><dd>" + escapeHtml(m.meta[k]) + "</dd></div>";
        })
        .join("");

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

      const notes = m.notes
        .map(function (n) {
          return "<p>" + n + "</p>";
        })
        .join("");

      return (
        '<section class="method" id="' + m.id + '" style="--accent:' + m.accent + '">' +
        '<header class="method-head"><span class="method-num">' + m.number + "</span>" +
        "<div><h2>" + m.name + '</h2><p class="method-tagline">' + m.tagline + "</p></div></header>" +
        '<p class="method-lead">' + m.lead + "</p>" +
        '<dl class="method-meta">' + meta + "</dl>" +
        '<div class="method-code">' + code + "</div>" +
        '<div class="method-notes">' + notes + "</div>" +
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

  function renderChoosing() {
    const accents = {};
    CSS_METHODS.forEach(function (m) {
      accents[m.id] = m.accent;
    });
    dom.chooseGrid.innerHTML = CHOOSING.map(function (c) {
      return (
        '<div class="choose-card" style="--accent:' + (accents[c.id] || "var(--accent-primary)") + '">' +
        "<h3>" + escapeHtml(c.verdict) + "</h3><p>" + escapeHtml(c.when) + "</p></div>"
      );
    }).join("");
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
    renderLadder();
    renderChoosing();

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
