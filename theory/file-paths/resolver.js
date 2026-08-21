/* Path resolver: bespoke to this lesson, so it lives here rather than in the shared renderer. */
(function () {
  "use strict";

  const els = {
    from: document.getElementById("resolverFrom"),
    path: document.getElementById("resolverPath"),
    presets: document.getElementById("resolverPresets"),
    steps: document.getElementById("resolverSteps"),
    verdict: document.getElementById("resolverVerdict"),
    tree: document.getElementById("resolverTree"),
  };

  const PRESETS = [
    "css/styles.css",
    "../css/styles.css",
    "images/logo.png",
    "../images/logo.png",
    "about.html",
    "../../index.html",
    "/css/styles.css",
    "https://example.com/a.png",
  ];

  function folderOf(file) {
    const at = file.lastIndexOf("/");
    return at === -1 ? [] : file.slice(0, at).split("/");
  }

  /**
   * Walk a path the way a browser does, one segment at a time, recording
   * each step so the working can be shown rather than just the answer.
   */
  function resolve(currentFile, raw) {
    const path = String(raw).trim();
    const steps = [];

    if (path === "") return { steps: steps, kind: "empty" };

    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(path) || path.indexOf("//") === 0) {
      steps.push({ part: path, note: "Names the site as well as the file", at: path });
      return { steps: steps, kind: "external", resolved: path };
    }

    if (path.charAt(0) === "#") {
      steps.push({ part: path, note: "Stays on the current page", at: currentFile + path });
      return { steps: steps, kind: "fragment", resolved: currentFile + path };
    }

    let parts;
    if (path.charAt(0) === "/") {
      parts = [];
      steps.push({ part: "/", note: "Leading slash: start at the site root", at: "(root)" });
    } else {
      parts = folderOf(currentFile);
      steps.push({
        part: "start",
        note: "Start in the current file's folder",
        at: parts.length ? parts.join("/") + "/" : "(root)",
      });
    }

    const segments = path.replace(/^\//, "").split("/").filter(function (x) {
      return x !== "";
    });

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const last = i === segments.length - 1;

      if (seg === ".") {
        steps.push({ part: "./", note: "Stay where you are", at: parts.join("/") + "/" });
        continue;
      }
      if (seg === "..") {
        if (parts.length === 0) {
          steps.push({ part: "../", note: "Already at the root. There is nowhere above it", at: "(nowhere)" });
          return { steps: steps, kind: "above-root" };
        }
        parts.pop();
        steps.push({
          part: "../",
          note: "Go up one level",
          at: parts.length ? parts.join("/") + "/" : "(root)",
        });
        continue;
      }
      parts.push(seg);
      steps.push({
        part: seg + (last ? "" : "/"),
        note: last ? "The file itself" : "Go down into this folder",
        at: parts.join("/"),
      });
    }

    return { steps: steps, kind: "relative", resolved: parts.join("/") };
  }

  function renderTree(resolved) {
    els.tree.innerHTML = SITE_FILES.map(function (file) {
      const bits = file.split("/");
      const rows = [];
      for (let i = 0; i < bits.length - 1; i++) {
        rows.push({ depth: i, name: bits[i] + "/", folder: true, path: null });
      }
      rows.push({ depth: bits.length - 1, name: bits[bits.length - 1], folder: false, path: file });
      return rows;
    })
      .reduce(function (all, rows) {
        rows.forEach(function (r) {
          // Folders repeat across files, so only add one row for each.
          const key = r.folder ? r.name + r.depth : r.path;
          if (!all.seen[key]) {
            all.seen[key] = true;
            all.rows.push(r);
          }
        });
        return all;
      }, { rows: [], seen: {} })
      .rows.map(function (r) {
        const hit = r.path && r.path === resolved;
        return (
          '<div class="tree-row' + (hit ? " is-marked" : "") + '" style="--depth:' + r.depth + '">' +
          '<span class="tree-name' + (r.folder ? " is-folder" : "") + '">' + r.name + "</span>" +
          (hit ? '<span class="tree-mark">resolved here</span>' : "") +
          "</div>"
        );
      })
      .join("");
  }

  function update() {
    const from = els.from.value;
    const result = resolve(from, els.path.value);

    els.steps.innerHTML = result.steps.length
      ? result.steps
          .map(function (step, i) {
            return (
              '<li class="resolve-step"><span class="resolve-num">' + i + "</span>" +
              '<code class="resolve-part">' + step.part + "</code>" +
              '<span class="resolve-note">' + step.note + "</span>" +
              '<code class="resolve-at">' + step.at + "</code></li>"
            );
          })
          .join("")
      : '<li class="resolve-empty">Type a path above, or pick one, to see it worked out.</li>';

    let verdict = "";
    let tone = "";
    if (result.kind === "empty") {
      verdict = "Nothing to resolve yet.";
      tone = "";
    } else if (result.kind === "external") {
      verdict = "Absolute URL. It names another site, so nothing here is consulted.";
      tone = "is-outside";
    } else if (result.kind === "fragment") {
      verdict = "A fragment. It stays on this page rather than fetching a file.";
      tone = "is-outside";
    } else if (result.kind === "above-root") {
      verdict = "This climbs above the top of the site. There is nothing there, and the browser reports no error.";
      tone = "is-wrong";
    } else if (SITE_FILES.indexOf(result.resolved) !== -1) {
      verdict = "Resolves to " + result.resolved + ", and that file exists.";
      tone = "is-right";
    } else {
      verdict = "Resolves to " + result.resolved + ", but nothing is there.";
      tone = "is-wrong";
    }

    els.verdict.textContent = verdict;
    els.verdict.className = "resolve-verdict " + tone;
    renderTree(result.kind === "relative" ? result.resolved : null);
  }

  function start() {
    if (!els.from || els.from.options.length) return;

    SITE_FILES.filter(function (f) {
      return /\.html$/.test(f);
    }).forEach(function (f) {
      const opt = document.createElement("option");
      opt.value = f;
      opt.textContent = f;
      els.from.appendChild(opt);
    });
    els.from.value = "blog/post.html";

    els.presets.innerHTML = PRESETS.map(function (p) {
      return '<button type="button" class="resolve-preset">' + p + "</button>";
    }).join("");
    els.presets.addEventListener("click", function (e) {
      const btn = e.target.closest(".resolve-preset");
      if (!btn) return;
      els.path.value = btn.textContent;
      update();
    });

    els.path.value = "../css/styles.css";
    els.from.addEventListener("change", update);
    els.path.addEventListener("input", update);
    update();
  }

  window.onLessonReady = start;
  if (document.getElementById("sections") && document.getElementById("sections").children.length) {
    start();
  }
})();
