/* Write the Selector - quiz logic: grades a typed selector by the elements it matches, not by its text. */
(function () {
  "use strict";

  const ACTIVITY_ID = "write-the-selector";
  const STATE_KEY = "write_selector_state_v1";
  const TARGET_CLASS = "wts-target";

  const state = {
    currentCategoryId: null,
    currentQuestionId: null,
    currentAnswer: null,
    hintShown: false,
    solved: new Set(),
    attempted: new Set(),
    answersMap: null,
  };

  let previewRoot = null;
  let previewUserStyle = null;

  // ── Decryption ───────────────────────────────────────
  // Split key, to obfuscate the answers against view-source.
  const _kp = ["Wr1t", "3_S3", "l3ct", "0r!9"];
  const _dk = _kp.join("");

  /** Decrypt a XOR-ciphered, base64-encoded { selector, hint, explain }. */
  function decryptAnswer(encoded) {
    const bytes = atob(encoded);
    let result = "";
    for (let i = 0; i < bytes.length; i++) {
      result += String.fromCharCode(bytes.charCodeAt(i) ^ _dk.charCodeAt(i % _dk.length));
    }
    return JSON.parse(result);
  }

  function getAnswer(questionId) {
    if (!state.answersMap || !state.answersMap[questionId]) return null;
    return decryptAnswer(state.answersMap[questionId]);
  }

  async function loadAnswers() {
    try {
      const resp = await fetch("answers.json");
      if (!resp.ok) throw new Error("Failed to load answers");
      state.answersMap = await resp.json();
    } catch (err) {
      console.error("Could not load answers:", err);
    }
  }

  const dom = {
    categoryList: document.getElementById("categoryList"),
    totalCount: document.getElementById("totalCount"),
    progressCount: document.getElementById("progressCount"),
    progressFill: document.getElementById("progressFill"),
    titleBarBadge: document.getElementById("titleBarBadge"),
    titleBarTitle: document.getElementById("titleBarTitle"),
    promptDifficultyBadge: document.getElementById("promptDifficultyBadge"),
    targetCountBadge: document.getElementById("targetCountBadge"),
    previewStateBadge: document.getElementById("previewStateBadge"),
    btnReset: document.getElementById("btnReset"),
    btnHint: document.getElementById("btnHint"),
    btnCheck: document.getElementById("btnCheck"),
    btnNext: document.getElementById("btnNext"),
    briefBody: document.getElementById("briefBody"),
    promptHtml: document.getElementById("promptHtml"),
    selectorInput: document.getElementById("selectorInput"),
    declLines: document.getElementById("declLines"),
    previewStage: document.getElementById("previewStage"),
    feedbackNote: document.getElementById("feedbackNote"),
    welcomeState: document.getElementById("welcomeState"),
    welcomeStats: document.getElementById("welcomeStats"),
    workspace: document.getElementById("workspace"),
    completionPanel: document.getElementById("completionPanel"),
    completionScoreText: document.getElementById("completionScoreText"),
    btnRestart: document.getElementById("btnRestart"),
  };

  // ── Pure helpers ─────────────────────────────────────
  function escapeHtml(str) {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return str.replace(/[&<>"']/g, (c) => map[c]);
  }

  /** Simple syntax highlighter for a small HTML snippet. */
  function highlightHtml(source) {
    return escapeHtml(source).replace(
      /(&lt;\/?)([\w-]+)((?:\s+[\w-]+(?:=&quot;[^&]*?&quot;)?)*\s*\/?)(&gt;)/g,
      (match, open, tag, attrs, close) => {
        let out = `<span class="tag">${open}${tag}</span>`;
        if (attrs) {
          out += attrs.replace(
            /([\w-]+)(=)(&quot;)(.*?)(&quot;)/g,
            '<span class="attr">$1</span>$2<span class="string">$3$4$5</span>'
          );
        }
        return out + `<span class="tag">${close}</span>`;
      }
    );
  }

  /** A detached copy of the question's markup, used for grading only. */
  function buildCleanRoot(question) {
    const root = document.createElement("div");
    root.innerHTML = question.html;
    return root;
  }

  /** Run a selector against a root, returning null if it is not valid CSS. */
  function matchOrNull(root, selector) {
    try {
      return Array.from(root.querySelectorAll(selector));
    } catch (e) {
      return null;
    }
  }

  function sameElements(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  function describeElement(el) {
    const cls = String(el.className || "").trim();
    return el.tagName.toLowerCase() + (cls ? "." + cls.split(/\s+/).join(".") : "");
  }

  function plural(n, word) {
    return n + " " + word + (n === 1 ? "" : "s");
  }

  // ── Rendering the CSS block ──────────────────────────
  function renderDeclarations(question) {
    dom.declLines.innerHTML = "";
    question.declarations.split("\n").forEach((line) => {
      const row = document.createElement("div");
      row.className = "code-line";
      const match = line.trim().match(/^([\w-]+)\s*:\s*(.+?);?$/);
      row.innerHTML = match
        ? `  <span class="attr">${escapeHtml(match[1])}</span>: <span class="string">${escapeHtml(
            match[2]
          )}</span>;`
        : escapeHtml(line);
      dom.declLines.appendChild(row);
    });
  }

  // ── Preview ──────────────────────────────────────────
  const PREVIEW_BASE = `
    :host { display: block; }
    ul { padding-left: 20px; }
    li { margin: 2px 0; }
    a { color: #1d4ed8; }
    input { margin: 4px 6px 4px 0; }
    .${TARGET_CLASS} {
      outline: 2px dashed #64748b;
      outline-offset: 2px;
    }
  `;

  /** Render the markup, outlining the elements the learner has to reach. */
  function mountPreview(question, answer) {
    if (!previewRoot) previewRoot = dom.previewStage.attachShadow({ mode: "open" });
    previewRoot.innerHTML = "";

    const base = document.createElement("style");
    base.textContent = PREVIEW_BASE;
    previewRoot.appendChild(base);

    previewUserStyle = document.createElement("style");
    previewRoot.appendChild(previewUserStyle);

    const holder = document.createElement("div");
    holder.innerHTML = question.html;
    const targets = matchOrNull(holder, answer.selector) || [];
    targets.forEach((el) => el.classList.add(TARGET_CLASS));
    while (holder.firstChild) previewRoot.appendChild(holder.firstChild);
  }

  /** Apply the learner's rule and drop the target outlines. */
  function revealStyling(question, selector) {
    previewUserStyle.textContent = `${selector} {\n${question.declarations}\n}`;
    previewRoot.querySelectorAll("." + TARGET_CLASS).forEach((el) => {
      el.classList.remove(TARGET_CLASS);
    });
    dom.previewStateBadge.textContent = "Styling applied";
  }

  // ── Marking ──────────────────────────────────────────
  function handleCheck() {
    const question = findQuestion(state.currentQuestionId);
    if (!question || !state.currentAnswer) return;

    const typed = dom.selectorInput.value.trim();
    if (typed === "") {
      return setFeedback("Write a selector in the blank, then check again.", "is-wrong");
    }

    const root = buildCleanRoot(question);
    const expected = matchOrNull(root, state.currentAnswer.selector) || [];
    const got = matchOrNull(root, typed);

    state.attempted.add(question.id);
    dom.selectorInput.classList.remove("is-correct", "is-wrong");

    if (got === null) {
      dom.selectorInput.classList.add("is-wrong");
      setFeedback(
        "That is not a valid CSS selector, so the browser cannot use it at all. Check for a stray character or an unclosed bracket.",
        "is-wrong"
      );
    } else if (sameElements(expected, got)) {
      dom.selectorInput.classList.add("is-correct");
      dom.selectorInput.readOnly = true;
      state.solved.add(question.id);
      revealStyling(question, typed);
      setFeedback(state.currentAnswer.explain, "is-correct");
      dom.btnCheck.hidden = true;
      dom.btnNext.hidden = false;
      dom.btnHint.disabled = true;
      dom.btnNext.focus();
    } else {
      dom.selectorInput.classList.add("is-wrong");
      setFeedback(missMessage(expected, got, root), "is-wrong");
      dom.selectorInput.focus();
    }

    saveState();
    updateProgress();
  }

  /**
   * Say how the match missed, since "wrong" alone teaches nothing about a
   * selector that is close.
   */
  function missMessage(expected, got, root) {
    if (got.length === 0) {
      return "That selector matches nothing at all on this page. Check the spelling, and check whether you need a dot for a class or a hash for an id.";
    }
    const extra = got.filter((el) => expected.indexOf(el) === -1);
    const missing = expected.filter((el) => got.indexOf(el) === -1);
    const total = root.querySelectorAll("*").length;

    if (extra.length && !missing.length) {
      return `Close. You reached all ${plural(
        expected.length,
        "target"
      )}, but caught ${plural(extra.length, "extra element")} as well (${extra
        .slice(0, 3)
        .map(describeElement)
        .join(", ")}). Narrow it down.`;
    }
    if (missing.length && !extra.length) {
      return `Close. Everything you matched is a target, but you missed ${plural(
        missing.length,
        "of them"
      )}. Widen it out.`;
    }
    if (got.length === total) {
      return "That matches every element on the page. Something more specific is needed.";
    }
    return `That matches ${plural(got.length, "element")}, but the ${plural(
      expected.length,
      "target"
    )} are different ones. Look again at which elements are outlined.`;
  }

  function handleHint() {
    if (!state.currentAnswer) return;
    setFeedback("Hint: " + state.currentAnswer.hint, "is-hint");
    dom.selectorInput.focus();
  }

  function handleReset() {
    const question = findQuestion(state.currentQuestionId);
    if (!question) return;
    loadQuestion(findCategory(state.currentCategoryId), question, true);
  }

  function setFeedback(text, className) {
    dom.feedbackNote.textContent = text || "";
    dom.feedbackNote.className = "feedback-note" + (text && className ? " " + className : "");
  }

  // ── Lookup ───────────────────────────────────────────
  function allQuestions() {
    const flat = [];
    WRITE_SELECTOR_CATEGORIES.forEach((category) => {
      category.questions.forEach((question) => flat.push({ category, question }));
    });
    return flat;
  }

  function totalQuestions() {
    return allQuestions().length;
  }

  function findQuestion(id) {
    const hit = allQuestions().find((item) => item.question.id === id);
    return hit ? hit.question : null;
  }

  function findCategory(id) {
    return WRITE_SELECTOR_CATEGORIES.find((c) => c.id === id);
  }

  /** Next unsolved question after the current one, wrapping to the start. */
  function findNextUnsolved() {
    const flat = allQuestions();
    const from = flat.findIndex((item) => item.question.id === state.currentQuestionId);
    for (let i = from + 1; i < flat.length; i++) {
      if (!state.solved.has(flat[i].question.id)) return flat[i];
    }
    for (let i = 0; i <= from && i < flat.length; i++) {
      if (!state.solved.has(flat[i].question.id)) return flat[i];
    }
    return null;
  }

  // ── Sidebar ──────────────────────────────────────────
  function buildWelcomeStats() {
    dom.welcomeStats.innerHTML = WRITE_SELECTOR_CATEGORIES.map(
      (category) => `
        <div class="welcome-stat">
          <div class="welcome-stat-icon">&#9670;</div>
          <div class="welcome-stat-label">${category.questions.length} ${category.name}</div>
        </div>
      `
    ).join("");
  }

  function buildSidebar() {
    dom.categoryList.innerHTML = "";

    WRITE_SELECTOR_CATEGORIES.forEach((category, catIdx) => {
      const group = document.createElement("div");
      group.className = "category-group";

      const header = document.createElement("div");
      header.className = "category-header" + (catIdx === 0 ? " expanded" : "");
      header.innerHTML = `
        <span>${category.name}</span>
        <span class="category-count">(${category.questions.length})</span>
        <span class="cat-chevron">&#9656;</span>
      `;

      const list = document.createElement("div");
      list.className = "category-problems" + (catIdx === 0 ? " open" : "");

      category.questions.forEach((question, qIdx) => {
        const item = document.createElement("div");
        item.className = "problem-item";
        item.dataset.questionId = question.id;
        item.dataset.categoryId = category.id;
        item.innerHTML = `
          <span class="status-dot"></span>
          <span>Problem ${qIdx + 1}</span>
        `;
        item.addEventListener("click", () => loadQuestion(category, question));
        list.appendChild(item);
      });

      header.addEventListener("click", () => {
        header.classList.toggle("expanded");
        list.classList.toggle("open");
      });

      group.appendChild(header);
      group.appendChild(list);
      dom.categoryList.appendChild(group);
    });

    updateSidebarStates();
  }

  function updateSidebarStates() {
    document.querySelectorAll(".problem-item").forEach((el) => {
      const id = el.dataset.questionId;
      el.classList.toggle("solved", state.solved.has(id));
      el.classList.toggle("started", state.attempted.has(id) && !state.solved.has(id));
      el.classList.toggle("active", id === state.currentQuestionId);
    });
  }

  function setDifficultyBadge(el, difficulty) {
    el.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    el.classList.remove("difficulty-easy", "difficulty-medium", "difficulty-hard");
    el.classList.add(`difficulty-${difficulty}`);
  }

  // ── Loading a question ───────────────────────────────
  function loadQuestion(category, question, forceFresh) {
    const answer = getAnswer(question.id);
    if (!answer) {
      console.error("No answer data available for question", question.id);
      return;
    }

    state.currentCategoryId = category.id;
    state.currentQuestionId = question.id;
    state.currentAnswer = answer;
    state.hintShown = false;

    const idx = category.questions.findIndex((q) => q.id === question.id);
    dom.titleBarBadge.textContent = category.name;
    dom.titleBarBadge.style.background = category.color + "22";
    dom.titleBarBadge.style.color = category.color;
    dom.titleBarTitle.textContent = `Problem ${idx + 1}`;
    setDifficultyBadge(dom.promptDifficultyBadge, question.difficulty);

    const targetCount = (matchOrNull(buildCleanRoot(question), answer.selector) || []).length;
    dom.targetCountBadge.textContent = plural(targetCount, "target");
    dom.previewStateBadge.textContent = "Targets outlined";

    dom.briefBody.innerHTML = question.brief;
    dom.promptHtml.innerHTML = highlightHtml(question.html);
    renderDeclarations(question);
    mountPreview(question, answer);

    const alreadySolved = !forceFresh && state.solved.has(question.id);
    dom.selectorInput.value = alreadySolved ? answer.selector : "";
    dom.selectorInput.readOnly = alreadySolved;
    dom.selectorInput.classList.toggle("is-correct", alreadySolved);
    dom.selectorInput.classList.remove("is-wrong");

    if (alreadySolved) {
      revealStyling(question, answer.selector);
      setFeedback(answer.explain, "is-correct");
      dom.btnCheck.hidden = true;
      dom.btnNext.hidden = false;
      dom.btnHint.disabled = true;
    } else {
      setFeedback("");
      dom.btnCheck.hidden = false;
      dom.btnNext.hidden = true;
      dom.btnHint.disabled = false;
    }

    dom.btnCheck.disabled = false;
    dom.btnReset.disabled = false;
    dom.welcomeState.hidden = true;
    dom.workspace.hidden = false;
    dom.completionPanel.classList.remove("is-visible");

    updateSidebarStates();
    if (!alreadySolved) dom.selectorInput.focus();
  }

  function handleNext() {
    const next = findNextUnsolved();
    if (next) loadQuestion(next.category, next.question);
    else showCompletion();
  }

  function showCompletion() {
    dom.workspace.hidden = true;
    dom.completionPanel.classList.add("is-visible");
    dom.completionScoreText.textContent = `You have written a working selector for all ${totalQuestions()} problems, across all three groups.`;
    state.currentQuestionId = null;
    state.currentCategoryId = null;
    dom.btnCheck.disabled = true;
    dom.btnHint.disabled = true;
    dom.btnReset.disabled = true;
    dom.btnNext.hidden = true;
    updateSidebarStates();
  }

  function restartAll() {
    state.solved = new Set();
    state.attempted = new Set();
    saveState();
    updateProgress();
    dom.completionPanel.classList.remove("is-visible");
    dom.welcomeState.hidden = false;
    dom.workspace.hidden = true;
  }

  // ── Progress ─────────────────────────────────────────
  function updateProgress() {
    const total = totalQuestions();
    const solved = state.solved.size;
    const pct = Math.round((solved / total) * 100);

    dom.progressCount.textContent = `${solved}/${total}`;
    dom.progressFill.style.width = pct + "%";
    dom.progressFill.classList.toggle("is-complete", pct >= 100);

    if (window.WDFBProgress) window.WDFBProgress.setPercent(ACTIVITY_ID, pct);
    updateSidebarStates();
  }

  // ── Persistence ──────────────────────────────────────
  function loadState() {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      const valid = new Set(allQuestions().map((item) => item.question.id));
      (saved.solved || []).forEach((id) => valid.has(id) && state.solved.add(id));
      (saved.attempted || []).forEach((id) => valid.has(id) && state.attempted.add(id));
    } catch (e) {
      /* ignore */
    }
  }

  function saveState() {
    try {
      localStorage.setItem(
        STATE_KEY,
        JSON.stringify({ solved: [...state.solved], attempted: [...state.attempted] })
      );
    } catch (e) {
      /* ignore */
    }
  }

  // ── Init ─────────────────────────────────────────────
  async function init() {
    if (window.WDFBProgress) window.WDFBProgress.markViewed(ACTIVITY_ID);

    await loadAnswers();
    loadState();

    dom.totalCount.textContent = totalQuestions();
    dom.progressCount.textContent = `${state.solved.size}/${totalQuestions()}`;
    buildSidebar();
    buildWelcomeStats();
    updateProgress();

    dom.btnCheck.addEventListener("click", handleCheck);
    dom.btnHint.addEventListener("click", handleHint);
    dom.btnReset.addEventListener("click", handleReset);
    dom.btnNext.addEventListener("click", handleNext);
    dom.btnRestart.addEventListener("click", restartAll);

    dom.selectorInput.addEventListener("input", () => {
      dom.selectorInput.classList.remove("is-wrong");
    });

    // Enter checks the answer.
    dom.selectorInput.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      if (!dom.btnNext.hidden) handleNext();
      else handleCheck();
    });

    // Never auto-load a problem; the learner picks one from the sidebar.
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
