/* HTML Structure - lesson content. Explains how markup is arranged into a document, so it holds up whatever tags an activity happens to use. */

const PARTS = [
  {
    id: "document",
    number: "01",
    name: "The Document",
    tagline: "The skeleton every page starts from",
    accent: "#2563eb",
    lead:
      "Every page is one big nested element, and its shape is <strong>always the same</strong>: a doctype, an <code>html</code> element, a <code>head</code> for information about the page, and a <code>body</code> for what is shown.",
    blocks: [
      {
        label: "index.html",
        lang: "html",
        code: `<!-- Not a tag. It tells the browser which HTML this is. -->
<!DOCTYPE html>

<!-- Everything else lives inside this one element. -->
<html lang="en">
  <!-- ABOUT the page. None of this is displayed. -->
  <head>
    <meta charset="UTF-8" />
    <title>Shown in the browser tab</title>
  </head>

  <!-- The page itself. Everything visible goes here. -->
  <body>
    <h1>A heading</h1>
  </body>
</html>`,
      },
    ],
    keyPoint:
      "Without the doctype the browser drops into a compatibility mode built for 1990s pages, and layouts start behaving in ways <strong>no amount of CSS will explain</strong>.",
    meta: {
      "What it is": "The fixed outer shape of every page",
      "Written as": "<!DOCTYPE html> then html, head, body",
      "Why it matters": "Leaving it out changes how the page is read",
    },
    exampleHeadings: ["Written", "Part", "Where", "What it does"],
    examples: [
      { syntax: "<!DOCTYPE html>", label: "Doctype", code: "The first line", meaning: "Not a tag. Tells the browser to use modern standards mode." },
      { syntax: '<html lang="en">', label: "Root element", code: "Wraps everything", meaning: "<code>lang</code> helps screen readers and translation tools." },
      { syntax: "<head>", label: "Page information", code: "Inside html", meaning: "Never displayed. Holds the title, charset and links to CSS." },
      { syntax: "<title>", label: "Tab title", code: "Inside head", meaning: "Shown in the browser tab and as the search result heading." },
      { syntax: '<meta charset="UTF-8">', label: "Character set", code: "Inside head", meaning: "Without it, accented and non-English characters can break." },
      { syntax: "<body>", label: "Visible page", code: "Inside html", meaning: "Everything a visitor actually sees lives here." },
    ],
    notes: {
      "How it works":
        "The doctype tells the browser to use modern standards, <code>head</code> holds information about the page, and <code>body</code> holds everything a visitor actually sees.",
      "What to watch for":
        "Without the doctype the browser switches to a compatibility mode built for pages from the 1990s, and layouts start behaving in ways no amount of CSS will explain.",
      "Worth remembering":
        "The browser builds this skeleton whether or not you type it. Writing it yourself is how you keep control of what ends up in the head.",
    },
    demo: {
      editorKind: "html",
      editorLabel: "index.html (the body)",
      paneCss: "",
      value: "<h1>A heading</h1>\n<p>Everything visible lives in the body.</p>",
      result: "Only body content is ever displayed. Head content shapes the page without appearing on it.",
      panes: [{ label: "Rendered page", html: "", applies: true }],
    },
  },

  {
    id: "nesting",
    number: "02",
    name: "Nesting",
    tagline: "Elements inside elements",
    accent: "#d97706",
    lead:
      "Elements go <strong>inside</strong> other elements, and that is what turns a list of tags into a page. The result is a <strong>tree</strong>, and everything CSS and JavaScript do later depends on its shape.",
    blocks: [
      {
        label: "index.html",
        lang: "html",
        code: `<!-- An element inside another is its CHILD. -->
<div>
  <h1>A heading</h1>
  <p>A paragraph.</p>
</div>

<!-- Close in the REVERSE order you opened. -->
<p><strong>Correct</strong> nesting.</p>

<!-- This is crossed over. The browser will   -->
<!-- guess, and its guess may not be yours.   -->
<p><strong>Wrong nesting.</p></strong>`,
      },
    ],
    keyPoint:
      "Tags must close in the <strong>reverse order they were opened</strong>. Cross them over and the browser repairs the markup by guessing, which is how a page stops matching the HTML you wrote.",
    meta: {
      "What it is": "Elements placed inside other elements",
      "Written as": "Indented, opened and closed in order",
      "Why it matters": "It builds the tree the page is made of",
    },
    exampleHeadings: ["Shape", "Verdict", "Example", "What happens"],
    examples: [
      { syntax: "<A><B></B></A>", label: "Correct", code: "<div><p>Text</p></div>", meaning: "Opened and closed in order. The <code>p</code> ends up inside the <code>div</code>." },
      { syntax: "<A><B></A></B>", label: "Crossed over", code: "<p><strong>x</p></strong>", meaning: "Invalid. The browser repairs it, and may not repair it your way." },
      { syntax: "<A>...", label: "Never closed", code: "<div><p>Text</div>", meaning: "The browser closes it for you, at a point it chooses rather than one you did." },
      { syntax: "<p><div></div></p>", label: "Not allowed inside", code: "A div inside a p", meaning: "A <code>p</code> may only hold text-level content, so the browser closes the <code>p</code> early." },
      { syntax: "<img>...</img>", label: "Void, so no children", code: "<img>, <br>, <input>", meaning: "These hold no content, so nothing can be nested inside them." },
      { syntax: "  <p>", label: "Indentation", code: "Two spaces, or none", meaning: "Makes no difference at all. Only the tags decide what is inside what." },
    ],
    notes: {
      "How it works":
        "An element inside another is its child, and the whole page is one tree of these relationships. Indentation is only for humans, but the nesting itself is real structure.",
      "What to watch for":
        "Tags must close in the reverse order they were opened. Cross them over and the browser repairs the markup by guessing, which is how a page ends up not matching the HTML you wrote.",
      "Worth remembering":
        "Indentation is for people reading the file and means nothing to the browser. A page written entirely on one line nests exactly the same way, which is why a badly indented file can still be correct, and a neatly indented one can still be wrong.",
    },
    demo: {
      editorKind: "html",
      editorLabel: "index.html",
      paneCss: "div { border: 1px solid #94a3b8; padding: 8px; }",
      value: "<div>\n  <h1>Inside the box</h1>\n  <p>Also inside the box.</p>\n</div>\n<p>Outside the box.</p>",
      result: "Move an element in or out of the div and its relationship to everything else changes.",
      panes: [{ label: "Rendered page", html: "", applies: true }],
    },
  },

  {
    id: "tree",
    number: "03",
    name: "The Tree",
    tagline: "Naming the relationships nesting creates",
    accent: "#0d9488",
    lead:
      "Once elements are nested, every element on the page sits somewhere in a <strong>tree</strong>, and the positions have names. This is not a way of drawing HTML, it is the model the browser actually builds, and everything written later aims at it.",
    blocks: [
      {
        label: "index.html",
        lang: "html",
        code: `<body>
  <div class="card">
    <h1>A heading</h1>
    <p>Some <strong>bold</strong> text.</p>
  </div>
</body>

<!-- div is the PARENT of h1 and p.              -->
<!-- h1 and p are CHILDREN of div, and SIBLINGS. -->
<!-- strong is a DESCENDANT of div, not a child. -->
<!-- body is an ANCESTOR of every one of them.   -->`,
      },
    ],
    tree: {
      label: "The same markup, drawn as the tree the browser builds",
      lines: [
        { depth: 0, name: "body", kind: "folder" },
        { depth: 1, name: "div.card", kind: "folder", mark: "parent" },
        { depth: 2, name: "h1", kind: "file", mark: "child" },
        { depth: 2, name: "p", kind: "folder", mark: "child" },
        { depth: 3, name: "strong", kind: "file", mark: "descendant" },
      ],
    },
    keyPoint:
      "A <strong>child</strong> is one level down; a <strong>descendant</strong> is any number of levels down. Every child is a descendant, but most descendants are not children, and CSS has a separate selector for each.",
    meta: {
      "What it is": "Every element's position, relative to the others",
      "Written as": "Not written; it comes from the nesting",
      "Why it matters": "It is what CSS and JavaScript both aim at",
    },
    exampleHeadings: ["Position", "Name", "In the example", "What it means"],
    examples: [
      { syntax: "the outermost element", label: "Root", code: "html", meaning: "The one element everything else is inside. A page has exactly one." },
      { syntax: "one level up", label: "Parent", code: "div is the parent of p", meaning: "The element this one sits directly inside. Everything but the root has one." },
      { syntax: "one level down", label: "Child", code: "p is a child of div", meaning: "An element sitting directly inside. An element may have any number." },
      { syntax: "any level up", label: "Ancestor", code: "body is an ancestor of strong", meaning: "The parent, its parent, and so on all the way to the root." },
      { syntax: "any level down", label: "Descendant", code: "strong is a descendant of div", meaning: "A child, a child of a child, and so on however deep it goes." },
      { syntax: "the same level", label: "Sibling", code: "h1 and p are siblings", meaning: "Two elements sharing the same parent. Order between them matters." },
    ],
    notes: {
      "How it works":
        "The browser turns your markup into this tree before it draws anything, and from then on the tree is the page. Change the nesting and you have changed the tree, whatever the page looks like afterwards.",
      "What to watch for":
        "A child and a descendant are not the same thing, and the difference is exactly where beginners lose an afternoon. <code>strong</code> is inside <code>div</code>, so it is a descendant, but its parent is <code>p</code>, so it is not a child of <code>div</code>.",
      "Worth remembering":
        "These names are not jargon for its own sake. CSS selectors and JavaScript both work by walking this tree, so <code>.card p</code> and <code>.card &gt; p</code> only differ because descendant and child are different positions.",
    },
    demo: {
      editorKind: "html",
      editorLabel: "index.html",
      paneCss: "div { border: 1px solid #94a3b8; padding: 8px; } p { border: 1px dashed #cbd5e1; }",
      value: "<div class=\"card\">\n  <h1>A heading</h1>\n  <p>Some <strong>bold</strong> text.</p>\n</div>",
      result: "Move strong out of the p and it becomes a child of the div rather than a descendant only. Same words on screen, different tree.",
      panes: [{ label: "Rendered page", html: "", applies: true }],
    },
  },

  {
    id: "flow",
    number: "04",
    name: "Block and Inline",
    tagline: "How elements take up space",
    accent: "#7c3aed",
    lead:
      "Every element is either <strong>block</strong> or <strong>inline</strong> by default, and that decides whether it starts a new line and whether width and height mean anything to it.",
    blocks: [
      {
        label: "index.html",
        lang: "html",
        code: `<!-- BLOCK: starts on a new line, fills the width. -->
<!-- div, p, h1, ul, li are all block by default.   -->
<p>This takes a whole line.</p>
<p>So does this one.</p>

<!-- INLINE: sits in the flow of text, only as wide -->
<!-- as its content. a, strong, em, span.           -->
<p>Some <strong>bold words</strong> inside a line.</p>

<!-- Width and height are ignored on inline elements, -->
<!-- with one exception: img is inline but IS sized   -->
<!-- by width and height, because it holds a file     -->
<!-- rather than text.                                -->
<!-- CSS can change which one an element behaves as.  -->`,
      },
    ],
    keyPoint:
      "<strong>Width and height do nothing on an inline element</strong>, unless that element holds a file rather than text. If sizing is being ignored, check whether the element is inline before checking your CSS.",
    meta: {
      "What it is": "Whether an element takes a whole line",
      "Written as": "Not written; it is the tag's default",
      "Why it matters": "It decides whether sizing works at all",
    },
    exampleHeadings: ["Written", "Kind", "Example", "What it does"],
    examples: [
      { syntax: "block", label: "Default for", code: "div, p, h1, ul, li", meaning: "Starts on a new line and fills the width available." },
      { syntax: "inline", label: "Default for", code: "a, strong, em, span", meaning: "Sits inside a line, only as wide as its content." },
      { syntax: "inline", label: "Default for, but sizeable", code: "img, video, input", meaning: "Inline, yet <strong>does</strong> take width and height, because it holds a file rather than text." },
      { syntax: "display: block", label: "Change it", code: "span { display: block }", meaning: "Makes an inline element behave as a block." },
      { syntax: "display: inline-block", label: "Change it", code: "a { display: inline-block }", meaning: "Flows inline, but accepts width, height and vertical padding." },
      { syntax: "display: none", label: "Change it", code: ".old { display: none }", meaning: "Removed from the layout entirely, leaving no gap." },
    ],
    notes: {
      "How it works":
        "A block element starts on a new line and stretches to fill its container. An inline element sits inside a line of text and is only as wide as the content it holds.",
      "What to watch for":
        "Setting <code>width</code> or <code>height</code> on an inline element does nothing, and vertical padding on one overlaps its neighbours instead of pushing them away. This is a very common first confusion. The exception is an element holding a file rather than text, such as <code>&lt;img&gt;</code>: it is inline, but width and height do size it, which is why <code>&lt;img width=\"400\"&gt;</code> works.",
      "Worth remembering":
        "The default comes from the tag, but CSS can change it with <code>display</code>. Choose the tag for its meaning and change the behaviour in CSS, never the other way round.",
    },
    demo: {
      editorKind: "html",
      editorLabel: "index.html",
      paneCss: "p, strong { background: #f1f5f9; }",
      value: "<p>A block element.</p>\n<p>Another <strong>inline one</strong> inside a line.</p>",
      result: "The shaded areas show it: blocks claim the full width, inline elements claim only their content.",
      panes: [{ label: "Rendered page", html: "", applies: true }],
    },
  },
];

const METAKEYS = ["What it is", "Written as", "Why it matters"];

const LESSON = {
  id: "html-structure",
  metaKeys: METAKEYS,
  noteLabels: ["How it works", "What to watch for", "Worth remembering"],
  exampleHeadings: ["Syntax", "Kind", "Example", "What it does"],
  demoHint: "Edit the HTML and watch the page rebuild",
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
      { label: "You control it by", values: [ "Typing the skeleton yourself", "Where you open and close tags", "How deeply you nest things", "Which tag you choose", ] },
      { label: "Visible on screen", values: ["Only the body", "Yes", "No, but CSS depends on it", "Yes"] },
      { label: "Get it wrong and", values: [ "The browser falls back to an old mode", "The browser repairs it by guessing", "Selectors reach the wrong elements", "Sizing and spacing are ignored", ] },
    ]),
  },
};
