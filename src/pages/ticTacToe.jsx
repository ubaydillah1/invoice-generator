import { useState } from "react";

/* eslint-disable react/prop-types */
const Square = ({ value, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-[60px] h-[60px] border-2 border-black text-3xl font-bold flex justify-center items-center"
    >
      {value}
    </button>
  );
};

const Board = ({ values, isXnext, onPlay }) => {
  const handleClick = (i) => {
    if (values[i] || calculateWinner(values)) return;

    const nextValues = [...values];
    nextValues[i] = isXnext ? "X" : "O";

    onPlay(nextValues);
  };

  const info = calculateWinner(values);

  let description = "";

  if (info) {
    description = "Winner is " + info;
  } else if (values.every((value) => value !== null)) {
    description = "Draw";
  } else {
    description = (isXnext ? "X" : "O") + "'s Turn";
  }

  return (
    <div>
      <div className="font-bold text-2xl my-3 text-center">{description}</div>
      <div className="Board flex justify-center items-center flex-wrap mx-auto w-[180px]">
        {values.map((value, i) => {
          return (
            <Square value={value} key={i} onClick={() => handleClick(i)} />
          );
        })}
      </div>
    </div>
  );
};

const TicTacToePage = () => {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [isXnext, setIsXNext] = useState(true);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setIsXNext(nextMove % 2 === 0);
  }

  function handlePlay(squares) {
    const nextHistory = [...history.slice(0, currentMove + 1), squares];
    setCurrentMove(nextHistory.length - 1);
    setHistory(nextHistory);
    setIsXNext(!isXnext);
  }

  const moves = history.map((squares, move) => {
    const desc = move ? "Go to move #" + move : "Go to game start";

    return (
      <li key={move}>
        <button
          className="border bg-black text-white font-medium py-4 px-3 w-52 my-1 rounded-md shadow-lg"
          onClick={() => jumpTo(move)}
        >
          {desc}
        </button>
      </li>
    );
  });

  return (
    <div className="flex items-center justify-center mt-[200px] gap-10">
      <div>
        <Board values={currentSquares} isXnext={isXnext} onPlay={handlePlay} />
      </div>
      <div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

function calculateWinner(values) {
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

    if (values[a] && values[a] === values[b] && values[b] === values[c]) {
      return values[a];
    }
  }

  return false;
}

export default TicTacToePage;
