import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import "./TMDBSearch.css"; // (Optional) You can create or skip if you want to put CSS in index.css

const TMDB_API_KEY = "ab8c63a0e91a360486dc3c65a51d26fb";

function TMDBSearch({ onMovieAdded }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchMovies = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Error fetching TMDB:", error);
    }
    setLoading(false);
  };

  const handleAddMovie = async (movie) => {
    const newMovie = {
      title: movie.title,
      genre: "TMDB",
      poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      rating: movie.vote_average || 3,
      watched: false,
      favorite: false,
    };
    try {
      await addDoc(collection(db, "movies"), newMovie);
      if (onMovieAdded) onMovieAdded();
      alert("Movie added successfully!");
    } catch (error) {
      console.error("Error adding movie to Firestore:", error);
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Search Online (TMDB)</h2>
      <div style={{ display: "flex", marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Search TMDB movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "12px",
            border: "none",
            outline: "none",
            background: "#222",
            color: "#fff",
            fontWeight: "800",
          }}
        />
        <button
          onClick={searchMovies}
          style={{
            marginLeft: "10px",
            backgroundColor: "#ffcc00",
            border: "none",
            borderRadius: "12px",
            padding: "10px 20px",
            fontWeight: "800",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {loading && <div className="loader"></div>}

      <div className="movie-list">
        {results.map((movie) => (
          <div key={movie.id} className="movie-card">
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
            ) : (
              <div style={{ height: "300px", background: "#333", borderRadius: "12px" }}>No Image</div>
            )}
            <h3>{movie.title}</h3>
            <p>⭐ {movie.vote_average}</p>
            <button
              className="small-button"
              onClick={() => handleAddMovie(movie)}
            >
              Add to Library
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TMDBSearch;
