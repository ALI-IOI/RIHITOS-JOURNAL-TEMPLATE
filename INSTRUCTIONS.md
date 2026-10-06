# How to use Rihito's Journal

A step-by-step guide for making this tracker your own. No coding needed for steps 1–5.

**Live demo:** https://ali-ioi.github.io/RIHITOS-JOURNAL-TEMPLATE/

---

## 1. Make your own copy

1. Sign in to GitHub.
2. On this repository, click the green **Use this template** button → **Create a new repository**.
3. Give it a name (for example `my-robotics-journal`), choose **Public**, and click **Create repository**.

> Want to keep the code private? Choose **Private**, but note that free GitHub accounts can only publish
> a website from a **public** repository (step 2). Students can get GitHub Pro free through the
> GitHub Student Developer Pack, which allows Pages on private repositories. The site itself is
> still visible to anyone who has its link.

## 2. Turn it into a website

1. In your new repository, open **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to *Deploy from a branch*, **Branch** to `main` and folder `/ (root)`. Click **Save**.
3. Wait about a minute and refresh the page. Your link appears at the top, like
   `https://YOUR-USERNAME.github.io/my-robotics-journal/`.
4. Bookmark it on your laptop and phone.

*No GitHub?* Download the ZIP (**Code → Download ZIP**), unzip it and double-click `index.html`.
Everything works offline except the online sync.

## 3. Put your name and dates in (Console)

Open your site and click **Console** in the menu.

| Card | What to do |
|---|---|
| **Profile** | Your name, the name used in the greeting, the two lines of the big title, your currency, and your **start** and **end** dates. Open *Page text* to rewrite any sentence on the site. Press **Save profile**. |
| **Countdowns** | The three day-counters on the Mission page: a label and a date each. |
| **Hard dates** | Deadlines you can't miss (exams, applications, launches). **+ Add date** for more; tick *Hard* for the important ones. |
| **Daily tracker** | When your day starts and ends, how long each square is (15–60 min), your target hours for each weekday, your activities and their colours, and your planned blocks, for example `19:00-21:00 Build`. |
| **Roadmap items** | Pick a phase, then **Edit** an item, **+ New item**, or **Delete**. Add learning links as `Title | https://…`, one per line. |

The page reloads after each save. To undo all of it, use **Backup → Reset console edits**.

> The demo learner's dates are counted from the first day you open the site, so the plan always starts "now".
> Set your own start date in **Profile** to move every phase at once.

## 4. Use it every day

- **Daily page.** Pick an activity at the top (Build, Study, …), then click or drag across the squares
  for the time you actually worked. Click a filled square again to clear it. Dashed squares are your plan.
  The table on the right shows each day's hours and **% of target**. The graph-paper chart joins the days
  (Week / Month / Year), and the year grid below shows your streak.
- **Tracker / Board.** Set each item to *In progress* or *Done*. Click an item to open its notes and learning links.
- **Review habit.** After finishing something, rebuild it from memory on Day 7 and Day 30, then set its
  **Review** column. This is what makes the learning stick.
- **Parts.** Keep your inventory and shopping list here; search finds anything in both.
- **Home.** Scroll or swipe to flip through the cards; click one to jump to that page.

Your progress saves automatically in the browser you are using.

## 5. See the same progress on every device (optional)

Progress lives in each browser separately until you connect a **private GitHub Gist**:

1. GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. Name it `journal-sync`, pick an expiry, and under **Account permissions** set **Gists** to **Read and write**. Nothing else. Generate and copy it.
3. On your first device: **Console → Sync across devices** → paste the token, leave *Gist ID* empty → **Connect & sync**. Copy the Gist ID it shows.
4. On every other device: paste the **same token and the Gist ID** → **Connect & sync**.

It syncs when the page opens, every 5 minutes, and a few seconds after each change. On a shared computer,
press **Forget on this device** when you're done. More detail: [`docs/SYNC.md`](docs/SYNC.md).

## 6. Back up

**Console → Backup → Export JSON** downloads everything (progress, notes, parts, daily log, your edits).
**Import JSON** restores it, on any device.

---

## Going further (optional, light coding)

- **Change the whole roadmap:** edit `data/journal.js` directly on GitHub (click the file → pencil icon →
  *Commit changes*). Every page reads from this one file. A map of what's in it is in
  [`docs/CUSTOMIZE.md`](docs/CUSTOMIZE.md).
- **Single file:** run `python tools/build.py` to get `dist/journal.html` with everything inside.
- **Get updates from this template later:** in your copy, run
  ```
  git remote add template https://github.com/ALI-IOI/RIHITOS-JOURNAL-TEMPLATE.git
  git fetch template
  git merge template/main --allow-unrelated-histories
  ```
  If `data/journal.js` conflicts, keep your version.

## Troubleshooting

| Problem | Fix |
|---|---|
| The site shows a 404 | Pages takes a minute after you turn it on. Check **Settings → Pages** says "Your site is live". |
| My progress disappeared | Progress is per browser. Did you switch browser, use a private window, or clear site data? Use sync (step 5) or Import a backup. |
| Sync says "Token rejected (401)" | The token expired or lacks *Gists: Read and write*. Make a new one. |
| Sync says "Gist not found (404)" | The Gist ID is wrong, or the token belongs to a different GitHub account. |
| Squares shifted after changing the tracker | Changing the start time or square length moves where old ticks fall. Change those settings before you start logging. |
| Want to start over | **Console → Reset console edits**, then clear the site's data in your browser settings. |
