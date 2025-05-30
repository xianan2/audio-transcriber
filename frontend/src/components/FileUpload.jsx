import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    await axios.post('/transcribe', formData);
    setFile(null);
    onUpload();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Upload & Transcribe</button>
    </form>
  );
};

export default FileUpload;
