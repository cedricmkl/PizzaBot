---
aliases: ["50001"]
---

Wenn du den Fehler `DiscordAPIError[50001]: Missing Access` im Bezug mit Slash Commands bekommst, hast du vermutlich bei der Erstellung des Einlandungslinks nur die "scope" bot angeklickt. Damit dein Bot Slash Commands erstellen und verändern kann, muss er mit der scope `applications.commands` **neu** eingeladen werden. Das machst du einfach indem du in deinem Developer Dashboard einen neuen Invitelink mit der scope erstellst und deinen bot neu einlädst. Das sieht dann so aus: https://cdn.discordapp.com/attachments/846803986052415518/895789553275785217/unknown.png
