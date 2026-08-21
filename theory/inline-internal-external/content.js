/* Inline, Internal, External - lesson content. Every section answers the same questions, in the same order, in the same words, so the three can be read across and compared. */

const METHODS = [
  {
    id: "external",
    number: "01",
    name: "External CSS",
    tagline: "In a file of its own",
    accent: "#2563eb",
    lead:
      "The CSS lives in a separate <code>.css</code> file. It reaches <strong>every page that links the file</strong>, and it needs a selector to say which elements to style.",
    blocks: [
      {
        label: "index.html",
        lang: "html",
        code: `<head>
  <!-- One line joins the whole file to this page. -->
  <link rel="stylesheet" href="styles.css" />
</head>

<body>
  <h1 class="title">Sunrise Bakery</h1>
</body>`,
      },
      {
        label: "styles.css",
        lang: "css",
        code: `/* A file of its own: no <style> tags, just rules. */
/* The selector says which elements this applies to. */

.title {
  color: #0d9488;
}`,
      },
    ],
    meta: {
      "Where it lives": "A .css file",
      Reach: "Every page that links the file",
      "Use it for": "Sites with more than one page",
    },
    notes: {
      "How it works":
        "The <code>&lt;link&gt;</code> joins the file to the page, and every rule in that file applies. The selector decides which elements each rule reaches.",
      "What it costs":
        "It is a second file and a second request. If the path in <code>href</code> is wrong the file never loads, and the page appears with no styling at all.",
      "When to use it":
        "Whenever the site has more than one page. One file styles all of them, so a colour change happens once and reaches everywhere.",
    },
  },

  {
    id: "internal",
    number: "02",
    name: "Internal CSS",
    tagline: "In a style block in the page",
    accent: "#d97706",
    lead:
      "The CSS lives in a <code>&lt;style&gt;</code> block in the page's head. It reaches <strong>this one page</strong>, and it needs a selector to say which elements to style.",
    blocks: [
      {
        label: "index.html",
        lang: "html",
        code: `<head>
  <!-- No separate file: the rules sit in the page. -->
  <style>
    /* The selector says which elements this applies to. */
    .title {
      color: #b45309;
    }
  </style>
</head>

<body>
  <h1 class="title">Sunrise Bakery</h1>
</body>`,
      },
    ],
    meta: {
      "Where it lives": "A <style> block in <head>",
      Reach: "This one page",
      "Use it for": "A single standalone page",
    },
    notes: {
      "How it works":
        "The rules sit inside the page itself, written exactly as they would be in a <code>.css</code> file. The selector decides which elements each rule reaches.",
      "What it costs":
        "It reaches no other page. A second page needs its own copy, so the same rules now exist twice and both have to be kept in step.",
      "When to use it":
        "Whenever there is only one page, or for a quick test where a second file is more trouble than it is worth.",
    },
  },

  {
    id: "inline",
    number: "03",
    name: "Inline CSS",
    tagline: "In an attribute on the element",
    accent: "#7c3aed",
    lead:
      "The CSS lives in a <code>style</code> attribute on the element. It reaches <strong>that one element</strong>, and it needs no selector, because the attribute is already on the element it styles.",
    blocks: [
      {
        label: "index.html",
        lang: "html",
        code: `<body>
  <!-- No separate file and no style block. -->
  <!-- No selector either: declarations only. -->
  <h1 class="title" style="color: #7c3aed;">Sunrise Bakery</h1>

  <!-- Same class, but untouched. The attribute -->
  <!-- reaches one element and cannot be shared. -->
  <h1 class="title">Corner Cafe</h1>
</body>`,
      },
    ],
    meta: {
      "Where it lives": "A style attribute",
      Reach: "That one element",
      "Use it for": "Styles set by JavaScript",
    },
    notes: {
      "How it works":
        "The declarations sit in an attribute on the element, with no selector and no curly brackets. There is nothing to select, because the attribute is already attached to what it styles.",
      "What it costs":
        "It reaches no other element. Every element that wants the same styling needs its own copy, and styling is mixed into markup meant to describe structure.",
      "When to use it":
        "Almost never by hand. It belongs to JavaScript setting styles as a page runs, and to HTML email, where stylesheets are often stripped out.",
    },
  },
];

