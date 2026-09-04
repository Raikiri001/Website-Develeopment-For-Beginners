/* HTML Overview - lesson content. Explains what HTML is and what a document is made of, so the vocabulary is in place before any part of it is taught in depth. */

const PARTS = [
  {
    id: "what",
    number: "01",
    name: "What HTML Is For",
    tagline: "Content and meaning, not appearance",
    accent: "#2563eb",
    lead:
      "HTML is how you hand a browser some content and say <strong>what each part of it is</strong>. It is not a programming language and it is not a design tool: nothing in it calculates anything, and nothing in it is about how the page should look.",
    blocks: [
      {
        label: "index.html",
        lang: "html",
        code: `<!-- Plain text. The browser has no idea what any of it is. -->
Sunrise Bakery
Open from six every morning.
About us

<!-- The same words, marked up. Now each part is something. -->
<h1>Sunrise Bakery</h1>
<p>Open from six every morning.</p>
<a href="about.html">About us</a>`,
      },
    ],
    keyPoint:
      "HTML describes <strong>what content is</strong>, never what it looks like. A heading is a heading because of the tag around it, not because it happens to be large and bold.",
    meta: {
      "What it is": "A way of saying what each part of the content is",
      "Written as": "Text with tags marking it up",
      "Why it matters": "The meaning is what everything else builds on",
    },
    exampleHeadings: ["The job", "Belongs to", "Written as", "What it does"],
    examples: [
      { syntax: "Say what this is", label: "HTML", code: "<h1>Sunrise Bakery</h1>", meaning: "Marks the text as the page's main heading." },
      { syntax: "Say where this goes", label: "HTML", code: '<a href="about.html">', meaning: "Marks the text as a link, and says what it links to." },
      { syntax: "Say how it looks", label: "CSS", code: "color: #0d9488;", meaning: "Not HTML's job. Appearance is handled separately." },
      { syntax: "Make it do something", label: "JavaScript", code: "button.addEventListener", meaning: "Not HTML's job either. HTML has no logic in it at all." },
    ],
    notes: [
      {
        after: "code",
        title: "Wrapping content in names",
        body:
          "You write the content, then wrap parts of it in tags that name what those parts are. The browser reads those names and knows it is looking at a heading, a paragraph, a link or an image.",
      },
      {
        after: "examples",
        title: "Who else reads it",
        body:
          "HTML is read by more than browsers. Search engines and screen readers use the same markup to work out what a page contains, so the meaning you put in is the meaning they get out.",
      },
      {
        after: "end",
        title: "Neither plain nor styled",
        body:
          "Marked-up content is not plain text and it is not styled either. Every element already has an appearance before you write any CSS, because browsers apply defaults to the tags they recognise, and those defaults are a starting point rather than a design.",
      },
    ],
    demo: {
      editorKind: "html",
      editorLabel: "index.html",
      paneCss: "",
      value: "Sunrise Bakery\nOpen from six every morning.",
      result: "Plain text runs together into one paragraph. Wrap a line in <h1> and the browser finally knows what it is.",
      panes: [{ label: "Rendered page", html: "", applies: true }],
    },
  },

  {
    id: "element",
    number: "02",
    name: "The Element",
    tagline: "The unit everything is built from",
    accent: "#d97706",
    lead:
      "A page is made of <strong>elements</strong>, and an element is one piece of content with a name. It is written as an opening <strong>tag</strong>, the content, and a closing tag, and the name is the part carrying the meaning.",
    anatomy: {
      label: "One element, taken apart",
      parts: [
        {
          ref: "element",
          parts: [
            {
              ref: "open",
              parts: [
                { text: "<", tone: "tag" },
                { ref: "name", text: "p", tone: "tag" },
                { text: ">", tone: "tag" },
              ],
            },
            { ref: "content", text: "Hello World!" },
            {
              ref: "close",
              parts: [
                { text: "</", tone: "tag" },
                { ref: "name", text: "p", tone: "tag" },
                { text: ">", tone: "tag" },
              ],
            },
          ],
        },
        { text: "\n\n" },
        {
          ref: "element",
          parts: [
            {
              ref: "open",
              parts: [
                { text: "<", tone: "tag" },
                { ref: "name", text: "p", tone: "tag" },
                { text: " " },
                {
                  ref: "attribute",
                  parts: [
                    { text: "class", tone: "attr" },
                    { text: "=" },
                    { text: '"intro"', tone: "string" },
                  ],
                },
                { text: ">", tone: "tag" },
              ],
            },
            { ref: "content", text: "A short introduction." },
            {
              ref: "close",
              parts: [
                { text: "</", tone: "tag" },
                { ref: "name", text: "p", tone: "tag" },
                { text: ">", tone: "tag" },
              ],
            },
          ],
        },
        { text: "\n" },
        {
          ref: "void",
          parts: [
            { text: "<", tone: "tag" },
            { ref: "name", text: "img", tone: "tag" },
            { text: " " },
            {
              ref: "attribute",
              parts: [
                { text: "src", tone: "attr" },
                { text: "=" },
                { text: '"a.jpg"', tone: "string" },
              ],
            },
            { text: " />", tone: "tag" },
          ],
        },
      ],
    },
    keyPoint:
      "Tag names are a <strong>fixed vocabulary</strong>. The browser understands an element only because it already knows the name, so an invented tag name does nothing at all.",
    meta: {
      "What it is": "One piece of content, named by its tag",
      "Written as": "<name>content</name>",
      "Why it matters": "It is the unit every page is built from",
    },
    exampleHeadings: ["Part", "What it is called", "Example", "What it does"],
    examples: [
      { ref: "element", syntax: "<tag>content</tag>", label: "Element", code: "<p>Hello World!</p>", meaning: "One complete piece of content, with a name saying what it is." },
      { ref: "open", syntax: "<tag>", label: "Opening tag", code: "<p>", meaning: "Marks where the element starts. Attributes go here, and nowhere else." },
      { ref: "close", syntax: "</tag>", label: "Closing tag", code: "</p>", meaning: "Marks where it ends. The same name again, with a slash." },
      { ref: "content", syntax: "content", label: "Content", code: "Hello World!", meaning: "What sits between the two tags. Text, other elements, or both." },
      { ref: "name", syntax: "tag", label: "Tag name", code: "p", meaning: "Says what the content is. This is where the meaning lives." },
      { ref: "attribute", syntax: 'name="value"', label: "Attribute", code: 'class="intro"', meaning: "An extra setting the tag name alone cannot carry." },
      { ref: "void", syntax: "<tag />", label: "Void element", code: '<img src="a.jpg" />', meaning: "Holds no content, so there is nothing to close." },
    ],
    notes: [
      {
        after: "anatomy",
        title: "What the tag name does",
        body:
          "The browser reads the tag name, works out what the element is, and applies its own defaults for that name. This is why a heading is already large and bold on a page with no CSS attached to it.",
      },
      {
        after: "examples",
        title: "Elements with nothing to close",
        body:
          "Most elements need a closing tag, but a few hold no content and so have nothing to close. Forgetting to close one that needs it leaves the browser guessing where it was supposed to end.",
      },
      {
        after: "end",
        title: "One element, then a page",
        body:
          "Everything else in HTML is elements arranged in some way. Once you can read one element, a whole page is the same thing repeated and nested.",
      },
    ],
    demo: {
      editorKind: "html",
      editorLabel: "index.html",
      paneCss: "",
      value: "<h1>A heading</h1>\n<p>A paragraph of text.</p>\n<a href=\"about.html\">A link</a>",
      result: "Change a tag name and the browser's defaults for that name apply instead. No CSS involved.",
      panes: [{ label: "Rendered page", html: "", applies: true }],
    },
  },

  {
    id: "reading",
    number: "03",
    name: "How A Page Is Read",
    tagline: "Top to bottom, once, in order",
    accent: "#0d9488",
    lead:
      "The browser reads an HTML file <strong>from the top to the bottom</strong>, in the order you wrote it, building the page as it goes. Nothing jumps around and nothing runs twice, so the order elements appear in the file is the order they appear on the page.",
    blocks: [
      {
        label: "index.html",
        lang: "html",
        code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Read first. Information ABOUT the page. -->
    <title>Sunrise Bakery</title>
  </head>
  <body>
    <!-- Read next, and drawn in this order. -->
    <h1>Sunrise Bakery</h1>
    <p>Open from six every morning.</p>
  </body>
</html>`,
      },
    ],
    keyPoint:
      "The order in the file <strong>is</strong> the order on the page. Swap two elements in the HTML and they swap on screen, without a line of CSS being involved.",
    meta: {
      "What it is": "The browser working through the file in order",
      "Written as": "Not written; it is the order you type things",
      "Why it matters": "It decides what appears where, before any CSS",
    },
    notes: [
      {
        after: "meta",
        title: "Top to bottom, once",
        body:
          "The browser starts at the first line and works down, turning each element it meets into part of the page. By the time it reaches the end of the file, the page exists.",
      },
      {
        after: "code",
        title: "Reading forwards only",
        body:
          "Because it only reads forwards, anything referred to before it has been read is a problem. This is why stylesheets are linked near the top, so the styling is ready before there is a page to apply it to.",
      },
      {
        after: "end",
        title: "Source order",
        body:
          "CSS can move things around later, but the source order is the starting point and it is also the order the page is read aloud in. Getting it right in the HTML matters even when CSS is going to rearrange it.",
      },
    ],
    demo: {
      editorKind: "html",
      editorLabel: "index.html (the body)",
      paneCss: "",
      value: "<h1>Sunrise Bakery</h1>\n<p>Open from six every morning.</p>\n<p>Closed on Sundays.</p>",
      result: "Swap two lines in the editor and they swap on the page. Source order is page order.",
      panes: [{ label: "Rendered page", html: "", applies: true }],
    },
  },

  {
    id: "meaning",
    number: "04",
    name: "Meaning Comes First",
    tagline: "Choosing the tag that says the right thing",
    accent: "#7c3aed",
    lead:
      "Several tags can be made to look identical, and only one of them will be <strong>saying the right thing</strong>. Choosing on appearance is the single most common HTML mistake, because the page looks correct either way.",
    blocks: [
      {
        label: "index.html",
        lang: "html",
        code: `<!-- Looks like a heading. Is not a heading. -->
<div class="big-bold-text">Sunrise Bakery</div>

<!-- Looks the same once styled. IS a heading. -->
<h1>Sunrise Bakery</h1>


<!-- Looks like a link. Goes nowhere, and cannot -->
<!-- be reached with a keyboard.                 -->
<div class="looks-clickable">About us</div>

<!-- IS a link. Works without any help from you. -->
<a href="about.html">About us</a>`,
      },
    ],
    keyPoint:
      "Nothing on screen tells you whether you chose the right tag. A wrong choice looks <strong>completely fine</strong> and is only noticed by the things that read the page rather than look at it.",
    meta: {
      "What it is": "Picking the tag that matches what the content is",
      "Written as": "<h1> rather than a styled <div>",
      "Why it matters": "The right tag brings behaviour and meaning free",
    },
    exampleHeadings: ["Content", "The right tag", "The wrong tag", "What the wrong one costs"],
    examples: [
      { syntax: "The page's main title", label: "<h1>", code: "<div class=\"title\">", meaning: "The page loses its outline, so nothing can navigate by heading." },
      { syntax: "Somewhere to go", label: "<a href>", code: "<div onclick>", meaning: "No keyboard access, no right click to open in a tab, no address shown." },
      { syntax: "Something to press", label: "<button>", code: "<div class=\"btn\">", meaning: "Not focusable and not announced as a button." },
      { syntax: "A run of items", label: "<ul><li>", code: "<p>* item</p>", meaning: "Nothing knows how many items there are, or that it is a list at all." },
      { syntax: "A picture", label: "<img alt>", code: "A background image", meaning: "Nothing can describe it, so it is invisible to anyone not looking." },
    ],
    notes: [
      {
        after: "code",
        title: "The div that looks right",
        body:
          "The failure here is silent. A styled <code>div</code> and a real heading look identical on screen, so nothing prompts you to fix it, and the cost falls entirely on people using a screen reader or a keyboard.",
      },
      {
        after: "examples",
        title: "What the right tag brings",
        body:
          "Each tag comes with meaning and, for some of them, behaviour: a link can be followed and a button can be pressed with a keyboard, and you get all of that without writing anything extra. Recreating it on a <code>div</code> means rebuilding it yourself, badly.",
      },
      {
        after: "end",
        title: "Choosing the tag",
        body:
          "Choose the tag for what the content <em>is</em>, then style it however you like. Going the other way, choosing a tag for how it looks and then fixing the meaning later, almost never gets fixed.",
      },
    ],
  },

  {
    id: "linking",
    number: "05",
    name: "A Page Is Not Alone",
    tagline: "Reaching stylesheets, images and other pages",
    accent: "#db2777",
    lead:
      "A page on its own is only text. Almost every page also points at <strong>other files</strong>: a stylesheet to style it, images to show, and other pages to link to. Each of those is a <strong>path</strong> saying where to find the file.",
    blocks: [
      {
        label: "index.html",
        lang: "html",
        code: `<head>
  <!-- Pulls in the styling for this page. -->
  <link rel="stylesheet" href="css/styles.css" />
</head>

<body>
  <!-- Pulls in a file and shows it here. -->
  <img src="images/logo.png" alt="The bakery logo" />

  <!-- Points at another page. Nothing is pulled in -->
  <!-- until someone actually clicks it.            -->
  <a href="about.html">About us</a>
</body>`,
      },
    ],
    tree: {
      label: "The files index.html reaches, and how",
      lines: [
        { depth: 0, name: "site/", kind: "folder" },
        { depth: 1, name: "index.html", kind: "file", mark: "you are here" },
        { depth: 1, name: "about.html", kind: "file", mark: "href" },
        { depth: 1, name: "css/", kind: "folder" },
        { depth: 2, name: "styles.css", kind: "file", mark: "href" },
        { depth: 1, name: "images/", kind: "folder" },
        { depth: 2, name: "logo.png", kind: "file", mark: "src" },
      ],
    },
    keyPoint:
      "A path that does not lead anywhere produces <strong>no error message</strong>. The stylesheet simply does not apply, or the image simply does not appear, and the page loads regardless.",
    meta: {
      "What it is": "A page pointing at the other files it needs",
      "Written as": 'href="..." and src="..."',
      "Why it matters": "Nothing arrives unless the path reaches it",
    },
    exampleHeadings: ["Written", "What it reaches", "Example", "What it does"],
    examples: [
      { syntax: '<link href="...">', label: "A stylesheet", code: 'href="css/styles.css"', meaning: "Loaded straight away, so the page can be styled as it is drawn." },
      { syntax: '<img src="...">', label: "An image file", code: 'src="images/logo.png"', meaning: "Loaded straight away and shown in place." },
      { syntax: '<a href="...">', label: "Another page", code: 'href="about.html"', meaning: "Not loaded until someone clicks. Until then it is only a pointer." },
      { syntax: '<script src="...">', label: "A JavaScript file", code: 'src="js/app.js"', meaning: "Loaded and run, which is how a page gains behaviour." },
    ],
    notes: [
      {
        after: "tree",
        title: "Every one is a path",
        body:
          "Every one of these is a path, written from the file doing the pointing to the file being pointed at, so moving either file breaks it. A broken path fails quietly, which is why a page with no styling on it is usually a path problem rather than a CSS one.",
      },
      {
        after: "examples",
        title: "Pulled in, or pointed at",
        body:
          "Some of these are pulled in as the page loads, so they are part of what you see. A link is different: it only points, and nothing happens until someone follows it.",
      },
      {
        after: "end",
        title: "What makes a site",
        body:
          "This is what makes a set of pages a site rather than a folder of files. The same stylesheet can serve every page, and the links between pages are what turn them into something you can move around in.",
      },
    ],
  },
];

const METAKEYS = ["What it is", "Written as", "Why it matters"];

const LESSON = {
  id: "html-overview",
  metaKeys: METAKEYS,
  exampleHeadings: ["Part", "What it is called", "Example", "What it does"],
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
      { label: "Where you meet it", values: [ "Before you write any HTML at all", "On every line of every page", "As soon as a page has two things on it", "Every time you reach for a tag", "As soon as a page needs anything else", ] },
      { label: "Get it wrong and", values: [ "Content ends up styled but meaningless", "The browser guesses where the element ends", "Things appear in an order you did not intend", "The page looks fine and says the wrong thing", "The file quietly never arrives", ] },
    ]),
  },
};
