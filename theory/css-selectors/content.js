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
    keyPoint:
      "A selector describes <strong>what an element is</strong>, never what it says. If a rule seems to do nothing, suspect the selector before the declarations.",
    meta: {
      "What it is": "A pattern that picks out elements",
      "Written as": "The part before the { brackets",
      "Why it matters": "It decides who a rule applies to",
    },
    notes: {
      "Checked against every element":
        "The browser checks every element against the pattern and collects the ones that match. The declarations are then applied to all of them, however many that turns out to be.",
      "Matching nothing is still valid":
        "A selector that matches nothing is perfectly valid CSS, so nothing warns you. If a rule seems to do nothing, the selector is usually wrong before the declarations are.",
      "Selectors describe elements, not words":
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
    keyPoint:
      "The <strong>first character tells you what is being matched</strong>: a full stop is a class, a hash is an id, square brackets are an attribute, and a bare word is a tag name.",
    meta: {
      "What it is": "A match on the element itself",
      "Written as": "li, .class, #id, [attr], *",
      "Why it matters": "It is the building block of every selector",
    },
    examples: [
      { syntax: "element", label: "Type", code: "p", meaning: "Every <code>&lt;p&gt;</code> on the page, wherever it sits." },
      { syntax: ".class", label: "Class", code: ".item", meaning: "Every element carrying that class, however many that is." },
      { syntax: "#id", label: "Id", code: "#first", meaning: "The one element carrying that id." },
      { syntax: "[attribute]", label: "Attribute", code: "[href]", meaning: "Any element that has the attribute at all, whatever its value." },
      { syntax: '[attribute="value"]', label: "Attribute is", code: '[type="text"]', meaning: "Any element whose attribute is exactly that value." },
      { syntax: '[attribute^="value"]', label: "Attribute starts with", code: '[href^="https"]', meaning: "Values beginning with it. Also <code>$=</code> ends with, <code>*=</code> contains." },
      { syntax: "*", label: "Universal", code: "*", meaning: "Every element, without exception. Adds <strong>no</strong> specificity at all." },
    ],
    notes: {
      "The marker character tells you the kind":
        "Each kind reads one thing about the element. The marker character tells you which: a full stop means a class, a hash means an id, square brackets mean an attribute, and a bare word means a tag name.",
      "A class does nothing on its own":
        "Classes and ids do nothing on their own. They exist purely so CSS has something to select by, which is why you add a class to an element you intend to style.",
      "Build with classes":
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
    keyPoint:
      "<strong>A space is a combinator, not formatting.</strong> <code>li.item</code> matches one element that is both; <code>li .item</code> matches an <code>.item</code> inside an <code>li</code>. Combinators change <em>what</em> is matched, but never how much a selector weighs.",
    meta: {
      "What it is": "Two or more selectors joined together",
      "Written as": "ab, a b, a, b, a > b, a + b",
      "Why it matters": "The join changes the meaning completely",
    },
    examples: [
      { syntax: "AB", label: "Compound", code: "li.item", meaning: "One element that is <strong>both</strong>. No space between them." },
      { syntax: "A, B", label: "Grouping", code: "li, .item", meaning: "<strong>Either</strong> one, matched separately. The comma splits the rule in two." },
      { syntax: "A B", label: "Descendant", code: "ul li", meaning: "A <code>B</code> anywhere inside an <code>A</code>, at any depth." },
      { syntax: "A > B", label: "Child", code: "ul > li", meaning: "A <code>B</code> that is a <strong>direct</strong> child of an <code>A</code>, one level down." },
      { syntax: "A:where(B)", label: "No weight", code: ":where(.item)", meaning: "Matches like <code>.item</code>, but counts as <strong>nothing</strong> for specificity." },
      { syntax: "A + B", label: "Adjacent sibling", code: "h1 + p", meaning: "The <code>B</code> immediately after an <code>A</code>, and only that one." },
      { syntax: "A ~ B", label: "General sibling", code: "h1 ~ p", meaning: "Every <code>B</code> after an <code>A</code> that shares its parent." },
    ],
    notes: {
      "With a separator, and without":
        "With no separator, all parts must be true of the same element. With a separator, the parts describe different elements and the separator says how they must be related.",
      "A space changes the meaning":
        "A space is the easiest character in CSS to add or lose by accident, and it changes the meaning without ever causing an error. <code>li.item</code> and <code>li .item</code> match completely different things.",
      "Combine only when you have to":
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
    id: "pseudo",
    number: "04",
    name: "Pseudo-classes and Pseudo-elements",
    tagline: "Matching a state, or a part of an element",
    accent: "#7c3aed",
    lead:
      "A <strong>pseudo-class</strong> matches an element in a particular <strong>state or position</strong>, and a <strong>pseudo-element</strong> matches a <strong>part of an element</strong> that has no tag of its own. Both describe something the HTML never says.",
    blocks: [
      {
        label: "styles.css",
        lang: "css",
        code: `/* One colon: a pseudo-CLASS. A state or a position. */
a:hover { }        /* while the pointer is over it */
li:first-child { } /* the first among its siblings */
li:nth-child(2) { }/* counting starts at 1, not 0  */
li:not(.done) { }  /* inverts whatever is inside   */

/* Two colons: a pseudo-ELEMENT. Part of an element. */
p::first-line { }  /* only the first line of text  */
p::before { }      /* content inserted at the start */`,
      },
    ],
    keyPoint:
      "<strong>One colon is a state or a position. Two colons is a part of an element.</strong> That is the only reliable way to tell a pseudo-class from a pseudo-element.",
    meta: {
      "What it is": "A match on state, position, or a part",
      "Written as": ":hover, :first-child, ::before",
      "Why it matters": "It reaches what the HTML cannot label",
    },
    examples: [
      { syntax: "A:state", label: "State", code: "a:hover", meaning: "Only while that state is true. Stops matching when it is not." },
      { syntax: "A:state", label: "State", code: "input:checked", meaning: "A checkbox or radio that is currently ticked." },
      { syntax: "A:position", label: "Position", code: "li:first-child", meaning: "An element that is the first child of its parent." },
      { syntax: "A:position", label: "Position", code: "li:last-child", meaning: "An element that is the last child of its parent." },
      { syntax: "A:nth-child(n)", label: "Counted", code: "li:nth-child(2)", meaning: "The nth child. Counting starts at <strong>1</strong>, not 0." },
      { syntax: "A:nth-child(n)", label: "Counted, pattern", code: "li:nth-child(odd)", meaning: "Also takes <code>even</code>, or a formula like <code>3n</code> for every third." },
      { syntax: "A:not(B)", label: "Negation", code: "li:not(.done)", meaning: "Every <code>A</code> that does <strong>not</strong> match <code>B</code>. Takes the weight of <code>B</code>." },
      { syntax: "A::part", label: "Pseudo-element", code: "p::first-line", meaning: "Only the first line, however wide the window happens to be." },
      { syntax: "A::part", label: "Pseudo-element", code: "p::before", meaning: "A slot inserted before the element's own content." },
    ],
    notes: {
      "One is tested, the other is a slice":
        "A pseudo-class is tested as the page runs, so <code>:hover</code> matches and stops matching as the pointer moves. A pseudo-element addresses a slice of an element that has no tag, such as its first line.",
      "Counting starts at 1, and counts everything":
        "<code>:nth-child</code> counts from 1 rather than 0, and it counts <em>all</em> siblings, not only the ones your selector matches. That is the usual reason a striped list stripes the wrong rows.",
      "One colon or two":
        "One colon is a class, two colons is an element. This is the only reliable way to tell which kind you are looking at, and it is why the doubled colon exists at all.",
    },
    demo: {
      editorLabel: "styles.css",
      value: ".item:first-child {\n  font-weight: bold;\n}\n\n.item:nth-child(even) {\n  background: #f1f5f9;\n}",
      result: "The condition is checked per element, so nothing in the HTML has to change.",
      panes: [{ label: "Rendered page", html: PANE, applies: true }],
    },
  },
  {
    id: "specificity",
    number: "05",
    name: "Specificity",
    tagline: "When two rules both match",
    accent: "#db2777",
    lead:
      "When two rules match the same element and set the same property, <strong>specificity</strong> decides which one applies. The browser gives each selector a score of three numbers, written <strong>ID - CLASS - TYPE</strong>, and compares them.",
    keyPoint:
      "Compare the three numbers <strong>left to right and stop at the first column that differs</strong>. One id beats four classes, because the ID column is read first and nothing further right can make up the gap.",
    blocks: [
      {
        label: "styles.css",
        lang: "css",
        code: `/* Score each selector as  ID - CLASS - TYPE  */

#myElement {
  color: green;   /* 1 - 0 - 0 */
}

.a .b .c [id="myElement"] {
  color: yellow;  /* 0 - 4 - 0 */
}

/* The green wins.                                   */
/* The ID column is compared first: 1 beats 0, so    */
/* it is settled there. The four in the CLASS column */
/* are never even looked at, however long that       */
/* second selector gets.                             */`,
      },
    ],
    exampleHeadings: ["Score", "Made of", "Example", "Notes"],
    examples: [
      { syntax: "1 - 0 - 0", label: "One id", code: "#first", meaning: "Beats any selector with no id, however long it is." },
      { syntax: "0 - 2 - 0", label: "Two classes", code: ".item.done", meaning: "Beats one class. Still loses to a single id." },
      { syntax: "0 - 1 - 2", label: "One class, two types", code: "ul li .item", meaning: "The class carries it. The two type selectors barely matter." },
      { syntax: "0 - 1 - 0", label: "One class", code: ".item", meaning: "Attribute selectors and pseudo-classes weigh the same as a class." },
      { syntax: "0 - 0 - 2", label: "Two types", code: "ul > li", meaning: "The <code>&gt;</code> adds nothing. Only <code>ul</code> and <code>li</code> are counted." },
      { syntax: "0 - 0 - 1", label: "One type", code: "li", meaning: "The weakest real selector there is." },
      { syntax: "0 - 0 - 0", label: "No weight", code: "*", meaning: "The universal selector and <code>:where()</code> match, but never add weight." },
      { syntax: "1 - 0 - 1", label: "Type, plus its argument", code: "p:not(#x)", meaning: "<code>:not()</code> adds nothing itself. Its argument does." },
    ],
    ladder: [
      {
        rank: "1",
        title: "Count the ids",
        body: "Every id selector adds one to the <strong>ID</strong> column, the leftmost.",
        code: "#first .item li    ->   1 - 1 - 1",
      },
      {
        rank: "2",
        title: "Count the classes, attributes and pseudo-classes",
        body: "All three weigh the same and fill the <strong>CLASS</strong> column, so <code>.item</code>, <code>[href]</code> and <code>:hover</code> are worth one each.",
        code: "li:hover[href]     ->   0 - 2 - 1",
      },
      {
        rank: "3",
        title: "Count the type selectors and pseudo-elements",
        body: "Tag names and double-colon selectors fill the <strong>TYPE</strong> column, the weakest of the three.",
        code: "ul li span         ->   0 - 0 - 3\np::before          ->   0 - 0 - 2",
      },
      {
        rank: "4",
        title: "Some things count for nothing",
        body: "Combinators, the universal selector and <code>:where()</code> add no weight at all. <code>:is()</code>, <code>:has()</code> and <code>:not()</code> add none themselves, but take the weight of their most specific argument.",
        code: "ul > li            ->   0 - 0 - 2\n:where(.a, #b)     ->   0 - 0 - 0\np:not(#b)          ->   1 - 0 - 1",
      },
      {
        rank: "5",
        title: "Compare left to right, and stop at the first difference",
        body: "Read the two scores column by column. The moment one is higher, that selector wins outright and the remaining columns are never consulted.",
        code: "0 - 1 - 0   beats   0 - 0 - 9\n1 - 0 - 0   beats   0 - 9 - 9",
      },
      {
        rank: "6",
        title: "Only an exact tie is settled by order",
        body: "If all three columns match, the rule declared last wins. This is the single point at which position in the stylesheet matters.",
        code: "input.myClass { }  /* 0 - 1 - 1 */\n:root input    { }  /* 0 - 1 - 1, so this one */",
      },
    ],
    meta: {
      "What it is": "A score that settles a conflict between rules",
      "Written as": "ID - CLASS - TYPE, counted not written",
      "Why it matters": "It explains why a rule you wrote is ignored",
    },
    notes: {
      "Counting the three columns":
        "Count the selector into three columns: ids on the left, then classes, attribute selectors and pseudo-classes, then type selectors and pseudo-elements. Compare the two scores left to right and stop at the first column that differs.",
      "Length is not weight":
        "Length is not weight. A long selector made only of tag names loses to a single class, and source order settles nothing unless all three columns are exactly equal.",
      "Inline styles are settled first":
        "Inline styles and <code>!important</code> are <strong>not</strong> specificity. The browser settles those first and only then compares specificity, which is why no selector you write can beat a <code>style</code> attribute. The full rules are in <a href=\"https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Specificity\" target=\"_blank\" rel=\"noopener\">MDN's specificity guide</a>.",
    },
    demo: {
      editorLabel: "styles.css",
      value: "li { color: #2563eb; }        /* 0-0-1 */\n.item { color: #16a34a; }     /* 0-1-0 */\n#first { color: #db2777; }    /* 1-0-0 */",
      result: "The first item obeys the id, the rest obey the class, and the tag selector never wins at all.",
      panes: [{ label: "Rendered page", html: PANE, applies: true }],
    },
  },
];

const METAKEYS = ["What it is", "Written as", "Why it matters"];

const LESSON = {
  id: "css-selectors",
  metaKeys: METAKEYS,
  exampleHeadings: ["Syntax", "Kind", "Example", "What it matches"],
  demoHint: "Edit the selector and watch which elements respond",
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
      { label: "Get it wrong and", values: [ "The rule matches nothing, silently", "You match far more or far less than you meant", "You match the wrong elements entirely", "You style the wrong row or nothing at all", "Your rule is overridden by an older one", ] },
    ]),
  },
};
