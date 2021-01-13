import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';

import GameArea from './GameArea/GameArea';
import ChatArea from './ChatArea/index';
import { useParams } from "react-router-dom";
import { LoginContext } from '../../context/LoginContext';
import CallAuthAPI from './../../utils/CallAuthAPI'
import Authorization from './../../utils/callAuth'

const Game = () => {
  const { id } = useParams();
  const [login, setLogin] = React.useState(false);
  const [isLogin] = React.useContext(LoginContext);
  const [player1, setPlayer1] = React.useState(null);
  const [player2, setPlayer2] = React.useState(null);
  const [roomID, setRoomID] = React.useState(null)
  const [isConnect, setIsConnect] = React.useState(false);
  const [stepHistory, setStepHistory] = React.useState([]);
  const [stepNumber, setstepNumber] = React.useState(-1);
  const [chats, setChats] = React.useState([])

  React.useEffect(() => {
    setLogin(isLogin);

  }, [isLogin]);

  React.useEffect(() => {
    const fetchData = async () => {
      const match = await CallAuthAPI(`matchs/${id}`, 'GET', null, JSON.parse(localStorage.getItem('id_token')))
      setPlayer1({
        user: {
          id: match.data.player1ID,
          name: match.data.player1Name,
          cup: match.data.player1Cup,
          avatarImagePath: match.data.player1Image
        },
        isHost: true
      })
      setPlayer2({
        user: {
          id: match.data.player2ID,
          name: match.data.player2Name,
          cup: match.data.player2Cup,
          avatarImagePath: match.data.player2Image
        },
        isHost: false
      })

      setRoomID(match.data.roomId)
      setIsConnect(true)

      const chats = await CallAuthAPI(`chats/match?roomID=${match.data.roomId}&startTime=${match.data.startDate}&endTime=${match.data.endDate}`, 'GET', null, JSON.parse(localStorage.getItem('id_token')))
      const user = await Authorization('auth/profile', JSON.parse(localStorage.getItem('id_token')))
      const chatList = chats.data.map(item => ({
        host: item.userID === user.data.id,
        name: item.name,
        content: item.content,
        time: item.sendDate

      }))
      setChats(chatList)

      const stepList = await CallAuthAPI(`steps/matches/${id}`, 'GET', null, JSON.parse(localStorage.getItem('id_token')))
      const steps = stepList.data.map(step => ({
        userID: step.userId,
        position: step.position,
        time: step.time
      }))

      steps.unshift({
        userID: null,
        position: null,
        time: match.data.startDate
      })
      setStepHistory(steps)
    }

      fetchData();
  }, [id])


  const jumpTo = (step) => {
    setstepNumber(step);
  }

  return (
    <Container fluid style={{ backgroundColor: "#ffdac3" }}>
      {isConnect && login ? (
        <>
          <Row >
            <Col lg={9} xs={12}>
              <GameArea player1={player1} player2={player2} roomID={roomID} steps={stepHistory} stepNumber={stepNumber} />
            </Col>
            <Col lg={3} xs={12}>
              <ChatArea roomID={id} jumpTo={jumpTo} stepHistory={stepHistory} chats={chats} />
            </Col>
          </Row>
        </>
      ) : null}
    </Container>
  )
}
export default Game;