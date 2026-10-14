"""
מעדכן את כל עמודי האתר.
הרצה:  python build.py

1. התוכן שבין <!-- HEADER:START --> ל-<!-- HEADER:END --> (וכן FOOTER)
   מוחלף בתוכן של הקובץ המתאים ב-_partials.
2. הקישורים ל-assets/styles.css ו-assets/main.js מקבלים ?v=<טביעת אצבע של התוכן>,
   כך שדפדפנים טוענים גרסה חדשה מיד אחרי כל שינוי בעיצוב או בקוד.
"""
import hashlib
import pathlib
import re

ROOT = pathlib.Path(__file__).parent
PARTIALS = {name: (ROOT / "_partials" / f"{name.lower()}.html").read_text(encoding="utf-8").rstrip()
            for name in ("HEADER", "FOOTER")}
ASSETS = ("assets/styles.css", "assets/main.js")
VERSIONS = {a: hashlib.md5((ROOT / a).read_bytes()).hexdigest()[:8] for a in ASSETS}
ASSET_RE = re.compile(r"(assets/(?:styles\.css|main\.js))(\?v=\w+)?")

for page in sorted(ROOT.glob("*.html")):
    html = page.read_text(encoding="utf-8")
    new = html
    for name, content in PARTIALS.items():
        pattern = re.compile(rf"<!-- {name}:START -->.*?<!-- {name}:END -->", re.S)
        block = f"<!-- {name}:START -->\n{content}\n<!-- {name}:END -->"
        new = pattern.sub(lambda m: block, new)
    new = ASSET_RE.sub(lambda m: f"{m.group(1)}?v={VERSIONS[m.group(1)]}", new)
    if new != html:
        page.write_text(new, encoding="utf-8")
        print("updated", page.name)
    else:
        print("unchanged", page.name)
