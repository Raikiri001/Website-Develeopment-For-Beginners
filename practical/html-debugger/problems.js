/**
 * HTML Debugger - Problem Library (plain metadata only).
 *
 * The actual page markup (with buggy regions marked) and the error
 * title/explanation text live in the encrypted answers.json, decrypted by
 * app.js at runtime - NOT here. A plaintext "here's exactly what's wrong
 * and why" is the whole answer key, so it can't sit in a file a learner
 * can view-source. See scripts/encrypt-answers.js and
 * practical/html-debugger/answers.source.js (gitignored - that's where you
 * actually edit problem content) for how to regenerate answers.json after
 * a change.
 *
 * Sidebar categories are difficulty TIERS, not bug types: each page mixes
 * several different kinds of mistake (not "every bug on this page is the
 * same type"), so grouping by bug type would itself tell a learner what to
 * look for before they've read a line of code. Tiers pull from a growing
 * pool of bug types and mix more of them together as they go:
 *   Beginner     (8 pages): unclosed tags + missing attributes - 2 bugs/page
 *   Intermediate (8 pages): + mismatched tags                 - 3 bugs/page
 *   Advanced     (7 pages): + broken nesting                  - 4 bugs/page
 *   Expert       (7 pages): + quoting mistakes, a11y slips     - 5 bugs/page
 */

const PROBLEM_TIERS = [
  {
    id: "beginner",
    name: "Beginner",
    color: "#16a34a",
    problems: [
      { id: "b1", title: "Ray's Skate Park" },
      { id: "b2", title: "Luna's Vintage Bookstore" },
      { id: "b3", title: "Oscar's Aquarium Adventure" },
      { id: "b4", title: "Willow Creek Hiking Trail" },
      { id: "b5", title: "Cascade Rock Climbing Gym" },
      { id: "b6", title: "Pixel Perfect Arcade" },
      { id: "b7", title: "Blue Bike Rental Co." },
      { id: "b8", title: "Northside Basketball League" },
    ],
  },
  {
    id: "intermediate",
    name: "Intermediate",
    color: "#d97706",
    problems: [
      { id: "i1", title: "Milo's Robotics Club" },
      { id: "i2", title: "The Corner Cafe Newsletter" },
      { id: "i3", title: "Ember's Pottery Studio" },
      { id: "i4", title: "Zara's Nail Art Studio" },
      { id: "i5", title: "Green Thumb Garden Club" },
      { id: "i6", title: "Solar System Fun Facts" },
      { id: "i7", title: "Willowbrook Community Choir" },
      { id: "i8", title: "Northgate Model Train Society" },
    ],
  },
  {
    id: "advanced",
    name: "Advanced",
    color: "#f97316",
    problems: [
      { id: "a1", title: "The Riverside Farmers Market" },
      { id: "a2", title: "Bright Futures Animal Shelter" },
      { id: "a3", title: "Finn's Comic Book Club" },
      { id: "a4", title: "Level Up Gaming Lounge" },
      { id: "a5", title: "Maple Street Bakery" },
      { id: "a6", title: "City Youth Chess Tournament" },
      { id: "a7", title: "Sunnydale Public Library" },
    ],
  },
  {
    id: "expert",
    name: "Expert",
    color: "#dc2626",
    problems: [
      { id: "x1", title: "Meet Nova the Robot Dog" },
      { id: "x2", title: "Summit High Talent Show" },
      { id: "x3", title: "Priya's Photography Walk" },
      { id: "x4", title: "The Midnight Movie Marathon" },
      { id: "x5", title: "Riverside Rowing Regatta" },
      { id: "x6", title: "Horizon Youth Film Festival" },
      { id: "x7", title: "Starlight Drive-In Cinema" },
    ],
  },
];
