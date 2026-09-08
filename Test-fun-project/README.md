# Genre Mixer

## Starten

Im Ordner `Test-fun-project` ausführen:

```bash
node server.js
```

Danach im Browser öffnen:

```text
http://127.0.0.1:5500/
```

Die Spotify-App muss diese Redirect-URI enthalten:

```text
http://127.0.0.1:5500/callback
```

Die App nutzt Spotify OAuth mit PKCE. Es wird kein Client Secret im Browser gespeichert.

## Last.fm-Genres

Für die Genre-Erkennung wird ein Last.fm-API-Key benötigt. Lege im Ordner `Test-fun-project` eine Datei `.env` an:

```text
LASTFM_API_KEY=dein-api-key
```

Danach den Server neu starten:

```bash
node server.js
```

Der Key bleibt auf dem lokalen Server und wird nicht an den Browser ausgeliefert.
