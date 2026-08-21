/* Complete the CSS - question bank: the brief, HTML and CSS rule with blanks. Answers live encrypted in answers.json; edit answers.source.js and re-run scripts/encrypt-answers.js. */
const COMPLETE_CSS_CATEGORIES = [
  {
    id: "text-colour",
    name: "Text & Colour",
    color: "#2563eb",
    questions: [
      {
        id: "tc01",
        difficulty: "easy",
        brief:
          "The heading should be a deep purple. Use the hex code #7c3aed.",
        html: `<h1 class="page-title">Sunrise Bakery</h1>`,
        rules: [
          {
            selector: ".page-title",
            decls: [
              { propBlank: "b1", value: "#7c3aed" },
              { prop: "font-family", value: "sans-serif" },
            ],
          },
        ],
      },
      {
        id: "tc02",
        difficulty: "easy",
        brief: "The paragraph should be set at 12pt.",
        html: `<p class="intro">Fresh bread, baked every morning.</p>`,
        rules: [
          {
            selector: ".intro",
            decls: [
              { prop: "font-size", valueBlank: "b1" },
              { prop: "color", value: "#334155" },
            ],
          },
        ],
      },
      {
        id: "tc03",
        difficulty: "easy",
        brief: "The button's label should be bold.",
        html: `<button class="cta">Order now</button>`,
        rules: [
          {
            selector: ".cta",
            decls: [
              { prop: "font-weight", valueBlank: "b1" },
              { prop: "padding", value: "10px 20px" },
              { prop: "font-size", value: "16px" },
            ],
          },
        ],
      },
      {
        id: "tc04",
        difficulty: "easy",
        brief:
          "The heading should sit in the middle of its box, from left to right.",
        html: `<h2 class="section-title">Today's specials</h2>`,
        rules: [
          {
            selector: ".section-title",
            decls: [
              { propBlank: "b1", value: "center" },
              { prop: "color", value: "#0f172a" },
            ],
          },
        ],
      },
      {
        id: "tc05",
        difficulty: "easy",
        brief: "The date should line up against the right edge of its box.",
        html: `<p class="post-date">Posted 14 March</p>`,
        rules: [
          {
            selector: ".post-date",
            decls: [
              { prop: "text-align", valueBlank: "b1" },
              { prop: "color", value: "#64748b" },
            ],
          },
        ],
      },
      {
        id: "tc06",
        difficulty: "medium",
        brief:
          "The paragraph should be set in Arial, falling back to any sans-serif font if Arial is not installed.",
        html: `<p class="body-copy">Every loaf is made by hand, the day you buy it.</p>`,
        rules: [
          {
            selector: ".body-copy",
            decls: [
              { propBlank: "b1", value: "Arial, sans-serif" },
              { prop: "font-size", value: "16px" },
            ],
          },
        ],
      },
      {
        id: "tc07",
        difficulty: "medium",
        brief: "The link should not have the underline browsers give it.",
        html: `<a class="nav-link" href="#">Menu</a>`,
        rules: [
          {
            selector: ".nav-link",
            decls: [
              { prop: "text-decoration", valueBlank: "b1" },
              { prop: "color", value: "#2563eb" },
              { prop: "font-weight", value: "600" },
            ],
          },
        ],
      },
      {
        id: "tc08",
        difficulty: "medium",
        brief:
          "The warning should be a strong red, using the hex code #dc2626, and slanted rather than upright.",
        html: `<p class="warning">Nut allergy: some items contain almonds.</p>`,
        rules: [
          {
            selector: ".warning",
            decls: [
              { propBlank: "b1", value: "#dc2626" },
              { prop: "font-style", valueBlank: "b2" },
            ],
          },
        ],
      },
      {
        id: "tc09",
        difficulty: "medium",
        brief:
          "The lines of the paragraph should be spaced at one and a half times the font size. Write it as a plain number with no unit.",
        html: `<p class="lede">We open at seven every morning and bake right through until the shelves are empty. Come early for the sourdough.</p>`,
        rules: [
          {
            selector: ".lede",
            decls: [
              { prop: "line-height", valueBlank: "b1" },
              { prop: "font-size", value: "16px" },
              { prop: "max-width", value: "320px" },
            ],
          },
        ],
      },
      {
        id: "tc10",
        difficulty: "hard",
        brief:
          "The label is written in ordinary lower case in the HTML, but should appear in ALL CAPITALS on screen. Do not change the HTML.",
        html: `<div class="eyebrow">new this week</div>`,
        rules: [
          {
            selector: ".eyebrow",
            decls: [
              { propBlank: "b1", value: "uppercase" },
              { prop: "letter-spacing", value: "0.08em" },
              { prop: "font-size", value: "12px" },
              { prop: "color", value: "#0f766e" },
            ],
          },
        ],
      },
      {
        id: "tc11",
        difficulty: "hard",
        brief:
          "The letters in the logo should be pushed 2px further apart than the font would normally set them.",
        html: `<div class="logo-text">SUNRISE</div>`,
        rules: [
          {
            selector: ".logo-text",
            decls: [
              { prop: "letter-spacing", valueBlank: "b1" },
              { prop: "font-weight", value: "700" },
              { prop: "font-size", value: "24px" },
            ],
          },
        ],
      },
      {
        id: "tc12",
        difficulty: "hard",
        brief:
          "The quote should be grey (#475569), slanted rather than upright, and centred from left to right.",
        html: `<p class="quote">"Best sourdough in town, and I have tried them all."</p>`,
        rules: [
          {
            selector: ".quote",
            decls: [
              { propBlank: "b1", value: "#475569" },
              { prop: "font-style", valueBlank: "b2" },
              { prop: "text-align", valueBlank: "b3" },
              { prop: "max-width", value: "300px" },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "box-model",
    name: "Box Model",
    color: "#d97706",
    questions: [
      {
        id: "bm01",
        difficulty: "easy",
        brief:
          "The card needs 20px of space on all four sides between its border and the text inside it.",
        html: `<div class="info-card">Collect in store</div>`,
        rules: [
          {
            selector: ".info-card",
            decls: [
              { prop: "padding", valueBlank: "b1" },
              { prop: "border", value: "1px solid #cbd5e1" },
            ],
          },
        ],
      },
      {
        id: "bm02",
        difficulty: "easy",
        brief:
          "There should be 24px of empty space outside the box on all four sides, pushing everything else away from it.",
        html: `<div class="promo">Two loaves for $8</div>`,
        rules: [
          {
            selector: ".promo",
            decls: [
              { propBlank: "b1", value: "24px" },
              { prop: "background-color", value: "#fef3c7" },
              { prop: "padding", value: "12px" },
            ],
          },
        ],
      },
      {
        id: "bm03",
        difficulty: "easy",
        brief:
          "The box should always measure exactly 300px across, however wide the page is.",
        html: `<div class="sidebar-box">Opening hours</div>`,
        rules: [
          {
            selector: ".sidebar-box",
            decls: [
              { prop: "width", valueBlank: "b1" },
              { prop: "padding", value: "16px" },
              { prop: "background-color", value: "#f1f5f9" },
            ],
          },
        ],
      },
      {
        id: "bm04",
        difficulty: "medium",
        brief:
          "The banner should always stretch across the full width of whatever contains it, whatever size that turns out to be.",
        html: `<div class="banner">Free delivery this week</div>`,
        rules: [
          {
            selector: ".banner",
            decls: [
              { prop: "width", valueBlank: "b1" },
              { prop: "padding", value: "12px" },
              { prop: "background-color", value: "#dbeafe" },
              { prop: "box-sizing", value: "border-box" },
            ],
          },
        ],
      },
      {
        id: "bm05",
        difficulty: "medium",
        brief:
          "The button should have 8px of space above and below its label, and 16px to the left and right of it.",
        html: `<button class="btn-buy">Add to basket</button>`,
        rules: [
          {
            selector: ".btn-buy",
            decls: [
              { propBlank: "b1", value: "8px 16px" },
              { prop: "border", value: "none" },
              { prop: "background-color", value: "#2563eb" },
              { prop: "color", value: "#ffffff" },
            ],
          },
        ],
      },
      {
        id: "bm06",
        difficulty: "medium",
        brief:
          "The box is 400px wide and should sit centred in the page, with no space above or below it. One value covers top and bottom, the other covers left and right.",
        html: `<div class="centred-box">Our story</div>`,
        rules: [
          {
            selector: ".centred-box",
            decls: [
              { prop: "width", value: "400px" },
              { prop: "margin", valueBlank: "b1" },
              { prop: "padding", value: "16px" },
              { prop: "background-color", value: "#ede9fe" },
            ],
          },
        ],
      },
      {
        id: "bm07",
        difficulty: "medium",
        brief:
          "The box needs a line drawn around it: 2px thick, unbroken, in the colour #0f172a. One property does all three.",
        html: `<div class="framed">Gift cards available</div>`,
        rules: [
          {
            selector: ".framed",
            decls: [
              { propBlank: "b1", value: "2px solid #0f172a" },
              { prop: "padding", value: "16px" },
            ],
          },
        ],
      },
      {
        id: "bm08",
        difficulty: "hard",
        brief:
          "This box is 300px wide with 20px of padding, so it currently takes up 340px on screen. Make the padding count inside the 300px instead of adding to it.",
        html: `<div class="tidy-box">Loyalty card</div>`,
        rules: [
          {
            selector: ".tidy-box",
            decls: [
              { prop: "width", value: "300px" },
              { prop: "padding", value: "20px" },
              { prop: "box-sizing", valueBlank: "b1" },
              { prop: "border", value: "1px solid #94a3b8" },
            ],
          },
        ],
      },
      {
        id: "bm09",
        difficulty: "hard",
        brief:
          "The divider should be a 4px tall bar with 32px of space below it. The zero above it is already set, so leave that line alone.",
        html: `<div class="divider"></div>`,
        rules: [
          {
            selector: ".divider",
            decls: [
              { prop: "height", valueBlank: "b1" },
              { prop: "margin-top", value: "0" },
              { propBlank: "b2", value: "32px" },
              { prop: "background-color", value: "#cbd5e1" },
            ],
          },
        ],
      },
      {
        id: "bm10",
        difficulty: "hard",
        brief:
          "The article should grow with the page, but never get wider than 640px. Fill in the ceiling.",
        html: `<p class="article">Sourdough takes three days from starter to shelf, and we would not shorten it by an hour.</p>`,
        rules: [
          {
            selector: ".article",
            decls: [
              { prop: "width", value: "100%" },
              { propBlank: "b1", valueBlank: "b2" },
              { prop: "background-color", value: "#f8fafc" },
              { prop: "padding", value: "12px" },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "backgrounds-borders",
    name: "Backgrounds & Borders",
    color: "#0d9488",
    questions: [
      {
        id: "bb01",
        difficulty: "easy",
        brief:
          "The panel should sit on a pale grey fill. Use the hex code #f1f5f9.",
        html: `<div class="panel-note">Open 7am to 3pm</div>`,
        rules: [
          {
            selector: ".panel-note",
            decls: [
              { propBlank: "b1", value: "#f1f5f9" },
              { prop: "padding", value: "16px" },
              { prop: "color", value: "#0f172a" },
            ],
          },
        ],
      },
      {
        id: "bb02",
        difficulty: "easy",
        brief: "Every corner of the card should be rounded off by 8px.",
        html: `<div class="rounded-card">Order #1042</div>`,
        rules: [
          {
            selector: ".rounded-card",
            decls: [
              { prop: "border-radius", valueBlank: "b1" },
              { prop: "background-color", value: "#e0f2fe" },
              { prop: "padding", value: "16px" },
            ],
          },
        ],
      },
      {
        id: "bb03",
        difficulty: "easy",
        brief:
          "This box has a border width and a border colour, but nothing is showing. Give it a plain unbroken line.",
        html: `<div class="dash-box">Delivery area</div>`,
        rules: [
          {
            selector: ".dash-box",
            decls: [
              { prop: "border-width", value: "2px" },
              { prop: "border-color", value: "#2563eb" },
              { prop: "border-style", valueBlank: "b1" },
              { prop: "padding", value: "16px" },
            ],
          },
        ],
      },
      {
        id: "bb04",
        difficulty: "medium",
        brief:
          "The avatar is 80px square and should appear as a circle. Round every corner by half its size.",
        html: `<div class="avatar">M</div>`,
        rules: [
          {
            selector: ".avatar",
            decls: [
              { prop: "width", value: "80px" },
              { prop: "height", value: "80px" },
              { propBlank: "b1", value: "40px" },
              { prop: "background-color", value: "#7c3aed" },
              { prop: "color", value: "#ffffff" },
              { prop: "text-align", value: "center" },
              { prop: "line-height", value: "80px" },
            ],
          },
        ],
      },
      {
        id: "bb05",
        difficulty: "medium",
        brief:
          "The message needs a pale green fill (#dcfce7) and a line around it that is 1px thick, unbroken, in #16a34a.",
        html: `<div class="success-note">Order confirmed</div>`,
        rules: [
          {
            selector: ".success-note",
            decls: [
              { prop: "background-color", valueBlank: "b1" },
              { prop: "border", valueBlank: "b2" },
              { prop: "padding", value: "12px" },
              { prop: "color", value: "#166534" },
            ],
          },
        ],
      },
      {
        id: "bb06",
        difficulty: "medium",
        brief:
          "The quote needs a 4px solid bar in #2563eb down its left-hand side only, and nothing on the other three sides.",
        html: `<p class="pull-quote">"Worth the queue, every single time."</p>`,
        rules: [
          {
            selector: ".pull-quote",
            decls: [
              { propBlank: "b1", value: "4px solid #2563eb" },
              { prop: "padding-left", value: "16px" },
              { prop: "color", value: "#334155" },
            ],
          },
        ],
      },
      {
        id: "bb07",
        difficulty: "hard",
        brief:
          "Give the card a soft shadow: nothing sideways, 4px down, a 12px blur, in the colour rgba(15, 23, 42, 0.25). They go in that order, separated by spaces.",
        html: `<div class="float-card">Today's bake list</div>`,
        rules: [
          {
            selector: ".float-card",
            decls: [
              { prop: "box-shadow", valueBlank: "b1" },
              { prop: "background-color", value: "#ffffff" },
              { prop: "border-radius", value: "8px" },
              { prop: "padding", value: "16px" },
              { prop: "color", value: "#0f172a" },
            ],
          },
        ],
      },
      {
        id: "bb08",
        difficulty: "hard",
        brief:
          "The notice needs a pale amber fill (#fef3c7), corners rounded by 6px, and a line around it 1px thick, unbroken, in #f59e0b.",
        html: `<div class="notice">Closed Monday for maintenance</div>`,
        rules: [
          {
            selector: ".notice",
            decls: [
              { propBlank: "b1", value: "#fef3c7" },
              { propBlank: "b2", value: "6px" },
              { prop: "border", valueBlank: "b3" },
              { prop: "padding", value: "12px" },
              { prop: "color", value: "#92400e" },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "layout",
    name: "Layout",
    color: "#db2777",
    questions: [
      {
        id: "ly01",
        difficulty: "easy",
        brief:
          "The three boxes are stacked on top of each other. Turn the container into a flex container so they sit in a row instead.",
        html: `<div class="row">
  <div class="box">One</div>
  <div class="box">Two</div>
  <div class="box">Three</div>
</div>`,
        rules: [
          {
            selector: ".row",
            decls: [
              { prop: "display", valueBlank: "b1" },
              { prop: "gap", value: "12px" },
            ],
          },
          {
            selector: ".box",
            decls: [
              { prop: "padding", value: "12px" },
              { prop: "background-color", value: "#dbeafe" },
            ],
          },
        ],
      },
      {
        id: "ly02",
        difficulty: "easy",
        brief:
          "The items in the row should have 16px of space between them, but no extra space at either end.",
        html: `<div class="row">
  <div class="box">One</div>
  <div class="box">Two</div>
  <div class="box">Three</div>
</div>`,
        rules: [
          {
            selector: ".row",
            decls: [
              { prop: "display", value: "flex" },
              { propBlank: "b1", value: "16px" },
            ],
          },
          {
            selector: ".box",
            decls: [
              { prop: "padding", value: "12px" },
              { prop: "background-color", value: "#dbeafe" },
            ],
          },
        ],
      },
      {
        id: "ly03",
        difficulty: "easy",
        brief:
          "The row is much wider than its items. Bunch them together in the middle of it, from left to right.",
        html: `<div class="row">
  <div class="box">One</div>
  <div class="box">Two</div>
</div>`,
        rules: [
          {
            selector: ".row",
            decls: [
              { prop: "display", value: "flex" },
              { prop: "justify-content", valueBlank: "b1" },
              { prop: "gap", value: "12px" },
              { prop: "background-color", value: "#f1f5f9" },
              { prop: "padding", value: "8px" },
            ],
          },
          {
            selector: ".box",
            decls: [
              { prop: "padding", value: "12px" },
              { prop: "background-color", value: "#dbeafe" },
            ],
          },
        ],
      },
      {
        id: "ly04",
        difficulty: "medium",
        brief:
          "The brand should sit hard against the left edge and the menu hard against the right, with all the leftover space pushed into the gap between them.",
        html: `<div class="bar">
  <div class="brand">Sunrise</div>
  <div class="menu">Menu</div>
</div>`,
        rules: [
          {
            selector: ".bar",
            decls: [
              { prop: "display", value: "flex" },
              { prop: "justify-content", valueBlank: "b1" },
              { prop: "background-color", value: "#f1f5f9" },
              { prop: "padding", value: "12px" },
            ],
          },
        ],
      },
      {
        id: "ly05",
        difficulty: "medium",
        brief:
          "The two boxes are different heights. Line them up so their middles sit on the same line, top to bottom.",
        html: `<div class="row">
  <div class="tall">Tall box<br />with two lines</div>
  <div class="short">Short</div>
</div>`,
        rules: [
          {
            selector: ".row",
            decls: [
              { prop: "display", value: "flex" },
              { propBlank: "b1", value: "center" },
              { prop: "gap", value: "12px" },
            ],
          },
          {
            selector: ".tall",
            decls: [
              { prop: "padding", value: "12px" },
              { prop: "background-color", value: "#dbeafe" },
            ],
          },
          {
            selector: ".short",
            decls: [
              { prop: "padding", value: "12px" },
              { prop: "background-color", value: "#fde68a" },
            ],
          },
        ],
      },
      {
        id: "ly06",
        difficulty: "medium",
        brief:
          "These items are laid out in a row. Turn the main direction so they stack one above another instead, top to bottom.",
        html: `<div class="stack">
  <div class="box">One</div>
  <div class="box">Two</div>
  <div class="box">Three</div>
</div>`,
        rules: [
          {
            selector: ".stack",
            decls: [
              { prop: "display", value: "flex" },
              { prop: "flex-direction", valueBlank: "b1" },
              { prop: "gap", value: "8px" },
            ],
          },
          {
            selector: ".box",
            decls: [
              { prop: "padding", value: "12px" },
              { prop: "background-color", value: "#dbeafe" },
            ],
          },
        ],
      },
      {
        id: "ly07",
        difficulty: "medium",
        brief:
          "The old announcement should be taken off the page completely, leaving no gap where it used to be.",
        html: `<div class="old-notice">Easter hours (out of date)</div>
<div class="current">Open as usual this week</div>`,
        rules: [
          {
            selector: ".old-notice",
            decls: [{ prop: "display", valueBlank: "b1" }],
          },
          {
            selector: ".current",
            decls: [
              { prop: "padding", value: "12px" },
              { prop: "background-color", value: "#dcfce7" },
            ],
          },
        ],
      },
      {
        id: "ly08",
        difficulty: "hard",
        brief:
          "The card's contents should stack top to bottom, and each line should be centred from left to right.",
        html: `<div class="card-stack">
  <div class="line">Sunrise Bakery</div>
  <div class="line">Est. 2011</div>
</div>`,
        rules: [
          {
            selector: ".card-stack",
            decls: [
              { prop: "display", value: "flex" },
              { prop: "flex-direction", valueBlank: "b1" },
              { prop: "align-items", valueBlank: "b2" },
              { prop: "gap", value: "8px" },
              { prop: "background-color", value: "#f1f5f9" },
              { prop: "padding", value: "16px" },
            ],
          },
        ],
      },
      {
        id: "ly09",
        difficulty: "hard",
        brief:
          "These two labels each take a whole line to themselves because a div is a block. Make them sit side by side, while still respecting the width and the padding below.",
        html: `<div class="tag-label">Wholemeal</div>
<div class="tag-label">Rye</div>`,
        rules: [
          {
            selector: ".tag-label",
            decls: [
              { prop: "display", valueBlank: "b1" },
              { prop: "width", value: "120px" },
              { prop: "padding", value: "6px" },
              { prop: "background-color", value: "#f1f5f9" },
              { prop: "text-align", value: "center" },
            ],
          },
        ],
      },
      {
        id: "ly10",
        difficulty: "hard",
        brief:
          "The navigation bar should lay its children out in a row, push the brand and the menu to opposite ends, and line them up on the same middle line.",
        html: `<div class="navbar">
  <div class="brand">Sunrise</div>
  <div class="links">Menu Orders Contact</div>
</div>`,
        rules: [
          {
            selector: ".navbar",
            decls: [
              { prop: "display", valueBlank: "b1" },
              { prop: "justify-content", valueBlank: "b2" },
              { prop: "align-items", valueBlank: "b3" },
              { prop: "padding", value: "12px 20px" },
              { prop: "background-color", value: "#0f172a" },
              { prop: "color", value: "#ffffff" },
            ],
          },
        ],
      },
    ],
  },
];
