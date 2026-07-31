/**
 * HTML Structure Trainer - Problem Library
 * 30 problems across 5 difficulty tiers.
 *
 * Solutions are stored in solutions.json as encrypted strings.
 * This file contains only problem metadata (titles, descriptions, hints).
 */

const PROBLEM_CATEGORIES = [
  {
    id: "basics",
    name: "Basics",
    icon: "",
    color: "#4fc3f7",
    problems: [
      {
        id: "b1",
        title: "Hello World Page",
        description:
          "Create a simple HTML page that displays 'Hello World' as a heading.",
        hint: "Every HTML page starts with <!DOCTYPE html> and wraps content in <html> tags.",
      },
      {
        id: "b2",
        title: "Paragraph Page",
        description:
          "Create an HTML page with a heading and a paragraph of text.",
        hint: "Headings use <h1> and paragraphs use <p> tags. Both go inside <body>.",
      },
      {
        id: "b3",
        title: "Multiple Headings",
        description:
          "Build a page with an h1 heading, an h2 subheading, and a paragraph.",
        hint: "Headings go from <h1> (largest) to <h6> (smallest). They go inside <body>.",
      },
      {
        id: "b4",
        title: "Bold & Italic",
        description:
          "Create a page with bold and italic text inside a paragraph.",
        hint: "Use <strong> for bold and <em> for italic text inside a <p> tag.",
      },
      {
        id: "b5",
        title: "Line Break Page",
        description:
          "Create a page with two lines of text separated by a line break.",
        hint: "Use <br> to create a line break within a paragraph.",
      },
      {
        id: "b6",
        title: "Horizontal Rule",
        description:
          "Create a page with a heading, a horizontal rule, and a paragraph.",
        hint: "The <hr> tag marks a thematic break and is usually rendered as a horizontal line.",
      },
    ],
  },
  {
    id: "lists",
    name: "Lists",
    icon: "",
    color: "#81c784",
    problems: [
      {
        id: "l1",
        title: "Unordered List",
        description:
          "Create a page with a heading and an unordered (bulleted) list of three fruits.",
        hint: "Unordered lists use <ul> with <li> items inside.",
      },
      {
        id: "l2",
        title: "Ordered List",
        description:
          "Create a page with a numbered list of three steps to make tea.",
        hint: "Ordered lists use <ol> instead of <ul>.",
      },
      {
        id: "l3",
        title: "Nested List",
        description: "Create a list where one item contains a sub-list.",
        hint: "You can put a <ul> inside an <li> to create a nested list.",
      },
      {
        id: "l4",
        title: "Definition List",
        description:
          "Create a definition list with two HTML terms and their definitions.",
        hint: "Definition lists use <dl>, with <dt> for terms and <dd> for definitions.",
      },
      {
        id: "l5",
        title: "Mixed Lists",
        description:
          "Create a page with both an ordered and unordered list under different headings.",
        hint: "You can use multiple list types on one page. Each goes under its own heading.",
      },
      {
        id: "l6",
        title: "Checklist Style",
        description:
          "Create an unordered list styled as a task checklist with four items.",
        hint: "Even without CSS, the structure is a <ul> with <li> items representing tasks.",
      },
    ],
  },
  {
    id: "attributes",
    name: "Attributes",
    icon: "",
    color: "#ffb74d",
    problems: [
      {
        id: "a1",
        title: "Link to Website",
        description:
          "Create a page with a clickable link to an external website.",
        hint: "Links use the <a> tag with an href attribute for the URL.",
      },
      {
        id: "a2",
        title: "Image Tag",
        description: "Create a page that displays an image with alt text.",
        hint: "Images use <img> with src for the path and alt for description.",
      },
      {
        id: "a3",
        title: "Styled Paragraph",
        description:
          "Create a paragraph with an inline style that sets the text colour to blue.",
        hint: "Inline styles use the style attribute directly on the element.",
      },
      {
        id: "a4",
        title: "ID and Class",
        description:
          "Create a div with an id and a paragraph with a class attribute.",
        hint: "The id attribute uniquely identifies an element; class can be shared by many.",
      },
      {
        id: "a5",
        title: "Link with Target",
        description:
          "Create a link that opens in a new tab using the target attribute.",
        hint: 'Use target="_blank" to open a link in a new tab, and pair it with rel="noopener" so the new tab cannot access the original page.',
      },
      {
        id: "a6",
        title: "Image with Size",
        description: "Create an image tag with width and height attributes.",
        hint: "You can set width and height directly as attributes on the <img> tag.",
      },
    ],
  },
  {
    id: "semantic",
    name: "Semantic Layouts",
    icon: "",
    color: "#ce93d8",
    problems: [
      {
        id: "s1",
        title: "Header & Footer",
        description:
          "Build a page with a semantic header containing a nav, and a footer.",
        hint: "Use <header>, <nav>, and <footer> for semantic structure.",
      },
      {
        id: "s2",
        title: "Article Page",
        description:
          "Create a page with a main area containing an article with a heading and paragraph.",
        hint: "Use <main> for primary content and <article> for self-contained content.",
      },
      {
        id: "s3",
        title: "Section Layout",
        description:
          "Create a page with two sections, each having a heading and paragraph.",
        hint: "The <section> tag groups related content together.",
      },
      {
        id: "s4",
        title: "Aside Content",
        description:
          "Create a page with a main article and an aside for related content.",
        hint: "<aside> is used for content only loosely related to the main content.",
      },
      {
        id: "s5",
        title: "Full Page Layout",
        description:
          "Build a complete page with header, nav, main content, and footer.",
        hint: "A full layout uses header with nav, then main for content, then footer.",
      },
      {
        id: "s6",
        title: "Figure & Caption",
        description:
          "Create a page using <figure> and <figcaption> for an image with a caption.",
        hint: "Wrap <img> in <figure> and add <figcaption> for a caption.",
      },
    ],
  },
  {
    id: "advanced",
    name: "Advanced Nesting",
    icon: "",
    color: "#ef5350",
    problems: [
      {
        id: "x1",
        title: "Table Structure",
        description: "Build a simple 2-column, 2-row table with headers.",
        hint: "Tables use <table>, <tr> for rows, <th> for headers, and <td> for data cells.",
      },
      {
        id: "x2",
        title: "Simple Form",
        description:
          "Build a form with a text input, email input, and a submit button.",
        hint: "Forms use <form> with <label> and <input> pairs. Add a <button> to submit.",
      },
      {
        id: "x3",
        title: "Nav with List",
        description:
          "Create a navigation bar using an unordered list of links inside a nav element.",
        hint: "Navigation menus are typically <nav> containing a <ul> of <li><a> items.",
      },
      {
        id: "x4",
        title: "Complete Blog Post",
        description:
          "Build a full blog page: header with nav, main with article (heading, paragraphs, image), and footer.",
        hint: "Nest elements carefully: header with nav, main with article and content, then footer.",
      },
      {
        id: "x5",
        title: "Table with Head & Body",
        description:
          "Build a table using <thead> and <tbody> for a 3-column, 2-row data table.",
        hint: "Use <thead> for header rows and <tbody> for data rows inside <table>.",
      },
      {
        id: "x6",
        title: "Full Website",
        description:
          "Build a complete website with header, nav list, main with two sections, aside, and footer.",
        hint: "This combines everything: semantic elements, lists, links, and proper nesting.",
      },
    ],
  },
];
