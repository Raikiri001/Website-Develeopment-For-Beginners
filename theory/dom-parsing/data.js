/**
 * DOM/CSSOM Parsing Visualiser - Sample Document Data
 *
 * This file only holds the data model for the demo page the visualiser
 * steps through: the HTML elements, the CSS rules, and the source lines
 * shown in each "IDE" panel. All interactive behaviour lives in app.js.
 */

// A minimal blog-style page: header/nav, two content sections with a list
// and a table, and a footer. Each entry is one DOM node.
const ELEMENTS_DATA = {
  html: { tag: "html", parentId: null },
  head: { tag: "head", parentId: "html" },
  "meta-char": {
    tag: "meta",
    parentId: "head",
    attrs: 'charset="UTF-8"',
    selfClosing: true,
  },
  "meta-view": {
    tag: "meta",
    parentId: "head",
    attrs: 'name="viewport" content="width=device-width, initial-scale=1.0"',
    selfClosing: true,
  },
  title: {
    tag: "title",
    parentId: "head",
    text: "How Browsers Parse HTML",
  },
  "link-css": {
    tag: "link",
    parentId: "head",
    attrs: 'rel="stylesheet" href="style.css"',
    selfClosing: true,
  },
  body: { tag: "body", parentId: "html" },

  header: { tag: "header", parentId: "body" },
  h1: { tag: "h1", parentId: "header", text: "How Browsers Parse HTML" },
  "p-head": {
    tag: "p",
    parentId: "header",
    text: "Browsers read HTML from top to bottom, converting raw bytes into a visual page through three stages: tokenisation, DOM construction, and rendering.",
  },

  main: { tag: "main", parentId: "body" },

  section1: { tag: "section", parentId: "main" },
  "h2-1": {
    tag: "h2",
    parentId: "section1",
    text: "The 3 Parsing Stages",
  },
  p1: {
    tag: "p",
    parentId: "section1",
    text: "The parser works in sequence, each stage feeds into the next.",
  },
  ul: { tag: "ul", parentId: "section1" },
  li1: {
    tag: "li",
    parentId: "ul",
    text: "Tokenisation: tags and text are identified as tokens",
  },
  li2: {
    tag: "li",
    parentId: "ul",
    text: "DOM construction: tokens become a tree of nodes",
  },
  li3: {
    tag: "li",
    parentId: "ul",
    text: "Rendering: the tree is laid out and painted to screen",
  },

  section2: { tag: "section", parentId: "main" },
  "h2-2": {
    tag: "h2",
    parentId: "section2",
    text: "Token Types the Parser Produces",
  },
  table: { tag: "table", parentId: "section2" },
  thead: { tag: "thead", parentId: "table" },
  "tr-head": { tag: "tr", parentId: "thead" },
  th1: { tag: "th", parentId: "tr-head", text: "Token Type" },
  th2: { tag: "th", parentId: "tr-head", text: "Example" },
  th3: { tag: "th", parentId: "tr-head", text: "What it does" },
  tbody: { tag: "tbody", parentId: "table" },

  "tr-body1": { tag: "tr", parentId: "tbody" },
  "td1-1": { tag: "td", parentId: "tr-body1", text: "Start tag" },
  "td1-2": { tag: "td", parentId: "tr-body1", text: "&lt;p&gt;" },
  "td1-3": {
    tag: "td",
    parentId: "tr-body1",
    text: "Opens a new element node",
  },

  "tr-body2": { tag: "tr", parentId: "tbody" },
  "td2-1": { tag: "td", parentId: "tr-body2", text: "End tag" },
  "td2-2": { tag: "td", parentId: "tr-body2", text: "&lt;/p&gt;" },
  "td2-3": {
    tag: "td",
    parentId: "tr-body2",
    text: "Closes the current element",
  },

  "tr-body3": { tag: "tr", parentId: "tbody" },
  "td3-1": { tag: "td", parentId: "tr-body3", text: "Character" },
  "td3-2": { tag: "td", parentId: "tr-body3", text: "Hello world" },
  "td3-3": {
    tag: "td",
    parentId: "tr-body3",
    text: "Becomes a text node in the DOM",
  },

  "tr-body4": { tag: "tr", parentId: "tbody" },
  "td4-1": { tag: "td", parentId: "tr-body4", text: "Void element" },
  "td4-2": { tag: "td", parentId: "tr-body4", text: "&lt;meta&gt;" },
  "td4-3": {
    tag: "td",
    parentId: "tr-body4",
    text: "Inserted with no closing tag needed",
  },

  footer: { tag: "footer", parentId: "body" },
  "p-foot": { tag: "p", parentId: "footer" },
  small: {
    tag: "small",
    parentId: "p-foot",
    text: "Parsed top to bottom, one token at a time.",
  },
};

