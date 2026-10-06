# How to use Rihito's Journal

A step-by-step guide for making this tracker your own. No coding needed for steps 1–8.

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

## 3. Start your journey (5 minutes)

The demo belongs to a made-up learner, IOI, which is why it counts down about 730 days from the day you
first open it. Replace it with your own plan:

1. On the home page, click the first card, **Start your journey** (or **Start** in the menu).
2. Answer the seven short steps:

| Step | What it asks | What it changes |
|---|---|---|
| **You** | First name, title for the home page, city, currency, what you study | Greeting, big title, page text, prices |
| **Timeline** | Start date, graduation/finish date, exam months, long breaks, low-energy months | Every phase and project date. Fewer projects land in exam months, more in breaks |
| **Your level** | Where you're starting from; Python, C/C++, linear algebra | Phases you already know shrink to a short review, and their projects are marked *Skipped* |
| **Focus & goal** | Drones, ground robots, arms or not sure; then study abroad, grad school at home, a job or your own product. For study abroad: countries and the month/year your programme starts | Phase 4–5 projects, the Apply page, deadlines and countdowns |
| **Time** | Hours per week, your weekend days, morning/evening/night, when your day starts and ends | Daily targets, planned blocks and the first day of your week |
| **Learning** | Which free platforms you like (MIT OpenCourseWare, freeCodeCamp, Coursera audit, edX/CS50, Khan Academy, YouTube teachers, official docs, free textbooks, GitHub code), how you learn best, free only or some paid | Matching courses get a **For you** tag and move to the top of Learn; each project's links are reordered to your style; *Free only* turns on the Free filter |
| **Tools & tests** | What you already own; whether you still need an English test | Parts inventory and shopping list; IELTS/TOEFL, JLPT or TOPIK dates |

3. **Review** shows everything that will be built: phases with dates, deadlines with their sources,
   daily hours and parts. Warnings appear if a deadline has already passed or the time is too short.
4. Press **Build my journal ✦**. The site rebuilds itself and takes you back to the home page.

**Where do the deadlines come from?** The journal has no server, so it doesn't search the web
live. It uses a built-in table of application windows taken from each programme's official page (MEXT,
CSC, Open Doors, GKS, Chevening, EducationUSA, JLPT), and every date links to its source. Windows move a
little each year, so on the Review step press **Copy a research prompt** and paste it into Claude or any
AI with web search to double-check them for your nationality. Fix anything that changed in
**Console → Hard dates**.

You can run **Start your journey** again at any time (it remembers your answers). It re-dates everything
but keeps your ticks, notes and daily log.

## 4. Inbox: mail, GitHub, Reddit and pinned links (optional)

Open **Inbox** in the menu. Nothing is connected until you choose to, each connection can be hidden with
**Show in the list** or removed with **Disconnect**, and tokens stay in that one browser (they are never
synced to your Gist or committed to GitHub).

| Source | What shows up | How to connect |
|---|---|---|
| **Pinned links** | Anything you paste: a mail to answer, a LinkedIn message, a Discord thread, a deadline | Fill in **Pin something**. Pins sync across devices with your Gist |
| **GitHub** | Your unread notifications: reviews, mentions, issues | Create a **classic** token with only the `notifications` scope at github.com → Settings → Developer settings → Tokens (classic). GitHub's notifications API does not accept fine-grained tokens. Paste it under GitHub → **Connect** |
| **Gmail** | Starred mail and important unread mail: subject and sender only, never the body | See *Gmail setup* below (10 minutes, once) |
| **Reddit** | Unread messages and your saved posts | See *Reddit setup* below |
| **Quick links** | One-click buttons to LinkedIn, X, Discord, YouTube, Instagram, Facebook or any link you add | **Edit** under Quick links. These services don't let a personal web page read your notifications, so they open in a new tab instead |

**Gmail setup** (Gmail needs your own free Google sign-in client, because this site has no server):
1. Go to console.cloud.google.com, create a project, then **APIs & Services → Library → Gmail API → Enable**.
2. **OAuth consent screen**: choose *External*, give it a name and your email, and add your own Gmail address under **Test users**. Leave it in *Testing*.
3. **Credentials → Create credentials → OAuth client ID → Web application**. Under *Authorised JavaScript origins* add your site, e.g. `https://YOUR-USERNAME.github.io`. Copy the **Client ID**.
4. In the journal: **Inbox → Gmail → Connect Gmail**, paste the Client ID, press **Connect** and pick your account. Google warns that the app isn't verified; that's expected for your own testing app, so continue.
5. The journal asks only for *metadata* access (labels, subject, sender). Access lasts about an hour; press **Refresh** to sign in again.

