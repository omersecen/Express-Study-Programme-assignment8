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

The subscribe route is just a practice response. It does not save a subscription or read the request body.
