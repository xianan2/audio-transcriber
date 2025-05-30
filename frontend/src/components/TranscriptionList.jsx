import React from 'react';

const TranscriptionList = ({ transcriptions }) => {
  return (
    <div>
      <h2>Transcriptions</h2>
      <ul>
        {transcriptions.map((t, idx) => (
          <li key={idx}>
            <strong>{t.filename}</strong><br />
            <em>{new Date(t.timestamp).toLocaleString()}</em><br />
            {t.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TranscriptionList;