const http = require("http");
const fs = require("fs");
const path = require("path");
const https = require("https");

const root = __dirname;
const port = Number(process.env.PORT || 5510);
const environmentPath = path.join(root, ".env");
const environment = fs.existsSync(environmentPath)
  ? Object.fromEntries(fs.readFileSync(environmentPath, "utf8").split(/\r?\n/).filter(Boolean).map((line) => line.split(/=(.*)/s, 2)))
  : {};
const lastFmApiKey = process.env.LASTFM_API_KEY || environment.LASTFM_API_KEY;
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function sendJson(response, status, data) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(data));
}

function fetchLastFmTags(artist) {
  return new Promise((resolve, reject) => {
    const query = new URLSearchParams({
      method: "artist.gettoptags",
      artist,
      api_key: lastFmApiKey,
      format: "json",
      autocorrect: "1"
    });
    https.get(`https://ws.audioscrobbler.com/2.0/?${query}`, (lastFmResponse) => {
      let body = "";
      lastFmResponse.setEncoding("utf8");
      lastFmResponse.on("data", (chunk) => { body += chunk; });
      lastFmResponse.on("end", () => {
        if (lastFmResponse.statusCode !== 200) {
          reject(new Error(`Last.fm antwortete mit ${lastFmResponse.statusCode}.`));
          return;
        }
        try {
          const data = JSON.parse(body);
          const tags = data.toptags?.tag?.map((tag) => tag.name).filter(Boolean) || [];
          resolve(tags);
        } catch {
          reject(new Error("Last.fm lieferte keine gültigen Genre-Daten."));
        }
      });
    }).on("error", reject);
  });
}

const server = http.createServer((request, response) => {
  const requestPath = request.url.split("?")[0];

  if (requestPath === "/api/artist-tags" && request.method === "POST") {
    if (!lastFmApiKey) {
      sendJson(response, 500, { error: "LASTFM_API_KEY fehlt in .env." });
      return;
    }

    let body = "";
    request.on("data", (chunk) => { body += chunk; });
    request.on("end", async () => {
      try {
        const artists = JSON.parse(body).artists;
        if (!Array.isArray(artists) || artists.length > 100) {
          sendJson(response, 400, { error: "Ungültige Künstlerliste." });
          return;
        }
        const tags = {};
        for (const artist of artists) {
          if (typeof artist === "string" && artist.trim()) {
            tags[artist] = await fetchLastFmTags(artist.trim());
          }
        }
        sendJson(response, 200, { tags });
      } catch (error) {
        sendJson(response, 502, { error: error.message });
      }
    });
    return;
  }

  const relativePath = requestPath === "/callback" || requestPath === "/" ? "index.html" : requestPath.slice(1);
  const filePath = path.join(root, relativePath);

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    const extension = path.extname(filePath);
    response.writeHead(200, { "Content-Type": mimeTypes[extension] || "application/octet-stream" });
    response.end(content);
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Genre Mixer läuft auf http://127.0.0.1:${port}`);
});
