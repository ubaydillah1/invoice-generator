/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";

const Square = ({ value, onClick }) => {
  return (
    <button
      className="w-20 h-20 border-2 border-black font-bold text-3xl"
      onClick={onClick}
    >
      {value}
    </button>
  );
};

const TicTacToeBoard = ({ isXNext, onPlay, squares }) => {
  const handleClick = (i) => {
    if (squares[i] || calculateWinner(squares)) return;

    const newSquares = squares.slice();
    newSquares[i] = isXNext ? "X" : "O";

    onPlay(newSquares);
  };

  const winner = calculateWinner(squares);
  const isBoardFull = squares.every((square) => square !== null);

  let turnMessage = "";
  if (winner) {
    turnMessage = `Winner: ${winner}`;
  } else if (isBoardFull) {
    turnMessage = "It's a draw!";
  } else {
    turnMessage = isXNext ? "X's Turn" : "O's Turn";
  }

  return (
    <div className="tic-tac-toe-page max-w-[240px] w-full m-auto mt-56">
      <div className="turn-indicator text-center mb-4 text-xl font-bold">
        {turnMessage}
      </div>
      <div className="board flex flex-wrap">
        {squares.map((square, i) => (
          <Square key={i} value={square} onClick={() => handleClick(i)} />
        ))}
      </div>
    </div>
  );
};

const TicTacToePage = () => {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const [isXNext, setIsXNext] = useState(true);

  const handlePlay = (nextSquares) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setIsXNext(!isXNext);
  };

  const jumpTo = (nextMove) => {
    setCurrentMove(nextMove);
    setIsXNext(nextMove % 2 === 0);
  };

  const moves = history.map((squares, move) => {
    let description = "";

    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to Game Start";
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <>
      <div>
        <div>
          <TicTacToeBoard
            squares={currentSquares}
            isXNext={isXNext}
            onPlay={handlePlay}
          />
        </div>
        <div>
          <ol>{moves}</ol>
        </div>
      </div>
    </>
  );
};

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default TicTacToePage;
