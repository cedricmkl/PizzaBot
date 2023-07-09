import json
with open("tags.json", "r") as f:
    tags = json.load(f)
    for tag in tags:
        name = tag["name"]
        aliases = tag.get("aliases", [])
        content = tag["content"]
        markdown = ""
        if len(aliases) != 0:
            markdown = f"""---
aliases: ["{'", "'.join(aliases)}"]
---\n
"""
        markdown += f"{content}\n"
        with open(f"{name}.md", "w") as f:
            f.write(markdown)
