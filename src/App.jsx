import { useState, useEffect } from 'react'
import Search from './components/Search'
import heroLogo from '/hero.png'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { updateSearchCount } from './appwrite';

const API_ENDPOINT = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}


function App() {

  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMesssage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deboucedSearchTerm, setDebouncedSearchTerm] = useState('');

  useDebounce(() => {  
    setDebouncedSearchTerm(searchTerm);  
  } , 500, [searchTerm]);


  const FetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMesssage('');
    try {
      const endpoint = query ?
        `${API_ENDPOINT}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_ENDPOINT}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      setMovieList(data.results || []);
      if(query && data.results.length > 0) {
        // updateSearchCount(query, data.results[0]);
        await updateSearchCount(query, data.results[0]);
      }
      if (data.Response === 'False') {
        setErrorMesssage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    FetchMovies(deboucedSearchTerm);
  }, [deboucedSearchTerm]);


  return (
    <main>
      <div className='pattern' />
      <div className='wrapper'>
        <header>
          <img src={heroLogo} alt="Hero Banner" />
          <h1>Find <span className='text-gradient'>Movies</span>You'll enjoy Without the Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        <section className='all-movies'>
          <h2 className="mt-[40px]">All Movies</h2>
          {isLoading ? (
            <div className="text-white"><Spinner /></div>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App
