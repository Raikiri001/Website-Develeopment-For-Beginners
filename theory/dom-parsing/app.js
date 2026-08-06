/**
 * How Browsers Parse HTML and CSS - Main Application Logic
 * Steps through tokenising a sample page, building its DOM tree and its
 * CSSOM tree, then shows how the two combine into a render tree.
 *
 * The CSSOM tree is built from CSS_ELEMENTS_DATA (see data.js), which is a
 * flat tree of style rules under a stylesheet root, not a copy of the DOM.
 * That mirrors how a real CSSOM is built: from the stylesheet's own rule
 * list, independent of which elements those rules happen to match.
 */

(function () {
  "use strict";

  // ── State ────────────────────────────────────────────
  let activeElements = new Set();
  let activeCssElements = new Set();
  let highlightedNodeId = null;
  let currentIdeTab = "html";
  let currentTreeTab = "dom";
  let currentZoom = 1;
  let toastTimeout;

  const SVG_NS = "http://www.w3.org/2000/svg";
  const NON_RENDERED_TAGS = new Set(["head", "meta", "title", "link", "style"]);
  const ACTIVITY_ID = "dom-parsing";

  // ── Progress tracking ────────────────────────────────
  // Progress is "how much of the sample document has been tokenised", across
  // both the HTML and CSS trees, reported to the shared dashboard.
  function reportProgress() {
    if (!window.WDFBProgress) return;
    const total = Object.keys(ELEMENTS_DATA).length + Object.keys(CSS_ELEMENTS_DATA).length;
    const done = activeElements.size + activeCssElements.size;
    window.WDFBProgress.setPercent(ACTIVITY_ID, total === 0 ? 0 : (done / total) * 100);
  }

  // ── Init ─────────────────────────────────────────────
  function init() {
    if (window.WDFBProgress) window.WDFBProgress.markViewed(ACTIVITY_ID);

    initZoom();
    initPan();
    renderIDE();
    renderTree();
    updatePreview();

    initResizer("resizer-ide", "ide-panel", "tree-panel", false);
    initResizer("resizer-preview", "tree-panel", "preview-panel", true);

    document.getElementById("btnParseNext").addEventListener("click", parseNextLine);
    document.getElementById("btnResetParser").addEventListener("click", resetParser);
    document.getElementById("tab-ide-html").addEventListener("click", () => switchIdeTab("html"));
    document.getElementById("tab-ide-css").addEventListener("click", () => switchIdeTab("css"));
    document.getElementById("tab-tree-dom").addEventListener("click", () => switchTreeTab("dom"));
    document.getElementById("tab-tree-cssom").addEventListener("click", () => switchTreeTab("cssom"));
    document.getElementById("tab-tree-render").addEventListener("click", () => switchTreeTab("render"));
    document.getElementById("btnZoomIn").addEventListener("click", () => zoomTree(0.1));
    document.getElementById("btnZoomOut").addEventListener("click", () => zoomTree(-0.1));
    document.getElementById("btnZoomReset").addEventListener("click", resetZoom);
  }

  function initResizer(resizerId, prevPanelId, nextPanelId, isRightAlign) {
    const resizer = document.getElementById(resizerId);
    const prevPanel = document.getElementById(prevPanelId);
    const nextPanel = document.getElementById(nextPanelId);
    let startX, startWidthPrev, startWidthNext;
    let redrawQueued = false;

    resizer.addEventListener("mousedown", (e) => {
      startX = e.clientX;
      startWidthPrev = prevPanel.getBoundingClientRect().width;
      startWidthNext = nextPanel.getBoundingClientRect().width;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "col-resize";
      resizer.classList.add("dragging");
    });

    function onMouseMove(e) {
      const dx = e.clientX - startX;
      if (!isRightAlign) {
        prevPanel.style.width = `${startWidthPrev + dx}px`;
        prevPanel.style.flex = "none";
      } else {
        nextPanel.style.width = `${startWidthNext - dx}px`;
        nextPanel.style.flex = "none";
      }
      // Rebuilding the connections SVG on every single mousemove tick is
      // wasteful and makes the drag feel laggy; one redraw per animation
      // frame keeps the lines in sync without doing that work multiple
      // times per frame.
      if (!redrawQueued) {
        redrawQueued = true;
        requestAnimationFrame(() => {
          drawConnections();
          redrawQueued = false;
        });
      }
    }

    function onMouseUp() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "";
      resizer.classList.remove("dragging");
    }
  }

  function switchIdeTab(tab) {
    currentIdeTab = tab;
    document.getElementById("tab-ide-html").classList.toggle("active", tab === "html");
    document.getElementById("tab-ide-css").classList.toggle("active", tab === "css");
    renderIDE();
    switchTreeTab(tab === "html" ? "dom" : "cssom");
  }

  function switchTreeTab(tab) {
    currentTreeTab = tab;
    document.getElementById("tab-tree-dom").classList.toggle("active", tab === "dom");
    document.getElementById("tab-tree-cssom").classList.toggle("active", tab === "cssom");
    document.getElementById("tab-tree-render").classList.toggle("active", tab === "render");
    renderTree();
  }

  // ── Parser Log ───────────────────────────────────────
  function logParserAction(msg, type = "html") {
    const logBox = document.getElementById("log-entries");
    const entry = document.createElement("div");
    entry.className = `log-entry ${type}`;
    entry.innerHTML = `&gt; ${msg}`;
    logBox.appendChild(entry);

    const container = document.getElementById("parser-log");
    container.scrollTop = container.scrollHeight;
  }

  // ── Step-Through Parsing ─────────────────────────────
  function parseNextLine() {
    const linesToRender = currentIdeTab === "html" ? IDE_LINES : CSS_LINES;
    const activeSet = currentIdeTab === "html" ? activeElements : activeCssElements;

    for (const line of linesToRender) {
      if (line.elId && !activeSet.has(line.elId)) {
        activeSet.add(line.elId);

        let msg = "";
        if (currentIdeTab === "html") {
          if (line.type === "open") {
            msg = `Read start tag <strong>&lt;${line.tag}&gt;</strong> -&gt; created DOM node`;
          } else if (line.type === "inline") {
            msg = `Read start tag, text content, end tag -&gt; inserted into DOM`;
          } else if (line.type === "self-close") {
            msg = `Read void element <strong>&lt;${line.tag}&gt;</strong> -&gt; inserted into DOM`;
          }
        } else if (line.elId === "stylesheet") {
          msg = `Loaded external file -&gt; created <strong>CSSStyleSheet</strong> root node`;
        } else {
          msg = `Parsed CSS rule <strong>${line.selector}</strong> -&gt; appended to CSSOM`;
        }

        if (msg) logParserAction(msg, currentIdeTab);
        break;
      }
    }

    renderIDE();
    renderTree();
    updatePreview();
    reportProgress();

    const activeLines = document.querySelectorAll(".active-line");
    if (activeLines.length > 0) {
      activeLines[activeLines.length - 1].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }

  function resetParser() {
    activeElements.clear();
    activeCssElements.clear();
    document.getElementById("log-entries").innerHTML = "";
    renderIDE();
    renderTree();
    updatePreview();
    reportProgress();
  }

  function toggleElement(id) {
    const activeSet = currentIdeTab === "html" ? activeElements : activeCssElements;
    const dataRef = currentIdeTab === "html" ? ELEMENTS_DATA : CSS_ELEMENTS_DATA;

    if (activeSet.has(id)) {
      deactivateRecursively(id);
      if (currentIdeTab === "html") {
        logParserAction(
          `Removed node <strong>&lt;${dataRef[id].tag}&gt;</strong> and its children from the DOM.`,
          "html"
        );
      } else {
        logParserAction(
          `Removed rule <strong>${dataRef[id].selector || "StyleSheet"}</strong> from the CSSOM.`,
          "css"
        );
      }
    } else {
      const parentId = dataRef[id].parentId;
      if (parentId && !activeSet.has(parentId)) {
        showToast("Parser error: cannot parse before its parent is parsed.");
        renderIDE();
        return;
      }
      activeSet.add(id);
      if (currentIdeTab === "html") {
        logParserAction(
          `Tokenised <strong>&lt;${dataRef[id].tag}&gt;</strong> -&gt; appended to DOM.`,
          "html"
        );
      } else {
        logParserAction(
          `Parsed rule <strong>${dataRef[id].selector || "StyleSheet"}</strong> -&gt; appended to CSSOM.`,
          "css"
        );
      }
    }
    renderIDE();
    renderTree();
    updatePreview();
    reportProgress();
  }

  function deactivateRecursively(id) {
    const activeSet = currentIdeTab === "html" ? activeElements : activeCssElements;
    const dataRef = currentIdeTab === "html" ? ELEMENTS_DATA : CSS_ELEMENTS_DATA;

    activeSet.delete(id);
    for (const childId of Object.keys(dataRef)) {
      if (dataRef[childId].parentId === id && activeSet.has(childId)) {
        deactivateRecursively(childId);
      }
    }
  }

  // ── IDE Panel Rendering ──────────────────────────────
  function renderIDE() {
    const ideList = document.getElementById("ide-code");
    ideList.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.className = "code-lines-wrapper";

    const linesToRender = currentIdeTab === "html" ? IDE_LINES : CSS_LINES;
    const activeSet = currentIdeTab === "html" ? activeElements : activeCssElements;

    linesToRender.forEach((line, index) => {
      const div = document.createElement("div");
      div.className = "code-line";
      div.style.paddingLeft = line.indent * 25 + 85 + "px";

      if (line.elId) {
        div.setAttribute("data-id", line.elId);
        if (activeSet.has(line.elId)) {
          div.classList.add("active-line");
        }
        div.addEventListener("mouseenter", () => highlightNode(line.elId));
        div.addEventListener("mouseleave", () => highlightNode(null));
      }

      let checkboxHtml = `<div class="line-controls"><span class="line-number" style="margin-right:24px;">${
        index + 1
      }</span></div>`;

      if (line.type !== "close" && line.type !== "doctype") {
        checkboxHtml = `
          <div class="line-controls">
            <span class="line-number">${index + 1}</span>
            <label class="checkbox-container">
              <input type="checkbox" data-toggle-id="${line.elId}" ${
          activeSet.has(line.elId) ? "checked" : ""
        }>
              <span class="checkmark"></span>
            </label>
          </div>
        `;
      }

      let htmlContent = "";
      if (line.type === "doctype") {
        htmlContent = `<span class="tag" style="color:var(--code-keyword);">${line.text
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}</span>`;
      } else if (line.type === "open" && currentIdeTab === "html") {
        const attrHtml = line.attrs ? ` <span class="attr">${line.attrs}</span>` : "";
        htmlContent = `<span class="tag">&lt;${line.tag}${attrHtml}&gt;</span>`;
      } else if (line.type === "close") {
        htmlContent = `<span class="tag">&lt;/${line.tag}&gt;</span>`;
      } else if (line.type === "inline") {
        htmlContent = `<span class="tag">&lt;${line.tag}&gt;</span><span class="text-content">${line.text}</span><span class="tag">&lt;/${line.tag}&gt;</span>`;
      } else if (line.type === "self-close") {
        htmlContent = `<span class="tag">&lt;${line.tag} <span class="attr">${line.attrs}</span>&gt;</span>`;
      } else if (line.type === "css-rule") {
        htmlContent = `<span class="tag" style="color:var(--code-string);">${line.selector}</span> <span class="text-content">${line.styles}</span>`;
      } else if (line.type === "open" && line.elId === "stylesheet") {
        htmlContent = `<span class="tag" style="color:var(--code-comment);">${line.text}</span>`;
      }

      div.innerHTML = checkboxHtml + htmlContent;
      wrapper.appendChild(div);
    });

    ideList.appendChild(wrapper);

    ideList.querySelectorAll("input[data-toggle-id]").forEach((input) => {
      input.addEventListener("change", () => toggleElement(input.dataset.toggleId));
    });
  }

  function parseCssStyles(stylesString) {
    if (!stylesString) return [];
    const inner = stylesString.replace(/^{|}$/g, "").trim();
    if (!inner) return [];
    return inner
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s)
      .map((decl) => {
        const parts = decl.split(":");
        const prop = parts.shift();
        return { prop: prop.trim(), val: parts.join(":").trim() };
      });
  }

  // ── Tree Construction ────────────────────────────────
  function getTopLevelActiveNodes() {
    if (currentTreeTab === "cssom") {
      return activeCssElements.has("stylesheet") ? ["stylesheet"] : [];
    }

    const topLevel = [];
    for (const id of activeElements) {
      const data = ELEMENTS_DATA[id];
      if (currentTreeTab === "render") {
        if (data.tag === "body") topLevel.push(id);
        continue;
      }
      let current = id;
      let isTopLevel = true;
      while (ELEMENTS_DATA[current].parentId) {
        current = ELEMENTS_DATA[current].parentId;
        if (activeElements.has(current)) {
          isTopLevel = false;
          break;
        }
      }
      if (isTopLevel) topLevel.push(id);
    }
    return topLevel;
  }

  function buildTreeStructure() {
    const topLevelIds = getTopLevelActiveNodes();

    if (currentTreeTab === "cssom") {
      const getCssChildren = (parentId) =>
        Object.keys(CSS_ELEMENTS_DATA)
          .filter((id) => CSS_ELEMENTS_DATA[id].parentId === parentId && activeCssElements.has(id))
          .map((id) => ({ id, ...CSS_ELEMENTS_DATA[id], children: getCssChildren(id) }));

      return topLevelIds.map((id) => ({
        id,
        ...CSS_ELEMENTS_DATA[id],
        children: getCssChildren(id),
      }));
    }

    function getActiveChildren(parentId) {
      const children = Object.keys(ELEMENTS_DATA)
        .filter((id) => ELEMENTS_DATA[id].parentId === parentId && activeElements.has(id))
        .filter((id) => {
          if (currentTreeTab === "render" && NON_RENDERED_TAGS.has(ELEMENTS_DATA[id].tag)) {
            return false;
          }
          return true;
        })
        .map((id) => ({
          id,
          ...ELEMENTS_DATA[id],
          children: getActiveChildren(id),
        }));

      if (
        ELEMENTS_DATA[parentId] &&
        ELEMENTS_DATA[parentId].text &&
        (currentTreeTab === "render" || currentTreeTab === "dom")
      ) {
        children.push({
          id: parentId + "-text",
          tag: "#text",
          isTextNode: true,
          text: ELEMENTS_DATA[parentId].text,
          parentId: parentId,
          children: [],
        });
      }
      return children;
    }

    return topLevelIds.map((id) => ({
      id,
      ...ELEMENTS_DATA[id],
      children: getActiveChildren(id),
    }));
  }

  function renderTree() {
    const container = document.getElementById("tree-container");
    const zoomContainer = document.getElementById("zoom-container");
    container.innerHTML = "";
    const svg = document.getElementById("connections-svg");
    svg.innerHTML = "";

    const hasContent = currentTreeTab === "cssom" ? activeCssElements.size > 0 : activeElements.size > 0;

    if (!hasContent) {
      zoomContainer.style.padding = "0";
      const msg = document.createElement("div");
      msg.className = "tree-empty-message";
      msg.textContent =
        currentTreeTab === "cssom"
          ? "Tick the stylesheet line in the CSS tab to start building the CSSOM tree."
          : "Tick lines in the IDE tab to build the tree.";
      container.appendChild(msg);
      return;
    }

    zoomContainer.style.padding = "60px";

    const treeData = buildTreeStructure();

    if (treeData.length === 0 && currentTreeTab === "render") {
      const msg = document.createElement("div");
      msg.className = "tree-empty-message";
      msg.textContent = "Tick the <body> tag to start building the render tree.";
      container.appendChild(msg);
      return;
    }

    const rootsContainer = document.createElement("div");
    rootsContainer.className = "tree-roots";

    const nodeRenderer = currentTreeTab === "cssom" ? createCssomNode : createDomNode;
    treeData.forEach((node) => rootsContainer.appendChild(nodeRenderer(node)));

    container.appendChild(rootsContainer);

    setTimeout(drawConnections, 50);
  }

  const INHERITABLE_PROPS = [
    "color",
    "font-family",
    "font-size",
    "font-weight",
    "text-align",
    "line-height",
  ];

  function getAppliedStyles(nodeData) {
    const applied = [];
    activeCssElements.forEach((cssId) => {
      const rule = CSS_ELEMENTS_DATA[cssId];
      if (rule && rule.selector === nodeData.tag) {
        const line = CSS_LINES.find((l) => l.elId === cssId);
        if (line && line.styles) applied.push(...parseCssStyles(line.styles));
      }
    });
    return applied;
  }

  function getInheritedStyles(nodeId) {
    const inherited = {};
    let current = ELEMENTS_DATA[nodeId].parentId;
    while (current && activeElements.has(current)) {
      const data = ELEMENTS_DATA[current];
      getAppliedStyles(data).forEach((s) => {
        if (INHERITABLE_PROPS.includes(s.prop) && !inherited[s.prop]) {
          inherited[s.prop] = s.val;
        }
      });
      current = ELEMENTS_DATA[current].parentId;
    }
    return Object.keys(inherited).map((prop) => ({
      prop,
      val: inherited[prop],
      inherited: true,
    }));
  }

  // Renders one DOM or render-tree node (an HTML element, annotated with
  // matched + inherited CSS declarations when in the render tab).
  function createDomNode(nodeData) {
    const wrapper = document.createElement("div");
    wrapper.className = "node-wrapper";

    const nodeContainer = document.createElement("div");
    nodeContainer.className = "node-container";

    const nodeEl = document.createElement("div");
    nodeEl.className = "node";
    if (currentTreeTab === "render") {
      nodeEl.classList.add("render-node");
      if (nodeData.tag === "body") nodeEl.classList.add("dashed-node");
    }

    nodeEl.id = `node-${nodeData.id}`;
    if (nodeData.id === highlightedNodeId) nodeEl.classList.add("highlighted");

    if (nodeData.isTextNode) {
      nodeEl.innerHTML = `<span class="text-node-label">"${
        nodeData.text.length > 25 ? nodeData.text.substring(0, 25) + "..." : nodeData.text
      }"</span>`;
      nodeEl.classList.add("text-node");
      nodeEl.title = "Text node: the literal text inside its parent element, not an element itself.";
      nodeContainer.appendChild(nodeEl);
      wrapper.appendChild(nodeContainer);
      return wrapper;
    }

    nodeEl.title =
      currentTreeTab === "render"
        ? `Render tree node for <${nodeData.tag}>: this DOM element combined with the computed styles that apply to it.`
        : `DOM node for <${nodeData.tag}>: created the moment the parser reads this element's start tag.`;

    nodeEl.innerHTML = `<span class="node-tag">${nodeData.tag}</span>`;
    let propsHtml = "";

    if (currentTreeTab === "render") {
      const appliedStyles = getAppliedStyles(nodeData);
      const inheritedStyles = getInheritedStyles(nodeData.id);
      const finalStyles = [...appliedStyles];
      inheritedStyles.forEach((inh) => {
        if (!appliedStyles.find((a) => a.prop === inh.prop)) finalStyles.push(inh);
      });

      if (finalStyles.length > 0) {
        propsHtml =
          `<div class="node-props render-props">` +
          finalStyles
            .map((p) => {
              const inheritedTag = p.inherited
                ? ` <span class="prop-inherited-tag">(inherited)</span>`
                : "";
              return `<div class="prop-line${
                p.inherited ? " prop-inherited" : ""
              }"><span class="prop-name">${p.prop}</span>: <span class="prop-val">${p.val}</span>${inheritedTag}</div>`;
            })
            .join("") +
          "</div>";
      }
    }

    nodeEl.addEventListener("mouseenter", () => highlightCode(nodeData.id));
    nodeEl.addEventListener("mouseleave", () => highlightCode(null));

    nodeContainer.appendChild(nodeEl);

    if (propsHtml) {
      const temp = document.createElement("div");
      temp.innerHTML = propsHtml;
      Array.from(temp.children).forEach((child) => nodeContainer.appendChild(child));
    }

    wrapper.appendChild(nodeContainer);

    if (nodeData.children && nodeData.children.length > 0) {
      const childrenContainer = document.createElement("div");
      childrenContainer.className = "children-container";
      childrenContainer.id = `children-${nodeData.id}`;
      nodeData.children.forEach((child) => childrenContainer.appendChild(createDomNode(child)));
      wrapper.appendChild(childrenContainer);
    }

    return wrapper;
  }

  // Renders one CSSOM node: a style rule, showing only the declarations it
  // owns (a CSSOM rule has no notion of "inherited" - inheritance is a
  // render-tree/computed-style concept, applied once the CSSOM is combined
  // with the DOM).
  function createCssomNode(nodeData) {
    const wrapper = document.createElement("div");
    wrapper.className = "node-wrapper";

    const nodeContainer = document.createElement("div");
    nodeContainer.className = "node-container";

    const nodeEl = document.createElement("div");
    nodeEl.className = "node css-node";
    nodeEl.id = `node-${nodeData.id}`;
    if (nodeData.id === highlightedNodeId) nodeEl.classList.add("highlighted");

    const label = nodeData.id === "stylesheet" ? "StyleSheet" : nodeData.selector;
    nodeEl.innerHTML = `<span class="node-tag">${label}</span>`;
    nodeEl.title =
      nodeData.id === "stylesheet"
        ? "CSSOM root: represents the loaded stylesheet itself, before any of its rules are parsed."
        : `CSSOM rule for "${nodeData.selector}": one entry in the stylesheet's own rule list, independent of the DOM.`;
    nodeEl.addEventListener("mouseenter", () => highlightCode(nodeData.id));
    nodeEl.addEventListener("mouseleave", () => highlightCode(null));

    nodeContainer.appendChild(nodeEl);

    if (nodeData.id !== "stylesheet") {
      const line = CSS_LINES.find((l) => l.elId === nodeData.id);
      const styles = line && line.styles ? parseCssStyles(line.styles) : [];
      if (styles.length > 0) {
        const propsEl = document.createElement("div");
        propsEl.className = "node-props css-props";
        propsEl.innerHTML = styles
          .map(
            (p) =>
              `<div class="prop-line"><span class="prop-name">${p.prop}</span>: <span class="prop-val">${p.val}</span></div>`
          )
          .join("");
        nodeContainer.appendChild(propsEl);
      }
    }

    wrapper.appendChild(nodeContainer);

    if (nodeData.children && nodeData.children.length > 0) {
      const childrenContainer = document.createElement("div");
      childrenContainer.className = "children-container";
      childrenContainer.id = `children-${nodeData.id}`;
      nodeData.children.forEach((child) => childrenContainer.appendChild(createCssomNode(child)));
      wrapper.appendChild(childrenContainer);
    }

    return wrapper;
  }

  function tokenColor(varName) {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }

  function drawConnections() {
    const svg = document.getElementById("connections-svg");
    svg.innerHTML = "";

    const zoomContainer = document.getElementById("zoom-container");
    const containerRect = zoomContainer.getBoundingClientRect();
    svg.style.width = zoomContainer.offsetWidth + "px";
    svg.style.height = zoomContainer.offsetHeight + "px";

    if (currentTreeTab === "cssom") {
      drawTreeConnections(activeCssElements, CSS_ELEMENTS_DATA, containerRect, tokenColor("--accent-info"));
      return;
    }

    const lineColor = currentTreeTab === "render" ? tokenColor("--accent-success") : tokenColor("--accent-danger");

    activeElements.forEach((id) => {
      const data = ELEMENTS_DATA[id];
      if (currentTreeTab === "render" && NON_RENDERED_TAGS.has(data.tag)) return;

      if (data.parentId && activeElements.has(data.parentId)) {
        const parentData = ELEMENTS_DATA[data.parentId];
        if (currentTreeTab === "render" && NON_RENDERED_TAGS.has(parentData.tag)) return;

        const line = buildConnectionLine(
          document.getElementById(`node-${data.parentId}`),
          document.getElementById(`node-${id}`),
          containerRect
        );
        if (!line) return;
        line.style.stroke = lineColor;
        if (currentTreeTab === "render" && parentData.tag === "body") {
          line.setAttribute("stroke-dasharray", "5,5");
        }
        if (id === highlightedNodeId || data.parentId === highlightedNodeId) {
          line.classList.add("highlighted");
          line.style.strokeWidth = "4";
        }
        svg.appendChild(line);
      }
    });

    if (currentTreeTab === "render" || currentTreeTab === "dom") {
      activeElements.forEach((id) => {
        const data = ELEMENTS_DATA[id];
        if (!data.text) return;
        if (currentTreeTab === "render" && NON_RENDERED_TAGS.has(data.tag)) return;

        const line = buildConnectionLine(
          document.getElementById(`node-${id}`),
          document.getElementById(`node-${id}-text`),
          containerRect
        );
        if (!line) return;
        line.style.stroke = currentTreeTab === "render" ? tokenColor("--accent-success") : tokenColor("--accent-danger");
        if (currentTreeTab === "render" && data.tag === "body") {
          line.setAttribute("stroke-dasharray", "5,5");
        }
        if (id === highlightedNodeId) {
          line.classList.add("highlighted");
          line.style.strokeWidth = "4";
        }
        svg.appendChild(line);
      });
    }
  }

  function drawTreeConnections(activeSet, dataRef, containerRect, color) {
    const svg = document.getElementById("connections-svg");
    activeSet.forEach((id) => {
      const data = dataRef[id];
      if (!data.parentId || !activeSet.has(data.parentId)) return;

      const line = buildConnectionLine(
        document.getElementById(`node-${data.parentId}`),
        document.getElementById(`node-${id}`),
        containerRect
      );
      if (!line) return;
      line.style.stroke = color;
      if (id === highlightedNodeId || data.parentId === highlightedNodeId) {
        line.classList.add("highlighted");
        line.style.strokeWidth = "4";
      }
      svg.appendChild(line);
    });
  }

  function buildConnectionLine(parentEl, childEl, containerRect) {
    if (!parentEl || !childEl) return null;

    const parentRect = parentEl.getBoundingClientRect();
    const childRect = childEl.getBoundingClientRect();
    const zoomFactor = currentZoom;

    const startX = (parentRect.left + parentRect.width / 2 - containerRect.left) / zoomFactor;
    const startY = (parentRect.bottom - containerRect.top) / zoomFactor;
    const endX = (childRect.left + childRect.width / 2 - containerRect.left) / zoomFactor;
    const endY = (childRect.top - containerRect.top) / zoomFactor;

    // A smooth S-curve (vertical tangent at both ends) reads as a proper
    // family-tree/org-chart connector instead of a rigid straight line,
    // especially once a parent has several children fanned out sideways.
    const midY = (startY + endY) / 2;
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`);
    path.classList.add("connection");
    return path;
  }

  function highlightNode(id) {
    highlightedNodeId = id;
    renderTree();
  }

  function highlightCode(id) {
    document.querySelectorAll(".code-line").forEach((line) => {
      line.classList.remove("highlighted-line");
    });
    if (id) {
      document.querySelectorAll(`.code-line[data-id="${id}"]`).forEach((el) => {
        el.classList.add("highlighted-line");
      });

      const node = document.getElementById(`node-${id}`);
      if (node) {
        node.classList.add("node-code-highlighted");
        node.style.transform = "translateY(-2px)";
      }
    } else {
      renderTree();
    }
  }

  // ── Live Preview ─────────────────────────────────────
  function generateHTML(nodeId) {
    if (!activeElements.has(nodeId)) return "";
    const data = ELEMENTS_DATA[nodeId];

    if (data.selfClosing) {
      if (data.tag === "link") return `<!-- Extracted link: style.css -->`;
      return `<${data.tag} ${data.attrs || ""}>`;
    }

    const children = Object.keys(ELEMENTS_DATA).filter(
      (key) => ELEMENTS_DATA[key].parentId === nodeId && activeElements.has(key)
    );

    let childrenHTML = children.map((c) => generateHTML(c)).join("\n");
    if (data.text) childrenHTML = data.text + "\n" + childrenHTML;

    return `<${data.tag}>\n${childrenHTML}\n</${data.tag}>`;
  }

  function generateDynamicStyles() {
    let styleStr = "<style>\n";
    if (activeCssElements.has("stylesheet")) {
      for (const line of CSS_LINES) {
        if (line.type === "css-rule" && activeCssElements.has(line.elId)) {
          styleStr += `${line.selector} ${line.styles}\n`;
        }
      }
    }
    styleStr += "</style>";
    return styleStr;
  }

  function updatePreview() {
    const frame = document.getElementById("preview-frame");
    const tabTitle = document.getElementById("browser-tab-title");

    tabTitle.textContent =
      activeElements.has("title") && activeElements.has("head") ? ELEMENTS_DATA.title.text : "New Tab";

    const topLevelIds = [];
    for (const id of activeElements) {
      let current = id;
      let isTopLevel = true;
      while (ELEMENTS_DATA[current].parentId) {
        current = ELEMENTS_DATA[current].parentId;
        if (activeElements.has(current)) {
          isTopLevel = false;
          break;
        }
      }
      if (isTopLevel) topLevelIds.push(id);
    }

    let completeHTML = topLevelIds.map((id) => generateHTML(id)).join("\n");
    const stylesHTML = generateDynamicStyles();

    if (activeElements.has("head")) {
      completeHTML = completeHTML.replace("</head>", `${stylesHTML}\n</head>`);
    } else {
      completeHTML = stylesHTML + "\n" + completeHTML;
    }

    const doc = frame.contentDocument || frame.contentWindow.document;
    doc.open();
    doc.write(activeElements.has("html") ? `<!DOCTYPE html>\n${completeHTML}` : completeHTML);
    doc.close();
  }

  // ── Zoom ─────────────────────────────────────────────
  function initZoom() {
    const wrapper = document.getElementById("tree-scroll-wrapper");
    const zoomContainer = document.getElementById("zoom-container");

    wrapper.addEventListener(
      "wheel",
      (e) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          zoomTree(e.deltaY > 0 ? -0.1 : 0.1);
        }
      },
      { passive: false }
    );

    // Redraw connecting lines exactly when the scale transition finishes,
    // instead of guessing at a fixed delay (see applyZoom).
    zoomContainer.addEventListener("transitionend", (e) => {
      if (e.propertyName === "transform") drawConnections();
    });
  }

  // ── Pan ──────────────────────────────────────────────
  // Click-and-drag panning over the tree canvas (in addition to the native
  // scrollbars), the same interaction as a diagram/whiteboard tool. Tree
  // nodes have no click handler of their own (hovering the IDE lines is what
  // highlights them), so a plain drag never conflicts with anything else.
  function initPan() {
    const wrapper = document.getElementById("tree-scroll-wrapper");
    let isPanning = false;
    let startX = 0;
    let startY = 0;
    let startScrollLeft = 0;
    let startScrollTop = 0;

    wrapper.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      isPanning = true;
      startX = e.clientX;
      startY = e.clientY;
      startScrollLeft = wrapper.scrollLeft;
      startScrollTop = wrapper.scrollTop;
      wrapper.classList.add("panning");
      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (!isPanning) return;
      wrapper.scrollLeft = startScrollLeft - (e.clientX - startX);
      wrapper.scrollTop = startScrollTop - (e.clientY - startY);
    });

    document.addEventListener("mouseup", () => {
      if (!isPanning) return;
      isPanning = false;
      wrapper.classList.remove("panning");
    });
  }

  function zoomTree(delta) {
    currentZoom = Math.max(0.3, Math.min(3, currentZoom + delta));
    applyZoom();
  }

  function resetZoom() {
    currentZoom = 1;
    applyZoom();
  }

  function applyZoom() {
    const zoomContainer = document.getElementById("zoom-container");
    zoomContainer.style.transform = `scale(${currentZoom})`;
    zoomContainer.style.transformOrigin = "top center";
    // #zoom-container animates its transform over 0.1s (see styles.css), so the
    // connecting lines must be redrawn once that transition actually finishes,
    // not on a fixed timer that can fire mid-animation and leave lines pointing
    // at where nodes used to be.
  }

  // ── Toast ────────────────────────────────────────────
  function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  // ── Boot ─────────────────────────────────────────────
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  window.addEventListener("resize", drawConnections);
})();
