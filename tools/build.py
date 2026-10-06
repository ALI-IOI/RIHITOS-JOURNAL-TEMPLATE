#!/usr/bin/env python3
"""Bundle the journal into ONE self-contained HTML file.

  python tools/build.py              -> dist/journal.html (three.js inlined, works offline)
  python tools/build.py --cdn        -> loads three.js from cdnjs instead (smaller file)

Run it from the repository root. Needs only Python 3.
"""
import pathlib, re, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
cdn = "--cdn" in sys.argv
html = (ROOT / "index.html").read_text(encoding="utf-8")

def css(m):
    return "<style>\n" + (ROOT / m.group(1)).read_text(encoding="utf-8") + "\n</style>"
def js(m):
    src = m.group(1)
    if cdn and src.endswith("three.min.js"):
        return '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>'
    code = (ROOT / src).read_text(encoding="utf-8").replace("</script", "<\\/script")
    return "<script>\n" + code + "\n</script>"

html = re.sub(r'<link rel="stylesheet" href="((?:css)/[^"]+)">', css, html)
html = re.sub(r'<script src="((?:js|data|vendor)/[^"]+)"></script>', js, html)
out = ROOT / "dist"; out.mkdir(exist_ok=True)
(out / "journal.html").write_text(html, encoding="utf-8")
print("wrote", out / "journal.html", f"{len(html)//1024} KB")
