/**
 * HTML Debugger - Problem Library
 * 30 full HTML pages across 6 error categories, each about its own topic
 * so working through the set doesn't feel repetitive. Every page uses only
 * the beginner-approved tag set from CLAUDE.md in its <body>: div, p,
 * h1-h4, a, button, ul/li, input, img, strong. The <!DOCTYPE html>/
 * <html lang="en">/<head> shell stays correct boilerplate except where a
 * problem is specifically about an unclosed/mismatched <body> or <div>.
 *
 * Each buggy region in `html` is wrapped in a [[id: ...]] marker. A
 * marker's content must be whole, complete tag(s) and/or plain text,
 * never a tag split across the marker boundary - app.js's parseCodeMarkup
 * relies on this to render markers as plain escaped text (so a found and
 * an unfound error region look identical) without ever corrupting the
 * surrounding markup.
 *
 * `errors` lists, for each marker id, the title and explanation shown in
 * the mini toolbar and the Findings panel once that region is clicked.
 * difficulty ("easy"/"medium"/"hard") drives the panel-header badge only,
 * per CLAUDE.md - the title bar badge is always the category.
 */

const PROBLEM_CATEGORIES = [
  {
    id: "unclosed",
    name: "Unclosed Tags",
    color: "#4fc3f7",
    problems: [
      {
        id: "u1",
        title: "Ray's Skate Park",
        difficulty: "easy",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Ray's Skate Park</title>
</head>
<body>
  <h1>Ray's Skate Park</h1>
  [[e1:<p>]]Open every day from 10am to 8pm. Bring your own helmet.
  <h2>Ramps</h2>
  <p>We have three ramps: beginner, intermediate and pro.</p>
</body>
</html>`,
        errors: [
          {
            id: "e1",
            title: "Unclosed <p> tag",
            explain:
              "This <p> is never closed with </p>, so the browser has to guess where the paragraph ends, in this case swallowing the heading below it into the same paragraph.",
          },
        ],
      },
      {
        id: "u2",
        title: "Luna's Vintage Bookstore",
        difficulty: "easy",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Luna's Vintage Bookstore</title>
</head>
<body>
  <h1>Luna's Vintage Bookstore</h1>
  [[e1:<div>]]
    <h2>This Week's Picks</h2>
    <ul>
      <li>The Left Hand of Darkness</li>
      <li>A Wizard of Earthsea</li>
    </ul>
  <p>Visit us on Main Street, open Tuesday to Sunday.</p>
</body>
</html>`,
        errors: [
          {
            id: "e1",
            title: "Unclosed <div> tag",
            explain:
              "This <div> wraps the picks list but is never closed with </div>, so everything after it, including the closing paragraph, ends up nested inside it instead of sitting alongside it.",
          },
        ],
      },
      {
        id: "u3",
        title: "Milo's Robotics Club",
        difficulty: "medium",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Milo's Robotics Club</title>
</head>
<body>
  <h1>Milo's Robotics Club</h1>
  <p>We meet every Thursday after school in Room 12.</p>
  <h2>What to bring</h2>
  [[e1:<ul>]]
    <li>A notebook</li>
    <li>Safety glasses</li>
    <li>Your enthusiasm</li>
  <h2>Membership</h2>
  <p>[[e2:<strong>]]Membership is free for all students, no experience needed.</p>
</body>
</html>`,
        errors: [
          {
            id: "e1",
            title: "Unclosed <ul> tag",
            explain:
              "This <ul> list is never closed with </ul>, so the heading and paragraph after it end up nested inside the list instead of following it.",
          },
          {
            id: "e2",
            title: "Unclosed <strong> tag",
            explain:
              "This <strong> is opened but never closed with </strong>, so the bold styling never turns off and keeps applying to whatever text comes next.",
          },
        ],
      },
      {
        id: "u4",
        title: "The Riverside Farmers Market",
        difficulty: "medium",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>The Riverside Farmers Market</title>
</head>
<body>
  [[e1:<div>]]
    <h1>The Riverside Farmers Market</h1>
    <p>Fresh produce, local honey and handmade crafts every Saturday.</p>
  <h2>Find us</h2>
  <p>[[e2:<a href="https://example.com/map">]]Directions to the riverside car park</p>
  <h2>Stall bookings</h2>
  <p>Want a stall? Get in touch.</p>
  [[e3:<button>]]Contact the organisers
</body>
</html>`,
        errors: [
          {
            id: "e1",
            title: "Unclosed <div> tag",
            explain:
              "This <div> is never closed with </div>, so the rest of the page ends up nested inside it instead of following it.",
          },
          {
            id: "e2",
            title: "Unclosed <a> tag",
            explain:
              "This <a> link is never closed with </a>, so the paragraph text after it keeps being treated as part of the clickable link.",
          },
          {
            id: "e3",
            title: "Unclosed <button> tag",
            explain:
              "This <button> has no matching </button>, so its label text never has a defined end.",
          },
        ],
      },
      {
        id: "u5",
        title: "Meet Nova the Robot Dog",
        difficulty: "hard",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Meet Nova the Robot Dog</title>
</head>
<body>
  [[e1:<div>]]
    <h1>Meet Nova the Robot Dog</h1>
    <p>Nova is the museum's newest exhibit, a four-legged robot that can walk, sit and wave.</p>
    <h2>Show times</h2>
    [[e2:<ul>]]
      <li>11:00am</li>
      <li>1:30pm</li>
      <li>3:00pm</li>
    <h2>Fun facts</h2>
    [[e3:<p>]]Nova has 12 motors and a camera in each eye.
    <p>She took [[e4:<strong>]]two years to build.</p>
</body>
</html>`,
        errors: [
          {
            id: "e1",
            title: "Unclosed <div> tag",
            explain:
              "This <div> is never closed with </div>, so the entire rest of the page ends up nested inside it.",
          },
          {
            id: "e2",
            title: "Unclosed <ul> tag",
            explain:
              "This <ul> list is never closed with </ul>, so the heading after it gets nested inside the list.",
          },
          {
            id: "e3",
            title: "Unclosed <p> tag",
            explain:
              "This <p> is never closed with </p>, so the next paragraph ends up folded into the same one.",
          },
          {
            id: "e4",
            title: "Unclosed <strong> tag",
            explain:
              "This <strong> is opened but never closed with </strong>, so the bold styling keeps applying past where it should stop.",
          },
        ],
      },
    ],
  },

  {
    id: "mismatched",
    name: "Mismatched Tags",
    color: "#ba68c8",
    problems: [
      {
        id: "m1",
        title: "Ember's Pottery Studio",
        difficulty: "easy",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Ember's Pottery Studio</title>
</head>
<body>
  <h1>Ember's Pottery Studio</h1>
  <p>Beginner classes run every Monday evening from 6 to 8pm.[[e1:</div>]]
</body>
</html>`,
        errors: [
          {
            id: "e1",
            title: "Mismatched closing tag",
            explain:
              "This paragraph was opened with <p>, but it's closed with </div> instead of </p>. The closing tag has to match the tag it opened.",
          },
        ],
      },
      {
        id: "m2",
        title: "Zara's Nail Art Studio",
        difficulty: "easy",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Zara's Nail Art Studio</title>
</head>
<body>
  <h1>Zara's Nail Art Studio</h1>
  <p>Book a 45 minute appointment online.</p>
  <button>Book now[[e1:</a>]]
</body>
</html>`,
        errors: [
          {
            id: "e1",
            title: "Mismatched closing tag",
            explain:
              "This <button> is closed with </a> instead of </button>, so the tag it opened is never properly closed.",
          },
        ],
      },
      {
        id: "m3",
        title: "Finn's Comic Book Club",
        difficulty: "medium",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Finn's Comic Book Club</title>
</head>
<body>
  <div>
    <h1>Finn's Comic Book Club</h1>
    <p>New members welcome every second Friday.[[e1:</div>]]
  <h2>This month's pick[[e2:</h3>]]
  <p>The club is reading a classic superhero origin story.</p>
</body>
</html>`,
        errors: [
          {
            id: "e1",
            title: "Mismatched closing tag",
            explain: "This paragraph opens with <p> but closes with </div>, not </p>.",
          },
          {
            id: "e2",
            title: "Mismatched closing tag",
            explain:
              "This heading opens with <h2> but closes with </h3>. Even though both are headings, the closing tag has to match its own opening tag exactly.",
          },
        ],
      },
      {
        id: "m4",
        title: "Priya's Photography Walk",
        difficulty: "medium",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Priya's Photography Walk</title>
</head>
<body>
  <div>
    <h1>Priya's Photography Walk</h1>
    <p>Join us for a sunrise walk around the harbour, cameras welcome.</p>
    <h2>What to bring</h2>
    <ul>
      <li>A camera or phone[[e1:</p>]]
      <li>Comfortable shoes</li>
      <li>A water bottle</li>
    </ul>
    <p>Sign up using the link below.</p>
    <a href="https://example.com/signup">Reserve your spot[[e2:</button>]]
  [[e3:</p>]]
</body>
</html>`,
        errors: [
          {
            id: "e1",
            title: "Mismatched closing tag",
            explain: "This list item opens with <li> but closes with </p>.",
          },
          {
            id: "e2",
            title: "Mismatched closing tag",
            explain: "This link opens with <a> but closes with </button>.",
          },
          {
            id: "e3",
            title: "Mismatched closing tag",
            explain:
              "The <div> at the top of the page closes with </p> instead of </div>.",
          },
        ],
      },
      {
        id: "m5",
        title: "The Midnight Movie Marathon",
        difficulty: "hard",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>The Midnight Movie Marathon</title>
</head>
<body>
  <div>
    <h1>The Midnight Movie Marathon</h1>
    <p>Six films back to back, starting at 8pm sharp.[[e1:</div>]]
  <div>
    <h2>Line-up</h2>
    <ul>
      <li>A classic monster movie[[e2:</p>]]
      <li>Two sci-fi favourites</li>
      <li>A surprise final film</li>
    </ul>
  [[e3:</p>]]
  <p>Tickets include free popcorn and a blanket loan.</p>
  <button>Get tickets[[e4:</a>]]
</body>
</html>`,
        errors: [
          {
            id: "e1",
            title: "Mismatched closing tag",
            explain: "This paragraph opens with <p> but closes with </div>, not </p>.",
          },
          {
            id: "e2",
            title: "Mismatched closing tag",
            explain: "This list item opens with <li> but closes with </p>.",
          },
          {
            id: "e3",
            title: "Mismatched closing tag",
            explain: "This <div> closes with </p> instead of </div>.",
          },
          {
            id: "e4",
            title: "Mismatched closing tag",
            explain: "This <button> is closed with </a> instead of </button>.",
          },
        ],
      },
    ],
  },

  {
    id: "missing-attrs",
    name: "Missing Attributes",
    color: "#ffb74d",
    problems: [
      {
        id: "r1",
        title: "Oscar's Aquarium Adventure",
        difficulty: "easy",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Oscar's Aquarium Adventure</title>
</head>
<body>
  <h1>Oscar's Aquarium Adventure</h1>
  <p>Come face to face with sharks, turtles and jellyfish.</p>
  [[e1:<img src="shark-tank.jpg">]]
  <p>Open daily from 9am to 5pm.</p>
</body>
</html>`,
        errors: [
          {
            id: "e1",
            title: "Missing alt attribute",
            explain:
              "This <img> has no alt attribute, so screen readers have nothing to describe and nothing shows if the image fails to load.",
          },
        ],
      },
      {
        id: "r2",
        title: "Willow Creek Hiking Trail",
        difficulty: "easy",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Willow Creek Hiking Trail</title>
</head>
<body>
  <h1>Willow Creek Hiking Trail</h1>
  <p>A gentle 4km loop through the forest, suitable for beginners.</p>
  <p>Download the printable trail map before you go.</p>
  [[e1:<a>Trail map (PDF)</a>]]
</body>
</html>`,
        errors: [
          {
            id: "e1",
            title: "Missing href attribute",
            explain:
              "This <a> has no href, so it isn't actually a link. Without href it goes nowhere, no matter how it's styled.",
          },
        ],
      },
      {
        id: "r3",
        title: "The Corner Cafe Newsletter",
        difficulty: "medium",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>The Corner Cafe Newsletter</title>
</head>
<body>
  <h1>The Corner Cafe</h1>
  [[e1:<img src="cafe-front.jpg">]]
  <p>Sign up for our newsletter to hear about weekly specials.</p>
  <p>Enter your email address:</p>
  [[e2:<input placeholder="you@example.com">]]
  <button>Subscribe</button>
</body>
</html>`,
        errors: [
          {
            id: "e1",
            title: "Missing alt attribute",
            explain:
              "This <img> has no alt attribute, so it has no description for screen readers or for when it fails to load.",
          },
          {
            id: "e2",
            title: "Missing type attribute",
            explain:
              "This <input> has no type attribute, so the browser can't tell whether it should be a text box, an email field or something else, and just falls back to plain text.",
          },
        ],
      },
      {
        id: "r4",
        title: "Bright Futures Animal Shelter",
        difficulty: "medium",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Bright Futures Animal Shelter</title>
</head>
<body>
  <h1>Bright Futures Animal Shelter</h1>
  <p>Meet the dogs and cats looking for their forever homes.</p>
  [[e1:<img src="puppy.jpg">]]
  <p>Read more about our adoption process.</p>
  [[e2:<a>Adoption FAQ</a>]]
  <h2>Search for a pet</h2>
  <p>Enter a breed to search:</p>
  [[e3:<input placeholder="e.g. Labrador">]]
  <button>Search</button>
</body>
</html>`,
        errors: [
          {
            id: "e1",
            title: "Missing alt attribute",
            explain: "This <img> has no alt attribute describing the photo.",
          },
          {
            id: "e2",
            title: "Missing href attribute",
            explain: "This <a> has no href, so it isn't an actual link.",
          },
          {
            id: "e3",
            title: "Missing type attribute",
            explain:
              "This <input> has no type attribute, so the browser doesn't know what kind of field this should be.",
          },
        ],
      },
      {
        id: "r5",
        title: "Summit High Talent Show",
        difficulty: "hard",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Summit High Talent Show</title>
</head>
<body>
  <h1>Summit High Talent Show</h1>
  <p>Doors open at 6:30pm in the main hall. Acts start at 7pm sharp.</p>
  [[e1:<img src="stage-lights.jpg">]]
  <h2>Buy tickets</h2>
  <p>Tickets are $5 on the door, or book ahead online.</p>
  [[e2:<a>Book tickets online</a>]]
  <h2>Watch last year's show</h2>
  [[e3:<a>Last year's highlights video</a>]]
  <h2>Sign up to perform</h2>
  <p>Tell us your act name:</p>
  [[e4:<input placeholder="Your act name">]]
  <button>Submit entry</button>
</body>
</html>`,
        errors: [
          {
            id: "e1",
            title: "Missing alt attribute",
            explain: "This <img> has no alt attribute describing the photo.",
          },
          {
            id: "e2",
            title: "Missing href attribute",
            explain: "This <a> has no href, so the ticket link goes nowhere.",
          },
          {
            id: "e3",
            title: "Missing href attribute",
            explain: "This <a> has no href either, so the video link goes nowhere too.",
          },
          {
            id: "e4",
            title: "Missing type attribute",
            explain:
              "This <input> has no type attribute, so the browser doesn't know what kind of field this should be.",
          },
        ],
      },
    ],
  },

  {
    id: "nesting",
    name: "Broken Nesting",
    color: "#ff8a65",
    problems: [
      {
        id: "n1",
        title: "Green Thumb Garden Club",
        difficulty: "easy",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Green Thumb Garden Club</title>
</head>
<body>
  <h1>Green Thumb Garden Club</h1>
  <p>
    We meet every second Saturday to swap seeds and cuttings.
    [[e1:<div>Bring a spare pot if you have one.</div>]]
  </p>
</body>
</html>`,
        errors: [
          {
            id: "e1",
            title: "Block element inside a paragraph",
            explain:
              "A <div> is a block-level element and can't legally go inside a <p>. Paragraphs are only meant to hold inline content like text, links and <strong>.",
          },
        ],
      },
      {
        id: "n2",
        title: "Solar System Fun Facts",
        difficulty: "easy",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Solar System Fun Facts</title>
</head>
<body>
  <h1>Solar System Fun Facts</h1>
  <p>Here's one fact to start with:</p>
  [[e1:<li>Jupiter has at least 95 known moons.</li>]]
  <p>More facts coming soon.</p>
</body>
</html>`,
        errors: [
          {
            id: "e1",
            title: "<li> outside a <ul>",
            explain:
              "A <li> only makes sense as a direct child of a <ul> or <ol>. On its own like this, it has no list to belong to.",
          },
        ],
      },
      {
        id: "n3",
        title: "Level Up Gaming Lounge",
        difficulty: "medium",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Level Up Gaming Lounge</title>
</head>
<body>
  <h1>Level Up Gaming Lounge</h1>
  <p>
    Walk-ins welcome, but booking a console ahead saves you queuing.
    [[e1:<div>Consoles: PS5, Xbox and Switch.</div>]]
  </p>
  <p>Check out our tournament page for this month's prize pool.</p>
  <a href="https://example.com/tournaments">
    Tournaments
    [[e2:<a href="https://example.com/prizes">Prize pool</a>]]
  </a>
</body>
</html>`,
        errors: [
          {
            id: "e1",
            title: "Block element inside a paragraph",
            explain: "A <div> can't legally go inside a <p>.",
          },
          {
            id: "e2",
            title: "<a> nested inside another <a>",
            explain:
              "Links can't be nested inside other links. Browsers will only really respond to the outer one, and it's confusing for anyone using a screen reader.",
          },
        ],
      },
      {
        id: "n4",
        title: "City Youth Chess Tournament",
        difficulty: "medium",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>City Youth Chess Tournament</title>
</head>
<body>
  <h1>City Youth Chess Tournament</h1>
  <p>
    Open to players under 18, all skill levels welcome.
    [[e1:<div>Entry fee: $10, includes lunch.</div>]]
  </p>
  <p>Here's the schedule:</p>
  [[e2:<li>Round 1 starts at 9am</li>]]
  <button>
    Register now
    [[e3:<button>Save my seat</button>]]
  </button>
</body>
</html>`,
        errors: [
          {
            id: "e1",
            title: "Block element inside a paragraph",
            explain: "A <div> can't legally go inside a <p>.",
          },
          {
            id: "e2",
            title: "<li> outside a <ul>",
            explain: "This <li> has no <ul> or <ol> around it to belong to.",
          },
          {
            id: "e3",
            title: "<button> nested inside another <button>",
            explain:
              "Buttons can't be nested inside other buttons. Nested interactive elements confuse both the browser and anyone using a keyboard or screen reader to navigate.",
          },
        ],
      },
      {
        id: "n5",
        title: "Riverside Rowing Regatta",
        difficulty: "hard",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Riverside Rowing Regatta</title>
</head>
<body>
  <h1>Riverside Rowing Regatta</h1>
  <p>
    Crews from six schools race down the river this Saturday.
    [[e1:<div>Spectators welcome along the whole bank.</div>]]
  </p>
  <p>Race order:</p>
  [[e2:<li>Junior fours at 9am</li>]]
  <p>
    Full results will be posted here after the event.
    <a href="https://example.com/results">
      Results page
      [[e3:<a href="https://example.com/photos">Photo gallery</a>]]
    </a>
  </p>
  <button>
    Volunteer to help
    [[e4:<button>Marshal a checkpoint</button>]]
  </button>
</body>
</html>`,
        errors: [
          {
            id: "e1",
            title: "Block element inside a paragraph",
            explain: "A <div> can't legally go inside a <p>.",
          },
          {
            id: "e2",
            title: "<li> outside a <ul>",
            explain: "This <li> has no <ul> or <ol> around it to belong to.",
          },
          {
            id: "e3",
            title: "<a> nested inside another <a>",
            explain: "Links can't be nested inside other links.",
          },
          {
            id: "e4",
            title: "<button> nested inside another <button>",
            explain: "Buttons can't be nested inside other buttons.",
          },
        ],
      },
    ],
  },

  {
    id: "quoting",
    name: "Attribute & Quoting Mistakes",
    color: "#81c784",
    problems: [
      {
        id: "q1",
        title: "Blue Bike Rental Co.",
        difficulty: "easy",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Blue Bike Rental Co.</title>
</head>
<body>
  <h1>Blue Bike Rental Co.</h1>
  <p>Hourly and daily bike hire, helmets included.</p>
  [[e1:<img scr="bike-fleet.jpg" alt="Row of rental bikes">]]
</body>
</html>`,
        errors: [
          {
            id: "e1",
            title: "Misspelled attribute name",
            explain:
              "This should be src, not scr. Browsers only recognise the correctly spelled attribute name, so the image never loads.",
          },
        ],
      },
      {
        id: "q2",
        title: "Northside Basketball League",
        difficulty: "easy",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Northside Basketball League</title>
</head>
<body>
  <h1>Northside Basketball League</h1>
  <p>Sign-ups close Friday. Teams of five, all ages welcome.</p>
  [[e1:<a hraf="https://example.com/signup">Sign up here</a>]]
</body>
</html>`,
        errors: [
          {
            id: "e1",
            title: "Misspelled attribute name",
            explain:
              "This should be href, not hraf. With the attribute name misspelled, the browser doesn't recognise it as a link destination at all.",
          },
        ],
      },
      {
        id: "q3",
        title: "Maple Street Bakery",
        difficulty: "medium",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Maple Street Bakery</title>
</head>
<body>
  <h1 id="top">Maple Street Bakery</h1>
  <p>Fresh sourdough baked daily from 7am.</p>
  [[e1:<h2 id="top">Today's Menu</h2>]]
  [[e2:<img src=fresh bread.jpg alt="Loaves of sourdough">]]
  <p>Ask about our gluten-free options.</p>
</body>
</html>`,
        errors: [
          {
            id: "e1",
            title: "Duplicate id attribute",
            explain:
              'The id "top" is already used on the <h1> above. An id has to be unique on the page, or anything relying on it (styling, links, scripts) can\'t tell which element is meant.',
          },
          {
            id: "e2",
            title: "Unquoted attribute value with a space",
            explain:
              'src=fresh bread.jpg has no quotes, so the browser reads the value as stopping at the first space, "fresh", and treats "bread.jpg" as a second, meaningless attribute. Attribute values with spaces always need quotes.',
          },
        ],
      },
      {
        id: "q4",
        title: "Sunnydale Public Library",
        difficulty: "medium",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Sunnydale Public Library</title>
</head>
<body>
  <h1 id="main">Sunnydale Public Library</h1>
  <p>Open Monday to Saturday, 9am to 6pm.</p>
  [[e1:<img src="reading-room.jpg" alr="Students reading at long tables">]]
  [[e2:<h2 id="main">Study Rooms</h2>]]
  <p>Book a study room for up to four people.</p>
  [[e3:<a href=study rooms.html>Book a room</a>]]
</body>
</html>`,
        errors: [
          {
            id: "e1",
            title: "Misspelled attribute name",
            explain:
              "This should be alt, not alr. It's a genuine typo the browser won't recognise, so the image still has no description.",
          },
          {
            id: "e2",
            title: "Duplicate id attribute",
            explain: 'The id "main" is already used on the <h1> above.',
          },
          {
            id: "e3",
            title: "Unquoted attribute value with a space",
            explain:
              'href=study rooms.html has no quotes. The browser reads the link as pointing to just "study", and "rooms.html" gets treated as a second, meaningless attribute.',
          },
        ],
      },
      {
        id: "q5",
        title: "Horizon Youth Film Festival",
        difficulty: "hard",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Horizon Youth Film Festival</title>
</head>
<body>
  <h1 id="fest">Horizon Youth Film Festival</h1>
  <p>Submit a short film, five minutes or under, made by anyone under 18.</p>
  [[e1:<img scr="festival-poster.jpg" alt="Festival poster">]]
  [[e2:<h2 id="fest">How to enter</h2>]]
  <p>Fill in your details and upload a link to your film.</p>
  <p>Your name:</p>
  [[e3:<input typ="text">]]
  <p>Link to your film:</p>
  [[e4:<a href=my film link.com>Paste your link</a>]]
  <button>Submit entry</button>
</body>
</html>`,
        errors: [
          {
            id: "e1",
            title: "Misspelled attribute name",
            explain: "This should be src, not scr.",
          },
          {
            id: "e2",
            title: "Duplicate id attribute",
            explain: 'The id "fest" is already used on the <h1> above.',
          },
          {
            id: "e3",
            title: "Misspelled attribute name",
            explain: "This should be type, not typ.",
          },
          {
            id: "e4",
            title: "Unquoted attribute value with a space",
            explain:
              "href=my film link.com has no quotes, so only \"my\" is read as the value and the rest becomes meaningless extra attributes.",
          },
        ],
      },
    ],
  },

  {
    id: "a11y",
    name: "Accessibility Slips",
    color: "#f06292",
    problems: [
      {
        id: "y1",
        title: "Cascade Rock Climbing Gym",
        difficulty: "easy",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Cascade Rock Climbing Gym</title>
</head>
<body>
  <h1>Cascade Rock Climbing Gym</h1>
  <p>New climbers get a free induction session with any day pass.</p>
  [[e1:<a href="https://example.com/waiver" target="_blank">Read the safety waiver</a>]]
</body>
</html>`,
        errors: [
          {
            id: "e1",
            title: 'target="_blank" without rel="noopener"',
            explain:
              'Opening a link in a new tab with target="_blank" lets that new page access and redirect the original tab unless it\'s paired with rel="noopener". It\'s a small addition that closes a real security gap.',
          },
        ],
      },
      {
        id: "y2",
        title: "Pixel Perfect Arcade",
        difficulty: "easy",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Pixel Perfect Arcade</title>
</head>
<body>
  <h1>Pixel Perfect Arcade</h1>
  <p>Over 40 classic and modern machines, all on free play.</p>
  [[e1:<a href="#">See our machine list</a>]]
</body>
</html>`,
        errors: [
          {
            id: "e1",
            title: 'Link goes nowhere (href="#")',
            explain:
              'href="#" doesn\'t point anywhere real, it just jumps to the top of the same page. For an actual destination like a machine list, this needs a real address.',
          },
        ],
      },
      {
        id: "y3",
        title: "Willowbrook Community Choir",
        difficulty: "medium",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Willowbrook Community Choir</title>
</head>
<body>
  <h1>Willowbrook Community Choir</h1>
  <p>All voice parts welcome, no audition needed.</p>
  [[e1:<button></button>]]
  <p>Read about our upcoming spring concert.</p>
  [[e2:<a href="https://example.com/concert" target="_blank">Concert details</a>]]
</body>
</html>`,
        errors: [
          {
            id: "e1",
            title: "Button with no visible text",
            explain:
              "This <button> has nothing inside it, no label at all, so nobody, sighted or using a screen reader, can tell what it does.",
          },
          {
            id: "e2",
            title: 'target="_blank" without rel="noopener"',
            explain:
              'This link opens in a new tab but has no rel="noopener", which is a security gap for links that open new tabs.',
          },
        ],
      },
      {
        id: "y4",
        title: "Northgate Model Train Society",
        difficulty: "medium",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Northgate Model Train Society</title>
</head>
<body>
  <h1>Northgate Model Train Society</h1>
  <p>Our layout is open to the public on the last Sunday of every month.</p>
  [[e1:<a href="#">Visit our layout gallery</a>]]
  <p>New members always welcome.</p>
  [[e2:<button></button>]]
  <p>Read our full history, written by founding members.</p>
  [[e3:<a href="https://example.com/history" target="_blank">Our history</a>]]
</body>
</html>`,
        errors: [
          {
            id: "e1",
            title: 'Link goes nowhere (href="#")',
            explain: 'href="#" doesn\'t point anywhere real.',
          },
          {
            id: "e2",
            title: "Button with no visible text",
            explain: "This <button> has no label at all.",
          },
          {
            id: "e3",
            title: 'target="_blank" without rel="noopener"',
            explain:
              'This link opens in a new tab but has no rel="noopener".',
          },
        ],
      },
      {
        id: "y5",
        title: "Starlight Drive-In Cinema",
        difficulty: "hard",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Starlight Drive-In Cinema</title>
</head>
<body>
  <h1>Starlight Drive-In Cinema</h1>
  <p>Gates open at 7pm, film starts once the sun goes down.</p>
  [[e1:<a href="#">Tonight's double feature</a>]]
  <p>Buy tickets in advance to guarantee a spot.</p>
  [[e2:<a href="https://example.com/tickets" target="_blank">Buy tickets</a>]]
  <p>Bring your own snacks or visit the concession stand.</p>
  [[e3:<button></button>]]
  <p>Read visitor reviews from last season.</p>
  [[e4:<a href="https://example.com/reviews" target="_blank">Read reviews</a>]]
</body>
</html>`,
        errors: [
          {
            id: "e1",
            title: 'Link goes nowhere (href="#")',
            explain: 'href="#" doesn\'t point anywhere real.',
          },
          {
            id: "e2",
            title: 'target="_blank" without rel="noopener"',
            explain: 'This ticket link opens in a new tab but has no rel="noopener".',
          },
          {
            id: "e3",
            title: "Button with no visible text",
            explain: "This <button> has no label at all.",
          },
          {
            id: "e4",
            title: 'target="_blank" without rel="noopener"',
            explain: 'This reviews link opens in a new tab but has no rel="noopener".',
          },
        ],
      },
    ],
  },
];
