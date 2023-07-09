---
aliases: ["location"]
---

Du versuchst warscheinlich gerade in einer älteren Version eine Location aus einer Config abzurufen. Doch in älteren Versionen gibt es die Methode `getLocation` nicht.
Du musst in älteren Versionen die Methode `get` verwenden und es zu einer Location casten.
Verwende dazu also statt
```java
Location location = config.getLocation()
```
einfach
```java
Location location = (Location) config.get()
```
Aber es gibt mehrere Gründe keine veralteten Versionen zu benutzen.
