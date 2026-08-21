/* Write the Selector - question bank: the brief, the page HTML and the declarations applied once the selector is right. Target selectors, hints and explanations live encrypted in answers.json. */

const WRITE_SELECTOR_CATEGORIES = [
  {
    id: "basics",
    name: "Basic Selectors",
    color: "#2563eb",
    questions: [
      {
        id: "b01",
        difficulty: "easy",
        brief: "Select every list item on the page.",
        html: `<ul>
  <li>Flat white</li>
  <li>Long black</li>
  <li>Mocha</li>
</ul>`,
        declarations: "color: #b45309;\nfont-weight: 700;",
      },
      {
        id: "b02",
        difficulty: "easy",
        brief: "Select only the items with the class <strong>sold-out</strong>.",
        html: `<ul>
  <li>Flat white</li>
  <li class="sold-out">Long black</li>
  <li>Mocha</li>
  <li class="sold-out">Chai</li>
</ul>`,
        declarations: "color: #dc2626;\ntext-decoration: line-through;",
      },
      {
        id: "b03",
        difficulty: "easy",
        brief:
          "Select the one element with the id <strong>tagline</strong>. Both paragraphs share the same tag, so the tag name alone will not do.",
        html: `<h1>The Corner Cafe</h1>
<p id="tagline">Baked fresh every morning.</p>
<p>Open weekdays 7am to 3pm.</p>`,
        declarations: "color: #7c3aed;",
      },
      {
        id: "b04",
        difficulty: "easy",
        brief: "Select every paragraph, and nothing else.",
        html: `<h2>Opening hours</h2>
<p>Weekdays 7am to 3pm.</p>
<div>Weekends 8am to 2pm.</div>
<p>Closed on public holidays.</p>`,
        declarations: "background-color: #dbeafe;\npadding: 8px;",
      },
      {
        id: "b05",
        difficulty: "medium",
        brief:
          "Select both headings at once, but not the paragraph. One selector, two element types.",
        html: `<h1>Sunrise Bakery</h1>
<h2>Fresh today</h2>
<p>Sourdough, rye and wholemeal.</p>`,
        declarations: "color: #0d9488;\nletter-spacing: 1px;",
      },
      {
        id: "b06",
        difficulty: "medium",
        brief:
          "Select only the list items that are <strong>featured</strong>. The buttons share that class, so leave them alone.",
        html: `<ul>
  <li class="featured">Sourdough</li>
  <li>Baguette</li>
  <li class="featured">Rye</li>
</ul>
<button class="featured">Order</button>`,
        declarations: "background-color: #fef3c7;\npadding: 6px;",
      },
      {
        id: "b07",
        difficulty: "medium",
        brief:
          "Select only the card that is <strong>both</strong> a card and on special. The other two have just one of those classes.",
        html: `<div class="card">Plain scone</div>
<div class="card special">Date scone</div>
<div class="special">Not a card</div>`,
        declarations: "border: 3px solid #16a34a;\npadding: 10px;",
      },
      {
        id: "b08",
        difficulty: "medium",
        brief:
          "Select every link that has the class <strong>btn</strong>. There is a button element too, but it is not a link.",
        html: `<a href="#" class="btn">Order now</a>
<a href="#">Read more</a>
<button class="btn">Submit</button>
<a href="#" class="btn">Book a table</a>`,
        declarations: "background-color: #2563eb;\ncolor: #ffffff;\npadding: 6px 12px;",
      },
      {
        id: "b09",
        difficulty: "hard",
        brief: "Select absolutely every element on the page.",
        html: `<div>
  <h3>Notice</h3>
  <p>We close early on Sunday.</p>
</div>`,
        declarations: "outline: 2px solid #db2777;",
      },
      {
        id: "b10",
        difficulty: "hard",
        brief:
          "Select the paragraph with the id <strong>lede</strong> and every item with the class <strong>tag</strong>, in one selector.",
        html: `<p id="lede">Baked fresh every morning.</p>
<p>Since 2011.</p>
<ul>
  <li class="tag">Sourdough</li>
  <li>Plain</li>
  <li class="tag">Rye</li>
</ul>`,
        declarations: "font-style: italic;\ncolor: #0f766e;",
      },
    ],
  },

  {
    id: "combinators",
    name: "Combinators",
    color: "#d97706",
    questions: [
      {
        id: "c01",
        difficulty: "easy",
        brief:
          "Select the list items inside the menu, but not the one sitting outside it.",
        html: `<ul class="menu">
  <li>Coffee</li>
  <li>Tea</li>
</ul>
<ul>
  <li>Not on the menu</li>
</ul>`,
        declarations: "color: #b45309;\nfont-weight: 700;",
      },
      {
        id: "c02",
        difficulty: "easy",
        brief:
          "Select every link inside the footer, wherever it sits inside it.",
        html: `<div class="footer">
  <a href="#">About</a>
  <div>
    <a href="#">Contact</a>
  </div>
</div>
<a href="#">Outside the footer</a>`,
        declarations: "color: #7c3aed;\nfont-weight: 700;",
      },
      {
        id: "c03",
        difficulty: "medium",
        brief:
          "Select only the list items that are <strong>direct</strong> children of the outer list. The nested ones must stay untouched.",
        html: `<ul class="outer">
  <li>Drinks</li>
  <li>Food
    <ul>
      <li>Toastie</li>
      <li>Salad</li>
    </ul>
  </li>
  <li>Sweets</li>
</ul>`,
        declarations: "background-color: #dbeafe;\npadding: 4px;",
      },
      {
        id: "c04",
        difficulty: "medium",
        brief:
          "Select the paragraph that comes immediately after the heading, and only that one.",
        html: `<h2>Specials</h2>
<p>Pumpkin soup today.</p>
<p>Served with sourdough.</p>
<h2>Drinks</h2>`,
        declarations: "font-weight: 700;\ncolor: #0d9488;",
      },
      {
        id: "c05",
        difficulty: "medium",
        brief:
          "Select every paragraph that comes after the heading and shares a parent with it. There are two of them.",
        html: `<div>
  <p>Before the heading.</p>
  <h2>Specials</h2>
  <p>Pumpkin soup today.</p>
  <p>Served with sourdough.</p>
</div>`,
        declarations: "color: #dc2626;",
      },
      {
        id: "c06",
        difficulty: "medium",
        brief:
          "Select the paragraphs inside a card. The paragraph outside the cards must not change.",
        html: `<div class="card">
  <p>Flat white, $4.50</p>
</div>
<div class="card">
  <p>Long black, $4.00</p>
</div>
<p>Prices include GST.</p>`,
        declarations: "background-color: #fef3c7;\npadding: 6px;",
      },
      {
        id: "c07",
        difficulty: "hard",
        brief:
          "Select only the items that are direct children of the list and carry the class <strong>item</strong>. The nested one has that class too, so a descendant selector will not do.",
        html: `<ul class="list">
  <li class="item">Coffee</li>
  <li class="item">Tea
    <ul>
      <li class="item">Green</li>
    </ul>
  </li>
</ul>`,
        declarations: "border-left: 4px solid #16a34a;\npadding-left: 8px;",
      },
      {
        id: "c08",
        difficulty: "hard",
        brief:
          "Select every link that sits inside a list item, inside the navigation. Nothing else.",
        html: `<div class="nav">
  <ul>
    <li><a href="#">Home</a></li>
    <li><a href="#">Menu</a></li>
  </ul>
  <a href="#">Not in a list</a>
</div>`,
        declarations: "color: #2563eb;\nfont-weight: 700;",
      },
      {
        id: "c09",
        difficulty: "hard",
        brief:
          "Select the strong element that sits directly inside a paragraph that is directly inside the notice.",
        html: `<div class="notice">
  <p>Please note: <strong>cash only</strong> today.</p>
</div>
<p>Also <strong>closed Monday</strong>.</p>`,
        declarations: "color: #dc2626;\ntext-transform: uppercase;",
      },
      {
        id: "c10",
        difficulty: "hard",
        brief:
          "Select the heading immediately after the intro block, and only that heading.",
        html: `<h3>Welcome</h3>
<div class="intro">A short introduction.</div>
<h3>Our coffee</h3>
<h3>Our food</h3>`,
        declarations: "color: #db2777;\nborder-bottom: 2px solid #db2777;",
      },
    ],
  },

  {
    id: "pseudo",
    name: "Pseudo-classes & Attributes",
    color: "#0d9488",
    questions: [
      {
        id: "p01",
        difficulty: "easy",
        brief: "Select the first item in the list, without using its text or a class.",
        html: `<ul>
  <li>Sourdough</li>
  <li>Rye</li>
  <li>Wholemeal</li>
</ul>`,
        declarations: "font-weight: 700;\ncolor: #16a34a;",
      },
      {
        id: "p02",
        difficulty: "easy",
        brief: "Select the last item in the list.",
        html: `<ul>
  <li>Sourdough</li>
  <li>Rye</li>
  <li>Wholemeal</li>
</ul>`,
        declarations: "font-weight: 700;\ncolor: #dc2626;",
      },
      {
        id: "p03",
        difficulty: "medium",
        brief: "Select the second item in the list, counting from the top.",
        html: `<ul>
  <li>Monday</li>
  <li>Tuesday</li>
  <li>Wednesday</li>
  <li>Thursday</li>
</ul>`,
        declarations: "background-color: #dbeafe;\npadding: 4px;",
      },
      {
        id: "p04",
        difficulty: "medium",
        brief:
          "Select every second row, starting with the second one, so the list reads as stripes.",
        html: `<ul>
  <li>Row one</li>
  <li>Row two</li>
  <li>Row three</li>
  <li>Row four</li>
  <li>Row five</li>
  <li>Row six</li>
</ul>`,
        declarations: "background-color: #f1f5f9;",
      },
      {
        id: "p05",
        difficulty: "medium",
        brief:
          "Select every element that has an <strong>href</strong> attribute, whatever its value.",
        html: `<a href="#">Menu</a>
<a>No link here</a>
<a href="#">Contact</a>
<button>Order</button>`,
        declarations: "color: #7c3aed;\ntext-decoration: underline;",
      },
      {
        id: "p06",
        difficulty: "medium",
        brief:
          "Select only the inputs whose <strong>type</strong> is exactly <strong>checkbox</strong>.",
        html: `<input type="text" />
<input type="checkbox" />
<input type="checkbox" />
<input type="radio" />`,
        declarations: "outline: 3px solid #16a34a;",
      },
      {
        id: "p07",
        difficulty: "hard",
        brief:
          "Select every link whose href <strong>starts with</strong> https, so the external ones stand out.",
        html: `<a href="https://example.com">External one</a>
<a href="about.html">Internal</a>
<a href="https://example.org">External two</a>`,
        declarations: "color: #db2777;\nfont-weight: 700;",
      },
      {
        id: "p08",
        difficulty: "hard",
        brief:
          "Select every list item that does <strong>not</strong> have the class <strong>done</strong>.",
        html: `<ul>
  <li class="done">Order beans</li>
  <li>Clean grinder</li>
  <li class="done">Restock cups</li>
  <li>Update menu</li>
</ul>`,
        declarations: "color: #b45309;\nfont-weight: 700;",
      },
      {
        id: "p09",
        difficulty: "hard",
        brief:
          "Select every third item in the list, so items three and six change.",
        html: `<ul>
  <li>One</li>
  <li>Two</li>
  <li>Three</li>
  <li>Four</li>
  <li>Five</li>
  <li>Six</li>
</ul>`,
        declarations: "background-color: #fef3c7;\npadding: 4px;",
      },
      {
        id: "p10",
        difficulty: "hard",
        brief:
          "Select the first item inside the menu list only. The other list's first item must stay as it is.",
        html: `<ul class="menu">
  <li>Coffee</li>
  <li>Tea</li>
</ul>
<ul>
  <li>Not the menu</li>
  <li>Also not</li>
</ul>`,
        declarations: "color: #0d9488;\nfont-weight: 700;",
      },
    ],
  },
];
