/**
 * Match the CSS - question bank, grouped into categories like the HTML
 * Structure Trainer's problem sidebar. app.js reads this as a global.
 *
 * category.questions[] entries, authored easy -> hard within each category
 * (array order IS the progression; `difficulty` only drives the UI badge):
 *
 * html     shared markup, identical across all 5 choices for a question.
 * css      the CORRECT CSS, as { rules: [ { selector, decls: {prop: value} } ] }.
 * explain  one-sentence note shown after answering.
 *
 * The five choices and which one is correct are NOT in this file - they're
 * encrypted in answers.json (keyed by question id), fetched and decrypted
 * by app.js at runtime, same scheme as html-drag-and-drop/solutions.json.
 * This is deliberate: a plaintext `overrides: {}` choice sitting next to
 * four populated decoys would visually give away the answer on its own,
 * with or without a separate correctChoiceId field. To edit a question's
 * choices, edit scripts/encrypt-answers.js's match-the-css builder (it
 * derives each choice's rendered CSS from the existing decoy data) and
 * re-run `node scripts/encrypt-answers.js match-the-css` to regenerate
 * answers.json - see that script for the full explanation.
 *
 * Difficulty tiers, and why hard isn't "spot the pixel":
 * - easy:   2-4 simultaneous changes per decoy, each individually obvious.
 * - medium: 1-2 changes per decoy, moderate magnitude - a couple of small
 *           but real cues working together.
 * - hard:   exactly 1 property changed per decoy, but with a CLEARLY
 *           visible delta (a big padding/radius/size swing, a real colour
 *           jump, a full font-weight step). What makes it hard isn't that
 *           the difference is imperceptible, it's that there's only one
 *           place to look and no second cue to lean on, so you have to
 *           check every declaration rather than glance-and-guess.
 */

