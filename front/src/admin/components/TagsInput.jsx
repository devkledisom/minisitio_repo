import React, { useState } from 'react';

function TagsInput() {
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    console.log(tags)
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      if (tags.length < 10 && !tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div style={containerStyle}>
      <div style={tagsContainerStyle}>
        {tags.map((tag, index) => (
          <div key={index} style={tagStyle}>
            {tag}
            <span style={removeTagStyle} onClick={() => removeTag(index)}>
              &times;
            </span>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          style={inputStyle}
          placeholder="Adicionar marcadores (tag's max 10 unidades)"
        />
      </div>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  height: '150px',
  fontFamily: 'Arial, sans-serif',
  backgroundColor: '#FFF',
  borderRadius: '4px'
};

const tagsContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
 /*  border: '1px solid #ccc', */
  padding: '5px',
  borderRadius: '5px',
  maxWidth: '100%',
  width: '100%',
};

const tagStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '5px',
  margin: '5px',
  backgroundColor: '#FFCC29',
  color: 'white',
  borderRadius: '5px',
  fontSize: '14px',
};

const removeTagStyle = {
  marginLeft: '8px',
  cursor: 'pointer',
};

const inputStyle = {
  border: 'none',
  outline: 'none',
  padding: '5px',
  fontSize: '14px',
  flex: '1',
  minWidth: '150px',
};

export default TagsInput;
