import React from 'react';

const moods = [
  { label: '😊 Happy', value: 'Happy' },
  { label: '😢 Sad', value: 'Sad' },
  { label: '💃 Energetic', value: 'Energetic' },
  { label: '😌 Chill', value: 'Chill' },
  { label: '🎯 Focus', value: 'Focus' },
];

function MoodSelector({ onSelect }) {
  return (
    <div className="mood-selector">
      {moods.map((mood) => (
        <button key={mood.value} onClick={() => onSelect(mood.value)}>
          {mood.label}
        </button>
      ))}
    </div>
  );
}

export default MoodSelector;