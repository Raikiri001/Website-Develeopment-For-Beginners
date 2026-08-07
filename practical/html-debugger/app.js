/**
 * HTML Debugger - app logic.
 * PROBLEM_TIERS comes from problems.js (loaded first, global) - plain
 * metadata only (id/title). The actual page markup and error title/
 * explanation text is encrypted in answers.json, fetched once at init and
 * decrypted per problem on demand (same scheme as
 * html-drag-and-drop/solutions.json - see decryptAnswer below).
 *
 * highlightSyntax() colours code like html-drag-and-drop's IDE panel does,
 * but more permissively: it colours any <...>-shaped span and any
 * word/quoted-string token inside it without requiring the tag to be
 * well-formed. A stricter, "must fully parse" highlighter would leave a
 * deliberately-broken tag (e.g. an unquoted attribute value) visibly
 * uncoloured while every well-formed tag around it is coloured, which
 * gives away exactly which tag is broken before the learner clicks
 * anything. Colouring every token the same way regardless of validity
 * keeps error regions visually identical to normal code until found.
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
    currentTier: null,
    currentProblem: null,
    currentAnswer: null, // decrypted { html, errors } for the loaded problem
    found: new Set(),
    solved: new Set(),
    answersMap: null, // loaded from answers.json, still encrypted per problem id
  };

  let activeToolbar = null;

  // ── Decryption ───────────────────────────────────────
  // Key is split to make casual inspection harder. This is obfuscation
  // against peeking at view-source, not real security (see
  // html-drag-and-drop/app.js's decryptSolution for the same scheme).
  const _kp = ["D3_", "buGh", "Unt_", "K3y!"];
  const _dk = _kp.join("");

  /** Decrypt a XOR-ciphered, base64-encoded { html, errors }. */
  function decryptAnswer(encoded) {
    const bytes = atob(encoded);
    let result = "";
    for (let i = 0; i < bytes.length; i++) {
      result += String.fromCharCode(bytes.charCodeAt(i) ^ _dk.charCodeAt(i % _dk.length));
    }
    return JSON.parse(result);
  }

  function getAnswer(problemId) {
    if (!state.answersMap || !state.answersMap[problemId]) return null;
    return decryptAnswer(state.answersMap[problemId]);
  }

  async function loadAnswers() {
    try {
      const resp = await fetch("answers.json");
      if (!resp.ok) throw new Error("Failed to load answers");
      state.answersMap = await resp.json();
    } catch (err) {
      console.error("Could not load answers:", err);
      showToast("error", "Failed to load problem data. Please refresh.");
    }
  }

  // ── Escaping ──────────────────────────────────────────
  function escapeHtml(str) {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return str.replace(/[&<>"']/g, (c) => map[c]);
  }

  // ── Syntax highlighting (permissive - see file header) ──
  function highlightSyntax(escaped) {
    escaped = escaped.replace(
      /(&lt;!DOCTYPE\s+html&gt;)/gi,
      '<span class="doctype">$1</span>'
    );

    // Any <...>-shaped span, matched up to the next &gt; regardless of
    // whether what's inside it is well-formed.
    escaped = escaped.replace(
      /(&lt;\/?)([a-zA-Z][\w-]*)([\s\S]*?)(&gt;)/g,
      (whole, open, name, rest, close) => {
        // Colour every quoted string and every bare word token inside the
        // tag the same way (as .attr unless it's a quoted string), so a
        // stray unquoted value (the "Attribute & Quoting Mistakes"
        // category) doesn't stand out as the one uncoloured thing.
        const styledRest = rest.replace(
          /(&quot;[\s\S]*?&quot;)|([\w.-]+)(\s*=)?/g,
          (m, str, word, eq) => {
            if (str) return `<span class="string">${str}</span>`;
            if (word) return `<span class="attr">${word}</span>${eq || ""}`;
            return m;
          }
        );
        return `<span class="tag">${open}${name}</span>${styledRest}<span class="tag">${close}</span>`;
      }
    );

    return escaped;
  }

  // ── Parse [[id: ...]] markers into clickable spans ───
  function parseCodeMarkup(raw) {
    const markerRe = /\[\[(\w+):([\s\S]*?)\]\]/g;
    let html = "";
    let lastIndex = 0;
    let match;
    while ((match = markerRe.exec(raw))) {
      html += highlightSyntax(escapeHtml(raw.slice(lastIndex, match.index)));
      html += `<span class="err-region" data-err="${match[1]}" tabindex="0">${highlightSyntax(
        escapeHtml(match[2])
      )}</span>`;
      lastIndex = match.index + match[0].length;
    }
    html += highlightSyntax(escapeHtml(raw.slice(lastIndex)));
    return html;
  }

  // ── Sidebar ───────────────────────────────────────────
  function buildSidebar() {
    dom.categoryList.innerHTML = "";

    PROBLEM_TIERS.forEach((tier, tierIdx) => {
      const group = document.createElement("div");
      group.className = "category-group";

      const header = document.createElement("div");
      header.className = "category-header" + (tierIdx === 0 ? " expanded" : "");
      header.innerHTML = `
        <span>${tier.name}</span>
        <span class="category-count">(${tier.problems.length})</span>
        <span class="cat-chevron">&#9656;</span>
      `;

      const problemList = document.createElement("div");
      problemList.className = "category-problems" + (tierIdx === 0 ? " open" : "");

      tier.problems.forEach((prob) => {
        const item = document.createElement("div");
        item.className = "problem-item";
        item.dataset.problemId = prob.id;
        item.innerHTML = `<span class="status-dot"></span><span>${prob.title}</span>`;
        item.addEventListener("click", () => loadProblem(tier, prob));
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

  // ── Load Problem ──────────────────────────────────────
  function loadProblem(tier, problem) {
    const answer = getAnswer(problem.id);
    if (!answer) {
      showToast("error", "Problem data not available for this one.");
      return;
    }

    closeToolbar();

    state.currentTier = tier;
    state.currentProblem = problem;
    state.currentAnswer = answer;
    state.found = new Set();

    document.querySelectorAll(".problem-item").forEach((el) => {
      el.classList.toggle("active", el.dataset.problemId === problem.id);
    });

    dom.titleBarTitle.textContent = problem.title;
    dom.titleBarBadge.textContent = tier.name;
    dom.titleBarBadge.style.background = tier.color + "22";
    dom.titleBarBadge.style.color = tier.color;

    dom.codeText.innerHTML = parseCodeMarkup(answer.html);
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
    if (!state.currentAnswer) return;
    const span = e.target.closest(".err-region");

    if (!span) {
      spawnMissMark(e.clientX, e.clientY);
      return;
    }

    const errId = span.dataset.err;
    const errorData = state.currentAnswer.errors.find((er) => er.id === errId);
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
    const total = state.currentAnswer.errors.length;
    dom.foundBadge.textContent = `${state.found.size}/${total} found`;
    dom.findingsBadge.textContent = `${state.found.size}/${total}`;
  }

  // ── Completion ────────────────────────────────────────
  function checkCompletion() {
    const total = state.currentAnswer.errors.length;
    if (state.found.size !== total) return;

    state.solved.add(state.currentProblem.id);
    updateSolvedUI();
    updateProgress();
    saveSolvedState();
    setTimeout(showSuccess, 500);
  }

  function showSuccess() {
    closeToolbar();
    const total = state.currentAnswer.errors.length;
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

    for (const tier of PROBLEM_TIERS) {
      for (const prob of tier.problems) {
        if (startLooking && !state.solved.has(prob.id)) {
          loadProblem(tier, prob);
          found = true;
          break;
        }
        if (prob.id === state.currentProblem.id) startLooking = true;
      }
      if (found) break;
    }

    if (!found) {
      for (const tier of PROBLEM_TIERS) {
        for (const prob of tier.problems) {
          if (!state.solved.has(prob.id)) {
            loadProblem(tier, prob);
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
    if (!state.currentAnswer) return;
    const nextError = state.currentAnswer.errors.find((er) => !state.found.has(er.id));
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

    loadProblem(state.currentTier, state.currentProblem);
    showToast("info", "Problem reset. Every error is hidden again.");
  }

  // ── Solved UI / progress ──────────────────────────────
  function updateSolvedUI() {
    document.querySelectorAll(".problem-item").forEach((el) => {
      el.classList.toggle("solved", state.solved.has(el.dataset.problemId));
    });
  }

  function updateProgress() {
    const total = PROBLEM_TIERS.reduce((sum, tier) => sum + tier.problems.length, 0);
    const solved = state.solved.size;
    const pct = Math.round((solved / total) * 100);

    dom.progressFill.style.width = pct + "%";
    dom.progressCount.textContent = `${solved}/${total}`;

    if (window.WDFBProgress) window.WDFBProgress.setPercent(ACTIVITY_ID, pct);
  }

  // ── Persist solved state to localStorage ─────────────
  function getAllProblemIds() {
    const ids = new Set();
    PROBLEM_TIERS.forEach((tier) => tier.problems.forEach((p) => ids.add(p.id)));
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
  async function init() {
    if (window.WDFBProgress) window.WDFBProgress.markViewed(ACTIVITY_ID);

    await loadAnswers();

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
