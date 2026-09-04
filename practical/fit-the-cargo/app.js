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

  // The three ring properties, in the order the shorthand writes them.
  const RINGS = ["padding", "border", "margin"];
  const SIDES = ["top", "right", "bottom", "left"];

  // How many values a shorthand is written with, and which sides each of them sets.
  const SHORTHAND = {
    1: [["top", "right", "bottom", "left"]],
    2: [["top", "bottom"], ["left", "right"]],
    4: [["top"], ["right"], ["bottom"], ["left"]],
  };

  const SLOT_LABELS = {
    1: ["every side"],
    2: ["top and bottom", "left and right"],
    4: ["top", "right", "bottom", "left"],
  };

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
    slotLoad: document.getElementById("slotLoad"),
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

  /** A required value as four sides, whether it was written as one number or as sides. */
  function sidesOf(value) {
    if (typeof value === "number") {
      return { top: value, right: value, bottom: value, left: value };
    }
    return value;
  }

  /** How many values the shorthand needs: one, one per axis, or one per side. */
  function shorthandOf(sides) {
    if (sides.top === sides.right && sides.right === sides.bottom && sides.bottom === sides.left) {
      return 1;
    }
    return sides.top === sides.bottom && sides.left === sides.right ? 2 : 4;
  }

  function requiredSides(level, ring) {
    return sidesOf(level.require[ring]);
  }

  /** What the three rings add on one edge, or null if any of them is unset. */
  function ringTotal(level, values, side, includeInner) {
    const rings = includeInner ? RINGS : ["margin"];
    let total = 0;
    for (const ring of rings) {
      const value = values[ring][side];
      if (value === null) return null;
      total += value;
    }
    return total;
  }

  /** The width and height that make the footprint match the slot exactly. */
  function solutionFor(level) {
    const inner = level.boxSizing === "content-box";
    const edge = (side) => {
      const rings = inner ? RINGS : ["margin"];
      return rings.reduce((total, ring) => total + requiredSides(level, ring)[side], 0);
    };
    return {
      width: level.gap.width - edge("left") - edge("right"),
      height: level.gap.height - edge("top") - edge("bottom"),
    };
  }

  /** What the typed values actually take up, or null on either axis that isn't set yet. */
  function footprintFor(level, values) {
    const inner = level.boxSizing === "content-box";
    const axis = (a, b, size) => {
      const one = ringTotal(level, values, a, inner);
      const two = ringTotal(level, values, b, inner);
      if (one === null || two === null || size === null) return null;
      return size + one + two;
    };
    return {
      width: axis("left", "right", values.width),
      height: axis("top", "bottom", values.height),
    };
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

  function makeField(prop, slot, placeholder) {
    const input = document.createElement("input");
    input.type = "text";
    input.className = "field";
    input.dataset.prop = prop;
    input.dataset.slot = String(slot);
    input.autocomplete = "off";
    input.spellcheck = false;
    input.placeholder = placeholder;
    input.setAttribute("aria-label", placeholder === "0px" ? prop : `${prop}, ${placeholder}`);
    input.style.width = Math.max(FIELD_WIDTH, placeholder.length + 1) + "ch";
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

    ["width", "height"].forEach((prop) => {
      dom.cssEditor.appendChild(
        makeLine([
          document.createTextNode("  "),
          makeSpan("attr part-content", prop),
          document.createTextNode(": "),
          makeField(prop, 0, "0px"),
          document.createTextNode(";"),
        ])
      );
    });

    // A ring is written with as many values as its sides need, and the blanks say which is which.
    RINGS.forEach((ring) => {
      const count = shorthandOf(requiredSides(level, ring));
      const parts = [
        document.createTextNode("  "),
        makeSpan(`attr part-${ring}`, ring),
        document.createTextNode(": "),
      ];
      SLOT_LABELS[count].forEach((label, slot) => {
        if (slot > 0) parts.push(document.createTextNode(" "));
        parts.push(makeField(ring, slot, count === 1 ? "0px" : label));
      });
      if (ring === "border") {
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

  /** Which sides a blank sets, from the shorthand it belongs to. */
  function sidesForField(level, input) {
    const count = shorthandOf(requiredSides(level, input.dataset.prop));
    return SHORTHAND[count][Number(input.dataset.slot)];
  }

  /** Every typed value: width and height as numbers, each ring as its four sides. */
  function readValues(level) {
    const values = {
      width: null,
      height: null,
      padding: {},
      border: {},
      margin: {},
    };
    RINGS.forEach((ring) => SIDES.forEach((side) => (values[ring][side] = null)));

    getFields().forEach((input) => {
      const value = parsePx(input.value).value;
      const prop = input.dataset.prop;
      if (prop === "width" || prop === "height") {
        values[prop] = value;
        return;
      }
      sidesForField(level, input).forEach((side) => (values[prop][side] = value));
    });
    return values;
  }

  function fitFieldWidth(input) {
    input.style.width = Math.max(FIELD_WIDTH, input.value.length + 2) + "ch";
  }

  /** Fill every blank with the value it is asking for. */
  function fillWithSolution(level) {
    const solution = solutionFor(level);
    getFields().forEach((input) => {
      const prop = input.dataset.prop;
      const value =
        prop === "width" || prop === "height"
          ? solution[prop]
          : requiredSides(level, prop)[sidesForField(level, input)[0]];
      input.value = value + "px";
      fitFieldWidth(input);
    });
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
    dom.slotLoad.textContent = titleCase(level.cargo);
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
  /** The four sides as a CSS shorthand, or "" while any of them is unset. */
  function shorthandValue(sides) {
    if (SIDES.some((side) => sides[side] === null)) return "";
    return SIDES.map((side) => sides[side] + "px").join(" ");
  }

  function refreshScene(level) {
    const values = readValues(level);
    const crate = dom.crate;

    crate.style.boxSizing = level.boxSizing;
    crate.style.width = values.width === null ? "" : values.width + "px";
    crate.style.height = values.height === null ? "" : values.height + "px";
    crate.style.padding = shorthandValue(values.padding);
    crate.style.borderWidth = shorthandValue(values.border);
    crate.style.margin = shorthandValue(values.margin);

    const wanted = requiredSides(level, "margin");
    crate.classList.toggle(
      "is-touching",
      SIDES.some((side) => values.margin[side] !== null && values.margin[side] < wanted[side])
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
    if (footprint.width === null || footprint.height === null) return "";
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

  /** The content box: what is left once the padding and the border are taken out. */
  function contentFor(level, values) {
    if (level.boxSizing === "content-box") {
      return { width: values.width, height: values.height };
    }
    return insetBy(values, -1);
  }

  /** The border box: the content with the padding and the border wrapped around it. */
  function borderBoxFor(level, values) {
    if (level.boxSizing === "border-box") {
      return { width: values.width, height: values.height };
    }
    return insetBy(values, 1);
  }

  /** Take the padding and the border off the typed size, or add them onto it. */
  function insetBy(values, sign) {
    const edge = (side) => {
      const padding = values.padding[side];
      const border = values.border[side];
      return padding === null || border === null ? null : padding + border;
    };
    const axis = (a, b, size) => {
      const one = edge(a);
      const two = edge(b);
      if (one === null || two === null || size === null) return null;
      return size + sign * (one + two);
    };
    return {
      width: axis("left", "right", values.width),
      height: axis("top", "bottom", values.height),
    };
  }

  function refreshLedger(level, values, footprint) {
    // Two equal sides read as a doubling; two different ones read as the sum they are.
    const pair = (sides, a, b) => {
      if (sides[a] === null || sides[b] === null) return "&mdash;";
      return sides[a] === sides[b]
        ? `2 &times; ${sides[a]}px`
        : `${sides[a]}px + ${sides[b]}px`;
    };
    const across = (ring) => pair(values[ring], "left", "right");
    const down = (ring) => pair(values[ring], "top", "bottom");
    const typedIsContent = level.boxSizing === "content-box";
    const content = contentFor(level, values);
    const borderBox = borderBoxFor(level, values);
    const exact =
      footprint.width === level.gap.width && footprint.height === level.gap.height;

    // Every part shows in both modes; only which row the learner types into changes.
    const rows = [
      ledgerRow(
        "content",
        px(content.width),
        px(content.height),
        content.width !== null && content.width <= 0 ? "is-impossible" : "",
        "content"
      ),
      ledgerRow("padding", across("padding"), down("padding"), "ledger-add", "padding"),
      ledgerRow("border", across("border"), down("border"), "ledger-add", "border"),
      // Only border-box needs this row, since there it is the number the learner types.
      typedIsContent
        ? ""
        : ledgerRow(
            "content + padding + border",
            px(borderBox.width),
            px(borderBox.height),
            "ledger-subtotal"
          ),
      ledgerRow("margin", across("margin"), down("margin"), "ledger-add", "margin"),
      ledgerRow(
        "footprint",
        px(footprint.width),
        px(footprint.height),
        "ledger-total" + (exact ? " is-exact" : "")
      ),
      ledgerRow("slot", level.gap.width + "px", level.gap.height + "px", "ledger-target"),
    ];

    dom.ledgerBody.innerHTML = rows.join("");
    dom.ledgerModeBadge.textContent = level.boxSizing;
  }

  // -- The rules ---------------------------------------
  /** "exactly 14px on every side", or the sides spelled out when they differ. */
  function demand(level, ring) {
    const sides = requiredSides(level, ring);
    const count = shorthandOf(sides);
    if (count === 1) return `exactly ${sides.top}px on every side`;
    if (count === 2) {
      return `exactly ${sides.top}px top and bottom, and ${sides.left}px left and right`;
    }
    return `exactly ${sides.top}px top, ${sides.right}px right, ${sides.bottom}px bottom and ${sides.left}px left`;
  }

  /** The three fixed demands plus the fit, worded the same way every level. */
  function rulesFor(level) {
    return [
      {
        key: "padding",
        name: "Packing foam",
        text: `Nothing is stopping the ${level.cargo} from rattling around inside the crate. Set <code>padding</code> to ${demand(level, "padding")}.`,
      },
      {
        key: "border",
        name: "Crate wall",
        text: `The crate is not rated for transit until its wall is built. Set <code>border</code> to ${demand(level, "border")}.`,
      },
      {
        key: "margin",
        name: "Clearance",
        text: `${level.hazard} runs down every edge of the slot, and the crate must not touch it. Set <code>margin</code> to ${demand(level, "margin")}.`,
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

  /** True once every side of a ring matches what the story asked for. */
  function ringIsRight(level, values, ring) {
    const wanted = requiredSides(level, ring);
    return SIDES.every((side) => values[ring][side] === wanted[side]);
  }

  function refreshRuleTicks(level, values, footprint) {
    const met = {
      padding: ringIsRight(level, values, "padding"),
      border: ringIsRight(level, values, "border"),
      margin: ringIsRight(level, values, "margin"),
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
    let emptyCount = 0;
    let badCount = 0;

    inputs.forEach((input) => {
      const result = parsePx(input.value);
      input.classList.remove("is-correct", "is-wrong");
      if (result.empty) emptyCount++;
      else if (result.value === null) {
        badCount++;
        input.classList.add("is-wrong");
      }
    });

    if (emptyCount > 0 || badCount > 0) {
      setFeedback(
        badCount > 0
          ? "One of those is not a length. Type a number of pixels, such as 12 or 12px, and nothing else."
          : emptyCount === inputs.length
          ? "Nothing set yet. Every blank needs a value before the crate has a size."
          : `${emptyCount} of the ${inputs.length} blanks are still empty, so the crate has no measurable footprint yet.`,
        "is-wrong"
      );
      return;
    }

    const values = readValues(level);
    const solution = solutionFor(level);
    const footprint = footprintFor(level, values);

    inputs.forEach((input) => {
      const prop = input.dataset.prop;
      const typed = parsePx(input.value).value;
      const wanted =
        prop === "width" || prop === "height"
          ? solution[prop]
          : requiredSides(level, prop)[sidesForField(level, input)[0]];
      input.classList.toggle("is-correct", typed === wanted);
      input.classList.toggle("is-wrong", typed !== wanted);
    });

    state.attempted.add(level.id);

    const allRight = inputs.every((input) => input.classList.contains("is-correct"));
    if (allRight) {
      state.solved.add(level.id);
      setFeedback(explainSolution(level, values), "is-correct");
      dom.btnCheck.hidden = true;
      dom.btnNext.hidden = false;
      dom.btnHint.disabled = true;
      dom.btnNext.focus();
    } else {
      setFeedback(diagnose(level, values, footprint), "is-wrong");
      const firstWrong = inputs.find((i) => i.classList.contains("is-wrong"));
      if (firstWrong) firstWrong.focus();
    }

    saveState();
    updateProgress();
  }

  /** The first side of a ring that does not match, with what was asked and what was typed. */
  function firstMismatch(level, values, ring) {
    const wanted = requiredSides(level, ring);
    const side = SIDES.find((s) => values[ring][s] !== wanted[s]);
    return side ? { side, wanted: wanted[side], typed: values[ring][side] } : null;
  }

  /** Name the sides a wrong blank sets, or say nothing when every side wants the same. */
  function whichSide(level, ring, side) {
    const count = shorthandOf(requiredSides(level, ring));
    if (count === 1) return "";
    if (count === 2) {
      return side === "top" || side === "bottom" ? " top and bottom" : " left and right";
    }
    return ` on the ${side}`;
  }

  /** Name the one thing that is most wrong, in the story's own terms. */
  function diagnose(level, values, footprint) {
    const padding = firstMismatch(level, values, "padding");
    if (padding) {
      const where = whichSide(level, "padding", padding.side);
      return padding.typed < padding.wanted
        ? `Not enough packing foam around the ${level.cargo}. The rule asks for exactly ${padding.wanted}px of padding${where} and you have given ${padding.typed}px.`
        : `That is more packing foam than the rule allows. It asks for exactly ${padding.wanted}px of padding${where} and you have given ${padding.typed}px.`;
    }

    const border = firstMismatch(level, values, "border");
    if (border) {
      const where = whichSide(level, "border", border.side);
      return border.typed < border.wanted
        ? `The crate wall is too thin to survive transit. The rule asks for exactly ${border.wanted}px of border${where} and you have given ${border.typed}px.`
        : `The crate wall is thicker than the rule allows. It asks for exactly ${border.wanted}px of border${where} and you have given ${border.typed}px.`;
    }

    const margin = firstMismatch(level, values, "margin");
    if (margin) {
      const where = whichSide(level, "margin", margin.side);
      return margin.typed < margin.wanted
        ? `Too close to the edge. ${level.hazard} needs exactly ${margin.wanted}px of margin${where}, and you have left ${margin.typed}px.`
        : `That is further from the edge than the rule wants. It asks for exactly ${margin.wanted}px of margin${where} and you have left ${margin.typed}px.`;
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

    return `The three rules are right, but the footprint is ${notes.join(
      " and "
    )}. ${axisSums(level)}`;
  }

  /** What the rings take off each axis, spelled out side by side. */
  function axisSums(level) {
    const rings = level.boxSizing === "border-box" ? ["margin"] : RINGS;
    const edge = (side) =>
      rings.reduce((total, ring) => total + requiredSides(level, ring)[side], 0);
    return `Across, the sides take off ${edge("left")} + ${edge("right")} = ${
      edge("left") + edge("right")
    }px. Down, they take off ${edge("top")} + ${edge("bottom")} = ${
      edge("top") + edge("bottom")
    }px.`;
  }

  function explainSolution(level, values) {
    const across = level.gap.width - values.width;
    const down = level.gap.height - values.height;
    if (level.boxSizing === "border-box") {
      return `Exactly right. With <code>border-box</code> the ${values.width}px you set already contains the padding and the border, so the only thing added outside is the margin: ${values.width} + ${across} = ${level.gap.width}px across, and ${values.height} + ${down} = ${level.gap.height}px down. The ${level.cargo} ships with nothing touching the slot walls.`;
    }
    return `Exactly right. ${axisSums(level)} So across it is ${values.width} + ${across} = ${level.gap.width}px, and down it is ${values.height} + ${down} = ${level.gap.height}px. With <code>content-box</code>, <code>width</code> only ever measures the content, which is why the crate ends up ${across}px wider than the number you typed.`;
  }

  // -- Hints -------------------------------------------
  function hintsFor(level) {
    const solution = solutionFor(level);
    const fixed = `Start with the three the story fixes for you: padding ${demand(
      level,
      "padding"
    )}, border ${demand(level, "border")}, margin ${demand(level, "margin")}.`;

    if (level.boxSizing === "border-box") {
      return [
        fixed,
        `With <code>border-box</code>, padding and border sit inside the width, so the footprint is the width plus the margin on each side.`,
        axisSums(level),
        `The answers are width ${solution.width}px and height ${solution.height}px.`,
      ];
    }
    return [
      fixed,
      `The footprint across is your width plus the padding, border and margin on the left and on the right. Down works the same way, with the top and the bottom.`,
      axisSums(level),
      `Across: ${level.gap.width} &minus; ${level.gap.width - solution.width} = ${solution.width}. Down: ${level.gap.height} &minus; ${level.gap.height - solution.height} = ${solution.height}.`,
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
      fillWithSolution(level);
      getFields().forEach((input) => input.classList.add("is-correct"));
      setFeedback(explainSolution(level, solutionFor(level)), "is-correct");
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
