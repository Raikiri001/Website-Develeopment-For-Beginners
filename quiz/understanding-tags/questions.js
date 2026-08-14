/*
  Question bank for the Understanding Tags quiz.

  One question per tag, 64 tags in total, split into four difficulty tiers of
  16. Array order is the difficulty ramp: a run always walks the tiers in
  order, shuffling only within a tier, so every run opens on tags a learner
  meets in their first lesson and finishes on ones they may never have seen.

  Coverage is deliberately a superset of every tag that appears in the other
  activities on this site (the HTML Structure Trainer, the HTML Debugger and
  the DOM parsing walkthrough), so a learner who works through those never
  meets a tag here that the quiz has not taught, and vice versa.

  Every question gives either a definition ("what this tag is") or a use case
  ("what you would reach for it to do"), and the learner picks the tag. The
  `options` array always contains the answer plus three plausible near misses,
  never a random tag. `explain` describes the tag itself and never refers to
  an option's position, since options are shuffled before rendering.

  This activity is the one place on the site allowed to use tags outside the
  beginner-safe set, because teaching those tags is the whole point of it.
  Anything a beginner finds unintuitive on sight (span above all) sits in a
  later tier rather than tier one.

  This file holds data only. All logic lives in app.js.
*/

// ── Tier 1: the tags a learner meets in their first few lessons ─────────────
const EVERYDAY_QUESTIONS = [
  {
    id: "p",
    tag: "p",
    kind: "definition",
    prompt: "Which tag marks up a single paragraph of ordinary text?",
    options: ["p", "div", "strong", "h2"],
    explain: "&lt;p&gt; is a paragraph. The browser puts a gap above and below each one so blocks of writing are easy to read.",
  },
  {
    id: "h1",
    tag: "h1",
    kind: "use-case",
    prompt: "You want the main title at the top of a page, the most important heading on it. Which tag?",
    options: ["h1", "h2", "h3", "title"],
    explain: "&lt;h1&gt; is the top-level heading. A page normally has exactly one, naming what the whole page is about.",
  },
  {
    id: "h2",
    tag: "h2",
    kind: "use-case",
    prompt: "Your page has a main title already, and you need headings for each major section under it. Which tag?",
    options: ["h2", "h1", "h4", "p"],
    explain: "&lt;h2&gt; is a second-level heading, used for the sections sitting underneath the page's single &lt;h1&gt;.",
  },
  {
    id: "h3",
    tag: "h3",
    kind: "use-case",
    prompt: "You need a sub-heading sitting underneath a section that is already headed by an h2. Which tag?",
    options: ["h3", "h2", "h1", "strong"],
    explain: "&lt;h3&gt; is a third-level heading. Heading levels should step down one at a time so the page has a clear outline.",
  },
  {
    id: "a",
    tag: "a",
    kind: "use-case",
    prompt: "You want some text that takes the reader to another page when they click it. Which tag?",
    options: ["a", "button", "link", "p"],
    explain: "&lt;a&gt; is an anchor, the tag that makes a link. Its href attribute says where the link goes.",
  },
  {
    id: "img",
    tag: "img",
    kind: "definition",
    prompt: "Which tag puts a picture on the page?",
    options: ["img", "figure", "video", "div"],
    explain: "&lt;img&gt; shows an image. Its src attribute points at the picture file and its alt attribute describes it for anyone who cannot see it.",
  },
  {
    id: "ul",
    tag: "ul",
    kind: "use-case",
    prompt: "You want a shopping list where the order of the items does not matter. Which tag wraps the whole list?",
    options: ["ul", "ol", "li", "div"],
    explain: "&lt;ul&gt; is an unordered list. The browser marks each item inside it with a bullet rather than a number.",
  },
  {
    id: "ol",
    tag: "ol",
    kind: "use-case",
    prompt: "You want the steps of a recipe, where doing them in order matters. Which tag wraps the whole list?",
    options: ["ol", "ul", "li", "p"],
    explain: "&lt;ol&gt; is an ordered list, so the browser numbers each item inside it instead of bulleting it.",
  },
  {
    id: "li",
    tag: "li",
    kind: "definition",
    prompt: "Which tag marks up one single item inside a list?",
    options: ["li", "ul", "ol", "p"],
    explain: "&lt;li&gt; is a list item. It goes inside a &lt;ul&gt; or an &lt;ol&gt;, one per thing in the list.",
  },
  {
    id: "div",
    tag: "div",
    kind: "definition",
    prompt: "Which tag is a plain box with no meaning of its own, used to group things together so they can be laid out or styled?",
    options: ["div", "p", "body", "section"],
    explain: "&lt;div&gt; is a generic container. It says nothing about what is inside it, which is exactly why you reach for it when no more meaningful tag fits.",
  },
  {
    id: "button",
    tag: "button",
    kind: "use-case",
    prompt: "You want something clickable that runs an action on the page, like submitting a form or opening a menu. Which tag?",
    options: ["button", "a", "input", "div"],
    explain: "&lt;button&gt; is a clickable control that does something on the page, as opposed to &lt;a&gt;, which takes you somewhere else.",
  },
  {
    id: "strong",
    tag: "strong",
    kind: "use-case",
    prompt: "You want to mark a few words as seriously important, and the browser should show them in bold. Which tag?",
    options: ["strong", "em", "h3", "p"],
    explain: "&lt;strong&gt; marks text as important. Browsers show it bold by default, but the meaning is the point, not the boldness.",
  },
  {
    id: "em",
    tag: "em",
    kind: "use-case",
    prompt: "You want to stress a word the way you would with your voice when speaking, and the browser should show it in italics. Which tag?",
    options: ["em", "strong", "b", "p"],
    explain: "&lt;em&gt; marks emphasis, the word you would lean on if you read the sentence aloud. Browsers italicise it by default.",
  },
  {
    id: "input",
    tag: "input",
    kind: "definition",
    prompt: "Which tag creates a box the visitor can type into, or a tickbox they can tick?",
    options: ["input", "textarea", "button", "form"],
    explain: "&lt;input&gt; is a single form control. Its type attribute decides what kind: text, checkbox, email, password and so on.",
  },
  {
    id: "br",
    tag: "br",
    kind: "use-case",
    prompt: "You are writing out a postal address and need each line to start on a new line, without it becoming a new paragraph. Which tag?",
    options: ["br", "hr", "p", "div"],
    explain: "&lt;br&gt; forces a line break. It is for text where the line endings genuinely matter, like an address or a poem.",
  },
  {
    id: "hr",
    tag: "hr",
    kind: "definition",
    prompt: "Which tag draws a horizontal rule across the page to show a change of topic?",
    options: ["hr", "br", "div", "section"],
    explain: "&lt;hr&gt; is a thematic break. Browsers draw it as a horizontal line across the available width.",
  },
];

