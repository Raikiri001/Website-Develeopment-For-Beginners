/* Fit the Cargo - level logic: drives the crate's live box model, the footprint ledger and the marking. */
(function () {
  "use strict";

  const ACTIVITY_ID = "fit-the-cargo";
  const STATE_KEY = "fit_cargo_state_v1";

  // Starting width of a value input, in characters.
  const FIELD_WIDTH = 7;

  // Matches .void's border-width in styles.css, so a neighbour can stand exactly as tall as the slot.
  const VOID_BORDER = 5;

  // A different row of neighbours per level: height as a share of the slot, and width in px.
  // The one nearest the slot is always the slot's own height, since it is what makes the slot.
  // The far row along the back wall: widths in px, heights as a share of the slot.
  const FAR_WIDTHS = [96, 72, 118, 84, 64, 104, 78, 132];
  const FAR_HEIGHTS = [0.58, 0.78, 0.44, 0.68, 0.86, 0.5, 0.72, 0.4];
  const FAR_COUNT = 16;

  const NEIGHBOUR_ROWS = [
    { left: [[0.72, 62]], right: [[0.55, 74]] },
    { left: [[0.54, 58], [0.86, 78]], right: [[0.7, 66]] },
    { left: [[0.9, 70]], right: [[1.12, 84], [0.62, 56]] },
    { left: [[1.1, 76], [0.66, 60]], right: [[0.84, 72]] },
    { left: [[0.63, 66]], right: [[1.06, 80], [0.7, 58]] },
    { left: [[0.95, 72], [0.58, 54]], right: [[0.76, 68], [1.08, 82]] },
  ];

  const FIELDS = [
    { name: "width", label: "width", part: "content" },
    { name: "height", label: "height", part: "content" },
    { name: "padding", label: "padding", part: "padding" },
    { name: "border", label: "border", part: "border" },
    { name: "margin", label: "margin", part: "margin" },
  ];

  const state = {
    currentCategoryId: null,
    currentLevelId: null,
    hintIndex: 0,
    solved: new Set(),
    attempted: new Set(),
  };

  const dom = {
    categoryList: document.getElementById("categoryList"),
    totalCount: document.getElementById("totalCount"),
    progressCount: document.getElementById("progressCount"),
    progressFill: document.getElementById("progressFill"),
    titleBarBadge: document.getElementById("titleBarBadge"),
    titleBarTitle: document.getElementById("titleBarTitle"),
    promptDifficultyBadge: document.getElementById("promptDifficultyBadge"),
    btnReset: document.getElementById("btnReset"),
    btnHint: document.getElementById("btnHint"),
    btnCheck: document.getElementById("btnCheck"),
    btnNext: document.getElementById("btnNext"),
    briefBody: document.getElementById("briefBody"),
    ruleList: document.getElementById("ruleList"),
    cssEditor: document.getElementById("cssEditor"),
    ledgerBody: document.getElementById("ledgerBody"),
    ledgerModeBadge: document.getElementById("ledgerModeBadge"),
    bay: document.getElementById("bay"),
    bayBack: document.getElementById("bayBack"),
    propsLeft: document.getElementById("propsLeft"),
    propsRight: document.getElementById("propsRight"),
    scene: document.getElementById("scene"),
    voidEl: document.getElementById("void"),
    slotDims: document.getElementById("slotDims"),
    voidReadout: document.getElementById("voidReadout"),
    marginBand: document.getElementById("marginBand"),
    crate: document.getElementById("crate"),
    crateBadge: document.getElementById("crateBadge"),
    feedbackNote: document.getElementById("feedbackNote"),
    welcomeState: document.getElementById("welcomeState"),
    welcomeStats: document.getElementById("welcomeStats"),
    workspace: document.getElementById("workspace"),
    completionPanel: document.getElementById("completionPanel"),
    completionScoreText: document.getElementById("completionScoreText"),
    btnRestart: document.getElementById("btnRestart"),
  };

  // -- Pure helpers ------------------------------------
  /** Read a typed length, accepting a bare number or one with px on the end. */
  function parsePx(raw) {
    const text = String(raw).trim().toLowerCase().replace(/\s+/g, "");
    if (text === "") return { empty: true, value: null };
    const match = text.match(/^(\d+(?:\.\d+)?)(px)?$/);
    if (!match) return { empty: false, value: null };
    return { empty: false, value: Number(match[1]) };
  }

  /** The width and height that make the footprint match the slot exactly. */
  function solutionFor(level) {
    const { padding, border, margin } = level.require;
    if (level.boxSizing === "border-box") {
      return {
        width: level.gap.width - 2 * margin,
        height: level.gap.height - 2 * margin,
      };
    }
    const ring = padding + border + margin;
    return {
      width: level.gap.width - 2 * ring,
      height: level.gap.height - 2 * ring,
    };
  }

  /** What the typed values actually take up, or null on either axis that isn't set yet. */
  function footprintFor(level, values) {
    const outside =
      level.boxSizing === "border-box"
        ? values.margin
        : sum([values.padding, values.border, values.margin]);
    if (outside === null) return { width: null, height: null };
    return {
      width: values.width === null ? null : values.width + 2 * outside,
      height: values.height === null ? null : values.height + 2 * outside,
    };
  }

  function sum(list) {
    return list.some((n) => n === null) ? null : list.reduce((a, b) => a + b, 0);
  }

  /** The load's name as it reads on a label. */
  function titleCase(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function px(value) {
    return value === null ? "&mdash;" : value + "px";
  }

  // -- The CSS editor ----------------------------------
  function makeSpan(className, text) {
    const el = document.createElement("span");
    el.className = className;
    el.textContent = text;
    return el;
  }

  function makeField(name) {
    const input = document.createElement("input");
    input.type = "text";
    input.className = "field";
    input.dataset.field = name;
    input.autocomplete = "off";
    input.spellcheck = false;
    input.placeholder = "0px";
    input.setAttribute("aria-label", name);
    input.style.width = FIELD_WIDTH + "ch";
    return input;
  }

  function makeLine(nodes) {
    const line = document.createElement("div");
    line.className = "code-line";
    nodes.forEach((n) => line.appendChild(n));
    return line;
  }

  function buildCssEditor(level) {
    dom.cssEditor.innerHTML = "";
    dom.cssEditor.appendChild(
      makeLine([makeSpan("keyword", ".crate"), document.createTextNode(" {")])
    );

    if (level.boxSizing === "border-box") {
      dom.cssEditor.appendChild(
        makeLine([
          document.createTextNode("  "),
          makeSpan("attr", "box-sizing"),
          document.createTextNode(": "),
          makeSpan("string", "border-box"),
          document.createTextNode(";"),
        ])
      );
    }

    FIELDS.forEach((field) => {
      const parts = [
        document.createTextNode("  "),
        makeSpan(`attr part-${field.part}`, field.label),
        document.createTextNode(": "),
        makeField(field.name),
      ];
      if (field.name === "border") {
        parts.push(document.createTextNode(" "));
        parts.push(makeSpan("string", "solid #1f6f68"));
      }
      parts.push(document.createTextNode(";"));
      dom.cssEditor.appendChild(makeLine(parts));
    });

    dom.cssEditor.appendChild(makeLine([document.createTextNode("}")]));
  }

  function getFields() {
    return Array.from(dom.cssEditor.querySelectorAll("input.field"));
  }

  /** Every typed value as a number, with null for blank or unreadable. */
  function readValues() {
    const values = {};
    getFields().forEach((input) => {
      values[input.dataset.field] = parsePx(input.value).value;
    });
    return values;
  }

  function fitFieldWidth(input) {
    input.style.width = Math.max(FIELD_WIDTH, input.value.length + 2) + "ch";
  }

  function setFieldValue(name, value) {
    const input = getFields().find((i) => i.dataset.field === name);
    if (!input) return;
    input.value = value === null ? "" : value + "px";
    fitFieldWidth(input);
  }

  // -- The scene ---------------------------------------
  /** One neighbour: as tall as it is told to be, standing on the floor. */
  function makeBlock(height, width, label) {
    const block = document.createElement("div");
    block.className = "block";
    block.style.height = Math.round(height) + "px";
    block.style.width = width + "px";
    if (label) {
      const tag = document.createElement("span");
      tag.className = "block-label";
      tag.textContent = label;
      block.appendChild(tag);
    }
    return block;
  }

  /** A row of neighbours, the one against the slot built to the slot's own height. */
  function buildProps(container, others, slotHeight, label, sideIsLeft) {
    container.innerHTML = "";
    const adjacent = makeBlock(slotHeight, 88, label);
    adjacent.classList.add("is-adjacent");
    const rest = others.map(([share, width]) => makeBlock(slotHeight * share, width, ""));
    const row = sideIsLeft ? rest.concat([adjacent]) : [adjacent].concat(rest);
    row.forEach((block) => container.appendChild(block));
  }

  function levelIndex(id) {
    return allLevels().findIndex((item) => item.level.id === id);
  }

  /** The freight stacked along the back wall, offset per level so no two bays repeat. */
  function buildFarRow(container, slotHeight, offset) {
    container.innerHTML = "";
    for (let i = 0; i < FAR_COUNT; i++) {
      const step = i + offset;
      const block = makeBlock(
        slotHeight * FAR_HEIGHTS[step % FAR_HEIGHTS.length],
        FAR_WIDTHS[step % FAR_WIDTHS.length],
        ""
      );
      block.classList.add("is-far");
      container.appendChild(block);
    }
  }

  function buildScene(category, level) {
    dom.bay.dataset.theme = category.id;
    dom.crateBadge.textContent = titleCase(level.cargo);
    dom.voidEl.style.width = level.gap.width + "px";
    dom.voidEl.style.height = level.gap.height + "px";
    dom.slotDims.innerHTML = `${level.gap.width} &times; ${level.gap.height}`;

    // The slot including its hazard frame, which is exactly what the neighbours beside it match.
    const slotHeight = level.gap.height + 2 * VOID_BORDER;
    const index = levelIndex(level.id);
    const row = NEIGHBOUR_ROWS[index % NEIGHBOUR_ROWS.length];
    buildProps(dom.propsLeft, row.left, slotHeight, level.left, true);
    buildProps(dom.propsRight, row.right, slotHeight, level.right, false);
    buildFarRow(dom.bayBack, slotHeight, index);
  }

  /** Push whatever is typed onto the crate, so the box model does the drawing. */
  function refreshScene(level) {
    const values = readValues();
    const crate = dom.crate;

    crate.style.boxSizing = level.boxSizing;
    crate.style.width = values.width === null ? "" : values.width + "px";
    crate.style.height = values.height === null ? "" : values.height + "px";
    crate.style.padding = values.padding === null ? "" : values.padding + "px";
    crate.style.borderWidth = values.border === null ? "" : values.border + "px";
    crate.style.margin = values.margin === null ? "" : values.margin + "px";

    crate.classList.toggle(
      "is-cramped",
      values.padding !== null && values.padding < level.require.padding
    );
    crate.classList.toggle(
      "is-touching",
      values.margin !== null && values.margin < level.require.margin
    );

    const footprint = footprintFor(level, values);
    const bandable = footprint.width !== null && footprint.height !== null;
    dom.marginBand.hidden = !bandable;
    if (bandable) {
      dom.marginBand.style.width = footprint.width + "px";
      dom.marginBand.style.height = footprint.height + "px";
    }

    const overWidth =
      footprint.width === null ? 0 : footprint.width - level.gap.width;
    const overHeight =
      footprint.height === null ? 0 : footprint.height - level.gap.height;

    dom.scene.classList.toggle("is-breach", overWidth > 0 || overHeight > 0);
    dom.voidReadout.innerHTML = readoutText(level, footprint, overWidth, overHeight);
    dom.voidReadout.className =
      "void-readout" +
      (footprint.width === null || footprint.height === null
        ? ""
        : overWidth > 0 || overHeight > 0
        ? " is-over"
        : overWidth === 0 && overHeight === 0
        ? " is-exact"
        : " is-under");

    refreshLedger(level, values, footprint);
    refreshRuleTicks(level, values, footprint);
  }

  function readoutText(level, footprint, overWidth, overHeight) {
    if (footprint.width === null || footprint.height === null) {
      return "Footprint &mdash; fill in every value to measure it.";
    }
    const size = `Footprint ${footprint.width} &times; ${footprint.height}`;
    const notes = [];
    if (overWidth > 0) notes.push(`${overWidth}px too wide`);
    if (overWidth < 0) notes.push(`${-overWidth}px of slack across`);
    if (overHeight > 0) notes.push(`${overHeight}px too tall`);
    if (overHeight < 0) notes.push(`${-overHeight}px of slack down`);
    return notes.length ? `${size} &middot; ${notes.join(", ")}` : `${size} &middot; fills the slot exactly`;
  }

  // -- The ledger --------------------------------------
  function ledgerRow(label, across, down, className, part) {
    const swatch = part
      ? `<span class="ledger-swatch part-${part}" aria-hidden="true"></span>`
      : "";
    return `
      <tr class="${className || ""}">
        <th scope="row">${swatch}${label}</th>
        <td>${across}</td>
        <td>${down}</td>
      </tr>`;
  }

  /** The row the learner's own width and height land on, marked as theirs. */
  function ledgerLabel(label, isTyped) {
    return isTyped
      ? `${label}<span class="ledger-set">you set this</span>`
      : label;
  }

  /** The content box: what is left once the padding and the border are taken out. */
  function contentFor(level, values) {
    if (level.boxSizing === "content-box") {
      return { width: values.width, height: values.height };
    }
    const inside = sum([values.padding, values.border]);
    return {
      width: values.width === null || inside === null ? null : values.width - 2 * inside,
      height: values.height === null || inside === null ? null : values.height - 2 * inside,
    };
  }

  /** The border box: the content with the padding and the border wrapped around it. */
  function borderBoxFor(level, values) {
    if (level.boxSizing === "border-box") {
      return { width: values.width, height: values.height };
    }
    const inside = sum([values.padding, values.border]);
    return {
      width: values.width === null || inside === null ? null : values.width + 2 * inside,
      height: values.height === null || inside === null ? null : values.height + 2 * inside,
    };
  }

  function refreshLedger(level, values, footprint) {
    const doubled = (n) => (n === null ? "&mdash;" : `+ 2 &times; ${n}px`);
    const typedIsContent = level.boxSizing === "content-box";
    const content = contentFor(level, values);
    const borderBox = borderBoxFor(level, values);
    const exact =
      footprint.width === level.gap.width && footprint.height === level.gap.height;

    // Every part shows in both modes; only which row the learner types into changes.
    const rows = [
      ledgerRow(
        ledgerLabel("the load", typedIsContent),
        px(content.width),
        px(content.height),
        content.width !== null && content.width <= 0 ? "is-impossible" : "",
        "content"
      ),
      ledgerRow("padding", doubled(values.padding), doubled(values.padding), "", "padding"),
      ledgerRow("border", doubled(values.border), doubled(values.border), "", "border"),
      ledgerRow(
        ledgerLabel("= the crate", !typedIsContent),
        px(borderBox.width),
        px(borderBox.height),
        "ledger-subtotal"
      ),
      ledgerRow("margin", doubled(values.margin), doubled(values.margin), "", "margin"),
      ledgerRow(
        "= footprint",
        px(footprint.width),
        px(footprint.height),
        "ledger-total" + (exact ? " is-exact" : "")
      ),
      ledgerRow("the slot", level.gap.width + "px", level.gap.height + "px", "ledger-target"),
    ];

    dom.ledgerBody.innerHTML = rows.join("");
    dom.ledgerModeBadge.textContent = level.boxSizing;
  }

  // -- The rules ---------------------------------------
  /** The three fixed demands plus the fit, worded the same way every level. */
  function rulesFor(level) {
    const r = level.require;
    return [
      {
        key: "padding",
        name: "Packing foam",
        text: `Nothing is stopping the ${level.cargo} from rattling around inside the crate. Set <code>padding</code> to exactly ${r.padding}px on every side.`,
      },
      {
        key: "border",
        name: "Crate wall",
        text: `The crate is not rated for transit until its wall is built. Set <code>border</code> to exactly ${r.border}px on every side.`,
      },
      {
        key: "margin",
        name: "Clearance",
        text: `${level.hazard} runs down every edge of the slot, and the crate must not touch it. Set <code>margin</code> to exactly ${r.margin}px on every side.`,
      },
      {
        key: "fit",
        name: "The fit",
        text: `Nothing around the slot will move. Work out the <code>width</code> and <code>height</code> that make the whole footprint exactly ${level.gap.width}px by ${level.gap.height}px.`,
      },
    ];
  }

  function buildRules(level) {
    dom.ruleList.innerHTML = rulesFor(level)
      .map(
        (rule) => `
        <li class="rule-item" data-rule="${rule.key}">
          <span class="rule-tick" aria-hidden="true">&#9675;</span>
          <span class="rule-body"><strong>${rule.name}.</strong> ${rule.text}</span>
        </li>`
      )
      .join("");
  }

  function refreshRuleTicks(level, values, footprint) {
    const met = {
      padding: values.padding === level.require.padding,
      border: values.border === level.require.border,
      margin: values.margin === level.require.margin,
      fit:
        footprint.width === level.gap.width &&
        footprint.height === level.gap.height,
    };
    dom.ruleList.querySelectorAll(".rule-item").forEach((item) => {
      const done = met[item.dataset.rule];
      item.classList.toggle("is-met", done);
      item.querySelector(".rule-tick").innerHTML = done ? "&#10003;" : "&#9675;";
    });
  }

  // -- Marking -----------------------------------------
  function handleCheck() {
    const level = findLevel(state.currentLevelId);
    if (!level) return;

    const inputs = getFields();
    const parsed = {};
    let emptyCount = 0;
    let badCount = 0;

    inputs.forEach((input) => {
      const result = parsePx(input.value);
      parsed[input.dataset.field] = result;
      input.classList.remove("is-correct", "is-wrong");
      if (result.empty) emptyCount++;
      else if (result.value === null) badCount++;
    });

    if (emptyCount > 0 || badCount > 0) {
      inputs.forEach((input) => {
        const result = parsed[input.dataset.field];
        if (!result.empty && result.value === null) input.classList.add("is-wrong");
      });
      setFeedback(
        badCount > 0
          ? "One of those is not a length. Type a number of pixels, such as 12 or 12px, and nothing else."
          : emptyCount === inputs.length
          ? "Nothing set yet. Every one of the five properties needs a value before the crate has a size."
          : `${emptyCount} of the five properties are still empty, so the crate has no measurable footprint yet.`,
        "is-wrong"
      );
      return;
    }

    const values = readValues();
    const solution = solutionFor(level);
    const footprint = footprintFor(level, values);
    const correct = {
      padding: values.padding === level.require.padding,
      border: values.border === level.require.border,
      margin: values.margin === level.require.margin,
      width: values.width === solution.width,
      height: values.height === solution.height,
    };

    inputs.forEach((input) => {
      const name = input.dataset.field;
      input.classList.toggle("is-correct", correct[name] === true);
      input.classList.toggle("is-wrong", correct[name] === false);
    });

    state.attempted.add(level.id);

    const allRight = Object.keys(correct).every((key) => correct[key]);
    if (allRight) {
      state.solved.add(level.id);
      setFeedback(explainSolution(level, values), "is-correct");
      dom.btnCheck.hidden = true;
      dom.btnNext.hidden = false;
      dom.btnHint.disabled = true;
      dom.btnNext.focus();
    } else {
      setFeedback(diagnose(level, values, footprint, solution), "is-wrong");
      const firstWrong = inputs.find((i) => i.classList.contains("is-wrong"));
      if (firstWrong) firstWrong.focus();
    }

    saveState();
    updateProgress();
  }

  /** Name the one thing that is most wrong, in the story's own terms. */
  function diagnose(level, values, footprint, solution) {
    const r = level.require;

    if (values.padding !== r.padding) {
      return values.padding < r.padding
        ? `Not enough packing foam around the ${level.cargo}. The rule asks for exactly ${r.padding}px of padding and you have given ${values.padding}px.`
        : `That is more packing foam than the rule allows. It asks for exactly ${r.padding}px of padding and you have given ${values.padding}px.`;
    }
    if (values.border !== r.border) {
      return values.border < r.border
        ? `The crate wall is too thin to survive transit. The rule asks for exactly ${r.border}px of border and you have given ${values.border}px.`
        : `The crate wall is thicker than the rule allows. It asks for exactly ${r.border}px of border and you have given ${values.border}px.`;
    }
    if (values.margin !== r.margin) {
      return values.margin < r.margin
        ? `Too close to the edge. ${level.hazard} needs exactly ${r.margin}px of margin between it and the crate, and you have left ${values.margin}px.`
        : `That is further from the edge than the rule wants. It asks for exactly ${r.margin}px of margin and you have left ${values.margin}px.`;
    }

    const notes = [];
    if (footprint.width !== level.gap.width) {
      const over = footprint.width - level.gap.width;
      notes.push(
        over > 0
          ? `${over}px too wide, so the crate runs into ${level.right}`
          : `${-over}px narrower than the slot, so the crate slides around in it`
      );
    }
    if (footprint.height !== level.gap.height) {
      const over = footprint.height - level.gap.height;
      notes.push(
        over > 0
          ? `${over}px too tall, so it will not sit under the deck above`
          : `${-over}px shorter than the slot, so it does not reach the bottom`
      );
    }

    const rings =
      level.boxSizing === "border-box"
        ? `2 &times; ${r.margin}px of margin`
        : `2 &times; ${r.padding}px of padding, 2 &times; ${r.border}px of border and 2 &times; ${r.margin}px of margin`;

    return `The three rules are right, but the footprint is ${notes.join(" and ")}. Remember the footprint is your width and height plus ${rings}.`;
  }

  function explainSolution(level, values) {
    const r = level.require;
    if (level.boxSizing === "border-box") {
      return `Exactly right. With <code>border-box</code> the ${values.width}px you set already contains the ${r.border}px border and the ${r.padding}px padding on each side, so the only thing added outside is the margin: ${values.width} + 2 &times; ${r.margin} = ${level.gap.width}px across, and ${values.height} + 2 &times; ${r.margin} = ${level.gap.height}px down. The ${level.cargo} ships with nothing touching the slot walls.`;
    }
    const ring = r.padding + r.border + r.margin;
    return `Exactly right. Each side adds ${r.padding} + ${r.border} + ${r.margin} = ${ring}px, so across it is ${values.width} + 2 &times; ${ring} = ${level.gap.width}px, and down it is ${values.height} + 2 &times; ${ring} = ${level.gap.height}px. With <code>content-box</code>, <code>width</code> only ever measures the content, which is why the crate ends up ${2 * ring}px wider than the number you typed.`;
  }

  // -- Hints -------------------------------------------
  function hintsFor(level) {
    const r = level.require;
    const solution = solutionFor(level);
    if (level.boxSizing === "border-box") {
      return [
        `Start with the three the story fixes for you: padding ${r.padding}px, border ${r.border}px, margin ${r.margin}px.`,
        `With <code>border-box</code>, padding and border sit inside the width, so the footprint is just width + 2 &times; margin.`,
        `Across: ${level.gap.width} &minus; 2 &times; ${r.margin} = ${solution.width}. Down works the same way.`,
        `The answers are width ${solution.width}px and height ${solution.height}px.`,
      ];
    }
    const ring = r.padding + r.border + r.margin;
    return [
      `Start with the three the story fixes for you: padding ${r.padding}px, border ${r.border}px, margin ${r.margin}px.`,
      `The footprint is width + 2 &times; (padding + border + margin), and the same again for height.`,
      `Each side adds ${r.padding} + ${r.border} + ${r.margin} = ${ring}px, so both sides together take ${2 * ring}px off the slot.`,
      `Across: ${level.gap.width} &minus; ${2 * ring} = ${solution.width}. Down: ${level.gap.height} &minus; ${2 * ring} = ${solution.height}.`,
    ];
  }

  function handleHint() {
    const level = findLevel(state.currentLevelId);
    if (!level) return;
    const hints = hintsFor(level);
    const hint = hints[Math.min(state.hintIndex, hints.length - 1)];
    state.hintIndex++;
    setFeedback(`Hint: ${hint}`, "is-hint");
  }

  function handleReset() {
    const level = findLevel(state.currentLevelId);
    if (!level) return;
    getFields().forEach((input) => {
      input.value = "";
      input.classList.remove("is-correct", "is-wrong");
      fitFieldWidth(input);
    });
    state.hintIndex = 0;
    setFeedback("");
    dom.btnCheck.hidden = false;
    dom.btnNext.hidden = true;
    dom.btnHint.disabled = false;
    refreshScene(level);
  }

  function setFeedback(html, className) {
    dom.feedbackNote.innerHTML = html || "";
    dom.feedbackNote.className =
      "feedback-note" + (html && className ? " " + className : "");
  }

  // -- Category and level lookup -----------------------
  function allLevels() {
    const flat = [];
    FIT_CARGO_CATEGORIES.forEach((category) => {
      category.levels.forEach((level) => flat.push({ category, level }));
    });
    return flat;
  }

  function totalLevels() {
    return allLevels().length;
  }

  function findLevel(id) {
    const hit = allLevels().find((item) => item.level.id === id);
    return hit ? hit.level : null;
  }

  /** Next unsolved level after the current one, wrapping to the start. */
  function findNextUnsolved() {
    const flat = allLevels();
    const fromIndex = flat.findIndex((item) => item.level.id === state.currentLevelId);
    for (let i = fromIndex + 1; i < flat.length; i++) {
      if (!state.solved.has(flat[i].level.id)) return flat[i];
    }
    for (let i = 0; i <= fromIndex && i < flat.length; i++) {
      if (!state.solved.has(flat[i].level.id)) return flat[i];
    }
    return null;
  }

  // -- Sidebar -----------------------------------------
  function buildWelcomeStats() {
    dom.welcomeStats.innerHTML = FIT_CARGO_CATEGORIES.map(
      (category) => `
        <div class="welcome-stat">
          <div class="welcome-stat-icon">&#9670;</div>
          <div class="welcome-stat-label">${category.levels.length} ${category.name}</div>
        </div>
      `
    ).join("");
  }

  function buildSidebar() {
    dom.categoryList.innerHTML = "";

    FIT_CARGO_CATEGORIES.forEach((category, catIdx) => {
      const group = document.createElement("div");
      group.className = "category-group";

      const header = document.createElement("div");
      header.className = "category-header" + (catIdx === 0 ? " expanded" : "");
      header.innerHTML = `
        <span>${category.name}</span>
        <span class="category-count">(${category.levels.length})</span>
        <span class="cat-chevron">&#9656;</span>
      `;

      const list = document.createElement("div");
      list.className = "category-problems" + (catIdx === 0 ? " open" : "");

      category.levels.forEach((level, idx) => {
        const item = document.createElement("div");
        item.className = "problem-item";
        item.dataset.levelId = level.id;
        item.dataset.categoryId = category.id;
        item.innerHTML = `
          <span class="status-dot"></span>
          <span>Problem ${idx + 1}</span>
        `;
        item.addEventListener("click", () => loadLevel(category, level));
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
      const id = el.dataset.levelId;
      el.classList.toggle("solved", state.solved.has(id));
      el.classList.toggle("started", state.attempted.has(id) && !state.solved.has(id));
      el.classList.toggle("active", id === state.currentLevelId);
    });
  }

  function setDifficultyBadge(el, difficulty) {
    el.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    el.classList.remove("difficulty-easy", "difficulty-medium", "difficulty-hard");
    el.classList.add(`difficulty-${difficulty}`);
  }

  // -- Loading a level ---------------------------------
  function loadLevel(category, level) {
    state.currentCategoryId = category.id;
    state.currentLevelId = level.id;
    state.hintIndex = 0;

    const indexInCategory = category.levels.findIndex((l) => l.id === level.id);
    dom.titleBarBadge.textContent = category.name;
    dom.titleBarBadge.style.background = category.color + "22";
    dom.titleBarBadge.style.color = category.color;
    dom.titleBarTitle.textContent = `Problem ${indexInCategory + 1}`;
    setDifficultyBadge(dom.promptDifficultyBadge, level.difficulty);

    dom.briefBody.textContent = level.brief;
    buildRules(level);
    buildCssEditor(level);
    buildScene(category, level);

    // A solved level comes back filled in and marked.
    if (state.solved.has(level.id)) {
      const solution = solutionFor(level);
      setFieldValue("width", solution.width);
      setFieldValue("height", solution.height);
      setFieldValue("padding", level.require.padding);
      setFieldValue("border", level.require.border);
      setFieldValue("margin", level.require.margin);
      getFields().forEach((input) => input.classList.add("is-correct"));
      setFeedback(explainSolution(level, solution), "is-correct");
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

    refreshScene(level);

    dom.welcomeState.hidden = true;
    dom.workspace.hidden = false;
    dom.completionPanel.classList.remove("is-visible");

    updateSidebarStates();

    const first = getFields()[0];
    if (first && !state.solved.has(level.id)) first.focus();
  }

  function handleNext() {
    const next = findNextUnsolved();
    if (next) loadLevel(next.category, next.level);
    else showCompletion();
  }

  function showCompletion() {
    dom.workspace.hidden = true;
    dom.completionPanel.classList.add("is-visible");
    dom.completionScoreText.textContent = `You have fitted every load into every slot, across all ${totalLevels()} levels.`;
    state.currentLevelId = null;
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

  // -- Progress ----------------------------------------
  function updateProgress() {
    const total = totalLevels();
    const solved = state.solved.size;
    const pct = Math.round((solved / total) * 100);

    dom.progressCount.textContent = `${solved}/${total}`;
    dom.progressFill.style.width = pct + "%";
    dom.progressFill.classList.toggle("is-complete", pct >= 100);

    if (window.WDFBProgress) window.WDFBProgress.setPercent(ACTIVITY_ID, pct);

    updateSidebarStates();
  }

  // -- Persistence -------------------------------------
  function loadState() {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      const validIds = new Set(allLevels().map((item) => item.level.id));
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

  // -- Init --------------------------------------------
  function init() {
    if (window.WDFBProgress) window.WDFBProgress.markViewed(ACTIVITY_ID);

    loadState();
    dom.totalCount.textContent = totalLevels();
    dom.progressCount.textContent = `${state.solved.size}/${totalLevels()}`;
    buildSidebar();
    buildWelcomeStats();
    updateProgress();

    dom.btnCheck.addEventListener("click", handleCheck);
    dom.btnHint.addEventListener("click", handleHint);
    dom.btnReset.addEventListener("click", handleReset);
    dom.btnNext.addEventListener("click", handleNext);
    dom.btnRestart.addEventListener("click", restartAll);

    // One delegated listener, since the fields are rebuilt per level.
    dom.cssEditor.addEventListener("input", (e) => {
      if (!e.target.classList.contains("field")) return;
      const level = findLevel(state.currentLevelId);
      if (!level) return;
      e.target.classList.remove("is-wrong", "is-correct");
      fitFieldWidth(e.target);
      refreshScene(level);
    });

    // Enter checks the answer.
    dom.cssEditor.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" || !e.target.classList.contains("field")) return;
      e.preventDefault();
      if (!dom.btnNext.hidden) handleNext();
      else handleCheck();
    });

    // Never auto-load a level; the learner picks one from the sidebar.
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
