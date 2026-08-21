/**
 * Homepage card renderer.
 * Groups activities by `topic` (the language they teach) and lays each topic
 * out in `order`, so the page reads as a route from basics to advanced rather
 * than a pile of cards. `category` is only a badge now, not the grouping.
 */

(function () {
  "use strict";

  const CATEGORY_LABELS = {
    theory: "Theory",
    practical: "Practical activities",
    quiz: "Quizzes",
  };

  // Topics are the page's real structure. A topic missing here never renders,
  // exactly as a category missing from the old order array never did.
  const TOPIC_ORDER = ["html", "css", "both"];

  const TOPIC_LABELS = {
    html: "HTML",
    css: "CSS",
    both: "How it all runs",
  };

  const TOPIC_DESCRIPTIONS = {
    html: "The language that says what is on a page. Start at the top and work down.",
    css: "The language that says how it looks. Each one builds on the last.",
    both: "What the browser does with the two of them once it has both.",
  };

  const STATUS_LABELS = {
    "not-started": "Not started",
    "in-progress": "In progress",
    completed: "Completed",
  };

  // Simple hand-drawn line icons (not from an icon font) so each category
  // reads visually distinct without relying on emoji.
  const CATEGORY_ICONS = {
    theory:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5c1.5-.8 3.2-1.2 5-1.2 1 0 2 .13 3 .4v13.8c-1-.27-2-.4-3-.4-1.8 0-3.5.4-5 1.2V5.5Z"/><path d="M20 5.5c-1.5-.8-3.2-1.2-5-1.2-1 0-2 .13-3 .4v13.8c1-.27 2-.4 3-.4 1.8 0 3.5.4 5 1.2V5.5Z"/></svg>',
    practical:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3l14 6.5-6 2-2 6L5 3Z"/></svg>',
    quiz:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="13.5" r="7.5"/><path d="M12 10.5v3.5l2.2 1.6"/><path d="M9.5 2.5h5"/><path d="M18.8 5.4l1.5-1.5"/></svg>',
  };

  function createCard(activity) {
    const progress = window.WDFBProgress ? window.WDFBProgress.get(activity.id) : { percent: 0, status: "not-started" };

    const card = document.createElement("a");
    card.className = "card";
    card.href = activity.href;

    const icon = document.createElement("div");
    icon.className = `card-icon icon-${activity.category}`;
    icon.innerHTML = CATEGORY_ICONS[activity.category] || "";

    const top = document.createElement("div");
    top.className = "card-top";

    const badge = document.createElement("span");
    badge.className = `badge badge-${activity.category}`;
    badge.textContent = CATEGORY_LABELS[activity.category] || activity.category;

    const statusBadge = document.createElement("span");
    statusBadge.className = `status-badge status-${progress.status}`;
    statusBadge.textContent = STATUS_LABELS[progress.status] || progress.status;

    top.appendChild(badge);
    top.appendChild(statusBadge);

    const title = document.createElement("h3");
    title.textContent = activity.title;

    const description = document.createElement("p");
    description.textContent = activity.description;

    const progressWrap = document.createElement("div");
    progressWrap.className = "card-progress";
    const progressLabel = document.createElement("div");
    progressLabel.className = "card-progress-label";
    progressLabel.innerHTML = `<span>Progress</span><span>${progress.percent}%</span>`;
    const track = document.createElement("div");
    track.className = "progress-track";
    const fill = document.createElement("div");
    fill.className = "progress-fill" + (progress.status === "completed" ? " is-complete" : "");
    fill.style.width = `${progress.percent}%`;
    track.appendChild(fill);
    progressWrap.appendChild(progressLabel);
    progressWrap.appendChild(track);

    const tags = document.createElement("ul");
    tags.className = "card-tags";
    (activity.tags || []).forEach((tag) => {
      const item = document.createElement("li");
      item.textContent = tag;
      tags.appendChild(item);
    });

    const footer = document.createElement("div");
    footer.className = "card-footer";
    const link = document.createElement("span");
    link.className = "card-link";
    const arrow = document.createElement("span");
    arrow.className = "card-link-arrow";
    arrow.textContent = "→";
    link.append("Open activity", arrow);
    footer.appendChild(link);

    card.appendChild(icon);
    card.appendChild(top);
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(tags);
    card.appendChild(progressWrap);
    card.appendChild(footer);
    return card;
  }

  function renderSection(topic, activities) {
    const section = document.createElement("section");

    const heading = document.createElement("div");
    heading.className = "section-heading";
    heading.id = `${topic}-heading`;
    const h2 = document.createElement("h2");
    h2.textContent = TOPIC_LABELS[topic] || topic;
    const p = document.createElement("p");
    p.textContent = TOPIC_DESCRIPTIONS[topic] || "";
    heading.appendChild(h2);
    heading.appendChild(p);

    const grid = document.createElement("div");
    grid.className = "card-grid";

    if (activities.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "More activities are on the way.";
      grid.appendChild(empty);
    } else {
      activities.forEach((activity, i) => {
        const card = createCard(activity);
        // The step number is the position in the route, so it renumbers by
        // itself when something is inserted rather than being hand-kept.
        const step = document.createElement("span");
        step.className = "card-step";
        step.textContent = String(i + 1);
        card.insertBefore(step, card.firstChild);
        grid.appendChild(card);
      });
    }

    section.appendChild(heading);
    section.appendChild(grid);
    return section;
  }

  async function init() {
    const content = document.getElementById("activityContent");
    if (!content) return;

    try {
      const response = await fetch("data/activities.json");
      if (!response.ok) throw new Error("Failed to load activities");
      const activities = await response.json();

      TOPIC_ORDER.forEach((topic) => {
        const inTopic = activities
          .filter((a) => a.topic === topic)
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        if (inTopic.length === 0) return;
        content.appendChild(renderSection(topic, inTopic));
      });
    } catch (err) {
      console.error(err);
      content.innerHTML =
        '<p class="empty-state">Could not load the activity list. Please refresh the page.</p>';
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
