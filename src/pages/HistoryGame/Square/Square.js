import React from 'react';
import X from './X.svg';
import O from './O.svg'
import './styles.css';
const Square = (props) => {
  return (
      <button className={props.isWinning ? "square square--winning" : props.isCurrentPosition ? 'square current-position' : 'square'} style={{ padding: "0px", backgroundColor: "#DE9B72", border: "1px solid brown" }} onClick={props.onClick}>
        {props.value ? <img alt="myimg" src={props.value === 'X' ? X : props.value === 'O' ? O : ""} style={{ height: "2.8vh", width: "2.8vh", margin: "0", padding: "0" }}></img> : <></>}
      </button>

  );
}

export default Square;