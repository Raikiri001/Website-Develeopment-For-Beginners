/**
 * Dashboard renderer. Reads ../data/activities.json for the activity list
 * and assets/js/progress.js's localStorage store for each activity's
 * progress, then renders an overview (ring + stat cards), filter tabs and
 * a status-coloured list of every activity.
 */

(function () {
  "use strict";

  const ICONS = {
    layers:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"/></svg>',
    check:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>',
    clock:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5v5l3 1.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>',
    circle:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8.25"/></svg>',
  };

  const STATUS_LABELS = {
    "not-started": "Not started",
    "in-progress": "In progress",
    completed: "Completed",
  };

  const ACTION_LABELS = {
    "not-started": "Start",
    "in-progress": "Continue",
    completed: "Review",
  };

  // Singular: this labels one activity's row, not a group of them.
  const CATEGORY_LABELS = { theory: "Theory", practical: "Practical activity", quiz: "Quiz" };

  let allRows = [];
  let currentFilter = "all";

  function timeAgo(isoString) {
    if (!isoString) return "";
    const diffMs = Date.now() - new Date(isoString).getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  function statCard(iconKey, iconClass, value, label) {
    const card = document.createElement("div");
    card.className = "stat-card";
    card.innerHTML = `
      <span class="stat-icon ${iconClass}">${ICONS[iconKey]}</span>
      <span>
        <span class="stat-value">${value}</span>
        <span class="stat-label">${label}</span>
      </span>
    `;
    return card;
  }

  function renderOverview(rows) {
    const overview = document.getElementById("overview");
    overview.innerHTML = "";

    const total = rows.length;
    const completed = rows.filter((r) => r.progress.status === "completed").length;
    const inProgress = rows.filter((r) => r.progress.status === "in-progress").length;
    const notStarted = total - completed - inProgress;
    const avgPercent = total === 0 ? 0 : Math.round(rows.reduce((sum, r) => sum + r.progress.percent, 0) / total);

    const ring = document.createElement("div");
    ring.className = "progress-ring";
    ring.style.setProperty("--pct", avgPercent);
    ring.innerHTML = `
      <span class="progress-ring-label">
        <span class="progress-ring-value">${avgPercent}%</span>
        <span class="progress-ring-caption">Overall</span>
      </span>
    `;

    const stats = document.createElement("div");
    stats.className = "stats-grid";
    stats.appendChild(statCard("layers", "icon-primary", total, "Total activities"));
    stats.appendChild(statCard("check", "icon-success", completed, "Completed"));
    stats.appendChild(statCard("clock", "icon-warning", inProgress, "In progress"));
    stats.appendChild(statCard("circle", "icon-primary", notStarted, "Not started"));

    overview.appendChild(ring);
    overview.appendChild(stats);
  }

  function renderFilterTabs() {
    const container = document.getElementById("filterTabs");
    container.innerHTML = "";

    const filters = [
      { id: "all", label: "All" },
      { id: "not-started", label: "Not started" },
      { id: "in-progress", label: "In progress" },
      { id: "completed", label: "Completed" },
    ];

    filters.forEach((filter) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "filter-tab" + (filter.id === currentFilter ? " active" : "");
      btn.textContent = filter.label;
      btn.addEventListener("click", () => {
        currentFilter = filter.id;
        renderFilterTabs();
        renderActivityList();
      });
      container.appendChild(btn);
    });
  }

  function renderActivityList() {
    const container = document.getElementById("activityList");
    container.innerHTML = "";

    const rows = currentFilter === "all" ? allRows : allRows.filter((r) => r.progress.status === currentFilter);

    if (rows.length === 0) {
      container.innerHTML = '<p class="empty-state">Nothing here yet.</p>';
      return;
    }

    rows.forEach((row) => {
      const { activity, progress } = row;
      const el = document.createElement("div");
      el.className = "activity-row";

      const main = document.createElement("div");
      main.className = "activity-main";

      const top = document.createElement("div");
      top.className = "activity-top";
      top.innerHTML = `
        <span class="badge badge-${activity.category}">${CATEGORY_LABELS[activity.category] || activity.category}</span>
        <span class="status-badge status-${progress.status}">${STATUS_LABELS[progress.status]}</span>
      `;

      const title = document.createElement("h3");
      title.textContent = activity.title;

      const description = document.createElement("p");
      description.textContent = activity.description;

      const progressWrap = document.createElement("div");
      progressWrap.className = "activity-progress";
      progressWrap.innerHTML = `
        <div class="activity-progress-label"><span>Progress</span><span>${progress.percent}%</span></div>
        <div class="progress-track">
          <div class="progress-fill${progress.status === "completed" ? " is-complete" : ""}" style="width:${progress.percent}%"></div>
        </div>
      `;

      main.appendChild(top);
      main.appendChild(title);
      main.appendChild(description);

      // Headline numbers an activity has chosen to surface (a quiz's high
      // score, for example), reported via WDFBProgress.setStat. Activities
      // without any just don't get the row.
      const statLabels = Object.keys(progress.stats || {});
      if (statLabels.length) {
        const statRow = document.createElement("div");
        statRow.className = "activity-stats";
        statRow.innerHTML = statLabels
          .map(
            (label) =>
              `<span class="activity-stat"><span class="activity-stat-label">${label}</span><span class="activity-stat-value">${progress.stats[label]}</span></span>`
          )
          .join("");
        main.appendChild(statRow);
      }

      main.appendChild(progressWrap);

      const action = document.createElement("a");
      action.className = "btn btn-primary";
      action.href = `../${activity.href}`;
      action.textContent = ACTION_LABELS[progress.status];

      const meta = document.createElement("div");
      meta.className = "activity-meta";
      const lastViewed = document.createElement("span");
      lastViewed.className = "last-viewed";
      lastViewed.textContent = progress.updatedAt ? `Last opened ${timeAgo(progress.updatedAt)}` : "Not opened yet";
      meta.appendChild(lastViewed);

      el.appendChild(main);
      el.appendChild(action);
      el.appendChild(meta);
      container.appendChild(el);
    });
  }

  async function init() {
    try {
      const response = await fetch("../data/activities.json");
      if (!response.ok) throw new Error("Failed to load activities");
      const activities = await response.json();

      allRows = activities.map((activity) => ({
        activity,
        progress: window.WDFBProgress ? window.WDFBProgress.get(activity.id) : { percent: 0, status: "not-started", updatedAt: null },
      }));

      renderOverview(allRows);
      renderFilterTabs();
      renderActivityList();
    } catch (err) {
      console.error(err);
      document.getElementById("activityList").innerHTML =
        '<p class="empty-state">Could not load your progress. Please refresh the page.</p>';
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
