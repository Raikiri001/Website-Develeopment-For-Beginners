/*
  Question bank for the Match the Attribute quiz.

  Every question names one tag and one job, and the learner picks the version
  of that tag whose attributes actually do the job. 64 questions in total,
  split into four difficulty tiers of 16. Array order is the difficulty ramp:
  a run always walks the tiers in order, shuffling only within a tier, so a
  run opens on href and src and finishes on things like scope and datetime.

  Where Understanding Tags asks "which tag is this?", this asks "which
  attributes does this tag need?", so the two are deliberately complementary:
  the tags used here stay inside the set that quiz teaches, and the options
  are always four versions of the same tag rather than four different tags.

  Field notes:
    - `tag` is the tag the question is about, shown on the prompt panel header
      so the learner always knows which element they are dressing.
    - `answer` must appear verbatim in `options`.
    - `options` are the answer plus three near misses that are wrong for a
      reason worth learning (a made-up attribute name, the right attribute
      with the wrong value, a missing half of a pair), never a random snippet.
    - `explain` describes the attributes themselves and never refers to an
      option's position, since options are shuffled before rendering.

  This file holds data only. All logic lives in app.js.
*/

// ── Tier 1: the attributes on the tags a learner writes first ──────────────
const LINK_IMAGE_QUESTIONS = [
  {
    id: "a-href",
    tag: "a",
    prompt: "Make this link take the reader to a page called about.html.",
    answer: '<a href="about.html">About us</a>',
    options: [
      '<a href="about.html">About us</a>',
      '<a src="about.html">About us</a>',
      '<a link="about.html">About us</a>',
      '<a goto="about.html">About us</a>',
    ],
    explain:
      "href is the attribute that says where a link goes. src belongs to tags that pull a file in, like &lt;img&gt;, not to a link.",
  },
  {
    id: "a-external",
    tag: "a",
    prompt: "Link to another website and have it open in a new tab.",
    answer:
      '<a href="https://example.com" target="_blank" rel="noopener">Example</a>',
    options: [
      '<a href="https://example.com" target="_blank" rel="noopener">Example</a>',
      '<a href="https://example.com" target="new" rel="noopener">Example</a>',
      '<a href="https://example.com" newtab="true">Example</a>',
      '<a href="https://example.com" target="_self" rel="noopener">Example</a>',
    ],
    explain:
      'target="_blank" opens the link in a new tab, and rel="noopener" is paired with it so the new tab cannot interfere with your page. "new" and "_self" are not the value that opens a new tab.',
  },
  {
    id: "a-relative-folder",
    tag: "a",
    prompt:
      "Link to contact.html, which sits in the same folder as this page.",
    answer: '<a href="contact.html">Contact</a>',
    options: [
      '<a href="contact.html">Contact</a>',
      '<a href="/contact.html">Contact</a>',
      '<a href="../contact.html">Contact</a>',
      '<a href="#contact.html">Contact</a>',
    ],
    explain:
      "A bare filename means \"a file next to this one\". A leading slash starts from the top of the site, ../ goes up a folder, and # jumps to a spot on the current page.",
  },
  {
    id: "a-mailto",
    tag: "a",
    prompt: "Make clicking this link start a new email to hello@example.com.",
    answer: '<a href="mailto:hello@example.com">Email us</a>',
    options: [
      '<a href="mailto:hello@example.com">Email us</a>',
      '<a href="hello@example.com">Email us</a>',
      '<a email="hello@example.com">Email us</a>',
      '<a href="mail:hello@example.com">Email us</a>',
    ],
    explain:
      "An href starting with mailto: tells the browser to open an email instead of loading a page. Without it the address is treated as a filename.",
  },
  {
    id: "img-src",
    tag: "img",
    prompt: "Show the picture stored at images/dog.jpg.",
    answer: '<img src="images/dog.jpg" alt="A dog">',
    options: [
      '<img src="images/dog.jpg" alt="A dog">',
      '<img href="images/dog.jpg" alt="A dog">',
      '<img file="images/dog.jpg" alt="A dog">',
      '<img source="images/dog.jpg" alt="A dog">',
    ],
    explain:
      "src points at the image file. href is for links, and there is no file or source attribute on &lt;img&gt;.",
  },
  {
    id: "img-alt",
    tag: "img",
    prompt:
      "Add the wording that is read out to someone who cannot see this photo of a red bike.",
    answer: '<img src="bike.jpg" alt="A red bike leaning on a fence">',
    options: [
      '<img src="bike.jpg" alt="A red bike leaning on a fence">',
      '<img src="bike.jpg" title="A red bike leaning on a fence">',
      '<img src="bike.jpg" caption="A red bike leaning on a fence">',
      '<img src="bike.jpg" description="A red bike leaning on a fence">',
    ],
    explain:
      "alt is the text stand-in for an image, used by screen readers and shown if the file fails to load. title only makes a tooltip on hover.",
  },
  {
    id: "img-size",
    tag: "img",
    prompt: "Tell the browser this image is 400 wide and 300 tall.",
    answer: '<img src="cat.jpg" alt="A cat" width="400" height="300">',
    options: [
      '<img src="cat.jpg" alt="A cat" width="400" height="300">',
      '<img src="cat.jpg" alt="A cat" size="400x300">',
      '<img src="cat.jpg" alt="A cat" w="400" h="300">',
      '<img src="cat.jpg" alt="A cat" width="400px" height="300px">',
    ],
    explain:
      "width and height are separate attributes and take a plain number, no px. Giving them lets the browser hold the right space while the image loads.",
  },
  {
    id: "img-decorative",
    tag: "img",
    prompt:
      "This image is pure decoration and adds nothing for a screen reader to say. How is it marked up?",
    answer: '<img src="swirl.png" alt="">',
    options: [
      '<img src="swirl.png" alt="">',
      '<img src="swirl.png">',
      '<img src="swirl.png" alt="decoration">',
      '<img src="swirl.png" alt="image">',
    ],
    explain:
      "An empty alt says \"there is deliberately nothing to read out here\", so a screen reader skips it. Leaving alt off entirely instead makes it read the filename.",
  },
  {
    id: "id-basic",
    tag: "div",
    prompt: "Give this one box a unique name so a link can jump straight to it.",
    answer: '<div id="contact">',
    options: [
      '<div id="contact">',
      '<div class="contact">',
      '<div name="contact">',
      '<div label="contact">',
    ],
    explain:
      "id is a unique name for one element, and no two elements on a page should share one. class is for a name shared by many elements.",
  },
  {
    id: "class-basic",
    tag: "p",
    prompt:
      "Mark this paragraph, and others like it, so one CSS rule can style them all.",
    answer: '<p class="note">',
    options: [
      '<p class="note">',
      '<p id="note">',
      '<p style="note">',
      '<p group="note">',
    ],
    explain:
      "class is a label you can reuse on as many elements as you like, which is what makes it the one to style with. An id can only be used once.",
  },
  {
    id: "class-multiple",
    tag: "div",
    prompt: "Put two classes, card and featured, on the same box.",
    answer: '<div class="card featured">',
    options: [
      '<div class="card featured">',
      '<div class="card" class="featured">',
      '<div class="card, featured">',
      '<div class="card" featured>',
    ],
    explain:
      "Several classes go inside one class attribute, separated by a space. An attribute can only be written once per tag, so two class attributes is not allowed.",
  },
  {
    id: "a-fragment",
    tag: "a",
    prompt:
      'Jump down to a section on this same page whose id is "reviews".',
    answer: '<a href="#reviews">Read reviews</a>',
    options: [
      '<a href="#reviews">Read reviews</a>',
      '<a href="reviews">Read reviews</a>',
      '<a href="id=reviews">Read reviews</a>',
      '<a id="reviews">Read reviews</a>',
    ],
    explain:
      "A # in front of a name means \"the element on this page with that id\". Without the #, the browser looks for a file called reviews instead.",
  },
  {
    id: "button-type",
    tag: "button",
    prompt: "Make this button submit the form it sits in.",
    answer: '<button type="submit">Send</button>',
    options: [
      '<button type="submit">Send</button>',
      '<button type="button">Send</button>',
      '<button action="submit">Send</button>',
      '<button submit="true">Send</button>',
    ],
    explain:
      'type="submit" sends the form. type="button" is the opposite: a button that does nothing until JavaScript gives it a job.',
  },
  {
    id: "input-text",
    tag: "input",
    prompt: "Add a single-line box for the visitor to type their name into.",
    answer: '<input type="text" name="fullname">',
    options: [
      '<input type="text" name="fullname">',
      '<input type="name" name="fullname">',
      '<input text="fullname">',
      '<input type="textbox" name="fullname">',
    ],
    explain:
      'type="text" is a plain one-line box, and name is the label the answer is sent under. There is no "name" or "textbox" input type.',
  },
  {
    id: "img-title-vs-alt",
    tag: "img",
    prompt:
      "Show a tooltip when the visitor rests their mouse on this image, without changing what a screen reader reads out.",
    answer: '<img src="map.png" alt="Site map" title="Click to enlarge">',
    options: [
      '<img src="map.png" alt="Site map" title="Click to enlarge">',
      '<img src="map.png" alt="Click to enlarge">',
      '<img src="map.png" alt="Site map" tooltip="Click to enlarge">',
      '<img src="map.png" alt="Site map" hover="Click to enlarge">',
    ],
    explain:
      "title is the hover tooltip and is separate from alt, which stays as the description of the image itself.",
  },
  {
    id: "a-title",
    tag: "a",
    prompt: "Add hover text explaining where this link leads.",
    answer: '<a href="prices.html" title="Our full price list">Prices</a>',
    options: [
      '<a href="prices.html" title="Our full price list">Prices</a>',
      '<a href="prices.html" alt="Our full price list">Prices</a>',
      '<a href="prices.html" tip="Our full price list">Prices</a>',
      '<a href="prices.html" name="Our full price list">Prices</a>',
    ],
    explain:
      "title gives hover text on almost any element. alt only exists on tags like &lt;img&gt;, where it replaces content that cannot be seen.",
  },
];

