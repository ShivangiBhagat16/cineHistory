import { useEffect, useState } from "react";

import StarRating from './StarRating';
import Loader from "./Loader";
import { KEY } from "./App";
import ErrorMessage from "./ErrorMessage";

export default function Moviedetail({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState('');
  const [error, setError] = useState('');

  const isWatched = watched.map(movie => movie.imdbID).includes(selectedId);
  const watchedMovieRating = watched.find(movie => movie.imdbID === selectedId)?.userRating;

  useEffect(function () {
    async function getMovieDetails() {
      setIsLoading(true);
      setError('');
      try {
        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
        const data = await res.json();
        setMovie(data);
      } catch(err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    getMovieDetails();
  }, [selectedId]); 

  const {
    Title: title, 
    Year: year, 
    Poster: poster, 
    Runtime: runtime, 
    imdbRating, 
    Plot: plot, 
    Released: released, 
    Actors: actors, 
    Director: director, 
    Genre: genre,
  } = movie;

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function() {
        document.title = "cineHistory";
      }
    },
    [title]
  );

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      runtime: Number(runtime.split(" ")[0]),
      imdbRating: Number(imdbRating),
      userRating,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useEffect(
    function(){
      function callback(e) {
        if(e.code === "Escape") {
          onCloseMovie();
        }
      }
      document.addEventListener("keydown", callback);

      return function() {
        document.removeEventListener("keydown", callback);
      }
    },
    []
  )

  return <div className="details">
    {isLoading && <Loader />}
    {error && <ErrorMessage errorMessage={error} />}
    {!isLoading && !error && 
      <>
        <header>
          <button className="btn-back" onClick={onCloseMovie}>&larr;</button>
          <img src={poster} alt={`Poster of ${movie}`} />
          <div className="details-overview">
            <h2>{title}</h2>
            <p>{released} &bull; {runtime}</p>
            <p>{genre}</p>
            <p><span>⭐️</span>{imdbRating} IMDB rating</p>
          </div>
        </header>

        <section>
          <div className="rating">
            { !isWatched ?
              <>
                <StarRating maxRating={10} size={25} onSetRating={setUserRating} />
                {userRating > 0 && 
                    <button className="btn-add" onClick={handleAdd}>+ Add to List</button>
                }
              </> : <p>You rated with movie {watchedMovieRating} <span>⭐️</span></p>
            }
          
          </div>
          <p><em>{plot}</em></p>
          <p>Starring {actors}</p>
          <p>Directed by {director}</p>
        </section>
      </>
    }
  </div>;
}