import { useState, useEffect } from 'react'
import Search from './components/Search'
import heroLogo from '/hero.png'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'
import RatingFilter from './components/RatingFilter'
import GenreFilter from './components/GenreFilter'
import ChatBot from './components/ChatBot'
import { useDebounce } from 'react-use'
import { updateSearchCount } from './appwrite'
import { FaComments } from 'react-icons/fa';

const API_ENDPOINT = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [errorMessage, setErrorMesssage] = useState('')
  const [movieList, setMovieList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [deboucedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [ratingFilter, setRatingFilter] = useState(0)
  const [genreFilter, setGenreFilter] = useState(0)
  const [showChatBot, setShowChatBot] = useState(false)

  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm)
  }, 500, [searchTerm])

  const FetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMesssage('');
  

    const cachedMovies = localStorage.getItem(`movies-${query}`);
    if (cachedMovies) {
      setMovieList(JSON.parse(cachedMovies));
      setIsLoading(false);
      return;
    }
  
    try {
      const endpoint = query
        ? `${API_ENDPOINT}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_ENDPOINT}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
  
      const data = await response.json();
      setMovieList(data.results || []);
  
      localStorage.setItem(`movies-${query}`, JSON.stringify(data.results));
  
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMesssage('Could not load movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    FetchMovies(deboucedSearchTerm)
  }, [deboucedSearchTerm])


  const filteredMovies = movieList.filter(movie => {
    const meetsRating = movie.vote_average >= ratingFilter;
    const meetsGenre = genreFilter === 0 || movie.genre_ids.includes(genreFilter);
    return meetsRating && meetsGenre;
  });

  return (
    <main>
      <div className='pattern' />
      <div className='wrapper'>
        <header>
          <img src={heroLogo} alt="Hero Banner" />
          <h1>
            Find <span className='text-gradient'>Movies</span> You'll enjoy Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        <section className='all-movies'>
          <div className="flex items-center justify-between mt-[40px]">
            <h2 className="text-white text-2xl font-bold">All Movies</h2>
            <div className="flex items-center space-x-4">
              <RatingFilter ratingFilter={ratingFilter} setRatingFilter={setRatingFilter} />
              <GenreFilter genreFilter={genreFilter} setGenreFilter={setGenreFilter} />
            </div>
          </div>
          {isLoading ? (
            <div className="text-white"><Spinner /></div>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : filteredMovies.length === 0 ? (
            <p className="text-white mt-4">No movies found matching your criteria.</p>
          ) : (
            <ul>
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onOpenPopup={() => setSelectedMovie(movie)}
                />
              ))}
            </ul>
          )}
        </section>
      </div>
      <footer className="footer text-center mt-4">
        <p>Developed by Sandipta</p>
      </footer>

      {selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative bg-gray-800 text-white max-w-lg w-11/12 p-6 rounded-md shadow-2xl">
            <button
              onClick={() => setSelectedMovie(null)}
              className="absolute top-2 right-2 text-2xl font-bold hover:text-gray-300"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-2">{selectedMovie.title}</h2>
            <p className="text-base leading-relaxed">{selectedMovie.overview}</p>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowChatBot(prev => !prev)}
        className="fixed bottom-5 right-5 bg-yellow-500 text-black p-3 rounded-full shadow-lg hover:bg-yellow-600"
      >
        <FaComments className="w-6 h-6" />
      </button>
      {showChatBot && (
        <ChatBot movies={movieList} onClose={() => setShowChatBot(false)} />
      )}
    </main>
  )
}

export default App
