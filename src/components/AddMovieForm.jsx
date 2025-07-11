import { useState } from "react";

function MovieList({ movies, onDelete, onEdit }) {
  const [editingId, setEditingId] = useState(null);
  const [editedMovie, setEditedMovie] = useState({});

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedMovie({
      ...editedMovie,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const startEdit = (movie) => {
    setEditingId(movie.id);
    setEditedMovie(movie);
  };

  const submitEdit = () => {
    onEdit(editingId, editedMovie);
    setEditingId(null);
  };

  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <div key={movie.id} className="movie-card">
          {editingId === movie.id ? (
            <div>
              <input
                name="title"
                value={editedMovie.title}
                onChange={handleEditChange}
              />
              <input
                name="genre"
                value={editedMovie.genre}
                onChange={handleEditChange}
              />
              <input
                name="poster"
                value={editedMovie.poster}
                onChange={handleEditChange}
              />
              <input
                type="number"
                name="rating"
                value={editedMovie.rating}
                min={1}
                max={5}
                onChange={handleEditChange}
              />
              <label>
                <input
                  type="checkbox"
                  name="watched"
                  checked={editedMovie.watched}
                  onChange={handleEditChange}
                />
                Watched
              </label>
              <label>
                <input
                  type="checkbox"
                  name="favorite"
                  checked={editedMovie.favorite}
                  onChange={handleEditChange}
                />
                Favorite
              </label>
              <button className="small-button" onClick={submitEdit}>Save</button>
            </div>
          ) : (
            <>
              {movie.poster && (
                <img
                  src={movie.poster}
                  alt={movie.title}
                  style={{ width: "100%", borderRadius: "5px" }}
                />
              )}
              <h3>{movie.title}</h3>
              <p>Genre: {movie.genre}</p>
              <p>Rating: {movie.rating} ⭐</p>
              <p>Status: {movie.watched ? "Watched" : "Not Watched"}</p>
              <p>{movie.favorite ? "❤️ Favorite" : ""}</p>
              <div className="button-group">
                <button className="small-button" onClick={() => onDelete(movie.id)}>Delete</button>
                <button className="small-button" onClick={() => startEdit(movie)}>Edit</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default MovieList;
