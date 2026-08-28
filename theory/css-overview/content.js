/* CSS Overview - lesson content. Explains what CSS is and what a rule is made of, so the vocabulary is in place before any part of it is taught in depth. */

const PANE =
  '<h1 class="heading">A heading</h1>\n<p class="text">The first paragraph.</p>\n<p class="text">The second paragraph.</p>';

const PARTS = [
  {
    id: "what",
    number: "01",
    name: "What CSS Is For",
    tagline: "Appearance, not meaning",
    accent: "#2563eb",
    lead:
      "HTML says what each part of a page <strong>is</strong>. CSS says what it <strong>looks like</strong>. They are two separate languages doing two separate jobs on the same document, and keeping them apart is the whole idea.",
    blocks: [
      {
        label: "index.html",
        lang: "html",
        code: `<!-- HTML: this is a heading, and this is a paragraph. -->
<h1 class="heading">A heading</h1>
<p class="text">The first paragraph.</p>`,
      },
      {
        label: "styles.css",
        lang: "css",
        code: `/* CSS: and here is how those should look. */
.heading {
  color: #0d9488;
}

.text {
  font-size: 18px;
}`,
      },
    ],
    keyPoint:
      "CSS never changes what an element <strong>is</strong>. An <code>h1</code> styled to look small is still a heading to the browser, to a search engine and to a screen reader.",
    meta: {
      "What it is": "The language that sets how a page looks",
      "Written as": "Rules, kept apart from the HTML",
      "Why it matters": "Appearance changes without meaning changing",
    },
    exampleHeadings: ["The job", "Belongs to", "Written as", "What it does"],
    examples: [
      { syntax: "Say what this is", label: "HTML", code: "<h1>A heading</h1>", meaning: "Marks the text as a top level heading. That meaning is carried in the tag itself." },
      { syntax: "Say what this is for", label: "HTML", code: 'class="heading"', meaning: "Gives the element a name, so CSS has something to aim at." },
      { syntax: "Set a colour", label: "CSS", code: "color: #0d9488;", meaning: "Changes how the text is drawn. The element is unchanged." },
      { syntax: "Set a size", label: "CSS", code: "font-size: 18px;", meaning: "Changes how large the text is drawn, not how important it is." },
      { syntax: "Set the spacing", label: "CSS", code: "padding: 12px;", meaning: "Changes the room around the content inside the element." },
    ],
    notes: {
      "How it works":
        "The browser reads the HTML to work out what is on the page, then reads the CSS to work out how to draw it. Neither one can do the other's job: there is no HTML tag that means \"teal\", and no CSS property that means \"this is a heading\".",
      "What to watch for":
        "Every element already looks like something before you write a line of CSS. Browsers apply their own default styling, which is why an <code>h1</code> is large and bold on a blank page. You are always changing a default, never starting from nothing.",
      "Worth remembering":
        "Because the meaning lives in the HTML, you can restyle a whole site without touching a single tag, and anything that reads the page rather than looking at it still understands it.",
    },
  },

  {
    id: "rule",
    number: "02",
    name: "The Rule",
    tagline: "The unit CSS is built from",
    accent: "#d97706",
    lead:
      "A stylesheet is a list of <strong>rules</strong>. Every rule has the same two halves: a <strong>selector</strong> saying which elements it is about, and a <strong>declaration block</strong> saying what to do to them.",
    blocks: [
      {
        label: "styles.css",
        lang: "css",
        code: `.heading {
  color: #0d9488;
  font-size: 32px;
}
/*
.heading            the selector: which elements this is about
{ ... }             the declaration block: what to do to them
color: #0d9488;     one declaration
color               the property, the setting being changed
#0d9488             the value, what it is being changed to
*/`,
      },
    ],
    keyPoint:
      "Every declaration ends with a <strong>semicolon</strong>, and the whole block is wrapped in <strong>braces</strong>. Miss either one and the browser loses track of where the rule ends, so declarations after the mistake are thrown away too.",
    meta: {
      "What it is": "A selector plus a block of declarations",
      "Written as": "selector { property: value; }",
      "Why it matters": "It is the unit every stylesheet is built from",
    },
    exampleHeadings: ["Part", "What it is called", "Example", "What it does"],
    examples: [
      { syntax: "selector { ... }", label: "Rule", code: ".heading { color: #0d9488; }", meaning: "One complete instruction: who it applies to, and what it changes." },
      { syntax: "selector", label: "Selector", code: ".heading", meaning: "The pattern deciding which elements the rule applies to." },
      { syntax: "{ ... }", label: "Declaration block", code: "{ color: #0d9488; }", meaning: "The braces and everything between them. Holds any number of declarations." },
      { syntax: "property: value;", label: "Declaration", code: "color: #0d9488;", meaning: "One setting and what it is set to. Changes exactly one thing." },
      { syntax: "property", label: "Property", code: "color", meaning: "The name of the setting being changed. Comes from a fixed vocabulary." },
      { syntax: "value", label: "Value", code: "#0d9488", meaning: "What the setting is being changed to. Each property accepts its own kinds." },
      { syntax: "/* ... */", label: "Comment", code: "/* a note to yourself */", meaning: "Ignored by the browser. CSS has no single line comment form." },
    ],
    notes: {
      "How it works":
        "The browser reads a rule as \"find everything matching this selector, then apply these declarations to all of it\". The two halves are always in that order, and a rule with no declarations is valid but does nothing.",
      "What to watch for":
        "The punctuation is doing real work. A colon separates a property from its value, a semicolon ends a declaration, and the braces mark where the block starts and stops. A stray brace can silently swallow every rule after it.",
      "Worth remembering":
        "Whitespace and line breaks mean nothing to the browser, so a rule can be written on one line. The usual layout, selector and brace on one line and one declaration per line after it, is a convention for people to read, not a requirement.",
    },
    demo: {
      editorLabel: "styles.css",
      value: ".heading {\n  color: #0d9488;\n  font-size: 32px;\n}",
      result: "The selector picks the target, the declarations change it. Delete a semicolon and watch the rest of the rule fail with it.",
      panes: [{ label: "Rendered page", html: PANE, applies: true }],
    },
  },

  {
    id: "linking",
    number: "03",
    name: "Where The Rules Go",
    tagline: "Reaching the page from a file",
    accent: "#0d9488",
    lead:
      "Rules are kept in a file of their own, ending in <code>.css</code>. A page does not find that file on its own: the HTML has to <strong>link</strong> to it, and a stylesheet that is never linked has no effect at all.",
    blocks: [
      {
        label: "index.html",
        lang: "html",
        code: `<head>
  <meta charset="UTF-8" />
  <title>My page</title>

  <!-- The path is written from this file to the stylesheet. -->
  <link rel="stylesheet" href="css/styles.css" />
</head>`,
      },
    ],
    tree: {
      label: "index.html linking css/styles.css",
      lines: [
        { depth: 0, name: "site/", kind: "folder" },
        { depth: 1, name: "index.html", kind: "file", mark: "you are here" },
        { depth: 1, name: "css/", kind: "folder" },
        { depth: 2, name: "styles.css", kind: "file", mark: "target" },
      ],
    },
    keyPoint:
      "A stylesheet only applies to pages that link to it. Nothing warns you when the path is wrong: the page simply loads with <strong>none of your styling on it</strong>.",
    meta: {
      "What it is": "A .css file the HTML links to",
      "Written as": '<link rel="stylesheet" href="styles.css" />',
      "Why it matters": "CSS the page never links to does nothing",
    },
    exampleHeadings: ["Part", "What it is called", "Example", "What it does"],
    examples: [
      { syntax: "<link />", label: "The tag", code: "<link ... />", meaning: "Connects the page to another file. Goes in the <code>head</code>, and has no closing tag." },
      { syntax: 'rel="..."', label: "Relationship", code: 'rel="stylesheet"', meaning: "Says what the linked file is. Without this the browser will not treat it as CSS." },
      { syntax: 'href="..."', label: "Path", code: 'href="css/styles.css"', meaning: "Where the file is, written as directions from the HTML file to it." },
      { syntax: "<head>", label: "Where it goes", code: "<head> ... </head>", meaning: "Linking in the head means the styling is ready before the page is drawn." },
    ],
    notes: {
      "How it works":
        "When the browser meets the <code>link</code> tag it fetches that file, reads the rules in it, and applies them to the page. One stylesheet can be linked by as many pages as you like, which is how a whole site ends up looking consistent.",
      "What to watch for":
        "The <code>href</code> is a path, written from the HTML file to the stylesheet, so moving either file breaks it. A page with a broken stylesheet path looks like a page with no CSS at all, which is the usual first sign something is wrong.",
      "Worth remembering":
        "A separate file is not the only place CSS can sit, and the alternatives have their own trade-offs. It is the one to start with, because it is the only one that lets many pages share the same rules.",
    },
  },

  {
    id: "many",
    number: "04",
    name: "One Rule, Many Elements",
    tagline: "Written once, applied everywhere",
    accent: "#7c3aed",
    lead:
      "A selector matches a <strong>set</strong> of elements, not one. Write a rule once and it applies to every element on the page that matches it now, and to every one you add later.",
    blocks: [
      {
        label: "styles.css",
        lang: "css",
        code: `/* Every paragraph on the page, however many there are. */
p {
  color: #334155;
}

/* Every element carrying class="text", of any tag. */
.text {
  font-size: 18px;
}`,
      },
    ],
    keyPoint:
      "Reusing one rule across many elements is <strong>the point of CSS</strong>, not a shortcut. Change the rule once and everything it matches changes with it.",
    meta: {
      "What it is": "One rule matching a set of elements",
      "Written as": "One rule, however many elements match",
      "Why it matters": "A page is styled without repeating yourself",
    },
    notes: {
      "How it works":
        "The browser checks every element on the page against the selector and applies the declarations to all of them. Nothing is applied to elements that do not match, and a selector matching nothing at all is not an error.",
      "What to watch for":
        "This cuts both ways. Widening a selector to fix one element quietly restyles every other element it now matches, and those are often somewhere else on the page where you will not notice.",
      "Worth remembering":
        "A selector can be as broad or as narrow as you need, from every paragraph on the site down to one single element. Choosing how wide to aim is most of the skill in writing CSS.",
    },
    demo: {
      editorLabel: "styles.css",
      value: "p {\n  color: #7c3aed;\n}",
      result: "One rule, both paragraphs. Change the selector to .heading and the same rule moves to a different set of elements.",
      panes: [{ label: "Rendered page", html: PANE, applies: true }],
    },
  },

  {
    id: "pileup",
    number: "05",
    name: "When Rules Pile Up",
    tagline: "Many rules, one element",
    accent: "#db2777",
    lead:
      "One element is not styled by one rule. It is styled by <strong>every</strong> rule that matches it, all at once. Where those rules set different properties they simply combine, and where two set the same property, one of them has to win.",
    blocks: [
      {
        label: "styles.css",
        lang: "css",
        code: `/* Three rules, all matching the same paragraph. */
p {
  color: #334155;
  font-size: 16px;
}

.text {
  font-size: 18px;   /* sets font-size again: a conflict */
  padding: 8px;      /* nothing else sets this: it just applies */
}

.text {
  color: #db2777;    /* sets colour again: another conflict */
}`,
      },
    ],
    keyPoint:
      "An element collects declarations from <strong>every</strong> rule that matches it. Styling you did not expect is almost always another rule you forgot also matches.",
    meta: {
      "What it is": "Every matching rule applying at once",
      "Written as": "Many rules, one element",
      "Why it matters": "It explains styling that seems to come from nowhere",
    },
    ladder: [
      {
        rank: "1",
        title: "Collect every rule that matches",
        body:
          "The browser gathers all the declarations aimed at this element, from every rule in every stylesheet, plus the browser's own defaults.",
        code: `p { ... }   .text { ... }   .text { ... }`,
      },
      {
        rank: "2",
        title: "Different properties simply combine",
        body:
          "Where the rules set different things there is nothing to argue about, so the element gets all of them. This is why a single element's final styling is usually spread across several rules.",
        code: `color: #334155;  +  padding: 8px;`,
      },
      {
        rank: "3",
        title: "The same property twice is a conflict",
        body:
          "Only one value can win, so the browser has to choose. Both declarations are still valid CSS: the loser is not an error, it is just not used.",
        code: `font-size: 16px;   vs   font-size: 18px;`,
      },
      {
        rank: "4",
        title: "The conflict is settled by rules, not luck",
        body:
          "Which one wins is decided by how the selectors compare and, if they tie, by which was written later. It is entirely predictable once you know how it is worked out.",
        code: `font-size: 18px;   /* this one wins */`,
      },
    ],
    notes: {
      "How it works":
        "Declarations from different rules stack up on the element, so its final appearance is the total of all of them. Only where two rules set the very same property does anything have to be resolved.",
      "What to watch for":
        "A rule you have just written may not be the one you can see on screen. If a change appears to do nothing, another matching rule is setting the same property and winning, and the answer is to find that rule rather than to write the declaration again.",
      "Worth remembering":
        "How a conflict is settled comes down to the selectors involved, so it is worth learning what selectors can do before worrying about which rule wins.",
    },
    demo: {
      editorLabel: "styles.css",
      value: "p {\n  color: #334155;\n  font-size: 16px;\n}\n\n.text {\n  font-size: 22px;\n  padding: 8px;\n}",
      result: "Both rules match both paragraphs. The padding just applies, while the two font sizes conflict and only one of them shows.",
      panes: [{ label: "Rendered page", html: PANE, applies: true }],
    },
  },
];

const METAKEYS = ["What it is", "Written as", "Why it matters"];

const LESSON = {
  id: "css-overview",
  metaKeys: METAKEYS,
  noteLabels: ["How it works", "What to watch for", "Worth remembering"],
  exampleHeadings: ["Part", "What it is called", "Example", "What it does"],
  demoHint: "Edit the CSS and watch the page change",
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
      { label: "Where you meet it", values: [ "Before you write any CSS at all", "In every stylesheet, on every line", "Once per page, in the head", "As soon as a page has more than one of anything", "As soon as a page has more than one rule", ] },
      { label: "Get it wrong and", values: [ "Meaning ends up buried in the styling", "The rule, and often the ones after it, are ignored", "The page loads with no styling on it", "Elements you were not thinking about change too", "A declaration you wrote never shows up", ] },
    ]),
  },
};
