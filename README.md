# Web Dev For Beginners

![HTML5](https://img.shields.io/badge/HTML5-blue?style=flat-square) ![CSS3](https://img.shields.io/badge/CSS3-blue?style=flat-square) ![JavaScript](https://img.shields.io/badge/JavaScript-blue?style=flat-square) ![Status](https://img.shields.io/badge/status-in%20progress-green?style=flat-square) [![Deployed on GitHub Pages](https://img.shields.io/badge/deployed-GitHub%20Pages-green?style=flat-square)](https://raikiri001.github.io/Website-Develeopment-For-Beginners/)

## Description

A single static site that teaches HTML and CSS from first principles, pairing
written theory lessons with hands-on practical activities and timed quizzes. It
is built for Year 10 students who are early in learning web development, so
every lesson explains a concept before an activity asks them to use it. The
homepage lays the activities out as a route from basics to advanced, and a
dashboard tracks progress locally in the browser, with no account or backend
involved.

## Features

- Theory lessons on HTML tags and attributes, file paths, CSS properties, CSS
  selectors, and the three places CSS can live, each with a contents rail, key
  points, reference tables and comparison tables.
- An interactive parser simulator that steps through HTML and CSS one token at
  a time and builds the DOM, CSSOM and render trees live.
- Practical activities: drag-and-drop HTML structure problems, an HTML
  debugger, path resolution, fill-in-the-blank CSS, selector writing, and
  matching CSS to a live preview.
- Timed quizzes with a combo-based scoring system, difficulty tiers and high
  scores.
- A dashboard showing overall and per-activity progress, read from
  localStorage.
- Light and dark themes driven by `prefers-color-scheme`.
- Answer keys shipped obfuscated rather than in the clear, so solutions are not
  readable from view-source.
- No build step, and page-relative paths throughout, so the site runs unchanged
  from any sub-path including GitHub Pages.

## Technologies Used

- HTML5
- CSS3 (custom properties, grid, flexbox)
- JavaScript (vanilla, no framework)
- Web Storage API (localStorage) for progress tracking
- Shadow DOM for scoped live previews
- Node.js and the `serve` package (local development only)

## Installation

```bash
git clone https://github.com/Raikiri001/Website-Develeopment-For-Beginners.git
cd Website-Develeopment-For-Beginners
npm install
```

## Usage

```bash
npm start
# or, without installing anything:
npx serve .
```

1. Open the address `serve` prints, usually `http://localhost:3000`.
2. Pick an activity from the homepage, or use the **Group by** control to
   switch between grouping by language and by activity type.
3. Work through the activities in order; progress saves automatically to the
   browser.
4. Open the **Dashboard** to see overall and per-activity progress.
5. Navigate by the site's own links rather than typing a bare `index.html`
   URL, which `serve` rewrites in a way that breaks page-relative assets.

Alternatively, visit the live site:
<https://raikiri001.github.io/Website-Develeopment-For-Beginners/>

## File Structure

```
index.html               Homepage, renders activity cards from the manifest
dashboard/               Progress dashboard, reads localStorage
data/activities.json     The activity manifest, the single source of truth
assets/css/tokens.css    Design tokens: colour, type, spacing, radius, shadow
assets/css/base.css      Reset, typography and shared components
assets/css/lesson.css    Shared layout for the theory lesson series
assets/js/lesson.js      Shared renderer for theory lessons
assets/js/progress.js    localStorage progress store used site-wide
theory/<slug>/           One folder per theory lesson or simulator
practical/<slug>/        One folder per practical activity
quiz/<slug>/             One folder per quiz
CLAUDE.md                Content, design and code conventions for the project
```

## Author(s)

Raikiri001
