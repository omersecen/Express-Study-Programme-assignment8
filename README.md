# Study Programme Server

Web Programming, Assignment 8. A small Node.js and Express server for a fictional web development programme.

## Running the project

Use Node.js 26 LTS.

```sh
npm ci
npm start
```

The default address is http://localhost:3000. Use `npm run dev` to restart the server when a file changes.

To choose a different port:

```sh
PORT=4000 npm start
```

## Routes

| Method | Path | Response |
| --- | --- | --- |
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

The middleware is placed before the routes, so successful requests, failed requests and redirects all count. Visiting `/api/stats` also adds one, and following a redirect causes another request. The counter is only kept in memory and resets when the server restarts, including a restart from `node --watch`.

## Route order

The 404 fallback is an `app.use` handler after all the real routes. It catches any remaining request, including a request with the wrong HTTP method. There is no `app.get('*')` wildcard because that old syntax does not work in Express 5.