const ELEMENTS_QUESTIONS = [
  // ── Easy (el01-el10): 2-4 simultaneous, obviously different changes ──
  {
    id: "el01",
    difficulty: "easy",
    html: `<button class="btn">Subscribe</button>`,
    css: {
      rules: [
        {
          selector: ".btn",
          decls: {
            background: "#2563eb",
            color: "#ffffff",
            padding: "10px 20px",
            "border-radius": "6px",
            border: "none",
            "font-family": "sans-serif",
            "font-size": "14px",
          },
        },
      ],
    },
    explain:
      "The correct button is solid blue, rounded and comfortably padded, exactly as declared in the CSS above.",
  },
  {
    id: "el02",
    difficulty: "easy",
    html: `<div class="badge">New</div>`,
    css: {
      rules: [
        {
          selector: ".badge",
          decls: {
            display: "inline-block",
            background: "#ecfdf5",
            color: "#047857",
            padding: "4px 12px",
            "border-radius": "999px",
            "font-size": "12px",
            "font-weight": "600",
            border: "1px solid #a7f3d0",
          },
        },
      ],
    },
    explain: "The real badge is a soft green pill with a matching light green border.",
  },
  {
    id: "el03",
    difficulty: "easy",
    html: `<div class="alert"><strong>Heads up:</strong> Your session will expire soon.</div>`,
    css: {
      rules: [
        {
          selector: ".alert",
          decls: {
            background: "#eff6ff",
            border: "1px solid #93c5fd",
            "border-left": "4px solid #2563eb",
            color: "#1e3a8a",
            padding: "12px 16px",
            "border-radius": "8px",
            "font-size": "14px",
          },
        },
      ],
    },
    explain: "The real alert is pale blue with a thin blue accent bar on the left, not red or green.",
  },
  {
    id: "el04",
    difficulty: "easy",
    html: `<a class="tab" href="#">Overview</a>`,
    css: {
      rules: [
        {
          selector: ".tab",
          decls: {
            display: "inline-block",
            padding: "8px 18px",
            "border-radius": "6px 6px 0 0",
            background: "#f1f5f9",
            color: "#0f172a",
            "font-weight": "600",
            "border-bottom": "3px solid transparent",
            "text-decoration": "none",
          },
        },
      ],
    },
    explain: "The real tab has a light grey background and an invisible (transparent) bottom border, so it looks flat and inactive.",
  },
  {
    id: "el05",
    difficulty: "easy",
    html: `<div class="avatar">JS</div>`,
    css: {
      rules: [
        {
          selector: ".avatar",
          decls: {
            display: "inline-flex",
            "align-items": "center",
            "justify-content": "center",
            width: "44px",
            height: "44px",
            "border-radius": "50%",
            background: "#6366f1",
            color: "#ffffff",
            "font-weight": "700",
            "font-size": "16px",
          },
        },
      ],
    },
    explain: "The real avatar is a small solid-indigo circle, not a square, a giant blob, or an outlined ring.",
  },
  {
    id: "el06",
    difficulty: "easy",
    html: `<input class="field" type="text" placeholder="Email address" />`,
    css: {
      rules: [
        {
          selector: ".field",
          decls: {
            padding: "10px 14px",
            border: "1px solid #cbd5e1",
            "border-radius": "8px",
            "font-size": "14px",
            width: "220px",
            background: "#ffffff",
            color: "#0f172a",
          },
        },
      ],
    },
    explain: "The real field is a plain white box with a thin grey border and slightly rounded corners.",
  },
  {
    id: "el07",
    difficulty: "easy",
    html: `<a class="link-btn" href="#">Learn more</a>`,
    css: {
      rules: [
        {
          selector: ".link-btn",
          decls: {
            display: "inline-block",
            padding: "10px 22px",
            border: "2px solid #16a34a",
            color: "#16a34a",
            "border-radius": "6px",
            "font-weight": "600",
            "text-decoration": "none",
          },
        },
      ],
    },
    explain: "The real link is an outline-only button: green text and a green border, no fill.",
  },
  {
    id: "el08",
    difficulty: "easy",
    html: `<div class="mini-bar"><div class="mini-fill"></div></div>`,
    css: {
      rules: [
        {
          selector: ".mini-bar",
          decls: { width: "160px", height: "8px", background: "#e2e8f0", "border-radius": "999px", overflow: "hidden" },
        },
        { selector: ".mini-fill", decls: { width: "65%", height: "100%", background: "#2563eb" } },
      ],
    },
    explain: "The real bar is filled about two-thirds of the way with blue, on a light grey track.",
  },
  {
    id: "el09",
    difficulty: "easy",
    html: `<div class="chip">Design</div>`,
    css: {
      rules: [
        {
          selector: ".chip",
          decls: {
            display: "inline-flex",
            "align-items": "center",
            padding: "4px 14px",
            background: "#f5f3ff",
            color: "#6d28d9",
            "border-radius": "999px",
            "font-size": "13px",
            "font-weight": "600",
          },
        },
      ],
    },
    explain: "The real chip is a small solid lavender pill with purple text, no border.",
  },
  {
    id: "el10",
    difficulty: "easy",
    html: `<div class="box">Content area</div>`,
    css: {
      rules: [
        {
          selector: ".box",
          decls: {
            padding: "20px",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            "border-radius": "12px",
            "box-shadow": "0 4px 12px rgba(15,23,42,0.08)",
          },
        },
      ],
    },
    explain: "The real box is a plain white card with a soft shadow and gently rounded corners.",
  },

  // ── Medium (el11-el20): 1-2 property changes, moderate magnitude ──
  {
    id: "el11",
    difficulty: "medium",
    html: `<button class="btn-md">Save changes</button>`,
    css: {
      rules: [
        {
          selector: ".btn-md",
          decls: {
            background: "#2563eb",
            color: "#ffffff",
            padding: "10px 18px",
            "border-radius": "8px",
            border: "none",
            "font-weight": "600",
            "font-size": "14px",
          },
        },
      ],
    },
    explain:
      "The real button uses 18px horizontal padding, an 8px radius, #2563eb and 600 weight; every other option changes exactly one of those.",
  },
  {
    id: "el12",
    difficulty: "medium",
    html: `<div class="note-card"><p>Meeting notes</p></div>`,
    css: {
      rules: [
        {
          selector: ".note-card",
          decls: {
            padding: "16px 18px",
            background: "#fefce8",
            border: "1px solid #fde68a",
            "border-radius": "10px",
            "box-shadow": "0 2px 6px rgba(120,53,15,0.08)",
          },
        },
      ],
    },
    explain: "The real card uses a slightly deeper cream background (#fefce8) and a matching #fde68a border.",
  },
  {
    id: "el13",
    difficulty: "medium",
    html: `<div class="status-pill">Active</div>`,
    css: {
      rules: [
        {
          selector: ".status-pill",
          decls: {
            display: "inline-block",
            background: "#dcfce7",
            color: "#15803d",
            padding: "5px 14px",
            "border-radius": "999px",
            "font-size": "12px",
            "font-weight": "700",
          },
        },
      ],
    },
    explain: "The real pill keeps padding at 5px 14px, text colour #15803d, 12px text and 700 weight; each decoy nudges just one of those.",
  },
  {
    id: "el14",
    difficulty: "medium",
    html: `<div class="warn-box">Storage almost full.</div>`,
    css: {
      rules: [
        {
          selector: ".warn-box",
          decls: {
            background: "#fffbeb",
            border: "1px solid #fcd34d",
            color: "#92400e",
            padding: "12px 16px",
            "border-radius": "8px",
            "font-size": "14px",
          },
        },
      ],
    },
    explain: "The real warning box borders in #fcd34d and its text sits at #92400e, both a shade lighter than the decoys.",
  },
  {
    id: "el15",
    difficulty: "medium",
    html: `<a class="tab-active" href="#">Settings</a>`,
    css: {
      rules: [
        {
          selector: ".tab-active",
          decls: {
            display: "inline-block",
            padding: "9px 16px",
            color: "#2563eb",
            "font-weight": "700",
            "border-bottom": "2px solid #2563eb",
            "text-decoration": "none",
          },
        },
      ],
    },
    explain: "The real active tab has a 2px underline, not 3px, and sits at exactly #2563eb.",
  },
  {
    id: "el16",
    difficulty: "medium",
    html: `<div class="avatar-md">RT</div>`,
    css: {
      rules: [
        {
          selector: ".avatar-md",
          decls: {
            display: "inline-flex",
            "align-items": "center",
            "justify-content": "center",
            width: "40px",
            height: "40px",
            "border-radius": "50%",
            background: "#0891b2",
            color: "#ffffff",
            "font-size": "14px",
            "font-weight": "700",
          },
        },
      ],
    },
    explain: "The real avatar is a full circle (50% radius) at 40px, in #0891b2 exactly.",
  },
  {
    id: "el17",
    difficulty: "medium",
    html: `<input class="field-active" type="text" value="alex@example.com" />`,
    css: {
      rules: [
        {
          selector: ".field-active",
          decls: {
            padding: "10px 14px",
            border: "2px solid #2563eb",
            "border-radius": "8px",
            "font-size": "14px",
            width: "220px",
            "box-shadow": "0 0 0 3px rgba(37,99,235,0.15)",
          },
        },
      ],
    },
    explain: "The real focused field has a 2px border and a 3px soft glow, not 3px/5px.",
  },
  {
    id: "el18",
    difficulty: "medium",
    html: `<div class="toggle-on"></div>`,
    css: {
      rules: [
        {
          selector: ".toggle-on",
          decls: { display: "inline-block", width: "44px", height: "24px", "border-radius": "999px", background: "#16a34a" },
        },
      ],
    },
    explain: "The real toggle track is 44x24px in #16a34a, a pill shape rather than a rounded rectangle.",
  },
  {
    id: "el19",
    difficulty: "medium",
    html: `<div class="tooltip">Click to copy</div>`,
    css: {
      rules: [
        {
          selector: ".tooltip",
          decls: { background: "#1e293b", color: "#f8fafc", padding: "6px 12px", "border-radius": "6px", "font-size": "12px" },
        },
      ],
    },
    explain: "The real tooltip keeps padding at 6px 12px, a 6px radius, background #1e293b and 12px text; each decoy nudges just one of those.",
  },
  {
    id: "el20",
    difficulty: "medium",
    html: `<div class="list-row"><div class="dot"></div>Task completed</div>`,
    css: {
      rules: [
        {
          selector: ".list-row",
          decls: { display: "flex", "align-items": "center", gap: "10px", "font-size": "14px", color: "#0f172a" },
        },
        { selector: ".dot", decls: { width: "8px", height: "8px", "border-radius": "50%", background: "#16a34a" } },
      ],
    },
    explain: "The real row keeps a tight 10px gap and an 8px dot, both smaller than the decoys.",
  },

  // ── Hard (el21-el30): exactly 1 property changed, but a clear delta ──
  {
    id: "el21",
    difficulty: "hard",
    html: `<button class="btn-sm">Confirm</button>`,
    css: {
      rules: [
        {
          selector: ".btn-sm",
          decls: {
            background: "#1d4ed8",
            color: "#ffffff",
            padding: "9px 16px",
            "border-radius": "6px",
            border: "none",
            "font-size": "14px",
            "font-weight": "600",
          },
        },
      ],
    },
    explain: "The real button keeps padding at 9px 16px, a 6px radius, background #1d4ed8 and 14px text; each decoy nudges just one of those.",
  },
  {
    id: "el22",
    difficulty: "hard",
    html: `<div class="tag-sm">Beta</div>`,
    css: {
      rules: [
        {
          selector: ".tag-sm",
          decls: { display: "inline-block", background: "#e0f2fe", color: "#0369a1", padding: "3px 10px", "border-radius": "999px", "font-size": "11px", "font-weight": "700" },
        },
      ],
    },
    explain: "The real tag keeps padding at 3px 10px, text colour #0369a1, 11px text and a true pill radius; each decoy nudges just one of those.",
  },
  {
    id: "el23",
    difficulty: "hard",
    html: `<div class="info-box">Backup complete.</div>`,
    css: {
      rules: [
        {
          selector: ".info-box",
          decls: { background: "#f0f9ff", border: "1px solid #bae6fd", color: "#075985", padding: "10px 14px", "border-radius": "8px", "font-size": "13px" },
        },
      ],
    },
    explain: "The real box keeps padding at 10px 14px, an 8px radius, border colour #bae6fd and 13px text; each decoy nudges just one of those.",
  },
  {
    id: "el24",
    difficulty: "hard",
    html: `<a class="tab-sm" href="#">Billing</a>`,
    css: {
      rules: [
        {
          selector: ".tab-sm",
          decls: { display: "inline-block", padding: "7px 14px", color: "#334155", "font-weight": "600", "border-bottom": "2px solid transparent", "text-decoration": "none" },
        },
      ],
    },
    explain: "The real tab keeps padding at 7px 14px, text colour #334155, 600 weight and normal casing; each decoy nudges just one of those.",
  },
  {
    id: "el25",
    difficulty: "hard",
    html: `<div class="avatar-sm">KP</div>`,
    css: {
      rules: [
        {
          selector: ".avatar-sm",
          decls: { display: "inline-flex", "align-items": "center", "justify-content": "center", width: "36px", height: "36px", "border-radius": "50%", background: "#7c3aed", color: "#ffffff", "font-size": "13px", "font-weight": "700" },
        },
      ],
    },
    explain: "The real avatar keeps a 36px circle, background #7c3aed, 13px text and a true 50% radius; each decoy nudges just one of those.",
  },
  {
    id: "el26",
    difficulty: "hard",
    html: `<input class="field-sm" type="text" placeholder="Search" />`,
    css: {
      rules: [
        {
          selector: ".field-sm",
          decls: { padding: "8px 12px", border: "1px solid #cbd5e1", "border-radius": "6px", "font-size": "13px", width: "180px" },
        },
      ],
    },
    explain: "The real field keeps padding at 8px 12px, a 6px radius, a 1px border and a 180px width; each decoy nudges just one of those.",
  },
  {
    id: "el27",
    difficulty: "hard",
    html: `<div class="tooltip-sm">Copied</div>`,
    css: {
      rules: [
        {
          selector: ".tooltip-sm",
          decls: { background: "#111827", color: "#f9fafb", padding: "5px 10px", "border-radius": "5px", "font-size": "11px" },
        },
      ],
    },
    explain: "The real tooltip keeps padding at 5px 10px, a 5px radius, background #111827 and 11px text; each decoy nudges just one of those.",
  },
  {
    id: "el28",
    difficulty: "hard",
    html: `<div class="row-sm"><div class="mark"></div>Verified</div>`,
    css: {
      rules: [
        {
          selector: ".row-sm",
          decls: { display: "flex", "align-items": "center", gap: "8px", "font-size": "13px", color: "#111827" },
        },
        { selector: ".mark", decls: { width: "7px", height: "7px", "border-radius": "50%", background: "#059669" } },
      ],
    },
    explain: "The real row keeps an 8px gap, a 7px dot, dot colour #059669 and 13px text; each decoy nudges just one of those.",
  },
  {
    id: "el29",
    difficulty: "hard",
    html: `<div class="chip-sm">Urgent</div>`,
    css: {
      rules: [
        {
          selector: ".chip-sm",
          decls: { display: "inline-flex", padding: "3px 10px", background: "#fee2e2", color: "#b91c1c", "border-radius": "999px", "font-size": "11px", "font-weight": "700" },
        },
      ],
    },
    explain: "The real chip keeps padding at 3px 10px, text colour #b91c1c, a true pill radius and 11px text; each decoy nudges just one of those.",
  },
  {
    id: "el30",
    difficulty: "hard",
    html: `<div class="card"><p>Plan renewed</p></div>`,
    css: {
      rules: [
        {
          selector: ".card",
          decls: {
            background: "#f8fafc",
            border: "1px solid #cbd5e1",
            "border-radius": "10px",
            padding: "16px 18px",
            "box-shadow": "0 1px 2px rgba(15,23,42,0.08)",
            color: "#0f172a",
            "font-family": "sans-serif",
          },
        },
      ],
    },
    explain:
      "The real card keeps padding at 16px 18px, a 10px radius, border colour #cbd5e1 and a soft 2px shadow; each decoy nudges just one of those.",
  },
];

