/* The Box Model - lesson content. Explains the four areas every element is drawn from and what width actually measures, so it holds up whatever sizes an activity happens to use. */

/* The one page every demo in this lesson edits, so the CSS is the only thing that differs. */
const PANE =
  '<div class="box">\n  <p>The content box.</p>\n</div>\n<p>The next element on the page.</p>';

const PARTS = [
  {
    id: "areas",
    number: "01",
    name: "Every Element Is a Box",
    tagline: "Four areas, one element",
    accent: "#2563eb",
    lead:
      "Every element a browser draws is a <strong>rectangle</strong>, however little it looks like one. That rectangle is built from four areas nested inside each other: the <strong>content</strong> in the middle, the <strong>padding</strong> around it, the <strong>border</strong> around that, and the <strong>margin</strong> outside the whole thing.",
    anatomy: {
      label: "One box, with all four areas declared",
      parts: [
        { text: ".box", tone: "keyword" },
        { text: " {\n  " },
        {
          ref: "content",
          parts: [
            { text: "width", tone: "attr" },
            { text: ": " },
            { text: "200px", tone: "string" },
            { text: ";" },
          ],
        },
        { text: "\n  " },
        {
          ref: "content",
          parts: [
            { text: "height", tone: "attr" },
            { text: ": " },
            { text: "80px", tone: "string" },
            { text: ";" },
          ],
        },
        { text: "\n  " },
        {
          ref: "padding",
          parts: [
            { text: "padding", tone: "attr" },
            { text: ": " },
            { text: "16px", tone: "string" },
            { text: ";" },
          ],
        },
        { text: "\n  " },
        {
          ref: "border",
          parts: [
            { text: "border", tone: "attr" },
            { text: ": " },
            { text: "4px solid #0d9488", tone: "string" },
            { text: ";" },
          ],
        },
        { text: "\n  " },
        {
          ref: "margin",
          parts: [
            { text: "margin", tone: "attr" },
            { text: ": " },
            { text: "20px", tone: "string" },
            { text: ";" },
          ],
        },
        { text: "\n}" },
      ],
    },
    keyPoint:
      "All four areas are always there. An element with no padding, border or margin declared still has every one of them; three of them are simply <strong>zero pixels wide</strong>.",
    meta: {
      "What it is": "The four areas every element is drawn from",
      "Written as": "width, padding, border and margin",
      "Why it matters": "It explains how much room an element takes",
    },
    exampleHeadings: ["Written as", "Area", "Example", "Where it sits"],
    examples: [
      {
        ref: "content",
        syntax: "width / height",
        label: "Content box",
        code: "width: 200px;",
        meaning:
          "The innermost area, where the text, the image or the child elements go. Its size is what <code>width</code> and <code>height</code> set.",
      },
      {
        ref: "padding",
        syntax: "padding",
        label: "Padding",
        code: "padding: 16px;",
        meaning:
          "A band of empty space between the content and the border, held inside the element.",
      },
      {
        ref: "border",
        syntax: "border",
        label: "Border",
        code: "border: 4px solid #0d9488;",
        meaning:
          "A line drawn around the padding. The only one of the four you can see on its own.",
      },
      {
        ref: "margin",
        syntax: "margin",
        label: "Margin",
        code: "margin: 20px;",
        meaning:
          "A band of empty space outside the border, holding other elements away from this one.",
      },
    ],
    notes: [
      {
        after: "anatomy",
        title: "Inside out",
        body:
          "The order never changes: content, then padding, then border, then margin, working outwards. Every browser's developer tools draw the same four areas as nested rectangles, which is the quickest way to see which one is making an element the size it is.",
      },
      {
        after: "examples",
        title: "What you can see",
        body:
          "Only the border draws anything by itself. Padding and margin are both empty space, and the way to tell them apart on screen is the element's background: it fills the content and the padding, and stops at the border. Space you can see the background through is padding, space you cannot is margin.",
      },
      {
        after: "end",
        title: "Inline elements",
        body:
          "A box is not always free to be any size. An inline element, such as an <code>a</code> inside a sentence, ignores <code>width</code> and <code>height</code> altogether and takes vertical padding without pushing the lines above and below it apart. Everything in this lesson assumes a block element, which is what a <code>div</code> or a <code>p</code> already is.",
      },
    ],
    demo: {
      editorLabel: "styles.css",
      value:
        ".box {\n  width: 200px;\n  padding: 16px;\n  border: 4px solid #0d9488;\n  margin: 20px;\n  background: #ccfbf1;\n}",
      result:
        "All four areas at once. Set any one of them to 0 and watch which part of the box disappears.",
      panes: [{ label: "Rendered page", html: PANE, applies: true }],
    },
  },

  {
    id: "padding",
    number: "02",
    name: "Padding",
    tagline: "Space inside the box",
    accent: "#d97706",
    lead:
      "Padding is the space between the content and the border, held <strong>inside</strong> the element. It is what stops text sitting hard against the edge of the thing it is written in.",
    keyPoint:
      "Padding belongs to the element, so the element's <strong>background paints across it</strong> and a click landing on it still counts as a click on the element.",
    meta: {
      "What it is": "The space between the content and the border",
      "Written as": "padding, or padding-top and friends",
      "Why it matters": "Content needs room inside its own box",
    },
    exampleHeadings: ["Written as", "Kind", "Example", "What it sets"],
    examples: [
      {
        syntax: "padding: A",
        label: "One value",
        code: "padding: 16px;",
        meaning: "The same padding on all four sides.",
      },
      {
        syntax: "padding: A B",
        label: "Two values",
        code: "padding: 10px 24px;",
        meaning: "Top and bottom first, then left and right.",
      },
      {
        syntax: "padding: A B C D",
        label: "Four values",
        code: "padding: 10px 24px 30px 6px;",
        meaning: "Top, right, bottom, left, clockwise from the top.",
      },
      {
        syntax: "padding-top: A",
        label: "One side",
        code: "padding-top: 10px;",
        meaning:
          "One side on its own. There is a <code>padding-right</code>, <code>padding-bottom</code> and <code>padding-left</code> to match.",
      },
      {
        syntax: "padding: 0",
        label: "None",
        code: "padding: 0;",
        meaning:
          "No padding at all, which is what most elements start with. A unit is not needed on a zero.",
      },
    ],
    notes: [
      {
        after: "examples",
        title: "The shorthand order",
        body:
          "The four value form runs <strong>clockwise from the top</strong>: top, right, bottom, left. The two value form is the same idea with opposite sides paired up, so the first value is the top and bottom and the second is the left and right. Every ring in the box model uses that order, so learning it once covers margin and border as well.",
      },
      {
        after: "end",
        title: "Percentages",
        body:
          "A padding written as a percentage is measured against the <strong>width</strong> of the containing element, and that includes <code>padding-top</code> and <code>padding-bottom</code>. So <code>padding: 10%</code> on a 400px wide container is 40px on all four sides, not 40px across and something else down.",
      },
    ],
    demo: {
      editorLabel: "styles.css",
      value:
        ".box {\n  width: 200px;\n  padding: 16px;\n  border: 4px solid #0d9488;\n  margin: 20px;\n  background: #ccfbf1;\n}",
      result:
        "Raise the padding and the background grows with it, because the space is inside the element.",
      panes: [{ label: "Rendered page", html: PANE, applies: true }],
    },
  },

  {
    id: "border",
    number: "03",
    name: "The Border",
    tagline: "The edge you can see",
    accent: "#0d9488",
    lead:
      "The border is the line drawn around the padding. It is the one area of the box with something to look at, so it takes three things rather than one: a <strong>width</strong>, a <strong>style</strong> and a <strong>colour</strong>.",
    keyPoint:
      "A border draws nothing until it has a <strong>style</strong>. <code>border-style</code> starts at <code>none</code>, so a width and a colour on their own leave the edge invisible.",
    meta: {
      "What it is": "The line drawn around the padding",
      "Written as": "border, or border-width and friends",
      "Why it matters": "It marks where the element ends",
    },
    exampleHeadings: ["Written as", "Kind", "Example", "What it sets"],
    examples: [
      {
        syntax: "border: W S C",
        label: "All three",
        code: "border: 4px solid #0d9488;",
        meaning:
          "Width, style and colour in one declaration, on all four sides. The usual way to write a border.",
      },
      {
        syntax: "border-width: A",
        label: "Width only",
        code: "border-width: 4px;",
        meaning:
          "How thick the line is. Takes the same one, two and four value forms as padding.",
      },
      {
        syntax: "border-style: A",
        label: "Style only",
        code: "border-style: dashed;",
        meaning:
          "What the line looks like: <code>solid</code>, <code>dashed</code>, <code>dotted</code> and a few more, or <code>none</code> for no line.",
      },
      {
        syntax: "border-color: A",
        label: "Colour only",
        code: "border-color: #0d9488;",
        meaning:
          "What colour the line is drawn in. Left unset, it matches the element's text colour.",
      },
      {
        syntax: "border-top: W S C",
        label: "One side",
        code: "border-top: 2px solid #94a3b8;",
        meaning:
          "One side on its own, with its own width, style and colour. There is a <code>border-right</code>, <code>border-bottom</code> and <code>border-left</code> to match.",
      },
      {
        syntax: "border-radius: A",
        label: "Corners",
        code: "border-radius: 8px;",
        meaning:
          "Rounds the corners off. It changes the shape of the box, not its size, and it works with no border at all.",
      },
    ],
    notes: [
      {
        after: "examples",
        title: "One side at a time",
        body:
          "A single side is where borders earn their keep: a rule under a heading is <code>border-bottom</code>, and a coloured strip down the side of a quote is <code>border-left</code>. Both are a border on one side and nothing on the other three.",
      },
      {
        after: "end",
        title: "Borders and outlines",
        body:
          "A border is a real part of the box, so adding one makes the element bigger and can push the layout around it. <code>outline</code> looks similar but is drawn outside the box without taking any space, which is why it is the one used to highlight an element without moving anything.",
      },
    ],
    demo: {
      editorLabel: "styles.css",
      value:
        ".box {\n  width: 200px;\n  padding: 16px;\n  border: 4px solid #0d9488;\n  margin: 20px;\n  background: #ccfbf1;\n}",
      result:
        "Change solid to none and the line goes, along with the room it was taking up.",
      panes: [{ label: "Rendered page", html: PANE, applies: true }],
    },
  },

  {
    id: "margin",
    number: "04",
    name: "Margin",
    tagline: "Space outside the box",
    accent: "#7c3aed",
    lead:
      "Margin is the space held <strong>outside</strong> the border. It is not room for the element's own content, it is room the element keeps clear around itself, so nothing else comes closer than that.",
    keyPoint:
      "Margin is outside the element, so the background never reaches it and the element's own size never includes it. It changes <strong>where the box sits</strong>, not how big the box is.",
    meta: {
      "What it is": "The space kept clear outside the border",
      "Written as": "margin, or margin-top and friends",
      "Why it matters": "It sets the gaps between elements",
    },
    exampleHeadings: ["Written as", "Kind", "Example", "What it sets"],
    examples: [
      {
        syntax: "margin: A",
        label: "One value",
        code: "margin: 20px;",
        meaning: "The same margin on all four sides.",
      },
      {
        syntax: "margin: A B",
        label: "Two values",
        code: "margin: 20px 12px;",
        meaning: "Top and bottom first, then left and right.",
      },
      {
        syntax: "margin: A B C D",
        label: "Four values",
        code: "margin: 30px 18px 10px 6px;",
        meaning: "Top, right, bottom, left, the same clockwise order as padding.",
      },
      {
        syntax: "margin-top: A",
        label: "One side",
        code: "margin-top: 24px;",
        meaning:
          "One side on its own. There is a <code>margin-right</code>, <code>margin-bottom</code> and <code>margin-left</code> to match.",
      },
      {
        syntax: "margin: 0 auto",
        label: "Auto",
        code: "margin: 0 auto;",
        meaning:
          "Splits whatever room is left over evenly between the left and right, which centres a block element that has a width.",
      },
      {
        syntax: "margin: -A",
        label: "Negative",
        code: "margin-top: -10px;",
        meaning:
          "Pulls the element the other way, closer to its neighbour or over it. Only margin accepts a negative value.",
      },
    ],
    notes: [
      {
        after: "examples",
        title: "Collapsing margins",
        body:
          "Where the bottom margin of one element meets the top margin of the next, the two <strong>collapse into one</strong> and the larger of them wins. So 30px above meeting 20px below gives a 30px gap, not 50px. Only vertical margins do this, and only in normal flow: side by side margins always add up.",
      },
      {
        after: "end",
        title: "Padding or margin",
        body:
          "They look the same on a plain white page and stop looking the same the moment the element has a background or a border. If the space should be part of the element, it is padding; if it should be between the element and its neighbours, it is margin.",
      },
    ],
    demo: {
      editorLabel: "styles.css",
      value:
        ".box {\n  width: 200px;\n  padding: 16px;\n  border: 4px solid #0d9488;\n  margin: 20px;\n  background: #ccfbf1;\n}",
      result:
        "Raise the margin and the paragraph below is pushed further away, while the box itself stays exactly the same size.",
      panes: [{ label: "Rendered page", html: PANE, applies: true }],
    },
  },

  {
    id: "sizing",
    number: "05",
    name: "What Width Measures",
    tagline: "content-box and border-box",
    accent: "#db2777",
    lead:
      "<code>width</code> does not set how wide the element ends up on the page. By default it sets the <strong>content box only</strong>, and the padding and the border are added on top of it, so the element is wider than the number you wrote.",
    keyPoint:
      "With the default <code>content-box</code>, <code>width: 200px</code> plus 16px of padding and a 4px border takes up <strong>240px</strong>. With <code>box-sizing: border-box</code>, that same 200px is the whole box from border to border.",
    meta: {
      "What it is": "Which areas the width you set covers",
      "Written as": "box-sizing: content-box or border-box",
      "Why it matters": "It decides how wide the element really is",
    },
    exampleHeadings: ["Written as", "Value", "Example", "What the width covers"],
    examples: [
      {
        syntax: "box-sizing: content-box",
        label: "The default",
        code: "width: 200px;",
        meaning:
          "The content box alone. Padding and border are added outside it, so the element grows past the number you set.",
      },
      {
        syntax: "box-sizing: border-box",
        label: "The alternative",
        code: "width: 200px;",
        meaning:
          "The content, the padding and the border together. The element is exactly the width you set, and the content shrinks to make room for the rings.",
      },
      {
        syntax: "width: A",
        label: "Across",
        code: "width: 200px;",
        meaning:
          "How wide the box is, measured by whichever of the two modes is in force.",
      },
      {
        syntax: "height: A",
        label: "Down",
        code: "height: 80px;",
        meaning:
          "How tall the box is, measured the same way. Everything here applies to the vertical sum too.",
      },
      {
        syntax: "width: 100%",
        label: "A share",
        code: "width: 100%;",
        meaning:
          "As wide as the containing element. Under <code>content-box</code> this is the classic overflow: 100% plus any padding is wider than the space available.",
      },
    ],
    ladder: [
      {
        rank: "1",
        title: "Start with the content box",
        body:
          "Under the default mode, the width you declare is the content box and nothing else. Nothing has been added yet.",
        code: "width: 200px;   ->  content 200px",
      },
      {
        rank: "2",
        title: "Add the padding on both sides",
        body:
          "Padding sits between the content and the border, on the left and on the right, so a single value counts twice.",
        code: "200 + 16 + 16  ->  padding box 232px",
      },
      {
        rank: "3",
        title: "Add the border on both sides",
        body:
          "The border wraps the padding, again on both sides. This total is the box you can actually see on screen.",
        code: "232 + 4 + 4    ->  border box 240px",
      },
      {
        rank: "4",
        title: "Add the margin for the room it takes",
        body:
          "The margin is not part of the element's size, but it is part of the space the element occupies in the layout around it.",
        code: "240 + 20 + 20  ->  240px box in 280px of room",
      },
      {
        rank: "5",
        title: "Switch to border-box and the sum runs backwards",
        body:
          "Now the 200px is the border box, so the padding and the border come out of it rather than being added to it. The rings are still there, they are just inside the number.",
        code: "200 - 4 - 4 - 16 - 16  ->  content 152px",
      },
    ],
    notes: [
      {
        after: "examples",
        title: "Why border-box is popular",
        body:
          "Under <code>border-box</code> the number you type is the number on screen, which makes a layout far easier to reason about. It is common enough for most stylesheets to switch every element over at the top with <code>* { box-sizing: border-box; }</code> and never think about it again.",
      },
      {
        after: "ladder",
        title: "Margin and box-sizing",
        body:
          "Neither mode ever counts the margin. <code>border-box</code> reaches as far as the border and stops, so an element with a margin always takes up more room in the layout than its width says.",
      },
      {
        after: "end",
        title: "When an element overflows",
        body:
          "Content wider than its box does not vanish, it spills out and draws over whatever is beside it. Most of the time the cause is a width that was set without counting the padding and the border, which is why working the sum out in this order is worth the effort.",
      },
    ],
    demo: {
      editorLabel: "styles.css",
      value:
        ".box {\n  box-sizing: content-box;\n  width: 200px;\n  padding: 16px;\n  border: 4px solid #0d9488;\n  margin: 20px;\n  background: #ccfbf1;\n}",
      result:
        "Switch content-box to border-box. The declared width never changes, but the box on screen goes from 240px to 200px.",
      panes: [{ label: "Rendered page", html: PANE, applies: true }],
    },
  },
];

const METAKEYS = ["What it is", "Written as", "Why it matters"];

const LESSON = {
  id: "box-model",
  metaKeys: METAKEYS,
  exampleHeadings: ["Written as", "Kind", "Example", "What it sets"],
  demoHint: "Edit the CSS and watch the box change",
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
        label: "Shows the background",
        values: [
          "Out as far as the border",
          "Yes, it is inside the element",
          "The border is drawn over it",
          "No, it is outside the element",
          "Unchanged either way",
        ],
      },
      {
        label: "Counted in the width you set",
        values: [
          "Depends on the mode",
          "Only under border-box",
          "Only under border-box",
          "Never",
          "This is the setting that decides",
        ],
      },
      {
        label: "Get it wrong and",
        values: [
          "The element is a size you cannot explain",
          "Text sits hard against the edge",
          "The edge you styled never appears",
          "Gaps are double or half what you wanted",
          "The element overflows the space it was given",
        ],
      },
    ]),
  },
};
