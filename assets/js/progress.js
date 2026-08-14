/**
 * Shared, localStorage-backed progress tracker used by every page.
 * Each activity reports its own progress (0-100); this module derives a
 * status of "not-started", "in-progress" or "completed" from it. Status
 * only ever upgrades automatically (in-progress -> completed), never
 * downgrades on its own, so re-visiting a completed activity doesn't lose
 * that it was completed.
 */

(function (global) {
  "use strict";

  const STORAGE_KEY = "wdfb_progress_v1";
  const STATUS_RANK = { "not-started": 0, "in-progress": 1, completed: 2 };

  function readAll() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (err) {
      return {};
    }
  }

  function writeAll(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      /* ignore, e.g. private browsing quota */
    }
  }

  function statusFromPercent(percent) {
    if (percent >= 100) return "completed";
    if (percent > 0) return "in-progress";
    return "not-started";
  }

  function mergeStatus(existingStatus, candidateStatus) {
    const existingRank = STATUS_RANK[existingStatus] ?? 0;
    const candidateRank = STATUS_RANK[candidateStatus] ?? 0;
    return candidateRank > existingRank ? candidateStatus : existingStatus;
  }

  function get(id) {
    const all = readAll();
    return all[id] || { percent: 0, status: "not-started", stats: {}, updatedAt: null };
  }

  function getAll() {
    return readAll();
  }

  /** Record how far through an activity the learner has got, 0-100. */
  function setPercent(id, percent) {
    const all = readAll();
    const clamped = Math.max(0, Math.min(100, Math.round(percent)));
    const existing = all[id] || { percent: 0, status: "not-started" };
    const nextPercent = Math.max(clamped, existing.percent || 0);
    const nextStatus = mergeStatus(existing.status, statusFromPercent(nextPercent));

    all[id] = {
      percent: nextPercent,
      status: nextStatus,
      stats: existing.stats || {},
      updatedAt: new Date().toISOString(),
    };
    writeAll(all);
    return all[id];
  }

  /**
   * Record the headline numbers an activity wants shown on the dashboard,
   * such as a quiz's high scores, as a `{ label: value }` map. Stats are
   * free-form label/value pairs kept alongside the percent, so the dashboard
   * can render them without knowing anything about the activity that
   * produced them. Setting them does not touch percent or status.
   *
   * The whole map is replaced rather than merged, deliberately: labels are
   * display text and get reworded, and merging would leave the old wording
   * stranded on the dashboard forever with no way to clear it.
   */
  function setStats(id, stats) {
    const all = readAll();
    const existing = all[id] || { percent: 0, status: "not-started" };

    all[id] = {
      percent: existing.percent || 0,
      status: existing.status || "not-started",
      stats: stats || {},
      updatedAt: new Date().toISOString(),
    };
    writeAll(all);
    return all[id];
  }

  /** Record that an activity has been opened, without a measurable percent yet. */
  function markViewed(id) {
    const all = readAll();
    const existing = all[id] || { percent: 0, status: "not-started" };
    const nextStatus = mergeStatus(existing.status, "in-progress");

    all[id] = {
      percent: existing.percent || 0,
      status: nextStatus,
      stats: existing.stats || {},
      updatedAt: new Date().toISOString(),
    };
    writeAll(all);
    return all[id];
  }

  global.WDFBProgress = { get, getAll, setPercent, setStats, markViewed };
})(window);
