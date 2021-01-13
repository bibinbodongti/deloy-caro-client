import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './styles.css';
import GameArea from './GameArea/GameArea';
import ChatArea from './ChatArea/index';
import { useParams } from "react-router-dom";
import { LoginContext } from '../../context/LoginContext';
import { reconnectRoom } from '../../context/Socket'

const Game = () => {
  const { id } = useParams();
  const [login, setLogin] = React.useState(false);
  const [isLogin] = React.useContext(LoginContext);
  const [isConnect, setIsConnect] = React.useState(false);
  const [isPlayer, setIsPlayer] = React.useState(false);
  const [isHost, setIsHost] = React.useState(false);

  React.useEffect(() => {
    setLogin(isLogin);
  }, [isLogin]);

  React.useEffect(()=>{
    reconnectRoom(id, setIsConnect, setIsHost, setIsPlayer);
  },[id] )

  return (
    <Container fluid style={{ backgroundColor: "#ffdac3" }}>
      {login ? (
        <>
          <Row >
            <Col lg={9} xs={12}>
              {isConnect? <GameArea roomID={id} isPlayer = {isPlayer} isHost = {isHost}/> : <></>}
            </Col>
            <Col lg={3} xs={12}>
              <ChatArea roomID={id} />
            </Col>
          </Row>
        </>
      ) : null}
    </Container>
  )
}
export default Game;