// ── Tier 2: the page skeleton, plus more text and form tags ─────────────────
const SKELETON_QUESTIONS = [
  {
    id: "html",
    tag: "html",
    kind: "definition",
    prompt: "Which tag wraps absolutely everything else on the page, and carries the lang attribute saying what language the page is in?",
    options: ["html", "body", "head", "div"],
    explain: "&lt;html&gt; is the root element. Every other tag on the page lives inside it.",
  },
  {
    id: "head",
    tag: "head",
    kind: "definition",
    prompt: "Which tag holds information about the page that the visitor does not see on screen, like its title and its stylesheet links?",
    options: ["head", "header", "body", "title"],
    explain: "&lt;head&gt; holds the page's setup information. Nothing inside it is drawn on the page itself.",
  },
  {
    id: "body",
    tag: "body",
    kind: "definition",
    prompt: "Which tag contains everything the visitor actually sees in the browser window?",
    options: ["body", "html", "main", "div"],
    explain: "&lt;body&gt; holds all the visible content of the page. It is the sibling of &lt;head&gt;, both inside &lt;html&gt;.",
  },
  {
    id: "title",
    tag: "title",
    kind: "use-case",
    prompt: "You want to set the text that appears on the browser tab and in a search result. Which tag?",
    options: ["title", "h1", "head", "meta"],
    explain: "&lt;title&gt; sets the page's name, shown on the browser tab. It goes inside &lt;head&gt; and never appears on the page itself.",
  },
  {
    id: "meta",
    tag: "meta",
    kind: "use-case",
    prompt: "You need to tell the browser the page's character encoding and how it should scale on a phone. Which tag?",
    options: ["meta", "link", "head", "title"],
    explain: "&lt;meta&gt; carries information about the page for the browser and for search engines. It sits inside &lt;head&gt; and shows nothing on screen.",
  },
  {
    id: "link",
    tag: "link",
    kind: "use-case",
    prompt: "You want to attach an external stylesheet file to the page. Which tag?",
    options: ["link", "a", "style", "script"],
    explain: "&lt;link&gt; connects the page to an external file, most often a stylesheet. Despite the name it has nothing to do with clickable links.",
  },
  {
    id: "script",
    tag: "script",
    kind: "definition",
    prompt: "Which tag loads or contains the JavaScript that makes a page interactive?",
    options: ["script", "style", "link", "meta"],
    explain: "&lt;script&gt; holds JavaScript, either written inline between the tags or loaded from a file via its src attribute.",
  },
  {
    id: "style",
    tag: "style",
    kind: "use-case",
    prompt: "You want to write CSS rules directly inside the HTML file rather than in a separate stylesheet. Which tag?",
    options: ["style", "link", "script", "head"],
    explain: "&lt;style&gt; holds CSS written straight into the page. A separate file loaded with &lt;link&gt; is usually tidier.",
  },
  {
    id: "span",
    tag: "span",
    kind: "definition",
    prompt: "Which tag wraps a few words inside a sentence with no meaning and no visible change, purely so those words can be styled?",
    options: ["span", "div", "strong", "em"],
    explain: "&lt;span&gt; is a generic inline container. On its own it does nothing at all, which is what makes it useful as a styling hook mid-sentence.",
  },
  {
    id: "form",
    tag: "form",
    kind: "definition",
    prompt: "Which tag wraps a group of controls that get sent off together when the visitor submits them?",
    options: ["form", "input", "fieldset", "div"],
    explain: "&lt;form&gt; groups controls and handles sending their values. Its action attribute says where the answers go.",
  },
  {
    id: "label",
    tag: "label",
    kind: "use-case",
    prompt: "You want to name a text box so the visitor knows what to type in it, and so clicking that name focuses the box. Which tag?",
    options: ["label", "p", "input", "strong"],
    explain: "&lt;label&gt; names a form control. Linking it to the control with the for attribute makes the label clickable and helps screen readers.",
  },
  {
    id: "textarea",
    tag: "textarea",
    kind: "use-case",
    prompt: "You want a box the visitor can type several lines of a message into. Which tag?",
    options: ["textarea", "input", "form", "pre"],
    explain: "&lt;textarea&gt; is a multi-line text box, for anything longer than the single line an &lt;input&gt; gives you.",
  },
  {
    id: "h4",
    tag: "h4",
    kind: "definition",
    prompt: "Which tag is the fourth-level heading, one step smaller than an h3?",
    options: ["h4", "h3", "h6", "h2"],
    explain: "&lt;h4&gt; is a fourth-level heading. HTML gives you six levels, &lt;h1&gt; down to &lt;h6&gt;.",
  },
  {
    id: "h6",
    tag: "h6",
    kind: "definition",
    prompt: "Which tag is the smallest, least important heading level HTML offers?",
    options: ["h6", "h4", "h1", "small"],
    explain: "&lt;h6&gt; is the sixth and lowest heading level. Needing one usually means a page is nested more deeply than it should be.",
  },
  {
    id: "b",
    tag: "b",
    kind: "definition",
    prompt: "Which tag makes text bold purely for appearance, without saying that the text is important?",
    options: ["b", "strong", "em", "span"],
    explain: "&lt;b&gt; just draws text bold. When the words genuinely matter more than those around them, &lt;strong&gt; is the better choice because it carries that meaning.",
  },
  {
    id: "select",
    tag: "select",
    kind: "use-case",
    prompt: "You want a drop-down menu the visitor picks one choice from. Which tag wraps the whole menu?",
    options: ["select", "option", "input", "form"],
    explain: "&lt;select&gt; creates a drop-down list. The available choices go inside it as separate tags.",
  },
];

