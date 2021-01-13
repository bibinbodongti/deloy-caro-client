import React from 'react';

import Square from '../Square/Square';
import { Row } from 'react-bootstrap';

const Board = (props) => {
  const renderSquare = (i) => {
    return (
      <Square
        isCurrentPosition={props.currentPosition === i}
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
    return <div >{renderSquares(i)}</div>;
  }
  return (
    <div className='outer-border' style={{ backgroundColor: "brown" }}>
      <div class="body dark-background" style={{ backgroundImage: "url(https://i.ibb.co/nrmkm7d/five-bells-washed-out-logo.png)" }}>
        <div class="mid-border" >
          <div class="inner-border">
            <img alt="myimg" class="vertical-decoration top" src="https://i.ibb.co/JRTK9z4/horizontally-centered-vertical-decoration.png"></img>
            <img alt="myimg" class="vertical-decoration bottom" src="https://i.ibb.co/JRTK9z4/horizontally-centered-vertical-decoration.png"></img>
            <Row className="justify-content-md-center"  style={{ paddingTop: "2em", paddingBottom: "2em" }}>
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
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Board;