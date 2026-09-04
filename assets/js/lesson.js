/* Shared renderer for theory lessons. Each page supplies a global LESSON object in its own content.js; this builds the page from it. */
(function () {
  "use strict";

  function escapeHtml(str) {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return String(str).replace(/[&<>"']/g, function (c) {
      return map[c];
    });
  }

  /** Pull comments out before the other passes, then put them back highlighted. */
  function protectComments(text, pattern, store) {
    return text.replace(pattern, function (m) {
      store.push(m);
      return "@@C" + (store.length - 1) + "@@";
    });
  }

  function restoreComments(text, store) {
    return text.replace(/@@C(\d+)@@/g, function (m, i) {
      return '<span class="comment">' + store[Number(i)] + "</span>";
    });
  }

  /* Comments carry half the teaching, so they are protected from the tag pass rather than re-matched as markup. */
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
  /* A contents rail listing every section, with its notes nested underneath.
     Only the section being read is expanded; the rest stay collapsed and
     dimmed, so the rail says where you are rather than just where you could
     go. Hovering a collapsed section previews it without moving the page. */
  function buildToc(host, lesson) {
    if (!host) return;

    const extra = Array.prototype.slice
      .call(document.querySelectorAll("main .section-head h2"))
      .map(function (h) {
        const section = h.closest("section");
        if (section && !section.id) section.id = "section-" + Math.random().toString(36).slice(2, 7);
        return { id: section ? section.id : "", name: h.textContent, number: "", subs: [] };
      });

    const items = lesson.sections
      .map(function (s) {
        return {
          id: s.id,
          name: s.name,
          number: s.number,
          accent: s.accent,
          subs: lesson.noteLabels.map(function (label, i) {
            return { id: s.id + "-note-" + i, name: label };
          }),
        };
      })
      .concat(extra);

    host.innerHTML =
      '<p class="toc-title">On this page</p>' +
      '<ul class="toc-list">' +
      items
        .map(function (it) {
          /* The list is wrapped so the collapsing grid has exactly one child.
             Applied straight to the <ul>, `grid-template-rows: 0fr` would
             only size the first row and every other item would still show. */
          const subs = it.subs.length
            ? '<div class="toc-subs-wrap"><ul class="toc-subs">' +
              it.subs
                .map(function (sub) {
                  return '<li><a href="#' + sub.id + '">' + escapeHtml(sub.name) + "</a></li>";
                })
                .join("") +
              "</ul></div>"
            : "";
          return (
            '<li class="toc-item" data-target="' + it.id + '"' +
            (it.accent ? ' style="--accent:' + it.accent + '"' : "") + ">" +
            '<a class="toc-link" href="#' + it.id + '">' +
            (it.number ? '<span class="toc-num">' + it.number + "</span>" : "") +
            "<span>" + escapeHtml(it.name) + "</span></a>" +
            subs +
            "</li>"
          );
        })
        .join("") +
      "</ul>";

    trackScroll(host, items);
  }

  /* Marks whichever section currently owns the top of the viewport. */
  function trackScroll(host, items) {
    const entries = items
      .map(function (it) {
        return { el: document.getElementById(it.id), li: host.querySelector('[data-target="' + it.id + '"]') };
      })
      .filter(function (e) {
        return e.el && e.li;
      });
    if (!entries.length) return;

    let current = null;

    function update() {
      const line = window.scrollY + window.innerHeight * 0.25;
      let active = entries[0];
      entries.forEach(function (e) {
        if (e.el.offsetTop <= line) active = e;
      });
      if (active === current) return;
      current = active;
      entries.forEach(function (e) {
        e.li.classList.toggle("is-current", e === active);
      });
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  /* One specimen, taken apart. Parts nest, and each one names the reference
     table row it belongs to. */
  function anatomyParts(parts) {
    return parts
      .map(function (p) {
        const inner = p.parts ? anatomyParts(p.parts) : escapeHtml(p.text);
        if (!p.ref && !p.tone) return inner;
        const cls =
          (p.ref ? "anatomy-part" : "") + (p.tone ? (p.ref ? " " : "") + p.tone : "");
        return (
          '<span class="' + cls + '"' +
          (p.ref ? ' data-ref="' + escapeHtml(p.ref) + '"' : "") +
          ">" + inner + "</span>"
        );
      })
      .join("");
  }

  function renderSections(host, lesson) {
    host.innerHTML = lesson.sections
      .map(function (s) {
        // Fixed order, so the same question sits in the same place in every section.
        const meta = lesson.metaKeys
          .map(function (k) {
            return "<div><dt>" + escapeHtml(k) + "</dt><dd>" + escapeHtml(s.meta[k]) + "</dd></div>";
          })
          .join("");

        const code = (s.blocks || [])
          .map(function (b) {
            return (
              '<figure class="code-figure"><figcaption><span class="file-dot"></span>' +
              escapeHtml(b.label) +
              '<span class="file-lang">' + b.lang.toUpperCase() + "</span></figcaption>" +
              '<pre class="code-block"><code>' + highlight(b.code, b.lang) + "</code></pre></figure>"
            );
          })
          .join("");

        // Same questions, same order, labelled so they can be read across.
        const notes = lesson.noteLabels
          .map(function (label, i) {
            return (
              '<p class="note" id="' + s.id + "-note-" + i + '">' +
              '<strong class="note-label">' + escapeHtml(label) + ".</strong> " +
              s.notes[label] + "</p>"
            );
          })
          .join("");

        /* The one line someone skimming has to come away with. */
        /* The text is wrapped so the flex row has exactly two children. Left
           bare, any <strong> inside it becomes its own flex item and the
           sentence breaks apart mid-line. */
        const keyPoint = s.keyPoint
          ? '<p class="key-point"><span class="key-point-label">Key point</span>' +
            '<span class="key-point-text">' + s.keyPoint + "</span></p>"
          : "";

        /* A scannable line per item, so the section works as a reference as
           well as an explanation. */
        const examples = s.examples
          ? '<div class="ref-scroll"><table class="ref-table"><thead><tr>' +
            (s.exampleHeadings || lesson.exampleHeadings || ["Syntax", "Kind", "Example", "What it matches"])
              .map(function (h) {
                return "<th>" + escapeHtml(h) + "</th>";
              })
              .join("") +
            "</tr></thead><tbody>" +
            s.examples
              .map(function (ex) {
                return (
                  "<tr" + (ex.ref ? ' data-ref="' + escapeHtml(ex.ref) + '"' : "") + ">" +
                  '<td class="ref-syntax"><code>' + escapeHtml(ex.syntax) + "</code></td>" +
                  '<td class="ref-name">' + escapeHtml(ex.label) + "</td>" +
                  '<td class="ref-code"><code>' + escapeHtml(ex.code) + "</code></td>" +
                  '<td class="ref-meaning">' + ex.meaning + "</td></tr>"
                );
              })
              .join("") +
            "</tbody></table></div>"
          : "";

        const anatomy = s.anatomy
          ? '<figure class="anatomy"><figcaption>' + escapeHtml(s.anatomy.label) +
            '</figcaption><pre class="anatomy-specimen">' +
            '<span class="anatomy-lines">' + anatomyParts(s.anatomy.parts) + "</span></pre>" +
            '<p class="anatomy-hint">' + escapeHtml(s.anatomy.hint ||
              "Hover a part to light up its row in the table below.") + "</p></figure>"
          : "";

        const tree = s.tree
          ? '<figure class="tree-figure"><figcaption>' +
            escapeHtml(s.tree.label) + "</figcaption>" +
            '<div class="file-tree">' +
            s.tree.lines
              .map(function (line) {
                return (
                  '<div class="tree-row' + (line.mark ? " is-marked" : "") + '"' +
                  ' style="--depth:' + (line.depth || 0) + '">' +
                  '<span class="tree-name' + (line.kind === "folder" ? " is-folder" : "") + '">' +
                  escapeHtml(line.name) + "</span>" +
                  (line.mark ? '<span class="tree-mark">' + escapeHtml(line.mark) + "</span>" : "") +
                  "</div>"
                );
              })
              .join("") +
            "</div></figure>"
          : "";

        return (
          '<section class="method" id="' + s.id + '" style="--accent:' + s.accent + '">' +
          '<header class="method-head"><span class="method-num">' + s.number + "</span>" +
          "<div><h2>" + s.name + '</h2><p class="method-tagline">' + s.tagline + "</p></div></header>" +
          '<p class="method-lead">' + s.lead + "</p>" +
          keyPoint +
          '<dl class="method-meta">' + meta + "</dl>" +
          (code ? '<div class="method-code">' + code + "</div>" : "") +
          tree +
          anatomy +
          examples +
          (s.ladder ? '<ol class="ladder ladder-inline">' + ladderRows(s.ladder) + "</ol>" : "") +
          '<div class="method-notes">' + notes + "</div>" +
          (s.demo ? '<div class="tryit" data-section="' + s.id + '"></div>' : "") +
          "</section>"
        );
      })
      .join("");
  }

  /* Hovering a piece of the specimen lights the row explaining it, and hovering
     a row lights the piece, so the two are read as one thing. */
  function wireAnatomy(host) {
    Array.prototype.forEach.call(host.querySelectorAll(".method"), function (section) {
      const figure = section.querySelector(".anatomy");
      const table = section.querySelector(".ref-table");
      if (!figure || !table) return;

      function clear() {
        Array.prototype.forEach.call(section.querySelectorAll(".is-lit"), function (el) {
          el.classList.remove("is-lit");
        });
      }

      function row(ref) {
        return table.querySelector('tr[data-ref="' + ref + '"]');
      }

      /* A part lights on its own. Two paragraphs on two lines are two
         separate elements, so hovering one must not light the other. */
      figure.addEventListener("mouseover", function (event) {
        const part = event.target.closest(".anatomy-part");
        clear();
        if (!part) return;
        part.classList.add("is-lit");
        const match = row(part.getAttribute("data-ref"));
        if (match) match.classList.add("is-lit");
      });

      /* A row names a kind of part rather than one instance of it, so it
         lights every part of that kind in the specimen. */
      table.addEventListener("mouseover", function (event) {
        const hit = event.target.closest("tr[data-ref]");
        clear();
        if (!hit) return;
        hit.classList.add("is-lit");
        const ref = hit.getAttribute("data-ref");
        Array.prototype.forEach.call(
          figure.querySelectorAll('.anatomy-part[data-ref="' + ref + '"]'),
          function (part) {
            part.classList.add("is-lit");
          }
        );
      });

      figure.addEventListener("mouseleave", clear);
      table.addEventListener("mouseleave", clear);
    });
  }

  // ── Live demos ───────────────────────────────────────
  const DEMO_BASE =
    ":host { display: block; }" +
    "h1 { font-size: 19px; margin: 0 0 6px; font-family: inherit; }" +
    "h1:last-child { margin-bottom: 0; }" +
    "p { margin: 0 0 8px; }" +
    "ul { margin: 0; padding-left: 20px; }" +
    "button { font: inherit; }";

  /** One preview pane as its own shadow root, so its CSS cannot leak into the next. */
  function makePane(box, markup) {
    const root = box.attachShadow({ mode: "open" });
    const base = document.createElement("style");
    base.textContent = DEMO_BASE;
    root.appendChild(base);
    const sheet = document.createElement("style");
    root.appendChild(sheet);

    const pane = {
      root: root,
      sheet: sheet,
      /* Swap the markup without touching the two style nodes, since a
         shadow root can only ever be attached to its host once. */
      setMarkup: function (html) {
        while (root.lastChild && root.lastChild !== sheet) {
          root.removeChild(root.lastChild);
        }
        const holder = document.createElement("div");
        holder.innerHTML = html;
        while (holder.firstChild) root.appendChild(holder.firstChild);
      },
    };
    pane.setMarkup(markup);
    return pane;
  }

  /* Every demo in a lesson takes the same controls and shows the same panes, so the result is the only difference. */
  function buildDemos(host, lesson) {
    lesson.sections.forEach(function (s) {
      if (!s.demo) return;
      const demo = s.demo;
      const box = host.querySelector('.tryit[data-section="' + s.id + '"]');
      if (!box) return;

      box.innerHTML =
        '<div class="tryit-head"><span class="tryit-label">Try it</span>' +
        '<span class="tryit-hint">' + escapeHtml(lesson.demoHint) + "</span></div>" +
        '<div class="tryit-grid"><div class="tryit-editor">' +
        '<div class="tryit-editor-label">' + escapeHtml(demo.editorLabel) + "</div>" +
        '<textarea data-role="editor" spellcheck="false" aria-label="Editable code"></textarea>' +
        '</div><div class="tryit-pages">' +
        demo.panes
          .map(function (pane, i) {
            return (
              '<div class="demo-page"><div class="demo-page-label">' +
              escapeHtml(pane.label) + "</div>" +
              '<div class="demo-page-body" data-role="pane" data-index="' + i + '"></div></div>'
            );
          })
          .join("") +
        "</div></div>" +
        '<p class="tryit-note"><strong>Result:</strong> ' + escapeHtml(demo.result) + "</p>";

      const editor = box.querySelector('[data-role="editor"]');
      editor.value = demo.value;

      const panes = Array.prototype.slice
        .call(box.querySelectorAll('[data-role="pane"]'))
        .map(function (el, i) {
          return makePane(el, demo.panes[i].html);
        });

      function paint() {
        const text = editor.value;
        demo.panes.forEach(function (spec, i) {
          if (demo.editorKind === "html") {
            // The editor IS the markup, so the pane is rebuilt from it.
            panes[i].setMarkup(spec.applies ? text : spec.html);
            panes[i].sheet.textContent = demo.paneCss || "";
            return;
          }
          panes[i].sheet.textContent = spec.applies ? text : "";
          if (spec.inlineTarget) {
            const el = panes[i].root.querySelector(spec.inlineTarget);
            if (el) el.setAttribute("style", text);
          }
        });
      }

      editor.addEventListener("input", paint);
      paint();
    });
  }

  // ── Comparison table ─────────────────────────────────
  function renderComparison(table, lesson) {
    if (!table || !lesson.comparison) return;
    const names = {};
    lesson.sections.forEach(function (s) {
      names[s.id] = { name: s.name, accent: s.accent };
    });

    const head =
      "<thead><tr><th></th>" +
      lesson.comparison.columns
        .map(function (id) {
          return '<th style="--accent:' + names[id].accent + '">' + escapeHtml(names[id].name) + "</th>";
        })
        .join("") +
      "</tr></thead>";

    const body =
      "<tbody>" +
      lesson.comparison.rows
        .map(function (row) {
          return (
            '<tr><th scope="row">' + escapeHtml(row.label) + "</th>" +
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

    table.innerHTML = head + body;
  }

  // ── Ordered ladder, for a lesson that ends in a ranking ──
  function ladderRows(steps) {
    return steps
      .map(function (step) {
        return (
          '<li class="ladder-step"><span class="ladder-rank">' + step.rank + "</span>" +
          '<div class="ladder-body"><h3>' + step.title + "</h3><p>" + step.body + "</p>" +
          (step.code ? '<pre class="ladder-code"><code>' + escapeHtml(step.code) + "</code></pre>" : "") +
          "</div></li>"
        );
      })
      .join("");
  }

  function renderLadder(host, lesson) {
    if (!host || !lesson.ladder) return;
    host.innerHTML = ladderRows(lesson.ladder);
  }

  // ── Reading progress ─────────────────────────────────
  function setupProgress(bar, activityId) {
    let reported = 0;

    function readPercent() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return 100;
      return Math.max(0, Math.min(100, Math.round((window.scrollY / scrollable) * 100)));
    }

    function update() {
      const pct = readPercent();
      if (bar) bar.style.width = pct + "%";
      // Only ever report forwards, so scrolling back up cannot undo progress.
      if (pct > reported) {
        reported = pct;
        if (window.WDFBProgress) window.WDFBProgress.setPercent(activityId, pct);
      }
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  function init() {
    if (typeof LESSON === "undefined") return;
    if (window.WDFBProgress) window.WDFBProgress.markViewed(LESSON.id);

    const sectionHost = document.getElementById("sections");
    renderSections(sectionHost, LESSON);
    wireAnatomy(sectionHost);
    buildDemos(sectionHost, LESSON);
    renderComparison(document.getElementById("comparison"), LESSON);
    renderLadder(document.getElementById("ladder"), LESSON);
    buildToc(document.getElementById("lessonToc"), LESSON);
    setupProgress(document.getElementById("readProgress"), LESSON.id);

    // A lesson with a bespoke widget hangs it off this hook.
    if (typeof window.onLessonReady === "function") window.onLessonReady();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.LessonKit = { escapeHtml: escapeHtml, makePane: makePane };
})();