// ── Tier 3: semantic layout, and the parts of a table ───────────────────────
const STRUCTURE_QUESTIONS = [
  {
    id: "header",
    tag: "header",
    kind: "use-case",
    prompt: "You want to group the logo and site name that sit at the top of every page. Which tag?",
    options: ["header", "head", "nav", "div"],
    explain: "&lt;header&gt; is the introductory block at the top of a page or a section. It is visible content, unlike &lt;head&gt;.",
  },
  {
    id: "nav",
    tag: "nav",
    kind: "definition",
    prompt: "Which tag wraps the main set of links a visitor uses to move around the site?",
    options: ["nav", "ul", "menu", "header"],
    explain: "&lt;nav&gt; marks a block of navigation links, which lets a screen reader offer to skip straight past it.",
  },
  {
    id: "main",
    tag: "main",
    kind: "definition",
    prompt: "Which tag wraps the one block of content that is unique to this page, as opposed to the header and footer repeated everywhere?",
    options: ["main", "body", "section", "div"],
    explain: "&lt;main&gt; holds the page's central content. There should be only one per page.",
  },
  {
    id: "footer",
    tag: "footer",
    kind: "use-case",
    prompt: "You want to group the copyright line and contact links at the very bottom of the page. Which tag?",
    options: ["footer", "header", "aside", "div"],
    explain: "&lt;footer&gt; is the closing block of a page or a section, typically holding credits, contact details or small print.",
  },
  {
    id: "section",
    tag: "section",
    kind: "definition",
    prompt: "Which tag groups related content that belongs together under its own heading, as one part of a larger page?",
    options: ["section", "article", "div", "main"],
    explain: "&lt;section&gt; is a thematic grouping within a page and normally starts with a heading saying what it covers.",
  },
  {
    id: "article",
    tag: "article",
    kind: "use-case",
    prompt: "You want to wrap a single blog post that would still make sense if it were lifted out and published somewhere else on its own. Which tag?",
    options: ["article", "section", "main", "div"],
    explain: "&lt;article&gt; marks a self-contained piece of content, like a post, a news story or a product card.",
  },
  {
    id: "aside",
    tag: "aside",
    kind: "use-case",
    prompt: "You want a sidebar of loosely related extras, the kind of thing a reader could skip without missing the point. Which tag?",
    options: ["aside", "section", "footer", "div"],
    explain: "&lt;aside&gt; is content off to the side of the main topic, like a sidebar, a pull quote or a set of related links.",
  },
  {
    id: "figure",
    tag: "figure",
    kind: "use-case",
    prompt: "You want to group a diagram together with its caption so the two travel as one unit. Which tag?",
    options: ["figure", "img", "figcaption", "div"],
    explain: "&lt;figure&gt; wraps an image, diagram or code sample along with its caption, keeping them tied together.",
  },
  {
    id: "figcaption",
    tag: "figcaption",
    kind: "definition",
    prompt: "Which tag holds the caption text that describes the image it sits alongside?",
    options: ["figcaption", "figure", "label", "caption"],
    explain: "&lt;figcaption&gt; is the caption for a &lt;figure&gt;, and goes inside it as either the first or the last child.",
  },
  {
    id: "table",
    tag: "table",
    kind: "use-case",
    prompt: "You have data that only makes sense read across rows and down columns, like a train timetable. Which tag wraps it?",
    options: ["table", "div", "ul", "section"],
    explain: "&lt;table&gt; is for genuine tabular data, where the row and column a value sits in is part of its meaning.",
  },
  {
    id: "tr",
    tag: "tr",
    kind: "definition",
    prompt: "Which tag marks up one horizontal row of a table?",
    options: ["tr", "td", "th", "table"],
    explain: "&lt;tr&gt; is a table row. The cells for that row go inside it.",
  },
  {
    id: "td",
    tag: "td",
    kind: "definition",
    prompt: "Which tag marks up one ordinary cell of data inside a table row?",
    options: ["td", "th", "tr", "li"],
    explain: "&lt;td&gt; is a table data cell. Use &lt;th&gt; instead when the cell is a heading for its row or column.",
  },
  {
    id: "th",
    tag: "th",
    kind: "use-case",
    prompt: "You want the cell at the top of a table column that names what the column contains. Which tag?",
    options: ["th", "td", "thead", "h4"],
    explain: "&lt;th&gt; is a table header cell. Browsers bold and centre it, and screen readers use it to say which column a value belongs to.",
  },
  {
    id: "thead",
    tag: "thead",
    kind: "definition",
    prompt: "Which tag groups the header row or rows of a table, separately from its body?",
    options: ["thead", "tbody", "th", "header"],
    explain: "&lt;thead&gt; wraps the rows of header cells at the top of a table, so the browser knows they label the data rather than being data.",
  },
  {
    id: "tbody",
    tag: "tbody",
    kind: "definition",
    prompt: "Which tag groups the main data rows of a table, the ones underneath its headers?",
    options: ["tbody", "thead", "table", "body"],
    explain: "&lt;tbody&gt; wraps a table's data rows. Splitting a table into a head and a body lets a long table repeat its headers when printed.",
  },
  {
    id: "caption",
    tag: "caption",
    kind: "use-case",
    prompt: "You want a title for a whole table, shown just above it and read out as part of the table. Which tag?",
    options: ["caption", "figcaption", "th", "h4"],
    explain: "&lt;caption&gt; titles a table and goes as the very first thing inside the &lt;table&gt;.",
  },
];

