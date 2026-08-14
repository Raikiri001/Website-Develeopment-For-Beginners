/*
  Understanding Tags - quiz logic.

  A run is a sequence of questions drawn from the tiers in questions.js.
  Questions are shuffled within a tier but the tiers are always walked in
  order, so every run opens on everyday tags and ramps into less common ones.

  Two things are stored in localStorage, separately from each other:
    - the set of tags ever answered correctly, which is what the dashboard
      progress percentage is based on
    - the best score for each timed mode
  Neither is reset by finishing a run, so practice accumulates across visits.
*/

(function () {
  "use strict";

  const ACTIVITY_ID = "understanding-tags";
  const STATE_KEY = "tag_quiz_state_v1";
  const BEST_KEY = "tag_quiz_best_v1";

  /*
    Scoring, built as a combo rather than a flat bonus.

    Every correct answer adds to the multiplier, and every 10 in a row the
    amount it adds doubles: +0.1 each for the first ten, +0.2 each for the
    next ten, +0.4 after that, and so on. So a combo of 10 is worth 2x, 20 is
    4x, 30 is 8x. Growth is exponential per band rather than linear, which is
    what makes a long unbroken run feel like it is running away with itself
    instead of creeping up. One wrong answer drops it straight back to 1x.

    Stated as two short sentences everywhere it matters (welcome copy, ready
    panel, results), because a scoring rule a learner has to reverse-engineer
    is not a game, it is a puzzle they did not ask for.
  */
  const POINTS_PER_CORRECT = 100;
  const COMBO_BAND = 10;
  const COMBO_BASE_STEP = 0.1;
  const MAX_MULTIPLIER = 25;

  // Roughly how long a learner takes to read and answer one question. Used
  // only to size the difficulty ramp of a timed run, so a sprint passes
  // through every tier instead of ending while still on the easy ones.
  const SECONDS_PER_QUESTION = 2.5;

  // How long the correct/incorrect flash stays up before the next question in
  // a timed run. Short enough not to eat a 60 second run, long enough to
  // register. Untimed runs don't auto-advance at all.
  const FLASH_MS = 550;

  /*
    Mode ids stay as they are even though the labels are worded in minutes:
    the id is the key a learner's high score is stored under, so renaming one
    would silently wipe a best score they had already set.
  */
  const TIMED_MODES = [
    { id: "timed-60", label: "1 minute sprint", desc: "As many as you can in one minute", seconds: 60 },
    { id: "timed-120", label: "2 minute sprint", desc: "Twice the time, twice the tags", seconds: 120 },
    { id: "timed-180", label: "3 minute run", desc: "Long enough for the whole bank", seconds: 180 },
  ];

  // ── Persistent state ────────────────────────────────────────────────────
  const state = {
    mastered: new Set(),
    best: {},
  };

  // ── Run state (in memory only, thrown away when a run ends) ─────────────
  // `pending` is a mode that has been picked but not started yet, which is
  // what the timed modes' Start button is waiting on.
  let run = null;
  let pending = null;

  const dom = {
    modeCount: document.getElementById("modeCount"),
    progressCount: document.getElementById("progressCount"),
    progressFill: document.getElementById("progressFill"),
    categoryList: document.getElementById("categoryList"),
    titleBarBadge: document.getElementById("titleBarBadge"),
    titleBarTitle: document.getElementById("titleBarTitle"),
    runStats: document.getElementById("runStats"),
    timerStat: document.getElementById("timerStat"),
    timerValue: document.getElementById("timerValue"),
    scoreStat: document.getElementById("scoreStat"),
    scoreValue: document.getElementById("scoreValue"),
    comboStat: document.getElementById("comboStat"),
    streakValue: document.getElementById("streakValue"),
    multiplierStat: document.getElementById("multiplierStat"),
    multiplierValue: document.getElementById("multiplierValue"),
    correctStat: document.getElementById("correctStat"),
    correctValue: document.getElementById("correctValue"),
    btnNext: document.getElementById("btnNext"),
    btnQuit: document.getElementById("btnQuit"),
    readyPanel: document.getElementById("readyPanel"),
    readyMode: document.getElementById("readyMode"),
    readySubtitle: document.getElementById("readySubtitle"),
    readyBest: document.getElementById("readyBest"),
    readyBestLabel: document.getElementById("readyBestLabel"),
    btnStart: document.getElementById("btnStart"),
    pointsPop: document.getElementById("pointsPop"),
    welcomeState: document.getElementById("welcomeState"),
    welcomeStats: document.getElementById("welcomeStats"),
    quizPanel: document.getElementById("quizPanel"),
    promptKindLabel: document.getElementById("promptKindLabel"),
    promptDifficultyBadge: document.getElementById("promptDifficultyBadge"),
    promptText: document.getElementById("promptText"),
    optionsGrid: document.getElementById("optionsGrid"),
    feedbackNote: document.getElementById("feedbackNote"),
    resultsPanel: document.getElementById("resultsPanel"),
    resultsTitle: document.getElementById("resultsTitle"),
    resultsScore: document.getElementById("resultsScore"),
    resultsBest: document.getElementById("resultsBest"),
    resultsStreakRule: document.getElementById("resultsStreakRule"),
    resultsList: document.getElementById("resultsList"),
    btnRunAgain: document.getElementById("btnRunAgain"),
    btnBackToModes: document.getElementById("btnBackToModes"),
  };

  // ── Helpers ─────────────────────────────────────────────────────────────
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function shuffleArray(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function allQuestions() {
    const out = [];
    TAG_QUIZ_TIERS.forEach(function (tier) {
      tier.questions.forEach(function (question) {
        out.push({ tier: tier, question: question });
      });
    });
    return out;
  }

  function totalQuestionCount() {
    return TAG_QUIZ_TIERS.reduce(function (sum, tier) {
      return sum + tier.questions.length;
    }, 0);
  }

  function formatTime(ms) {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return minutes + ":" + String(seconds).padStart(2, "0");
  }

  // Every mode is described in minutes, so "1 minute" and "3 minutes" read
  // as the same kind of thing rather than one being in seconds.
  function describeDuration(seconds) {
    const minutes = seconds / 60;
    if (!Number.isInteger(minutes)) return seconds + " seconds";
    return minutes === 1 ? "1 minute" : minutes + " minutes";
  }

  function tagMarkup(tag) {
    return "&lt;" + escapeHtml(tag) + "&gt;";
  }

  // ── Building a run's question queue ──────────────────────────────────────
  /*
    Shuffle within each tier, then concatenate the tiers in order. This is
    the whole point of the tier structure: the sequence differs every run,
    but the difficulty always ramps rather than jumping about.
  */
  function buildQueue(tierId, seconds) {
    const tiers = tierId
      ? TAG_QUIZ_TIERS.filter(function (tier) {
          return tier.id === tierId;
        })
      : TAG_QUIZ_TIERS;

    const shuffled = tiers.map(function (tier) {
      return shuffleArray(tier.questions).map(function (question) {
        return { tier: tier, question: question };
      });
    });

    /*
      A timed run has to ramp within the time it actually has. Walking the
      tiers end to end means a 60 second sprint never gets past the first 16
      easy tags, so the learner never meets a table or a less common tag in
      the mode they play most. Instead, take a slice off the front of each
      tier in order, sized so the whole ramp fits the expected number of
      questions, then follow it with everything left over (still tier by
      tier) for anyone fast enough to run past the estimate.
    */
    if (seconds && tiers.length > 1) {
      const expected = Math.ceil(seconds / SECONDS_PER_QUESTION);
      const perTier = Math.max(1, Math.ceil(expected / tiers.length));
      const opening = [];
      const remainder = [];
      shuffled.forEach(function (entries) {
        opening.push.apply(opening, entries.slice(0, perTier));
        remainder.push.apply(remainder, entries.slice(perTier));
      });
      return opening.concat(remainder);
    }

    const queue = [];
    shuffled.forEach(function (entries) {
      queue.push.apply(queue, entries);
    });
    return queue;
  }

  /*
    A timed run can outlast its pool. Rather than stopping early, refill it
    with the tags not yet mastered first, so a second pass is spent on the
    ones the learner still needs.
  */
  function refillQueue() {
    const unmastered = [];
    const mastered = [];
    allQuestions().forEach(function (entry) {
      if (state.mastered.has(entry.question.id)) {
        mastered.push(entry);
      } else {
        unmastered.push(entry);
      }
    });
    return shuffleArray(unmastered).concat(shuffleArray(mastered));
  }

  // ── Sidebar ─────────────────────────────────────────────────────────────
  function makeModeItem(label, desc, dataset) {
    const item = document.createElement("div");
    item.className = "problem-item mode-item";
    Object.keys(dataset).forEach(function (key) {
      item.dataset[key] = dataset[key];
    });

    const name = document.createElement("div");
    name.className = "mode-item-name";
    name.innerHTML =
      '<span class="status-dot"></span><span>' + escapeHtml(label) + "</span>";

    const description = document.createElement("div");
    description.className = "mode-item-desc";
    description.textContent = desc;

    item.appendChild(name);
    item.appendChild(description);
    return item;
  }

  function makeGroup(name, count, expanded) {
    const group = document.createElement("div");
    group.className = "category-group";

    const header = document.createElement("div");
    header.className = "category-header" + (expanded ? " expanded" : "");
    header.innerHTML =
      "<span>" +
      escapeHtml(name) +
      '</span><span class="category-count">(' +
      count +
      ')</span><span class="cat-chevron">&#9656;</span>';

    const body = document.createElement("div");
    body.className = "category-problems" + (expanded ? " open" : "");

    header.addEventListener("click", function () {
      header.classList.toggle("expanded");
      body.classList.toggle("open");
    });

    group.appendChild(header);
    group.appendChild(body);
    return { group: group, body: body };
  }

  function buildSidebar() {
    dom.categoryList.innerHTML = "";

    const timed = makeGroup("Timed", TIMED_MODES.length, true);
    TIMED_MODES.forEach(function (mode) {
      timed.body.appendChild(
        makeModeItem(mode.label, mode.desc, {
          modeId: mode.id,
          mode: "timed",
          seconds: String(mode.seconds),
        })
      );
    });
    dom.categoryList.appendChild(timed.group);

    const untimedCount = TAG_QUIZ_TIERS.length + 1;
    const untimed = makeGroup("Untimed", untimedCount, true);
    untimed.body.appendChild(
      makeModeItem("Every tag", "All " + totalQuestionCount() + " tags, easiest first", {
        modeId: "untimed-all",
        mode: "untimed",
      })
    );
    TAG_QUIZ_TIERS.forEach(function (tier) {
      untimed.body.appendChild(
        makeModeItem(tier.name, tier.questions.length + " tags, no clock", {
          modeId: "untimed-" + tier.id,
          mode: "untimed",
          tier: tier.id,
        })
      );
    });
    dom.categoryList.appendChild(untimed.group);

    dom.modeCount.textContent = String(TIMED_MODES.length + untimedCount);

    dom.categoryList.addEventListener("click", function (event) {
      const item = event.target.closest(".mode-item");
      if (!item) return;
      armRun(modeOptionsFrom(item));
    });
  }

  function modeOptionsFrom(item) {
    return {
      modeId: item.dataset.modeId,
      mode: item.dataset.mode,
      seconds: item.dataset.seconds ? Number(item.dataset.seconds) : 0,
      tierId: item.dataset.tier || null,
      label: item.querySelector(".mode-item-name span:last-child").textContent,
    };
  }

  function markActiveMode(modeId) {
    const items = dom.categoryList.querySelectorAll(".mode-item");
    items.forEach(function (item) {
      item.classList.toggle("active", item.dataset.modeId === modeId);
    });
  }

  // ── Welcome state ───────────────────────────────────────────────────────
  function buildWelcomeStats() {
    dom.welcomeStats.innerHTML = "";
    TAG_QUIZ_TIERS.forEach(function (tier) {
      const stat = document.createElement("div");
      stat.className = "welcome-stat";
      stat.innerHTML =
        '<div class="welcome-stat-icon">&#9670;</div><div class="welcome-stat-label">' +
        tier.questions.length +
        " " +
        escapeHtml(tier.name) +
        "</div>";
      dom.welcomeStats.appendChild(stat);
    });
  }

  function showWelcome() {
    stopTimer();
    run = null;
    pending = null;
    dom.welcomeState.style.display = "";
    dom.readyPanel.hidden = true;
    dom.quizPanel.hidden = true;
    dom.resultsPanel.hidden = true;
    dom.runStats.hidden = true;
    dom.btnNext.hidden = true;
    dom.btnQuit.disabled = true;
    dom.titleBarBadge.textContent = "Ready";
    dom.titleBarBadge.removeAttribute("style");
    dom.titleBarTitle.textContent = "Select a Mode";
    markActiveMode(null);
  }

  // ── Arming and starting a run ───────────────────────────────────────────
  /*
    Picking a mode in the sidebar arms a run rather than starting one. A timed
    run then waits on the Start button, so the clock never begins ticking
    while the learner is still reading. An untimed run has no clock to be
    unfair about, so it opens straight into the first question.
  */
  function armRun(options) {
    stopTimer();
    run = null;
    pending = options;
    markActiveMode(options.modeId);

    dom.welcomeState.style.display = "none";
    dom.resultsPanel.hidden = true;
    dom.quizPanel.hidden = true;
    dom.runStats.hidden = true;
    dom.btnNext.hidden = true;
    dom.btnQuit.disabled = true;

    if (options.mode !== "timed") {
      beginRun();
      return;
    }

    dom.readyPanel.hidden = false;
    dom.titleBarBadge.textContent = "Ready";
    dom.titleBarBadge.removeAttribute("style");
    dom.titleBarTitle.textContent = options.label;
    dom.readyMode.textContent = options.label;

    const best = state.best[options.modeId] || 0;
    dom.readyBest.textContent = best.toLocaleString("en-AU");
    dom.readyBestLabel.textContent = best
      ? "Your best on this mode"
      : "No score on this mode yet";
    const duration = describeDuration(options.seconds);
    dom.readySubtitle.textContent = best
      ? "You have " + duration + " to beat it."
      : "You have " +
        duration +
        " from the moment you press Start. Questions keep coming until the clock runs out.";
    dom.btnStart.textContent = best ? "Beat it" : "Start the clock";
    dom.btnStart.focus();
  }

  function beginRun() {
    if (!pending) return;
    const options = pending;
    const durationMs = options.mode === "timed" ? options.seconds * 1000 : 0;

    run = {
      modeId: options.modeId,
      mode: options.mode,
      tierId: options.tierId,
      label: options.label,
      // Points, combos and high scores exist to make a race against a clock
      // worth repeating. An untimed run is practice, so it just counts.
      scored: options.mode === "timed",
      durationMs: durationMs,
      endsAt: durationMs ? Date.now() + durationMs : 0,
      queue: buildQueue(options.tierId, options.mode === "timed" ? options.seconds : 0),
      index: 0,
      score: 0,
      streak: 0,
      bestStreak: 0,
      bestMultiplier: 1,
      correctCount: 0,
      history: [],
      timerId: null,
      locked: false,
    };

    dom.readyPanel.hidden = true;
    dom.welcomeState.style.display = "none";
    dom.resultsPanel.hidden = true;
    dom.quizPanel.hidden = false;
    dom.runStats.hidden = false;
    dom.btnQuit.disabled = false;

    // Only a timed run is scored, so an untimed one shows a plain correct
    // count in place of the score, combo and multiplier.
    dom.timerStat.hidden = !run.scored;
    dom.scoreStat.hidden = !run.scored;
    dom.comboStat.hidden = !run.scored;
    dom.multiplierStat.hidden = !run.scored;
    dom.correctStat.hidden = run.scored;

    updateRunStats();
    if (run.mode === "timed") startTimer();
    showQuestion();
  }

  function showQuestion() {
    if (!run) return;

    if (run.index >= run.queue.length) {
      if (run.mode === "timed") {
        // The clock still has time on it, so keep going rather than
        // ending the run early.
        run.queue = run.queue.concat(refillQueue());
      } else {
        endRun("finished");
        return;
      }
    }

    const entry = run.queue[run.index];
    const tier = entry.tier;
    const question = entry.question;
    run.locked = false;

    dom.titleBarBadge.textContent = tier.name;
    dom.titleBarBadge.style.backgroundColor = "var(--accent-quiz-tint)";
    dom.titleBarBadge.style.color = "var(--accent-quiz)";
    dom.titleBarTitle.textContent = "Question " + (run.index + 1);

    dom.promptKindLabel.textContent =
      question.kind === "definition" ? "Definition" : "Use case";
    dom.promptDifficultyBadge.className =
      "panel-badge difficulty-badge difficulty-" + tier.difficulty;
    dom.promptDifficultyBadge.textContent =
      tier.difficulty.charAt(0).toUpperCase() + tier.difficulty.slice(1);
    dom.promptText.textContent = question.prompt;
    dom.feedbackNote.textContent = "";
    dom.feedbackNote.classList.remove("is-wrong");
    dom.pointsPop.classList.remove("is-visible");
    dom.btnNext.hidden = true;

    renderOptions(question);
  }

  function renderOptions(question) {
    dom.optionsGrid.innerHTML = "";
    shuffleArray(question.options).forEach(function (tag) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option-card";
      button.dataset.tag = tag;
      button.innerHTML = tagMarkup(tag);
      dom.optionsGrid.appendChild(button);
    });
  }

  function handleOptionClick(event) {
    const button = event.target.closest(".option-card");
    if (!button || !run || run.locked) return;

    run.locked = true;
    const entry = run.queue[run.index];
    const question = entry.question;
    const picked = button.dataset.tag;
    const isCorrect = picked === question.tag;

    const buttons = dom.optionsGrid.querySelectorAll(".option-card");
    buttons.forEach(function (option) {
      option.disabled = true;
      if (option.dataset.tag === question.tag) {
        option.classList.add("correct");
      } else if (option === button) {
        option.classList.add("incorrect");
      } else {
        option.classList.add("is-muted");
      }
    });

    let award = 0;
    if (isCorrect) {
      // The combo is banked first, so the multiplier on screen is always
      // exactly the one the answer just paid out at.
      run.streak += 1;
      run.bestStreak = Math.max(run.bestStreak, run.streak);
      run.correctCount += 1;
      if (run.scored) {
        award = Math.round(POINTS_PER_CORRECT * multiplierForCombo(run.streak));
        run.bestMultiplier = Math.max(
          run.bestMultiplier,
          multiplierForCombo(run.streak)
        );
        run.score += award;
        showPointsPop(award);
      }
      state.mastered.add(question.id);
      saveState();
      updateProgress();
    } else {
      run.streak = 0;
    }

    /*
      Explanations are held back during a timed run: reading one costs clock
      time the learner cannot spare, and they all appear together on the
      results screen once the sprint is over. An untimed run has no clock, so
      the explanation shows immediately and stays up until Next is pressed.
    */
    if (run.mode !== "timed") {
      dom.feedbackNote.innerHTML = isCorrect
        ? question.explain
        : "<strong>Not quite.</strong> " + question.explain;
      dom.feedbackNote.classList.toggle("is-wrong", !isCorrect);
    }

    run.history.push({
      question: question,
      tier: entry.tier,
      picked: picked,
      correct: isCorrect,
      award: award,
    });

    updateRunStats();

    if (run.mode !== "timed") {
      // Untimed runs wait for the learner rather than auto-advancing, so the
      // explanation stays readable for as long as they want it.
      dom.btnNext.hidden = false;
      dom.btnNext.disabled = false;
      dom.btnNext.focus();
      return;
    }

    // Captured so a flash left over from a run that has since ended (the
    // clock ran out, or the learner started a different mode) cannot
    // advance whatever run is current when it fires.
    const flashingRun = run;
    window.setTimeout(function () {
      if (run !== flashingRun) return;
      goToNextQuestion();
    }, FLASH_MS);
  }

  function goToNextQuestion() {
    if (!run) return;
    dom.btnNext.hidden = true;
    run.index += 1;
    showQuestion();
  }

  /*
    Walks the combo one answer at a time rather than using a closed formula,
    because the step size doubling every band is far easier to read (and to
    check against the copy) written out than folded into an exponent. The
    combo is bounded by how many questions fit in a run, so the loop is
    cheap.
  */
  function multiplierForCombo(combo) {
    let multiplier = 1;
    let step = COMBO_BASE_STEP;
    for (let i = 0; i < combo; i++) {
      multiplier += step;
      if ((i + 1) % COMBO_BAND === 0) step *= 2;
    }
    return Math.min(MAX_MULTIPLIER, multiplier);
  }

  function formatMultiplier(multiplier) {
    // One decimal while the steps are still fine-grained, whole numbers once
    // the combo is large enough that a decimal is just noise.
    const rounded = Math.round(multiplier * 10) / 10;
    return (Number.isInteger(rounded) ? rounded : rounded.toFixed(1)) + "x";
  }

  function showPointsPop(award) {
    dom.pointsPop.textContent = "+" + award;
    dom.pointsPop.classList.remove("is-visible");
    // Forces a reflow so the animation restarts on consecutive correct
    // answers rather than only playing the first time.
    void dom.pointsPop.offsetWidth;
    dom.pointsPop.classList.add("is-visible");
  }

  function updateRunStats() {
    if (!run) return;

    if (!run.scored) {
      dom.correctValue.textContent =
        run.correctCount + "/" + run.history.length;
      return;
    }

    const multiplier = multiplierForCombo(run.streak);
    dom.scoreValue.textContent = run.score.toLocaleString("en-AU");
    dom.streakValue.textContent = String(run.streak);
    dom.multiplierValue.textContent = formatMultiplier(multiplier);
    dom.multiplierValue.classList.toggle("is-hot", multiplier > 1);
    dom.multiplierValue.classList.toggle("is-max", multiplier >= MAX_MULTIPLIER);
    // Lights up as each band of ten is cleared, so the moment the step size
    // doubles is something the learner can see happen.
    dom.streakValue.classList.toggle("is-hot", run.streak >= COMBO_BAND);
    if (run.mode === "timed") updateTimerDisplay();
  }

  // ── Timer ───────────────────────────────────────────────────────────────
  /*
    Compares against Date.now() on every tick rather than counting ticks,
    which would drift, and pauses when the tab is hidden so a backgrounded
    run does not silently bleed its clock.
  */
  function startTimer() {
    stopTimer();
    run.timerId = window.setInterval(function () {
      updateTimerDisplay();
      if (Date.now() >= run.endsAt) endRun("time");
    }, 200);
  }

  function stopTimer() {
    if (run && run.timerId) {
      window.clearInterval(run.timerId);
      run.timerId = null;
    }
  }

  function updateTimerDisplay() {
    const remaining = Math.max(0, run.endsAt - Date.now());
    dom.timerValue.textContent = formatTime(remaining);
    dom.timerValue.classList.toggle("is-low", remaining <= 15000 && remaining > 5000);
    dom.timerValue.classList.toggle("is-critical", remaining <= 5000);
  }

  function handleVisibilityChange() {
    if (!run || run.mode !== "timed") return;
    if (document.hidden) {
      stopTimer();
      run.pausedRemaining = Math.max(0, run.endsAt - Date.now());
    } else if (typeof run.pausedRemaining === "number") {
      run.endsAt = Date.now() + run.pausedRemaining;
      run.pausedRemaining = null;
      startTimer();
    }
  }

  // ── Ending a run ────────────────────────────────────────────────────────
  function endRun(reason) {
    if (!run) return;
    stopTimer();

    const finished = run;
    const isTimed = finished.scored;
    const previousBest = isTimed ? state.best[finished.modeId] || 0 : 0;
    let isNewBest = false;

    if (isTimed && finished.score > previousBest) {
      state.best[finished.modeId] = finished.score;
      isNewBest = true;
      saveBest();
      reportBestScores();
    }

    const correctCount = finished.correctCount;

    dom.quizPanel.hidden = true;
    dom.runStats.hidden = true;
    dom.btnNext.hidden = true;
    dom.btnQuit.disabled = true;
    dom.resultsPanel.hidden = false;
    dom.titleBarTitle.textContent = "Run finished";
    dom.titleBarBadge.textContent = "Results";

    if (reason === "time") {
      dom.resultsTitle.textContent = "Time is up";
    } else if (reason === "quit") {
      dom.resultsTitle.textContent = "Run ended";
    } else {
      dom.resultsTitle.textContent = "All tags answered";
    }

    if (isTimed) {
      dom.resultsScore.textContent =
        finished.score.toLocaleString("en-AU") + " points";
      dom.resultsBest.textContent = isNewBest
        ? "New high score, up from " + previousBest.toLocaleString("en-AU") + "."
        : "Your best on this mode is " +
          previousBest.toLocaleString("en-AU") +
          " points.";
      dom.resultsBest.classList.toggle("is-new-best", isNewBest);
      dom.resultsStreakRule.textContent =
        correctCount +
        " of " +
        finished.history.length +
        " correct, best combo " +
        finished.bestStreak +
        " at " +
        formatMultiplier(finished.bestMultiplier) +
        ".";
    } else {
      dom.resultsScore.textContent =
        correctCount + " of " + finished.history.length + " correct";
      dom.resultsBest.textContent = "";
      dom.resultsBest.classList.remove("is-new-best");
      dom.resultsStreakRule.textContent = "";
    }

    renderResultsList(finished.history);
    run = null;
  }

  function renderResultsList(history) {
    dom.resultsList.innerHTML = "";
    if (!history.length) {
      const empty = document.createElement("p");
      empty.className = "results-row-explain";
      empty.textContent = "No questions were answered in this run.";
      dom.resultsList.appendChild(empty);
      return;
    }

    history.forEach(function (row) {
      const el = document.createElement("div");
      el.className = "results-row " + (row.correct ? "is-correct" : "is-wrong");

      const answerLine = row.correct
        ? 'Correct: <code class="answer-right">' +
          tagMarkup(row.question.tag) +
          "</code>"
        : 'You picked <code class="answer-wrong">' +
          tagMarkup(row.picked) +
          '</code>, the answer is <code class="answer-right">' +
          tagMarkup(row.question.tag) +
          "</code>";

      // Only a scored run has points to report per answer.
      const points =
        row.correct && row.award
          ? '<div class="results-row-points">+' + row.award + "</div>"
          : "";

      el.innerHTML =
        '<div class="results-row-body">' +
        '<div class="results-row-prompt">' +
        escapeHtml(row.question.prompt) +
        "</div>" +
        '<div class="results-row-answer">' +
        answerLine +
        "</div>" +
        '<div class="results-row-explain">' +
        row.question.explain +
        "</div>" +
        "</div>" +
        points;

      dom.resultsList.appendChild(el);
    });
  }

  // ── Progress ────────────────────────────────────────────────────────────
  function updateProgress() {
    const total = totalQuestionCount();
    const mastered = state.mastered.size;
    const pct = total ? Math.round((mastered / total) * 100) : 0;

    dom.progressCount.textContent = mastered + "/" + total;
    dom.progressFill.style.width = pct + "%";
    dom.progressFill.classList.toggle("is-complete", pct >= 100);

    if (window.WDFBProgress) {
      window.WDFBProgress.setPercent(ACTIVITY_ID, pct);
    }
  }

  /*
    Surfaces the timed high scores on the dashboard. These are reported as
    stats rather than folded into the percent, because a high score says
    something different from coverage: a big sprint score does not mean the
    learner has seen every tag, and the progress bar has to keep meaning that.
  */
  function reportBestScores() {
    if (!window.WDFBProgress || !window.WDFBProgress.setStats) return;
    const stats = {};
    TIMED_MODES.forEach(function (mode) {
      const best = state.best[mode.id];
      if (best) {
        stats["Best, " + describeDuration(mode.seconds)] =
          best.toLocaleString("en-AU");
      }
    });
    window.WDFBProgress.setStats(ACTIVITY_ID, stats);
  }

  // ── Storage ─────────────────────────────────────────────────────────────
  function loadState() {
    const valid = new Set(
      allQuestions().map(function (entry) {
        return entry.question.id;
      })
    );

    try {
      const raw = window.localStorage.getItem(STATE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.mastered)) {
          parsed.mastered.forEach(function (id) {
            if (valid.has(id)) state.mastered.add(id);
          });
        }
      }
    } catch (err) {
      /* A corrupt or unreadable store just means starting fresh. */
    }

    try {
      const rawBest = window.localStorage.getItem(BEST_KEY);
      if (rawBest) {
        const parsedBest = JSON.parse(rawBest);
        TIMED_MODES.forEach(function (mode) {
          const value = parsedBest[mode.id];
          if (typeof value === "number" && isFinite(value) && value >= 0) {
            state.best[mode.id] = value;
          }
        });
      }
    } catch (err) {
      /* Same again: a missing best score is not worth failing over. */
    }
  }

  function saveState() {
    try {
      window.localStorage.setItem(
        STATE_KEY,
        JSON.stringify({ mastered: Array.from(state.mastered) })
      );
    } catch (err) {
      /* Storage can be full or blocked; the run still works without it. */
    }
  }

  function saveBest() {
    try {
      window.localStorage.setItem(BEST_KEY, JSON.stringify(state.best));
    } catch (err) {
      /* As above. */
    }
  }

  // ── Init ────────────────────────────────────────────────────────────────
  function init() {
    if (window.WDFBProgress) window.WDFBProgress.markViewed(ACTIVITY_ID);

    loadState();
    buildSidebar();
    buildWelcomeStats();
    updateProgress();
    reportBestScores();

    dom.optionsGrid.addEventListener("click", handleOptionClick);
    dom.btnStart.addEventListener("click", beginRun);
    dom.btnNext.addEventListener("click", goToNextQuestion);
    dom.btnQuit.addEventListener("click", function () {
      endRun("quit");
    });
    dom.btnRunAgain.addEventListener("click", function () {
      const active = dom.categoryList.querySelector(".mode-item.active");
      if (active) armRun(modeOptionsFrom(active));
    });
    dom.btnBackToModes.addEventListener("click", showWelcome);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Never auto-start a run, even for a returning learner with progress:
    // the welcome state stays until a mode is picked.
    showWelcome();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
