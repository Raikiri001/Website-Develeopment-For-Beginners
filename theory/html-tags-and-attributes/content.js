/* HTML Tags and Attributes - lesson content. Explains what an element is and how markup is structured in general, so it holds up whatever tags an activity happens to drill. */

const PARTS = [
  {
    id: "element",
    number: "01",
    name: "The Element",
    tagline: "A tag, its content, and its closing tag",
    accent: "#2563eb",
    lead:
      "An <strong>element</strong> is one piece of a page. It is written as an opening <strong>tag</strong>, the content, and a closing tag, and the tag name says <strong>what that content is</strong>.",
    blocks: [
      {
        label: "index.html",
        lang: "html",
        code: `<!-- opening tag, content, closing tag -->
<p>Some text.</p>

<!--  ^        ^         ^                     -->
<!--  says     the       repeats the name,     -->
<!--  what     content   with a slash          -->

<!-- The name is what carries the meaning. The -->
<!-- browser gives each name its own defaults. -->
<h1>A heading</h1>

<!-- A few elements have no content, so they   -->
<!-- have nothing to close. These are "void".  -->
<img src="photo.jpg" alt="A description" />`,
      },
    ],
    keyPoint:
      "Tag names are a <strong>fixed vocabulary</strong>. The browser gives an element meaning and defaults only because it already knows the name, so an invented one does nothing.",
    meta: {
      "What it is": "One piece of content, named by its tag",
      "Written as": "<name>content</name>",
      "Why it matters": "The name is what gives content meaning",
    },
    examples: [
      { syntax: "<tag>content</tag>", label: "Normal element", code: "<p>Some text.</p>", meaning: "Opening tag, content, closing tag. The usual shape." },
      { syntax: "<tag />", label: "Void element", code: '<img src="a.jpg" />', meaning: "No content, so nothing to close. Also <code>br</code>, <code>input</code>, <code>meta</code>." },
      { syntax: '<tag name="value">', label: "With an attribute", code: '<a href="x.html">Link</a>', meaning: "Attributes go in the opening tag, never the closing one." },
      { syntax: "<!-- text -->", label: "Comment", code: "<!-- a note -->", meaning: "Ignored by the browser, but still visible in view-source." },
    ],
    notes: {
      "How it works":
        "The browser reads the tag name and applies its own defaults for that name, which is why a heading is already large and bold before you write any CSS at all.",
      "What to watch for":
        "Most elements need closing, but void elements never do, because there is no content to wrap. Trying to close one, or forgetting to close one that needs it, both cause trouble.",
      "Worth remembering":
        "Tag names are a fixed vocabulary. You cannot invent one and expect meaning from it, because the meaning comes from the browser knowing the name already.",
    },
    demo: {
      editorKind: "html",
      editorLabel: "index.html",
      paneCss: "",
      value: "<h1>A heading</h1>\n<p>A paragraph of text.</p>\n<ul>\n  <li>An item</li>\n  <li>Another item</li>\n</ul>",
      result: "Change a tag name and the browser's defaults for that name apply instead. No CSS involved.",
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
    exampleHeadings: ["Shape", "Relationship", "Example", "What it means"],
    examples: [
      { syntax: "<A><B></B></A>", label: "Parent and child", code: "<ul><li></li></ul>", meaning: "<code>li</code> is a direct child of <code>ul</code>, one level down." },
      { syntax: "<A><B></B><B></B></A>", label: "Siblings", code: "<li></li><li></li>", meaning: "Two elements sharing the same parent." },
      { syntax: "<A><B><C></C></B></A>", label: "Descendant", code: "<div><p><strong>", meaning: "<code>strong</code> is a descendant of <code>div</code>, but not its child." },
      { syntax: "<A><B></A></B>", label: "Crossed over", code: "<p><strong>x</p></strong>", meaning: "Invalid. The browser will repair it, and may not repair it your way." },
    ],
    notes: {
      "How it works":
        "An element inside another is its child, and the whole page is one tree of these relationships. Indentation is only for humans, but the nesting itself is real structure.",
      "What to watch for":
        "Tags must close in the reverse order they were opened. Cross them over and the browser repairs the markup by guessing, which is how a page ends up not matching the HTML you wrote.",
      "Worth remembering":
        "Selectors like <code>.card p</code> only work because of this tree. Nesting is not decoration, it is the thing CSS navigates.",
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
    id: "document",
    number: "03",
    name: "The Document",
    tagline: "The skeleton every page starts from",
    accent: "#0d9488",
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
    id: "attributes",
    number: "04",
    name: "Attributes",
    tagline: "Extra settings on an element",
    accent: "#0d9488",
    lead:
      "An <strong>attribute</strong> is a setting written inside the opening tag. It carries information the tag name alone cannot: where a link goes, which image to load, or a name for CSS to select by.",
    blocks: [
      {
        label: "index.html",
        lang: "html",
        code: `<!-- Inside the OPENING tag only, never the closing. -->
<!-- name="value", and several are space separated. -->
<a href="page.html" class="link">A link</a>

<!--  ^^^^  ^^^^^^^^^                             -->
<!--  name   value, in quotes                     -->

<!-- Some attributes are needed for the element  -->
<!-- to work at all. This link goes nowhere:     -->
<a>Not really a link</a>

<!-- Some are just present or absent, with no value. -->
<input type="checkbox" checked />`,
      },
    ],
    keyPoint:
      "Leaving out a required attribute produces <strong>no error, just an element that quietly does not work</strong>. A link with no <code>href</code> still looks like a link.",
    meta: {
      "What it is": "A setting written inside the opening tag",
      "Written as": 'name="value"',
      "Why it matters": "It carries what the tag name cannot",
    },
    exampleHeadings: ["Written", "Kind", "Example", "What it does"],
    examples: [
      { syntax: 'class="name"', label: "Global", code: 'class="card"', meaning: "A hook for CSS and JavaScript. Any number of elements may share it." },
      { syntax: 'id="name"', label: "Global", code: 'id="main"', meaning: "Also a hook, but meant to appear once on the page." },
      { syntax: 'href="url"', label: "Element specific", code: '<a href="p.html">', meaning: "Where a link goes. Without it, the element is not a link at all." },
      { syntax: 'src="url"', label: "Element specific", code: '<img src="a.jpg">', meaning: "What to load. Required for the element to show anything." },
      { syntax: 'alt="text"', label: "Element specific", code: '<img alt="A dog">', meaning: "Read out, or shown, when the image cannot be." },
      { syntax: "checked", label: "Boolean", code: "<input checked>", meaning: "Present means on. There is no value to give it." },
    ],
    notes: {
      "How it works":
        "Each attribute is a name, an equals sign, and a value in quotes. Some are global and work on any element, such as <code>class</code> and <code>id</code>; others only mean something on particular elements.",
      "What to watch for":
        "Leaving out a required attribute usually produces no error, just an element that quietly does not work. A link with no destination still looks like a link.",
      "Worth remembering":
        "A few attributes are boolean: writing them at all turns them on, and there is no value to give. Their presence is the setting.",
    },
    demo: {
      editorKind: "html",
      editorLabel: "index.html",
      paneCss: ".highlight { background: #fef3c7; padding: 2px 6px; }",
      value: '<p class="highlight">This has a class.</p>\n<p>This one does not.</p>\n<a href="page.html">A working link</a>',
      result: "Add or remove an attribute and the element gains or loses that ability.",
      panes: [{ label: "Rendered page", html: "", applies: true }],
    },
  },

  {
    id: "flow",
    number: "05",
    name: "Block and Inline",
    tagline: "How elements take up space",
    accent: "#db2777",
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
<!-- as its content. a, strong, em, img, span.      -->
<p>Some <strong>bold words</strong> inside a line.</p>

<!-- Width and height are ignored on inline elements. -->
<!-- CSS can change which one an element behaves as.  -->`,
      },
    ],
    keyPoint:
      "<strong>Width and height do nothing on an inline element.</strong> If sizing is being ignored, check whether the element is inline before checking your CSS.",
    meta: {
      "What it is": "Whether an element takes a whole line",
      "Written as": "Not written; it is the tag's default",
      "Why it matters": "It decides whether sizing works at all",
    },
    exampleHeadings: ["Written", "Kind", "Example", "What it does"],
    examples: [
      { syntax: "block", label: "Default for", code: "div, p, h1, ul, li", meaning: "Starts on a new line and fills the width available." },
      { syntax: "inline", label: "Default for", code: "a, strong, em, img", meaning: "Sits inside a line, only as wide as its content." },
      { syntax: "display: block", label: "Change it", code: "span { display: block }", meaning: "Makes an inline element behave as a block." },
      { syntax: "display: inline-block", label: "Change it", code: "a { display: inline-block }", meaning: "Flows inline, but accepts width, height and vertical padding." },
      { syntax: "display: none", label: "Change it", code: ".old { display: none }", meaning: "Removed from the layout entirely, leaving no gap." },
    ],
    notes: {
      "How it works":
        "A block element starts on a new line and stretches to fill its container. An inline element sits inside a line of text and is only as wide as the content it holds.",
      "What to watch for":
        "Setting <code>width</code> or <code>height</code> on an inline element does nothing, and vertical padding on one overlaps its neighbours instead of pushing them away. This is a very common first confusion.",
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
  {
    id: "semantics",
    number: "06",
    name: "Semantics",
    tagline: "What the tag means, not how it looks",
    accent: "#db2777",
    lead:
      "Two elements can look identical and mean completely different things. <strong>Semantics</strong> is choosing the tag whose meaning matches the content, rather than the one whose default appearance you happen to like.",
    blocks: [
      {
        label: "index.html",
        lang: "html",
        code: `<!-- These two look the same on screen. -->
<div class="big-text">Chapter One</div>
<h1>Chapter One</h1>

<!-- Only one of them SAYS "this is a heading". -->
<!-- Search engines and screen readers use that. -->

<!-- Same again: identical look, different meaning. -->
<div class="bold">Warning</div>
<strong>Warning</strong>

<!-- A div means nothing on purpose. Use it when -->
<!-- there is genuinely no meaning to express.   -->
<div class="layout-wrapper">...</div>`,
      },
    ],
    keyPoint:
      "Choosing the right tag <strong>rarely changes how a page looks</strong>, so nothing on screen tells you when you have chosen badly. That is exactly why it gets skipped.",
    meta: {
      "What it is": "Choosing a tag for its meaning",
      "Written as": "<h1> rather than <div class=\"big\">",
      "Why it matters": "Meaning is read by more than just eyes",
    },
    exampleHeadings: ["Written", "Kind", "Used for", "What it adds"],
    examples: [
      { syntax: "<header>", label: "Semantic", code: "Top of a page or section", meaning: "Lays out like a div, but says what it is." },
      { syntax: "<nav>", label: "Semantic", code: "A set of links", meaning: "A screen reader can jump straight to it." },
      { syntax: "<main>", label: "Semantic", code: "The main content", meaning: "One per page. Skip links target it." },
      { syntax: "<footer>", label: "Semantic", code: "End of a page or section", meaning: "Says what it is rather than where it sits." },
      { syntax: "<article>", label: "Semantic", code: "A self-contained piece", meaning: "Makes sense on its own, out of context." },
      { syntax: "<div>", label: "Generic", code: "A layout wrapper", meaning: "Means nothing, on purpose. Use when there is no meaning." },
      { syntax: "<span>", label: "Generic", code: "An inline wrapper", meaning: "The inline equivalent of a div. Also means nothing." },
    ],
    notes: {
      "How it works":
        "The browser exposes the meaning of your tags to other software. A screen reader can list every heading on a page, but only finds the ones marked up as headings.",
      "What to watch for":
        "Semantic does not mean styled. Choosing the right tag rarely changes how a page looks, so nothing on screen tells you when you have chosen badly.",
      "Worth remembering":
        "Pick the tag for what the content is, then style it however you like. Picking a tag for its default appearance is what leads to pages built entirely from divs.",
    },
    demo: {
      editorKind: "html",
      editorLabel: "index.html",
      paneCss: ".big { font-size: 2em; font-weight: bold; }",
      value: '<div class="big">A fake heading</div>\n<h1>A real heading</h1>',
      result: "Both look like headings. Only one is a heading as far as any other software is concerned.",
      panes: [{ label: "Rendered page", html: "", applies: true }],
    },
  },
];

const METAKEYS = ["What it is", "Written as", "Why it matters"];

const LESSON = {
  id: "html-tags-and-attributes",
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
      { label: "Visible on screen", values: ["Yes", "Yes", "Only the body", "Sometimes", "Yes", "No"] },
      { label: "Get it wrong and", values: [ "The content is unmarked or malformed", "The browser repairs it by guessing", "The browser falls back to an old mode", "The element quietly does not work", "Sizing and spacing are ignored", "The page looks fine and means nothing", ] },
    ]),
  },
};
