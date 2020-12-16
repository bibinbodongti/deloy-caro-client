import React from 'react';

import Square from '../Square/Square';

const Board = (props) => {
  const renderSquare = (i) => {
    return (
      <Square
        isCurrentPosition = {props.currentPosition === i}
        isWinning={props.winningSquares.includes(i)}
        key={"square " + i}
        value={props.squares[i]}
        onClick={() => props.onClick(i)}
      />
    );
  }


  const renderSquares = (n) => {
    let squares = [];
    for (let i = n; i < n + 20; i++) {
      squares.push(renderSquare(i));
    }
    return squares;
  }

  const renderRows = (i) => {
    return <div className="board-row">{renderSquares(i)}</div>;
  }
  return (
    <div>
      {renderRows(0)}
      {renderRows(20)}
      {renderRows(40)}
      {renderRows(60)}
      {renderRows(80)}
      {renderRows(100)}
      {renderRows(120)}
      {renderRows(140)}
      {renderRows(160)}
      {renderRows(180)}
      {renderRows(200)}
      {renderRows(220)}
      {renderRows(240)}
      {renderRows(260)}
      {renderRows(280)}
      {renderRows(300)}
      {renderRows(320)}
      {renderRows(340)}
      {renderRows(360)}
      {renderRows(380)}
    </div>
  );
}
export default Board;