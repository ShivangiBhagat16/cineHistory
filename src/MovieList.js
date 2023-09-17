import Movie from './Movie';

export default function MovieList({ movies, OnSelectMovie }) {
  return <ul className="list list-movies">
    {movies?.map((movie) => (
      <Movie movie={movie} key={movie.imdbID} OnSelectMovie={OnSelectMovie} />
    ))}
  </ul>;
}
