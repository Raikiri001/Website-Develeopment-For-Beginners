/* CSS Selectors - lesson content. Every kind answers the same questions, in the same order, in the same words, so the three can be read across and compared. */

const PANE = '<ul class="menu">\n  <li class="item" id="first">Flat white</li>\n  <li class="item sold-out">Long black</li>\n  <li class="item">Mocha</li>\n</ul>\n<p>Prices include GST.</p>';

const KINDS = [
  {
    id: "basic",
    number: "01",
    name: "Basic Selectors",
    tagline: "Match by name, class or id",
    accent: "#2563eb",
    lead:
      "These selectors match <strong>one element at a time by what it is called</strong>: its tag name, a class it carries, or its id. They are the three you will write most often.",
    blocks: [
      {
        label: "styles.css",
        lang: "css",
        code: `/* By tag name: every <li> on the page. */
li { color: #b45309; }

/* By class, with a full stop. Any number can share it. */
.sold-out { text-decoration: line-through; }

/* By id, with a hash. Meant to appear once per page. */
#first { font-weight: bold; }

/* Joined with no space: BOTH must be true of one element. */
li.sold-out { opacity: 0.5; }

/* Separated by a comma: EITHER one matches. */
li, p { font-family: sans-serif; }`,
      },
    ],
    meta: {
      "What it matches": "Elements by tag, class or id",
      "Written as": "li, .class, #id",
      Specificity: "id beats class beats tag",
    },
    notes: {
      "How it works":
        "A tag name matches every element of that type. A full stop matches a class, a hash matches an id. Joining them with no space demands all of them on the same element.",
      "What to watch for":
        "A space and a comma mean completely different things. <code>li .item</code> means an item inside an li; <code>li, .item</code> means either one.",
      "When to use it":
        "Reach for a class nearly every time. Tag selectors are broad and ids are meant to be unique, so classes are what real stylesheets are built from.",
    },
    demo: {
      editorLabel: "styles.css",
      value: ".sold-out {\n  text-decoration: line-through;\n  color: #dc2626;\n}",
      result: "Only the elements carrying that class respond.",
      panes: [{ label: "index.html", html: PANE, applies: true }],
    },
  },

  {
    id: "combinators",
    number: "02",
    name: "Combinators",
    tagline: "Match by where it sits",
    accent: "#d97706",
    lead:
      "These selectors match <strong>an element by its position relative to another</strong>: inside it, directly inside it, or next to it. They join two selectors with a symbol between them.",
    blocks: [
      {
        label: "styles.css",
        lang: "css",
        code: `/* A space: anywhere inside, at any depth. */
.menu li { padding: 4px; }

/* A > : a DIRECT child only, one level down. */
.menu > li { border-left: 3px solid #2563eb; }

/* A + : the very next sibling, and only that one. */
h2 + p { font-weight: bold; }

/* A ~ : every later sibling that matches. */
h2 ~ p { color: #64748b; }`,
      },
    ],
    meta: {
      "What it matches": "Elements by position relative to another",
      "Written as": "a b, a > b, a + b, a ~ b",
      Specificity: "The sum of both sides",
    },
    notes: {
      "How it works":
        "The symbol between two selectors says how they must be related. A space means a descendant at any depth, and <code>&gt;</code> narrows that to a direct child.",
      "What to watch for":
        "A space is the easiest thing in CSS to add or drop by accident, and it silently changes the meaning rather than causing an error.",
      "When to use it":
        "Use one when the element you want has no useful class of its own, and its position is the only reliable way to describe it.",
    },
    demo: {
      editorLabel: "styles.css",
      value: ".menu > li {\n  border-left: 3px solid #2563eb;\n  padding-left: 8px;\n}",
      result: "Only elements in the described position respond.",
      panes: [{ label: "index.html", html: PANE, applies: true }],
    },
  },

  {
    id: "pseudo",
    number: "03",
    name: "Pseudo-classes and Attributes",
    tagline: "Match by state or attribute",
    accent: "#0d9488",
    lead:
      "These selectors match <strong>an element by something other than its name</strong>: which number child it is, whether it is being hovered, or what its attributes say. They describe a condition rather than a label.",
    blocks: [
      {
        label: "styles.css",
        lang: "css",
        code: `/* A colon: a position among its siblings. */
li:first-child { font-weight: bold; }

/* Counting starts at 1, and takes even, odd or a formula. */
li:nth-child(even) { background-color: #f1f5f9; }

/* Inverts whatever is inside it. */
li:not(.sold-out) { color: #16a34a; }

/* Square brackets: match on an attribute. */
[href] { text-decoration: underline; }

/* ^= starts with. There is also $= ends with, *= contains. */
a[href^="https"] { color: #db2777; }`,
      },
    ],
    meta: {
      "What it matches": "Elements by state, position or attribute",
      "Written as": ":first-child, [href]",
      Specificity: "Counts the same as a class",
    },
    notes: {
      "How it works":
        "A colon introduces a pseudo-class, which describes a condition the element is in. Square brackets test an attribute, either that it exists at all or that its value matches.",
      "What to watch for":
        "<code>:nth-child</code> counts from 1, not 0, which catches out anyone coming from programming. It also counts all siblings, not just the ones matching your selector.",
      "When to use it":
        "Use one when what you want to match cannot be written into the HTML, such as striped rows, the first item in a list, or every external link.",
    },
    demo: {
      editorLabel: "styles.css",
      value: "li:nth-child(even) {\n  background-color: #f1f5f9;\n}",
      result: "Only elements meeting the condition respond.",
      panes: [{ label: "index.html", html: PANE, applies: true }],
    },
  },
];

