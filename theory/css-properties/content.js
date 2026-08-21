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
    meta: {
      "What it is": "The part of a declaration after the colon",
      "Written as": "A keyword, number, colour or list",
      "Why it matters": "It decides what the property actually does",
    },
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
    meta: {
      "What it is": "One property that sets several at once",
      "Written as": "border: 2px solid #94a3b8;",
      "Why it matters": "It is shorter, but it resets what you omit",
    },
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
    meta: {
      "What it is": "The value a property has when unset",
      "Written as": "inherit, initial, unset",
      "Why it matters": "It explains styling you never wrote",
    },
    notes: {
      "How it works":
        "Properties about text tend to inherit, so setting <code>color</code> on a container passes it down to everything inside. Properties about the box, such as <code>padding</code> and <code>border</code>, do not.",
      "What to watch for":
        "Before any of your CSS runs, the browser has already applied its own default stylesheet. Headings are large and bold, and lists have bullets, because of that, not because nothing is set.",
      "Worth remembering":
        "The keywords <code>inherit</code>, <code>initial</code> and <code>unset</code> work on any property, so you can always ask for the parent's value or reset back to the default explicitly.",
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
    meta: {
      "What it is": "A property you define yourself",
      "Written as": "--name: value;",
      "Why it matters": "One value, changed in one place",
    },
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
