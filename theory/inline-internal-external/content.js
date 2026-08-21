/* Inline, Internal, External - lesson content: the three methods, their annotated code, and the cascade summary. */

const CSS_METHODS = [
  {
    id: "external",
    number: "01",
    name: "External CSS",
    tagline: "A file of its own",
    accent: "#2563eb",
    lead:
      "The CSS lives in a separate file, and the page pulls it in from the head. This is how nearly every real website is built, and it should be your default choice.",
    blocks: [
      {
        label: "index.html",
        lang: "html",
        code: `<head>
  <!-- One line joins the whole stylesheet to this page. -->
  <!-- href is a path, exactly like an <img> src. -->
  <link rel="stylesheet" href="styles.css" />
</head>

<body>
  <h1 class="title">Sunrise Bakery</h1>
</body>`,
      },
      {
        label: "styles.css",
        lang: "css",
        code: `/* A file of its own. No <style> tags in here, just rules. */
/* Every page that links this file gets these rules. */

.title {
  color: #0d9488;
  font-size: 32px;
}`,
      },
    ],
    meta: {
      Reach: "Every page that links the file",
      Reuse: "Write once, use on all of them",
      "Best for": "Anything with more than one page",
    },
    notes: [
      "The win is that one file styles the whole site. Change the heading colour in <code>styles.css</code> and all forty pages change together, because they all point at the same file.",
      "The browser also downloads it once and reuses the copy for every other page, so the rest of the site loads faster.",
      "The trade-off is that it is a second file and a second request. If the path in <code>href</code> is wrong, nothing loads and the page appears completely unstyled.",
    ],
  },

  {
    id: "internal",
    number: "02",
    name: "Internal CSS",
    tagline: "A style block in the page",
    accent: "#d97706",
    lead:
      "The CSS is written straight into the page's head, inside a style element. Same rules and same selectors as an external file, but it reaches this page and no other.",
    blocks: [
      {
        label: "index.html",
        lang: "html",
        code: `<head>
  <!-- No separate file and no link. The CSS is right here. -->
  <style>
    /* Identical syntax to styles.css: selector, then declarations. */
    .title {
      color: #b45309;
      font-size: 32px;
    }
  </style>
</head>

<body>
  <h1 class="title">Sunrise Bakery</h1>
</body>`,
      },
    ],
    meta: {
      Reach: "This one page only",
      Reuse: "None. Copy the page, copy the CSS",
      "Best for": "A single standalone page",
    },
    notes: [
      "Notice the syntax inside <code>&lt;style&gt;</code> is exactly what you would write in a <code>.css</code> file. The only thing that changed is where it sits.",
      "The catch is reach. A second page needs its own copy, and now there are two copies of the same rules to keep in step. Change one and you have to remember the other.",
      "It genuinely earns its place for a one-off page, a quick experiment, or a small critical rule you want applied before an external file has finished downloading.",
    ],
  },

  {
    id: "inline",
    number: "03",
    name: "Inline CSS",
    tagline: "An attribute on one element",
    accent: "#7c3aed",
    lead:
      "The CSS is written as a style attribute directly on a single element. There is no selector and no curly brackets, because it can only ever affect the one element it is written on.",
    blocks: [
      {
        label: "index.html",
        lang: "html",
        code: `<body>
  <!-- Declarations only. No selector, because it already knows -->
  <!-- which element it is on, and no curly brackets either. -->
  <h1 class="title" style="color: #7c3aed; font-size: 32px;">
    Sunrise Bakery
  </h1>

  <!-- This heading is unaffected. The style attribute reaches -->
  <!-- exactly one element and cannot be shared. -->
  <h1 class="title">Corner Cafe</h1>
</body>`,
      },
    ],
    meta: {
      Reach: "One element",
      Reuse: "None at all",
      "Best for": "Almost nothing, by hand",
    },
    notes: [
      "This is the only one of the three with no selector, and that is the whole point: an attribute is already attached to its element, so there is nothing to select.",
      "It cannot be reused, it is awkward to override, and it mixes styling into markup that is supposed to describe structure. A page styled this way is very hard to restyle later.",
      "It is still the right tool in two places: HTML email, where external stylesheets are often stripped out, and styles that JavaScript sets while the page is running.",
    ],
  },
];

