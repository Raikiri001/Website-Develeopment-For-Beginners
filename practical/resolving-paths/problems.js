/*
  Resolving Paths - problem library.

  Twenty problems across four categories, ordered by how far the learner has
  to travel through the folder tree: everything side by side, then down into a
  folder, then back up one level, then several levels up and across.

  Each problem is a project folder plus one file inside it that the learner is
  "editing", and a snippet from that file with its src, href and alt values
  blanked out. The learner reads the tree and types the path that gets from
  the file they are in to the file they want.

  Field notes:
    - `tree` is the project folder, as an array in the order it should be
      shown. A string is a file; an object with `folder` and `children` is a
      folder. Folder names never carry a trailing slash, the renderer adds it.
    - `editing` is the path, from the top of the project, of the file the
      snippet comes from. It must exist in the tree, since it is what every
      relative path in that snippet is worked out from.
    - `code` lines use {{name}} where a blank goes.
    - `blanks.<name>.kind` is either "path" or "alt".
        path: `target` is the file the path has to reach, again from the top
        of the project. Answers are not string-matched, they are resolved
        against the tree the same way a browser would, so any path that lands
        on the target file is accepted (with or without a leading ./, and
        however roundabout the route).
        alt: there is no single right answer, so `example` holds one good
        one, shown once the learner has written something workable.
    - `hint` describes the journey in words without giving the path itself.

  This file holds data only. All logic lives in app.js.
*/

