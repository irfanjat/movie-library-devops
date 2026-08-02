const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'movies.json');

const MOVIES = [
  { id: 1, title: 'The Shawshank Redemption', year: 1994, genre: 'Drama & Thriller', rating: 9.3, poster: '🎬' },
  { id: 2, title: 'The Godfather', year: 1972, genre: 'Crime', rating: 9.2, poster: '🎭' },
  { id: 3, title: 'The Dark Knight', year: 2008, genre: 'Action', rating: 9.0, poster: '🦇' },
  { id: 4, title: 'Pulp Fiction', year: 1994, genre: 'Crime', rating: 8.9, poster: '💃' },
  { id: 5, title: "Schindler's List", year: 1993, genre: 'Drama', rating: 9.0, poster: '📖' },
  { id: 6, title: 'Interstellar', year: 2014, genre: 'Sci-Fi', rating: 8.7, poster: '🚀' },
  { id: 7, title: 'Fight Club', year: 1999, genre: 'Drama', rating: 8.8, poster: '🥊' },
  { id: 8, title: 'Inception', year: 2010, genre: 'Sci-Fi', rating: 8.8, poster: '🌀' },
  { id: 9, title: 'The Matrix', year: 1999, genre: 'Sci-Fi', rating: 8.7, poster: '💊' },
  { id: 10, title: 'Goodfellas', year: 1990, genre: 'Crime', rating: 8.7, poster: '🔫' },
  { id: 11, title: 'Parasite', year: 2019, genre: 'Thriller', rating: 8.5, poster: '🏠' },
  { id: 12, title: 'Spirited Away', year: 2001, genre: 'Animation', rating: 8.6, poster: '👻' },
  { id: 13, title: 'Gladiator', year: 2000, genre: 'Action', rating: 8.5, poster: '⚔️' },
  { id: 14, title: 'The Prestige', year: 2006, genre: 'Mystery', rating: 8.5, poster: '🎩' },
  { id: 15, title: 'Whiplash', year: 2014, genre: 'Drama', rating: 8.5, poster: '🥁' },
];

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]');
}

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

function loadWatchlist() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function saveWatchlist(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/', (req, res) => {
  const { genre, q } = req.query;
  let filtered = MOVIES;
  if (genre) filtered = filtered.filter(m => m.genre === genre);
  if (q) filtered = filtered.filter(m => m.title.toLowerCase().includes(q.toLowerCase()));
  const genres = [...new Set(MOVIES.map(m => m.genre))];
  res.render('index', { movies: filtered, genres, selectedGenre: genre || '', query: q || '' });
});

app.get('/movie/:id', (req, res) => {
  const movie = MOVIES.find(m => m.id === Number(req.params.id));
  const watchlist = loadWatchlist();
  const inWatchlist = watchlist.some(w => w.id === movie.id);
  if (!movie) return res.redirect('/');
  res.render('movie', { movie, inWatchlist });
});

app.post('/watchlist/add/:id', (req, res) => {
  const movie = MOVIES.find(m => m.id === Number(req.params.id));
  if (!movie) return res.redirect('/');
  const watchlist = loadWatchlist();
  if (!watchlist.find(w => w.id === movie.id)) {
    watchlist.push({ id: movie.id, title: movie.title, poster: movie.poster, watched: false });
    saveWatchlist(watchlist);
  }
  res.redirect('/watchlist');
});

app.post('/watchlist/toggle/:id', (req, res) => {
  const watchlist = loadWatchlist();
  const entry = watchlist.find(w => w.id === Number(req.params.id));
  if (entry) entry.watched = !entry.watched;
  saveWatchlist(watchlist);
  res.redirect('/watchlist');
});

app.post('/watchlist/remove/:id', (req, res) => {
  let watchlist = loadWatchlist();
  watchlist = watchlist.filter(w => w.id !== Number(req.params.id));
  saveWatchlist(watchlist);
  res.redirect('/watchlist');
});

app.get('/watchlist', (req, res) => {
  const watchlist = loadWatchlist();
  res.render('watchlist', { watchlist });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/metrics', (req, res) => {
  const watchlist = loadWatchlist();
  const total = watchlist.length;
  const watched = watchlist.filter(w => w.watched).length;
  const unwatched = total - watched;
  res.type('text/plain').send(
    `# Movie Library Metrics\n` +
    `watchlist_total ${total}\n` +
    `watchlist_watched ${watched}\n` +
    `watchlist_unwatched ${unwatched}\n` +
    `uptime_seconds ${Math.floor((Date.now() - startTime) / 1000)}\n`
  );
});

const startTime = Date.now();

app.listen(PORT, () => {
  console.log(`🎬 Movie Library running at http://localhost:${PORT}`);
});