// ── Tier 4: tags a learner may not have met yet ─────────────────────────────
const NICHE_QUESTIONS = [
  {
    id: "blockquote",
    tag: "blockquote",
    kind: "use-case",
    prompt: "You are quoting a long passage from somewhere else and want it set apart from your own writing. Which tag?",
    options: ["blockquote", "q", "p", "em"],
    explain: "&lt;blockquote&gt; marks a quoted section. Browsers indent it by default so it reads as somebody else's words.",
  },
  {
    id: "q",
    tag: "q",
    kind: "use-case",
    prompt: "You want to quote a few words inside a sentence, and let the browser add the quote marks for you. Which tag?",
    options: ["q", "blockquote", "em", "span"],
    explain: "&lt;q&gt; is a short inline quotation. The browser supplies the quote marks, so you do not type them yourself.",
  },
  {
    id: "code",
    tag: "code",
    kind: "definition",
    prompt: "Which tag marks a short piece of computer code inside a sentence, shown in a monospace font?",
    options: ["code", "pre", "kbd", "span"],
    explain: "&lt;code&gt; marks text as code. It handles short fragments mentioned mid-sentence.",
  },
  {
    id: "pre",
    tag: "pre",
    kind: "use-case",
    prompt: "You want a block of text where every space and line break you typed is kept exactly as written. Which tag?",
    options: ["pre", "code", "textarea", "blockquote"],
    explain: "&lt;pre&gt; preserves whitespace. Normally the browser collapses runs of spaces and newlines, but not inside this tag.",
  },
  {
    id: "option",
    tag: "option",
    kind: "definition",
    prompt: "Which tag marks up one single choice inside a drop-down menu?",
    options: ["option", "select", "li", "input"],
    explain: "&lt;option&gt; is one choice in a &lt;select&gt;. Its value attribute is what gets submitted when that choice is picked.",
  },
  {
    id: "video",
    tag: "video",
    kind: "definition",
    prompt: "Which tag embeds a video the visitor can play, with built-in controls?",
    options: ["video", "audio", "img", "iframe"],
    explain: "&lt;video&gt; embeds a video file. Adding the controls attribute gives the visitor play, pause and volume.",
  },
  {
    id: "audio",
    tag: "audio",
    kind: "use-case",
    prompt: "You want to put a sound clip on the page with a small play bar, and no picture. Which tag?",
    options: ["audio", "video", "source", "embed"],
    explain: "&lt;audio&gt; embeds a sound file. Like &lt;video&gt; it needs the controls attribute to show a player.",
  },
  {
    id: "source",
    tag: "source",
    kind: "use-case",
    prompt: "You want to offer a video in two different file formats and let the browser play whichever it supports. Which tag names each file?",
    options: ["source", "video", "link", "img"],
    explain: "&lt;source&gt; names one media file inside a &lt;video&gt; or &lt;audio&gt;. The browser works down the list and plays the first one it can.",
  },
  {
    id: "iframe",
    tag: "iframe",
    kind: "definition",
    prompt: "Which tag embeds a whole other web page inside a window on this one, the way a map or a YouTube player is embedded?",
    options: ["iframe", "video", "embed", "div"],
    explain: "&lt;iframe&gt; puts another page inside this one. Its src attribute is the address of the page being embedded.",
  },
  {
    id: "details",
    tag: "details",
    kind: "use-case",
    prompt: "You want a block that starts collapsed and opens when the visitor clicks it, without writing any JavaScript. Which tag?",
    options: ["details", "summary", "aside", "section"],
    explain: "&lt;details&gt; makes a collapsible block. The clickable line that stays visible when it is shut is written as a &lt;summary&gt; inside it.",
  },
  {
    id: "summary",
    tag: "summary",
    kind: "definition",
    prompt: "Which tag is the always-visible clickable line of a collapsible block, the bit you click to open it?",
    options: ["summary", "details", "label", "caption"],
    explain: "&lt;summary&gt; is the visible heading of a &lt;details&gt; block, and must be the first thing inside it.",
  },
  {
    id: "dl",
    tag: "dl",
    kind: "use-case",
    prompt: "You want a glossary: a list of terms, each paired with its meaning. Which tag wraps the whole thing?",
    options: ["dl", "ul", "ol", "table"],
    explain: "&lt;dl&gt; is a description list, for pairs of things rather than plain items. A glossary is the classic example.",
  },
  {
    id: "dt",
    tag: "dt",
    kind: "definition",
    prompt: "Inside a glossary list, which tag marks up the term being defined?",
    options: ["dt", "dd", "dl", "li"],
    explain: "&lt;dt&gt; is a description term, the word or phrase being explained. Its explanation follows it in a separate tag.",
  },
  {
    id: "dd",
    tag: "dd",
    kind: "definition",
    prompt: "Inside a glossary list, which tag holds the explanation that goes with the term above it?",
    options: ["dd", "dt", "dl", "p"],
    explain: "&lt;dd&gt; is a description details, the meaning that belongs to the &lt;dt&gt; just before it.",
  },
  {
    id: "abbr",
    tag: "abbr",
    kind: "use-case",
    prompt: "You want to mark up an acronym so hovering it shows what the letters stand for. Which tag?",
    options: ["abbr", "span", "q", "label"],
    explain: "&lt;abbr&gt; marks an abbreviation. Its title attribute holds the full wording, which browsers show on hover.",
  },
  {
    id: "time",
    tag: "time",
    kind: "use-case",
    prompt: "You want to write a date so a person reads it as \"next Tuesday\" but a computer can still read the exact date. Which tag?",
    options: ["time", "span", "abbr", "meta"],
    explain: "&lt;time&gt; marks a date or time. Its datetime attribute holds the machine-readable version alongside the friendly wording.",
  },
];

/*
  The four tiers, in the order a run walks them.

  `difficulty` drives a badge on the prompt panel, using the same easy/medium/
  hard/expert wording and the same semantic colours as the difficulty badge in
  Match the CSS. The tier's own name goes on the title bar in the quiz's
  category colour, so difficulty and category never share a colour.
*/
const TAG_QUIZ_TIERS = [
  {
    id: "everyday",
    name: "Everyday Tags",
    difficulty: "easy",
    description: "The tags you meet in your first few lessons.",
    questions: EVERYDAY_QUESTIONS,
  },
  {
    id: "skeleton",
    name: "Page Skeleton",
    difficulty: "medium",
    description: "The bones of every page, plus more text and form tags.",
    questions: SKELETON_QUESTIONS,
  },
  {
    id: "structure",
    name: "Structure & Semantics",
    difficulty: "hard",
    description: "Tags that say what a part of the page means, and the parts of a table.",
    questions: STRUCTURE_QUESTIONS,
  },
  {
    id: "niche",
    name: "Less Common Tags",
    difficulty: "expert",
    description: "Tags you may not have met yet, from media to glossaries.",
    questions: NICHE_QUESTIONS,
  },
];
