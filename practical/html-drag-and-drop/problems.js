/**
 * HTML Structure Trainer - Problem Library
 * 43 problems across 6 categories, ordered to match how the class covers
 * HTML: boilerplate, tags/elements/syntax, text/headings, lists/nesting,
 * links/images/attributes, then semantic layout.
 *
 * Solutions are stored in solutions.json as encrypted strings.
 * This file contains only problem metadata (titles, descriptions, hints).
 */

const PROBLEM_CATEGORIES = [
  {
    id: "boilerplate",
    name: "Boilerplate",
    icon: "",
    color: "#4fc3f7",
    problems: [
      {
        id: "bp1",
        title: "The Empty Page",
        description:
          "Create the smallest valid HTML page: a doctype, an html tag, a head with a title, and an empty body.",
        hint: "Every HTML page starts with <!DOCTYPE html>, then <html>, then a <head> containing a <title>. The <body> can be empty, but it still needs opening and closing tags.",
      },
      {
        id: "bp2",
        title: "Hello World Page",
        description:
          "Create a simple HTML page that displays 'Hello World' as a heading.",
        hint: "Every HTML page starts with <!DOCTYPE html> and wraps content in <html> tags.",
      },
      {
        id: "bp3",
        title: "Character Encoding",
        description:
          "Add a character encoding meta tag to the head, then show a heading in the body.",
        hint: 'A <meta charset="UTF-8"> tag goes inside <head>, usually as the very first line, before <title>.',
      },
      {
        id: "bp4",
        title: "Leave a Comment",
        description:
          "Create a page with an HTML comment above a heading, explaining what the heading is for.",
        hint: "Comments start with <!-- and end with -->. Browsers ignore them completely; they're notes for people reading the code.",
      },
      {
        id: "bp5",
        title: "Setting the Language",
        description:
          "Create a page written in French, with the lang attribute set correctly and a French heading.",
        hint: 'The lang attribute on <html> tells the browser (and screen readers) what language the page is written in, e.g. lang="fr" for French.',
      },
    ],
  },
  {
    id: "elements",
    name: "Tags, Elements & Syntax",
    icon: "",
    color: "#4dd0e1",
    problems: [
      {
        id: "el1",
        title: "A Simple Div",
        description: "Create a page with a div wrapping a single paragraph.",
        hint: "<div> is a generic container. Like most tags, it needs a matching opening <div> and closing </div>.",
      },
      {
        id: "el2",
        title: "Nested Boxes",
        description:
          "Create a page with a div inside another div, with a paragraph inside the innermost one.",
        hint: "Tags close in the reverse order they open, the innermost tag closes first.",
      },
      {
        id: "el3",
        title: "Line Break Page",
        description:
          "Create a page with two lines of text separated by a line break.",
        hint: "Use <br> to create a line break within a paragraph. <br> is a void element, it never gets a closing tag.",
      },
      {
        id: "el4",
        title: "Horizontal Rule",
        description:
          "Create a page with a heading, a horizontal rule, and a paragraph.",
        hint: "The <hr> tag marks a thematic break and is usually rendered as a horizontal line. Like <br>, it's a void element with no closing tag.",
      },
      {
        id: "el5",
        title: "Three Nested Divs",
        description:
          "Create three divs nested inside each other, three levels deep, with a paragraph at the centre.",
        hint: "Keep track of how many divs you've opened so you close exactly the same number, in reverse order.",
      },
      {
        id: "el6",
        title: "Mixed Void and Paired Tags",
        description:
          "Create a page with a heading, a horizontal rule, then a paragraph containing a line break, in that order.",
        hint: "<hr> and <br> are void elements with no closing tag. <h1> and <p> are paired elements that need both an opening and a closing tag.",
      },
    ],
  },
  {
    id: "text",
    name: "Text & Headings",
    icon: "",
    color: "#ffd54f",
    problems: [
      {
        id: "tx1",
        title: "Paragraph Page",
        description:
          "Create an HTML page with a heading and a paragraph of text.",
        hint: "Headings use <h1> and paragraphs use <p> tags. Both go inside <body>.",
      },
      {
        id: "tx2",
        title: "Multiple Headings",
        description:
          "Build a page with an h1 heading, an h2 subheading, and a paragraph.",
        hint: "Headings go from <h1> (largest) to <h6> (smallest). They go inside <body>.",
      },
      {
        id: "tx3",
        title: "Bold & Italic",
        description:
          "Create a page with bold and italic text inside a paragraph.",
        hint: "Use <strong> for bold and <em> for italic text inside a <p> tag.",
      },
      {
        id: "tx4",
        title: "All Heading Levels",
        description:
          "Create a page with four headings, from h1 down to h4, each labelled with its own level.",
        hint: "Headings go from <h1> (largest and most important) down to smaller levels like <h4>. Use them in order from largest to smallest.",
      },
      {
        id: "tx5",
        title: "Nested Emphasis",
        description:
          "Create a paragraph where a bold phrase also contains an italic word inside it.",
        hint: "You can nest inline tags like <em> inside <strong> (or the other way around) to combine both effects on the same text.",
      },
      {
        id: "tx6",
        title: "Headings and Paragraphs",
        description:
          "Create a page with an h1 followed by a paragraph, then an h2 followed by another paragraph.",
        hint: "Repeat the heading-then-paragraph pattern for each new part of the page.",
      },
    ],
  },
  {
    id: "lists",
    name: "Lists & Nesting",
    icon: "",
    color: "#81c784",
    problems: [
      {
        id: "ls1",
        title: "Unordered List",
        description:
          "Create a page with a heading and an unordered (bulleted) list of three fruits.",
        hint: "Unordered lists use <ul> with <li> items inside.",
      },
      {
        id: "ls2",
        title: "Ordered List",
        description:
          "Create a page with a numbered list of three steps to make tea.",
        hint: "Ordered lists use <ol> instead of <ul>.",
      },
      {
        id: "ls3",
        title: "Nested List",
        description: "Create a list where one item contains a sub-list.",
        hint: "You can put a <ul> inside an <li> to create a nested list.",
      },
      {
        id: "ls4",
        title: "Definition List",
        description:
          "Create a definition list with two HTML terms and their definitions.",
        hint: "Definition lists use <dl>, with <dt> for terms and <dd> for definitions.",
      },
      {
        id: "ls5",
        title: "Mixed Lists",
        description:
          "Create a page with both an ordered and unordered list under different headings.",
        hint: "You can use multiple list types on one page. Each goes under its own heading.",
      },
      {
        id: "ls6",
        title: "Checklist Style",
        description:
          "Create an unordered list styled as a task checklist with four items.",
        hint: "Even without CSS, the structure is a <ul> with <li> items representing tasks.",
      },
      {
        id: "ls7",
        title: "Nested Ordered List",
        description:
          "Create a numbered list of steps, where one step has three numbered sub-steps.",
        hint: "Just like <ul>, you can nest an <ol> inside an <li> to create numbered sub-steps.",
      },
    ],
  },
  {
    id: "links-attrs",
    name: "Links, Images & Attributes",
    icon: "",
    color: "#ffb74d",
    problems: [
      {
        id: "la1",
        title: "Link to Website",
        description:
          "Create a page with a clickable link to an external website.",
        hint: "Links use the <a> tag with an href attribute for the URL.",
      },
      {
        id: "la2",
        title: "Image Tag",
        description: "Create a page that displays an image with alt text.",
        hint: "Images use <img> with src for the path and alt for description.",
      },
      {
        id: "la3",
        title: "Styled Paragraph",
        description:
          "Create a paragraph with an inline style that sets the text colour to blue.",
        hint: "Inline styles use the style attribute directly on the element.",
      },
      {
        id: "la4",
        title: "ID and Class",
        description:
          "Create a div with an id and a paragraph with a class attribute.",
        hint: "The id attribute uniquely identifies an element; class can be shared by many.",
      },
      {
        id: "la5",
        title: "Link with Target",
        description:
          "Create a link that opens in a new tab using the target attribute.",
        hint: 'Use target="_blank" to open a link in a new tab, and pair it with rel="noopener" so the new tab cannot access the original page.',
      },
      {
        id: "la6",
        title: "Image with Size",
        description: "Create an image tag with width and height attributes.",
        hint: "You can set width and height directly as attributes on the <img> tag.",
      },
      {
        id: "la7",
        title: "Image as a Link",
        description:
          "Create a page with an image that becomes a clickable link to an external website.",
        hint: "You can put an <img> inside an <a> tag to make the whole image clickable.",
      },
    ],
  },
  {
    id: "semantic",
    name: "Semantic Layout",
    icon: "",
    color: "#ce93d8",
    problems: [
      {
        id: "sm1",
        title: "Header & Footer",
        description:
          "Build a page with a semantic header containing a nav, and a footer.",
        hint: "Use <header>, <nav>, and <footer> for semantic structure.",
      },
      {
        id: "sm2",
        title: "Article Page",
        description:
          "Create a page with a main area containing an article with a heading and paragraph.",
        hint: "Use <main> for primary content and <article> for self-contained content.",
      },
      {
        id: "sm3",
        title: "Section Layout",
        description:
          "Create a page with two sections, each having a heading and paragraph.",
        hint: "The <section> tag groups related content together.",
      },
      {
        id: "sm4",
        title: "Aside Content",
        description:
          "Create a page with a main article and an aside for related content.",
        hint: "<aside> is used for content only loosely related to the main content.",
      },
      {
        id: "sm5",
        title: "Figure & Caption",
        description:
          "Create a page using <figure> and <figcaption> for an image with a caption.",
        hint: "Wrap <img> in <figure> and add <figcaption> for a caption.",
      },
      {
        id: "sm6",
        title: "Nav with List",
        description:
          "Create a navigation bar using an unordered list of links inside a nav element.",
        hint: "Navigation menus are typically <nav> containing a <ul> of <li><a> items.",
      },
      {
        id: "sm7",
        title: "Full Page Layout",
        description:
          "Build a complete page with header, nav, main content, and footer.",
        hint: "A full layout uses header with nav, then main for content, then footer.",
      },
      {
        id: "sm8",
        title: "Table Structure",
        description: "Build a simple 2-column, 2-row table with headers.",
        hint: "Tables use <table>, <tr> for rows, <th> for headers, and <td> for data cells.",
      },
      {
        id: "sm9",
        title: "Table with Head & Body",
        description:
          "Build a table using <thead> and <tbody> for a 3-column, 2-row data table.",
        hint: "Use <thead> for header rows and <tbody> for data rows inside <table>.",
      },
      {
        id: "sm10",
        title: "Simple Form",
        description:
          "Build a form with a text input, email input, and a submit button.",
        hint: "Forms use <form> with <label> and <input> pairs. Add a <button> to submit.",
      },
      {
        id: "sm11",
        title: "Complete Blog Post",
        description:
          "Build a full blog page: header with nav, main with article (heading, paragraphs, image), and footer.",
        hint: "Nest elements carefully: header with nav, main with article and content, then footer.",
      },
      {
        id: "sm12",
        title: "Full Website",
        description:
          "Build a complete website with header, nav list, main with two sections, aside, and footer.",
        hint: "This combines everything: semantic elements, lists, links, and proper nesting.",
      },
    ],
  },
];
