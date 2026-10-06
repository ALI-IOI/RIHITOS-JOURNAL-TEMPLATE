# Customising your journal

There are two ways to make it yours. Use whichever suits you; they work together.

## 1. The Console page (no code)

Open the **Console** tab in the app.

| Card | What it changes |
|---|---|
| Profile | Your name, the big home title, card code, currency, start/end dates, first day of the week, and every piece of page text |
| Countdowns | The three day-counters on Mission |
| Hard dates | Deadlines on Mission and the home stage |
| Daily tracker | Day start/end, square length, target hours per weekday, activity colours, planned blocks |
| Roadmap items | Edit, add or delete items in any phase (title, due date, description, links) |
| Sync | Private GitHub Gist sync (see `SYNC.md`) |
| Backup | Export/import everything as JSON; reset console edits |
| Raw edits | The JSON the console writes, for bulk changes |

Console edits are stored as a small set of overrides on top of `data/journal.js`, so you can
always reset back to the file.

## 2. Edit `data/journal.js` (full control)

Everything the app shows comes from this one file of plain JavaScript constants:

| Constant | Used by |
|---|---|
| `PROFILE`, `TEXT` | Name, titles and page text |
| `COUNTDOWNS`, `HARD`, `LX` | Gauges, deadlines and the four home-stage nodes |
| `DAILY` | The daily time-block tracker |
| `PHASES`, `ITEMS`, `LINKS` | Roadmap phases, items and their learning links |
| `TRACKS`, `RES` | Learn page |
| `BOOKS`, `SHELVES` | Books page |
| `PCATS`, `INV0`, `BUY0` | Parts inventory and shopping list (first-run defaults) |
| `CREDS`, `DOMAINS`, `SKILLS`, `COMM` | Credentials, Skills and Community pages |
| `PLAN`, `PORT`, `APPLY`, `DECK` | Plan, Portfolio and Apply pages, and the home cards |

Rules that keep it working:

- Keep the phase keys `p1 p1b p2 p3 p4 p5 p6 lang cred port skill`; the colours are tied to them.
- Item IDs must be unique. Prefixes such as `A1`, `E3`, `R5`, `K2` become clickable chips on the Parts page.
- Dates are `YYYY-MM-DD` strings.
- Keep `PROFILE.key` the same once you start; it names the browser storage that holds your progress.

## Single-file version

`python tools/build.py` writes `dist/journal.html` with everything inlined, which you can open
from a USB stick or email to yourself.
