import React from 'react';

const RatingFilter = ({ ratingFilter, setRatingFilter }) => {
  return (
    <div className="flex items-center">
      <label htmlFor="rating-filter" className="text-white mr-2">
        Filter by Rating:
      </label>
      <select
        id="rating-filter"
        value={ratingFilter}
        onChange={(e) => setRatingFilter(parseFloat(e.target.value))}
        className="bg-dark-100 text-white p-2 pr-4 rounded"
      >
        <option value="0">All Ratings</option>
        <option value="5">5.0+</option>
        <option value="6">6.0+</option>
        <option value="7">7.0+</option>
        <option value="8">8.0+</option>
        <option value="9">9.0+</option>
      </select>
    </div>
  );
};

export default RatingFilter;
