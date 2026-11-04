"""Builds the site from content/ and templates/ into built-site/.

Usage: python build.py          build once
       python build.py serve    build, serve on localhost:8000, rebuild on change
"""
import http.server
import shutil
import sys
import threading
import time
from functools import partial
from pathlib import Path

try:
    import markdown
    import yaml
    from jinja2 import Environment, FileSystemLoader
except ImportError as error:
    sys.exit(f"{error}\nInstall dependencies with: python -m pip install -r requirements.txt")

ROOT = Path(__file__).parent
CONTENT = ROOT / "content"
TEMPLATES = ROOT / "templates"
STATIC = ROOT / "static"
OUTPUT = ROOT / "built-site"
PORT = 8000
CASE_STUDIES_DIR = "case-studies"
EXPERIENCE_URL = "/experience/"
REQUIRED_ROLE_FIELDS = ("title", "company", "role", "dates", "cover", "media")
MEDIA_TYPES = ("video", "image")


# Returns (front matter dict, raw body) for a file with a leading --- block.
def split_front_matter(path):
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---"):
        raise ValueError(f"{path} must start with a --- front matter block")
    _, header, body = text.split("---", 2)
    return yaml.safe_load(header) or {}, body


# Returns only the front matter dict, for files that have no body (site.md, contact.md).
def read_meta(path):
    return split_front_matter(path)[0]


# Returns (front matter dict, body html).
def read_markdown(path):
    meta, body = split_front_matter(path)
    return meta, markdown.markdown(body.strip())


# Each company is a folder: index.md is the role page, case-studies/*.md are its case studies.
def load_roles():
    roles = []
    for folder in sorted(p for p in CONTENT.iterdir() if (p / "index.md").exists()):
        meta, body = read_markdown(folder / "index.md")
        case_studies = []
        for path in sorted((folder / CASE_STUDIES_DIR).glob("*.md")):
            case_meta, case_body = read_markdown(path)
            case_studies.append({**case_meta, "slug": path.stem, "body": case_body})
        roles.append({**meta, "slug": folder.name, "body": body, "case_studies": case_studies})
    return sorted(roles, key=lambda role: role.get("order", 0))


# Fails with a message naming the file when a role would render incorrectly.
def validate_roles(roles):
    orders = {}
    for role in roles:
        where = f"content/{role['slug']}/index.md"
        for field in REQUIRED_ROLE_FIELDS:
            if not role.get(field):
                raise ValueError(f"{where}: missing required field '{field}'")
        if role["media"].get("type") not in MEDIA_TYPES:
            raise ValueError(f"{where}: media type must be one of {', '.join(MEDIA_TYPES)}")
        images = [role["cover"]]
        if role["media"]["type"] == "image":
            images.append(role["media"].get("src", ""))
        for image in images:
            if not (STATIC / image.lstrip("/")).is_file():
                raise ValueError(f"{where}: image {image or '(empty)'} not found under static/")
        if role.get("order") in orders:
            raise ValueError(f"{where}: order {role['order']} is already used by {orders[role['order']]}")
        orders[role.get("order")] = where


def write_page(env, url, template, **context):
    target = OUTPUT / url.strip("/") / "index.html"
    target.parent.mkdir(parents=True, exist_ok=True)
    html = env.get_template(template).render(path=url, **context)
    target.write_text(html, encoding="utf-8")


# Empties built-site/ without deleting the folder itself, which Windows refuses while a server uses it.
def clear_output():
    OUTPUT.mkdir(exist_ok=True)
    for entry in OUTPUT.iterdir():
        if entry.is_dir():
            shutil.rmtree(entry)
        else:
            entry.unlink()


# Empties built-site/ and copies in the static files and CNAME.
def prepare_output():
    clear_output()
    shutil.copytree(STATIC, OUTPUT, dirs_exist_ok=True)
    if (ROOT / "CNAME").exists():
        shutil.copy(ROOT / "CNAME", OUTPUT / "CNAME")


# Loads the content and renders every page.
def render_site():
    env = Environment(loader=FileSystemLoader(TEMPLATES), autoescape=True)
    env.globals["experience_url"] = EXPERIENCE_URL
    site = read_meta(CONTENT / "site.md")
    roles = load_roles()
    validate_roles(roles)

    home_meta, home_body = read_markdown(CONTENT / "home.md")
    home = {**home_meta, "body": home_body}
    banner = (CONTENT / "banner.txt").read_text(encoding="utf-8").rstrip()
    write_page(env, "/", "home.html", site=site, home=home, banner=banner)
    write_page(env, EXPERIENCE_URL, "experience-index.html", site=site, roles=roles, title="experience")
    contact = read_meta(CONTENT / "contact.md")
    write_page(env, "/contact/", "contact.html", site=site, contact=contact, title="contact")
    for role in roles:
        write_page(env, f"{EXPERIENCE_URL}{role['slug']}/", "role.html", site=site, role=role, title=role["title"])
        for case in role["case_studies"]:
            write_page(env, f"{EXPERIENCE_URL}{role['slug']}/{case['slug']}/", "case-study.html",
                       site=site, role=role, case=case, title=case["title"])


def build():
    prepare_output()
    render_site()
    print(f"built {len(list(OUTPUT.rglob('index.html')))} pages into {OUTPUT.name}/")


def newest_mtime():
    files = [p for d in (CONTENT, TEMPLATES, STATIC) for p in d.rglob("*") if p.is_file()]
    return max(p.stat().st_mtime for p in files)


def serve():
    build()

    def watch():
        seen = newest_mtime()
        while True:
            time.sleep(1)
            latest = newest_mtime()
            if latest != seen:
                seen = latest
                try:
                    build()
                except Exception as error:
                    print(f"build failed: {error}")

    threading.Thread(target=watch, daemon=True).start()
    handler = partial(http.server.SimpleHTTPRequestHandler, directory=str(OUTPUT))
    print(f"serving http://localhost:{PORT}/")
    http.server.ThreadingHTTPServer(("127.0.0.1", PORT), handler).serve_forever()


if __name__ == "__main__":
    try:
        if sys.argv[1:] == ["serve"]:
            serve()
        else:
            build()
    except ValueError as error:
        sys.exit(f"build failed: {error}")