**Reddit setup**:
1. Go to reddit.com/prefs/apps → **create another app** → choose **installed app**.
2. Set the **redirect uri** to your site's exact address, e.g. `https://YOUR-USERNAME.github.io/my-robotics-journal/` (the Inbox card shows the exact one to copy).
3. Copy the client ID shown under the app's name, paste it in **Inbox → Reddit**, press **Connect**, then **Allow**. Access lasts an hour.

## 5. Fine-tune anything (Console)
After setup, open **Console** in the menu to change any single detail.

| Card | What to do |
|---|---|
| **Profile** | Your name, the name used in the greeting, the two lines of the big title, your currency, and your **start** and **end** dates. Open *Page text* to rewrite any sentence on the site. Press **Save profile**. |
| **Countdowns** | The three day-counters on the Mission page: a label and a date each. |
| **Hard dates** | Deadlines you can't miss (exams, applications, launches). **+ Add date** for more; tick *Hard* for the important ones. |
| **Daily tracker** | When your day starts and ends, how long each square is (15–60 min), your target hours for each weekday, your activities and their colours, and your planned blocks, for example `19:00-21:00 Build`. |
| **Roadmap items** | Pick a phase, then **Edit** an item, **+ New item**, or **Delete**. Add learning links as `Title | https://…`, one per line. |

The page reloads after each save. To undo all of it, use **Backup → Reset console edits**.


## 6. Use it every day

- **Daily page.** Pick an activity at the top (Build, Study, …), then click or drag across the squares
  for the time you actually worked. Click a filled square again to clear it. Dashed squares are your plan.
  The table on the right shows each day's hours and **% of target**. The graph-paper chart joins the days
  (Week / Month / Year), and the year grid below shows your streak.
- **Tracker / Board.** Set each item to *In progress* or *Done*. Click an item to open its notes and learning links.
- **Review habit.** After finishing something, rebuild it from memory on Day 7 and Day 30, then set its
  **Review** column. This is what makes the learning stick.
- **Parts.** Keep your inventory and shopping list here; search finds anything in both.
- **Home.** Scroll or swipe to flip through the cards; click one to jump to that page.
- **Background.** A 5-minute animated flight loops behind every page. To change it on one device: **Console → Backup → Background animation** (loop everywhere, loop on home only, or plain).

Your progress saves automatically in the browser you are using.

## 7. See the same progress on every device (optional)

Progress lives in each browser separately until you connect a **private GitHub Gist**:

1. GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. Name it `journal-sync`, pick an expiry, and under **Account permissions** set **Gists** to **Read and write**. Nothing else. Generate and copy it.
3. On your first device: **Console → Sync across devices** → paste the token, leave *Gist ID* empty → **Connect & sync**. Copy the Gist ID it shows.
4. On every other device: paste the **same token and the Gist ID** → **Connect & sync**.

It syncs when the page opens, every 5 minutes, and a few seconds after each change. On a shared computer,
press **Forget on this device** when you're done. More detail: [`docs/SYNC.md`](docs/SYNC.md).

## 8. Back up

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
| My progress disappeared | Progress is per browser. Did you switch browser, use a private window, or clear site data? Use sync (step 7) or Import a backup. |
| Sync says "Token rejected (401)" | The token expired or lacks *Gists: Read and write*. Make a new one. |
| Sync says "Gist not found (404)" | The Gist ID is wrong, or the token belongs to a different GitHub account. |
| Squares shifted after changing the tracker | Changing the start time or square length moves where old ticks fall. Change those settings before you start logging. |
| Inbox says "Failed to fetch" | A browser extension or network is blocking the service, or the token expired. Press **Refresh**, or **Disconnect** and connect again. |
| Gmail: "access blocked" or origin error | The site address isn't in *Authorised JavaScript origins*, or your Gmail isn't listed as a test user. |
| Want to start over | **Console → Reset console edits**, then clear the site's data in your browser settings. |
| A deadline in my plan is wrong | Windows change yearly. Check the linked official page, then edit it in **Console → Hard dates** or run **Start your journey** with a different start year. |
| "Dates have already passed" warning | Your chosen programme start is too soon. Pick a later year on the Focus & goal step. |
