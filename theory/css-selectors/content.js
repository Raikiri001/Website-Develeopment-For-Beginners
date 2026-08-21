/* CSS Selectors - lesson content. Explains what a selector is and how matching and specificity work in general, so it holds up whatever selectors an activity happens to drill. */

const PANE =
  '<ul class="list">\n  <li class="item" id="first">First item</li>\n  <li class="item">Second item</li>\n  <li class="item">Third item</li>\n</ul>\n<p class="note">A paragraph outside the list.</p>';

const PARTS = [
  {
    id: "what",
    number: "01",
    name: "What a Selector Is",
    tagline: "The pattern before the braces",
    accent: "#2563eb",
    lead:
      "A <strong>selector</strong> is the part of a rule before the curly brackets. It is a <strong>pattern</strong>, and the browser tests every element on the page against it, applying the declarations to each one that matches.",
    blocks: [
      {
        label: "styles.css",
        lang: "css",
        code: `/* selector { declarations }   That is the whole shape. */

.item {
  color: #0d9488;
}
/* ^^^^^                                          */
/* the pattern. Every element matching it is      */
/* styled. That may be none, one, or a hundred.   */

/* A rule that matches nothing is not an error. */
/* It simply does nothing at all.               */
.does-not-exist {
  color: red;
}`,
      },
    ],
    meta: {
      "What it is": "A pattern that picks out elements",
      "Written as": "The part before the { brackets",
      "Why it matters": "It decides who a rule applies to",
    },
    notes: {
      "How it works":
        "The browser checks every element against the pattern and collects the ones that match. The declarations are then applied to all of them, however many that turns out to be.",
      "What to watch for":
        "A selector that matches nothing is perfectly valid CSS, so nothing warns you. If a rule seems to do nothing, the selector is usually wrong before the declarations are.",
      "Worth remembering":
        "Selectors describe elements, not content. You cannot select an element because of the words inside it, only because of what it is, where it sits, or what it carries.",
    },
    demo: {
      editorLabel: "styles.css",
      value: ".item {\n  color: #0d9488;\n}",
      result: "Everything matching the pattern responds. Change the pattern and a different set responds.",
      panes: [{ label: "Rendered page", html: PANE, applies: true }],
    },
  },

  {
    id: "simple",
    number: "02",
    name: "Simple Selectors",
    tagline: "Matching one element on its own",
    accent: "#d97706",
    lead:
      "A <strong>simple selector</strong> matches an element by something about the element itself: its tag name, a class it carries, its id, an attribute, or nothing at all in the case of the universal selector.",
    blocks: [
      {
        label: "styles.css",
        lang: "css",
        code: `/* By tag name: every element of that type. */
li { }

/* By class, marked with a full stop. */
/* Any number of elements may share one class. */
.item { }

/* By id, marked with a hash. */
/* An id is meant to appear once on a page. */
#first { }

/* By attribute, in square brackets. */
[href] { }

/* Everything, marked with an asterisk. */
* { }`,
      },
    ],
    meta: {
      "What it is": "A match on the element itself",
      "Written as": "li, .class, #id, [attr], *",
      "Why it matters": "It is the building block of every selector",
    },
    notes: {
      "How it works":
        "Each kind reads one thing about the element. The marker character tells you which: a full stop means a class, a hash means an id, square brackets mean an attribute, and a bare word means a tag name.",
      "What to watch for":
        "Classes and ids do nothing on their own. They exist purely so CSS has something to select by, which is why you add a class to an element you intend to style.",
      "Worth remembering":
        "Classes are what real stylesheets are built from. Tag selectors are too broad to control, and ids are too specific to override comfortably.",
    },
    demo: {
      editorLabel: "styles.css",
      value: "#first {\n  font-weight: bold;\n  color: #b45309;\n}",
      result: "Swap the marker character and you are matching on something completely different.",
      panes: [{ label: "Rendered page", html: PANE, applies: true }],
    },
  },

  {
    id: "combining",
    number: "03",
    name: "Combining Selectors",
    tagline: "Matching on more than one thing",
    accent: "#0d9488",
    lead:
      "Simple selectors can be joined together, and <strong>what sits between them changes the meaning entirely</strong>. Nothing means both at once, a comma means either, and a space or symbol means a relationship between two elements.",
    blocks: [
      {
        label: "styles.css",
        lang: "css",
        code: `/* Joined with NOTHING: one element that is both. */
li.item { }

/* Joined with a COMMA: either one, matched separately. */
li, .item { }

/* Joined with a SPACE: an .item somewhere inside a ul. */
ul .item { }

/* Joined with > : a DIRECT child, one level down only. */
ul > .item { }

/* Joined with + : the very next sibling. */
/* Joined with ~ : any later sibling.     */
h1 + p { }`,
      },
    ],
    meta: {
      "What it is": "Two or more selectors joined together",
      "Written as": "ab, a b, a, b, a > b, a + b",
      "Why it matters": "The join changes the meaning completely",
    },
    notes: {
      "How it works":
        "With no separator, all parts must be true of the same element. With a separator, the parts describe different elements and the separator says how they must be related.",
      "What to watch for":
        "A space is the easiest character in CSS to add or lose by accident, and it changes the meaning without ever causing an error. <code>li.item</code> and <code>li .item</code> match completely different things.",
      "Worth remembering":
        "Combining is how you reach an element that has nothing useful of its own to select by. If it has a class, use the class; combine only when it does not.",
    },
    demo: {
      editorLabel: "styles.css",
      value: "ul > .item {\n  border-left: 3px solid #0d9488;\n  padding-left: 8px;\n}",
      result: "Remove the space, or change the symbol, and the set of matched elements changes.",
      panes: [{ label: "Rendered page", html: PANE, applies: true }],
    },
  },

  {
    id: "specificity",
    number: "04",
    name: "Specificity",
    tagline: "When two rules both match",
    accent: "#db2777",
    lead:
      "Two rules can match the same element and set the same property. <strong>Specificity</strong> is how the browser decides between them, by counting what the selectors are made of rather than which one looks more important.",
    blocks: [
      {
        label: "styles.css",
        lang: "css",
        code: `/* All three match the same element. Only one wins. */

li { color: blue; }
/* One tag name. The weakest of the three. */

.item { color: green; }
/* One class. Beats any number of tag names. */

#first { color: red; }
/* One id. Beats any number of classes. */

/* A tie is settled by order: the later one wins. */
.item { color: teal; }   /* this beats the green above */`,
      },
    ],
    meta: {
      "What it is": "How a conflict between rules is settled",
      "Written as": "Not written; it is counted",
      "Why it matters": "It explains why a rule you wrote is ignored",
    },
    notes: {
      "How it works":
        "The browser counts ids, then classes and attributes and pseudo-classes, then tag names. A higher count in an earlier group wins outright, so one id beats any number of classes.",
      "What to watch for":
        "Position in the file only breaks a tie. A rule further down does not win if the rule above it is more specific, which is why moving a rule often fails to fix anything.",
      "Worth remembering":
        "The way out of a specificity fight is a simpler selector, not a stronger one. Escalating with ids or <code>!important</code> only makes the next override harder.",
    },
    demo: {
      editorLabel: "styles.css",
      value: "li { color: #2563eb; }\n.item { color: #16a34a; }\n#first { color: #db2777; }",
      result: "The first item obeys the id, the rest obey the class. The tag selector never wins.",
      panes: [{ label: "Rendered page", html: PANE, applies: true }],
    },
  },
];

