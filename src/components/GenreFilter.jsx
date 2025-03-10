import React from 'react';

const GenreFilter = ({ genreFilter, setGenreFilter }) => {
  return (
    <div className="flex items-center">
      <label htmlFor="genre-filter" className="text-white mr-2">
        Filter by Genre:
      </label>
      <select
        id="genre-filter"
        value={genreFilter}
        onChange={(e) => setGenreFilter(parseInt(e.target.value))}
        className="bg-dark-100 text-white p-2 pr-4 rounded"
      >
        <option value="0">All Genres</option>
        <option value="28">Action</option>
        <option value="12">Adventure</option>
        <option value="16">Animation</option>
        <option value="35">Comedy</option>
        <option value="80">Crime</option>
        <option value="99">Documentary</option>
        <option value="18">Drama</option>
        <option value="10751">Family</option>
        <option value="14">Fantasy</option>
        <option value="36">History</option>
        <option value="27">Horror</option>
        <option value="10402">Music</option>
        <option value="9648">Mystery</option>
        <option value="10749">Romance</option>
        <option value="878">Science Fiction</option>
        <option value="10770">TV Movie</option>
        <option value="53">Thriller</option>
        <option value="10752">War</option>
        <option value="37">Western</option>
      </select>
    </div>
  );
};

export default GenreFilter;