// The lines shown in the "1. Tokenisation" HTML panel, in source order.
// Each entry that has an `elId` corresponds 1:1 with a node in ELEMENTS_DATA.
const IDE_LINES = [
  { type: "doctype", text: "<!DOCTYPE html>", indent: 0 },
  { type: "open", elId: "html", tag: "html", indent: 0 },
  { type: "open", elId: "head", tag: "head", indent: 1 },
  {
    type: "self-close",
    elId: "meta-char",
    tag: "meta",
    indent: 2,
    attrs: 'charset="UTF-8"',
  },
  {
    type: "self-close",
    elId: "meta-view",
    tag: "meta",
    indent: 2,
    attrs: 'name="viewport" content="..."',
  },
  {
    type: "inline",
    elId: "title",
    tag: "title",
    indent: 2,
    text: "How Browsers Parse HTML",
  },
  {
    type: "self-close",
    elId: "link-css",
    tag: "link",
    indent: 2,
    attrs: 'rel="stylesheet" href="style.css"',
  },
  { type: "close", elId: "head", tag: "head", indent: 1 },
  { type: "open", elId: "body", tag: "body", indent: 1 },

  { type: "open", elId: "header", tag: "header", indent: 2 },
  {
    type: "inline",
    elId: "h1",
    tag: "h1",
    indent: 3,
    text: "How Browsers Parse HTML",
  },
  {
    type: "inline",
    elId: "p-head",
    tag: "p",
    indent: 3,
    text: "Browsers read HTML from top to bottom...",
  },
  { type: "close", elId: "header", tag: "header", indent: 2 },

  { type: "open", elId: "main", tag: "main", indent: 2 },

  { type: "open", elId: "section1", tag: "section", indent: 3 },
  {
    type: "inline",
    elId: "h2-1",
    tag: "h2",
    indent: 4,
    text: "The 3 Parsing Stages",
  },
  {
    type: "inline",
    elId: "p1",
    tag: "p",
    indent: 4,
    text: "Each stage feeds into the next...",
  },
  { type: "open", elId: "ul", tag: "ul", indent: 4 },
  {
    type: "inline",
    elId: "li1",
    tag: "li",
    indent: 5,
    text: "Tokenisation: tags and text...",
  },
  {
    type: "inline",
    elId: "li2",
    tag: "li",
    indent: 5,
    text: "DOM construction: nodes...",
  },
  {
    type: "inline",
    elId: "li3",
    tag: "li",
    indent: 5,
    text: "Rendering: painted to screen...",
  },
  { type: "close", elId: "ul", tag: "ul", indent: 4 },
  { type: "close", elId: "section1", tag: "section", indent: 3 },

  { type: "open", elId: "section2", tag: "section", indent: 3 },
  {
    type: "inline",
    elId: "h2-2",
    tag: "h2",
    indent: 4,
    text: "Token Types",
  },
  { type: "open", elId: "table", tag: "table", indent: 4 },

  { type: "open", elId: "thead", tag: "thead", indent: 5 },
  { type: "open", elId: "tr-head", tag: "tr", indent: 6 },
  {
    type: "inline",
    elId: "th1",
    tag: "th",
    indent: 7,
    text: "Token Type",
  },
  { type: "inline", elId: "th2", tag: "th", indent: 7, text: "Example" },
  {
    type: "inline",
    elId: "th3",
    tag: "th",
    indent: 7,
    text: "What it does",
  },
  { type: "close", elId: "tr-head", tag: "tr", indent: 6 },
  { type: "close", elId: "thead", tag: "thead", indent: 5 },

  { type: "open", elId: "tbody", tag: "tbody", indent: 5 },

  { type: "open", elId: "tr-body1", tag: "tr", indent: 6 },
  {
    type: "inline",
    elId: "td1-1",
    tag: "td",
    indent: 7,
    text: "Start tag",
  },
  {
    type: "inline",
    elId: "td1-2",
    tag: "td",
    indent: 7,
    text: "&lt;p&gt;",
  },
  {
    type: "inline",
    elId: "td1-3",
    tag: "td",
    indent: 7,
    text: "Opens new element",
  },
  { type: "close", elId: "tr-body1", tag: "tr", indent: 6 },

  { type: "open", elId: "tr-body2", tag: "tr", indent: 6 },
  {
    type: "inline",
    elId: "td2-1",
    tag: "td",
    indent: 7,
    text: "End tag",
  },
  {
    type: "inline",
    elId: "td2-2",
    tag: "td",
    indent: 7,
    text: "&lt;/p&gt;",
  },
  {
    type: "inline",
    elId: "td2-3",
    tag: "td",
    indent: 7,
    text: "Closes element",
  },
  { type: "close", elId: "tr-body2", tag: "tr", indent: 6 },

  { type: "open", elId: "tr-body3", tag: "tr", indent: 6 },
  {
    type: "inline",
    elId: "td3-1",
    tag: "td",
    indent: 7,
    text: "Character",
  },
  {
    type: "inline",
    elId: "td3-2",
    tag: "td",
    indent: 7,
    text: "Hello world",
  },
  {
    type: "inline",
    elId: "td3-3",
    tag: "td",
    indent: 7,
    text: "Becomes a text node",
  },
  { type: "close", elId: "tr-body3", tag: "tr", indent: 6 },

  { type: "open", elId: "tr-body4", tag: "tr", indent: 6 },
  {
    type: "inline",
    elId: "td4-1",
    tag: "td",
    indent: 7,
    text: "Void element",
  },
  {
    type: "inline",
    elId: "td4-2",
    tag: "td",
    indent: 7,
    text: "&lt;meta&gt;",
  },
  {
    type: "inline",
    elId: "td4-3",
    tag: "td",
    indent: 7,
    text: "No closing tag needed",
  },
  { type: "close", elId: "tr-body4", tag: "tr", indent: 6 },

  { type: "close", elId: "tbody", tag: "tbody", indent: 5 },
  { type: "close", elId: "table", tag: "table", indent: 4 },
  { type: "close", elId: "section2", tag: "section", indent: 3 },

  { type: "close", elId: "main", tag: "main", indent: 2 },

  { type: "open", elId: "footer", tag: "footer", indent: 2 },
  { type: "open", elId: "p-foot", tag: "p", indent: 3 },
  {
    type: "inline",
    elId: "small",
    tag: "small",
    indent: 4,
    text: "Parsed top to bottom...",
  },
  { type: "close", elId: "p-foot", tag: "p", indent: 3 },
  { type: "close", elId: "footer", tag: "footer", indent: 2 },

  { type: "close", elId: "body", tag: "body", indent: 1 },
  { type: "close", elId: "html", tag: "html", indent: 0 },
];

