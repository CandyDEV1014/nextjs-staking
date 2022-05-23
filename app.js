// const http = require("http");

// const hostname = "localhost";
// const port = 8000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader("Content-Type", "text/plain");
//   res.end("MeshMob!\n");
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
// const dev = process.env.NODE_ENV !== "production";
const dev = false;

const port = 8000;

// Create the Express-Next App
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;
      handle(req, res, parsedUrl);
    }).listen(port, (err) => {
      if (err) throw err;
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
