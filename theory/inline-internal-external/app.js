/* Inline, Internal, External - lesson logic: three live CSS editors, a preview, and a cascade resolver that works out which declaration wins. */
(function () {
  "use strict";

  const ACTIVITY_ID = "inline-internal-external";
  const STATE_KEY = "inline_internal_external_v1";
  const ORIGINS = ["external", "internal", "inline"];
  const ORIGIN_LABELS = {
    external: "External (styles.css)",
    internal: "Internal (&lt;style&gt;)",
    inline: "Inline (style attribute)",
  };
  const ORIGIN_NOTES = {
    external:
      "A separate file, joined on with &lt;link rel=\"stylesheet\" href=\"styles.css\" /&gt;. Write full rules with selectors.",
    internal:
      "A &lt;style&gt; block in this page's &lt;head&gt;. Same syntax as the file, but it only reaches this page.",
    inline:
      "The style attribute on the &lt;h1 class=\"title\"&gt;. Declarations only, with no selector and no curly brackets.",
  };

  const state = {
    currentStepId: null,
    editors: { external: "", internal: "", inline: "" },
    activeTab: "external",
    choice: null,
    completed: new Set(),
  };

  let previewRoot = null;
  let styleNodes = {};

  const dom = {
    stepList: document.getElementById("stepList"),
    totalCount: document.getElementById("totalCount"),
    progressCount: document.getElementById("progressCount"),
    progressFill: document.getElementById("progressFill"),
    titleBarBadge: document.getElementById("titleBarBadge"),
    titleBarTitle: document.getElementById("titleBarTitle"),
    stepCounter: document.getElementById("stepCounter"),
    activeCountBadge: document.getElementById("activeCountBadge"),
    cascadeTargetBadge: document.getElementById("cascadeTargetBadge"),
    taskStateBadge: document.getElementById("taskStateBadge"),
    btnReset: document.getElementById("btnReset"),
    btnCheck: document.getElementById("btnCheck"),
    btnNext: document.getElementById("btnNext"),
    btnRestart: document.getElementById("btnRestart"),
    teachBody: document.getElementById("teachBody"),
    editorTabs: document.getElementById("editorTabs"),
    editorNote: document.getElementById("editorNote"),
    codeEditor: document.getElementById("codeEditor"),
    editorLocked: document.getElementById("editorLocked"),
    previewStage: document.getElementById("previewStage"),
    cascadeBody: document.getElementById("cascadeBody"),
    taskPanel: document.getElementById("taskPanel"),
    taskText: document.getElementById("taskText"),
    taskChoices: document.getElementById("taskChoices"),
    feedbackNote: document.getElementById("feedbackNote"),
    welcomeState: document.getElementById("welcomeState"),
    welcomeStats: document.getElementById("welcomeStats"),
    workspace: document.getElementById("workspace"),
    completionPanel: document.getElementById("completionPanel"),
    completionText: document.getElementById("completionText"),
  };

  // ── Pure helpers ─────────────────────────────────────
  function escapeHtml(str) {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return String(str).replace(/[&<>"']/g, (c) => map[c]);
  }

  function normaliseValue(v) {
    return String(v).trim().toLowerCase().replace(/\s+/g, " ").replace(/;+$/, "").trim();
  }

  function findStep(id) {
    return LESSON_STEPS.find((s) => s.id === id);
  }

  function stepIndex(id) {
    return LESSON_STEPS.findIndex((s) => s.id === id);
  }

  // ── Cascade resolution ───────────────────────────────
  /** Split a block of CSS text into { selector, decls } rules. */
  function parseRules(cssText) {
    const rules = [];
    const re = /([^{}]+)\{([^{}]*)\}/g;
    let m;
    while ((m = re.exec(cssText)) !== null) {
      const selectors = m[1].split(",").map((s) => s.trim()).filter(Boolean);
      const decls = parseDeclarations(m[2]);
      selectors.forEach((selector) => rules.push({ selector, decls }));
    }
    return rules;
  }

  /** Split "a: b; c: d" into { prop, value, important } entries. */
  function parseDeclarations(text) {
    return String(text)
      .split(";")
      .map((chunk) => chunk.trim())
      .filter(Boolean)
      .map((chunk) => {
        const at = chunk.indexOf(":");
        if (at === -1) return null;
        const prop = chunk.slice(0, at).trim().toLowerCase();
        let value = chunk.slice(at + 1).trim();
        const important = /!\s*important$/i.test(value);
        if (important) value = value.replace(/!\s*important$/i, "").trim();
        return prop && value ? { prop, value, important } : null;
      })
      .filter(Boolean);
  }

  /** Rough CSS specificity as [ids, classes, types]. */
  function specificity(selector) {
    const ids = (selector.match(/#[\w-]+/g) || []).length;
    const classes = (selector.match(/\.[\w-]+|\[[^\]]*\]|:(?!:)[\w-]+(?:\([^)]*\))?/g) || []).length;
    const types = (
      selector
        .replace(/[#.][\w-]+|\[[^\]]*\]|::?[\w-]+(?:\([^)]*\))?/g, " ")
        .match(/[a-zA-Z][\w-]*/g) || []
    ).length;
    return [ids, classes, types];
  }

  function compareEntries(a, b) {
    if (a.important !== b.important) return a.important ? -1 : 1;
    for (let i = 0; i < 4; i++) {
      if (a.weight[i] !== b.weight[i]) return b.weight[i] - a.weight[i];
    }
    return b.order - a.order;
  }

  /**
   * Every declaration of `prop` that reaches `target`, strongest first.
   * External is ordered before internal, matching a head where the
   * <link> sits above the <style> block.
   */
  function resolveCascade(prop, target) {
    const probe = document.createElement("div");
    probe.innerHTML = DEMO_HTML;
    const el = probe.querySelector(target);
    if (!el) return [];

    const entries = [];
    let order = 0;

    ["external", "internal"].forEach((origin) => {
      parseRules(state.editors[origin]).forEach((rule) => {
        let matches = false;
        try {
          matches = el.matches(rule.selector);
        } catch (e) {
          matches = false;
        }
        if (!matches) return;
        rule.decls.forEach((d) => {
          if (d.prop !== prop) return;
          const spec = specificity(rule.selector);
          entries.push({
            origin,
            selector: rule.selector,
            value: d.value,
            important: d.important,
            weight: [0, spec[0], spec[1], spec[2]],
            order: order++,
          });
        });
      });
    });

    parseDeclarations(state.editors.inline).forEach((d) => {
      if (d.prop !== prop) return;
      entries.push({
        origin: "inline",
        selector: "style attribute",
        value: d.value,
        important: d.important,
        weight: [1, 0, 0, 0],
        order: order++,
      });
    });

    return entries.sort(compareEntries);
  }

  function renderCascade() {
    const entries = resolveCascade(CASCADE_PROP, CASCADE_TARGET);
    if (entries.length === 0) {
      dom.cascadeBody.innerHTML = `<p class="cascade-empty">Nothing sets <code>${CASCADE_PROP}</code> on <code>${CASCADE_TARGET}</code> yet, so the browser's default is used.</p>`;
      return;
    }
    dom.cascadeBody.innerHTML = entries
      .map((e, i) => {
        const winner = i === 0;
        return `
        <div class="cascade-row ${winner ? "is-winner" : ""}">
          <span class="cascade-swatch" style="background:${escapeHtml(e.value)}"></span>
          <div class="cascade-main">
            <div class="cascade-origin">${ORIGIN_LABELS[e.origin]}</div>
            <code class="cascade-rule">${escapeHtml(e.selector)} &rarr; ${escapeHtml(
          e.value
        )}${e.important ? " !important" : ""}</code>
          </div>
          <span class="cascade-verdict">${winner ? "WINS" : "overridden"}</span>
        </div>`;
      })
      .join("");
  }

  // ── Preview ──────────────────────────────────────────
  const PREVIEW_BASE = `
    :host { display: block; }
    h1 { font-size: 28px; margin: 0 0 8px; }
    p { margin: 0 0 12px; }
    button { font: inherit; padding: 8px 16px; }
  `;

  function mountPreview() {
    if (!previewRoot) previewRoot = dom.previewStage.attachShadow({ mode: "open" });
    previewRoot.innerHTML = "";

    const base = document.createElement("style");
    base.textContent = PREVIEW_BASE;
    previewRoot.appendChild(base);

    // External first, then internal, so a tie goes to the <style> block.
    styleNodes = {};
    ["external", "internal"].forEach((origin) => {
      const node = document.createElement("style");
      styleNodes[origin] = node;
      previewRoot.appendChild(node);
    });

    const holder = document.createElement("div");
    holder.innerHTML = DEMO_HTML;
    while (holder.firstChild) previewRoot.appendChild(holder.firstChild);
  }

  function refreshPreview() {
    if (!previewRoot) return;
    styleNodes.external.textContent = state.editors.external;
    styleNodes.internal.textContent = state.editors.internal;
    const target = previewRoot.querySelector(CASCADE_TARGET);
    if (target) target.setAttribute("style", state.editors.inline);
    renderCascade();
  }

  // ── Editors ──────────────────────────────────────────
  function renderTabs(step) {
    Array.from(dom.editorTabs.querySelectorAll(".editor-tab")).forEach((tab) => {
      const origin = tab.dataset.origin;
      const enabled = step.enabled.indexOf(origin) !== -1;
      tab.disabled = !enabled;
      tab.classList.toggle("is-active", origin === state.activeTab);
      tab.setAttribute("aria-selected", String(origin === state.activeTab));
    });

    const usable = step.enabled.length;
    dom.activeCountBadge.textContent =
      usable === 0 ? "Read only" : usable === 1 ? "1 editable" : usable + " editable";

    const locked = step.enabled.indexOf(state.activeTab) === -1;
    dom.editorNote.innerHTML = ORIGIN_NOTES[state.activeTab];
    dom.codeEditor.value = state.editors[state.activeTab];
    dom.codeEditor.readOnly = locked;
    dom.codeEditor.hidden = locked && usable === 0 && state.activeTab !== "external";
    dom.editorLocked.hidden = !locked;
  }

  function setActiveTab(origin) {
    state.activeTab = origin;
    const step = findStep(state.currentStepId);
    if (step) renderTabs(step);
  }

  // ── Task checking ────────────────────────────────────
  function renderTask(step) {
    if (!step.task) {
      dom.taskPanel.hidden = true;
      return;
    }
    dom.taskPanel.hidden = false;
    dom.taskText.innerHTML = step.task;
    dom.taskChoices.innerHTML = "";

    if (step.check && step.check.type === "choice") {
      step.check.options.forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "task-choice";
        btn.dataset.choice = opt.id;
        btn.innerHTML = opt.label;
        btn.addEventListener("click", () => {
          state.choice = opt.id;
          Array.from(dom.taskChoices.children).forEach((c) =>
            c.classList.toggle("is-picked", c.dataset.choice === opt.id)
          );
        });
        dom.taskChoices.appendChild(btn);
      });
    }
  }

  function evaluateCheck(step) {
    const check = step.check;
    if (!check) return { ok: true, message: "" };

    if (check.type === "choice") {
      if (!state.choice) return { ok: false, message: "Pick one of the three options first." };
      if (state.choice === check.correct) return { ok: true, message: "" };
      return { ok: false, message: check.wrong[state.choice] || "Not quite. Try another." };
    }

    if (check.type === "declared") {
      const entries = resolveCascade(check.prop, check.target);
      const hit = entries.some((e) => e.origin === check.origin);
      return hit
        ? { ok: true, message: "" }
        : {
            ok: false,
            message: `Nothing in the ${check.origin} editor sets ${check.prop} on ${check.target} yet. Check the panel below the preview: it lists every declaration it can find.`,
          };
    }

    if (check.type === "winner") {
      const entries = resolveCascade(check.prop, CASCADE_TARGET);
      if (entries.length === 0) {
        return { ok: false, message: `Nothing sets ${check.prop} on the heading yet.` };
      }
      const top = entries[0];
      if (top.origin === check.origin && normaliseValue(top.value) === normaliseValue(check.value)) {
        return { ok: true, message: "" };
      }
      return {
        ok: false,
        message: `The winning ${check.prop} is currently ${top.value}, coming from the ${top.origin} CSS. You need the ${check.origin} one to win instead.`,
      };
    }

    return { ok: true, message: "" };
  }

  function handleCheck() {
    const step = findStep(state.currentStepId);
    if (!step) return;
    const result = evaluateCheck(step);

    if (result.ok) {
      state.completed.add(step.id);
      dom.taskStateBadge.textContent = "Done";
      dom.taskStateBadge.classList.add("is-done");
      setFeedback("That is it. " + (step.check && step.check.type === "choice"
        ? "External CSS is the default answer for anything with more than one page."
        : "Have a look at the cascade panel to see how it worked out."), "is-correct");
      dom.btnCheck.hidden = true;
      dom.btnNext.hidden = false;
      dom.btnNext.focus();
      saveState();
      updateProgress();
    } else {
      setFeedback(result.message, "is-wrong");
    }
  }

  function setFeedback(text, className) {
    dom.feedbackNote.textContent = text || "";
    dom.feedbackNote.className = "feedback-note" + (text && className ? " " + className : "");
  }

  // ── Steps rail ───────────────────────────────────────
  function buildWelcomeStats() {
    dom.welcomeStats.innerHTML = [
      { icon: "&#9670;", label: LESSON_STEPS.length + " guided steps" },
      { icon: "&#9670;", label: "3 live CSS editors" },
      { icon: "&#9670;", label: "A cascade panel" },
    ]
      .map(
        (s) => `
        <div class="welcome-stat">
          <div class="welcome-stat-icon">${s.icon}</div>
          <div class="welcome-stat-label">${s.label}</div>
        </div>`
      )
      .join("");
  }

  function buildStepList() {
    dom.stepList.innerHTML = "";
    LESSON_STEPS.forEach((step, i) => {
      const item = document.createElement("div");
      item.className = "problem-item";
      item.dataset.stepId = step.id;
      item.innerHTML = `
        <span class="status-dot"></span>
        <span>${i + 1}. ${step.name}</span>
      `;
      item.addEventListener("click", () => loadStep(step.id));
      dom.stepList.appendChild(item);
    });
    updateRailStates();
  }

  function updateRailStates() {
    Array.from(dom.stepList.children).forEach((el) => {
      const id = el.dataset.stepId;
      el.classList.toggle("solved", state.completed.has(id));
      el.classList.toggle("active", id === state.currentStepId);
    });
  }

  // ── Loading a step ───────────────────────────────────
  function loadStep(id) {
    const step = findStep(id);
    if (!step) return;

    state.currentStepId = id;
    state.editors = Object.assign({ external: "", internal: "", inline: "" }, step.start);
    state.choice = null;
    state.activeTab = step.enabled[0] || "external";

    const i = stepIndex(id);
    dom.titleBarBadge.textContent = step.name;
    dom.titleBarTitle.textContent = step.title;
    dom.stepCounter.textContent = `Step ${i + 1} of ${LESSON_STEPS.length}`;
    dom.cascadeTargetBadge.textContent = `${CASCADE_TARGET} ${CASCADE_PROP}`;
    dom.teachBody.innerHTML = step.teach;

    renderTabs(step);
    renderTask(step);
    mountPreview();
    refreshPreview();

    const done = state.completed.has(id);
    dom.taskStateBadge.textContent = step.check ? (done ? "Done" : "Not done") : "Nothing to do";
    dom.taskStateBadge.classList.toggle("is-done", done || !step.check);
    dom.btnCheck.hidden = !step.check || done;
    dom.btnNext.hidden = !!step.check && !done;
    dom.btnReset.disabled = false;
    setFeedback("");

    if (!step.check) {
      state.completed.add(id);
      saveState();
      updateProgress();
    }

    dom.welcomeState.hidden = true;
    dom.workspace.hidden = false;
    dom.completionPanel.classList.remove("is-visible");
    updateRailStates();
  }

  function handleNext() {
    const i = stepIndex(state.currentStepId);
    if (i < LESSON_STEPS.length - 1) loadStep(LESSON_STEPS[i + 1].id);
    else showCompletion();
  }

  function showCompletion() {
    dom.workspace.hidden = true;
    dom.completionPanel.classList.add("is-visible");
    dom.completionText.textContent =
      "You have written CSS in all three places and watched the cascade decide between them. External for a whole site, internal for one page, inline almost never by hand.";
    state.currentStepId = null;
    dom.btnCheck.hidden = true;
    dom.btnNext.hidden = true;
    dom.btnReset.disabled = true;
    updateRailStates();
  }

  function handleReset() {
    if (state.currentStepId) loadStep(state.currentStepId);
  }

  function restartAll() {
    state.completed = new Set();
    saveState();
    updateProgress();
    dom.completionPanel.classList.remove("is-visible");
    dom.welcomeState.hidden = false;
    dom.workspace.hidden = true;
  }

  // ── Progress ─────────────────────────────────────────
  function updateProgress() {
    const total = LESSON_STEPS.length;
    const done = state.completed.size;
    const pct = Math.round((done / total) * 100);
    dom.progressCount.textContent = `${done}/${total}`;
    dom.progressFill.style.width = pct + "%";
    dom.progressFill.classList.toggle("is-complete", pct >= 100);
    if (window.WDFBProgress) window.WDFBProgress.setPercent(ACTIVITY_ID, pct);
    updateRailStates();
  }

  // ── Persistence ──────────────────────────────────────
  function loadState() {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      const valid = new Set(LESSON_STEPS.map((s) => s.id));
      (saved.completed || []).forEach((id) => valid.has(id) && state.completed.add(id));
    } catch (e) {
      /* ignore */
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify({ completed: [...state.completed] }));
    } catch (e) {
      /* ignore */
    }
  }

  // ── Init ─────────────────────────────────────────────
  function init() {
    if (window.WDFBProgress) window.WDFBProgress.markViewed(ACTIVITY_ID);

    loadState();
    dom.totalCount.textContent = LESSON_STEPS.length;
    buildStepList();
    buildWelcomeStats();
    updateProgress();

    dom.btnCheck.addEventListener("click", handleCheck);
    dom.btnNext.addEventListener("click", handleNext);
    dom.btnReset.addEventListener("click", handleReset);
    dom.btnRestart.addEventListener("click", restartAll);

    dom.editorTabs.addEventListener("click", (e) => {
      const tab = e.target.closest(".editor-tab");
      if (tab && !tab.disabled) setActiveTab(tab.dataset.origin);
    });

    dom.codeEditor.addEventListener("input", () => {
      if (dom.codeEditor.readOnly) return;
      state.editors[state.activeTab] = dom.codeEditor.value;
      refreshPreview();
    });

    // Never auto-load a step; the learner picks one from the rail.
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
