import React, { useState, useEffect } from 'react';

// Assuming you have a function or API endpoint to fetch team status
// import { fetchTeamsStatus } from '../api';

interface Team {
  ready: boolean;
}

interface ReadyRoomProps {
  onReadyClick: () => Promise<void>; // onReadyClick is a function that returns a Promise
}


const ReadyView: React.FC<ReadyRoomProps> = ({ onReadyClick }) => {


  return (
    <div>
      <button onClick={onReadyClick}>READY</button>
    </div>
  );
};

export default ReadyView;
