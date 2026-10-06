# Rihito's Journal — a robotics self-study tracker template

A personal learning tracker for anyone teaching themselves robotics, from a first circuit to robots
that map rooms and fly missions. Plain HTML, CSS and JavaScript: no build step, no server, no account.

It ships with a demo learner ("IOI") and a 24-month roadmap whose dates are counted from the day you
first open it, so the template never goes out of date. Replace the demo with your own plan from the
**Console** page, or by editing one data file.

## What's inside

- **Home** – a greeting and a deck of cards, one per section; scroll or swipe to browse.
- **Mission** – phases, gates, countdowns, deadlines and a build log.
- **Tracker / Board** – every roadmap item with status, spaced-review state and notes.
- **Daily** – a week of time blocks (30 min by default). Tick squares in an activity's colour; a side table
  turns each day into a % of your target, a graph-paper line chart joins the dots (week, month, year), and a
  year heatmap shows streaks.
- **Plan, Learn, Books, Parts, Credentials, Skills, Community, Portfolio, Apply** – the roadmap explained, free
  courses (MIT OpenCourseWare, freeCodeCamp, Coursera audits, official docs), a bookshelf, a parts inventory
  and shopping list, and the next step after the roadmap.
- **Console** – edit your profile, dates, daily targets, roadmap items; back up, import, reset; sync.

## Use it

1. Click **Use this template** on GitHub (or download the ZIP).
2. Open `index.html` in a browser. That's it.
3. To publish it: **Settings → Pages → Deploy from a branch → `main` / root**.

Your progress is saved in your browser. To see it on several devices, connect a private Gist
(`docs/SYNC.md`). To change content, see `docs/CUSTOMIZE.md`.

## Files

```
index.html          page markup
css/main.css        look and feel (dark/light themes)
css/daily.css       daily tracker and console
js/custom.js        applies Console edits on top of the data
js/app.js           all behaviour
data/journal.js     ALL content: edit this to make it yours
vendor/three.min.js 3D background (three.js r128, MIT)
tools/build.py      bundles everything into dist/journal.html
```

## Where the roadmap comes from

The order of topics follows what beginners are repeatedly pointed to in the r/robotics wiki, the
awesome-robotics list, PythonRobotics, MIT OpenCourseWare and MIT's Visual Navigation course, Northwestern's
Modern Robotics, and the official ROS 2, Nav2 and PX4 documentation. Every link in `data/journal.js` was
checked when this template was published; sites move, so report dead links in Issues.

## Licence

MIT for the code. three.js is MIT-licensed by its authors. Linked courses and books belong to their owners.
