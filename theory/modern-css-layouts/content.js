/* Modern CSS Layouts - lesson content. Explains normal flow and the two layout systems in general terms, so it holds up whatever arrangement an activity happens to ask for. */

/* The one page every demo in this lesson edits, so the CSS is the only thing that differs. */
const PANE =
  '<div class="layout">\n' +
  '  <div class="item"><p>One</p><button>Open</button></div>\n' +
  '  <div class="item"><p>Two</p><button>Open</button></div>\n' +
  '  <div class="item"><p>Three</p><button>Open</button></div>\n' +
  '  <div class="item"><p>Four</p><button>Open</button></div>\n' +
  "</div>";

/* Every demo starts from the same two rules, so the result is the only difference. */
function demo(value, result) {
  return {
    editorLabel: "styles.css",
    value: value,
    result: result,
    panes: [{ label: "Rendered page", html: PANE, applies: true }],
  };
}

const ITEM_RULE = "\n\n.item {\n  background: #ede9fe;\n  padding: 12px;\n}";

const PARTS = [
  {
    id: "shift",
    number: "01",
    name: "The Big Picture",
    tagline: "The layout shift",
    accent: "#2563eb",
    lead:
      "Layout is deciding <strong>where things sit</strong> on the page. CSS spent years with no tool for that job, so pages were laid out with properties meant for something else. Flexbox and Grid are the two tools built for it, and they work the other way round: you describe the arrangement you want and the browser works out the numbers.",
    blocks: [
      {
        label: "styles.css",
        lang: "css",
        code: `/* The old way: three properties doing a job none of them was for. */
.card {
  float: left;
  width: 33.33%;
  margin-right: 10px;    /* now the three cards no longer fit */
}

/* A layout system: say what the arrangement is. */
.cards {
  display: flex;
  gap: 10px;             /* the browser does the arithmetic */
}`,
      },
    ],
    keyPoint:
      "A layout system lets you <strong>describe the arrangement</strong> and leaves the arithmetic to the browser. Every older technique made you build a layout out of tools meant for something else.",
    meta: {
      "What it is": "Layout systems built into CSS",
      "Written as": "display: flex or display: grid on a container",
      "Why it matters": "You describe the arrangement, not the numbers",
    },
    exampleHeadings: ["Written as", "Kind", "Example", "What it is for"],
    examples: [
      {
        syntax: "float",
        label: "Older tool",
        code: "float: left;",
        meaning:
          "Pulls an element to one side so text wraps around it, which is what it was written for. Whole layouts were built out of it anyway, and every width had to be worked out by hand.",
      },
      {
        syntax: "position",
        label: "Older tool",
        code: "position: absolute;",
        meaning:
          "Takes an element out of the flow and places it at coordinates you give. Still the right answer for one badge sitting over a card, and a poor one for a layout that has to adapt.",
      },
      {
        syntax: "display: table",
        label: "Older tool",
        code: "display: table-cell;",
        meaning:
          "Borrows a table's row and column behaviour for content that is not tabular. The arrangement worked and the markup said the wrong thing about the content.",
      },
      {
        syntax: "display: flex",
        label: "Layout system",
        code: "display: flex;",
        meaning:
          "Lays a container's children out along one axis, with spacing and alignment as properties rather than as arithmetic.",
      },
      {
        syntax: "display: grid",
        label: "Layout system",
        code: "display: grid;",
        meaning:
          "Lays a container's children into rows and columns that you describe up front.",
      },
    ],
    notes: [
      {
        after: "code",
        title: "What actually changed",
        body:
          "In the old version every number depends on every other number, so adding a gap breaks the widths. In the new one the gap is a property of the arrangement and the browser recalculates the widths itself. That is the whole shift: the numbers stop being yours to keep in step.",
      },
      {
        after: "examples",
        title: "The older tools today",
        body:
          "None of these were removed, and two of them still have jobs nothing else does: <code>float</code> for text wrapping around an image, and <code>position</code> for something that has to sit on top of something else. What they are no longer used for is the layout of the page itself.",
      },
      {
        after: "end",
        title: "Not a replacement",
        body:
          "Grid is not a newer replacement for Flexbox. They were designed for different shapes of problem and shipped to do different jobs, which is why learning both is less work than trying to make either one do everything.",
      },
    ],
    demo: demo(
      ".layout {\n  display: flex;\n  gap: 12px;\n}" + ITEM_RULE,
      "One declaration turns four stacked blocks into a row. Delete the display line to see what the same markup does without a layout system."
    ),
  },

  {
    id: "flow",
    number: "02",
    name: "Normal Flow",
    tagline: "The layout you already have",
    accent: "#d97706",
    lead:
      "A page has a layout before you write a single layout property. It is called <strong>normal flow</strong>: block elements stack down the page in the order they are written, each as wide as the space it is given, and inline elements sit side by side along a line and wrap onto the next when they run out of room.",
    blocks: [
      {
        label: "index.html",
        lang: "html",
        code: `<!-- No CSS at all. These still have a layout: -->
<!-- one under the other, in this order.         -->
<div>One</div>
<div>Two</div>
<div>Three</div>

<!-- And these sit along a line inside the paragraph. -->
<p>Some text with <strong>a bold run</strong> in it.</p>`,
      },
    ],
    keyPoint:
      "Normal flow is already correct for most of a page. A column of readable text needs <strong>no layout system at all</strong>, and adding one to something that was already right is how simple pages get complicated.",
    meta: {
      "What it is": "The arrangement a page has with no layout CSS",
      "Written as": "Not written; it is what you start from",
      "Why it matters": "Most of a page needs nothing else",
    },
    exampleHeadings: ["Written as", "Kind", "Example", "How it takes up space"],
    examples: [
      {
        syntax: "display: block",
        label: "Block",
        code: "div, p, h1",
        meaning:
          "On a line of its own, as wide as its container and as tall as its content. Stacks underneath whatever came before it.",
      },
      {
        syntax: "display: inline",
        label: "Inline",
        code: "a, strong",
        meaning:
          "Along the current line, only as wide as its content, wrapping mid sentence. Ignores <code>width</code> and <code>height</code> entirely.",
      },
      {
        syntax: "display: inline-block",
        label: "Both",
        code: "display: inline-block;",
        meaning:
          "Sits on a line like an inline element, but takes a width and a height like a block one.",
      },
      {
        syntax: "display: none",
        label: "Removed",
        code: "display: none;",
        meaning:
          "Not drawn and taking up no room, as though the element were not in the document at all.",
      },
    ],
    notes: [
      {
        after: "code",
        title: "Source order",
        body:
          "In normal flow the order on screen is the order in the file, top to bottom. That is worth keeping true even once you are laying out with Grid, because it is the order a screen reader and a keyboard both follow.",
      },
      {
        after: "examples",
        title: "Default display values",
        body:
          "Nothing here is a mode you switch on. Every element arrives with a <code>display</code> value from the browser's own stylesheet, which is why a <code>div</code> stacks and an <code>a</code> does not. Writing <code>display: flex</code> is changing that value, not adding something new.",
      },
      {
        after: "end",
        title: "Flow inside a layout",
        body:
          "A layout system only governs a container's <strong>direct children</strong>. Inside each of those children, everything is back in normal flow, so the paragraphs in a grid item stack exactly as they always did.",
      },
    ],
    demo: demo(
      ".layout {\n  background: #f1f5f9;\n  padding: 12px;\n}" + ITEM_RULE,
      "No layout property anywhere, and there is still a layout: four blocks stacked in the order they are written."
    ),
  },

  {
    id: "dimensions",
    number: "03",
    name: "One Axis or Two",
    tagline: "The core difference",
    accent: "#0d9488",
    lead:
      "The two tools are not ranked, and they are not interchangeable. Flexbox arranges content <strong>along one axis</strong>, a row or a column. Grid arranges content <strong>into rows and columns at the same time</strong>. Everything else about them follows from that.",
    keyPoint:
      "Ask how many <strong>directions</strong> the arrangement has. One direction is Flexbox, two directions at once is Grid, and the question is quicker to answer than either tool is to undo.",
    meta: {
      "What it is": "The one question that separates the two tools",
      "Written as": "display: flex for one axis, display: grid for two",
      "Why it matters": "The wrong tool makes an easy layout hard",
    },
    exampleHeadings: ["The arrangement", "Directions", "Reach for", "Why"],
    examples: [
      {
        syntax: "A row of buttons",
        label: "One",
        code: "display: flex",
        meaning:
          "Everything sits along a single line, and the only decisions are the spacing between them and how they line up.",
      },
      {
        syntax: "A bar with a logo at one end and links at the other",
        label: "One",
        code: "display: flex",
        meaning:
          "Still one line. Pushing the two ends apart is a single property rather than a width calculation.",
      },
      {
        syntax: "A card's heading, text and button",
        label: "One",
        code: "display: flex",
        meaning:
          "One column, where the button needs to sit at the bottom however long the text runs.",
      },
      {
        syntax: "Header, sidebar, main and footer",
        label: "Two",
        code: "display: grid",
        meaning:
          "The sidebar and the main area share a row while the header and footer span the whole width, so the arrangement has both directions in it.",
      },
      {
        syntax: "A gallery of cards in even rows and columns",
        label: "Two",
        code: "display: grid",
        meaning:
          "Every card should line up with the one above it as well as the one beside it, which only columns can guarantee.",
      },
    ],
    notes: [
      {
        after: "examples",
        title: "Which way the sizing runs",
        body:
          "Flexbox sizes from the <strong>content outwards</strong>: the items are as big as they need to be, then the spare space is shared out. Grid sizes from the <strong>container inwards</strong>: the tracks are decided first, and the items fit into them. That is why a grid holds its shape when one item has more text in it and a flex row does not.",
      },
      {
        after: "end",
        title: "Wrapping",
        body:
          "A wrapping flex container does produce several rows, but each row is measured on its own, so an item in the second row has no reason to line up with the one above it. If the columns have to line up, the arrangement has two directions and Grid is the tool.",
      },
    ],
    demo: demo(
      ".layout {\n  display: flex;\n  gap: 12px;\n}" + ITEM_RULE,
      "Change flex to grid and add grid-template-columns: 1fr 1fr. The same four items go from one line to two rows of two."
    ),
  },

  {
    id: "flexbox",
    number: "04",
    name: "Flexbox",
    tagline: "Micro layouts, one axis",
    accent: "#7c3aed",
    lead:
      "<code>display: flex</code> on an element makes its direct children <strong>flex items</strong>, laid out along one axis. It is the tool for the inside of things: a toolbar, a row of buttons, the contents of a card, anywhere a handful of items share a line and have to be spaced and aligned.",
    keyPoint:
      "Almost every Flexbox property is set on the <strong>container</strong>. The items themselves only say how they grow and shrink.",
    meta: {
      "What it is": "A layout system for one axis at a time",
      "Written as": "display: flex on the container",
      "Why it matters": "It arranges the contents of a component",
    },
    exampleHeadings: ["Written as", "Set on", "Example", "What it does"],
    examples: [
      {
        syntax: "display: flex",
        label: "Container",
        code: "display: flex;",
        meaning:
          "Makes the element a flex container, so its direct children line up along one axis instead of stacking.",
      },
      {
        syntax: "flex-direction",
        label: "Container",
        code: "flex-direction: column;",
        meaning:
          "Which way the line runs. <code>row</code> is the default, and <code>column</code> turns the same layout vertical.",
      },
      {
        syntax: "justify-content",
        label: "Container",
        code: "justify-content: space-between;",
        meaning:
          "How the items are spread <strong>along</strong> the line, including pushing them to the ends or spacing them evenly.",
      },
      {
        syntax: "align-items",
        label: "Container",
        code: "align-items: center;",
        meaning:
          "How the items line up <strong>across</strong> the line, so a short item can be centred against a tall one.",
      },
      {
        syntax: "gap",
        label: "Container",
        code: "gap: 12px;",
        meaning:
          "The space between items, set once on the container instead of as a margin on each item.",
      },
      {
        syntax: "flex-wrap",
        label: "Container",
        code: "flex-wrap: wrap;",
        meaning:
          "Lets items that do not fit move onto a new line, rather than being squeezed narrower and narrower.",
      },
      {
        syntax: "flex",
        label: "Item",
        code: "flex: 1;",
        meaning:
          "How one item grows into spare space or shrinks when there is none. The only common property set on the item rather than the container.",
      },
    ],
    notes: [
      {
        after: "examples",
        title: "The main axis and the cross axis",
        body:
          "<code>justify-content</code> works along the axis the items run on, and <code>align-items</code> works across it. <code>flex-direction</code> decides which is which, so switching to <code>column</code> swaps what those two properties appear to do. MDN's <a href=\"https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox\" target=\"_blank\" rel=\"noopener\">basic concepts of flexbox</a> names the axes and lists the defaults.",
      },
      {
        after: "examples",
        title: "Only the direct children",
        body:
          "A flex container lays out the elements one level down and no further. A paragraph inside a flex item is not a flex item, so wrapping the wrong element is the usual reason a layout does nothing at all.",
      },
      {
        after: "end",
        title: "gap instead of margins",
        body:
          "Spacing items with margins means the first and last one need different values from the rest, and the sums change every time an item is added. <code>gap</code> puts space between items and nowhere else, so it stays correct however many there are.",
      },
    ],
    demo: demo(
      ".layout {\n  display: flex;\n  gap: 12px;\n  justify-content: space-between;\n  align-items: center;\n}" +
        ITEM_RULE,
      "One axis, four items. Try flex-direction: column, or space-around in place of space-between."
    ),
  },

  {
    id: "grid",
    number: "05",
    name: "CSS Grid",
    tagline: "Macro layouts, two axes",
    accent: "#db2777",
    lead:
      "<code>display: grid</code> on an element lets you describe <strong>tracks</strong>, the columns and rows of the layout, and the children drop into the cells those tracks make. It is the tool for the shape of a page: a header across the top, a sidebar beside a main area, a gallery whose cards line up both ways.",
    keyPoint:
      "In Grid you describe the <strong>tracks first</strong> and the items go into them. That is why a grid keeps its shape however much content any one item happens to hold.",
    meta: {
      "What it is": "A layout system for rows and columns at once",
      "Written as": "display: grid on the container",
      "Why it matters": "It arranges the regions of a page",
    },
    exampleHeadings: ["Written as", "Set on", "Example", "What it does"],
    examples: [
      {
        syntax: "display: grid",
        label: "Container",
        code: "display: grid;",
        meaning:
          "Makes the element a grid container, so its direct children are placed into cells rather than stacked.",
      },
      {
        syntax: "grid-template-columns",
        label: "Container",
        code: "grid-template-columns: 200px 1fr;",
        meaning:
          "The columns, listed left to right. Two values make two columns: a fixed 200px one and one taking whatever is left.",
      },
      {
        syntax: "grid-template-rows",
        label: "Container",
        code: "grid-template-rows: auto 1fr auto;",
        meaning:
          "The rows, listed top to bottom. <code>auto</code> is as tall as the content needs, so this is a header and footer with a stretching middle.",
      },
      {
        syntax: "gap",
        label: "Container",
        code: "gap: 16px;",
        meaning:
          "The space between the tracks, in both directions. The same property Flexbox uses, doing the same job.",
      },
      {
        syntax: "repeat()",
        label: "Container",
        code: "repeat(3, 1fr)",
        meaning:
          "Writes the same track several times over, so three equal columns are one short value instead of three repeated ones.",
      },
      {
        syntax: "minmax()",
        label: "Container",
        code: "minmax(200px, 1fr)",
        meaning:
          "Gives a track a floor and a ceiling. With <code>auto-fit</code> the browser fits as many 200px columns as the width allows and shares out the rest.",
      },
      {
        syntax: "grid-column",
        label: "Item",
        code: "grid-column: span 2;",
        meaning:
          "How many columns one item covers. Set on the item, which is how a header spans the full width of a grid.",
      },
    ],
    notes: [
      {
        after: "examples",
        title: "What 1fr means",
        body:
          "An <code>fr</code> is a share of the space <strong>left over</strong> once the fixed tracks and the gaps have been taken out, so <code>200px 1fr</code> is a fixed column and a flexible one. Two tracks of <code>1fr</code> each get half, and <code>2fr 1fr</code> splits it two to one. MDN's <a href=\"https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout\" target=\"_blank\" rel=\"noopener\">basic concepts of grid layout</a> defines the unit and the track vocabulary.",
      },
      {
        after: "examples",
        title: "Naming the areas",
        body:
          "<code>grid-template-areas</code> lets you name the regions and then draw the layout as rows of those names, which reads almost like a picture of the page. It is the same grid described a different way, and worth knowing about once the tracks themselves make sense.",
      },
      {
        after: "end",
        title: "Shared alignment properties",
        body:
          "<code>gap</code>, <code>justify-content</code> and <code>align-items</code> all work in a grid too, and mean the same things. Once you have learned them in one system you have learned them in both.",
      },
    ],
    demo: demo(
      ".layout {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 12px;\n}" + ITEM_RULE,
      "Two columns, so the four items make two rows that line up both ways. Try repeat(4, 1fr), or 2fr 1fr to make the first column twice the second."
    ),
  },

  {
    id: "together",
    number: "06",
    name: "Better Together",
    tagline: "The synergy",
    accent: "#0891b2",
    lead:
      "Real pages use both, at different scales. Grid sets out the <strong>regions</strong> of the page, and Flexbox arranges the <strong>contents</strong> of each region. Neither is doing the other's job, and neither is a fallback for the other.",
    blocks: [
      {
        label: "styles.css",
        lang: "css",
        code: `/* The page: two directions, so Grid. */
.page {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 24px;
}

/* A card inside it: one direction, so Flexbox. */
.card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}`,
      },
    ],
    keyPoint:
      "A grid item can be a flex container, and a flex item can be a grid container. <strong>Nesting the two is the normal case</strong>, not a clever trick.",
    meta: {
      "What it is": "Grid and Flexbox nested at different scales",
      "Written as": "display: grid outside, display: flex inside",
      "Why it matters": "A real page needs both at once",
    },
    exampleHeadings: ["The layer", "Tool", "Written as", "Why that one"],
    examples: [
      {
        syntax: "The page",
        label: "Grid",
        code: "display: grid",
        meaning:
          "Header, sidebar, main and footer are two directions at once, and they have to hold their shape whatever goes inside them.",
      },
      {
        syntax: "A region of the page",
        label: "Grid",
        code: "display: grid",
        meaning:
          "A gallery of cards that line up in rows and columns is still two directions, one level further in.",
      },
      {
        syntax: "A card",
        label: "Flexbox",
        code: "display: flex",
        meaning:
          "A heading, some text and a button run down one line, and the button has to sit at the bottom however long the text is.",
      },
      {
        syntax: "A row inside a card",
        label: "Flexbox",
        code: "display: flex",
        meaning:
          "A label at one end and a button at the other is one axis with the two ends pushed apart.",
      },
      {
        syntax: "The text inside all of it",
        label: "Normal flow",
        code: "display: block",
        meaning:
          "Paragraphs already stack in the right order, so nothing is added. The default is the answer more often than it looks.",
      },
    ],
    ladder: [
      {
        rank: "1",
        title: "Start with the whole page",
        body:
          "Sketch the regions first, before any of their contents. Two directions means the shell is a grid, and its tracks are the only sizes decided at this point.",
        code: ".page { display: grid; grid-template-columns: 220px 1fr; }",
      },
      {
        rank: "2",
        title: "Let each region choose for itself",
        body:
          "A region is a container in its own right, so it picks its own tool by the same question. Nothing it does can move the tracks it sits in.",
        code: ".gallery { display: grid; }   .toolbar { display: flex; }",
      },
      {
        rank: "3",
        title: "Use Flexbox inside the components",
        body:
          "By the time you are laying out the inside of a card or a bar, the arrangement is almost always one line, which is exactly what Flexbox is for.",
        code: ".card { display: flex; flex-direction: column; }",
      },
      {
        rank: "4",
        title: "Space everything with gap",
        body:
          "Each container sets the space between its own children and nothing else. No margins to keep in step, and no first or last item needing a special case.",
        code: "gap: 24px;   gap: 8px;",
      },
    ],
    notes: [
      {
        after: "code",
        title: "One container, one level",
        body:
          "The grid on the page knows nothing about the flex layout inside a card, and the card knows nothing about the tracks it is sitting in. Each container is responsible for one level, which is what makes nesting them safe.",
      },
      {
        after: "ladder",
        title: "Outside in",
        body:
          "Working from the page inwards means every layout decision is made with its container already settled. Starting from a component and building outwards leaves you adjusting the inside of things to fix the outside, which is where the numbers start fighting each other again.",
      },
      {
        after: "end",
        title: "On a narrow screen",
        body:
          "Because each container only governs one level, a page that has to work on a phone is usually one change: the shell's tracks are redeclared so the regions stack in a single column. The Flexbox layouts inside the components often need nothing done to them at all.",
      },
    ],
    demo: demo(
      ".layout {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 12px;\n}\n\n.item {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  background: #ede9fe;\n  padding: 12px;\n}",
      "A grid of four items, each one a flex container laying out its own text and button. Two systems, one page, neither getting in the other's way."
    ),
  },
];