const PATH_CATEGORIES = [
  {
    id: "same-folder",
    name: "One Folder",
    color: "#4fc3f7",
    description: "Every file sits side by side, so a path is just a filename.",
    problems: [
      {
        id: "same-1",
        title: "Logo and a Link",
        brief:
          "Everything in this little site sits in the one folder. Point the image at the logo and the link at the About page.",
        editing: "index.html",
        tree: ["index.html", "about.html", "logo.png"],
        code: [
          '<img src="{{src}}" alt="{{alt}}">',
          '<a href="{{href}}">About us</a>',
        ],
        blanks: {
          src: { kind: "path", target: "logo.png" },
          alt: { kind: "alt", example: "Sunrise Cafe logo" },
          href: { kind: "path", target: "about.html" },
        },
        hint: "When a file is in the same folder as the one you are editing, the path is nothing more than its name.",
      },
      {
        id: "same-2",
        title: "The Gallery Page",
        brief:
          "You are editing the gallery page this time, not the home page. The folder is still flat.",
        editing: "gallery.html",
        tree: ["index.html", "gallery.html", "contact.html", "team-photo.jpg"],
        code: [
          '<img src="{{src}}" alt="{{alt}}">',
          '<a href="{{href}}">Get in touch</a>',
        ],
        blanks: {
          src: { kind: "path", target: "team-photo.jpg" },
          alt: { kind: "alt", example: "The whole team outside the shop" },
          href: { kind: "path", target: "contact.html" },
        },
        hint: "Which file you are editing is what a path is measured from. Here it makes no difference, because everything is in the same folder.",
      },
      {
        id: "same-3",
        title: "Capital Letters Count",
        brief:
          "Read these filenames carefully. Type them exactly as the tree shows them, capitals and all.",
        editing: "index.html",
        tree: ["index.html", "Menu.html", "Coffee-Cup.PNG"],
        code: [
          '<img src="{{src}}" alt="{{alt}}">',
          '<a href="{{href}}">See the menu</a>',
        ],
        blanks: {
          src: { kind: "path", target: "Coffee-Cup.PNG" },
          alt: { kind: "alt", example: "A flat white in a takeaway cup" },
          href: { kind: "path", target: "Menu.html" },
        },
        hint: "Most web servers treat Menu.html and menu.html as two different files. Copy the capitals from the tree exactly.",
      },
      {
        id: "same-4",
        title: "Two Links, One Image",
        brief:
          "Three blanks on the home page of a flat site. Match each one to the file it names.",
        editing: "index.html",
        tree: [
          "index.html",
          "prices.html",
          "hours.html",
          "shop-front.jpg",
        ],
        code: [
          '<img src="{{src}}" alt="{{alt}}">',
          '<a href="{{prices}}">Our prices</a>',
          '<a href="{{hours}}">Opening hours</a>',
        ],
        blanks: {
          src: { kind: "path", target: "shop-front.jpg" },
          alt: { kind: "alt", example: "The front of the shop from the street" },
          prices: { kind: "path", target: "prices.html" },
          hours: { kind: "path", target: "hours.html" },
        },
        hint: "Nothing new here: three files in the same folder, three plain filenames.",
      },
      {
        id: "same-5",
        title: "Linking Back Home",
        brief:
          "You are on the About page and want a link back to the home page.",
        editing: "about.html",
        tree: ["index.html", "about.html", "staff.jpg"],
        code: [
          '<img src="{{src}}" alt="{{alt}}">',
          '<a href="{{href}}">Back to the home page</a>',
        ],
        blanks: {
          src: { kind: "path", target: "staff.jpg" },
          alt: { kind: "alt", example: "Three staff members behind the counter" },
          href: { kind: "path", target: "index.html" },
        },
        hint: "A link home is just a link to index.html, and index.html is right next to the file you are editing.",
      },
    ],
  },
  {
    id: "into-folder",
    name: "Into a Folder",
    color: "#81c784",
    description: "The files you want are tucked inside folders below you.",
    problems: [
      {
        id: "sub-1",
        title: "Images in Their Own Folder",
        brief:
          "The pictures have been tidied into an images folder. The path has to say so.",
        editing: "index.html",
        tree: [
          "index.html",
          "about.html",
          { folder: "images", children: ["logo.png"] },
        ],
        code: [
          '<img src="{{src}}" alt="{{alt}}">',
          '<a href="{{href}}">About us</a>',
        ],
        blanks: {
          src: { kind: "path", target: "images/logo.png" },
          alt: { kind: "alt", example: "Riverside Books logo" },
          href: { kind: "path", target: "about.html" },
        },
        hint: "To go into a folder, write the folder name, a forward slash, then the filename inside it.",
      },
      {
        id: "sub-2",
        title: "Pages in Their Own Folder",
        brief:
          "Both the images and the other pages have folders of their own now.",
        editing: "index.html",
        tree: [
          "index.html",
          { folder: "images", children: ["banner.jpg"] },
          { folder: "pages", children: ["about.html", "contact.html"] },
        ],
        code: [
          '<img src="{{src}}" alt="{{alt}}">',
          '<a href="{{href}}">About us</a>',
        ],
        blanks: {
          src: { kind: "path", target: "images/banner.jpg" },
          alt: { kind: "alt", example: "A row of bikes along a river path" },
          href: { kind: "path", target: "pages/about.html" },
        },
        hint: "Links work exactly like images do. Name the folder, then a slash, then the file.",
      },
      {
        id: "sub-3",
        title: "A Folder Inside a Folder",
        brief:
          "The product shots are one level deeper again. Walk down both folders.",
        editing: "index.html",
        tree: [
          "index.html",
          "shop.html",
          {
            folder: "images",
            children: [
              "logo.png",
              { folder: "products", children: ["shoe.png"] },
            ],
          },
        ],
        code: [
          '<img src="{{src}}" alt="{{alt}}">',
          '<a href="{{href}}">Visit the shop</a>',
        ],
        blanks: {
          src: { kind: "path", target: "images/products/shoe.png" },
          alt: { kind: "alt", example: "A blue running shoe on a white background" },
          href: { kind: "path", target: "shop.html" },
        },
        hint: "Each folder you go into adds its name and another slash, in the order you pass through them.",
      },
      {
        id: "sub-4",
        title: "The Assets Folder",
        brief:
          "This project keeps everything that is not a page inside assets. Follow it down.",
        editing: "index.html",
        tree: [
          "index.html",
          {
            folder: "assets",
            children: [{ folder: "img", children: ["team.jpg"] }],
          },
          { folder: "pages", children: ["team.html"] },
        ],
        code: [
          '<img src="{{src}}" alt="{{alt}}">',
          '<a href="{{href}}">Meet the team</a>',
          "<!-- Both paths start from index.html, at the top of the project -->",
        ],
        blanks: {
          src: { kind: "path", target: "assets/img/team.jpg" },
          alt: { kind: "alt", example: "The team on the stairs outside the office" },
          href: { kind: "path", target: "pages/team.html" },
        },
        hint: "Two folders down for the image, one for the page. Read the tree from the top and write down the names you pass.",
      },
      {
        id: "sub-5",
        title: "Two Deep Folders",
        brief:
          "Photos are filed by year, and blog posts by folder. Both paths run two folders deep.",
        editing: "index.html",
        tree: [
          "index.html",
          {
            folder: "photos",
            children: [{ folder: "2026", children: ["sports-day.jpg"] }],
          },
          {
            folder: "blog",
            children: [{ folder: "posts", children: ["first-day.html"] }],
          },
        ],
        code: [
          '<img src="{{src}}" alt="{{alt}}">',
          '<a href="{{href}}">Read the first post</a>',
        ],
        blanks: {
          src: { kind: "path", target: "photos/2026/sports-day.jpg" },
          alt: { kind: "alt", example: "Students running the hundred metres" },
          href: { kind: "path", target: "blog/posts/first-day.html" },
        },
        hint: "A folder called 2026 is still just a folder name, even though it looks like a number.",
      },
    ],
  },
  {
    id: "back-up",
    name: "Back Up a Level",
    color: "#ffb74d",
    description: "You are inside a folder now, so some paths have to climb out.",
    problems: [
      {
        id: "up-1",
        title: "Out of the Pages Folder",
        brief:
          "You are editing a file inside pages, and both the things you want are outside it.",
        editing: "pages/about.html",
        tree: [
          "index.html",
          { folder: "images", children: ["logo.png"] },
          { folder: "pages", children: ["about.html"] },
        ],
        code: [
          '<img src="{{src}}" alt="{{alt}}">',
          '<a href="{{href}}">Back to the home page</a>',
        ],
        blanks: {
          src: { kind: "path", target: "images/logo.png" },
          alt: { kind: "alt", example: "Riverside Books logo" },
          href: { kind: "path", target: "index.html" },
        },
        hint: "Two dots and a slash, ../, means \"go up out of this folder\". From there you can walk down into another one.",
      },
      {
        id: "up-2",
        title: "Up, or Not At All",
        brief:
          "One of these two files is in the same folder as the one you are editing. Only the other needs to climb out.",
        editing: "pages/contact.html",
        tree: [
          "index.html",
          { folder: "images", children: ["map.png"] },
          { folder: "pages", children: ["about.html", "contact.html"] },
        ],
        code: [
          '<img src="{{src}}" alt="{{alt}}">',
          '<a href="{{href}}">About us</a>',
        ],
        blanks: {
          src: { kind: "path", target: "images/map.png" },
          alt: { kind: "alt", example: "A map showing the shop near the station" },
          href: { kind: "path", target: "pages/about.html" },
        },
        hint: "about.html sits beside the file you are editing, inside pages, so it needs no ../ at all. The image is not in pages.",
      },
      {
        id: "up-3",
        title: "Between Blog Posts",
        brief:
          "Link one post to the next, and pull in a photo kept outside the blog folder.",
        editing: "blog/post-one.html",
        tree: [
          "index.html",
          { folder: "images", children: ["photo.jpg"] },
          { folder: "blog", children: ["post-one.html", "post-two.html"] },
        ],
        code: [
          '<img src="{{src}}" alt="{{alt}}">',
          '<a href="{{href}}">Read the next post</a>',
        ],
        blanks: {
          src: { kind: "path", target: "images/photo.jpg" },
          alt: { kind: "alt", example: "A notebook and a coffee on a desk" },
          href: { kind: "path", target: "blog/post-two.html" },
        },
        hint: "Going up and straight back down into the same folder you are already in would work, but there is a much shorter way to reach a neighbour.",
      },
      {
        id: "up-4",
        title: "Up and Two Down",
        brief:
          "The image is outside your folder and then two folders deep. Climb out first, then walk down.",
        editing: "shop/cart.html",
        tree: [
          "index.html",
          {
            folder: "assets",
            children: [{ folder: "img", children: ["box.png"] }],
          },
          { folder: "shop", children: ["cart.html"] },
        ],
        code: [
          '<img src="{{src}}" alt="{{alt}}">',
          '<a href="{{href}}">Back to the home page</a>',
        ],
        blanks: {
          src: { kind: "path", target: "assets/img/box.png" },
          alt: { kind: "alt", example: "An empty cardboard box" },
          href: { kind: "path", target: "index.html" },
        },
        hint: "Write the journey in order: out of shop, into assets, into img, then the filename.",
      },
      {
        id: "up-5",
        title: "A Folder Below You",
        brief:
          "This page keeps its own pictures in a folder beside it. One path goes down, one goes up.",
        editing: "pages/about.html",
        tree: [
          "index.html",
          "contact.html",
          {
            folder: "pages",
            children: [
              "about.html",
              { folder: "img", children: ["portrait.jpg"] },
            ],
          },
        ],
        code: [
          '<img src="{{src}}" alt="{{alt}}">',
          '<a href="{{href}}">Get in touch</a>',
        ],
        blanks: {
          src: { kind: "path", target: "pages/img/portrait.jpg" },
          alt: { kind: "alt", example: "The owner standing in the doorway" },
          href: { kind: "path", target: "contact.html" },
        },
        hint: "The img folder is inside pages, and so is the file you are editing, so the image needs no ../. contact.html is not.",
      },
    ],
  },
  {
    id: "deep",
    name: "Deep Structure",
    color: "#ce93d8",
    description: "Several levels up, across, and back down again.",
    problems: [
      {
        id: "deep-1",
        title: "Two Levels Up",
        brief:
          "Posts are filed by year now, so you are two folders deep. Both paths have to climb all the way out.",
        editing: "blog/2026/march.html",
        tree: [
          "index.html",
          { folder: "images", children: ["spring.jpg"] },
          {
            folder: "blog",
            children: [{ folder: "2026", children: ["march.html"] }],
          },
        ],
        code: [
          '<img src="{{src}}" alt="{{alt}}">',
          '<a href="{{href}}">Back to the home page</a>',
        ],
        blanks: {
          src: { kind: "path", target: "images/spring.jpg" },
          alt: { kind: "alt", example: "Blossom on a tree in the park" },
          href: { kind: "path", target: "index.html" },
        },
        hint: "Each ../ climbs one folder, so climbing two takes two of them, one after the other.",
      },
      {
        id: "deep-2",
        title: "The Legal Pages",
        brief:
          "Three blanks: one neighbour, one climb to the top, and one climb followed by two folders down.",
        editing: "pages/legal/privacy.html",
        tree: [
          "index.html",
          {
            folder: "assets",
            children: [{ folder: "img", children: ["seal.png"] }],
          },
          {
            folder: "pages",
            children: [
              { folder: "legal", children: ["privacy.html", "terms.html"] },
            ],
          },
        ],
        code: [
          '<img src="{{src}}" alt="{{alt}}">',
          '<a href="{{terms}}">Terms and conditions</a>',
          '<a href="{{home}}">Back to the home page</a>',
        ],
        blanks: {
          src: { kind: "path", target: "assets/img/seal.png" },
          alt: { kind: "alt", example: "A trust seal awarded in 2026" },
          terms: { kind: "path", target: "pages/legal/terms.html" },
          home: { kind: "path", target: "index.html" },
        },
        hint: "terms.html is right beside the file you are editing. The other two both start by climbing out of legal and then out of pages.",
      },
      {
        id: "deep-3",
        title: "Across to Another Year",
        brief:
          "Link across to a page in a neighbouring folder: up one, then straight back down into the folder next door.",
        editing: "courses/year10/html.html",
        tree: [
          "index.html",
          { folder: "images", children: ["badge.png"] },
          {
            folder: "courses",
            children: [
              { folder: "year9", children: ["intro.html"] },
              { folder: "year10", children: ["html.html"] },
            ],
          },
        ],
        code: [
          '<img src="{{src}}" alt="{{alt}}">',
          '<a href="{{href}}">Year 9 introduction</a>',
        ],
        blanks: {
          src: { kind: "path", target: "images/badge.png" },
          alt: { kind: "alt", example: "A web design course badge" },
          href: { kind: "path", target: "courses/year9/intro.html" },
        },
        hint: "year9 and year10 are neighbours inside courses, so reaching one from the other means going up just once, then down into the other.",
      },
      {
        id: "deep-4",
        title: "Three Levels Deep",
        brief:
          "The deepest one yet. Count the folders between you and the top of the project before you type.",
        editing: "shop/items/hats/red-cap.html",
        tree: [
          "index.html",
          { folder: "images", children: ["red-cap.jpg"] },
          {
            folder: "shop",
            children: [
              {
                folder: "items",
                children: [
                  { folder: "hats", children: ["red-cap.html"] },
                  { folder: "boots", children: ["black-boot.html"] },
                ],
              },
            ],
          },
        ],
        code: [
          '<img src="{{src}}" alt="{{alt}}">',
          '<a href="{{href}}">Black boots</a>',
        ],
        blanks: {
          src: { kind: "path", target: "images/red-cap.jpg" },
          alt: { kind: "alt", example: "A red baseball cap" },
          href: { kind: "path", target: "shop/items/boots/black-boot.html" },
        },
        hint: "You are inside hats, inside items, inside shop, so the image is three climbs away. The boots page is only one climb and one step down.",
      },
      {
        id: "deep-5",
        title: "Down From Deep",
        brief:
          "Not everything is above you. One of these is in a folder sitting right beside the file you are editing.",
        editing: "blog/2026/march/post.html",
        tree: [
          "index.html",
          {
            folder: "blog",
            children: [
              {
                folder: "2026",
                children: [
                  {
                    folder: "march",
                    children: [
                      "post.html",
                      { folder: "photos", children: ["cover.jpg"] },
                    ],
                  },
                  { folder: "february", children: ["post.html"] },
                ],
              },
            ],
          },
        ],
        code: [
          '<img src="{{src}}" alt="{{alt}}">',
          '<a href="{{href}}">Last month\'s post</a>',
        ],
        blanks: {
          src: { kind: "path", target: "blog/2026/march/photos/cover.jpg" },
          alt: { kind: "alt", example: "A crowd at the March markets" },
          href: { kind: "path", target: "blog/2026/february/post.html" },
        },
        hint: "The photos folder is inside march, and so are you, so that path only goes down. February is one climb up and one step across.",
      },
    ],
  },
];
