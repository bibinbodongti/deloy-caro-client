import React, { useState, useEffect } from 'react';
// import { Redirect } from "react-router-dom";
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Redirect } from 'react-router-dom';

import './styles.css';
import GameCard from '../GameCard/GameCard';
import AddNewGame from '../AddNewGame/AddNewGame';
import { socket, createRoom, joinRoom, getRooms } from './../../../context/Socket';
import Notice from './../../../components/Notice/index';

const ManageListGameCard = () => {
  const [listGame, setListGame] = useState([]);
  const [idNewRoom, setIdNewRoom] = useState(null);
  const [isError, setIsError] = useState({
    value: false,
    message: ""
  });

  useEffect(() => {
    getRooms(setListGame);
    socket.on('getrooms', res =>  setListGame(res) );
  }, []);

  const handleJoinRoom = (roomID) => {
    joinRoom(roomID, setIdNewRoom, setIsError)
  }

  const addNew = async () => {
    createRoom(setIdNewRoom, setIsError);
  };

  if (idNewRoom !== null) return <Redirect to={`/room/${idNewRoom}`} />
  return (
    <div className="mainBoardContainer">
      <Notice isShow={isError.value} mes = {isError.message} handleClose={() => setIsError({
        value: false,
        message: ""
      })}></Notice>
      <h4>Danh sách các phòng game</h4>
      <h5>Vào phòng game mong muốn bằng cách xin ID phòng từ chủ phòng</h5>
      <Container className="managerBoardContainer">
        <Row>
          <Col xs={3}>
            <AddNewGame addNew={addNew} />
          </Col>
          {
            listGame.map((game, index) => {
              return (
                <Col xs={3} key={index}>
                  <GameCard game={game} index={index} onJoinRoom={() => handleJoinRoom(game.roomID)} />
                </Col>
              )
            })
          }
        </Row>
      </Container>
    </div>
  )
}
export default ManageListGameCard;