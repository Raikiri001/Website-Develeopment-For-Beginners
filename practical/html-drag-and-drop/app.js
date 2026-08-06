/**
 * HTML Structure Trainer - Main Application Logic
 * Handles drag-and-drop with insertion indicators, live preview,
 * encrypted solution checking, hints, and UI state.
 */

(function () {
  "use strict";

  const ACTIVITY_ID = "html-drag-and-drop";

  // ── Developer Guard ──────────────────────────────────
  const devGuard = {
    overlay: null,
    timeout: null,

    init() {
      this.overlay = document.getElementById("devGuardOverlay");

      // Block right-click
      document.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        this.flash();
      });

      // Block common dev tool shortcuts
      document.addEventListener("keydown", (e) => {
        const blocked =
          e.key === "F12" ||
          (e.ctrlKey && e.shiftKey && e.key === "I") ||
          (e.ctrlKey && e.shiftKey && e.key === "J") ||
          (e.ctrlKey && e.key === "u") ||
          (e.metaKey && e.altKey && e.key === "i") ||
          (e.metaKey && e.altKey && e.key === "j") ||
          (e.metaKey && e.key === "u");

        if (blocked) {
          e.preventDefault();
          this.flash();
        }
      });
    },

    flash() {
      clearTimeout(this.timeout);
      this.overlay.classList.add("show");
      this.timeout = setTimeout(() => {
        this.overlay.classList.remove("show");
      }, 2500);
    },
  };

  // ── Decryption ───────────────────────────────────────
  // Key is split to make casual inspection harder. This is obfuscation
  // against peeking at view-source, not real security.
  const _kp = ["N5_", "Str@", "ct_P", "r0b!"];
  const _dk = _kp.join("");

  /** Decrypt a XOR-ciphered, base64-encoded solution string. */
  function decryptSolution(encoded) {
    const bytes = atob(encoded);
    let result = "";
    for (let i = 0; i < bytes.length; i++) {
      result += String.fromCharCode(
        bytes.charCodeAt(i) ^ _dk.charCodeAt(i % _dk.length)
      );
    }
    return JSON.parse(result);
  }

  // ── State ────────────────────────────────────────────
  const state = {
    currentProblem: null,
    currentCategory: null,
    blocks: [],
    solved: new Set(),
    dragSrcIndex: null,
    hintsUsed: 0,
    solutionsMap: null, // loaded from solutions.json
  };

  // ── DOM References ───────────────────────────────────
  const dom = {
    categoryList: document.getElementById("categoryList"),
    codeArea: document.getElementById("codeArea"),
    previewFrame: document.getElementById("previewFrame"),
    titleBarTitle: document.getElementById("titleBarTitle"),
    titleBarBadge: document.getElementById("titleBarBadge"),
    descText: document.getElementById("descText"),
    blockCount: document.getElementById("blockCount"),
    statusProblem: document.getElementById("statusProblem"),
    statusCategory: document.getElementById("statusCategory"),
    statusBlocks: document.getElementById("statusBlocks"),
    progressFill: document.getElementById("progressFill"),
    progressCount: document.getElementById("progressCount"),
    successOverlay: document.getElementById("successOverlay"),
    confettiContainer: document.getElementById("confettiContainer"),
    toastContainer: document.getElementById("toastContainer"),
    btnCheck: document.getElementById("btnCheck"),
    btnHint: document.getElementById("btnHint"),
    btnReset: document.getElementById("btnReset"),
    welcomeState: document.getElementById("welcomeState"),
    workspaceArea: document.getElementById("workspaceArea"),
    sidebar: document.getElementById("sidebar"),
    sidebarOverlay: document.getElementById("sidebarOverlay"),
    mobileToggle: document.getElementById("mobileToggle"),
  };

  // ── Helpers ──────────────────────────────────────────
  function getSolution(problemId) {
    if (!state.solutionsMap || !state.solutionsMap[problemId]) return null;
    return decryptSolution(state.solutionsMap[problemId]);
  }

  function shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // Ensure it's not already in correct order
    if (shuffled.every((v, i) => v === arr[i])) {
      if (shuffled.length > 1) {
        [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
      }
    }
    return shuffled;
  }

  function escapeHtml(str) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return str.replace(/[&<>"']/g, (c) => map[c]);
  }

  /** Simple syntax highlighter for HTML code. */
  function highlightSyntax(code) {
    let escaped = escapeHtml(code);

    // DOCTYPE
    escaped = escaped.replace(
      /(&lt;!DOCTYPE\s+html&gt;)/gi,
      '<span class="doctype">$1</span>'
    );

    // Comments
    escaped = escaped.replace(
      /(&lt;!--.*?--&gt;)/g,
      '<span class="comment">$1</span>'
    );

    // Tags with attributes
    escaped = escaped.replace(
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

    return escaped;
  }

  // ── Load Solutions from Encrypted JSON ───────────────
  async function loadSolutions() {
    try {
      const resp = await fetch("solutions.json");
      if (!resp.ok) throw new Error("Failed to load solutions");
      state.solutionsMap = await resp.json();
    } catch (err) {
      console.error("Could not load solutions:", err);
      showToast("error", "Failed to load problem solutions. Please refresh.");
    }
  }

  // ── Build Sidebar ────────────────────────────────────
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
      problemList.className =
        "category-problems" + (catIdx === 0 ? " open" : "");

      cat.problems.forEach((prob) => {
        const item = document.createElement("div");
        item.className = "problem-item";
        item.dataset.problemId = prob.id;
        item.dataset.categoryId = cat.id;
        item.innerHTML = `
            <span class="status-dot"></span>
            <span>${prob.title}</span>
          `;
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

  // ── Load Problem ─────────────────────────────────────
  function loadProblem(category, problem) {
    const solution = getSolution(problem.id);
    if (!solution) {
      showToast("error", "Solution data not available for this problem.");
      return;
    }

    state.currentProblem = problem;
    state.currentCategory = category;
    state.hintsUsed = 0;
    state.blocks = shuffleArray(solution);

    // Update sidebar active state
    document.querySelectorAll(".problem-item").forEach((el) => {
      el.classList.toggle("active", el.dataset.problemId === problem.id);
    });

    // Update title bar
    dom.titleBarTitle.textContent = problem.title;
    dom.titleBarBadge.textContent = category.name;
    dom.titleBarBadge.style.background = category.color + "22";
    dom.titleBarBadge.style.color = category.color;
    dom.descText.textContent = problem.description;
    dom.blockCount.textContent = `${solution.length} blocks`;

    // Update status bar
    dom.statusProblem.textContent = problem.title;
    dom.statusCategory.textContent = category.name;
    dom.statusBlocks.textContent = `${solution.length} blocks`;

    // Show workspace, hide welcome
    dom.welcomeState.style.display = "none";
    dom.workspaceArea.style.display = "flex";

    // Enable buttons
    dom.btnCheck.disabled = false;
    dom.btnHint.disabled = false;
    dom.btnReset.disabled = false;

    // Render blocks (animate on new problem load)
    renderBlocks(true);
    updatePreview();

    // Close sidebar on mobile
    dom.sidebar.classList.remove("open");

    // No toast here: the title bar, description bar and workspace already
    // show which problem is loaded, and this fires on every single problem
    // selection, so a toast on top of that was just noise while browsing.
  }

  // ── Render Code Blocks ───────────────────────────────
  function renderBlocks(animate) {
    dom.codeArea.innerHTML = "";

    state.blocks.forEach((code, index) => {
      const block = document.createElement("div");
      block.className = "code-block" + (animate ? " animate-in" : "");
      if (animate) block.style.animationDelay = `${index * 0.03}s`;
      block.draggable = true;
      block.dataset.index = index;

      block.innerHTML = `
          <div class="line-number">${index + 1}</div>
          <div class="drag-handle">&#8942;&#8942;</div>
          <div class="code-text">${highlightSyntax(code)}</div>
        `;

      // Drag events
      block.addEventListener("dragstart", onDragStart);
      block.addEventListener("dragend", onDragEnd);

      // Touch events for mobile
      block.addEventListener("touchstart", onTouchStart, { passive: false });
      block.addEventListener("touchmove", onTouchMove, { passive: false });
      block.addEventListener("touchend", onTouchEnd);

      dom.codeArea.appendChild(block);
    });
  }

  // ── Live Drag Reordering (blocks shift as you drag) ──
  // Rather than showing a static insertion line, the dragged block is
  // physically moved within the DOM as soon as it crosses a neighbor, and a
  // FLIP animation makes the displaced blocks slide smoothly into their new
  // spots. The underlying state.blocks array is only resynced from the DOM
  // once the drag finishes, since dataset.index still points at each node's
  // position in state.blocks as of the last renderBlocks() call.
  let draggedEl = null;

  function renumberBlocks() {
    dom.codeArea.querySelectorAll(".code-block").forEach((b, i) => {
      const ln = b.querySelector(".line-number");
      if (ln) ln.textContent = i + 1;
    });
  }

  function animateReorder(mutate) {
    const blocks = Array.from(dom.codeArea.querySelectorAll(".code-block"));
    const firstRects = new Map();
    blocks.forEach((b) => firstRects.set(b, b.getBoundingClientRect()));

    mutate();
    renumberBlocks();

    blocks.forEach((b) => {
      const first = firstRects.get(b);
      const last = b.getBoundingClientRect();
      const deltaY = first.top - last.top;
      if (!deltaY) return;

      b.style.transition = "none";
      b.style.transform = `translateY(${deltaY}px)`;
      void b.offsetHeight; // force reflow so the "from" transform applies first
      b.style.transition = "transform 180ms ease";
      b.style.transform = "";

      b.addEventListener(
        "transitionend",
        () => {
          b.style.transition = "";
        },
        { once: true }
      );
    });
  }

  function syncBlocksFromDom() {
    state.blocks = Array.from(dom.codeArea.querySelectorAll(".code-block")).map(
      (el) => state.blocks[parseInt(el.dataset.index, 10)]
    );
    renderBlocks();
    updatePreview();
  }

  function onDragStart(e) {
    const block = e.target.closest(".code-block");
    draggedEl = block;
    state.dragSrcIndex = parseInt(block.dataset.index, 10);
    block.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", state.dragSrcIndex.toString());
  }

  function onDragEnd(e) {
    const block = e.target.closest(".code-block");
    if (block) block.classList.remove("dragging");
    draggedEl = null;
    state.dragSrcIndex = null;
  }

  function onContainerDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (!draggedEl) return;

    const target = e.target.closest(".code-block");
    let wantNextSibling;

    if (target && target !== draggedEl) {
      const rect = target.getBoundingClientRect();
      const isAbove = e.clientY < rect.top + rect.height / 2;
      wantNextSibling = isAbove ? target : target.nextElementSibling;
    } else if (!target) {
      // Hovering empty space: the small margin gaps between blocks also miss
      // the ".code-block" selector, so only treat this as "before the first
      // block" or "after the last block" when the cursor is truly outside
      // the block list — otherwise leave the current position alone rather
      // than guessing (guessing wrong here yanks the block to the wrong end).
      const allBlocks = Array.from(dom.codeArea.querySelectorAll(".code-block"));
      if (allBlocks.length === 0) return;
      const first = allBlocks[0];
      const last = allBlocks[allBlocks.length - 1];

      if (e.clientY < first.getBoundingClientRect().top) {
        wantNextSibling = first;
      } else if (e.clientY > last.getBoundingClientRect().bottom) {
        wantNextSibling = null;
      } else {
        return; // in a gap between blocks; keep current position
      }
    } else {
      return;
    }

    if (draggedEl.nextElementSibling === wantNextSibling) return;

    animateReorder(() => {
      dom.codeArea.insertBefore(draggedEl, wantNextSibling);
    });
  }

  function onContainerDrop(e) {
    e.preventDefault();
    if (!draggedEl) return;
    syncBlocksFromDom();
    state.dragSrcIndex = null;
  }

  // ── Touch Drag (Mobile) ──────────────────────────────
  let touchDragEl = null;
  let touchClone = null;
  let touchSrcIndex = null;

  function onTouchStart(e) {
    const block = e.target.closest(".code-block");
    if (!block) return;

    touchDragEl = block;
    touchSrcIndex = parseInt(block.dataset.index, 10);

    // Create visual clone that follows the finger
    touchClone = block.cloneNode(true);
    touchClone.style.position = "fixed";
    touchClone.style.zIndex = "9999";
    touchClone.style.width = block.offsetWidth + "px";
    touchClone.style.opacity = "0.9";
    touchClone.style.pointerEvents = "none";
    touchClone.style.transform = "scale(1.02)";
    touchClone.style.boxShadow = "0 8px 24px rgba(0,0,0,0.4)";

    const rect = block.getBoundingClientRect();
    touchClone.style.left = rect.left + "px";
    touchClone.style.top = rect.top + "px";
    document.body.appendChild(touchClone);

    block.classList.add("dragging");
  }

  function onTouchMove(e) {
    if (!touchClone || !touchDragEl) return;
    e.preventDefault();

    const touch = e.touches[0];
    const rect = touchDragEl.getBoundingClientRect();
    touchClone.style.top = touch.clientY - rect.height / 2 + "px";

    const hit = document.elementFromPoint(touch.clientX, touch.clientY);
    const target = hit ? hit.closest(".code-block") : null;
    if (!target || target === touchDragEl) return;

    const tRect = target.getBoundingClientRect();
    const isAbove = touch.clientY < tRect.top + tRect.height / 2;
    const wantNextSibling = isAbove ? target : target.nextElementSibling;

    if (touchDragEl.nextElementSibling === wantNextSibling) return;

    animateReorder(() => {
      dom.codeArea.insertBefore(touchDragEl, wantNextSibling);
    });
  }

  function onTouchEnd(e) {
    if (!touchDragEl) return;

    touchDragEl.classList.remove("dragging");
    syncBlocksFromDom();

    if (touchClone && touchClone.parentNode) {
      touchClone.parentNode.removeChild(touchClone);
    }

    touchClone = null;
    touchDragEl = null;
    touchSrcIndex = null;
  }

  // ── Live Preview ─────────────────────────────────────
  // CSS injected into the iframe to make links look normal but completely unclickable
  const PREVIEW_GUARD = `<style>a,button,input[type="submit"]{pointer-events:none!important;cursor:default!important;}form{pointer-events:none!important;}</style>`;

  function updatePreview() {
    const html = state.blocks.join("\n");
    dom.previewFrame.srcdoc = html + PREVIEW_GUARD;
  }

  // ── Check Solution ───────────────────────────────────
  function checkSolution() {
    if (!state.currentProblem) return;

    const solution = getSolution(state.currentProblem.id);
    if (!solution) return;

    const isCorrect = state.blocks.every((block, i) => block === solution[i]);
    const blocks = dom.codeArea.querySelectorAll(".code-block");

    if (isCorrect) {
      blocks.forEach((b) => b.classList.add("correct-flash"));
      state.solved.add(state.currentProblem.id);
      updateSolvedUI();
      updateProgress();
      saveSolvedState();
      setTimeout(() => showSuccess(), 600);
    } else {
      blocks.forEach((b, i) => {
        if (state.blocks[i] === solution[i]) {
          b.classList.add("correct-flash");
        } else {
          b.classList.add("incorrect-flash");
        }
      });

      showToast("error", "Not quite right. Some blocks are out of order.");

      setTimeout(() => {
        blocks.forEach((b) => {
          b.classList.remove("correct-flash", "incorrect-flash");
        });
      }, 1500);
    }
  }

  // ── Hint System ──────────────────────────────────────
  function showHint() {
    if (!state.currentProblem) return;

    const solution = getSolution(state.currentProblem.id);
    if (!solution) return;

    // Find first misplaced block
    let misplacedIndex = -1;
    for (let i = 0; i < state.blocks.length; i++) {
      if (state.blocks[i] !== solution[i]) {
        misplacedIndex = i;
        break;
      }
    }

    if (misplacedIndex === -1) {
      showToast(
        "success",
        "All blocks are in the correct order. Try checking your solution."
      );
      return;
    }

    // Remove any existing hint highlights
    document
      .querySelectorAll(".code-block.hint-highlight")
      .forEach((el) => el.classList.remove("hint-highlight"));

    // Highlight the misplaced block
    const blocks = dom.codeArea.querySelectorAll(".code-block");
    if (blocks[misplacedIndex]) {
      blocks[misplacedIndex].classList.add("hint-highlight");
      blocks[misplacedIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    state.hintsUsed++;
    showToast(
      "warning",
      `Hint: block ${misplacedIndex + 1} is in the wrong position. ${
        state.currentProblem.hint
      }`
    );

    // Remove highlight after 4 seconds
    setTimeout(() => {
      document
        .querySelectorAll(".code-block.hint-highlight")
        .forEach((el) => el.classList.remove("hint-highlight"));
    }, 4000);
  }

  // ── Reset Problem ────────────────────────────────────
  function resetProblem() {
    if (!state.currentProblem) return;

    const solution = getSolution(state.currentProblem.id);
    if (!solution) return;

    state.blocks = shuffleArray(solution);
    state.hintsUsed = 0;

    renderBlocks();
    updatePreview();
    showToast("info", "Problem reset. The blocks have been reshuffled.");
  }

  // ── Success Overlay ──────────────────────────────────
  function showSuccess() {
    dom.successOverlay.classList.add("show");
    spawnConfetti();
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
        if (prob.id === state.currentProblem.id) {
          startLooking = true;
        }
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
      showToast("success", "Amazing! You've solved all 30 problems.");
    }
  }

  // ── Confetti ─────────────────────────────────────────
  function spawnConfetti() {
    dom.confettiContainer.innerHTML = "";
    const colors = [
      "#3b82f6",
      "#22c55e",
      "#f59e0b",
      "#ef4444",
      "#a78bfa",
      "#60a5fa",
      "#16a34a",
      "#d97706",
    ];

    for (let i = 0; i < 60; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.background =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 1.5 + "s";
      confetti.style.animationDuration = 2 + Math.random() * 2 + "s";
      confetti.style.width = 6 + Math.random() * 6 + "px";
      confetti.style.height = 6 + Math.random() * 6 + "px";
      dom.confettiContainer.appendChild(confetti);
    }

    setTimeout(() => {
      dom.confettiContainer.innerHTML = "";
    }, 4000);
  }

  // ── Toast Notifications ──────────────────────────────
  // Only one toast is ever shown at a time: a new call replaces whatever's
  // currently on screen instead of stacking another one underneath it, so
  // repeatedly checking/hinting/resetting while iterating on a problem can't
  // pile up a wall of notifications.
  let toastDismissTimeout = null;
  let toastRemoveTimeout = null;

  function showToast(type, message) {
    clearTimeout(toastDismissTimeout);
    clearTimeout(toastRemoveTimeout);
    dom.toastContainer.innerHTML = "";

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const icons = {
      error: "&#10007;",
      success: "&#10003;",
      info: "&#8505;",
      warning: "&#9888;",
    };

    toast.innerHTML = `<span>${
      icons[type] || "&#8505;"
    }</span><span>${message}</span>`;
    dom.toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    toastDismissTimeout = setTimeout(() => {
      toast.classList.remove("show");
      toastRemoveTimeout = setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  // ── Solved UI Update ─────────────────────────────────
  function updateSolvedUI() {
    document.querySelectorAll(".problem-item").forEach((el) => {
      if (state.solved.has(el.dataset.problemId)) {
        el.classList.add("solved");
      }
    });
  }

  function updateProgress() {
    const total = PROBLEM_CATEGORIES.reduce(
      (sum, cat) => sum + cat.problems.length,
      0
    );
    const solved = state.solved.size;
    const pct = Math.round((solved / total) * 100);

    dom.progressFill.style.width = pct + "%";
    dom.progressCount.textContent = `${solved}/${total}`;

    if (window.WDFBProgress) window.WDFBProgress.setPercent(ACTIVITY_ID, pct);
  }

  // ── Resize Handle ────────────────────────────────────
  function initResizer() {
    const resizer = document.getElementById("resizeHandle");
    const idePanel = document.querySelector(".ide-panel");
    const previewPanel = document.querySelector(".preview-panel");
    let isResizing = false;
    let startX = 0;
    let startIdeWidth = 0;

    resizer.addEventListener("mousedown", (e) => {
      isResizing = true;
      startX = e.clientX;
      startIdeWidth = idePanel.offsetWidth;
      resizer.classList.add("active");
      document.body.style.cursor = "col-resize";
      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (!isResizing) return;
      const delta = e.clientX - startX;
      const newWidth = startIdeWidth + delta;
      const totalWidth = idePanel.parentElement.offsetWidth;
      const minW = 300;
      const maxW = totalWidth - 300;

      if (newWidth >= minW && newWidth <= maxW) {
        idePanel.style.flex = "none";
        idePanel.style.width = newWidth + "px";
        previewPanel.style.flex = "1";
      }
    });

    document.addEventListener("mouseup", () => {
      if (isResizing) {
        isResizing = false;
        resizer.classList.remove("active");
        document.body.style.cursor = "";
      }
    });
  }

  // ── Mobile Sidebar Toggle ────────────────────────────
  function initMobileToggle() {
    dom.mobileToggle.addEventListener("click", () => {
      dom.sidebar.classList.toggle("open");
    });

    dom.sidebarOverlay.addEventListener("click", () => {
      dom.sidebar.classList.remove("open");
    });
  }

  // ── Keyboard Shortcuts ───────────────────────────────
  function initKeyboard() {
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        checkSolution();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "h") {
        e.preventDefault();
        showHint();
      }
      if (e.key === "Escape") {
        hideSuccess();
      }
    });
  }

  // ── Persist solved state to localStorage ─────────────
  /** Ids of every problem that currently exists, so stale saved ids
   * (e.g. left over from a since-edited problem set) never inflate progress. */
  function getAllProblemIds() {
    const ids = new Set();
    PROBLEM_CATEGORIES.forEach((cat) =>
      cat.problems.forEach((prob) => ids.add(prob.id))
    );
    return ids;
  }

  function loadSavedState() {
    try {
      const saved = localStorage.getItem("parsons_solved");
      if (saved) {
        const validIds = getAllProblemIds();
        JSON.parse(saved).forEach((id) => {
          if (validIds.has(id)) state.solved.add(id);
        });
        updateSolvedUI();
        updateProgress();
        saveSolvedState(); // drop any stale ids we just filtered out
      }
    } catch (e) {
      /* ignore */
    }
  }

  function saveSolvedState() {
    try {
      localStorage.setItem("parsons_solved", JSON.stringify([...state.solved]));
    } catch (e) {
      /* ignore */
    }
  }

  // ── Init ─────────────────────────────────────────────
  async function init() {
    if (window.WDFBProgress) window.WDFBProgress.markViewed(ACTIVITY_ID);
    devGuard.init();

    // Load encrypted solutions first
    await loadSolutions();

    buildSidebar();
    initResizer();
    initMobileToggle();
    initKeyboard();
    loadSavedState();

    dom.codeArea.addEventListener("dragover", onContainerDragOver);
    dom.codeArea.addEventListener("drop", onContainerDrop);

    // Button events
    dom.btnCheck.addEventListener("click", checkSolution);
    dom.btnHint.addEventListener("click", showHint);
    dom.btnReset.addEventListener("click", resetProblem);

    // Success overlay
    document
      .getElementById("btnNextProblem")
      .addEventListener("click", goToNextProblem);
    document
      .getElementById("btnStayHere")
      .addEventListener("click", hideSuccess);

    updateProgress();
  }

  // Boot
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
