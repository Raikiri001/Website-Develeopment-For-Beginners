/* HTML Tags and Attributes - lesson content. Every part answers the same questions, in the same order, in the same words, so the three can be read across and compared. */

const PARTS = [
  {
    id: "tags",
    number: "01",
    name: "Tags",
    tagline: "What the thing is",
    accent: "#2563eb",
    lead:
      "A tag says <strong>what a piece of content is</strong>. It wraps the content in an opening and a closing tag, and the browser gives it a default look and behaviour based on which tag you chose.",
    blocks: [
      {
        label: "index.html",
        lang: "html",
        code: `<!-- An opening tag, the content, then a closing tag. -->
<h1>Sunrise Bakery</h1>

<!-- Tags nest. Close them in the reverse order you opened them. -->
<ul>
  <li>Sourdough</li>
  <li>Rye</li>
</ul>

<!-- A few tags have no content, so they never close. -->
<img src="loaf.jpg" alt="A loaf of sourdough" />`,
      },
    ],
    meta: {
      "What it says": "What the content is",
      "Written as": "<name>content</name>",
      "Where it goes": "Around the content",
    },
    notes: {
      "How it works":
        "The browser reads the tag name and applies its defaults: an <code>h1</code> is large and bold, an <code>li</code> gets a bullet. Tags nest inside each other to build the structure of the page.",
      "What to watch for":
        "Tags must close in the reverse order they opened. <code>&lt;p&gt;&lt;strong&gt;text&lt;/p&gt;&lt;/strong&gt;</code> is crossed over, and the browser will guess at what you meant.",
      "Worth remembering":
        "A handful of tags are empty and never close, because there is nothing to wrap: <code>&lt;img&gt;</code>, <code>&lt;br&gt;</code> and <code>&lt;input&gt;</code> are the ones you will meet.",
    },
    demo: {
      editorKind: "html",
      editorLabel: "index.html",
      paneCss: "",
      value: "<h1>Sunrise Bakery</h1>\n<p>Baked fresh every morning.</p>\n<ul>\n  <li>Sourdough</li>\n  <li>Rye</li>\n</ul>",
      result: "Change a tag name and the look changes with it, without touching any CSS.",
      panes: [{ label: "Rendered page", html: "", applies: true }],
    },
  },

  {
    id: "attributes",
    number: "02",
    name: "Attributes",
    tagline: "Extra detail about the thing",
    accent: "#d97706",
    lead:
      "An attribute says <strong>something extra about the element</strong> that the tag name alone cannot. It is written inside the opening tag, as a name and a value in quotes.",
    blocks: [
      {
        label: "index.html",
        lang: "html",
        code: `<!-- Inside the OPENING tag only, never the closing one. -->
<!-- href says where a link goes. -->
<a href="menu.html">See the menu</a>

<!-- Two attributes, separated by a space. -->
<!-- alt describes the image if it cannot be shown. -->
<img src="loaf.jpg" alt="A loaf of sourdough" />

<!-- class and id are hooks for CSS to select. -->
<p class="blurb" id="intro">Baked fresh every morning.</p>

<!-- type changes what an input actually is. -->
<input type="checkbox" />`,
      },
    ],
    meta: {
      "What it says": "Extra detail about the element",
      "Written as": 'name="value"',
      "Where it goes": "Inside the opening tag",
    },
    notes: {
      "How it works":
        "Each attribute is a name, an equals sign and a value in quotes. Several are separated by spaces, and they always sit in the opening tag.",
      "What to watch for":
        "Some attributes are required for the element to work at all. An <code>&lt;a&gt;</code> with no <code>href</code> is not a link, and an <code>&lt;img&gt;</code> with no <code>src</code> shows nothing.",
      "Worth remembering":
        "<code>class</code> and <code>id</code> do nothing on their own. They exist so CSS and JavaScript have something to select the element by.",
    },
    demo: {
      editorKind: "html",
      editorLabel: "index.html",
      paneCss: ".sale { color: #dc2626; font-weight: bold; }",
      value: '<p class="sale">Two loaves for $8</p>\n<p>Normal price $5 each.</p>\n<a href="menu.html">See the menu</a>',
      result: "Add or remove the class and the CSS finds or loses the element.",
      panes: [{ label: "Rendered page", html: "", applies: true }],
    },
  },

  {
    id: "semantic",
    number: "03",
    name: "Semantic Tags",
    tagline: "Choosing the right thing",
    accent: "#0d9488",
    lead:
      "A semantic tag says <strong>what a section of the page is for</strong>, rather than just how it should look. It does the same job as a plain <code>div</code>, but tells the browser and the reader something a <code>div</code> cannot.",
    blocks: [
      {
        label: "index.html",
        lang: "html",
        code: `<!-- These say nothing about what they contain. -->
<div class="top">...</div>
<div class="main-bit">...</div>

<!-- These say exactly what they are, and look identical. -->
<header>Sunrise Bakery</header>
<nav>
  <a href="menu.html">Menu</a>
</nav>
<main>
  <h1>Fresh today</h1>
</main>
<footer>Open 7am to 3pm</footer>`,
      },
    ],
    meta: {
      "What it says": "What a section is for",
      "Written as": "<header>, <nav>, <main>",
      "Where it goes": "Around a whole section",
    },
    notes: {
      "How it works":
        "A semantic tag lays out the same as a <code>div</code>, so the page looks no different. What changes is that the meaning is now written into the markup itself.",
      "What to watch for":
        "Semantic does not mean styled. <code>&lt;header&gt;</code> gets no special appearance, so anyone expecting it to look like a header will be disappointed.",
      "Worth remembering":
        "Screen readers use these tags to let someone jump straight to the navigation or the main content. A page of <code>div</code>s gives them nothing to jump to.",
    },
    demo: {
      editorKind: "html",
      editorLabel: "index.html",
      paneCss: "header, footer { background: #f1f5f9; padding: 6px; }",
      value: "<header>Sunrise Bakery</header>\n<main>\n  <h1>Fresh today</h1>\n  <p>Sourdough and rye.</p>\n</main>\n<footer>Open 7am to 3pm</footer>",
      result: "Swap a semantic tag for a div and nothing visible changes. The meaning is what was lost.",
      panes: [{ label: "Rendered page", html: "", applies: true }],
    },
  },
];

const LESSON = {
  id: "html-tags-and-attributes",
  metaKeys: ["What it says", "Written as", "Where it goes"],
  noteLabels: ["How it works", "What to watch for", "Worth remembering"],
  demoHint: "Edit the HTML and watch the page rebuild",
  sections: PARTS,
  comparison: {
    columns: ["tags", "attributes", "semantic"],
    rows: [
      {
        label: "What it says",
        values: ["What the content is", "Extra detail about the element", "What a section is for"],
      },
      { label: "Written as", values: ["<name>content</name>", 'name="value"', "<header>, <nav>, <main>"] },
      { label: "Where it goes", values: ["Around the content", "Inside the opening tag", "Around a whole section"] },
      { label: "Changes the look", values: ["Yes, by default", "Only via class or id", "No"] },
      { label: "Can stand alone", values: ["Yes", "No, it needs a tag", "Yes"] },
      {
        label: "Leave it out and",
        values: ["There is no element", "The element may not work", "The page still works, meaning is lost"],
      },
    ],
  },
};
