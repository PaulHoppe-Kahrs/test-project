const CLIENT_ID = "ac5c820103d94d3186f4fc06503aba5c";
const REDIRECT_URI = "http://127.0.0.1:5500/callback";
const SCOPES = "playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private";

const loginButton = document.querySelector("#login-button");
const addPlaylistButton = document.querySelector("#add-playlist");
const loadPlaylistsButton = document.querySelector("#load-playlists");
const playlistList = document.querySelector("#playlist-list");
const genreSelect = document.querySelector("#genre-select");
const result = document.querySelector("#result");
const connectionStatus = document.querySelector("#connection-status");

let accessToken = sessionStorage.getItem("spotify_access_token");
let tracks = [];

function setResult(message, type = "") {
  result.textContent = message;
  result.className = `result ${type}`;
}

function createCodeVerifier() {
  const bytes = new Uint8Array(64);
  crypto.getRandomValues(bytes);
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function createCodeChallenge(verifier) {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const base64 = btoa(String.fromCharCode(...new Uint8Array(digest)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function startLogin() {
  const verifier = createCodeVerifier();
  const challenge = await createCodeChallenge(verifier);
  sessionStorage.setItem("spotify_code_verifier", verifier);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    code_challenge_method: "S256",
    code_challenge: challenge
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params}`;
}

async function exchangeCodeForToken(code) {
  const verifier = sessionStorage.getItem("spotify_code_verifier");
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: verifier
    })
  });

  if (!response.ok) {
    throw new Error("Spotify konnte die Anmeldung nicht bestätigen.");
  }

  const data = await response.json();
  accessToken = data.access_token;
  sessionStorage.setItem("spotify_access_token", accessToken);
  sessionStorage.removeItem("spotify_code_verifier");
  window.history.replaceState({}, document.title, window.location.pathname);
}

async function spotifyRequest(endpoint, options = {}) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    ...options.headers
  };

  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    ...options,
    headers
  });

  if (response.status === 401) {
    accessToken = null;
    sessionStorage.removeItem("spotify_access_token");
    updateConnectionStatus();
    throw new Error("Deine Spotify-Anmeldung ist abgelaufen.");
  }

  if (!response.ok) {
    let details = "";
    try {
      const errorData = await response.json();
      details = errorData.error?.message ? ` (${errorData.error.message})` : "";
    } catch {
      // Spotify kann bei manchen Fehlern einen leeren Antwortkörper senden.
    }
    throw new Error(`Spotify-Fehler ${response.status}${details}`);
  }

  return response.status === 204 ? null : response.json();
}

function extractPlaylistId(value) {
  const match = value.trim().match(/playlist\/([a-zA-Z0-9]+)(?:\?|$)/);
  return match ? match[1] : null;
}

async function getPlaylistTracks(playlistId) {
  async function getItems(endpoint) {
    const items = [];
    let url = `${endpoint}?limit=50`;

    while (url) {
      const page = await spotifyRequest(url);
      items.push(...(page.items || []));
      url = page.next ? new URL(page.next).pathname + new URL(page.next).search : null;
    }

    return items;
  }

  try {
    let items = await getItems(`/playlists/${playlistId}/items`);
    let tracks = items
      .map((entry) => {
        if (entry?.item?.id) return entry.item;
        if (entry?.item?.item?.id) return entry.item.item;
        if (entry?.track?.id) return entry.track;
        return entry;
      })
      .filter((track) => track?.id && track.artists?.length);

    if (!tracks.length) {
      items = await getItems(`/playlists/${playlistId}/tracks`);
      tracks = items
        .map((entry) => entry?.track || entry)
        .filter((track) => track?.id && track.artists?.length);
    }

    return tracks;
  } catch (error) {
    throw new Error(`Playlist ${playlistId} konnte nicht gelesen werden: ${error.message}`);
  }
}

async function getArtistGenres(artistIds) {
  const genres = new Map();
  for (let index = 0; index < artistIds.length; index += 50) {
    const batchIds = artistIds.slice(index, index + 50);

    try {
      const data = await spotifyRequest(`/artists?ids=${batchIds.join(",")}`);
      data.artists.forEach((artist) => genres.set(artist.id, artist.genres || []));
    } catch (error) {
      if (!error.message.includes("403")) throw error;

      for (const artistId of batchIds) {
        const artist = await spotifyRequest(`/artists/${artistId}`);
        genres.set(artist.id, artist.genres || []);
      }
    }
  }
  return genres;
}

async function getLastFmGenres(artists) {
  const response = await fetch("/api/artist-tags", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ artists })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Last.fm konnte keine Genres liefern.");
  return data.tags;
}

function fillGenreSelect() {
  const genres = [...new Set(tracks.flatMap((track) => track.genres))].sort();
  genreSelect.replaceChildren();

  if (!genres.length) {
    genreSelect.add(new Option("Keine Künstler-Genres gefunden", ""));
    return;
  }

  genreSelect.add(new Option("Genre auswählen", ""));
  genres.forEach((genre) => genreSelect.add(new Option(genre, genre)));
}

async function analysePlaylists() {
  if (!accessToken) {
    setResult("Bitte verbinde zuerst dein Spotify-Konto.", "error");
    return;
  }

  const links = [...document.querySelectorAll(".playlist-input")]
    .map((input) => input.value)
    .filter(Boolean);
  const playlistIds = links.map(extractPlaylistId).filter(Boolean);

  if (!playlistIds.length || playlistIds.length !== links.length) {
    setResult("Bitte füge mindestens einen gültigen Spotify-Playlist-Link ein.", "error");
    return;
  }

  loadPlaylistsButton.disabled = true;
  setResult("Playlists werden analysiert...");

  try {
    const playlistResults = await Promise.allSettled(playlistIds.map(getPlaylistTracks));
    const playlistTracks = playlistResults
      .filter((entry) => entry.status === "fulfilled")
      .flatMap((entry) => entry.value);
    const failedPlaylists = playlistResults
      .filter((entry) => entry.status === "rejected")
      .map((entry) => entry.reason.message);

    if (!playlistTracks.length) {
      throw new Error(failedPlaylists.join(" ") || "Spotify hat aus den Playlists keine lesbaren Songs zurückgegeben. Prüfe, ob die Playlists wirklich Titel enthalten.");
    }

    const uniqueTracks = [...new Map(playlistTracks.map((track) => [track.id, track])).values()];
    const artistIds = [...new Set(uniqueTracks.flatMap((track) => track.artists.map((artist) => artist.id)))];
    const artistGenres = await getArtistGenres(artistIds);
    const artistNames = [...new Set(uniqueTracks.flatMap((track) => track.artists.map((artist) => artist.name)))];
    const lastFmGenres = await getLastFmGenres(artistNames);

    tracks = uniqueTracks.map((track) => ({
      ...track,
      genres: [...new Set(track.artists.flatMap((artist) => [
        ...(artistGenres.get(artist.id) || []),
        ...(lastFmGenres[artist.name] || [])
      ]))]
    })).filter((track) => track.genres.length);

    if (!tracks.length) {
      fillGenreSelect();
      setResult(`${uniqueTracks.length} Songs wurden gelesen, aber Spotify liefert für diese Künstler keine Genre-Daten mehr. Die automatische Genre-Auswahl ist mit diesem Spotify-API-Zugriff nicht verfügbar.`, "error");
      return;
    }

    fillGenreSelect();
    const warning = failedPlaylists.length
      ? ` ${failedPlaylists.length} Playlist konnte nicht gelesen werden.`
      : "";
    setResult(`${tracks.length} Songs mit Künstler-Genre gefunden.${warning} Wähle jetzt ein Genre aus.`, failedPlaylists.length ? "" : "success");
  } catch (error) {
    setResult(error.message, "error");
  } finally {
    loadPlaylistsButton.disabled = false;
  }
}

async function createGenrePlaylist() {
  const selectedGenre = genreSelect.value;
  const matchingTracks = tracks.filter((track) => track.genres.some((genre) => genre === selectedGenre || genre.includes(selectedGenre)));

  if (!selectedGenre || !matchingTracks.length) {
    setResult("Bitte wähle ein Genre mit passenden Songs aus.", "error");
    return;
  }

  loadPlaylistsButton.disabled = true;
  setResult("Neue Spotify-Playlist wird erstellt...");

  try {
    const playlist = await spotifyRequest("/me/playlists", {
      method: "POST",
      body: JSON.stringify({
        name: `Genre Mixer - ${selectedGenre}`,
        description: `Erstellt mit Genre Mixer aus ${matchingTracks.length} passenden Songs.`,
        public: false
      })
    });

    for (let index = 0; index < matchingTracks.length; index += 100) {
      await spotifyRequest(`/playlists/${playlist.id}/items`, {
        method: "POST",
        body: JSON.stringify({ uris: matchingTracks.slice(index, index + 100).map((track) => `spotify:track:${track.id}`) })
      });
    }

    setResult(`Fertig. ${matchingTracks.length} Songs wurden hinzugefügt: ${playlist.name}`, "success");
    window.open(playlist.external_urls.spotify, "_blank", "noopener");
  } catch (error) {
    setResult(error.message, "error");
  } finally {
    loadPlaylistsButton.disabled = false;
  }
}

function updateConnectionStatus() {
  const connected = Boolean(accessToken);
  connectionStatus.textContent = connected ? "Spotify verbunden" : "Nicht verbunden";
  connectionStatus.classList.toggle("connected", connected);
  loginButton.textContent = connected ? "Spotify verbunden" : "Mit Spotify verbinden";
}

addPlaylistButton.addEventListener("click", () => {
  const row = document.createElement("div");
  row.className = "playlist-row";
  row.innerHTML = '<input class="playlist-input" type="url" placeholder="https://open.spotify.com/playlist/..." aria-label="Spotify Playlist-Link"><button class="remove-button" type="button">Entfernen</button>';
  row.querySelector(".remove-button").addEventListener("click", () => row.remove());
  playlistList.append(row);
});

loadPlaylistsButton.addEventListener("click", () => {
  if (genreSelect.value && tracks.length) {
    createGenrePlaylist();
  } else {
    analysePlaylists();
  }
});

genreSelect.addEventListener("change", () => {
  loadPlaylistsButton.textContent = genreSelect.value ? "Playlist erstellen" : "Genre auswählen";
});

loginButton.addEventListener("click", startLogin);

(async function initialise() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  try {
    if (code) {
      await exchangeCodeForToken(code);
    }
    updateConnectionStatus();
  } catch (error) {
    setResult(error.message, "error");
    updateConnectionStatus();
  }
})();
