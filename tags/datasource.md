Wenn du das liest, arbeitest du vermutlich mit einer Datenbank und benutzt keine Data Source.

Vermutlich hast du auch eine der folgenden Dinge in deinem Code `public static Connection`, `MySQL.java`.
Eventuell hast du auch noch nie etwas von `Try-With-Resources` gehört. Im schlimmsten Fall hast du auch noch nie eine `close()` Methode aufgerufen.

Um immer eine stabile Verbindung zu deiner Datenbank zu haben ist es essentiell, dass etwas deine Verbindungen überwacht.
Das übernimmt die DataSource für dich. Außerdem kannst du damit parallele verbindungen zu deiner Datenbank aufbauen.

Ein `Try-With-Resources` verhindert außerdem Memory Leaks und gibt deine Connection automatisch wieder frei, wenn du sie nicht mehr brauchst.

Wenn du mehr wissen willst (**das willst du!**), dann lies dir bitte diesen Guide durch.
Englisch: <https://www.spigotmc.org/threads/480002/>
Deutsch: <https://minecraft-server.eu/forum/threads/63964/> 
