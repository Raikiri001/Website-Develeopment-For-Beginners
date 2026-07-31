/**
 * Homepage card renderer.
 * Reads data/activities.json and groups activities by category, so adding a
 * new lesson later is just: new folder plus one entry in that manifest.
 */

(function () {
  "use strict";

  const CATEGORY_LABELS = {
    theory: "Theory",
    practical: "Practical activities",
  };

  const CATEGORY_DESCRIPTIONS = {
    theory: "Concepts and how the web works under the bonnet.",
    practical: "Hands-on exercises you solve by doing.",
  };

  const STATUS_LABELS = {
    "not-started": "Not started",
    "in-progress": "In progress",
    completed: "Completed",
  };

  function createCard(activity) {
    const progress = window.WDFBProgress ? window.WDFBProgress.get(activity.id) : { percent: 0, status: "not-started" };

    const card = document.createElement("a");
    card.className = "card";
    card.href = activity.href;

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

    const footer = document.createElement("div");
    footer.className = "card-footer";
    const link = document.createElement("span");
    link.className = "card-link";
    link.textContent = "Open activity ->";
    footer.appendChild(link);

    card.appendChild(top);
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(progressWrap);
    card.appendChild(footer);
    return card;
  }

  function renderSection(category, activities) {
    const section = document.createElement("section");

    const heading = document.createElement("div");
    heading.className = "section-heading";
    heading.id = `${category}-heading`;
    const h2 = document.createElement("h2");
    h2.textContent = CATEGORY_LABELS[category] || category;
    const p = document.createElement("p");
    p.textContent = CATEGORY_DESCRIPTIONS[category] || "";
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
      activities.forEach((activity) => grid.appendChild(createCard(activity)));
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

      const order = ["theory", "practical"];
      order.forEach((category) => {
        const inCategory = activities.filter((a) => a.category === category);
        content.appendChild(renderSection(category, inCategory));
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
