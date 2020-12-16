import React from 'react';

const Square = (props) => {
  return (
    <button className={props.isWinning ? "square square--winning" :props.isCurrentPosition ? 'square current-position' : 'square'} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

export default Square;