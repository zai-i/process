import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const PoetryEditor = () => {
  const [rhymes, setRhymes] = useState([]);
  const [selectedWord, setSelectedWord] = useState('');

  const editableRef = useRef(null);

  useEffect(() => {
    const editableDiv = editableRef.current;

    const handleClick = async (event) => {
      let range, textNode, offset;

      if (document.caretPositionFromPoint) {
        const caret = document.caretPositionFromPoint(event.clientX, event.clientY);
        range = document.createRange();
        range.setStart(caret.offsetNode, caret.offset);
        range.setEnd(caret.offsetNode, caret.offset);
      } else if (document.caretRangeFromPoint) {
        range = document.caretRangeFromPoint(event.clientX, event.clientY);
      } else if (event.rangeParent) {
        range = document.createRange();
        range.setStart(event.rangeParent, event.rangeOffset);
      }

      if (range) {
        textNode = range.startContainer;
        offset = range.startOffset;

        if (textNode.nodeType === Node.TEXT_NODE) {
          const text = textNode.textContent;
          const wordStart = text.lastIndexOf(' ', offset) + 1;
          let wordEnd = text.indexOf(' ', offset);
          if (wordEnd === -1) wordEnd = text.length;
          const word = text.substring(wordStart, wordEnd);

          setSelectedWord(word);
          const response = await axios.get(`https://api.datamuse.com/words?rel_rhy=${word}`);
          setRhymes(response.data);
        }
      }
    };

    if (editableDiv) {
      editableDiv.addEventListener('click', handleClick);
      editableDiv.addEventListener('touchend', handleClick);

      return () => {
        editableDiv.removeEventListener('click', handleClick);
        editableDiv.removeEventListener('touchend', handleClick);
      };
    }
  }, []);

  return (
    <div className="poetry-editor-container">
      <div
        id="editable"
        ref={editableRef}
        contentEditable="true"
        placeholder="start typing"
      >
      </div>
      {selectedWord && (
        <div className="rhymes">
          <h3>Rhymes for {selectedWord}</h3>
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