const DEMOS = {
  external: {
    editorLabel: "styles.css",
    mode: "external",
    value: ".title {\n  color: #0d9488;\n}",
    result: "Both pages, both headings.",
  },
  internal: {
    editorLabel: "the <style> block in index.html",
    mode: "internal",
    value: ".title {\n  color: #b45309;\n}",
    result: "The first page only. about.html gets nothing.",
  },
  inline: {
    editorLabel: 'the style attribute on the first heading',
    mode: "inline",
    value: "color: #7c3aed;",
    result: "The first heading only. Nothing else is touched.",
  },
};

/* Every demo shows the same two pages with the same two headings, so reach is visible without a control to fiddle with. */
const PANES = {
  external: [
    { label: "index.html", html: '<h1 class="title" id="headline">Sunrise Bakery</h1>\n<h1 class="title">Corner Cafe</h1>', applies: true },
    { label: "about.html", html: '<h1 class="title">About us</h1>\n<h1 class="title">Our bakers</h1>', applies: true },
  ],
  internal: [
    { label: "index.html", html: '<h1 class="title" id="headline">Sunrise Bakery</h1>\n<h1 class="title">Corner Cafe</h1>', applies: true },
    { label: "about.html", html: '<h1 class="title">About us</h1>\n<h1 class="title">Our bakers</h1>', applies: false },
  ],
  inline: [
    { label: "index.html", html: '<h1 class="title" id="headline">Sunrise Bakery</h1>\n<h1 class="title">Corner Cafe</h1>', applies: false, inlineTarget: ".title" },
    { label: "about.html", html: '<h1 class="title">About us</h1>\n<h1 class="title">Our bakers</h1>', applies: false },
  ],
};

METHODS.forEach(function (m) {
  m.demo = {
    editorLabel: DEMOS[m.id].editorLabel,
    value: DEMOS[m.id].value,
    result: DEMOS[m.id].result,
    panes: PANES[m.id],
  };
});

const METAKEYS = ["Where it lives", "Reach", "Use it for"];

const LESSON = {
  id: "inline-internal-external",
  metaKeys: METAKEYS,
  noteLabels: ["How it works", "What it costs", "When to use it"],
  demoHint: "Edit the CSS and watch how far it reaches",
  sections: METHODS,
  comparison: {
    columns: METHODS.map(function (s) {
      return s.id;
    }),
    /* The shared questions are read straight off each section's own meta
       strip, so the table and the sections can never disagree. */
    rows: METAKEYS.map(function (key) {
      return {
        label: key,
        values: METHODS.map(function (s) {
          return s.meta[key];
        }),
      };
    }).concat([
      { label: "Needs a selector", values: ["Yes", "Yes", "No"] },
      { label: "To reuse it", values: ["Link the same file", "Copy it into each page", "Copy it onto each element"] },
      { label: "Beaten by", values: [ "A more specific selector", "A more specific selector", "Only !important", ] },
    ]),
  },
  ladder: [
  {
    rank: "1",
    title: "!important beats everything",
    body:
      "A declaration marked <code>!important</code> goes ahead of every other one, inline included. It is nearly always a sign something has gone wrong elsewhere, and using it starts a fight the next person has to win with another <code>!important</code>.",
    code: `.title { color: #0d9488 !important; }`,
  },
  {
    rank: "2",
    title: "Then inline",
    body:
      "A <code>style</code> attribute goes ahead of any selector, however specific. There is no selector you can write that beats it, which is much of why inline CSS is awkward to work with.",
    code: `<h1 style="color: #7c3aed;">`,
  },
  {
    rank: "3",
    title: "Then the more specific selector",
    body:
      "An id goes ahead of a class, and a class goes ahead of a tag. This is decided by the selector itself, not by whether it sits in a file or a style block.",
    code: `#headline  >  .title  >  h1`,
  },
  {
    rank: "4",
    title: "Then whichever comes last",
    body:
      "If the selectors tie, the one written later goes ahead. The <code>&lt;style&gt;</code> block usually sits after the <code>&lt;link&gt;</code>, so internal CSS tends to win a tie against external.",
    code: `<link rel="stylesheet" href="styles.css" />
<style> /* this one wins a tie */ </style>`,
  },
],
};

/* The cascade playground, built by cascade.js. Selector choices run least to most specific. */
const PLAYGROUND = {
  selectors: ["h1", ".title", "#headline"],
  sources: [
    { id: "external", label: "External CSS", selector: ".title", value: "#0d9488", on: true, important: false },
    { id: "internal", label: "Internal CSS", selector: ".title", value: "#b45309", on: true, important: false },
    { id: "inline", label: "Inline CSS", value: "#7c3aed", on: true, important: false },
  ],
};
