/* CSS Properties - lesson content. Explains what a property is and how properties behave in general, so it holds up whatever properties an activity happens to drill. */

const PANE =
  '<div class="box">\n  <h1 class="heading">A heading</h1>\n  <p class="text">Some text inside a box.</p>\n</div>';

const PARTS = [
  {
    id: "declaration",
    number: "01",
    name: "The Declaration",
    tagline: "One setting and its value",
    accent: "#2563eb",
    lead:
      "A <strong>property</strong> is a single named setting on an element, and a <strong>declaration</strong> is that property paired with a value. Every CSS rule is a list of declarations, and each one changes exactly one thing.",
    blocks: [
      {
        label: "styles.css",
        lang: "css",
        code: `.box {
  /* property : value ;   That is the whole shape. */
  color: #0d9488;
/*  ^^^^^   ^^^^^^^                                */
/*  what     how it       */
/*  to set   should be    */

  /* One declaration per setting. They do not combine. */
  font-size: 18px;
  padding: 12px;
}`,
      },
    ],
    keyPoint:
      "If the browser does not understand a property name or a value, it <strong>throws away that one declaration and carries on</strong>. There is no error message, so a typo simply does nothing.",
    meta: {
      "What it is": "One named setting on an element",
      "Written as": "property: value;",
      "Why it matters": "It is the unit every rule is built from",
    },
    notes: {
      "How it works":
        "The property name says what to change, the value says what to change it to, and the semicolon ends the declaration. The browser reads each one on its own and applies what it understands.",
      "What to watch for":
        "If the browser does not understand a property name or a value, it silently throws that one declaration away and carries on. There is no error message, so a typo simply does nothing.",
      "Worth remembering":
        "Property names are a fixed vocabulary defined by the CSS specification, so a made-up name is exactly as invisible as a misspelled one. There is one deliberate exception, custom properties, which is the last part of this lesson.",
    },
    demo: {
      editorLabel: "styles.css",
      value: ".heading {\n  color: #0d9488;\n  font-size: 26px;\n}",
      result: "Each declaration changes one thing. Misspell a property name and that line quietly does nothing.",
      panes: [{ label: "Rendered page", html: PANE, applies: true }],
    },
  },

  {
    id: "values",
    number: "02",
    name: "Values and Units",
    tagline: "What you are allowed to write",
    accent: "#d97706",
    lead:
      "The <strong>value</strong> is the part after the colon, and each property only accepts certain kinds. A value is usually a keyword, a number with a unit, a colour, or a list of several values in a set order.",
    blocks: [
      {
        label: "styles.css",
        lang: "css",
        code: `.box {
  /* A keyword: one of a fixed list this property allows. */
  display: block;

  /* A number and a unit, joined with no space between. */
  width: 300px;

  /* A relative unit, measured against something else. */
  font-size: 1.5em;   /* 1.5 times the parent's size */

  /* A colour, as a hex code, a name, or rgb(). */
  color: #334155;

  /* A list, where the order is part of the meaning. */
  margin: 10px 20px;  /* top and bottom, then sides */
}`,
      },
    ],
    keyPoint:
      "A number that is not zero almost always needs a unit, <strong>joined on with no space</strong>. <code>16px</code> works; <code>16 px</code> is thrown away.",
    meta: {
      "What it is": "The part of a declaration after the colon",
      "Written as": "A keyword, number, colour or list",
      "Why it matters": "It decides what the property actually does",
    },
    examples: [
      { syntax: "<number>px", label: "Absolute length", code: "16px", meaning: "A fixed size. Nothing around it changes what it measures." },
      { syntax: "<number>em", label: "Relative to parent", code: "1.5em", meaning: "1.5 times the <strong>parent's</strong> font size, so it compounds when nested." },
      { syntax: "<number>rem", label: "Relative to root", code: "1.5rem", meaning: "1.5 times the <strong>root</strong> font size. Does not compound." },
      { syntax: "<number>%", label: "Percentage", code: "50%", meaning: "Measured against the parent. What exactly depends on the property." },
      { syntax: "<number>", label: "Unitless", code: "1.5", meaning: "Only where the property allows it, such as <code>line-height</code>." },
      { syntax: "keyword", label: "Keyword", code: "block", meaning: "One of a fixed list that property accepts. Anything else is ignored." },
      { syntax: "#rrggbb", label: "Colour", code: "#0d9488", meaning: "Red, green and blue as hex. Also <code>rgb()</code> and named colours." },
      { syntax: "a, b, c", label: "List", code: "Arial, sans-serif", meaning: "Tried in order. The first one available is used." },
    ],
    notes: {
      "How it works":
        "Every property defines which values it accepts. <code>display</code> takes a keyword from a fixed list, <code>width</code> takes a length, and giving one the other kind is simply ignored.",
      "What to watch for":
        "A number that is not zero almost always needs a unit, and the unit is joined on with no space: <code>16px</code>, never <code>16 px</code>. A few properties take a bare number on purpose, such as <code>line-height</code> and <code>font-weight</code>.",
      "Worth remembering":
        "Absolute units like <code>px</code> stay the same size whatever happens around them. Relative units like <code>em</code>, <code>rem</code> and <code>%</code> are measured against something else, so they change when that thing does.",
    },
    demo: {
      editorLabel: "styles.css",
      value: ".box {\n  width: 60%;\n  padding: 10px 20px;\n  background-color: #f1f5f9;\n}",
      result: "Change the unit and the same number behaves completely differently.",
      panes: [{ label: "Rendered page", html: PANE, applies: true }],
    },
  },

  {
    id: "shorthand",
    number: "03",
    name: "Shorthand Properties",
    tagline: "Several settings in one",
    accent: "#0d9488",
    lead:
      "A <strong>shorthand</strong> is one property that sets several related properties at once. It saves typing, but it also quietly resets every part you leave out, which is the trap most beginners meet.",
    blocks: [
      {
        label: "styles.css",
        lang: "css",
        code: `.box {
  /* The long way: four separate properties. */
  border-width: 2px;
  border-style: solid;
  border-color: #94a3b8;

  /* The shorthand: the same three, in one declaration. */
  border: 2px solid #94a3b8;

  /* Values are separated by SPACES, not commas. */
  /* Anything you leave out is reset to its default. */
  margin: 0 auto;   /* also sets top and bottom to 0 */
}`,
      },
    ],
    keyPoint:
      "A shorthand sets <strong>every</strong> property it covers, including the ones you did not mention. Those are quietly reset to their defaults.",
    meta: {
      "What it is": "One property that sets several at once",
      "Written as": "border: 2px solid #94a3b8;",
      "Why it matters": "It is shorter, but it resets what you omit",
    },
    exampleHeadings: ["Written", "Expands to", "Example", "What it sets"],
    examples: [
      { syntax: "margin: A", label: "One value", code: "margin: 10px", meaning: "All four sides at once." },
      { syntax: "margin: A B", label: "Two values", code: "margin: 10px 20px", meaning: "Top and bottom, then left and right." },
      { syntax: "margin: A B C D", label: "Four values", code: "margin: 1px 2px 3px 4px", meaning: "Clockwise from the top: top, right, bottom, left." },
      { syntax: "border: W S C", label: "Width, style, colour", code: "border: 2px solid #000", meaning: "All three. Leave the style out and nothing is drawn." },
      { syntax: "background: ...", label: "Several at once", code: "background: red", meaning: "Also clears any background image already set." },
      { syntax: "font: ...", label: "Several at once", code: "font: 16px Arial", meaning: "Resets line-height, weight and style back to their defaults too." },
    ],
    notes: {
      "How it works":
        "A shorthand expands into the individual properties behind it. Some read positionally, so <code>margin: 10px 20px</code> means top and bottom, then left and right; others read by kind, so <code>border</code> works out which part is the width and which is the colour.",
      "What to watch for":
        "A shorthand sets <em>every</em> property it covers, including the ones you did not mention, which get their default back. Writing <code>background: red</code> after setting a background image throws the image away.",
      "Worth remembering":
        "Values inside a shorthand are separated by spaces. Commas mean something different in CSS, and using them here makes the whole declaration invalid.",
    },
    demo: {
      editorLabel: "styles.css",
      value: ".box {\n  border: 2px solid #94a3b8;\n  padding: 12px;\n}",
      result: "One declaration doing the work of several. Remove a part and its default comes back.",
      panes: [{ label: "Rendered page", html: PANE, applies: true }],
    },
  },

  {
    id: "inheritance",
    number: "04",
    name: "Inheritance and Defaults",
    tagline: "What happens when you say nothing",
    accent: "#db2777",
    lead:
      "Every property has a value even when you never set one. Some properties <strong>inherit</strong> theirs from the parent element, and the rest fall back to a <strong>default</strong> defined by CSS itself.",
    blocks: [
      {
        label: "styles.css",
        lang: "css",
        code: `.box {
  /* Text properties inherit: children get this too. */
  color: #334155;
  font-family: sans-serif;
}

.heading {
  /* Box properties do NOT inherit. This affects */
  /* only .heading, never anything inside it.    */
  padding: 8px;
}

.text {
  /* Ask for the parent's value explicitly. */
  color: inherit;

  /* Or throw everything away and start from the default. */
  all: initial;
}`,
      },
    ],
    keyPoint:
      "<strong>Text properties inherit, box properties do not.</strong> That one split explains most styling that seems to appear from nowhere.",
    meta: {
      "What it is": "The value a property has when unset",
      "Written as": "inherit, initial, unset",
      "Why it matters": "It explains styling you never wrote",
    },
    exampleHeadings: ["Written", "Kind", "Example", "What it does"],
    examples: [
      { syntax: "inherit", label: "CSS-wide keyword", code: "color: inherit", meaning: "Takes the parent's computed value, even for a property that never inherits." },
      { syntax: "initial", label: "CSS-wide keyword", code: "color: initial", meaning: "The value in the CSS specification, which is <strong>not</strong> the browser's default." },
      { syntax: "unset", label: "CSS-wide keyword", code: "color: unset", meaning: "<code>inherit</code> if the property inherits, <code>initial</code> if it does not." },
      { syntax: "revert", label: "CSS-wide keyword", code: "all: revert", meaning: "Back to the browser's own stylesheet, undoing your CSS rather than the spec's." },
      { syntax: "color", label: "Inherits", code: ".box { color: red }", meaning: "Children get it without being told. Most text properties behave this way." },
      { syntax: "padding", label: "Does not inherit", code: ".box { padding: 8px }", meaning: "Children get the initial value instead, which for padding is zero." },
    ],
    notes: {
      "How it works":
        "Properties about text tend to inherit, so setting <code>color</code> on a container passes it down to everything inside. Properties about the box, such as <code>padding</code> and <code>border</code>, do not.",
      "What to watch for":
        "Before any of your CSS runs, the browser has already applied its own default stylesheet. Headings are large and bold, and lists have bullets, because of that, not because nothing is set.",
      "Worth remembering":
        "The keywords <code>inherit</code>, <code>initial</code>, <code>unset</code> and <code>revert</code> work on any property, so you can always ask for the parent's value or reset explicitly. Note <code>initial</code> is the CSS specification's value, not the browser's, which is what <code>revert</code> gets you. The full rules are in <a href=\"https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Inheritance\" target=\"_blank\" rel=\"noopener\">MDN's inheritance guide</a>.",
    },
    demo: {
      editorLabel: "styles.css",
      value: ".box {\n  color: #7c3aed;\n  padding: 10px;\n}",
      result: "Colour reaches the text inside. Padding does not, because it never inherits.",
      panes: [{ label: "Rendered page", html: PANE, applies: true }],
    },
  },
  {
    id: "custom",
    number: "05",
    name: "Custom Properties",
    tagline: "Values you name yourself",
    accent: "#7c3aed",
    lead:
      "A <strong>custom property</strong> is a property you invent, whose name starts with two dashes. It is the one exception to the fixed vocabulary, and it exists so a value can be <strong>written once and reused everywhere</strong>.",
    blocks: [
      {
        label: "styles.css",
        lang: "css",
        code: `/* Declared like any other property, but the name */
/* starts with two dashes and is yours to choose.  */
:root {
  --brand: #0d9488;
  --gap: 12px;
}

.box {
  /* Read the value back with var(). */
  color: var(--brand);
  padding: var(--gap);

  /* A second argument is used if it is not defined. */
  border-color: var(--line, #cbd5e1);
}`,
      },
    ],
    keyPoint:
      "Two dashes make the name yours. This is the <strong>one place CSS lets you invent a property name</strong>, and the value is read back with <code>var()</code>.",
    meta: {
      "What it is": "A property you define yourself",
      "Written as": "--name: value;",
      "Why it matters": "One value, changed in one place",
    },
    exampleHeadings: ["Written", "Kind", "Example", "What it does"],
    examples: [
      { syntax: "--name: value;", label: "Declare it", code: "--brand: #0d9488;", meaning: "Defines the value. The name is yours, and it is case sensitive." },
      { syntax: "var(--name)", label: "Read it back", code: "color: var(--brand)", meaning: "Uses whatever that property holds now, not a copy taken earlier." },
      { syntax: "var(--name, fallback)", label: "With a fallback", code: "var(--line, #ccc)", meaning: "The fallback is used when the custom property is not defined." },
      { syntax: ":root { --name: v }", label: "Make it global", code: ":root { --brand: teal }", meaning: "Custom properties inherit, so the whole page can read it." },
    ],
    notes: {
      "How it works":
        "A custom property is declared on a selector like any other, and read back with <code>var()</code>. Change the declaration and every <code>var()</code> reading it updates, because it is genuinely the same value rather than a copy.",
      "What to watch for":
        "The name needs both dashes and is case sensitive, so <code>--Brand</code> and <code>--brand</code> are different properties. A <code>var()</code> pointing at something undefined falls back to the second argument, or makes the declaration invalid if there is none.",
      "Worth remembering":
        "Custom properties inherit, so declaring them on <code>:root</code> makes them available to the whole page. That is exactly how this site's colours and spacing are defined.",
    },
    demo: {
      editorLabel: "styles.css",
      value: ":root {\n  --brand: #0d9488;\n}\n\n.heading {\n  color: var(--brand);\n}\n\n.text {\n  color: var(--brand);\n}",
      result: "Change the one declaration at the top and everything reading it follows.",
      panes: [{ label: "Rendered page", html: PANE, applies: true }],
    },
  },
];

const METAKEYS = ["What it is", "Written as", "Why it matters"];

const LESSON = {
  id: "css-properties",
  metaKeys: METAKEYS,
  noteLabels: ["How it works", "What to watch for", "Worth remembering"],
  exampleHeadings: ["Syntax", "Kind", "Example", "What it means"],
  demoHint: "Edit the CSS and watch what each declaration does",
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
      { label: "Where you see it", values: [ "Inside every rule", "After every colon", "In place of several declarations", "Nowhere, until something surprises you", "Anywhere you would repeat a value", ] },
      { label: "Get it wrong and", values: [ "That one line is silently ignored", "The property does nothing", "Something you set earlier is reset", "Styling appears from nowhere", "The value falls back, or the line dies", ] },
    ]),
  },
};
