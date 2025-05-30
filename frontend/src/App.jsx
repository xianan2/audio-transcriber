import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import TranscriptionList from './components/TranscriptionList';
import SearchBox from './components/SearchBox';
import axios from 'axios';

const App = () => {
  const [transcriptions, setTranscriptions] = useState([]);
  const [query, setQuery] = useState('');

  const fetchTranscriptions = async () => {
    const res = await axios.get('/transcriptions');
    setTranscriptions(res.data);
  };

  const handleSearch = async (filename) => {
    setQuery(filename);
    const res = await axios.get(`/search?filename=${filename}`);
    setTranscriptions(res.data);
  };

  useEffect(() => {
    fetchTranscriptions();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Audio Transcription App</h1>
      <FileUpload onUpload={fetchTranscriptions} />
      <SearchBox onSearch={handleSearch} />
      <TranscriptionList transcriptions={transcriptions} />
    </div>
  );
};

export default App;