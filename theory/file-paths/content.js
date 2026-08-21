/* File Paths - lesson content. Explains what a path is and how one is resolved in general, so it holds up whatever folder structures an activity happens to use. */

const TREE =
  '<pre class="tree">site/\n  index.html\n  about.html\n  css/\n    styles.css\n  images/\n    logo.png\n  blog/\n    post.html</pre>';

const PARTS = [
  {
    id: "what",
    number: "01",
    name: "What a Path Is",
    tagline: "Directions to another file",
    accent: "#2563eb",
    lead:
      "A <strong>path</strong> is the directions from one file to another. Whenever you write an <code>href</code> or a <code>src</code>, you are telling the browser <strong>where to go looking</strong>, and it follows those directions literally.",
    blocks: [
      {
        label: "index.html",
        lang: "html",
        code: `<!-- Every one of these is a path. -->
<link rel="stylesheet" href="css/styles.css" />
<img src="images/logo.png" alt="Our logo" />
<a href="about.html">About</a>

<!-- The browser follows them from wherever the -->
<!-- current file sits. Get the starting point  -->
<!-- wrong and the whole path is wrong.         -->`,
      },
    ],
    keyPoint:
      "A wrong path fails <strong>silently for CSS</strong>: the page simply loads unstyled. Nothing warns you, so an unstyled page is almost always a broken path rather than broken CSS.",
    exampleHeadings: ["Written in", "Attribute", "Example", "What it points at"],
    examples: [
      { syntax: "<link>", label: "href", code: 'href="css/styles.css"', meaning: "A stylesheet to load and apply to this page." },
      { syntax: "<img>", label: "src", code: 'src="images/logo.png"', meaning: "An image file to fetch and display." },
      { syntax: "<a>", label: "href", code: 'href="about.html"', meaning: "A page to go to when the link is clicked." },
      { syntax: "<script>", label: "src", code: 'src="app.js"', meaning: "A JavaScript file to load and run." },
      { syntax: "CSS", label: "url()", code: "url(../images/bg.png)", meaning: "A file referenced from inside a stylesheet." },
    ],
    meta: {
      "What it is": "Directions from one file to another",
      "Written as": "The value of href, src or url()",
      "Resolved from": "The file the path is written in",
    },
    notes: {
      "How it works":
        "The browser reads the path, works out which file it points at, and requests that file. If nothing is there, the request fails and whatever depended on it does not appear.",
      "What to watch for":
        "A broken image usually shows a placeholder, but a broken stylesheet shows nothing at all. The page just renders with browser defaults, which looks like the CSS is at fault when the path is.",
      "Worth remembering":
        "Paths are case sensitive on most web servers, even though they often are not on your own computer. <code>Logo.png</code> and <code>logo.png</code> are different files once the site is published.",
    },
    demo: {
      editorKind: "html",
      editorLabel: "index.html",
      paneCss: "",
      value: '<a href="about.html">A link with a path</a>\n<p>Change the path and the link changes where it points.</p>',
      result: "The path is just an attribute value. Nothing checks it until something tries to follow it.",
      panes: [{ label: "Rendered page", html: "", applies: true }],
    },
  },

  {
    id: "relative",
    number: "02",
    name: "Relative Paths",
    tagline: "Directions from where you are",
    accent: "#d97706",
    lead:
      "A <strong>relative path</strong> starts from <strong>the folder the current file is in</strong>. It does not say where the site starts, only how to get there from here, which is why the same path can mean different files in different pages.",
    blocks: [
      {
        label: "A folder to navigate",
        lang: "html",
        code: `site/
  index.html
  about.html
  css/
    styles.css
  images/
    logo.png
  blog/
    post.html

<!-- Written in index.html, which sits in site/ -->
about.html          <!-- a sibling, same folder     -->
css/styles.css      <!-- down into css/             -->
images/logo.png     <!-- down into images/          -->
blog/post.html      <!-- down into blog/            -->

<!-- Written in blog/post.html, one level deeper -->
../index.html       <!-- up one, then index.html    -->
../css/styles.css   <!-- up one, then into css/     -->`,
      },
    ],
    keyPoint:
      "<code>../</code> means <strong>go up one folder</strong>. Every <code>../</code> at the front of a path is one level up, and you need one for each folder between you and the site root.",
    exampleHeadings: ["Syntax", "Kind", "Example", "What it means"],
    examples: [
      { syntax: "file.ext", label: "Same folder", code: "about.html", meaning: "A file sitting beside the current one." },
      { syntax: "./file.ext", label: "Same folder, explicit", code: "./about.html", meaning: "Identical to the line above. The <code>./</code> is optional." },
      { syntax: "folder/file.ext", label: "Down one", code: "css/styles.css", meaning: "Into a folder that sits beside the current file." },
      { syntax: "a/b/file.ext", label: "Down two", code: "assets/img/logo.png", meaning: "Each slash is one more level down." },
      { syntax: "../file.ext", label: "Up one", code: "../index.html", meaning: "Out of the current folder, then the file." },
      { syntax: "../../file.ext", label: "Up two", code: "../../index.html", meaning: "One <code>../</code> for each level you need to climb." },
      { syntax: "../folder/file.ext", label: "Up then down", code: "../css/styles.css", meaning: "Climb out, then descend into a different folder." },
    ],
    meta: {
      "What it is": "Directions starting from the current folder",
      "Written as": "file.ext, folder/file.ext, ../file.ext",
      "Resolved from": "The folder of the file it is written in",
    },
    notes: {
      "How it works":
        "The browser starts in the folder holding the current file, then applies each step in turn. A plain name or a folder name goes down, and <code>../</code> goes up.",
      "What to watch for":
        "The same path means different things in different files. <code>css/styles.css</code> works from <code>index.html</code> but not from <code>blog/post.html</code>, which needs <code>../css/styles.css</code> instead.",
      "Worth remembering":
        "Relative paths survive being moved. Copy the whole site folder anywhere, or publish it under any domain, and every relative path still works because none of them names the site root.",
    },
    demo: {
      editorKind: "html",
      editorLabel: "index.html",
      paneCss: ".tree { font-family: monospace; font-size: 12px; background: #f1f5f9; padding: 8px; }",
      value: '<p>From <strong>index.html</strong>, the stylesheet is at:</p>\n<p><code>css/styles.css</code></p>\n<p>From <strong>blog/post.html</strong> it is at:</p>\n<p><code>../css/styles.css</code></p>',
      result: "Same file, two different paths, because the starting point moved.",
      panes: [{ label: "Rendered page", html: "", applies: true }],
    },
  },

  {
    id: "absolute",
    number: "03",
    name: "Absolute Paths",
    tagline: "Directions from a fixed point",
    accent: "#0d9488",
    lead:
      "An <strong>absolute path</strong> starts from a fixed point rather than from the current file, so it means the <strong>same thing written anywhere</strong>. It either starts at the site root with a leading slash, or names a whole address.",
    blocks: [
      {
        label: "Any page in the site",
        lang: "html",
        code: `<!-- Root relative: starts at the site root, whatever -->
<!-- folder this file happens to be in.                -->
<link rel="stylesheet" href="/css/styles.css" />

<!-- Full URL: names the site as well as the file. -->
<a href="https://example.com/about.html">About</a>

<!-- Protocol relative to the page's own scheme. -->
<img src="//example.com/logo.png" alt="Logo" />

<!-- A leading slash does NOT mean "the folder this -->
<!-- project is in". It means the server's root, so -->
<!-- it breaks when a site is published in a        -->
<!-- subfolder, which is why this site avoids it.   -->`,
      },
    ],
    keyPoint:
      "A leading <code>/</code> means <strong>the server's root, not your project folder</strong>. Publish the site into a subfolder and every root-relative path breaks at once.",
    exampleHeadings: ["Syntax", "Kind", "Example", "What it means"],
    examples: [
      { syntax: "/folder/file.ext", label: "Root relative", code: "/css/styles.css", meaning: "From the <strong>server</strong> root, ignoring where the current file sits." },
      { syntax: "https://host/path", label: "Full URL", code: "https://example.com/a.png", meaning: "Names the site as well as the file. Always the same target." },
      { syntax: "//host/path", label: "Protocol relative", code: "//example.com/a.png", meaning: "Uses whatever scheme the page itself was loaded over." },
      { syntax: "#name", label: "Fragment", code: "#contact", meaning: "Somewhere on the current page, not another file at all." },
      { syntax: "mailto:address", label: "Other scheme", code: "mailto:me@example.com", meaning: "Not a file. Hands the address to another application." },
    ],
    meta: {
      "What it is": "Directions from a fixed starting point",
      "Written as": "/folder/file.ext or https://host/file",
      "Resolved from": "The server root, or the named site",
    },
    notes: {
      "How it works":
        "A leading slash tells the browser to start at the root of whatever server it is talking to. A full URL goes further and names the server too, so it works from any site at all.",
      "What to watch for":
        "Root-relative paths look tidier but tie the site to sitting at the root of its domain. This project uses relative paths everywhere for exactly that reason, so it also works from a subfolder.",
      "Worth remembering":
        "Use a full URL when linking to somebody else's site, since there is no relative route to it. Use a relative path within your own.",
    },
    demo: {
      editorKind: "html",
      editorLabel: "index.html",
      paneCss: "",
      value: '<p><a href="https://example.com">A full URL, works from anywhere</a></p>\n<p><a href="about.html">A relative path, works from this folder</a></p>',
      result: "Both are links. Only one of them still means the same file if you move the page.",
      panes: [{ label: "Rendered page", html: "", applies: true }],
    },
  },

  {
    id: "resolving",
    number: "04",
    name: "Resolving a Path",
    tagline: "Working it out step by step",
    accent: "#7c3aed",
    lead:
      "To work out where a relative path lands, <strong>start at the current file's folder and apply one step at a time</strong>. This is exactly what the browser does, and doing it by hand is how you find the mistake.",
    blocks: [
      {
        label: "Working it out",
        lang: "html",
        code: `<!-- Current file:  site/blog/post.html          -->
<!-- Path written:   ../images/logo.png          -->

<!-- Step 0: start in the current file's FOLDER  -->
<!--         site/blog/                          -->

<!-- Step 1: ../   go up one level               -->
<!--         site/                                -->

<!-- Step 2: images/   go down into images        -->
<!--         site/images/                         -->

<!-- Step 3: logo.png   the file itself           -->
<!--         site/images/logo.png    <- resolved  -->

<!-- Note step 0. The starting point is the       -->
<!-- FOLDER, never the file itself, which is the  -->
<!-- single most common slip.                     -->`,
      },
    ],
    keyPoint:
      "Start from the current file's <strong>folder</strong>, not the file. Counting the file itself as a level is the mistake behind most off-by-one path errors.",
    exampleHeadings: ["From", "Path written", "Steps", "Resolves to"],
    examples: [
      { syntax: "index.html", label: "css/styles.css", code: "down into css", meaning: "<code>css/styles.css</code>" },
      { syntax: "blog/post.html", label: "css/styles.css", code: "down into blog/css", meaning: "<code>blog/css/styles.css</code>, which does not exist." },
      { syntax: "blog/post.html", label: "../css/styles.css", code: "up one, then down", meaning: "<code>css/styles.css</code>" },
      { syntax: "blog/post.html", label: "../index.html", code: "up one", meaning: "<code>index.html</code>" },
      { syntax: "blog/post.html", label: "post.html", code: "same folder", meaning: "<code>blog/post.html</code>, itself." },
      { syntax: "index.html", label: "../index.html", code: "up past the root", meaning: "Outside the site. Nothing is there." },
    ],
    meta: {
      "What it is": "Following a path one step at a time",
      "Written as": "Not written; it is worked out",
      "Resolved from": "The current file's folder",
    },
    notes: {
      "How it works":
        "Take the current file's folder as the starting point, then read the path left to right. Each <code>../</code> removes one folder from the end, and each name adds one.",
      "What to watch for":
        "Going up past the top of the site does not wrap around or error, it simply points at nothing. The request fails and whatever needed the file is missing.",
      "Worth remembering":
        "When a path is wrong, resolve it by hand and compare the answer to where the file actually is. The difference tells you exactly how many levels you are out by.",
    },
    demo: {
      editorKind: "html",
      editorLabel: "index.html",
      paneCss: ".tree { font-family: monospace; font-size: 12px; background: #f1f5f9; padding: 8px; white-space: pre; }",
      value: '<p>Resolve <code>../images/logo.png</code> from <code>blog/post.html</code>:</p>\n<p>blog/ &rarr; up one &rarr; images/ &rarr; logo.png</p>\n<p><strong>images/logo.png</strong></p>',
      result: "Every path can be worked out this way, one step at a time.",
      panes: [{ label: "Rendered page", html: "", applies: true }],
    },
  },

  {
    id: "context",
    number: "05",
    name: "Where the Path Starts",
    tagline: "The file it is written in",
    accent: "#db2777",
    lead:
      "A relative path is resolved from <strong>the file it is written in</strong>, not the page being viewed. That distinction does nothing until CSS is in its own file, and then it catches almost everybody.",
    blocks: [
      {
        label: "css/styles.css",
        lang: "css",
        code: `/* This file lives in  site/css/styles.css  */

.logo {
  /* Resolved from site/css/, NOT from the page   */
  /* that linked this stylesheet. So this points  */
  /* at site/css/images/logo.png                  */
  background-image: url(images/logo.png);

  /* To reach site/images/logo.png, climb out of  */
  /* css/ first, exactly as you would in HTML.    */
  background-image: url(../images/logo.png);
}`,
      },
    ],
    keyPoint:
      "A <code>url()</code> in a stylesheet is resolved from <strong>the stylesheet's folder</strong>, not the page's. Move a CSS file into a subfolder and every <code>url()</code> inside it needs rewriting.",
    exampleHeadings: ["Written in", "Path", "Resolved from", "Points at"],
    examples: [
      { syntax: "index.html", label: "images/logo.png", code: "The page's folder", meaning: "<code>images/logo.png</code>" },
      { syntax: "css/styles.css", label: "images/logo.png", code: "The stylesheet's folder", meaning: "<code>css/images/logo.png</code>" },
      { syntax: "css/styles.css", label: "../images/logo.png", code: "The stylesheet's folder", meaning: "<code>images/logo.png</code>" },
      { syntax: "blog/post.html", label: "images/logo.png", code: "The page's folder", meaning: "<code>blog/images/logo.png</code>" },
    ],
    meta: {
      "What it is": "The folder a relative path counts from",
      "Written as": "Not written; it depends on the file",
      "Resolved from": "Whichever file contains the path",
    },
    notes: {
      "How it works":
        "Each file resolves its own paths. An <code>href</code> in a page counts from the page's folder, and a <code>url()</code> in a stylesheet counts from the stylesheet's folder, even though both end up on the same screen.",
      "What to watch for":
        "This is why a background image breaks when a stylesheet is reorganised while the HTML is untouched. Nothing about the page changed, but the starting point for every <code>url()</code> in that file did.",
      "Worth remembering":
        "Ask which <em>file</em> the path is written in, not which page is open. That one question resolves nearly every path that mysteriously does not work.",
    },
    demo: {
      editorKind: "html",
      editorLabel: "index.html",
      paneCss: "",
      value: '<p>In <strong>index.html</strong>, <code>images/logo.png</code> means <code>images/logo.png</code>.</p>\n<p>In <strong>css/styles.css</strong>, the same text means <code>css/images/logo.png</code>.</p>',
      result: "Identical text, two different files, because they were written in different places.",
      panes: [{ label: "Rendered page", html: "", applies: true }],
    },
  },
];

const METAKEYS = ["What it is", "Written as", "Resolved from"];

const LESSON = {
  id: "file-paths",
  metaKeys: METAKEYS,
  noteLabels: ["How it works", "What to watch for", "Worth remembering"],
  exampleHeadings: ["Syntax", "Kind", "Example", "What it means"],
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
      {
        label: "Survives moving the site",
        values: ["Depends which kind", "Yes", "Only a full URL", "Not a path itself", "Yes"],
      },
      {
        label: "Get it wrong and",
        values: [
          "The file silently never loads",
          "You land in the wrong folder",
          "It breaks in a subfolder",
          "You are out by one level",
          "The CSS points somewhere else",
        ],
      },
    ]),
  },
};