// ── Tier 2: forms, where attributes do most of the work ────────────────────
const FORM_QUESTIONS = [
  {
    id: "input-radio-group",
    tag: "input",
    prompt:
      "Make a radio button for the colour red, in a group where only one colour can be chosen.",
    answer: '<input type="radio" name="colour" value="red">',
    options: [
      '<input type="radio" name="colour" value="red">',
      '<input type="radio" name="red" value="colour">',
      '<input type="radio" id="colour" value="red">',
      '<input type="radio" value="red">',
    ],
    explain:
      "Radio buttons that share the same name are one group, so picking one clears the others. value is what that particular choice sends. Without a shared name they all work independently.",
  },
  {
    id: "input-radio-checked",
    tag: "input",
    prompt:
      "Make this radio button the one already selected when the page loads.",
    answer: '<input type="radio" name="size" value="medium" checked>',
    options: [
      '<input type="radio" name="size" value="medium" checked>',
      '<input type="radio" name="size" value="medium" selected>',
      '<input type="radio" name="size" value="medium" default>',
      '<input type="radio" name="size" value="medium" checked="no">',
    ],
    explain:
      "checked pre-selects a radio or checkbox. It is an on/off attribute: writing it at all turns it on, so even checked=\"no\" would still be checked. selected is the &lt;option&gt; version of this.",
  },
  {
    id: "input-checkbox",
    tag: "input",
    prompt:
      "Add a tick box for \"Send me the newsletter\" that the visitor can turn on or off.",
    answer: '<input type="checkbox" name="newsletter" value="yes">',
    options: [
      '<input type="checkbox" name="newsletter" value="yes">',
      '<input type="check" name="newsletter" value="yes">',
      '<input type="radio" name="newsletter" value="yes">',
      '<input type="tickbox" name="newsletter" value="yes">',
    ],
    explain:
      'type="checkbox" is a box you can tick and untick on its own. A radio is for picking exactly one option out of several.',
  },
  {
    id: "input-checkbox-vs-radio",
    tag: "input",
    prompt:
      "The visitor should be able to tick several toppings at once. Which type do the boxes use?",
    answer: '<input type="checkbox" name="toppings" value="cheese">',
    options: [
      '<input type="checkbox" name="toppings" value="cheese">',
      '<input type="radio" name="toppings" value="cheese">',
      '<input type="checkbox" name="cheese" multiple>',
      '<input type="option" name="toppings" value="cheese">',
    ],
    explain:
      "Checkboxes sharing a name are a group where any number can be ticked. Radios sharing a name allow only one, which is the whole difference between the two.",
  },
  {
    id: "input-email",
    tag: "input",
    prompt:
      "Ask for an email address, and have the browser check it looks like one.",
    answer: '<input type="email" name="email">',
    options: [
      '<input type="email" name="email">',
      '<input type="text" name="email">',
      '<input type="mail" name="email">',
      '<input type="address" name="email">',
    ],
    explain:
      'type="email" gets you free checking and a keyboard with an @ on a phone. A text box would accept anything at all.',
  },
  {
    id: "input-password",
    tag: "input",
    prompt: "Hide what the visitor types into this box behind dots.",
    answer: '<input type="password" name="password">',
    options: [
      '<input type="password" name="password">',
      '<input type="text" name="password" hidden>',
      '<input type="secret" name="password">',
      '<input type="text" name="password" masked>',
    ],
    explain:
      'type="password" masks the characters as they are typed. hidden would remove the box from the page entirely.',
  },
  {
    id: "input-placeholder",
    tag: "input",
    prompt:
      "Show faint example text inside an empty box that disappears as soon as the visitor types.",
    answer: '<input type="text" name="suburb" placeholder="e.g. Parramatta">',
    options: [
      '<input type="text" name="suburb" placeholder="e.g. Parramatta">',
      '<input type="text" name="suburb" value="e.g. Parramatta">',
      '<input type="text" name="suburb" hint="e.g. Parramatta">',
      '<input type="text" name="suburb" label="e.g. Parramatta">',
    ],
    explain:
      "placeholder is a hint that vanishes on typing. value would put real text in the box that the visitor has to delete first.",
  },
  {
    id: "input-required",
    tag: "input",
    prompt: "Stop the form being sent unless this box has been filled in.",
    answer: '<input type="text" name="username" required>',
    options: [
      '<input type="text" name="username" required>',
      '<input type="text" name="username" required="maybe">',
      '<input type="text" name="username" mandatory>',
      '<input type="text" name="username" validate="true">',
    ],
    explain:
      "required is an on/off attribute: writing it makes the field compulsory, and the browser blocks submitting until it is filled.",
  },
  {
    id: "input-number-range",
    tag: "input",
    prompt: "Ask for an age between 13 and 19, as a number.",
    answer: '<input type="number" name="age" min="13" max="19">',
    options: [
      '<input type="number" name="age" min="13" max="19">',
      '<input type="number" name="age" range="13-19">',
      '<input type="text" name="age" min="13" max="19">',
      '<input type="number" name="age" low="13" high="19">',
    ],
    explain:
      "min and max set the smallest and largest allowed values on a number input. They do nothing on a plain text box.",
  },
  {
    id: "input-maxlength",
    tag: "input",
    prompt: "Stop the visitor typing more than 4 characters into this box.",
    answer: '<input type="text" name="pin" maxlength="4">',
    options: [
      '<input type="text" name="pin" maxlength="4">',
      '<input type="text" name="pin" max="4">',
      '<input type="text" name="pin" size="4">',
      '<input type="text" name="pin" limit="4">',
    ],
    explain:
      "maxlength counts characters typed. max is about the value of a number input, and size only changes how wide the box looks.",
  },
  {
    id: "label-for",
    tag: "label",
    prompt:
      'Tie this label to the box below it, so clicking the words focuses the box. The input is <input id="email">.',
    answer: '<label for="email">Email</label>',
    options: [
      '<label for="email">Email</label>',
      '<label id="email">Email</label>',
      '<label name="email">Email</label>',
      '<label input="email">Email</label>',
    ],
    explain:
      "A label's for attribute must match the id of its input. That pairing is what lets a screen reader announce the two together.",
  },
  {
    id: "option-value",
    tag: "option",
    prompt:
      'Show "New South Wales" in the drop-down but send the short code NSW when the form is submitted.',
    answer: '<option value="NSW">New South Wales</option>',
    options: [
      '<option value="NSW">New South Wales</option>',
      '<option name="NSW">New South Wales</option>',
      '<option value="New South Wales">NSW</option>',
      '<option send="NSW">New South Wales</option>',
    ],
    explain:
      "The text between the tags is what the visitor reads, and value is what actually gets submitted. They do not have to be the same.",
  },
  {
    id: "option-selected",
    tag: "option",
    prompt: "Make this the choice already showing when the drop-down loads.",
    answer: '<option value="qld" selected>Queensland</option>',
    options: [
      '<option value="qld" selected>Queensland</option>',
      '<option value="qld" checked>Queensland</option>',
      '<option value="qld" default>Queensland</option>',
      '<option value="qld" active>Queensland</option>',
    ],
    explain:
      "selected is the drop-down version of checked: it marks which &lt;option&gt; starts chosen.",
  },
  {
    id: "textarea-size",
    tag: "textarea",
    prompt: "Give this comment box 5 rows of height and 30 columns of width.",
    answer: '<textarea name="comment" rows="5" cols="30"></textarea>',
    options: [
      '<textarea name="comment" rows="5" cols="30"></textarea>',
      '<textarea name="comment" width="30" height="5"></textarea>',
      '<textarea name="comment" size="5x30"></textarea>',
      '<textarea name="comment" lines="5" chars="30"></textarea>',
    ],
    explain:
      "rows is how many lines of text fit, cols is how many characters wide it is. Both are counts, not pixels.",
  },
  {
    id: "input-submit-value",
    tag: "input",
    prompt:
      "Use an input as the submit button, with \"Join up\" written on it.",
    answer: '<input type="submit" value="Join up">',
    options: [
      '<input type="submit" value="Join up">',
      '<input type="submit" text="Join up">',
      '<input type="submit" label="Join up">',
      '<input type="submit">Join up</input>',
    ],
    explain:
      "On a submit input, value is the wording on the button face. An &lt;input&gt; is empty, so text cannot go between its tags.",
  },
  {
    id: "form-action-method",
    tag: "form",
    prompt: "Send this form's answers to signup.php as a POST request.",
    answer: '<form action="signup.php" method="post">',
    options: [
      '<form action="signup.php" method="post">',
      '<form href="signup.php" method="post">',
      '<form action="signup.php" type="post">',
      '<form send="signup.php" method="post">',
    ],
    explain:
      "action is where the answers are sent and method is how they travel. post keeps them out of the address bar, unlike get.",
  },
];