const LESSON = {
  id: "css-selectors",
  metaKeys: ["What it is", "Written as", "Why it matters"],
  noteLabels: ["How it works", "What to watch for", "Worth remembering"],
  demoHint: "Edit the selector and watch which elements respond",
  sections: PARTS,
  comparison: {
    columns: ["what", "simple", "combining", "specificity"],
    rows: [
      {
        label: "What it is",
        values: [
          "A pattern that picks out elements",
          "A match on the element itself",
          "Two or more selectors joined together",
          "How a conflict between rules is settled",
        ],
      },
      {
        label: "Written as",
        values: [
          "The part before the { brackets",
          "li, .class, #id, [attr], *",
          "ab, a b, a, b, a > b, a + b",
          "Not written; it is counted",
        ],
      },
      {
        label: "Why it matters",
        values: [
          "It decides who a rule applies to",
          "It is the building block of every selector",
          "The join changes the meaning completely",
          "It explains why a rule you wrote is ignored",
        ],
      },
      {
        label: "Get it wrong and",
        values: [
          "The rule matches nothing, silently",
          "You match far more or far less than you meant",
          "You match the wrong elements entirely",
          "Your rule is overridden by an older one",
        ],
      },
    ],
  },
  ladder: [
    {
      rank: "1",
      title: "Count the ids",
      body: "Every id in the selector counts once. More ids wins, whatever else either selector contains.",
      code: "#first        beats  .item.item.item",
    },
    {
      rank: "2",
      title: "Then classes, attributes and pseudo-classes",
      body: "All three count the same amount. If the id counts tie, whichever selector has more of these wins.",
      code: ".list .item   beats  .item",
    },
    {
      rank: "3",
      title: "Then tag names",
      body: "The weakest group. Any single class beats any number of tag names, however long the selector looks.",
      code: ".item         beats  ul li span",
    },
    {
      rank: "4",
      title: "Only then, position in the file",
      body: "If every count ties, the rule written later wins. This is the only point at which order matters at all.",
      code: ".item { color: blue; }\n.item { color: red; }   /* this one */",
    },
  ],
};
