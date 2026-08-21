/* CSS Properties - lesson content. Every group answers the same questions, in the same order, in the same words, so the four can be read across and compared. */

const PANE = '<h1 class="title">Sunrise Bakery</h1>\n<p class="blurb">Baked fresh every morning.</p>\n<button class="cta">Order now</button>';

const GROUPS = [
  {
    id: "text",
    number: "01",
    name: "Text and Colour",
    tagline: "How the words look",
    accent: "#2563eb",
    lead:
      "These properties change <strong>how the text itself looks</strong>: its colour, its size, its weight and the space between its lines. They do not change the size or the position of the box the text sits in.",
    blocks: [
      {
        label: "styles.css",
        lang: "css",
        code: `.title {
  /* The colour of the letters, not the box behind them. */
  color: #0d9488;

  /* A number and a unit, joined with no space. */
  font-size: 32px;

  /* bold, or the number 700. They mean the same thing. */
  font-weight: bold;
}

.blurb {
  /* No unit: this multiplies the element's own font-size. */
  line-height: 1.5;
}`,
      },
    ],
    meta: {
      "What it changes": "The look of the text",
      "Key properties": "color, font-size, font-weight",
      "Common mistake": "Using color for the box behind",
    },
    notes: {
      "How it works":
        "Each property takes one value and changes one thing about the text. Most of them are inherited, so setting <code>color</code> on a container passes it down to everything inside it.",
      "What to watch for":
        "<code>color</code> is the text and <code>background-color</code> is the box behind it. They are easy to confuse because both sound like they set 'the colour'.",
      "Worth remembering":
        "CSS uses the American spelling, so it is <code>color</code> and <code>center</code>, never <code>colour</code> or <code>centre</code>.",
    },
    demo: {
      editorLabel: "styles.css",
      value: ".title {\n  color: #0d9488;\n  font-size: 28px;\n}",
      result: "Only the look of the text changes. The boxes stay exactly where they were.",
      panes: [{ label: "index.html", html: PANE, applies: true }],
    },
  },

  {
    id: "box",
    number: "02",
    name: "The Box Model",
    tagline: "How big the box is",
    accent: "#d97706",
    lead:
      "These properties change <strong>the size of the box and the space around it</strong>. Every element is a rectangle, and these decide how wide it is, how much room its content gets, and how far it sits from its neighbours.",
    blocks: [
      {
        label: "styles.css",
        lang: "css",
        code: `.card {
  /* Space INSIDE the border, between border and content. */
  padding: 20px;

  /* Space OUTSIDE the border, pushing neighbours away. */
  margin: 24px;

  /* By default this measures the CONTENT only. */
  width: 300px;

  /* So this 20px padding is added on top: 340px on screen. */
  border: 1px solid #94a3b8;

  /* Unless you say the width should cover the lot. */
  box-sizing: border-box;
}`,
      },
    ],
    meta: {
      "What it changes": "The size of the box and its spacing",
      "Key properties": "padding, margin, width, border",
      "Common mistake": "Mixing up padding and margin",
    },
    notes: {
      "How it works":
        "Working outwards, a box is content, then padding, then border, then margin. One value applies to all four sides, two values are top-and-bottom then left-and-right.",
      "What to watch for":
        "<code>width</code> measures only the content by default, so padding and border make the box bigger than the number you wrote. <code>box-sizing: border-box</code> makes the number mean the whole box.",
      "Worth remembering":
        "Padding is inside the border and margin is outside it. If you want space between two elements you want margin; if you want the text to stop touching the edge you want padding.",
    },
    demo: {
      editorLabel: "styles.css",
      value: ".title {\n  padding: 12px;\n  background-color: #dbeafe;\n}",
      result: "The box grows and the neighbours move. The text itself is unchanged.",
      panes: [{ label: "index.html", html: PANE, applies: true }],
    },
  },

  {
    id: "surface",
    number: "03",
    name: "Backgrounds and Borders",
    tagline: "How the box is painted",
    accent: "#0d9488",
    lead:
      "These properties change <strong>the surface of the box</strong>: what fills it, what outlines it, and how sharp its corners are. They paint the box that the box model already sized.",
    blocks: [
      {
        label: "styles.css",
        lang: "css",
        code: `.card {
  /* Fills the box behind the content. */
  background-color: #fef3c7;

  /* Width, style and colour in one value, separated by spaces. */
  border: 2px solid #f59e0b;

  /* Rounds every corner, and clips the background to match. */
  border-radius: 8px;

  /* Sideways, down, blur, then colour. */
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.25);
}`,
      },
    ],
    meta: {
      "What it changes": "The surface of the box",
      "Key properties": "background-color, border, border-radius",
      "Common mistake": "A border with a width but no style",
    },
    notes: {
      "How it works":
        "The fill sits behind the content, the border is drawn on the edge, and <code>border-radius</code> rounds both together. Shorthand properties pack several values into one, separated by spaces.",
      "What to watch for":
        "<code>border-style</code> defaults to <code>none</code>, so a border with a width and a colour but no style is invisible. That is why <code>border</code> takes all three at once.",
      "Worth remembering":
        "Shorthands use spaces, never commas. <code>1px solid #f59e0b</code> is valid; <code>1px, solid, #f59e0b</code> is thrown away entirely.",
    },
    demo: {
      editorLabel: "styles.css",
      value: ".title {\n  background-color: #fef3c7;\n  border-radius: 8px;\n  padding: 8px;\n}",
      result: "Only the surface changes. The box is the same size it was before.",
      panes: [{ label: "index.html", html: PANE, applies: true }],
    },
  },

  {
    id: "layout",
    number: "04",
    name: "Layout with Flexbox",
    tagline: "Where the boxes sit",
    accent: "#db2777",
    lead:
      "These properties change <strong>where a box's children sit inside it</strong>. They go on the container, not on the children, and they decide whether things sit in a row or a column and how the spare space is shared out.",
    blocks: [
      {
        label: "styles.css",
        lang: "css",
        code: `.row {
  /* Goes on the PARENT. The children need nothing. */
  display: flex;

  /* Along the row: where the items sit left to right. */
  justify-content: space-between;

  /* Across the row: where they sit top to bottom. */
  align-items: center;

  /* Space between the items, but not at the ends. */
  gap: 16px;
}`,
      },
    ],
    meta: {
      "What it changes": "Where the children sit",
      "Key properties": "display, justify-content, align-items",
      "Common mistake": "Putting flex on the child, not the parent",
    },
    notes: {
      "How it works":
        "<code>display: flex</code> turns an element into a flex container and lays its direct children in a row. <code>justify-content</code> works along that row and <code>align-items</code> works across it.",
      "What to watch for":
        "Setting <code>flex-direction: column</code> swaps the two axes over, so <code>align-items</code> then controls left-to-right position rather than top-to-bottom.",
      "Worth remembering":
        "These properties belong on the parent. If a child is not moving, check you have styled the container and not the thing inside it.",
    },
    demo: {
      editorLabel: "styles.css",
      value: "body {\n  display: flex;\n  gap: 12px;\n  align-items: center;\n}",
      result: "Nothing about the boxes changes, only where they sit relative to each other.",
      panes: [{ label: "index.html", html: PANE, applies: true }],
    },
  },
];

