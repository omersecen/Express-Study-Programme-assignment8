# Study Programme Server

Web Programming, Assignment 8. A small Node.js and Express server for a fictional web development programme.

## Running the project

Use [Node.js 26 LTS](https://nodejs.org/en/download/).

```sh
git clone https://github.com/omersecen/Express-Study-Programme-assignment8.git
cd Express-Study-Programme-assignment8
npm ci
npm start
```

The default address is http://localhost:3000. Open it in your browser to use the API buttons. Use `npm run dev` to restart the server when a file changes.

To choose a different port:

```sh
PORT=4000 npm start
```

## Routes

| Method | Path | Response |
| --- | --- | --- |
| GET | `/` | The programme page from `public/index.html` |
| GET | `/hello` | A plain-text greeting |
| GET | `/robots.txt` | Plain-text crawler instructions |
| GET | `/old-page` | 302 redirect to `/hello` |
| GET | `/api/courses` | A JSON list of three courses |
| GET | `/api/status` | Status, Node version and process uptime |
| GET | `/api/headers` | The request's User-Agent and Accept values |
| POST | `/api/subscribe` | 201 and `{"subscribed":true}` |
| GET | `/api/admin` | 403 and `{"error":"Forbidden"}` |
| GET | `/api/stats` | The number of requests received since startup |
| Any | An unknown path starting with `/api` | 404 and `{"error":"Not found"}` |
| Any | Any other unknown path | 404 and a short text message |

The subscribe route is just a practice response. It does not save a subscription or read the request body.

## Middleware and counting

The logger prints the time, HTTP method and URL before the route runs. The counter runs next, so it has already counted the current request when `/api/stats` reads its value. Both functions call `next()` to let Express continue to the next handler.

The middleware is placed before `express.static` and the routes, so page requests, CSS, JavaScript, successful API requests, failed requests and redirects all count. Visiting `/api/stats` also adds one, and following a redirect causes another request. The counter is only kept in memory and resets when the server restarts, including a restart from `node --watch`.

## Route order

The 404 fallback is an `app.use` handler after all the real routes. It catches any remaining request, including a request with the wrong HTTP method. There is no `app.get('*')` wildcard because that old syntax does not work in Express 5.

## Browser page

The page calls the API with relative URLs using `fetch()`. The subscribe button uses POST, and the response area shows the HTTP status and formatted JSON, including the expected 403 and 404 errors. Buttons are disabled while a request is pending; a network failure shows a message and enables them again.

## curl evidence

These outputs were captured from the running server with `curl --include`. Each block includes the status line, headers and body.

### Course list

```sh
curl --include http://localhost:3000/api/courses
```

```text
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 144
ETag: W/"90-JLGlISx3ZQP0/aeRA384gjHqpgo"
Date: Mon, 16 Nov 2026 19:01:13 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[{"id":1,"title":"Web Programming","credits":5},{"id":2,"title":"Database Basics","credits":4},{"id":3,"title":"Computer Networks","credits":4}]
```

### Subscribe

```sh
curl --include --request POST http://localhost:3000/api/subscribe
```

```text
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 19
ETag: W/"13-oWAPIqDXuocNexKhPYW9ayyk98c"
Date: Mon, 16 Nov 2026 19:01:13 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"subscribed":true}
```

### Admin

```sh
curl --include http://localhost:3000/api/admin
```

```text
HTTP/1.1 403 Forbidden
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 21
ETag: W/"15-TLNzmZqKxaTuFdX/dVWWPBu44/c"
Date: Mon, 16 Nov 2026 19:01:13 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Forbidden"}
```

### Redirect

```sh
curl --include http://localhost:3000/old-page
```

```text
HTTP/1.1 302 Found
X-Powered-By: Express
Location: /hello
Vary: Accept
Content-Type: text/plain; charset=utf-8
Content-Length: 28
Date: Mon, 16 Nov 2026 19:01:13 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Found. Redirecting to /hello
```

### Missing API route

```sh
curl --include http://localhost:3000/api/missing
```

```text
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 21
ETag: W/"15-bm7tJgu8FHlq5QU+Y6gDxOGPfRc"
Date: Mon, 16 Nov 2026 19:01:13 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Not found"}
```

### Missing page

```sh
curl --include http://localhost:3000/missing-page
```

```text
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: text/plain; charset=utf-8
Content-Length: 15
ETag: W/"f-vPe81ES0SvanXIRqCOkvvFF53IE"
Date: Mon, 16 Nov 2026 19:01:13 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Page not found.
```

## Reasoning questions

### 1. Route order experiment

In a temporary copy of `server.js`, the 404 fallback was moved above the middleware and routes. `/`, `/hello` and `/api/courses` all returned 404 even though they exist. Express checks handlers in their registered order, so the fallback sent a response before the real handlers could run.

### 2. Logger experiment

Removing `next()` from the logger in a temporary copy left the already-open browser page showing `Status: waiting...` and `Loading...`. The server still printed the timestamp and `GET /api/status`. A separate `curl --include --max-time 3` request timed out with exit code 28 and no HTTP response. The logger did not send a response or pass control to the route, so the request stayed pending.

### 3. Status codes

201 means a resource was created, so it describes a new subscription more precisely than a general 200 success. This assignment only simulates that creation and saves nothing. A missing page needs 404 so clients can recognise the failure from the status instead of treating an error message as a successful 200 response (see MDN on [201](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/201) and [404](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/404)).

### 4. Port configuration

A hosting service might assign a port instead of allowing the app to choose 3000. Reading `process.env.PORT` lets the same code use that port without editing the file. The fallback keeps it easy to run locally when no port is supplied.

### 5. Dependencies

`node_modules` is a large generated folder, and the package files already describe how to install it again. After cloning, a teammate needs Node.js 26 LTS, then runs `npm ci` in the repository folder to install the locked dependencies and `npm start` to run the server. Committing `package-lock.json` keeps those dependency versions consistent.

### 6. Same origin

Opening `index.html` from disk gives it a `file:` origin, so a relative URL such as `/api/courses` points to a file URL rather than this Express server. Using an HTTP server URL from that file would be a cross-origin request, and reading its response is restricted by the browser's [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy) unless cross-origin access is allowed. Serving both the page and API from the same protocol, host and port avoids this problem.

## File organization

```text
assignment8/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

`server.js` contains the hard-coded courses, middleware and routes. The `public` folder contains the page, its CSS and its browser JavaScript. Express is the only direct dependency.

## Self-study notes

- **Process information:** The [Node.js process documentation](https://nodejs.org/api/process.html) explains that `process.version` contains the Node version and `process.uptime()` gives the process's running time in seconds. The status route uses both and rounds uptime down with `Math.floor()` for whole seconds.
- **Plain-text responses:** The [Express response documentation](https://expressjs.com/en/5x/api/response/#res.type) shows how `res.type()` sets the content type. The greeting and robots routes use `res.type('text/plain')` before `res.send()` so the browser receives plain text.
- **Readable JSON:** The [JSON.stringify documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) describes its indentation argument. `JSON.stringify(data, null, 2)` formats the response with two spaces, and assigning that string to a `<pre>` element's `textContent` displays it as text.
- **Static file paths:** The [Express static-files guide](https://expressjs.com/en/starter/static-files/) explains that a relative static folder depends on the working directory. The server builds its folder URL relative to `import.meta.url`, then uses [Node's fileURLToPath](https://nodejs.org/api/url.html#urlfileurltopathurl-options) to turn it into an absolute file path for `express.static`. This also handles spaces in folder names correctly.

## Challenges

The main tricky part was separating the folder containing `server.js` from the folder the terminal starts in. Another detail was counting static-file requests as well as API calls, which is why both middleware functions are above `express.static`. The experiments also showed how one misplaced handler or missing `next()` can stop otherwise correct routes from working.

## Other checks

- All seven API buttons were tried in the browser, including the expected 403 and 404 responses.
- Stopping a test server showed the network-error message and enabled the buttons again.
- At a 375px viewport width, the page had no horizontal overflow.
- A separate server on port 3103 was started from another folder; its page, CSS, JavaScript and API still worked.
- A fresh `npm ci` installation was tested with Node.js v26.13.1 in a folder containing spaces.
- An isolated counter test confirmed that the first `/api/stats` request returns 1 and that static files and missing routes are counted.
