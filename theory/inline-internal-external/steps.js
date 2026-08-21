/* Inline, Internal, External - lesson data: the demo page, and one entry per guided step. */

/* The page every step styles. The h1 is the element the cascade panel tracks. */
const DEMO_HTML = `<h1 class="title">Sunrise Bakery</h1>
<p class="tagline">Baked fresh every morning.</p>
<button class="cta">Order now</button>`;

/* The element the cascade panel resolves declarations for. */
const CASCADE_TARGET = ".title";
const CASCADE_PROP = "color";

const LESSON_STEPS = [
  {
    id: "s1",
    name: "Starting point",
    title: "A page with no CSS at all",
    teach: `
      <p>This is the page you will style, and right now it has no CSS
      anywhere. Everything you can see is the browser's own default: the
      heading is big and bold, the button has a grey box around it, and the
      text is black. No stylesheet said so.</p>
      <p>CSS can be attached to a page in exactly three places, and the
      next three steps add one each:</p>
      <ul>
        <li><strong>External</strong>: a separate <code>.css</code> file,
        joined to the page with a <code>&lt;link&gt;</code>.</li>
        <li><strong>Internal</strong>: a <code>&lt;style&gt;</code> block
        written in the page's own <code>&lt;head&gt;</code>.</li>
        <li><strong>Inline</strong>: a <code>style</code> attribute written
        directly on one element.</li>
      </ul>
      <p>All three produce real CSS. What differs is how far it reaches and
      which one wins when they disagree, which is the last two steps.</p>
    `,
    enabled: [],
    start: { external: "", internal: "", inline: "" },
    task: null,
    check: null,
  },

  {
    id: "s2",
    name: "External",
    title: "External CSS: a file of its own",
    teach: `
      <p>External CSS lives in its own file, and the page pulls it in from
      the <code>&lt;head&gt;</code>:</p>
      <pre class="teach-code">&lt;link rel="stylesheet" href="styles.css" /&gt;</pre>
      <p>This is how nearly every real website is built, for one reason:
      <strong>one file can style every page</strong>. Change the heading
      colour in <code>styles.css</code> and all forty pages of the site
      change together. The browser also downloads it once and reuses it,
      so the other pages load faster.</p>
      <p>The trade-off is that it is a second file and a second request. If
      it fails to load, the page appears completely unstyled.</p>
    `,
    enabled: ["external"],
    start: { external: "", internal: "", inline: "" },
    task:
      "In <strong>styles.css</strong>, write a rule that makes the heading teal. Use the selector <code>.title</code> and the colour <code>#0d9488</code>.",
    check: { type: "winner", prop: "color", origin: "external", value: "#0d9488" },
  },

  {
    id: "s3",
    name: "Internal",
    title: "Internal CSS: a style block in the page",
    teach: `
      <p>Internal CSS is written straight into the page's
      <code>&lt;head&gt;</code>, inside a <code>&lt;style&gt;</code>
      element:</p>
      <pre class="teach-code">&lt;style&gt;
  .tagline { color: #b45309; }
&lt;/style&gt;</pre>
      <p>It uses exactly the same selectors and properties as an external
      file. The only difference is reach: it styles
      <strong>this page and no other</strong>. Copy the page and you copy
      the CSS with it, and now there are two copies to keep in step.</p>
      <p>It earns its place for a one-off page, or for a small critical
      rule you want applied before an external file has finished
      downloading.</p>
    `,
    enabled: ["external", "internal"],
    start: { external: ".title {\n  color: #0d9488;\n}", internal: "", inline: "" },
    task:
      "In the <strong>&lt;style&gt;</strong> block, set a <code>color</code> on <code>.tagline</code>. Any colour will do.",
    check: { type: "declared", origin: "internal", prop: "color", target: ".tagline" },
  },

  {
    id: "s4",
    name: "Inline",
    title: "Inline CSS: an attribute on one element",
    teach: `
      <p>Inline CSS is written as a <code>style</code> attribute on a single
      element:</p>
      <pre class="teach-code">&lt;h1 class="title" style="color: #7c3aed;"&gt;Sunrise Bakery&lt;/h1&gt;</pre>
      <p>Notice there is <strong>no selector and no curly brackets</strong>,
      just the declarations. It does not need a selector, because it can
      only ever affect the one element it is written on.</p>
      <p>That is also its problem. It cannot be reused, it cannot be
      overridden easily, and it mixes styling into markup that is supposed
      to describe structure. It is genuinely useful in a few places:
      HTML email, and styles that JavaScript sets while the page runs.</p>
    `,
    enabled: ["external", "internal", "inline"],
    start: {
      external: ".title {\n  color: #0d9488;\n}",
      internal: ".tagline {\n  color: #b45309;\n}",
      inline: "",
    },
    task:
      "Give the heading an inline <code>color</code>. Write just the declaration, for example <code>color: #7c3aed;</code>.",
    check: { type: "declared", origin: "inline", prop: "color", target: ".title" },
  },

  {
    id: "s5",
    name: "Which wins",
    title: "When all three disagree",
    teach: `
      <p>All three places now set a <code>color</code> on the heading, and
      only one of them can win. The browser settles it in this order:</p>
      <ul>
        <li><strong>Inline beats everything.</strong> A
        <code>style</code> attribute outranks any selector, however
        specific.</li>
        <li>Otherwise the <strong>more specific selector</strong> wins:
        <code>h1.title</code> beats <code>.title</code>, which beats
        <code>h1</code>.</li>
        <li>If specificity ties, <strong>whichever comes last</strong>
        wins. The <code>&lt;style&gt;</code> block sits after the
        <code>&lt;link&gt;</code> in the head, so internal usually wins a
        tie against external.</li>
      </ul>
      <p>Watch the panel below the preview: it lists every declaration for
      this property and marks the one that actually took effect.</p>
    `,
    enabled: ["external", "internal", "inline"],
    start: {
      external: ".title {\n  color: #0d9488;\n}",
      internal: ".title {\n  color: #b45309;\n}",
      inline: "color: #7c3aed;",
    },
    task:
      "Make the heading come out <strong>teal</strong> (<code>#0d9488</code>), the colour in styles.css, by changing only the inline attribute and the &lt;style&gt; block. Leave styles.css exactly as it is.",
    check: { type: "winner", prop: "color", origin: "external", value: "#0d9488" },
  },

  {
    id: "s6",
    name: "Choosing",
    title: "Which one should you actually use?",
    teach: `
      <p>There is one more override worth knowing about, because you will
      meet it in other people's code:</p>
      <pre class="teach-code">.title { color: #0d9488 !important; }</pre>
      <p><code>!important</code> jumps ahead of everything, inline
      included. It is almost always a sign that something has gone wrong
      elsewhere, and using it starts a fight that the next person has to
      win with another <code>!important</code>. Try it in the editors above
      and watch the cascade panel change.</p>
      <p>In practice:</p>
      <ul>
        <li><strong>External</strong> for anything with more than one page.
        This is the default answer.</li>
        <li><strong>Internal</strong> for a single standalone page, or a
        quick experiment.</li>
        <li><strong>Inline</strong> almost never by hand. Leave it to
        JavaScript and to HTML email.</li>
      </ul>
    `,
    enabled: ["external", "internal", "inline"],
    start: {
      external: ".title {\n  color: #0d9488;\n}",
      internal: "",
      inline: "",
    },
    task:
      "Last one, and it is a question rather than an edit. You are building a five page site and want the same colours on every page, editable in one go later. Where should that CSS live?",
    check: {
      type: "choice",
      correct: "external",
      options: [
        { id: "inline", label: "Inline, on each element" },
        { id: "internal", label: "Internal, in each page's &lt;head&gt;" },
        { id: "external", label: "External, in one styles.css" },
      ],
      wrong: {
        inline: "That would mean editing every element on all five pages to change one colour, and the styling could not be shared at all.",
        internal: "That works, but you would have five copies of the same CSS to keep in step. Change one and you have to remember the other four.",
      },
    },
  },
];
