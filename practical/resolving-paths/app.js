/*
  Resolving Paths - activity logic.

  The learner is shown a project folder, told which file inside it they are
  editing, and given a snippet from that file with its src, href and alt
  values blank.

  Answers are not compared as strings. A typed path is resolved against the
  tree the same way a browser resolves it: split on slashes, walk down for a
  name, up for "..", stay put for ".", then see which file (if any) the
  journey lands on. That means any route to the right file is accepted,
  "./logo.png" and "logo.png" are equally right, and a wrong answer can be
  told apart from a near miss, so the feedback can say what actually went
  wrong rather than "incorrect".

  Solved problems are kept in localStorage and reported to the dashboard as a
  percentage of the whole set.
*/

(function () {
  "use strict";

  const ACTIVITY_ID = "resolving-paths";
  const SOLVED_KEY = "resolving_paths_solved_v1";

  // Openings that add nothing to alt text, since assistive technology already
  // announces that the thing is an image before reading it out.
  const REDUNDANT_ALT_OPENINGS = [
    "image of",
    "an image of",
    "a image of",
    "picture of",
    "a picture of",
    "photo of",
    "a photo of",
    "photograph of",
    "graphic of",
  ];

  // Words that describe the file rather than what is in it, so they leave a
  // learner who cannot see the image no better off.
  const VAGUE_ALT_WORDS = [
    "image",
    "picture",
    "photo",
    "img",
    "graphic",
    "file",
    "here",
    "this",
    "alt",
    "text",
  ];

  const IMAGE_EXTENSIONS = /\.(png|jpe?g|gif|svg|webp|avif)$/i;

  const state = {
    solved: new Set(),
    problem: null,
    category: null,
    checked: false,
  };

  const dom = {
    problemCount: document.getElementById("problemCount"),
    progressCount: document.getElementById("progressCount"),
    progressFill: document.getElementById("progressFill"),
    categoryList: document.getElementById("categoryList"),
    titleBarBadge: document.getElementById("titleBarBadge"),
    titleBarTitle: document.getElementById("titleBarTitle"),
    btnHint: document.getElementById("btnHint"),
    btnReset: document.getElementById("btnReset"),
    btnCheck: document.getElementById("btnCheck"),
    btnNext: document.getElementById("btnNext"),
    welcomeState: document.getElementById("welcomeState"),
    welcomeStats: document.getElementById("welcomeStats"),
    workspace: document.getElementById("workspace"),
    treeBody: document.getElementById("treeBody"),
    treeBadge: document.getElementById("treeBadge"),
    editingPath: document.getElementById("editingPath"),
    blankBadge: document.getElementById("blankBadge"),
    briefText: document.getElementById("briefText"),
    codeBody: document.getElementById("codeBody"),
    feedbackList: document.getElementById("feedbackList"),
  };

  // ── Helpers ─────────────────────────────────────────────────────────────
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function allProblems() {
    const out = [];
    PATH_CATEGORIES.forEach(function (category) {
      category.problems.forEach(function (problem) {
        out.push({ category: category, problem: problem });
      });
    });
    return out;
  }

  function totalProblemCount() {
    return PATH_CATEGORIES.reduce(function (sum, category) {
      return sum + category.problems.length;
    }, 0);
  }

  function baseName(path) {
    const parts = path.split("/");
    return parts[parts.length - 1];
  }

  // The folder a file lives in, as a path from the top of the project. The
  // top itself is "", which is what makes joining paths below straightforward.
  function dirName(path) {
    const cut = path.lastIndexOf("/");
    return cut === -1 ? "" : path.slice(0, cut);
  }

  // ── Reading the tree ────────────────────────────────────────────────────
  /*
    Walks the nested tree data into two flat sets of full paths, one of files
    and one of folders. Everything else in this file works off those, so the
    shape of the data is only understood in one place.
  */
  function walkTree(nodes, prefix, files, folders) {
    nodes.forEach(function (node) {
      if (typeof node === "string") {
        files.add(prefix + node);
        return;
      }
      const path = prefix + node.folder;
      folders.add(path);
      walkTree(node.children || [], path + "/", files, folders);
    });
  }

  function indexTree(problem) {
    const files = new Set();
    const folders = new Set();
    walkTree(problem.tree, "", files, folders);
    return { files: files, folders: folders };
  }

  // ── Resolving a typed path ──────────────────────────────────────────────
  /*
    The heart of the activity: takes the folder the learner is editing in and
    whatever they typed, and works out where that lands, exactly as a browser
    would. Returns either a resolved path or the reason the journey failed.
  */
  function resolvePath(fromDir, typed) {
    const stack = fromDir ? fromDir.split("/") : [];
    let surplus = false;

    const parts = typed.split("/");
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      // An empty part is a double slash or a trailing one; neither moves you.
      if (part === "" || part === ".") continue;
      if (part === "..") {
        // A browser throws away a ../ with nothing left to climb, rather
        // than failing, so the path still resolves. Match that.
        if (!stack.length) {
          surplus = true;
          continue;
        }
        stack.pop();
        continue;
      }
      stack.push(part);
    }

    return { path: stack.join("/"), surplus: surplus };
  }

  // Same journey, ignoring capitals, used only to tell a learner who has the
  // right file but the wrong case apart from one who has the wrong file.
  function equalIgnoringCase(a, b) {
    return a.toLowerCase() === b.toLowerCase();
  }

  /*
    Grades one path blank and returns both a verdict and a sentence saying
    why, since "wrong" on its own teaches nothing about a path.
  */
  function checkPathBlank(typed, target, editing, index) {
    const value = typed.trim();

    if (!value) {
      return { ok: false, message: "This one is still empty." };
    }
    if (value.indexOf("\\") !== -1) {
      return {
        ok: false,
        message:
          "Web paths are always written with forward slashes (/), never backslashes, even on Windows.",
      };
    }
    if (value.indexOf("://") !== -1) {
      return {
        ok: false,
        message:
          "That is a full web address for somewhere else. This file is inside the project, so it wants a path to it instead.",
      };
    }
    if (value.charAt(0) === "/") {
      return {
        ok: false,
        message:
          "A path starting with / means \"from the very top of the whole website\", which breaks as soon as the site is published inside a sub-folder. Write the path from the file you are editing instead.",
      };
    }

    const resolved = resolvePath(dirName(editing), value);
    if (resolved.path === target) {
      return {
        ok: true,
        message: resolved.surplus
          ? "Lands on " +
            target +
            ". It works, but there is a ../ too many: once you are at the top of the tree an extra one is thrown away rather than obeyed. Count the folders between " +
            baseName(editing) +
            " and the top: that is how many you need."
          : "Lands on " + target + ".",
      };
    }

    if (index.folders.has(resolved.path)) {
      return {
        ok: false,
        message:
          "That lands on the folder " +
          resolved.path +
          ", not on a file. Add the filename on the end.",
      };
    }
    if (index.files.has(resolved.path)) {
      return {
        ok: false,
        message:
          "That is a real file, " +
          resolved.path +
          ", but the one you want is " +
          target +
          ".",
      };
    }
    if (equalIgnoringCase(resolved.path, target)) {
      return {
        ok: false,
        message:
          "Right file, wrong capitals. Most web servers treat " +
          resolved.path +
          " and " +
          target +
          " as two different files, so copy the name from the tree exactly.",
      };
    }
    if (baseName(resolved.path) === baseName(target)) {
      return {
        ok: false,
        message:
          "The right filename, but that route lands in the wrong folder: " +
          resolved.path +
          " does not exist. Trace the journey from " +
          (dirName(editing) || "the top of the project") +
          " again.",
      };
    }
    return {
      ok: false,
      message:
        "Nothing is at " +
        (resolved.path || "the top of the project") +
        ". Follow the tree from " +
        (dirName(editing) ? dirName(editing) + "/" : "the top of the project") +
        ", which is where " +
        baseName(editing) +
        " sits.",
    };
  }

  /*
    Alt text has no single right answer, so it is graded against what makes
    alt text useful rather than against a stored string: it has to say what is
    in the picture, in words, rather than name the file or repeat the word
    "image". The rules are spelled out in the feedback so a learner is never
    guessing at what is being asked.
  */
  function checkAltBlank(typed, example) {
    const value = typed.trim();
    const lower = value.toLowerCase();

    if (!value) {
      return {
        ok: false,
        message:
          "This one is still empty. Write a short description of what is in the picture, for anyone who cannot see it.",
      };
    }
    if (IMAGE_EXTENSIONS.test(value) || value.indexOf("/") !== -1) {
      return {
        ok: false,
        message:
          "That is the filename, not a description. alt is read out in place of the picture, so it has to say what the picture shows.",
      };
    }
    if (value.length < 4) {
      return {
        ok: false,
        message:
          "Too short to describe anything. A few words is usually about right, for example “" +
          example +
          "”.",
      };
    }
    if (VAGUE_ALT_WORDS.indexOf(lower) !== -1) {
      return {
        ok: false,
        message:
          "“" +
          value +
          "” could describe any picture on the web. Say what this one shows, for example “" +
          example +
          "”.",
      };
    }
    for (let i = 0; i < REDUNDANT_ALT_OPENINGS.length; i++) {
      const opening = REDUNDANT_ALT_OPENINGS[i];
      if (lower.indexOf(opening + " ") === 0) {
        return {
          ok: false,
          message:
            "A screen reader already announces that this is an image, so starting with “" +
            opening +
            "” says it twice. Begin with what is in it instead.",
        };
      }
    }
    return {
      ok: true,
      message: "That describes the picture. Another good one: “" + example + "”.",
    };
  }

  // ── Sidebar ─────────────────────────────────────────────────────────────
  function buildSidebar() {
    dom.categoryList.innerHTML = "";

    PATH_CATEGORIES.forEach(function (category, categoryIndex) {
      const group = document.createElement("div");
      group.className = "category-group";

      const expanded = categoryIndex === 0;
      const header = document.createElement("div");
      header.className = "category-header" + (expanded ? " expanded" : "");
      header.innerHTML =
        "<span>" +
        escapeHtml(category.name) +
        '</span><span class="category-count">(' +
        category.problems.length +
        ')</span><span class="cat-chevron">&#9656;</span>';

      const body = document.createElement("div");
      body.className = "category-problems" + (expanded ? " open" : "");

      header.addEventListener("click", function () {
        header.classList.toggle("expanded");
        body.classList.toggle("open");
      });

      category.problems.forEach(function (problem) {
        const item = document.createElement("div");
        item.className = "problem-item";
        item.dataset.problemId = problem.id;
        item.innerHTML =
          '<span class="status-dot"></span><span>' +
          escapeHtml(problem.title) +
          "</span>";
        item.addEventListener("click", function () {
          loadProblem(category, problem);
        });
        body.appendChild(item);
      });

      group.appendChild(header);
      group.appendChild(body);
      dom.categoryList.appendChild(group);
    });

    dom.problemCount.textContent = String(totalProblemCount());
    markSolvedInSidebar();
  }

  function markSolvedInSidebar() {
    dom.categoryList.querySelectorAll(".problem-item").forEach(function (item) {
      item.classList.toggle("solved", state.solved.has(item.dataset.problemId));
    });
  }

  function markActiveProblem(problemId) {
    dom.categoryList.querySelectorAll(".problem-item").forEach(function (item) {
      item.classList.toggle("active", item.dataset.problemId === problemId);
    });
  }

  // ── Welcome state ───────────────────────────────────────────────────────
  function buildWelcomeStats() {
    dom.welcomeStats.innerHTML = "";
    PATH_CATEGORIES.forEach(function (category) {
      const stat = document.createElement("div");
      stat.className = "welcome-stat";
      stat.innerHTML =
        '<div class="welcome-stat-icon">&#9670;</div><div class="welcome-stat-label">' +
        category.problems.length +
        " " +
        escapeHtml(category.name) +
        "</div>";
      dom.welcomeStats.appendChild(stat);
    });
  }

  // ── Rendering a problem ─────────────────────────────────────────────────
  function loadProblem(category, problem) {
    state.category = category;
    state.problem = problem;
    state.checked = false;

    markActiveProblem(problem.id);
    dom.welcomeState.style.display = "none";
    dom.workspace.hidden = false;

    dom.titleBarBadge.textContent = category.name;
    dom.titleBarBadge.style.backgroundColor = category.color + "22";
    dom.titleBarBadge.style.color = category.color;
    dom.titleBarTitle.textContent = problem.title;

    dom.btnHint.hidden = false;
    dom.btnReset.hidden = false;
    dom.btnCheck.hidden = false;
    dom.btnNext.hidden = true;

    dom.briefText.textContent = problem.brief;
    dom.editingPath.textContent = problem.editing;

    renderTree(problem);
    renderCode(problem);
    dom.feedbackList.innerHTML = "";

    const firstInput = dom.codeBody.querySelector(".blank");
    if (firstInput) firstInput.focus();
  }

  function renderTree(problem) {
    dom.treeBody.innerHTML = "";
    const index = indexTree(problem);
    dom.treeBadge.textContent =
      index.files.size +
      (index.files.size === 1 ? " file" : " files") +
      (index.folders.size
        ? ", " +
          index.folders.size +
          (index.folders.size === 1 ? " folder" : " folders")
        : "");

    // The project folder itself, so the top of the tree is a visible thing
    // rather than an edge the rows just start at.
    const root = document.createElement("div");
    root.className = "tree-row tree-folder tree-root";
    root.innerHTML =
      '<span class="tree-glyph">&#9662;</span><span class="tree-name">project/</span>';
    dom.treeBody.appendChild(root);

    renderTreeNodes(problem, problem.tree, "", 1);
  }

  function renderTreeNodes(problem, nodes, prefix, depth) {
    nodes.forEach(function (node) {
      const row = document.createElement("div");
      row.style.paddingLeft = depth * 18 + 12 + "px";

      if (typeof node === "string") {
        const path = prefix + node;
        const isEditing = path === problem.editing;
        row.className = "tree-row tree-file" + (isEditing ? " is-editing" : "");
        row.innerHTML =
          '<span class="tree-glyph">&#8226;</span><span class="tree-name">' +
          escapeHtml(node) +
          "</span>" +
          (isEditing ? '<span class="tree-tag">you are here</span>' : "");
        dom.treeBody.appendChild(row);
        return;
      }

      row.className = "tree-row tree-folder";
      row.innerHTML =
        '<span class="tree-glyph">&#9662;</span><span class="tree-name">' +
        escapeHtml(node.folder) +
        "/</span>";
      dom.treeBody.appendChild(row);
      renderTreeNodes(
        problem,
        node.children || [],
        prefix + node.folder + "/",
        depth + 1
      );
    });
  }

  function renderCode(problem) {
    dom.codeBody.innerHTML = "";
    let blankCount = 0;

    problem.code.forEach(function (line) {
      const row = document.createElement("div");
      row.className = "code-line";

      // Split on the {{name}} markers so the text either side of a blank is
      // escaped as text and the blank itself becomes a real input.
      const parts = line.split(/(\{\{\w+\}\})/);
      parts.forEach(function (part) {
        const match = part.match(/^\{\{(\w+)\}\}$/);
        if (!match) {
          if (!part) return;
          const text = document.createElement("span");
          text.textContent = part;
          row.appendChild(text);
          return;
        }

        const name = match[1];
        const blank = problem.blanks[name];
        blankCount += 1;

        const input = document.createElement("input");
        input.type = "text";
        input.className = "blank blank-" + blank.kind;
        input.dataset.blank = name;
        input.autocomplete = "off";
        input.spellcheck = false;
        input.setAttribute(
          "aria-label",
          blank.kind === "alt"
            ? "Alt text"
            : "Path to " + blank.target
        );
        // Sized to the answer so the box is comfortable to type in without
        // being a length hint: everything gets a generous minimum.
        const target = blank.kind === "path" ? blank.target : blank.example;
        input.style.width = Math.max(14, target.length + 4) + "ch";
        row.appendChild(input);
      });

      dom.codeBody.appendChild(row);
    });

    dom.blankBadge.textContent =
      blankCount + (blankCount === 1 ? " blank" : " blanks");
  }

  // ── Checking ────────────────────────────────────────────────────────────
  function checkSolution() {
    const problem = state.problem;
    if (!problem) return;

    const index = indexTree(problem);
    const results = [];

    dom.codeBody.querySelectorAll(".blank").forEach(function (input) {
      const name = input.dataset.blank;
      const blank = problem.blanks[name];
      const result =
        blank.kind === "alt"
          ? checkAltBlank(input.value, blank.example)
          : checkPathBlank(input.value, blank.target, problem.editing, index);

      input.classList.toggle("is-correct", result.ok);
      input.classList.toggle("is-wrong", !result.ok);
      results.push({ name: name, kind: blank.kind, result: result });
    });

    state.checked = true;
    renderFeedback(results);

    const allRight = results.every(function (row) {
      return row.result.ok;
    });
    if (allRight) markSolved(problem.id);
    dom.btnNext.hidden = !allRight;
    if (allRight) dom.btnNext.focus();
  }

  function renderFeedback(results) {
    dom.feedbackList.innerHTML = "";

    const allRight = results.every(function (row) {
      return row.result.ok;
    });

    const summary = document.createElement("div");
    summary.className =
      "feedback-summary " + (allRight ? "is-correct" : "is-wrong");
    summary.textContent = allRight
      ? "All paths resolve. That is the problem solved."
      : results.filter(function (row) {
          return row.result.ok;
        }).length +
        " of " +
        results.length +
        " right so far.";
    dom.feedbackList.appendChild(summary);

    results.forEach(function (row) {
      const el = document.createElement("div");
      el.className =
        "feedback-row " + (row.result.ok ? "is-correct" : "is-wrong");
      el.innerHTML =
        '<code class="feedback-name">' +
        escapeHtml(row.name) +
        "</code><span>" +
        escapeHtml(row.result.message) +
        "</span>";
      dom.feedbackList.appendChild(el);
    });
  }

  function showHint() {
    if (!state.problem) return;
    dom.feedbackList.innerHTML = "";
    const el = document.createElement("div");
    el.className = "feedback-row is-hint";
    el.innerHTML =
      '<code class="feedback-name">hint</code><span>' +
      escapeHtml(state.problem.hint) +
      "</span>";
    dom.feedbackList.appendChild(el);
  }

  function resetProblem() {
    if (!state.problem) return;
    dom.codeBody.querySelectorAll(".blank").forEach(function (input) {
      input.value = "";
      input.classList.remove("is-correct", "is-wrong");
    });
    dom.feedbackList.innerHTML = "";
    dom.btnNext.hidden = true;
    state.checked = false;
    const firstInput = dom.codeBody.querySelector(".blank");
    if (firstInput) firstInput.focus();
  }

  /*
    The next problem is the next unsolved one from where the learner is, so
    working through the list in order keeps moving forward rather than
    landing back on something already done.
  */
  function goToNextProblem() {
    const entries = allProblems();
    const currentIndex = entries.findIndex(function (entry) {
      return state.problem && entry.problem.id === state.problem.id;
    });

    for (let i = currentIndex + 1; i < entries.length; i++) {
      if (!state.solved.has(entries[i].problem.id)) {
        openFromSidebar(entries[i]);
        return;
      }
    }
    for (let i = 0; i < entries.length; i++) {
      if (!state.solved.has(entries[i].problem.id)) {
        openFromSidebar(entries[i]);
        return;
      }
    }
    // Nothing left unsolved, so stay put rather than reopening something.
    dom.btnNext.hidden = true;
  }

  // Opens a problem and makes sure its category group is expanded, so the
  // sidebar always shows where the learner has been moved to.
  function openFromSidebar(entry) {
    const item = dom.categoryList.querySelector(
      '.problem-item[data-problem-id="' + entry.problem.id + '"]'
    );
    if (item) {
      const body = item.parentElement;
      const header = body.previousElementSibling;
      body.classList.add("open");
      if (header) header.classList.add("expanded");
      item.scrollIntoView({ block: "nearest" });
    }
    loadProblem(entry.category, entry.problem);
  }

  // ── Progress ────────────────────────────────────────────────────────────
  function markSolved(problemId) {
    if (state.solved.has(problemId)) return;
    state.solved.add(problemId);
    saveSolved();
    markSolvedInSidebar();
    updateProgress();
  }

  function updateProgress() {
    const total = totalProblemCount();
    const solved = state.solved.size;
    const pct = total ? Math.round((solved / total) * 100) : 0;

    dom.progressCount.textContent = solved + "/" + total;
    dom.progressFill.style.width = pct + "%";
    dom.progressFill.classList.toggle("is-complete", pct >= 100);

    if (window.WDFBProgress) {
      window.WDFBProgress.setPercent(ACTIVITY_ID, pct);
    }
  }

  // ── Storage ─────────────────────────────────────────────────────────────
  function loadSolved() {
    const valid = new Set(
      allProblems().map(function (entry) {
        return entry.problem.id;
      })
    );
    try {
      const raw = window.localStorage.getItem(SOLVED_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      parsed.forEach(function (id) {
        if (valid.has(id)) state.solved.add(id);
      });
    } catch (err) {
      /* A corrupt or unreadable store just means starting fresh. */
    }
  }

  function saveSolved() {
    try {
      window.localStorage.setItem(
        SOLVED_KEY,
        JSON.stringify(Array.from(state.solved))
      );
    } catch (err) {
      /* Storage can be full or blocked; the activity still works without it. */
    }
  }

  // ── Init ────────────────────────────────────────────────────────────────
  function init() {
    if (window.WDFBProgress) window.WDFBProgress.markViewed(ACTIVITY_ID);

    loadSolved();
    buildSidebar();
    buildWelcomeStats();
    updateProgress();

    dom.btnCheck.addEventListener("click", checkSolution);
    dom.btnHint.addEventListener("click", showHint);
    dom.btnReset.addEventListener("click", resetProblem);
    dom.btnNext.addEventListener("click", goToNextProblem);

    // Enter checks the answer, so a learner typing through the blanks never
    // has to reach for the mouse to find out how they went.
    dom.codeBody.addEventListener("keydown", function (event) {
      if (event.key !== "Enter") return;
      event.preventDefault();
      checkSolution();
    });

    // Editing after a check clears that blank's mark, so a red box is never
    // left sitting next to a value the learner has since changed.
    dom.codeBody.addEventListener("input", function (event) {
      const input = event.target.closest(".blank");
      if (!input) return;
      input.classList.remove("is-correct", "is-wrong");
    });

    // No problem is auto-loaded, even for a returning learner with progress:
    // the welcome state stays until something in the sidebar is clicked.
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
