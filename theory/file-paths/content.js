/* File Paths - lesson content. Explains what a path is and how one is resolved in general, so it holds up whatever folder structures an activity happens to use. */

/* The sample site the lesson and the resolver both work over. */
const SITE_FILES = [
  "index.html",
  "about.html",
  "css/styles.css",
  "images/logo.png",
  "blog/post.html",
];

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
      "<strong>Nothing checks a path until something tries to follow it.</strong> How the failure looks then depends on what needed the file: a broken image shows a placeholder, a broken stylesheet leaves the page unstyled, and a broken script does nothing visible at all.",
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
    notes: [
      {
        after: "meta",
        title: "A path is resolved to a file, then that file is requested",
        body:
          "The browser reads the path, works out which file it points at, and requests that file. If nothing is there, the request fails and whatever depended on it does not appear.",
      },
      {
        after: "code",
        title: "Only images tell you when their path is wrong",
        body:
          "Only images announce themselves when they fail. A stylesheet, a script or a link that points nowhere gives you no marker on the page, so the symptom you see is unstyled text, a dead button, or a click that goes to a missing page, rather than anything naming the path.",
      },
      {
        after: "examples",
        title: "Once the site is published, a path is case sensitive",
        body:
          "Paths are case sensitive on most web servers, even where they are not on your own computer, so <code>Logo.png</code> and <code>logo.png</code> become different files once the site is published. Note also that a path in a URL no longer has to match real folders on the server: MDN describes it as <a href=\"https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_URL\" target=\"_blank\" rel=\"noopener\">mostly an abstraction</a> the server handles however it likes.",
      },
    ],
  },

  {
    id: "relative",
    number: "02",
    name: "Relative Paths",
    tagline: "Directions from where you are",
    accent: "#d97706",
    lead:
      "A <strong>relative path</strong> leaves out everything the browser can work out for itself. It starts from <strong>the folder holding the current file</strong>, so the same path written in two different files can point at two different places.",
    keyPoint:
      "<code>../</code> means <strong>go up one folder</strong>. It comes from the Unix file system, and you need one for every level between where you are and where you are going.",
    tree: {
      label: "The site this lesson uses",
      lines: [
        { depth: 0, name: "site/", kind: "folder" },
        { depth: 1, name: "index.html", kind: "file" },
        { depth: 1, name: "about.html", kind: "file" },
        { depth: 1, name: "css/", kind: "folder" },
        { depth: 2, name: "styles.css", kind: "file" },
        { depth: 1, name: "images/", kind: "folder" },
        { depth: 2, name: "logo.png", kind: "file" },
        { depth: 1, name: "blog/", kind: "folder" },
        { depth: 2, name: "post.html", kind: "file" },
      ],
    },
    blocks: [
      {
        label: "Written in index.html",
        lang: "html",
        code: `<!-- index.html sits directly inside site/, so a plain -->
<!-- name is a file beside it, and a folder name goes    -->
<!-- one level down.                                     -->

<a href="about.html">About</a>
<link rel="stylesheet" href="css/styles.css" />
<img src="images/logo.png" alt="Logo" />`,
      },
      {
        label: "Written in blog/post.html",
        lang: "html",
        code: `<!-- This file sits one level deeper, inside blog/, so -->
<!-- everything has to climb out of blog/ first.        -->

<a href="../about.html">About</a>
<link rel="stylesheet" href="../css/styles.css" />
<img src="../images/logo.png" alt="Logo" />`,
      },
    ],
    exampleHeadings: ["Syntax", "Kind", "Example", "What it means"],
    examples: [
      { syntax: "file.ext", label: "Same folder", code: "about.html", meaning: "A file sitting beside the current one." },
      { syntax: "./file.ext", label: "Same folder, spelled out", code: "./about.html", meaning: "Identical to the line above. The <code>./</code> is optional." },
      { syntax: "folder/file.ext", label: "One level down", code: "css/styles.css", meaning: "Into a folder beside the current file, then the file." },
      { syntax: "a/b/file.ext", label: "Two levels down", code: "images/icons/x.png", meaning: "Each slash is one more level down." },
      { syntax: "../file.ext", label: "One level up", code: "../about.html", meaning: "Out of the current folder, then the file." },
      { syntax: "../../file.ext", label: "Two levels up", code: "../../index.html", meaning: "One <code>../</code> for each level you need to climb." },
      { syntax: "../folder/file.ext", label: "Up, then down", code: "../css/styles.css", meaning: "Climb out, then descend into a different folder." },
    ],
    meta: {
      "What it is": "Directions starting from the current folder",
      "Written as": "file.ext, folder/file.ext, ../file.ext",
      "Resolved from": "The folder of the file it is written in",
    },
    notes: [
      {
        after: "meta",
        title: "A plain name goes down a folder, ../ goes up one",
        body:
          "The browser looks for the file in a subfolder of the one holding the current file. A plain name or a folder name goes down; <code>../</code> goes up.",
      },
      {
        after: "tree",
        title: "The same path means different files in different folders",
        body:
          "The same text means different files in different places. <code>css/styles.css</code> is correct in <code>index.html</code> and wrong in <code>blog/post.html</code>, which needs <code>../css/styles.css</code>.",
      },
      {
        after: "examples",
        title: "A relative path survives being moved",
        body:
          "Relative paths survive being moved. Copy the whole folder anywhere, or publish it under any domain or subfolder, and every one of them still works, because none of them names the site root.",
      },
    ],
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
    notes: [
      {
        after: "meta",
        title: "A leading slash starts at the server's root",
        body:
          "A leading slash tells the browser to start at the root of whatever server it is talking to. A full URL goes further and names the server too, so it works from any site at all.",
      },
      {
        after: "code",
        title: "A root-relative path ties the site to its own domain",
        body:
          "Root-relative paths look tidier but tie the site to sitting at the root of its domain. This project uses relative paths everywhere for exactly that reason, so it also works from a subfolder.",
      },
      {
        after: "examples",
        title: "A full URL for other sites, a relative path for yours",
        body:
          "Use a full URL when linking to somebody else's site, since there is no relative route to it. Use a relative path within your own.",
      },
    ],
  },

  {
    id: "resolving",
    number: "04",
    name: "Resolving a Path",
    tagline: "Following it one step at a time",
    accent: "#7c3aed",
    lead:
      "To work out where a relative path lands, <strong>start at the current file's folder and take one step per slash</strong>. This is exactly what the browser does, and doing it by hand is how you find the mistake.",
    keyPoint:
      "Start from the current file's <strong>folder</strong>, not the file itself. Counting the file as a level is the mistake behind almost every off-by-one path error.",
    tree: {
      label: "Resolving ../images/logo.png, written in blog/post.html",
      lines: [
        { depth: 0, name: "site/", kind: "folder" },
        { depth: 1, name: "index.html", kind: "file" },
        { depth: 1, name: "css/", kind: "folder" },
        { depth: 2, name: "styles.css", kind: "file" },
        { depth: 1, name: "images/", kind: "folder" },
        { depth: 2, name: "logo.png", kind: "file", mark: "target" },
        { depth: 1, name: "blog/", kind: "folder" },
        { depth: 2, name: "post.html", kind: "file", mark: "you are here" },
      ],
    },
    ladder: [
      {
        rank: "0",
        title: "Start in the current file's folder",
        body: "Not the file. <code>blog/post.html</code> is the file, so the starting point is <code>blog/</code>.",
        code: "site/blog/",
      },
      {
        rank: "1",
        title: "../  goes up one level",
        body: "Drop the last folder off the end. There is one <code>../</code>, so climb once.",
        code: "site/blog/   ->   site/",
      },
      {
        rank: "2",
        title: "images/  goes down into that folder",
        body: "A folder name adds one level. Add it to the end.",
        code: "site/   ->   site/images/",
      },
      {
        rank: "3",
        title: "logo.png  is the file itself",
        body: "The last segment has no slash after it, so it is the file being asked for.",
        code: "site/images/logo.png",
      },
      {
        rank: "4",
        title: "Check the answer against the tree",
        body: "<code>site/images/logo.png</code> is exactly where the file sits, so the path is right. If it had not matched, the difference would tell you how many levels you were out by.",
        code: "resolved  ==  actual   ->   it works",
      },
    ],
    exampleHeadings: ["Written in", "Path", "What happens", "Resolves to"],
    examples: [
      { syntax: "index.html", label: "css/styles.css", code: "Down into css/", meaning: "<code>css/styles.css</code>. Correct." },
      { syntax: "blog/post.html", label: "css/styles.css", code: "Down into blog/css/", meaning: "<code>blog/css/styles.css</code>. Nothing is there." },
      { syntax: "blog/post.html", label: "../css/styles.css", code: "Up one, then down", meaning: "<code>css/styles.css</code>. Correct." },
      { syntax: "blog/post.html", label: "../index.html", code: "Up one", meaning: "<code>index.html</code>. Correct." },
      { syntax: "blog/post.html", label: "post.html", code: "Same folder", meaning: "<code>blog/post.html</code>, the file itself." },
      { syntax: "index.html", label: "../index.html", code: "Up past the top", meaning: "<code>index.html</code>. A <code>../</code> at the root is thrown away rather than obeyed." },
    ],
    meta: {
      "What it is": "Following a path one step at a time",
      "Written as": "Not written; it is worked out",
      "Resolved from": "The current file's folder",
    },
    notes: [
      {
        after: "meta",
        title: "Read the path left to right, one segment at a time",
        body:
          "Take the current file's folder, then read the path left to right. Each <code>../</code> removes one folder from the end, each folder name adds one, and the last segment is the file.",
      },
      {
        after: "tree",
        title: "Climbing above the top of the site is silently ignored",
        body:
          "Climbing above the top of the site does not warn you. Any <code>../</code> with nothing left to climb is silently thrown away, so <code>../../../logo.png</code> at the root lands on <code>logo.png</code>. A path with too many of them can therefore still work, which hides the mistake until you move the file.",
      },
      {
        after: "ladder",
        title: "Resolve the path by hand and compare it with the real file",
        body:
          "When something will not load, resolve its path by hand and compare the answer with where the file actually sits. The gap between the two is your mistake, and usually it is one level.",
      },
    ],
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
      "A path is resolved from <strong>the file it is written in</strong>, not the page being viewed. That makes no difference until a file links another file, and then a <code>url()</code> in a stylesheet counts from the stylesheet's folder rather than the page's.",
    tree: {
      label: "index.html links css/styles.css, and both want images/logo.png",
      lines: [
        { depth: 0, name: "site/", kind: "folder" },
        { depth: 1, name: "index.html", kind: "file", mark: "images/logo.png" },
        { depth: 1, name: "css/", kind: "folder" },
        { depth: 2, name: "styles.css", kind: "file", mark: "../images/logo.png" },
        { depth: 1, name: "images/", kind: "folder" },
        { depth: 2, name: "logo.png", kind: "file", mark: "target" },
      ],
    },
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
    notes: [
      {
        after: "meta",
        title: "Every file resolves its paths from its own folder",
        body:
          "Each file resolves its own paths. An <code>href</code> in a page counts from the page's folder, and a <code>url()</code> in a stylesheet counts from the stylesheet's folder, even though both end up on the same screen.",
      },
      {
        after: "tree",
        title: "Moving a stylesheet breaks the images it points at",
        body:
          "This is why a background image breaks when a stylesheet is reorganised while the HTML is untouched. Nothing about the page changed, but the starting point for every <code>url()</code> in that file did.",
      },
      {
        after: "examples",
        title: "Ask which file the path is written in",
        body:
          "Ask which <em>file</em> the path is written in, not which page is open. That one question resolves nearly every path that mysteriously does not work.",
      },
    ],
  },
];

const METAKEYS = ["What it is", "Written as", "Resolved from"];

const LESSON = {
  id: "file-paths",
  metaKeys: METAKEYS,
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
