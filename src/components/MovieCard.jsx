import React from 'react';

const MovieCard = ({ movie, onOpenPopup }) => {
  const { title, vote_average, poster_path, original_language, release_date } = movie;

  return (
    <div className="movie-card relative group transition-transform hover:scale-105">
      <img
        src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie.png'}
        alt={title}
        className="rounded-lg w-full transition duration-300 ease-in-out group-hover:brightness-75"
      />

      <div className="mt-4">
        <h3 className="text-white font-bold text-base line-clamp-1">{title}</h3>
        <div className="content mt-2 flex flex-row items-center flex-wrap gap-2">
          <div className="rating flex flex-row items-center gap-1">
            <img src="star.svg" alt="Star Icon" className="w-4 h-4 object-contain" />
            <p className="font-bold text-base text-white">
              {vote_average ? vote_average.toFixed(1) : 'NA'}
            </p>
          </div>
          <span className="text-sm text-gray-100">•</span>
          <p className="lang capitalize text-gray-100 font-medium text-base">{original_language}</p>
          <span className="text-sm text-gray-100">•</span>
          <p className="year text-gray-100 font-medium text-base">
            {release_date ? release_date.split('-')[0] : 'NA'}
          </p>
        </div>
      </div>

      <button
        onClick={onOpenPopup}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-yellow-400 to-yellow-500 text-black font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-transform hover:scale-110 hover:shadow-2xl"
      >
        ▶
      </button>
    </div>
  );
};

export default MovieCard;
