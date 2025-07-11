import { useState, useEffect } from "react";
import MovieList from "./components/MovieList";
import "./index.css";

import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

function App() {
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [poster, setPoster] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("All");
  const [tmdbQuery, setTmdbQuery] = useState("");
  const [tmdbResults, setTmdbResults] = useState([]);

  const TMDB_API_KEY = "ab8c63a0e91a360486dc3c65a51d26fb";

  useEffect(() => {
    const fetchMovies = async () => {
      const querySnapshot = await getDocs(collection(db, "movies"));
      const moviesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMovies(moviesData.reverse());
    };
    fetchMovies();
  }, []);

  const handleAddMovie = async () => {
    if (!title.trim() || !genre.trim()) {
      alert("Please provide both title and genre");
      return;
    }
    const newMovie = {
      title,
      genre,
      poster,
      rating: 3,
      watched: false,
      favorite: false,
    };
    try {
      const docRef = await addDoc(collection(db, "movies"), newMovie);
      setMovies([{ ...newMovie, id: docRef.id }, ...movies]);
      setTitle("");
      setGenre("");
      setPoster("");
    } catch (error) {
      console.error("Error adding movie: ", error);
    }
  };

  const handleDeleteMovie = async (id) => {
    try {
      await deleteDoc(doc(db, "movies", id));
      setMovies(movies.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Error deleting movie: ", error);
    }
  };

  const handleEditMovie = async (id, updatedMovie) => {
    try {
      await updateDoc(doc(db, "movies", id), updatedMovie);
      setMovies(movies.map((m) => (m.id === id ? { ...m, ...updatedMovie } : m)));
    } catch (error) {
      console.error("Error updating movie: ", error);
    }
  };

  const handleTmdbSearch = async () => {
    if (!tmdbQuery.trim()) return;
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(tmdbQuery)}`
      );
      const data = await res.json();
      setTmdbResults(data.results || []);
    } catch (error) {
      console.error("Error fetching from TMDB: ", error);
    }
  };

  const handleAddFromTmdb = async (movie) => {
    const newMovie = {
      title: movie.title,
      genre: "TMDB",
      poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      rating: 3,
      watched: false,
      favorite: false,
    };
    try {
      const docRef = await addDoc(collection(db, "movies"), newMovie);
      setMovies([{ ...newMovie, id: docRef.id }, ...movies]);
    } catch (error) {
      console.error("Error adding TMDB movie: ", error);
    }
  };

  const downloadMovies = () => {
    const fileData = JSON.stringify(movies, null, 2);
    const blob = new Blob([fileData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "akagod-movie-library.json";
    link.click();

    URL.revokeObjectURL(url);
  };

  const filteredMovies = movies.filter((movie) => {
    const matchesTitle = movie.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = filterGenre === "All" || movie.genre === filterGenre;
    return matchesTitle && matchesGenre;
  });

  const total = movies.length;
  const watched = movies.filter((m) => m.watched).length;
  const favorites = movies.filter((m) => m.favorite).length;

  return (
    <div className="app">
      <h1>
        <span className="logo-emoji">🎬</span> Akagod's Movie Library
      </h1>

      <div className="add-movie-form">
        <input
          type="text"
          placeholder="Movie title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Poster URL"
          value={poster}
          onChange={(e) => setPoster(e.target.value)}
        />
        <div className="center-button-container">
          <button
            className="small-button btn-very-red"
            onClick={handleAddMovie}
          >
            Add Movie
          </button>
        </div>
      </div>

      <input
        className="search-input"
        type="text"
        placeholder="Search in your library..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select
        className="genre-select"
        value={filterGenre}
        onChange={(e) => setFilterGenre(e.target.value)}
      >
        <option value="All">All Genres</option>
        {Array.from(new Set(movies.map((m) => m.genre))).map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>

      <div className="tmdb-search">
        <input
          type="text"
          placeholder="Search TMDB movies..."
          value={tmdbQuery}
          onChange={(e) => setTmdbQuery(e.target.value)}
        />
        <div className="center-button-container">
          <button
            className="small-button btn-yellow"
            onClick={handleTmdbSearch}
          >
            Search TMDB
          </button>
        </div>
      </div>

      <div className="stats">
        <p>Total: <strong>{total}</strong></p>
        <p>Watched: <strong>{watched}</strong></p>
        <p>Favorites: <strong>{favorites}</strong></p>
      </div>

      <div className="download-container left-align-button">
        <button className="small-button btn-yellow" onClick={downloadMovies}>
          Download Movies
        </button>
      </div>

      {filteredMovies.length > 0 ? (
        <MovieList
          movies={filteredMovies}
          onDelete={handleDeleteMovie}
          onEdit={handleEditMovie}
        />
      ) : (
        <p style={{ textAlign: "center", fontWeight: "bold" }}>
          No movies found. Try adding or searching again!
        </p>
      )}

      {tmdbResults.length > 0 && (
        <div className="tmdb-results">
          <h2>TMDB Search Results</h2>
          <div className="tmdb-list">
            {tmdbResults.map((movie) => (
              <div key={movie.id} className="tmdb-item">
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                />
                <p>{movie.title}</p>
                <button
                  className="small-button btn-yellow"
                  onClick={() => handleAddFromTmdb(movie)}
                >
                  Add to Library
                </button>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + " trailer")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="trailer-button"
                >
                  Watch Trailer
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