/**
 * Whole-page questions render an entire mock page (header+nav, hero,
 * content section, footer) rather than one component. Previews render the
 * page at a real desktop size (see FULL_PAGE_VIEWPORT in app.js) and scale
 * it down to a thumbnail, the same trick real "site preview" thumbnails
 * use, so what you're looking at is a genuine full page, just shrunk.
 */
const WHOLE_PAGE_QUESTIONS = [
  // ── Easy (wp01-wp02): sweeping, obviously different changes ──
  {
    id: "wp01",
    difficulty: "easy",
    html: `<div class="mock-page">
  <header class="site-header">
    <div class="site-logo">Japan Guide</div>
    <nav class="site-nav"><a href="#">Home</a><a href="#">Destinations</a><a href="#">About</a></nav>
  </header>
  <section class="hero">
    <h1>Explore Japan</h1>
    <p>From neon-lit Tokyo streets to quiet mountain shrines.</p>
  </section>
  <section class="content">
    <h2 class="section-title">Popular destinations</h2>
    <div class="card-grid">
      <div class="card"><h3>Tokyo</h3><p>Modern skyline, endless energy.</p></div>
      <div class="card"><h3>Kyoto</h3><p>Temples, gardens, tradition.</p></div>
      <div class="card"><h3>Osaka</h3><p>Street food capital.</p></div>
    </div>
  </section>
  <footer class="site-footer">Japan Guide</footer>
</div>`,
    css: {
      rules: [
        { selector: ".site-header", decls: { display: "flex", "justify-content": "space-between", "align-items": "center", padding: "16px 32px", background: "#ffffff", "border-bottom": "1px solid #e2e8f0" } },
        { selector: ".site-header .site-logo", decls: { color: "#b91c1c", "font-weight": "700", "font-size": "18px" } },
        { selector: ".site-nav a", decls: { color: "#334155", "margin-left": "24px", "font-size": "14px", "font-weight": "600" } },
        { selector: ".hero", decls: { padding: "56px 32px", background: "#b91c1c", "text-align": "center" } },
        { selector: ".hero h1", decls: { color: "#ffffff", "font-size": "34px", "margin-bottom": "10px" } },
        { selector: ".hero p", decls: { color: "#fecaca", "font-size": "16px" } },
        { selector: ".content", decls: { padding: "40px 32px" } },
        { selector: ".section-title", decls: { "font-size": "20px", color: "#0f172a", "margin-bottom": "20px" } },
        { selector: ".card-grid", decls: { display: "flex", gap: "20px" } },
        { selector: ".card", decls: { flex: "1", padding: "20px", background: "#fef2f2", border: "1px solid #fecaca", "border-radius": "10px" } },
        { selector: ".card h3", decls: { color: "#b91c1c", "font-size": "16px", "margin-bottom": "6px" } },
        { selector: ".card p", decls: { color: "#64748b", "font-size": "13px" } },
        { selector: ".site-footer", decls: { padding: "20px 32px", background: "#0f172a", color: "#94a3b8", "text-align": "center", "font-size": "13px" } },
      ],
    },
    explain: "The real page is red and white throughout, with three destination cards sitting side by side, not blue, cramped, dark-header, or stacked-and-inverted.",
  },
  {
    id: "wp02",
    difficulty: "easy",
    html: `<div class="mock-page">
  <header class="site-header">
    <div class="site-logo">Movie Hub</div>
    <nav class="site-nav"><a href="#">Home</a><a href="#">Movies</a><a href="#">Reviews</a></nav>
  </header>
  <section class="hero">
    <h1>Top Movies of 2024</h1>
    <p>The films everyone is talking about this year.</p>
  </section>
  <section class="content">
    <h2 class="section-title">Now trending</h2>
    <div class="card-grid">
      <div class="card"><h3>Nova Horizon</h3><p>4.8 - Sci-fi</p></div>
      <div class="card"><h3>Silent Harbor</h3><p>4.6 - Drama</p></div>
      <div class="card"><h3>Last Light</h3><p>4.5 - Thriller</p></div>
    </div>
  </section>
  <footer class="site-footer">Movie Hub</footer>
</div>`,
    css: {
      rules: [
        { selector: ".site-header", decls: { display: "flex", "justify-content": "space-between", "align-items": "center", padding: "16px 32px", background: "#1e1b3a" } },
        { selector: ".site-header .site-logo", decls: { color: "#facc15", "font-weight": "700", "font-size": "18px" } },
        { selector: ".site-nav a", decls: { color: "#e2e8f0", "margin-left": "24px", "font-size": "14px", "font-weight": "600" } },
        { selector: ".hero", decls: { padding: "56px 32px", background: "#312e81", "text-align": "center" } },
        { selector: ".hero h1", decls: { color: "#ffffff", "font-size": "34px", "margin-bottom": "10px" } },
        { selector: ".hero p", decls: { color: "#c7d2fe", "font-size": "16px" } },
        { selector: ".content", decls: { padding: "40px 32px" } },
        { selector: ".section-title", decls: { "font-size": "20px", color: "#1e1b3a", "margin-bottom": "20px" } },
        { selector: ".card-grid", decls: { display: "flex", gap: "20px" } },
        { selector: ".card", decls: { flex: "1", padding: "20px", background: "#f5f3ff", border: "1px solid #ddd6fe", "border-radius": "10px" } },
        { selector: ".card h3", decls: { color: "#4338ca", "font-size": "16px", "margin-bottom": "6px" } },
        { selector: ".card p", decls: { color: "#a16207", "font-size": "13px", "font-weight": "700" } },
        { selector: ".site-footer", decls: { padding: "20px 32px", background: "#1e1b3a", color: "#a5b4fc", "text-align": "center", "font-size": "13px" } },
      ],
    },
    explain: "The real page is a dark indigo/gold cinema theme with three cards side by side, not green, cramped, a plain white theme, or stacked pills.",
  },

  // ── Medium (wp03-wp04): 1-2 changes, moderate magnitude ──
  {
    id: "wp03",
    difficulty: "medium",
    html: `<div class="mock-page">
  <header class="site-header">
    <div class="site-logo">City Stats</div>
    <nav class="site-nav"><a href="#">Home</a><a href="#">Cities</a><a href="#">Data</a></nav>
  </header>
  <section class="hero">
    <h1>World Cities at a Glance</h1>
    <p>Population for major cities worldwide.</p>
  </section>
  <section class="content">
    <h2 class="section-title">Top by population</h2>
    <div class="city-list">
      <div class="city-row"><div class="city-name">Tokyo</div><div class="city-stat">37.4M</div></div>
      <div class="city-row"><div class="city-name">Delhi</div><div class="city-stat">31.2M</div></div>
      <div class="city-row"><div class="city-name">Shanghai</div><div class="city-stat">27.8M</div></div>
    </div>
  </section>
  <footer class="site-footer">City Stats</footer>
</div>`,
    css: {
      rules: [
        { selector: ".site-header", decls: { display: "flex", "justify-content": "space-between", "align-items": "center", padding: "16px 32px", background: "#134e4a" } },
        { selector: ".site-header .site-logo", decls: { color: "#ffffff", "font-weight": "700", "font-size": "18px" } },
        { selector: ".site-nav a", decls: { color: "#99f6e4", "margin-left": "24px", "font-size": "14px", "font-weight": "600" } },
        { selector: ".hero", decls: { padding: "48px 32px", background: "#0f766e" } },
        { selector: ".hero h1", decls: { color: "#ffffff", "font-size": "30px", "margin-bottom": "8px" } },
        { selector: ".hero p", decls: { color: "#ccfbf1", "font-size": "15px" } },
        { selector: ".content", decls: { padding: "36px 32px" } },
        { selector: ".section-title", decls: { "font-size": "18px", color: "#134e4a", "margin-bottom": "16px" } },
        { selector: ".city-list", decls: { display: "flex", "flex-direction": "column", gap: "2px" } },
        { selector: ".city-row", decls: { display: "flex", "justify-content": "space-between", padding: "14px 18px", background: "#f0fdfa", "border-bottom": "1px solid #ccfbf1" } },
        { selector: ".city-name", decls: { color: "#134e4a", "font-weight": "600", "font-size": "15px" } },
        { selector: ".city-stat", decls: { color: "#0f766e", "font-weight": "700", "font-size": "15px" } },
        { selector: ".site-footer", decls: { padding: "18px 32px", background: "#134e4a", color: "#99f6e4", "text-align": "center", "font-size": "13px" } },
      ],
    },
    explain: "The real page keeps 32px hero padding, 18px row padding, a #0f766e hero and an 18px section title - each option nudges just one of those.",
  },
  {
    id: "wp04",
    difficulty: "medium",
    html: `<div class="mock-page">
  <header class="site-header">
    <div class="site-logo">Ghibli Fan Page</div>
    <nav class="site-nav"><a href="#">Home</a><a href="#">Films</a><a href="#">Characters</a></nav>
  </header>
  <section class="hero">
    <h1>Studio Ghibli Films</h1>
    <p>Hand-drawn worlds, quiet wonder, unforgettable characters.</p>
  </section>
  <section class="content">
    <h2 class="section-title">Fan favourites</h2>
    <div class="card-grid">
      <div class="card"><h3>Spirited Away</h3><p>2001 - Fantasy</p></div>
      <div class="card"><h3>My Neighbor Totoro</h3><p>1988 - Family</p></div>
      <div class="card"><h3>Princess Mononoke</h3><p>1997 - Adventure</p></div>
    </div>
  </section>
  <footer class="site-footer">A fan-made tribute page</footer>
</div>`,
    css: {
      rules: [
        { selector: ".site-header", decls: { display: "flex", "justify-content": "space-between", "align-items": "center", padding: "16px 32px", background: "#f7f3e8", "border-bottom": "1px solid #e2d9bd" } },
        { selector: ".site-header .site-logo", decls: { color: "#3f6212", "font-weight": "700", "font-size": "18px" } },
        { selector: ".site-nav a", decls: { color: "#57534e", "margin-left": "24px", "font-size": "14px", "font-weight": "600" } },
        { selector: ".hero", decls: { padding: "52px 32px", background: "#4d7c0f", "text-align": "center" } },
        { selector: ".hero h1", decls: { color: "#f7fee7", "font-size": "32px", "margin-bottom": "10px" } },
        { selector: ".hero p", decls: { color: "#d9f99d", "font-size": "15px" } },
        { selector: ".content", decls: { padding: "40px 32px", background: "#fefce8" } },
        { selector: ".section-title", decls: { "font-size": "19px", color: "#3f6212", "margin-bottom": "18px" } },
        { selector: ".card-grid", decls: { display: "flex", gap: "18px" } },
        { selector: ".card", decls: { flex: "1", padding: "18px", background: "#ffffff", border: "1px solid #e2d9bd", "border-radius": "12px" } },
        { selector: ".card h3", decls: { color: "#3f6212", "font-size": "15px", "margin-bottom": "6px" } },
        { selector: ".card p", decls: { color: "#78716c", "font-size": "13px" } },
        { selector: ".site-footer", decls: { padding: "18px 32px", background: "#3f6212", color: "#d9f99d", "text-align": "center", "font-size": "12px" } },
      ],
    },
    explain: "The real page keeps compact 18px cards with a 12px radius and a #4d7c0f hero - each option nudges just one of those.",
  },

  // ── Hard (wp05-wp06): exactly 1 property changed, but a clear delta ──
  {
    id: "wp05",
    difficulty: "hard",
    html: `<div class="mock-page">
  <header class="site-header">
    <div class="site-logo">Tokyo Eats</div>
    <nav class="site-nav"><a href="#">Home</a><a href="#">Guides</a><a href="#">Map</a></nav>
  </header>
  <section class="hero">
    <h1>Best Ramen in Tokyo</h1>
    <p>Ten bowls worth crossing the city for.</p>
  </section>
  <section class="content">
    <h2 class="section-title">Reader favourites</h2>
    <div class="shop-list">
      <div class="shop-row"><div class="shop-name">Ichiran Shibuya</div><div class="shop-tag">Tonkotsu</div></div>
      <div class="shop-row"><div class="shop-name">Fuunji</div><div class="shop-tag">Tsukemen</div></div>
      <div class="shop-row"><div class="shop-name">Rokurinsha</div><div class="shop-tag">Tsukemen</div></div>
    </div>
  </section>
  <footer class="site-footer">Tokyo Eats</footer>
</div>`,
    css: {
      rules: [
        { selector: ".site-header", decls: { display: "flex", "justify-content": "space-between", "align-items": "center", padding: "16px 32px", background: "#1c1917" } },
        { selector: ".site-header .site-logo", decls: { color: "#fb923c", "font-weight": "700", "font-size": "18px" } },
        { selector: ".site-nav a", decls: { color: "#e7e5e4", "margin-left": "24px", "font-size": "14px", "font-weight": "600" } },
        { selector: ".hero", decls: { padding: "50px 32px", background: "#c2410c" } },
        { selector: ".hero h1", decls: { color: "#ffffff", "font-size": "30px", "margin-bottom": "8px" } },
        { selector: ".hero p", decls: { color: "#fed7aa", "font-size": "15px" } },
        { selector: ".content", decls: { padding: "36px 32px" } },
        { selector: ".section-title", decls: { "font-size": "18px", color: "#1c1917", "margin-bottom": "16px" } },
        { selector: ".shop-list", decls: { display: "flex", "flex-direction": "column", gap: "1px" } },
        { selector: ".shop-row", decls: { display: "flex", "justify-content": "space-between", "align-items": "center", padding: "13px 18px", background: "#fff7ed", "border-bottom": "1px solid #fed7aa" } },
        { selector: ".shop-name", decls: { color: "#1c1917", "font-weight": "600", "font-size": "14px" } },
        { selector: ".shop-tag", decls: { color: "#c2410c", "font-size": "12px", "font-weight": "700" } },
        { selector: ".site-footer", decls: { padding: "18px 32px", background: "#1c1917", color: "#fb923c", "text-align": "center", "font-size": "12px" } },
      ],
    },
    explain: "The real page keeps 18px row padding, a 1px list gap, tag colour #c2410c and 32px hero padding; each decoy nudges just one of those.",
  },
  {
    id: "wp06",
    difficulty: "hard",
    html: `<div class="mock-page">
  <header class="site-header">
    <div class="site-logo">Sakura Watch</div>
    <nav class="site-nav"><a href="#">Home</a><a href="#">Forecast</a><a href="#">Map</a></nav>
  </header>
  <section class="hero">
    <h1>Cherry Blossom Forecast</h1>
    <p>Track peak bloom across Japan's major cities.</p>
  </section>
  <section class="content">
    <h2 class="section-title">Peak bloom dates</h2>
    <div class="card-grid">
      <div class="card"><h3>Tokyo</h3><p>Mar 27</p></div>
      <div class="card"><h3>Kyoto</h3><p>Apr 1</p></div>
      <div class="card"><h3>Sapporo</h3><p>Apr 29</p></div>
    </div>
  </section>
  <footer class="site-footer">Sakura Watch</footer>
</div>`,
    css: {
      rules: [
        { selector: ".site-header", decls: { display: "flex", "justify-content": "space-between", "align-items": "center", padding: "16px 32px", background: "#ffffff", "border-bottom": "1px solid #fbcfe8" } },
        { selector: ".site-header .site-logo", decls: { color: "#be185d", "font-weight": "700", "font-size": "18px" } },
        { selector: ".site-nav a", decls: { color: "#57534e", "margin-left": "24px", "font-size": "14px", "font-weight": "600" } },
        { selector: ".hero", decls: { padding: "52px 32px", background: "#fce7f3", "text-align": "center" } },
        { selector: ".hero h1", decls: { color: "#9d174d", "font-size": "32px", "margin-bottom": "10px" } },
        { selector: ".hero p", decls: { color: "#be185d", "font-size": "15px" } },
        { selector: ".content", decls: { padding: "40px 32px" } },
        { selector: ".section-title", decls: { "font-size": "19px", color: "#9d174d", "margin-bottom": "18px" } },
        { selector: ".card-grid", decls: { display: "flex", gap: "18px" } },
        { selector: ".card", decls: { flex: "1", padding: "20px", background: "#fdf2f8", border: "1px solid #fbcfe8", "border-radius": "14px", "text-align": "center" } },
        { selector: ".card h3", decls: { color: "#9d174d", "font-size": "16px", "margin-bottom": "8px" } },
        { selector: ".card p", decls: { color: "#be185d", "font-size": "18px", "font-weight": "700" } },
        { selector: ".site-footer", decls: { padding: "18px 32px", background: "#fce7f3", color: "#9d174d", "text-align": "center", "font-size": "12px" } },
      ],
    },
    explain: "The real page keeps 20px card padding, a 14px card radius, heading colour #9d174d and 18px bloom-date text; each decoy nudges just one of those.",
  },
];

const MATCH_CSS_CATEGORIES = [
  {
    id: "elements",
    name: "HTML Elements",
    description: "Single components: buttons, badges, cards and other small pieces of UI.",
    color: "#3d6fa5",
    questions: ELEMENTS_QUESTIONS,
  },
  {
    id: "whole-page",
    name: "Whole Page",
    description: "Full page layouts: a header and nav, a hero, a content section, a footer.",
    color: "#b8763f",
    questions: WHOLE_PAGE_QUESTIONS,
  },
];
