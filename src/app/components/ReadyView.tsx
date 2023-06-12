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
