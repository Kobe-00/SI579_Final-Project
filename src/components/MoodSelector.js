import React from 'react';

const moods = ['Happy', 'Sad', 'Energetic', 'Chill', 'Focus'];

function MoodSelector({ onSelect }) {
  return (
    <div className="mood-selector">
      {moods.map((mood) => (
        <button key={mood} onClick={() => onSelect(mood)}>
          {mood}
        </button>
      ))}
    </div>
  );
}

export default MoodSelector;