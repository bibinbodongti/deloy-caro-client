import React, { useState } from 'react';
// import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Col, Row } from 'react-bootstrap';
import { Link } from "react-router-dom";

import Board from '../Board/Board';
import outRoom from './image/back-arrow.svg'
import trophy from './image/trophy.svg'
import key from './image/key.svg'
import ChangingProgressProvider from './provider'
import {
  CircularProgressbarWithChildren,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import man from './image/man.svg'

const GameArea = (props) => {
  const [history, setHistory] = useState([{
    squares: Array(400).fill(null),
    position: null,
  }]);
  const [firstPlayer, setFirstPlayer] = useState(props.player1)
  const [secondPlayer, setSecondPlayer] = useState(props.player2)
  const [stepNumber, setStepNumber] = useState(props.stepNumber);

  const [winner, setWinner] = useState(
    {
      value: null,
      position: []
    }
  )

  React.useEffect(()=>{
    setFirstPlayer(props.player1);
    setSecondPlayer(props.player2)
  }, [props.player1, props.player2])

  React.useEffect(()=>{
    setStepNumber(props.stepNumber)
  }, [ props.stepNumber])

  React.useEffect(() => {
    if (props.steps.length !== 0 && firstPlayer.user && secondPlayer.user) {
      const newHistory = props.steps.slice(1).reduce((preHistory, item, index, arr) => {
        const currentHistory = preHistory.slice(0, index + 1);
        const current = currentHistory[currentHistory.length - 1];
        const squares = current.squares.slice();

        console.log(item.userID,firstPlayer.user.id)
        squares[item.position] = item.userID === firstPlayer.user.id? 'X' : 'O'
        return currentHistory.concat([{ squares: squares, position: item.position }]);
      }, [{
        squares: Array(400).fill(null),
        position: null,
      }])
      setHistory(newHistory);
      setStepNumber(newHistory.length-1)
    }
  }, [props.steps, firstPlayer, secondPlayer])

  const newHistory = history;
  const current = newHistory[stepNumber !== -1? stepNumber : 0];

  console.log(secondPlayer.user)
  return (
    <>
      <Row>
        < Col xs={4} className='sidebar-infor' >
          <Row>
            <Col xs={6}>
              <Link to = "/history">
              <button className="myButton mt-2" >
                <img src={outRoom} className='img-out-room' alt='Đang load...'></img>
              </button>
              </Link>

            </Col>
            <Col xs={6} style={{ display: "flex", alignItems: "center" }}>
              <h5>Room ID: {props.roomID}</h5>
            </Col>
          </Row>
          <Row className='mid-border player-avatar'   >
            <div className='inner-border' style={{ position: "relative" }} >
              <Row>
                <Col xs={12} className='text-align-center'>
                  <h5 >{firstPlayer.user.name}</h5>
                </Col>
                <Col xs={12}>

                  <div className='text-align-center' style={{ height: "17vh", width: "17vh", margin: "auto" }}>
                    <ChangingProgressProvider startTime={firstPlayer.isTurn} interval={200} values={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]}>
                      {percentage => (
                        <CircularProgressbarWithChildren
                          value={percentage}
                          styles={buildStyles({
                            pathColor: !firstPlayer.isTurn ? "brown" : percentage < 70 ? "#DE9B72" : "#ee5b00",
                            trailColor: !firstPlayer.isTurn ? "brown" : "#eee",
                            strokeLinecap: !firstPlayer.isTurn ? "brown" : "butt",
                          })}
                        >
                          <img src={firstPlayer.user.avatarImagePath === null ? man : firstPlayer.user.avatarImagePath} className="img-fluid z-depth-1 rounded-circle img-avatar" alt="Đang load..." />

                        </CircularProgressbarWithChildren>
                      )}
                    </ChangingProgressProvider>
                  </div>


                </Col>
                <Col xs={12} className='text-align-center mt-2'>
                  <Row className="justify-content-md-center">
                    <img src={trophy} className="img-fluid z-depth-1 rounded-circle img-cup" alt="" />
                    <h5>{firstPlayer.user.cup}</h5>
                  </Row>
                </Col>
              </Row>
              {
                firstPlayer.isHost ? <div style={{ position: "absolute" }}>
                  <img src={key} className="img-fluid z-depth-1 rounded-circle " style={{ height: "8vh" }} alt="Đang load..." />
                </div> : <></>
              }
            </div>
          </Row>
          <Row className='mid-border player-avatar'   >
            <div className='inner-border' style={{ position: 'relative' }} >
              <Row>
                <Col xs={12} className='text-align-center'>
                  <h5 >{secondPlayer.user.name}</h5>
                </Col>
                <Col xs={12}>

                  <div className='text-align-center' style={{ height: "17vh", width: "17vh", margin: "auto" }}>
                    <ChangingProgressProvider startTime={secondPlayer.isTurn} interval={200} values={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]}>
                      {percentage => (
                        <CircularProgressbarWithChildren
                          value={percentage}
                          styles={buildStyles({
                            pathColor: !secondPlayer.isTurn ? "brown" : percentage < 70 ? "#DE9B72" : "#ee5b00",
                            trailColor: !secondPlayer.isTurn ? "brown" : "#eee",
                            strokeLinecap: !secondPlayer.isTurn ? "brown" : "butt",
                          })}
                        >
                          <img src={secondPlayer.user.avatarImagePath === null ? man : secondPlayer.user.avatarImagePath} className="img-fluid z-depth-1 rounded-circle img-avatar" alt="Đang load..." />

                        </CircularProgressbarWithChildren>
                      )}
                    </ChangingProgressProvider>
                  </div>



                </Col>
                <Col xs={12} className='text-align-center mt-2'>
                  <Row className="justify-content-md-center">
                    <img src={trophy} className="img-fluid z-depth-1 rounded-circle img-cup" alt="" />
                    <h5>{secondPlayer.user.cup}</h5>
                  </Row>
                </Col>
              </Row>
              {
                secondPlayer.isHost ? <div style={{ position: "absolute" }}>
                  <img src={key} className="img-fluid z-depth-1 rounded-circle " style={{ height: "8vh" }} alt="" />
                </div> : <></>
              }
            </div>
          </Row>
        </Col >
        <Col xs={8} className="game-board">
          <Container>

            <div style={{ pointerEvents: "none" }}>
              <Board
                currentPosition={current.position}
                winningSquares={winner.value ? winner.position : []}
                squares={current.squares}
              />
            </div>
          </Container>
        </Col>
      </Row>
    </>

  );
}
export default GameArea;