const METAKEYS = ["What it is", "Written as", "Why it matters"];

const LESSON = {
  id: "modern-css-layouts",
  metaKeys: METAKEYS,
  exampleHeadings: ["Written as", "Kind", "Example", "What it does"],
  demoHint: "Edit the CSS and watch the layout change",
  sections: PARTS,
  comparison: {
    columns: PARTS.map(function (s) {
      return s.id;
    }),
    /* The shared questions are read straight off each section's own meta
       strip, so the table and the sections can never disagree. */
    rows: METAKEYS.map(function (key) {
      return {
        label: key,
        values: PARTS.map(function (s) {
          return s.meta[key];
        }),
      };
    }).concat([
      {
        label: "Directions it handles",
        values: [
          "Whatever you work out by hand",
          "One, down the page",
          "This is the question itself",
          "One at a time",
          "Two at once",
          "Both, at different scales",
        ],
      },
      {
        label: "Where you meet it",
        values: [
          "In any stylesheet written before this",
          "On every page, before any CSS",
          "Every time a layout is more than a stack",
          "Inside almost every component",
          "On the shell of almost every page",
          "On any page with more than one region",
        ],
      },
      {
        label: "Get it wrong and",
        values: [
          "Every number depends on every other number",
          "You lay out something already laid out",
          "An easy layout turns into a hard one",
          "Items refuse to line up into columns",
          "A component's contents fight their tracks",
          "One tool is made to do everything",
        ],
      },
    ]),
  },
};
