import React, { useState } from 'react';

/**
 * Component for searching transcriptions by filename.
 */
const SearchBox = ({ onSearch }) => {
  const [filename, setFilename] = useState('');

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