---
aliases: ["logger"]
---

Hallo c:
Du möchtest anscheinend etwas in deinem Plugin loggen.
Das solltest du jedoch nicht über `ConsoleSender` oder `System.out.println()` machen.
Dafür gibt es den Plugin Logger. Diesen bekommst du wenn du in deiner Plugin Klasse (da wo onEnable und so ist) `Plugin#getLogger()` aufrufst.
Dieser Logger schreibt für dich bereits alles in den Spigot Log zusammen mit deinem Pluginnamen.

Du darfst dafür sogar ausnahmsweise eine statische Methode in deiner Plugin Klasse anlegen, die den PluginLogger zurückgibt. Es ist jedoch immer besser die Logger Instanz dorthin mitzugeben, wo geloggt werden soll. Die meisten deiner Klassen haben vermutlich ohnehin eine Plugin Referenz, aus der du dir jederzeit den Logger holen kannst c:

```java
// normaler info log
logger.info("Das ist eine Info.");
logger.warning("Hier is etwas kaputt")

// Exception loggen
// Wir loggen die Exception auf den SEVERE Level. Das ist das höchste Level. Das benutzt man für kritische Fehler. Weniger kritische Fehler sollten mit WARNING geloggt werden.
catch(Exception e) {
  logger.log(LEVEL.SEVERE, "Da ging wohl was schief.", e)
}
```

Also dann! Frohes loggen!
