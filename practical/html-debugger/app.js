/**
 * HTML Debugger - app logic.
 * PROBLEM_CATEGORIES comes from problems.js (loaded first, global).
 *
 * Rendering deliberately does NOT syntax-highlight the code (unlike
 * html-drag-and-drop's IDE panel): a highlighter that can't fully parse a
 * deliberately-broken tag (e.g. an unquoted attribute value with a space)
 * would leave that tag's brackets uncoloured while every well-formed tag
 * around it is coloured, which gives away exactly which tag is broken
 * before the learner clicks anything. Plain escaped text keeps every
 * error region visually identical to normal code until it's found.
 */
(function () {
  "use strict";

  const ACTIVITY_ID = "html-debugger";
  const STORAGE_KEY = "html_debugger_solved";

  const dom = {
    sidebar: document.getElementById("sidebar"),
    sidebarOverlay: document.getElementById("sidebarOverlay"),
    mobileToggle: document.getElementById("mobileToggle"),
    categoryList: document.getElementById("categoryList"),
    progressFill: document.getElementById("progressFill"),
    progressCount: document.getElementById("progressCount"),
    titleBarBadge: document.getElementById("titleBarBadge"),
    titleBarTitle: document.getElementById("titleBarTitle"),
    btnHint: document.getElementById("btnHint"),
    btnReset: document.getElementById("btnReset"),
    welcomeState: document.getElementById("welcomeState"),
    workspaceArea: document.getElementById("workspaceArea"),
    difficultyBadge: document.getElementById("difficultyBadge"),
    foundBadge: document.getElementById("foundBadge"),
    codeWrap: document.getElementById("codeWrap"),
    codeText: document.getElementById("codeText"),
    findingsBadge: document.getElementById("findingsBadge"),
    findingsBody: document.getElementById("findingsBody"),
    successOverlay: document.getElementById("successOverlay"),
    completionText: document.getElementById("completionText"),
    toastContainer: document.getElementById("toastContainer"),
  };

  const state = {
    currentCategory: null,
    currentProblem: null,
    found: new Set(),
    solved: new Set(),
  };

  let activeToolbar = null;

  // ── Escaping ──────────────────────────────────────────
  function escapeHtml(str) {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return str.replace(/[&<>"']/g, (c) => map[c]);
  }

  // ── Parse [[id: ...]] markers into clickable spans ───
  function parseCodeMarkup(raw) {
    const markerRe = /\[\[(\w+):([\s\S]*?)\]\]/g;
    let html = "";
    let lastIndex = 0;
    let match;
    while ((match = markerRe.exec(raw))) {
      html += escapeHtml(raw.slice(lastIndex, match.index));
      html += `<span class="err-region" data-err="${match[1]}" tabindex="0">${escapeHtml(
        match[2]
      )}</span>`;
      lastIndex = match.index + match[0].length;
    }
    html += escapeHtml(raw.slice(lastIndex));
    return html;
  }

  // ── Sidebar ───────────────────────────────────────────
  function buildSidebar() {
    dom.categoryList.innerHTML = "";

    PROBLEM_CATEGORIES.forEach((cat, catIdx) => {
      const group = document.createElement("div");
      group.className = "category-group";

      const header = document.createElement("div");
      header.className = "category-header" + (catIdx === 0 ? " expanded" : "");
      header.innerHTML = `
        <span>${cat.name}</span>
        <span class="category-count">(${cat.problems.length})</span>
        <span class="cat-chevron">&#9656;</span>
      `;

      const problemList = document.createElement("div");
      problemList.className = "category-problems" + (catIdx === 0 ? " open" : "");

      cat.problems.forEach((prob) => {
        const item = document.createElement("div");
        item.className = "problem-item";
        item.dataset.problemId = prob.id;
        item.innerHTML = `<span class="status-dot"></span><span>${prob.title}</span>`;
        item.addEventListener("click", () => loadProblem(cat, prob));
        problemList.appendChild(item);
      });

      header.addEventListener("click", () => {
        header.classList.toggle("expanded");
        problemList.classList.toggle("open");
      });

      group.appendChild(header);
      group.appendChild(problemList);
      dom.categoryList.appendChild(group);
    });
  }

  function setDifficultyBadge(el, difficulty) {
    el.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    el.classList.remove("difficulty-easy", "difficulty-medium", "difficulty-hard");
    el.classList.add(`difficulty-${difficulty}`);
  }

  // ── Load Problem ──────────────────────────────────────
  function loadProblem(category, problem) {
    closeToolbar();

    state.currentCategory = category;
    state.currentProblem = problem;
    state.found = new Set();

    document.querySelectorAll(".problem-item").forEach((el) => {
      el.classList.toggle("active", el.dataset.problemId === problem.id);
    });

    dom.titleBarTitle.textContent = problem.title;
    dom.titleBarBadge.textContent = category.name;
    dom.titleBarBadge.style.background = category.color + "22";
    dom.titleBarBadge.style.color = category.color;

    setDifficultyBadge(dom.difficultyBadge, problem.difficulty);

    dom.codeText.innerHTML = parseCodeMarkup(problem.html);
    dom.findingsBody.innerHTML = `<p class="findings-empty">Errors you find will appear here.</p>`;

    updateFoundBadges();

    dom.welcomeState.style.display = "none";
    dom.workspaceArea.style.display = "flex";
    dom.btnHint.disabled = false;
    dom.btnReset.disabled = false;

    dom.sidebar.classList.remove("open");
  }

  // ── Click handling ────────────────────────────────────
  function handleCodeClick(e) {
    if (!state.currentProblem) return;
    const span = e.target.closest(".err-region");

    if (!span) {
      spawnMissMark(e.clientX, e.clientY);
      return;
    }

    const errId = span.dataset.err;
    const errorData = state.currentProblem.errors.find((er) => er.id === errId);
    if (!errorData) return;

    if (!state.found.has(errId)) {
      state.found.add(errId);
      span.classList.add("found");
      addFinding(errorData);
      updateFoundBadges();
      checkCompletion();
    }

    showToolbar(span, errorData);
  }

  function spawnMissMark(clientX, clientY) {
    const rect = dom.codeWrap.getBoundingClientRect();
    const mark = document.createElement("div");
    mark.className = "miss-mark";
    mark.textContent = "✕";
    mark.style.left = clientX - rect.left + dom.codeWrap.scrollLeft + "px";
    mark.style.top = clientY - rect.top + dom.codeWrap.scrollTop + "px";
    dom.codeWrap.appendChild(mark);
    // setTimeout rather than "animationend" alone: that event doesn't
    // reliably fire for elements added/removed in quick succession, and
    // stray un-removed marks would otherwise pile up in the code panel.
    setTimeout(() => mark.remove(), 650);
  }

  // ── Toolbar ───────────────────────────────────────────
  function showToolbar(span, errorData) {
    closeToolbar();

    const toolbar = document.createElement("div");
    toolbar.className = "error-toolbar";
    toolbar.innerHTML = `
      <div class="error-toolbar-header">
        <span>${escapeHtml(errorData.title)}</span>
        <button class="error-toolbar-close" aria-label="Close">&#10005;</button>
      </div>
      <p>${escapeHtml(errorData.explain)}</p>
    `;
    dom.codeWrap.appendChild(toolbar);

    const wrapRect = dom.codeWrap.getBoundingClientRect();
    const spanRect = span.getBoundingClientRect();
    let left = spanRect.left - wrapRect.left + dom.codeWrap.scrollLeft;
    let top = spanRect.bottom - wrapRect.top + dom.codeWrap.scrollTop + 6;

    const toolbarWidth = toolbar.offsetWidth;
    const toolbarHeight = toolbar.offsetHeight;
    const maxLeft = dom.codeWrap.scrollLeft + dom.codeWrap.clientWidth - toolbarWidth - 8;
    const minLeft = dom.codeWrap.scrollLeft + 8;
    left = Math.max(minLeft, Math.min(left, maxLeft));

    const maxTop = dom.codeWrap.scrollTop + dom.codeWrap.clientHeight - toolbarHeight - 8;
    const minTop = dom.codeWrap.scrollTop + 8;
    top = Math.max(minTop, Math.min(top, maxTop));

    toolbar.style.left = left + "px";
    toolbar.style.top = top + "px";

    toolbar.querySelector(".error-toolbar-close").addEventListener("click", closeToolbar);

    activeToolbar = toolbar;
  }

  function closeToolbar() {
    if (activeToolbar) {
      activeToolbar.remove();
      activeToolbar = null;
    }
  }

  // ── Findings panel ────────────────────────────────────
  function addFinding(errorData) {
    const empty = dom.findingsBody.querySelector(".findings-empty");
    if (empty) empty.remove();

    const card = document.createElement("div");
    card.className = "finding-card";
    card.innerHTML = `
      <div class="finding-title">${escapeHtml(errorData.title)}</div>
      <p>${escapeHtml(errorData.explain)}</p>
    `;
    dom.findingsBody.appendChild(card);
    dom.findingsBody.scrollTop = dom.findingsBody.scrollHeight;
  }

  function updateFoundBadges() {
    const total = state.currentProblem.errors.length;
    dom.foundBadge.textContent = `${state.found.size}/${total} found`;
    dom.findingsBadge.textContent = `${state.found.size}/${total}`;
  }

  // ── Completion ────────────────────────────────────────
  function checkCompletion() {
    const total = state.currentProblem.errors.length;
    if (state.found.size !== total) return;

    state.solved.add(state.currentProblem.id);
    updateSolvedUI();
    updateProgress();
    saveSolvedState();
    setTimeout(showSuccess, 500);
  }

  function showSuccess() {
    closeToolbar();
    const total = state.currentProblem.errors.length;
    dom.completionText.textContent = `You found all ${total} error${
      total === 1 ? "" : "s"
    } in "${state.currentProblem.title}".`;
    dom.successOverlay.classList.add("show");
  }

  function hideSuccess() {
    dom.successOverlay.classList.remove("show");
  }

  function goToNextProblem() {
    hideSuccess();

    let found = false;
    let startLooking = false;

    for (const cat of PROBLEM_CATEGORIES) {
      for (const prob of cat.problems) {
        if (startLooking && !state.solved.has(prob.id)) {
          loadProblem(cat, prob);
          found = true;
          break;
        }
        if (prob.id === state.currentProblem.id) startLooking = true;
      }
      if (found) break;
    }

    if (!found) {
      for (const cat of PROBLEM_CATEGORIES) {
        for (const prob of cat.problems) {
          if (!state.solved.has(prob.id)) {
            loadProblem(cat, prob);
            found = true;
            break;
          }
        }
        if (found) break;
      }
    }

    if (!found) {
      showToast("success", "Amazing! You've debugged all 30 pages.");
    }
  }

  // ── Hint ──────────────────────────────────────────────
  function showHint() {
    if (!state.currentProblem) return;
    const nextError = state.currentProblem.errors.find((er) => !state.found.has(er.id));
    if (!nextError) {
      showToast("success", "You've already found every error in this one.");
      return;
    }
    showToast("warning", `Hint: one error is "${nextError.title}".`);
  }

  // ── Reset ─────────────────────────────────────────────
  function resetProblem() {
    if (!state.currentProblem) return;

    const wasSolved = state.solved.has(state.currentProblem.id);
    if (wasSolved) {
      state.solved.delete(state.currentProblem.id);
      updateSolvedUI();
      updateProgress();
      saveSolvedState();
    }

    loadProblem(state.currentCategory, state.currentProblem);
    showToast("info", "Problem reset. Every error is hidden again.");
  }

  // ── Solved UI / progress ──────────────────────────────
  function updateSolvedUI() {
    document.querySelectorAll(".problem-item").forEach((el) => {
      el.classList.toggle("solved", state.solved.has(el.dataset.problemId));
    });
  }

  function updateProgress() {
    const total = PROBLEM_CATEGORIES.reduce((sum, cat) => sum + cat.problems.length, 0);
    const solved = state.solved.size;
    const pct = Math.round((solved / total) * 100);

    dom.progressFill.style.width = pct + "%";
    dom.progressCount.textContent = `${solved}/${total}`;

    if (window.WDFBProgress) window.WDFBProgress.setPercent(ACTIVITY_ID, pct);
  }

  // ── Persist solved state to localStorage ─────────────
  function getAllProblemIds() {
    const ids = new Set();
    PROBLEM_CATEGORIES.forEach((cat) => cat.problems.forEach((p) => ids.add(p.id)));
    return ids;
  }

  function loadSavedState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const validIds = getAllProblemIds();
        JSON.parse(saved).forEach((id) => {
          if (validIds.has(id)) state.solved.add(id);
        });
        updateSolvedUI();
        updateProgress();
        saveSolvedState();
      }
    } catch (e) {
      /* ignore */
    }
  }

  function saveSolvedState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...state.solved]));
    } catch (e) {
      /* ignore */
    }
  }

  // ── Toast Notifications ──────────────────────────────
  let toastDismissTimeout = null;
  let toastRemoveTimeout = null;

  function showToast(type, message) {
    clearTimeout(toastDismissTimeout);
    clearTimeout(toastRemoveTimeout);
    dom.toastContainer.innerHTML = "";

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const icons = { error: "&#10007;", success: "&#10003;", info: "&#8505;", warning: "&#9888;" };

    toast.innerHTML = `<span>${icons[type] || "&#8505;"}</span><span>${escapeHtml(
      message
    )}</span>`;
    dom.toastContainer.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("show"));

    toastDismissTimeout = setTimeout(() => {
      toast.classList.remove("show");
      toastRemoveTimeout = setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  // ── Mobile Sidebar Toggle ────────────────────────────
  function initMobileToggle() {
    dom.mobileToggle.addEventListener("click", () => dom.sidebar.classList.toggle("open"));
    dom.sidebarOverlay.addEventListener("click", () => dom.sidebar.classList.remove("open"));
  }

  // ── Keyboard Shortcuts ───────────────────────────────
  function initKeyboard() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        hideSuccess();
        closeToolbar();
      }
    });
  }

  // ── Dismiss the toolbar on any click outside it or its span ──
  function initOutsideClickDismiss() {
    document.addEventListener("click", (e) => {
      if (!activeToolbar) return;
      if (activeToolbar.contains(e.target)) return;
      if (e.target.closest(".err-region")) return;
      closeToolbar();
    });
  }

  // ── Init ─────────────────────────────────────────────
  function init() {
    if (window.WDFBProgress) window.WDFBProgress.markViewed(ACTIVITY_ID);

    buildSidebar();
    initMobileToggle();
    initKeyboard();
    initOutsideClickDismiss();
    loadSavedState();

    dom.codeText.addEventListener("click", handleCodeClick);
    dom.btnHint.addEventListener("click", showHint);
    dom.btnReset.addEventListener("click", resetProblem);

    document.getElementById("btnNextProblem").addEventListener("click", goToNextProblem);
    document.getElementById("btnStayHere").addEventListener("click", hideSuccess);

    updateProgress();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
