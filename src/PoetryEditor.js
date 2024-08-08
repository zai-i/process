import React, { useState } from 'react';
import axios from 'axios';

const PoetryEditor = () => {
  const [rhymes, setRhymes] = useState([]);
  const [selectedWord, setSelectedWord] = useState('');

  const handleWordClick = async (word) => {
    setSelectedWord(word);
    const response = await axios.get(`https://api.datamuse.com/words?rel_rhy=${word}`);
    setRhymes(response.data);
  };

  const handleTextClick = (event) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const word = range.toString().trim();
      if (word) {
        handleWordClick(word);
      }
    }
  };

  return (
    <div className="poetry-editor-container">
      <div className="editor" contentEditable="true" onClick={handleTextClick} placeholder="start typing"></div>
      {selectedWord && (
        <div className="rhymes">
          <h3>rhymes for {selectedWord}</h3>
          <ul>
            {rhymes.map((rhyme) => (
              <li key={rhyme.word}>{rhyme.word}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PoetryEditor;
