/* HTML Tags and Attributes - lesson content. Explains what an element is and what its tag and attributes carry, so it holds up whatever tags an activity happens to drill. */

const PARTS = [
  {
    id: "element",
    number: "01",
    name: "The Element",
    tagline: "A tag, its content, and its closing tag",
    accent: "#2563eb",
    lead:
      "An <strong>element</strong> is one piece of a page. It is written as an opening <strong>tag</strong>, the content, and a closing tag, and the tag name says <strong>what that content is</strong>.",
    anatomy: {
      label: "Four elements, each written its own way",
      parts: [
        { ref: "normal", text: "<p>Some text.</p>", tone: "tag" },
        { text: "\n" },
        {
          ref: "void",
          parts: [
            { text: "<img ", tone: "tag" },
            { text: "src", tone: "attr" },
            { text: "=" },
            { text: '"a.jpg"', tone: "string" },
            { text: " />", tone: "tag" },
          ],
        },
        { text: "\n" },
        {
          ref: "attribute",
          parts: [
            { text: "<a ", tone: "tag" },
            { text: "href", tone: "attr" },
            { text: "=" },
            { text: '"x.html"', tone: "string" },
            { text: ">", tone: "tag" },
            { text: "Link" },
            { text: "</a>", tone: "tag" },
          ],
        },
        { text: "\n" },
        { ref: "comment", text: "<!-- a note -->", tone: "comment" },
      ],
    },
    keyPoint:
      "Tag names are a <strong>fixed vocabulary</strong>. The browser gives an element meaning and defaults only because it already knows the name, so an invented one does nothing.",
    meta: {
      "What it is": "One piece of content, named by its tag",
      "Written as": "<name>content</name>",
      "Why it matters": "The name is what gives content meaning",
    },
    examples: [
      { ref: "normal", syntax: "<tag>content</tag>", label: "Normal element", code: "<p>Some text.</p>", meaning: "Opening tag, content, closing tag. The usual shape." },
      { ref: "void", syntax: "<tag />", label: "Void element", code: '<img src="a.jpg" />', meaning: "No content, so nothing to close. Also <code>br</code>, <code>input</code>, <code>meta</code>." },
      { ref: "attribute", syntax: '<tag name="value">', label: "With an attribute", code: '<a href="x.html">Link</a>', meaning: "Attributes go in the opening tag, never the closing one." },
      { ref: "comment", syntax: "<!-- text -->", label: "Comment", code: "<!-- a note -->", meaning: "Ignored by the browser, but still visible in view-source." },
    ],
    notes: [
      {
        after: "examples",
        title: "Void elements",
        body:
          "Most elements need closing, but void elements never do, because there is no content to wrap. Trying to close one, or forgetting to close one that needs it, both cause trouble.",
      },
      {
        after: "end",
        title: "What the tag name does",
        body:
          "The browser reads the tag name and applies its own defaults for that name, which is why a heading is already large and bold before you write any CSS at all.",
      },
    ],
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
    id: "attributes",
    number: "02",
    name: "Attributes",
    tagline: "Extra settings on an element",
    accent: "#d97706",
    lead:
      "An <strong>attribute</strong> is a setting written inside the opening tag. It carries information the tag name alone cannot: where a link goes, which image to load, or a name for CSS to select by.",
    anatomy: {
      label: "Three elements, and the attributes on them",
      parts: [
        { text: "<a ", tone: "tag" },
        {
          ref: "href",
          parts: [
            { text: "href", tone: "attr" },
            { text: "=" },
            { text: '"page.html"', tone: "string" },
          ],
        },
        { text: " " },
        {
          ref: "class",
          parts: [
            { text: "class", tone: "attr" },
            { text: "=" },
            { text: '"link"', tone: "string" },
          ],
        },
        { text: ">", tone: "tag" },
        { text: "A link" },
        { text: "</a>\n<img ", tone: "tag" },
        {
          ref: "id",
          parts: [
            { text: "id", tone: "attr" },
            { text: "=" },
            { text: '"logo"', tone: "string" },
          ],
        },
        { text: " " },
        {
          ref: "src",
          parts: [
            { text: "src", tone: "attr" },
            { text: "=" },
            { text: '"logo.png"', tone: "string" },
          ],
        },
        { text: " " },
        {
          ref: "alt",
          parts: [
            { text: "alt", tone: "attr" },
            { text: "=" },
            { text: '"A dog"', tone: "string" },
          ],
        },
        { text: ' />\n<input type="checkbox" ', tone: "tag" },
        { ref: "checked", text: "checked", tone: "attr" },
        { text: " />", tone: "tag" },
      ],
    },
    keyPoint:
      "Leaving out a required attribute produces <strong>no error, just an element that quietly does not work</strong>. A link with no <code>href</code> still looks like a link.",
    meta: {
      "What it is": "A setting written inside the opening tag",
      "Written as": 'name="value"',
      "Why it matters": "It carries what the tag name cannot",
    },
    exampleHeadings: ["Written", "Kind", "Example", "What it does"],
    examples: [
      { ref: "class", syntax: 'class="name"', label: "Global", code: 'class="card"', meaning: "A hook for CSS and JavaScript. Any number of elements may share it." },
      { ref: "id", syntax: 'id="name"', label: "Global", code: 'id="main"', meaning: "Also a hook, but meant to appear once on the page." },
      { ref: "href", syntax: 'href="url"', label: "Element specific", code: '<a href="p.html">', meaning: "Where a link goes. Without it, the element is not a link at all." },
      { ref: "src", syntax: 'src="url"', label: "Element specific", code: '<img src="a.jpg">', meaning: "What to load. Required for the element to show anything." },
      { ref: "alt", syntax: 'alt="text"', label: "Element specific", code: '<img alt="A dog">', meaning: "Read out, or shown, when the image cannot be." },
      { ref: "checked", syntax: "checked", label: "Boolean", code: "<input checked>", meaning: "Present means on. There is no value to give it." },
    ],
    notes: [
      {
        after: "anatomy",
        title: "How an attribute is written",
        body:
          "Each attribute is a name, an equals sign, and a value in quotes. Some are global and work on any element, such as <code>class</code> and <code>id</code>; others only mean something on particular elements.",
      },
      {
        after: "examples",
        title: "Boolean attributes",
        body:
          "A few attributes are boolean: writing them at all turns them on, and there is no value to give. Their presence is the setting.",
      },
    ],
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
    id: "semantics",
    number: "03",
    name: "Semantic Tags",
    tagline: "Naming the parts of a page",
    accent: "#0d9488",
    lead:
      "A <strong>semantic</strong> tag says what a piece of the page is <strong>for</strong>. The clearest examples are the ones that name the regions of a page, <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code> and <code>&lt;footer&gt;</code>, each doing the same layout job as a <code>&lt;div&gt;</code> while saying something a <code>&lt;div&gt;</code> cannot.",
    keyPoint:
      "<code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code> and <code>&lt;footer&gt;</code> are called <strong>landmarks</strong>, and a screen reader can jump straight to any of them. A page built from <code>&lt;div&gt;</code>s offers nothing to jump to.",
    blocks: [
      {
        label: "index.html",
        lang: "html",
        code: `<!-- Built from divs. Every region is nameless, and the -->
<!-- class attributes mean nothing to the browser.       -->
<div class="top">The site name</div>
<div class="links"><a href="about.html">About</a></div>
<div class="middle"><h1>The main heading</h1></div>
<div class="bottom">Contact details</div>


<!-- Identical on screen. Every region now says what it -->
<!-- is, and each of these is a landmark.               -->
<header>The site name</header>

<nav>
  <a href="about.html">About</a>
</nav>

<main>
  <h1>The main heading</h1>
</main>

<footer>Contact details</footer>`,
      },
    ],
    exampleHeadings: ["Written", "Kind", "Used for", "What it adds"],
    examples: [
      { syntax: "<header>", label: "Landmark", code: "The top of a page or section", meaning: "Introductory content: a logo, a title, a search box." },
      { syntax: "<nav>", label: "Landmark", code: "A block of navigation links", meaning: "A screen reader can jump to it, or skip past it." },
      { syntax: "<main>", label: "Landmark", code: "The page's main content", meaning: "Exactly one per page. This is what a skip link targets." },
      { syntax: "<footer>", label: "Landmark", code: "The end of a page or section", meaning: "Closing content: contact details, small print, hours." },
      { syntax: "<aside>", label: "Landmark", code: "Content beside the main point", meaning: "A sidebar or pull quote. Related, but not the main thread." },
      { syntax: "<section>", label: "Structural", code: "A themed group of content", meaning: "A part of the page that would carry its own heading." },
      { syntax: "<article>", label: "Structural", code: "A self-contained piece", meaning: "Still makes sense lifted out on its own, like a blog post." },
      { syntax: "<h1> to <h6>", label: "Structural", code: "Headings, in order", meaning: "Builds the outline a reader navigates by. Do not skip levels." },
      { syntax: "<div>", label: "Generic", code: "A block wrapper", meaning: "Means nothing, on purpose. Correct when there is no meaning." },
      { syntax: "<span>", label: "Generic", code: "An inline wrapper", meaning: "The inline equivalent of a div, and equally meaningless." },
    ],
    meta: {
      "What it is": "A tag chosen for what the content is for",
      "Written as": "<header>, <nav>, <main>, <footer>",
      "Why it matters": "It names regions nothing else can name",
    },
    notes: [
      {
        after: "examples",
        title: "What a landmark adds",
        body:
          "A landmark lays out exactly like a <code>&lt;div&gt;</code>, so the page looks no different. What changes is that the browser now exposes a named region, and assistive software can list those regions and jump between them.",
      },
      {
        after: "end",
        title: "Using them well",
        body:
          "Use <code>&lt;main&gt;</code> once per page, keep headings in order without skipping a level, and reach for <code>&lt;div&gt;</code> only when there is genuinely no meaning to express.",
      },
    ],
    demo: {
      editorKind: "html",
      editorLabel: "index.html",
      paneCss: "header, footer, nav, main { border: 1px dashed #94a3b8; padding: 6px; margin-bottom: 6px; }",
      value: "<header>The site name</header>\n<nav><a href=\"#\">About</a></nav>\n<main><h1>The main heading</h1></main>\n<footer>Contact details</footer>",
      result: "Swap any of these for a div and nothing visible changes. The named region is what was lost.",
      panes: [{ label: "Rendered page", html: "", applies: true }],
    },
  },
];

const METAKEYS = ["What it is", "Written as", "Why it matters"];

const LESSON = {
  id: "html-tags-and-attributes",
  metaKeys: METAKEYS,
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
      { label: "Where it is written", values: ["The tag name itself", "Inside the opening tag", "The tag name itself"] },
      { label: "Visible on screen", values: ["Yes", "Sometimes", "No difference"] },
      { label: "Get it wrong and", values: [ "The content is unmarked or malformed", "The element quietly does not work", "The page looks fine and names nothing", ] },
    ]),
  },
};