// The CSSOM data model. Unlike ELEMENTS_DATA, this is deliberately NOT
// shaped like the DOM: real browsers build the CSSOM from the stylesheet's
// own rule list, independent of how those rules' selectors happen to match
// elements. So every rule here is a flat, direct child of the stylesheet
// root, exactly as a real CSSOM would be for a stylesheet with no nested
// at-rules (no @media, no @supports).
const CSS_ELEMENTS_DATA = {
  stylesheet: { tag: "StyleSheet", parentId: null },
  "rule-body": { selector: "body", parentId: "stylesheet" },
  "rule-header": { selector: "header", parentId: "stylesheet" },
  "rule-h1": { selector: "h1", parentId: "stylesheet" },
  "rule-h2": { selector: "h2", parentId: "stylesheet" },
  "rule-ul": { selector: "ul", parentId: "stylesheet" },
  "rule-table": { selector: "table", parentId: "stylesheet" },
  "rule-th": { selector: "th", parentId: "stylesheet" },
  "rule-td": { selector: "td", parentId: "stylesheet" },
  "rule-footer": { selector: "footer", parentId: "stylesheet" },
};

// The lines shown in the "1. Tokenisation" CSS panel, in source order.
const CSS_LINES = [
  {
    elId: "stylesheet",
    type: "open",
    tag: "style",
    indent: 0,
    text: "/* Loaded style.css via <link> */",
  },
  {
    elId: "rule-body",
    type: "css-rule",
    indent: 1,
    selector: "body",
    styles:
      '{ font-family: "Segoe UI", sans-serif; padding: 20px; color: #333; }',
  },
  {
    elId: "rule-header",
    type: "css-rule",
    indent: 1,
    selector: "header",
    styles:
      "{ border-bottom: 2px solid #007acc; padding-bottom: 10px; margin-bottom: 20px; }",
  },
  {
    elId: "rule-h1",
    type: "css-rule",
    indent: 1,
    selector: "h1",
    styles: "{ color: #007acc; margin: 0 0 5px 0; }",
  },
  {
    elId: "rule-h2",
    type: "css-rule",
    indent: 1,
    selector: "h2",
    styles: "{ color: #555; margin-top: 30px; }",
  },
  {
    elId: "rule-ul",
    type: "css-rule",
    indent: 1,
    selector: "ul",
    styles:
      "{ background: #f9f9f9; padding: 15px 40px; border-radius: 6px; border: 1px solid #ddd; }",
  },
  {
    elId: "rule-table",
    type: "css-rule",
    indent: 1,
    selector: "table",
    styles: "{ width: 100%; border-collapse: collapse; margin-top: 15px; }",
  },
  {
    elId: "rule-th",
    type: "css-rule",
    indent: 1,
    selector: "th",
    styles:
      "{ background-color: #f1f1f1; border: 1px solid #ddd; padding: 10px; text-align: left; }",
  },
  {
    elId: "rule-td",
    type: "css-rule",
    indent: 1,
    selector: "td",
    styles: "{ border: 1px solid #ddd; padding: 10px; text-align: left; }",
  },
  {
    elId: "rule-footer",
    type: "css-rule",
    indent: 1,
    selector: "footer",
    styles:
      "{ margin-top: 30px; padding-top: 10px; border-top: 1px solid #eee; color: #888; text-align: center; }",
  },
];
