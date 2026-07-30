# 🎬 Movie Library — DevOps Portfolio Project

A containerized Node.js (Express + EJS) web application for browsing movies and managing a personal watchlist, built to demonstrate DevOps practices.

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **App** | Node.js, Express, EJS |
| **Containerization** | Docker |
| **Orchestration** | Docker Compose (ready) |
| **Monitoring** | Prometheus / Grafana (integratable) |
| **CI/CD** | GitHub Actions (ready) |

## 📦 Project Structure

```
├── app.js                  # Express server
├── views/
│   ├── index.ejs           # Movie catalog with filters
│   ├── movie.ejs           # Movie detail page
│   └── watchlist.ejs       # Personal watchlist
├── Dockerfile
├── docker-compose.yml
├── .github/workflows/
│   └── ci-cd.yml
├── package.json
└── movies.json             # Watchlist data storage
```

## 🚀 Quick Start

### Run locally

```bash
npm install
npm start
```

Visit `http://localhost:3001`

### Run with Docker

```bash
docker build -t movie-library .
docker run -d -p 3001:3001 --name movie-library movie-library
```

### Run with Docker Compose

```bash
docker-compose up -d
```

## 🎯 Features

- Browse 15 curated movies with ratings
- Filter by genre and search by title
- View detailed movie info
- Add/remove movies to personal watchlist
- Track watched vs to-watch status
- Persistent JSON storage

## 🔁 CI/CD Pipeline (GitHub Actions)

- Lints code on every push
- Builds Docker image and runs health check
- Pushes image to Docker Hub on `main` branch

## 🧪 Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Movie catalog with filters |
| `/movie/:id` | GET | Movie detail page |
| `/watchlist/add/:id` | POST | Add movie to watchlist |
| `/watchlist/toggle/:id` | POST | Toggle watched status |
| `/watchlist/remove/:id` | POST | Remove from watchlist |
| `/watchlist` | GET | View personal watchlist |
| `/health` | GET | Health check |
| `/metrics` | GET | Prometheus metrics |
