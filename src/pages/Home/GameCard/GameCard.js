import React from 'react';
import { Card, Button, CardGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './styles.css';

//config datetime
const moment = require('moment');
moment.locale('vi');

const GameCard = ({ game, index, onJoinRoom }) => {
	return (
		<>
			<CardGroup key={index} className="gameContainer">
				<Card.Header><Card.Title>ID: {game.roomID}</Card.Title></Card.Header>
				<Card.Body className="gameInformationDetail">
					{/* <Card.Text className="gameDateCreate">
						Chủ phòng: {game.hostRoom}
					</Card.Text> */}
					<Card.Text className="gameDateCreate">
						Số người trong phòng: {game.users.length}/2
					</Card.Text>
					{/* <Card.Text className="gameDateCreate">
						Thời gian tạo: {game.dateCreate?moment(game.dateCreate).format('LL'):moment(new Date()).format('LL')}
					</Card.Text> */}
				</Card.Body>
				<Card.Footer>
					<div className="gameButton">
						<Button onClick = {()=>onJoinRoom()} variant="outline-info">Vào phòng</Button>
					</div>
				</Card.Footer>
			</CardGroup>
		</>
	)
}
export default GameCard;