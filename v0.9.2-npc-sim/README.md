# NPC Utility AI v0.9.2

Dieses kleine PHP-Projekt zeigt eine einfache Welt-Simulation für NPCs mit:

- Graph-basierter Bewegung zwischen Orten
- Utility-AI anhand von Hunger, Durst und Gesundheit
- Zielwahl über Priorisierung von Bedürfnissen
- Off-Screen-Simulation für jede Stunde
- Spielerentscheidung zur Rekrutierung eines NPCs im Safehouse

## Starten

Im Projektordner:

```bash
php -S localhost:8000
```

Danach im Browser öffnen:

```text
http://localhost:8000
```

## Struktur

- `index.php` – Logik und Darstellung
- `style.css` – Darstellung der UI

## Idee der Architektur

Die Simulation folgt der Struktur:

```text
Ziel bestimmen
   ↓
Graph-Route berechnen
   ↓
Nächsten Schritt gehen
   ↓
Ankunft: Interaktion / Ereignis
   ↓
Weltlog aktualisieren
```

Das ist die Grundlage für spätere Erweiterungen wie Händler, Horden, Fraktionen und dynamische Quests.
