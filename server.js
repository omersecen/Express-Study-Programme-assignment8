import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

const courses = [
  { id: 1, title: 'Web Programming', credits: 5 },
  { id: 2, title: 'Database Basics', credits: 4 },
  { id: 3, title: 'Computer Networks', credits: 4 }
];

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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
