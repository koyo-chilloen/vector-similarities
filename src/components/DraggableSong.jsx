import React from 'react';

function DraggableSong({ song, onClick }) {
  return (
    <div
      className="song-item"
      onClick={() => onClick(song)}
    >
      {song.title.replace('.mp3', '')}
    </div>
  );
}

export default DraggableSong;