// ── Tier 3: lists and tables, where attributes change the structure ────────
const LIST_TABLE_QUESTIONS = [
  {
    id: "ol-type-letters",
    tag: "ol",
    prompt: "Number this ordered list with capital letters, A, B, C.",
    answer: '<ol type="A">',
    options: ['<ol type="A">', '<ol type="alpha">', '<ol list="A">', '<ol style="A">'],
    explain:
      'On an ordered list, type picks the counter style: "A" for capitals, "a" for lower case, "I" for Roman numerals, "1" for plain numbers.',
  },
  {
    id: "ol-type-roman",
    tag: "ol",
    prompt: "Number this ordered list with Roman numerals, I, II, III.",
    answer: '<ol type="I">',
    options: ['<ol type="I">', '<ol type="roman">', '<ol type="R">', '<ol numerals="roman">'],
    explain:
      'type="I" gives capital Roman numerals and type="i" gives lower case ones. The value is the shape of the first marker, not its name.',
  },
  {
    id: "ol-start",
    tag: "ol",
    prompt: "Have this list carry on from an earlier one and begin at 5.",
    answer: '<ol start="5">',
    options: ['<ol start="5">', '<ol begin="5">', '<ol value="5">', '<ol from="5">'],
    explain:
      "start sets the first number of an ordered list, which is how a list split by a paragraph keeps counting.",
  },
  {
    id: "ol-reversed",
    tag: "ol",
    prompt: "Count this top-five list down instead of up.",
    answer: "<ol reversed>",
    options: ["<ol reversed>", '<ol order="desc">', '<ol type="reverse">', "<ol descending>"],
    explain:
      "reversed is an on/off attribute that makes an ordered list count down to 1, which suits a countdown of favourites.",
  },
  {
    id: "li-value",
    tag: "li",
    prompt: "Force this one list item to be numbered 10, whatever came before it.",
    answer: '<li value="10">',
    options: ['<li value="10">', '<li start="10">', '<li number="10">', '<li index="10">'],
    explain:
      "value on a single &lt;li&gt; sets that item's number, and the items after it carry on from there. start does the same job but for the whole list.",
  },
  {
    id: "td-colspan",
    tag: "td",
    prompt: "Make this cell stretch across 3 columns of the table.",
    answer: '<td colspan="3">',
    options: ['<td colspan="3">', '<td rowspan="3">', '<td span="3">', '<td width="3">'],
    explain:
      "colspan merges a cell across columns, so it runs sideways. rowspan is the other direction.",
  },
  {
    id: "td-rowspan",
    tag: "td",
    prompt: "Make this cell run down through 2 rows of the table.",
    answer: '<td rowspan="2">',
    options: ['<td rowspan="2">', '<td colspan="2">', '<td span="2" down>', '<td height="2">'],
    explain:
      "rowspan merges a cell downwards through rows. Remember the rows underneath then need one fewer cell each.",
  },
  {
    id: "td-both-spans",
    tag: "td",
    prompt: "Make one cell cover a 2 by 2 block: two columns wide and two rows deep.",
    answer: '<td colspan="2" rowspan="2">',
    options: [
      '<td colspan="2" rowspan="2">',
      '<td span="2 2">',
      '<td colspan="2x2">',
      '<td size="2" span="2">',
    ],
    explain:
      "The two spanning attributes are independent and can be used together on the same cell, one for width and one for depth.",
  },
  {
    id: "th-scope-col",
    tag: "th",
    prompt: "Say that this header cell labels the whole column beneath it.",
    answer: '<th scope="col">Price</th>',
    options: [
      '<th scope="col">Price</th>',
      '<th scope="row">Price</th>',
      '<th type="col">Price</th>',
      '<th column="true">Price</th>',
    ],
    explain:
      'scope="col" tells a screen reader that this header belongs to everything below it, so each cell is read with its column name.',
  },
  {
    id: "th-scope-row",
    tag: "th",
    prompt:
      "This header cell sits at the start of a row and labels the cells across from it.",
    answer: '<th scope="row">Monday</th>',
    options: [
      '<th scope="row">Monday</th>',
      '<th scope="col">Monday</th>',
      '<th scope="line">Monday</th>',
      '<th row="true">Monday</th>',
    ],
    explain:
      'scope="row" marks a header as labelling the rest of its row, which is what a day or a name down the left-hand edge is doing.',
  },
  {
    id: "a-download",
    tag: "a",
    prompt: "Have this link save the file instead of opening it in the browser.",
    answer: '<a href="notes.pdf" download>Notes</a>',
    options: [
      '<a href="notes.pdf" download>Notes</a>',
      '<a href="notes.pdf" save>Notes</a>',
      '<a href="notes.pdf" type="download">Notes</a>',
      '<a download="notes.pdf">Notes</a>',
    ],
    explain:
      "download turns a link into a save. The href still has to say which file, since download only changes what happens to it.",
  },
  {
    id: "a-tel",
    tag: "a",
    prompt: "Make tapping this link on a phone start a call to 0400 000 000.",
    answer: '<a href="tel:+61400000000">Call us</a>',
    options: [
      '<a href="tel:+61400000000">Call us</a>',
      '<a href="phone:+61400000000">Call us</a>',
      '<a href="call:+61400000000">Call us</a>',
      '<a tel="+61400000000">Call us</a>',
    ],
    explain:
      "tel: in an href starts a phone call, in the same way mailto: starts an email.",
  },
  {
    id: "select-multiple",
    tag: "select",
    prompt: "Let the visitor pick more than one option from this list at a time.",
    answer: '<select name="subjects" multiple>',
    options: [
      '<select name="subjects" multiple>',
      '<select name="subjects" many>',
      '<select name="subjects" type="multi">',
      '<select name="subjects" size="multiple">',
    ],
    explain:
      "multiple turns a drop-down into a list box that accepts several choices at once.",
  },
  {
    id: "input-range",
    tag: "input",
    prompt:
      "Add a slider from 0 to 100 that moves in steps of 10.",
    answer: '<input type="range" min="0" max="100" step="10">',
    options: [
      '<input type="range" min="0" max="100" step="10">',
      '<input type="slider" min="0" max="100" step="10">',
      '<input type="range" from="0" to="100" by="10">',
      '<input type="range" min="0" max="100" interval="10">',
    ],
    explain:
      "type=\"range\" is the slider, and step decides how far each nudge moves it. Without step it moves by 1.",
  },
  {
    id: "input-date",
    tag: "input",
    prompt: "Give the visitor a date picker rather than a box to type a date into.",
    answer: '<input type="date" name="dob">',
    options: [
      '<input type="date" name="dob">',
      '<input type="calendar" name="dob">',
      '<input type="datepicker" name="dob">',
      '<input type="text" format="date" name="dob">',
    ],
    explain:
      'type="date" gets a calendar picker built into the browser, with no JavaScript needed.',
  },
  {
    id: "table-caption-id",
    tag: "table",
    prompt:
      "Give this table a class so the site's CSS can style every table like it the same way.",
    answer: '<table class="data-table">',
    options: [
      '<table class="data-table">',
      '<table id="data-table">',
      '<table style="data-table">',
      '<table type="data-table">',
    ],
    explain:
      "class is the reusable hook for styling. style would expect actual CSS declarations, not a name.",
  },
];

