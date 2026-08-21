/* Complete the CSS - quiz logic: renders the blanks, marks them and drives the live preview. */
(function () {
  "use strict";

  const ACTIVITY_ID = "complete-the-css";
  const STATE_KEY = "complete_css_state_v1";

  // Starting width of each kind of blank, in characters.
  const BLANK_WIDTH = { property: 16, value: 14 };

  const state = {
    currentCategoryId: null,
    currentQuestionId: null,
    currentAnswer: null, // decrypted { blanks, explain } for the loaded question
    hintIndex: 0,
    solved: new Set(),
    attempted: new Set(),
    answersMap: null, // loaded from answers.json, still encrypted per question id
  };

  let previewRoot = null; // the preview's shadow root
  let previewStyle = null; // the <style> node inside it holding the learner's CSS

  // ── Decryption ───────────────────────────────────────
  // Split key, to obfuscate the answers against view-source.
  const _kp = ["Fi11", "_Bl@", "nk_C", "ss7#"];
  const _dk = _kp.join("");

  /** Decrypt a XOR-ciphered, base64-encoded { blanks, explain }. */
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
    blankCountBadge: document.getElementById("blankCountBadge"),
    btnReset: document.getElementById("btnReset"),
    btnHint: document.getElementById("btnHint"),
    btnCheck: document.getElementById("btnCheck"),
    btnNext: document.getElementById("btnNext"),
    briefBody: document.getElementById("briefBody"),
    promptHtml: document.getElementById("promptHtml"),
    cssEditor: document.getElementById("cssEditor"),
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

  /** Put a typed answer into the single form answers are compared in. */
  function normalise(str) {
    return String(str)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/\s*;+\s*$/, "")
      .replace(/\s*,\s*/g, ", ")
      .trim();
  }

  /** Simple syntax highlighter for a small HTML snippet. */
  function highlightHtml(source) {
    return escapeHtml(source).replace(
      /(&lt;\/?)([\w-]+)((?:\s+[\w-]+(?:=&quot;[^&]*?&quot;)?)*\s*\/?)(&gt;)/g,
      (match, open, tag, attrs, close) => {
        let highlighted = `<span class="tag">${open}${tag}</span>`;
        if (attrs) {
          highlighted += attrs.replace(
            /([\w-]+)(=)(&quot;)(.*?)(&quot;)/g,
            '<span class="attr">$1</span>$2<span class="string">$3$4$5</span>'
          );
        }
        highlighted += `<span class="tag">${close}</span>`;
        return highlighted;
      }
    );
  }

  /** True for anything that reads as a colour worth showing a swatch of. */
  function colourSwatchFor(value) {
    const match = String(value).match(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/);
    return match ? match[0] : null;
  }

  /** Build a small swatch showing what a colour value looks like. */
  function makeSwatch(colour) {
    const swatch = document.createElement("span");
    swatch.className = "color-swatch";
    swatch.style.background = colour;
    swatch.title = colour;
    return swatch;
  }

  // ── Building the CSS editor ──────────────────────────
  function makeSpan(className, text) {
    const el = document.createElement("span");
    el.className = className;
    el.textContent = text;
    return el;
  }

  function makeBlankInput(blankId, kind) {
    const input = document.createElement("input");
    input.type = "text";
    input.className = `blank blank-${kind}`;
    input.dataset.blank = blankId;
    input.dataset.kind = kind;
    input.autocomplete = "off";
    input.spellcheck = false;
    input.setAttribute(
      "aria-label",
      kind === "property" ? "Missing property name" : "Missing value"
    );
    input.placeholder = kind === "property" ? "property" : "value";
    input.style.width = BLANK_WIDTH[kind] + "ch";
    return input;
  }

  /** Grow a blank past its base width once the typing outruns it. */
  function fitBlankWidth(input) {
    const base = BLANK_WIDTH[input.dataset.kind];
    input.style.width = Math.max(base, input.value.length + 2) + "ch";
  }

  function buildCssEditor(question) {
    dom.cssEditor.innerHTML = "";

    question.rules.forEach((rule, ruleIdx) => {
      if (ruleIdx > 0) dom.cssEditor.appendChild(makeLine([document.createTextNode("")]));

      dom.cssEditor.appendChild(
        makeLine([makeSpan("keyword", rule.selector), document.createTextNode(" {")])
      );

      rule.decls.forEach((decl) => {
        const parts = [document.createTextNode("  ")];

        if (decl.propBlank) {
          parts.push(makeBlankInput(decl.propBlank, "property"));
        } else {
          parts.push(makeSpan("attr", decl.prop));
        }

        parts.push(document.createTextNode(": "));

        if (decl.valueBlank) {
          parts.push(makeBlankInput(decl.valueBlank, "value"));
          // Slot that refreshValueSwatches() fills with a live colour swatch.
          const slot = document.createElement("span");
          slot.className = "swatch-slot";
          slot.dataset.for = decl.valueBlank;
          parts.push(slot);
        } else {
          parts.push(makeSpan("string", decl.value));
          const colour = colourSwatchFor(decl.value);
          if (colour) parts.push(makeSwatch(colour));
        }

        parts.push(document.createTextNode(";"));
        dom.cssEditor.appendChild(makeLine(parts));
      });

      dom.cssEditor.appendChild(makeLine([document.createTextNode("}")]));
    });
  }

  function makeLine(nodes) {
    const line = document.createElement("div");
    line.className = "code-line";
    nodes.forEach((n) => line.appendChild(n));
    return line;
  }

  function getBlankInputs() {
    return Array.from(dom.cssEditor.querySelectorAll("input.blank"));
  }

  function readBlanks() {
    const values = {};
    getBlankInputs().forEach((input) => {
      values[input.dataset.blank] = input.value;
    });
    return values;
  }

  // ── Live preview ─────────────────────────────────────
  /** Turn the rules plus whatever is typed into CSS text, dropping unfilled declarations. */
  function buildCssText(question, values) {
    return question.rules
      .map((rule) => {
        const body = rule.decls
          .map((decl) => {
            const prop = decl.propBlank ? (values[decl.propBlank] || "").trim() : decl.prop;
            const value = decl.valueBlank
              ? (values[decl.valueBlank] || "").trim()
              : decl.value;
            if (!prop || !value) return null;
            return `  ${prop}: ${value};`;
          })
          .filter(Boolean)
          .join("\n");
        return `${rule.selector} {\n${body}\n}`;
      })
      .join("\n\n");
  }

  function mountPreview(question) {
    if (!previewRoot) previewRoot = dom.previewStage.attachShadow({ mode: "open" });

    previewRoot.innerHTML = "";
    previewStyle = document.createElement("style");
    previewRoot.appendChild(previewStyle);

    // The question's own markup, which is the element being styled.
    const holder = document.createElement("div");
    holder.innerHTML = question.html;
    while (holder.firstChild) previewRoot.appendChild(holder.firstChild);
  }

  function refreshPreview(question) {
    if (!previewStyle) return;
    previewStyle.textContent = buildCssText(question, readBlanks());
  }

  /** Show a swatch beside a value blank once what's typed reads as a colour. */
  function refreshValueSwatches() {
    getBlankInputs().forEach((input) => {
      if (input.dataset.kind !== "value") return;
      const slot = dom.cssEditor.querySelector(
        `.swatch-slot[data-for="${input.dataset.blank}"]`
      );
      if (!slot) return;
      const colour = colourSwatchFor(input.value);
      slot.innerHTML = "";
      if (colour) slot.appendChild(makeSwatch(colour));
    });
  }

  // ── Marking ──────────────────────────────────────────
  /** Name the specific slip behind a nearly-right answer, or return null. */
  function diagnose(typed, accept) {
    const value = normalise(typed);

    const americanised = value.replace(/colour/g, "color").replace(/centre/g, "center");
    if (americanised !== value && accept.includes(americanised)) {
      return "Close. CSS always uses the American spelling, so it is “color” and “center”, even in Australia.";
    }

    if (/^[0-9a-f]{3,8}$/.test(value) && accept.includes("#" + value)) {
      return "Close. A hex colour needs a # in front of it, otherwise CSS has no idea it is a colour.";
    }

    if (/^-?[\d.]+$/.test(value)) {
      const withUnit = accept.find((a) => a.startsWith(value) && a !== value);
      if (withUnit) {
        return "Close. That is the right number, but a length needs its unit joined onto the end of it.";
      }
    }

    if (value.includes(",") && accept.some((a) => a === value.replace(/, /g, " "))) {
      return "Close. Those parts are separated by spaces, not commas. Commas would make the whole declaration invalid.";
    }

    return null;
  }

  function clearMarks() {
    getBlankInputs().forEach((input) => {
      input.classList.remove("is-correct", "is-wrong");
      input.readOnly = false;
    });
  }

  function handleCheck() {
    const question = findQuestion(state.currentQuestionId);
    if (!question || !state.currentAnswer) return;

    const inputs = getBlankInputs();
    const blanks = state.currentAnswer.blanks;
    let correctCount = 0;
    let emptyCount = 0;
    let firstWrong = null;

    inputs.forEach((input) => {
      const accept = (blanks[input.dataset.blank] || {}).accept || [];
      const value = normalise(input.value);
      input.classList.remove("is-correct", "is-wrong");

      if (value === "") {
        emptyCount++;
        return;
      }
      if (accept.includes(value)) {
        input.classList.add("is-correct");
        input.readOnly = true;
        correctCount++;
        return;
      }
      input.classList.add("is-wrong");
      if (!firstWrong) firstWrong = { input, accept };
    });

    state.attempted.add(question.id);

    if (correctCount === inputs.length) {
      state.solved.add(question.id);
      setFeedback(state.currentAnswer.explain, "is-correct");
      dom.btnCheck.hidden = true;
      dom.btnNext.hidden = false;
      dom.btnHint.disabled = true;
      dom.btnNext.focus();
    } else if (emptyCount > 0) {
      setFeedback(
        emptyCount === inputs.length
          ? "Nothing filled in yet. Type an answer into every blank, then check again."
          : `${emptyCount} of the ${inputs.length} blanks are still empty. Fill them all in, then check again.`,
        "is-wrong"
      );
    } else {
      const detail = firstWrong ? diagnose(firstWrong.input.value, firstWrong.accept) : null;
      const tally =
        inputs.length === 1
          ? "Not quite."
          : `${correctCount} of ${inputs.length} right. The blanks outlined in red need another look.`;
      setFeedback(detail ? `${tally} ${detail}` : `${tally} Press Hint if you want a nudge.`, "is-wrong");
      if (firstWrong) firstWrong.input.focus();
    }

    saveState();
    updateProgress();
  }

  function handleHint() {
    const blanks = state.currentAnswer ? state.currentAnswer.blanks : null;
    if (!blanks) return;

    // Walk the blanks that aren't right yet, one per press.
    const pending = getBlankInputs().filter((i) => !i.classList.contains("is-correct"));
    if (pending.length === 0) return;

    const input = pending[state.hintIndex % pending.length];
    state.hintIndex++;

    const blank = blanks[input.dataset.blank] || {};
    const which =
      input.dataset.kind === "property" ? "the missing property" : "the missing value";
    setFeedback(
      pending.length > 1
        ? `Hint for ${which} on the highlighted line: ${blank.hint}`
        : `Hint: ${blank.hint}`,
      "is-hint"
    );

    getBlankInputs().forEach((i) => i.classList.remove("is-hinted"));
    input.classList.add("is-hinted");
    input.focus();
  }

  function handleReset() {
    const question = findQuestion(state.currentQuestionId);
    if (!question) return;
    clearMarks();
    getBlankInputs().forEach((input) => {
      input.value = "";
      input.classList.remove("is-hinted");
      fitBlankWidth(input);
    });
    state.hintIndex = 0;
    setFeedback("");
    dom.btnCheck.hidden = false;
    dom.btnNext.hidden = true;
    dom.btnHint.disabled = false;
    refreshValueSwatches();
    refreshPreview(question);
  }

  function setFeedback(text, className) {
    dom.feedbackNote.textContent = text || "";
    dom.feedbackNote.className = "feedback-note" + (text && className ? " " + className : "");
  }

  // ── Category/question lookup ─────────────────────────
  function allQuestions() {
    const flat = [];
    COMPLETE_CSS_CATEGORIES.forEach((category) => {
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

  /** Next unsolved question after the current one, wrapping to the start. */
  function findNextUnsolved() {
    const flat = allQuestions();
    const fromIndex = flat.findIndex((item) => item.question.id === state.currentQuestionId);
    for (let i = fromIndex + 1; i < flat.length; i++) {
      if (!state.solved.has(flat[i].question.id)) return flat[i];
    }
    for (let i = 0; i <= fromIndex && i < flat.length; i++) {
      if (!state.solved.has(flat[i].question.id)) return flat[i];
    }
    return null;
  }

  function countBlanks(question) {
    let count = 0;
    question.rules.forEach((rule) =>
      rule.decls.forEach((decl) => {
        if (decl.propBlank) count++;
        if (decl.valueBlank) count++;
      })
    );
    return count;
  }

  // ── Sidebar ──────────────────────────────────────────
  function buildWelcomeStats() {
    dom.welcomeStats.innerHTML = COMPLETE_CSS_CATEGORIES.map(
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

    COMPLETE_CSS_CATEGORIES.forEach((category, catIdx) => {
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
  function loadQuestion(category, question) {
    const answer = getAnswer(question.id);
    if (!answer) {
      console.error("No answer data available for question", question.id);
      return;
    }

    state.currentCategoryId = category.id;
    state.currentQuestionId = question.id;
    state.currentAnswer = answer;
    state.hintIndex = 0;

    const indexInCategory = category.questions.findIndex((q) => q.id === question.id);
    dom.titleBarBadge.textContent = category.name;
    dom.titleBarBadge.style.background = category.color + "22";
    dom.titleBarBadge.style.color = category.color;
    dom.titleBarTitle.textContent = `Problem ${indexInCategory + 1}`;
    setDifficultyBadge(dom.promptDifficultyBadge, question.difficulty);

    const blankCount = countBlanks(question);
    dom.blankCountBadge.textContent = blankCount === 1 ? "1 blank" : `${blankCount} blanks`;

    dom.briefBody.textContent = question.brief;
    dom.promptHtml.innerHTML = highlightHtml(question.html);

    buildCssEditor(question);
    mountPreview(question);

    // A solved problem comes back filled in and marked.
    if (state.solved.has(question.id)) {
      getBlankInputs().forEach((input) => {
        const accept = (answer.blanks[input.dataset.blank] || {}).accept || [];
        input.value = accept[0] || "";
        input.classList.add("is-correct");
        input.readOnly = true;
        fitBlankWidth(input);
      });
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

    refreshValueSwatches();
    refreshPreview(question);

    dom.welcomeState.hidden = true;
    dom.workspace.hidden = false;
    dom.completionPanel.classList.remove("is-visible");

    updateSidebarStates();

    const firstEditable = getBlankInputs().find((i) => !i.readOnly);
    if (firstEditable) firstEditable.focus();
  }

  function handleNext() {
    const next = findNextUnsolved();
    if (next) {
      loadQuestion(next.category, next.question);
    } else {
      showCompletion();
    }
  }

  function showCompletion() {
    dom.workspace.hidden = true;
    dom.completionPanel.classList.add("is-visible");
    dom.completionScoreText.textContent = `You have completed all ${totalQuestions()} problems, across all four topics.`;
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
      const validIds = new Set(allQuestions().map((item) => item.question.id));
      (saved.solved || []).forEach((id) => {
        if (validIds.has(id)) state.solved.add(id);
      });
      (saved.attempted || []).forEach((id) => {
        if (validIds.has(id)) state.attempted.add(id);
      });
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

    // One delegated listener, since the blanks are rebuilt per question.
    dom.cssEditor.addEventListener("input", (e) => {
      if (!e.target.classList.contains("blank")) return;
      const question = findQuestion(state.currentQuestionId);
      if (!question) return;
      e.target.classList.remove("is-wrong");
      fitBlankWidth(e.target);
      refreshValueSwatches();
      refreshPreview(question);
    });

    // Enter checks the answer.
    dom.cssEditor.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" || !e.target.classList.contains("blank")) return;
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