/* The cascade summary, shown after the three methods. */
const CASCADE_ORDER = [
  {
    rank: "1",
    title: "!important beats everything",
    body:
      "A declaration marked <code>!important</code> jumps ahead of every other one, inline included. It is almost always a sign something has gone wrong elsewhere, and using it starts a fight the next person has to win with another <code>!important</code>.",
    code: `.title { color: #0d9488 !important; }`,
  },
  {
    rank: "2",
    title: "Then inline",
    body:
      "A style attribute outranks any selector, however specific. There is no selector you can write that beats it, which is a large part of why inline CSS is awkward to work with.",
    code: `<h1 style="color: #7c3aed;">`,
  },
  {
    rank: "3",
    title: "Then the more specific selector",
    body:
      "An id beats a class, and a class beats a tag. So <code>#headline</code> beats <code>.title</code>, which beats <code>h1</code>. This is decided by the selector, not by which file it sits in.",
    code: `#headline  >  .title  >  h1`,
  },
  {
    rank: "4",
    title: "Then whichever comes last",
    body:
      "If specificity ties, the one written later wins. Since the <code>&lt;style&gt;</code> block usually sits after the <code>&lt;link&gt;</code> in the head, internal CSS tends to win a tie against external.",
    code: `<link rel="stylesheet" href="styles.css" />
<style> /* this one wins a tie */ </style>`,
  },
];

/* The one-line answer for each situation. */
const CHOOSING = [
  {
    id: "external",
    verdict: "Use external",
    when: "Anything with more than one page. This is the default answer, and the one you want almost every time.",
  },
  {
    id: "internal",
    verdict: "Use internal",
    when: "A single standalone page, or a quick test where a second file is more trouble than it is worth.",
  },
  {
    id: "inline",
    verdict: "Avoid inline",
    when: "Leave it to JavaScript and to HTML email. Writing it by hand is nearly always a mistake.",
  },
];

/* The live demo under each method. `disable` powers the toggle that shows what happens when that CSS does not reach the page. */
const METHOD_DEMOS = {
  external: {
    editorLabel: "styles.css",
    mode: "css",
    value: ".title {\n  color: #0d9488;\n}",
    note:
      "Edit the rule and both headings change together, because both are on pages linking this one file.",
    toggle: {
      label: "Pretend styles.css fails to load",
      on: "With the file missing, nothing is styled. Every rule lived in that one file, so the whole page falls back to browser defaults.",
    },
  },
  internal: {
    editorLabel: "the <style> block",
    mode: "css",
    value: ".title {\n  color: #b45309;\n}",
    note:
      "Same syntax as the file above. Edit it and this page changes, but no other page would.",
    toggle: {
      label: "Show a different page of the same site",
      on: "A second page gets none of it. The CSS was written into the first page, so this one would need its own copy.",
    },
  },
  inline: {
    editorLabel: 'style="..."',
    mode: "inline",
    value: "color: #7c3aed;",
    note:
      "Declarations only, no selector. Only the first heading responds, however you edit it, because the attribute is attached to that one element.",
    toggle: null,
  },
};

/* The two headings every demo renders. The id and class both exist so the playground's selectors have something to differ on. */
const DEMO_MARKUP =
  '<h1 class="title" id="headline">Sunrise Bakery</h1>\n<h1 class="title">Corner Cafe</h1>';

/* The cascade playground. Selector choices are ordered least to most specific. */
const PLAYGROUND = {
  target: ".title",
  prop: "color",
  selectors: ["h1", ".title", "#headline"],
  sources: [
    { id: "external", label: "External (styles.css)", selector: ".title", value: "#0d9488", on: true, important: false },
    { id: "internal", label: "Internal (<style>)", selector: ".title", value: "#b45309", on: true, important: false },
    { id: "inline", label: "Inline (style attribute)", value: "#7c3aed", on: true, important: false },
  ],
};
