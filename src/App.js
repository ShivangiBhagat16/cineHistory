import { useEffect, useState } from "react";

import Navbar from './Navbar';
import Search from './Search';
import NavResults from './NavResults';
import Main from "./Main";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import Box from "./Box";
import Moviedetail from "./Moviedetail";
import WatchedSummary from "./WatchedSummary";
import WatchedMovieList from "./WatchedMovieList";
import MovieList from "./MovieList";


export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const KEY = "b85a94a7";

export default function App() { 
  const [query, setQuery] = useState("harry potter");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectMovie(id) {
    setSelectedId((selectedId1) => id === selectedId1 ? null : id);
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function handleDeleteWatched(id) {
    setWatched(watched => watched.filter(movie => movie.imdbID !== id));
  }

  useEffect(
    function() {
      const controller = new AbortController();

      async function fetchMovies() {
        setIsLoading(true); // set loading true until we fetch the complete API
        setError(''); // set error to empty before every search
        try {
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            {signal: controller.signal}
          );
          if(!res.ok) { 
            throw new Error("Something went wrong with fetching movies");
          }
          const data = await res.json();
          if(data.Response === 'False') {
            throw new Error("Movie not found");
          }
          setMovies(data.Search); 
          setError('');
        } catch(err) {
          if(err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false); 
        }
      }

      if(query.length <3) {
        setMovies([]);
        setError('');
        return;
      }
      handleCloseMovie();
      fetchMovies(); // separate async fun than useEffect fun

      return function() {
        controller.abort();
      }
    }, [query]
  )

  return (
    <>
      <Navbar>
          <Search query={query} setQuery={setQuery} />
          <NavResults movies={movies} />
      </Navbar>
      <Main>
            <Box>
              {isLoading && <Loader />}
              {!isLoading && !error && <MovieList movies={movies} OnSelectMovie={handleSelectMovie} />}
              {error && <ErrorMessage errorMessage={error} />}
            </Box>
            <Box>
              {
                selectedId ? 
                <Moviedetail 
                  selectedId={selectedId} 
                  onCloseMovie={handleCloseMovie} 
                  onAddWatched={handleAddWatched}
                  watched={watched} /> :
                <>
                  <WatchedSummary watched={watched} />
                  <WatchedMovieList 
                    watched={watched}
                    onDeleteWatched={handleDeleteWatched} />
                </>
              }
            </Box>
      </Main>
    </>
  );
}


