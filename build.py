"""
מעדכן את הכותרת והפוטר בכל עמודי האתר מתוך התיקייה _partials.
הרצה:  python build.py

בכל עמוד, התוכן שבין <!-- HEADER:START --> ל-<!-- HEADER:END -->
(וכן FOOTER) מוחלף בתוכן של הקובץ המתאים ב-_partials.
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).parent
PARTIALS = {name: (ROOT / "_partials" / f"{name.lower()}.html").read_text(encoding="utf-8").rstrip()
            for name in ("HEADER", "FOOTER")}

for page in sorted(ROOT.glob("*.html")):
    html = page.read_text(encoding="utf-8")
    new = html
    for name, content in PARTIALS.items():
        pattern = re.compile(rf"<!-- {name}:START -->.*?<!-- {name}:END -->", re.S)
        block = f"<!-- {name}:START -->\n{content}\n<!-- {name}:END -->"
        new = pattern.sub(lambda m: block, new)
    if new != html:
        page.write_text(new, encoding="utf-8")
        print("updated", page.name)
    else:
        print("unchanged", page.name)
