import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/hello', (req, res) => {
  res.type('text/plain').send("Hello from Omer's server");
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send('User-agent: *\nDisallow: /api/admin\n');
});

app.get('/old-page', (req, res) => {
  res.redirect('/hello');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