// ── Tier 4: the attributes on tags a learner meets later ───────────────────
const LESS_COMMON_QUESTIONS = [
  {
    id: "html-lang",
    tag: "html",
    prompt: "Say that this page is written in English.",
    answer: '<html lang="en">',
    options: ['<html lang="en">', '<html language="en">', '<html locale="en">', '<html charset="en">'],
    explain:
      "lang tells the browser and screen readers which language the page is in, so it is read out with the right pronunciation.",
  },
  {
    id: "meta-charset",
    tag: "meta",
    prompt:
      "Set the character encoding so accented letters and symbols display properly.",
    answer: '<meta charset="UTF-8">',
    options: [
      '<meta charset="UTF-8">',
      '<meta encoding="UTF-8">',
      '<meta name="charset" content="UTF-8">',
      '<meta type="UTF-8">',
    ],
    explain:
      "charset is a one-off attribute on &lt;meta&gt; and belongs near the very top of the &lt;head&gt;, before any text.",
  },
  {
    id: "meta-viewport",
    tag: "meta",
    prompt: "Make the page size itself sensibly on a phone screen.",
    answer:
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    options: [
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      '<meta viewport="width=device-width, initial-scale=1.0">',
      '<meta name="mobile" content="width=device-width">',
      '<meta content="viewport" name="width=device-width">',
    ],
    explain:
      "Most &lt;meta&gt; tags work as a name and content pair: name says which setting, content says its value.",
  },
  {
    id: "meta-description",
    tag: "meta",
    prompt:
      "Give search engines the summary sentence they show under your page's title.",
    answer:
      '<meta name="description" content="Recipes for after-school snacks.">',
    options: [
      '<meta name="description" content="Recipes for after-school snacks.">',
      '<meta description="Recipes for after-school snacks.">',
      '<meta name="summary" content="Recipes for after-school snacks.">',
      '<meta content="description" name="Recipes for after-school snacks.">',
    ],
    explain:
      'The name is "description" and the sentence goes in content. Swapping the two round is the usual slip.',
  },
  {
    id: "link-stylesheet",
    tag: "link",
    prompt: "Attach the stylesheet at styles.css to this page.",
    answer: '<link rel="stylesheet" href="styles.css">',
    options: [
      '<link rel="stylesheet" href="styles.css">',
      '<link rel="stylesheet" src="styles.css">',
      '<link type="stylesheet" href="styles.css">',
      '<link rel="css" href="styles.css">',
    ],
    explain:
      "rel says what the linked file is to this page and href says where it is. &lt;link&gt; uses href, not src.",
  },
  {
    id: "script-src",
    tag: "script",
    prompt: "Load the JavaScript in app.js from a separate file.",
    answer: '<script src="app.js"></script>',
    options: [
      '<script src="app.js"></script>',
      '<script href="app.js"></script>',
      '<script file="app.js"></script>',
      '<script link="app.js"></script>',
    ],
    explain:
      "src pulls in a script file. The tag still needs its closing &lt;/script&gt; even with nothing between the two.",
  },
  {
    id: "video-controls",
    tag: "video",
    prompt: "Give this video play, pause and volume buttons.",
    answer: '<video src="clip.mp4" controls></video>',
    options: [
      '<video src="clip.mp4" controls></video>',
      '<video src="clip.mp4" player></video>',
      '<video src="clip.mp4" controls="show"></video>',
      '<video src="clip.mp4" buttons="true"></video>',
    ],
    explain:
      "controls is an on/off attribute that shows the browser's own player. Without it the video appears with no way to start it.",
  },
  {
    id: "video-autoplay",
    tag: "video",
    prompt:
      "Have this background video start by itself and loop, which browsers only allow if it is silent.",
    answer: "<video src=\"loop.mp4\" autoplay muted loop></video>",
    options: [
      "<video src=\"loop.mp4\" autoplay muted loop></video>",
      "<video src=\"loop.mp4\" autoplay loop></video>",
      "<video src=\"loop.mp4\" autostart mute repeat></video>",
      "<video src=\"loop.mp4\" play=\"auto\" loop></video>",
    ],
    explain:
      "autoplay, muted and loop are three separate on/off attributes. Browsers block autoplay with sound, so muted is what makes autoplay actually work.",
  },
  {
    id: "img-loading-lazy",
    tag: "img",
    prompt:
      "Hold off loading this image until the visitor scrolls near it.",
    answer: '<img src="big.jpg" alt="Crowd" loading="lazy">',
    options: [
      '<img src="big.jpg" alt="Crowd" loading="lazy">',
      '<img src="big.jpg" alt="Crowd" lazy>',
      '<img src="big.jpg" alt="Crowd" loading="defer">',
      '<img src="big.jpg" alt="Crowd" defer="lazy">',
    ],
    explain:
      'loading="lazy" delays an image until it is nearly on screen, which speeds up a long page. The other value is "eager", the normal behaviour.',
  },
  {
    id: "iframe-src",
    tag: "iframe",
    prompt: "Embed the page at map.html inside a 600 by 400 window.",
    answer: '<iframe src="map.html" width="600" height="400"></iframe>',
    options: [
      '<iframe src="map.html" width="600" height="400"></iframe>',
      '<iframe href="map.html" width="600" height="400"></iframe>',
      '<iframe page="map.html" size="600x400"></iframe>',
      '<iframe src="map.html" w="600" h="400"></iframe>',
    ],
    explain:
      "An iframe pulls a whole page in, so it uses src like an image does, plus width and height for the window it sits in.",
  },
  {
    id: "abbr-title",
    tag: "abbr",
    prompt: "Show what HTML stands for when the reader hovers over it.",
    answer: '<abbr title="HyperText Markup Language">HTML</abbr>',
    options: [
      '<abbr title="HyperText Markup Language">HTML</abbr>',
      '<abbr full="HyperText Markup Language">HTML</abbr>',
      '<abbr alt="HyperText Markup Language">HTML</abbr>',
      '<abbr expand="HyperText Markup Language">HTML</abbr>',
    ],
    explain:
      "title holds the full wording of an abbreviation, and the short form stays as the visible text.",
  },
  {
    id: "time-datetime",
    tag: "time",
    prompt:
      'Write "next Tuesday" for readers while giving a computer the exact date.',
    answer: '<time datetime="2026-08-18">next Tuesday</time>',
    options: [
      '<time datetime="2026-08-18">next Tuesday</time>',
      '<time date="2026-08-18">next Tuesday</time>',
      '<time value="2026-08-18">next Tuesday</time>',
      '<time datetime="next Tuesday">2026-08-18</time>',
    ],
    explain:
      "datetime holds the machine-readable date in year-month-day order, while the friendly wording stays between the tags.",
  },
  {
    id: "details-open",
    tag: "details",
    prompt: "Have this collapsible block already showing when the page loads.",
    answer: "<details open>",
    options: ["<details open>", '<details show="true">', "<details expanded>", '<details state="open">'],
    explain:
      "open is an on/off attribute that starts a &lt;details&gt; block unfolded. Leave it off and the block starts shut.",
  },
  {
    id: "input-disabled",
    tag: "input",
    prompt:
      "Grey this box out so it cannot be used and its value is not submitted.",
    answer: '<input type="text" name="code" disabled>',
    options: [
      '<input type="text" name="code" disabled>',
      '<input type="text" name="code" readonly>',
      '<input type="text" name="code" locked>',
      '<input type="text" name="code" enabled="false">',
    ],
    explain:
      "disabled switches a control off entirely, so it is greyed out and its value is left out of the form. readonly still submits.",
  },
  {
    id: "input-readonly",
    tag: "input",
    prompt:
      "Show a value the visitor can read and copy but not change, and still send it with the form.",
    answer: '<input type="text" name="ref" value="AB-1234" readonly>',
    options: [
      '<input type="text" name="ref" value="AB-1234" readonly>',
      '<input type="text" name="ref" value="AB-1234" disabled>',
      '<input type="text" name="ref" value="AB-1234" locked>',
      '<input type="text" name="ref" value="AB-1234" editable="false">',
    ],
    explain:
      "readonly blocks editing but keeps the field in the form, which is the difference between it and disabled.",
  },
  {
    id: "input-name-id-pair",
    tag: "input",
    prompt:
      'This input must be reachable by <label for="phone"> and submit under the name "phone". Which one does both?',
    answer: '<input type="tel" id="phone" name="phone">',
    options: [
      '<input type="tel" id="phone" name="phone">',
      '<input type="tel" name="phone">',
      '<input type="tel" id="phone">',
      '<input type="tel" for="phone" name="phone">',
    ],
    explain:
      "id is what a label points at and name is what the answer is submitted under, so an input in a form usually wants both. for belongs on the label, never on the input.",
  },
];

/*
  The four tiers, in the order a run walks them.

  `difficulty` drives a badge on the prompt panel, using the same easy/medium/
  hard/expert wording and the same semantic colours as Understanding Tags and
  Match the CSS. The tier's own name goes on the title bar in the quiz's
  category colour, so difficulty and category never share a colour.
*/
const ATTRIBUTE_QUIZ_TIERS = [
  {
    id: "links-images",
    name: "Links & Images",
    difficulty: "easy",
    description: "href, src, alt, id and class: the first attributes you write.",
    questions: LINK_IMAGE_QUESTIONS,
  },
  {
    id: "forms",
    name: "Forms & Inputs",
    difficulty: "medium",
    description: "Input types, radio groups, checked, required and labels.",
    questions: FORM_QUESTIONS,
  },
  {
    id: "lists-tables",
    name: "Lists & Tables",
    difficulty: "hard",
    description: "Spanning table cells, header scope and list numbering.",
    questions: LIST_TABLE_QUESTIONS,
  },
  {
    id: "less-common",
    name: "Head & Media",
    difficulty: "expert",
    description: "The head of the page, media players and the rarer attributes.",
    questions: LESS_COMMON_QUESTIONS,
  },
];
