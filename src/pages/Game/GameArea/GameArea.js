import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
// import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Redirect, Link } from "react-router-dom";

import Board from '../Board/Board';
import './styles.css';
import { socket, startGame, playChess, leaveRoom } from './../../../context/Socket'
import { calculateWinner } from './Service'
import Notice from './../../../components/Notice/index'
import CallAPI from './../../../utils/CallAPI'
import Authorization from './../../../utils/callAuth'

const GameArea = (props) => {
  const [stepNumber, setStepNumber] = useState(0);
  const [alphabet, setAlphabet] = useState("");
  const [nextALP, setNextAPL] = useState("")
  const [wait, setWait] = useState(false);
  const [isFirst, setIsFirst] = useState(false);
  // const [isDescending, setIsDescending] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isError, setIsError] = useState({
    value: false,
    message: ''
  });

  const [history, setHistory] = useState([{
    squares: Array(400).fill(null),
    position: null,
  }]);

  const [winner, setWinner] = useState(
    {
      value: null,
      position: []
    }
  )

  const [playerID, setPlayerID] = useState(null);

  React.useEffect(() => {
    socket.on('newplayer', res => {
      setAlphabet('X');
      setIsPlaying(false);
      setIsFirst(true);
      setNextAPL('X');
      setStepNumber(0);
      setHistory([{
        squares: Array(400).fill(null),
        position: null,
      }])
      setIsError({
        value: true,
        message: `Người chơi ${res.username} đã vào phòng`
      })
      setWinner({
        value: null,
        position: []
      })
      setPlayerID(res.id);
    })

    socket.on('leaveroom', res => {
      setIsPlaying(false);
      setIsFirst(false);
      setIsError({
        value: true,
        message: `Người chơi ${res} đã rời khỏi phòng`
      })
    })
  }, [])

  React.useEffect(() => {
    socket.on('startgame', res => {
      setWinner({
        value: null,
        position: []
      })
      setAlphabet(res.alphabet)
      setIsPlaying(true);
      setNextAPL(isFirst ? alphabet : alphabet === 'X' ? 'O' : 'X');
      setStepNumber(0);
      setHistory([{
        squares: Array(400).fill(null),
        position: null,
      }])
      setPlayerID(res.id);
    })
  }, [alphabet, isFirst])

  React.useEffect(() => {
    if (alphabet !== '')
      socket.on('playchess', res => {
        setHistory(res.history);
        setStepNumber(res.stepNumber);
        setNextAPL(alphabet)
      })
  }, [alphabet])

  const handleClick = (i) => {
    if (!isPlaying)
      return;

    if (nextALP !== alphabet)
      return;

    const newHistory = history.slice(0, stepNumber + 1);
    const current = newHistory[newHistory.length - 1];
    // create a copy of current array squares
    const squares = current.squares.slice();
    if (calculateWinner(current.squares, current.position, 20, 20, 5).value || squares[i]) {
      return;
    }
    squares[i] = alphabet;
    setHistory(newHistory.concat([{ squares: squares, position: i }]));
    setStepNumber(newHistory.length);
    setNextAPL(alphabet === 'O' ? 'X' : 'O');
    playChess(props.roomID, newHistory.concat([{ squares: squares, position: i }]), stepNumber + 1);
    setWait(!wait)

  }
  // const jumpTo = (step) => {
  //   setStepNumber(step);
  //   setXIsNext((step % 2) === 0);
  // }
  // const sortHistory = () => {
  //   setIsDescending(!isDescending);
  // }

  React.useEffect(() => {
    const newHistory = history;
    const current = newHistory[stepNumber];
    const winnerTemp = calculateWinner(current.squares, current.position, 20, 20, 5);

    if (winnerTemp.value && isPlaying === true) {
      setIsPlaying(false);
      if (winnerTemp.value === alphabet) {
        Authorization('auth/profile', JSON.parse(localStorage.getItem('id_token')))
          .then(res => {
            CallAPI('histories', 'POST', {
              isWin: 1,
              turnCount: stepNumber + 1,
              player1: res.data.id,
              player2: playerID
            })
          })
        setIsFirst(true);
      }
      else {
        setIsFirst(false);
      }
      setWinner(winnerTemp);
    }
  }, [history, stepNumber, alphabet, playerID])

  const newHistory = history;
  const current = newHistory[stepNumber];

  let status;
  if (winner.value) {
    status = 'Winner: ' + winner.value;
  } else if (!current.squares.includes(null)) {
    status = "Draw";
  }
  else {
    status = 'Next player: ' + nextALP;
  }
  // const moves = history.map((step, move) => {
  //   const desc = move ? "Go to #" + move + "(" + step.justClick.col + "," + step.justClick.row + ")" : "Go to game start!";
  //   return (
  //     <li key={move}>
  //       <button onClick={() => jumpTo(move)}>{stepNumber === move ? <b>{desc}</b> : desc}</button>
  //     </li>
  //   )
  // });

  const handleOnClick = () => {
    startGame(props.roomID, alphabet, setIsPlaying, setNextAPL, setStepNumber, setHistory, setIsError, setWinner);
  }
  const handleLeaveRoom = () => {
    leaveRoom();
  }
  return (
    <div className="gameContainer">
      <div className='titleGameRoom'>
        <h5>Room: {props.roomID}</h5>
        <div><b>{status}</b></div>
        <Link to='/'>
          <Button onClick={handleLeaveRoom} variant="outline-danger">Rời khỏi phòng</Button>
        </Link>
      </div>
      <Notice isShow={isError.value} mes={isError.message} handleClose={() => setIsError({
        value: false,
        message: ""
      })}></Notice>
      <div className="game-board">
        {!isPlaying && isFirst ? <Button onClick={handleOnClick}> Start game</Button> : <></>}
        <h1>Your alphabet: {alphabet}</h1>

        <Board
          currentPosition={current.position}
          winningSquares={winner.value ? winner.position : []}
          squares={current.squares}
          onClick={(i) => handleClick(i)}
        />
      </div>
      <div className="game-info">
        {/* <ol>{isDescending ? moves.reverse() : moves}</ol>
        <button onClick={() => sortHistory()}>
          Sort by: {isDescending ? "Asending" : "Descending"}
        </button> */}
      </div>
    </div>
  );
}
export default GameArea;