const LESSON = {
  id: "css-selectors",
  metaKeys: ["What it matches", "Written as", "Specificity"],
  noteLabels: ["How it works", "What to watch for", "When to use it"],
  demoHint: "Edit the selector and watch which elements respond",
  sections: KINDS,
  comparison: {
    columns: ["basic", "combinators", "pseudo"],
    rows: [
      {
        label: "What it matches",
        values: [
          "Elements by tag, class or id",
          "Elements by position relative to another",
          "Elements by state, position or attribute",
        ],
      },
      { label: "Written as", values: ["li, .class, #id", "a b, a > b, a + b, a ~ b", ":first-child, [href]"] },
      { label: "Marker character", values: ["A full stop or a hash", "A space, >, + or ~", "A colon or square brackets"] },
      { label: "Specificity", values: ["id beats class beats tag", "The sum of both sides", "Counts the same as a class"] },
      {
        label: "Needs help from the HTML",
        values: ["Yes, a class or id", "No, position is enough", "No, the condition is enough"],
      },
      {
        label: "Use it for",
        values: [
          "Nearly everything, via classes",
          "Elements with no class of their own",
          "Things the HTML cannot say",
        ],
      },
    ],
  },
  ladder: [
    {
      rank: "1",
      title: "An id beats everything below it",
      body: "One id in a selector outranks any number of classes. This is why ids are awkward to override and why stylesheets lean on classes instead.",
      code: "#first { color: red; }",
    },
    {
      rank: "2",
      title: "Then classes, attributes and pseudo-classes",
      body: "These three all count the same amount, and more of them beats fewer. <code>li.item.sold-out</code> outranks <code>li.item</code>.",
      code: ".item.sold-out { color: red; }",
    },
    {
      rank: "3",
      title: "Then tag names",
      body: "The weakest of the three. Any single class beats any number of tag names, so <code>.item</code> outranks <code>ul li</code>.",
      code: "ul li { color: red; }",
    },
    {
      rank: "4",
      title: "If they tie, the later one wins",
      body: "Two selectors of equal specificity are settled by order alone: whichever is written further down the stylesheet takes effect.",
      code: ".item { color: blue; }\n.item { color: red; }  /* this one */",
    },
  ],
};
