import express from 'express';
import { fileURLToPath } from 'node:url';

const app = express();
const port = process.env.PORT || 3000;
const publicFolder = fileURLToPath(new URL('./public', import.meta.url));

const courses = [
  { id: 1, title: 'Web Programming', credits: 5 },
  { id: 2, title: 'Database Basics', credits: 4 },
  { id: 3, title: 'Computer Networks', credits: 4 }
];

let requestsServed = 0;

function requestLogger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
}

function requestCounter(req, res, next) {
  requestsServed += 1;
  next();
}

app.use(requestLogger);
app.use(requestCounter);
app.use(express.static(publicFolder));

app.get('/hello', (req, res) => {
  res.type('text/plain').send("Hello from Omer's server");
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send('User-agent: *\nDisallow: /api/admin\n');
});

app.get('/old-page', (req, res) => {
  res.redirect('/hello');
});

app.get('/api/courses', (req, res) => {
  res.json(courses);
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    nodeVersion: process.version,
    uptimeSeconds: Math.floor(process.uptime())
  });
});

app.get('/api/headers', (req, res) => {
  res.json({
    userAgent: req.get('User-Agent') || '',
    accept: req.get('Accept') || ''
  });
});

app.post('/api/subscribe', (req, res) => {
  res.status(201).json({ subscribed: true });
});

app.get('/api/admin', (req, res) => {
  res.status(403).json({ error: 'Forbidden' });
});

app.get('/api/stats', (req, res) => {
  res.json({ requestsServed });
});

app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ error: 'Not found' });
  } else {
    res.status(404).type('text/plain').send('Page not found.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
