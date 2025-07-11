import React from "react";

function MovieList({ movies, onDelete, onEdit }) {
  const handleToggleWatched = (movie) => {
    onEdit(movie.id, { watched: !movie.watched });
  };

  const handleToggleFavorite = (movie) => {
    onEdit(movie.id, { favorite: !movie.favorite });
  };

  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <div key={movie.id} className="movie-card">
          <img
            src={movie.poster || "https://via.placeholder.com/300x450?text=No+Image"}
            alt={movie.title}
          />
          <h3>{movie.title}</h3>
          <p>Genre: {movie.genre}</p>
          <div className="button-group">
            <button
              className="main-btn small-button"
              onClick={() => handleToggleWatched(movie)}
            >
              {movie.watched ? "Unwatch" : "Watched"}
            </button>
            <button
              className="main-btn small-button"
              onClick={() => handleToggleFavorite(movie)}
            >
              {movie.favorite ? "Unfav" : "Fav"}
            </button>
            <button
              className="main-btn btn-red small-button"
              onClick={() => onDelete(movie.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MovieList;