const LESSON = {
  id: "css-properties",
  metaKeys: ["What it changes", "Key properties", "Common mistake"],
  noteLabels: ["How it works", "What to watch for", "Worth remembering"],
  demoHint: "Edit the CSS and watch which part of the page responds",
  sections: GROUPS,
  comparison: {
    columns: ["text", "box", "surface", "layout"],
    rows: [
      {
        label: "What it changes",
        values: [
          "The look of the text",
          "The size of the box and its spacing",
          "The surface of the box",
          "Where the children sit",
        ],
      },
      {
        label: "Key properties",
        values: [
          "color, font-size, font-weight",
          "padding, margin, width, border",
          "background-color, border, border-radius",
          "display, justify-content, align-items",
        ],
      },
      {
        label: "Goes on",
        values: ["The element itself", "The element itself", "The element itself", "The parent"],
      },
      {
        label: "Moves other elements",
        values: ["No", "Yes", "No", "Yes"],
      },
      {
        label: "Units it takes",
        values: ["px, pt, em, plain numbers", "px, %, or none for zero", "px, and colour values", "Mostly keywords, gap takes px"],
      },
      {
        label: "Common mistake",
        values: [
          "Using color for the box behind",
          "Mixing up padding and margin",
          "A border with a width but no style",
          "Putting flex on the child, not the parent",
        ],
      },
    ],
  },
};
