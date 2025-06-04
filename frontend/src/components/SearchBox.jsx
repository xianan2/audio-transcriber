import React, { useState } from 'react';

/**
 * Component for searching transcriptions by filename.
 * Renders a text input and a search button.
 * Calls the onSearch callback (from parent) with the entered filename.
 */
const SearchBox = ({ onSearch }) => {
  // State to store the filename input
  const [filename, setFilename] = useState('');

  // Handler for search button click
  const handleSearch = () => {
    onSearch(filename); // Trigger search callback in parent
  };

  return (
    <div>
      <input
        type="text"
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
        placeholder="Search by filename"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBox;