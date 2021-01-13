import React from 'react';
import { Card, Button, CardGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import playingIcon from './playing.svg';
import waitingIcon from './waiting.svg';

import './styles.css';
const ROOM_STATE_WAITING = 0;

//config datetime
const moment = require('moment');
moment.locale('vi');

const GameCard = ({ game, index, onJoinRoom }) => {
	return (
		<>
			<div class="outer-border-gamecard">
				<div class="mid-border-gamecard">
					<div class="inner-border-gamecard">
						<CardGroup key={index} className="gameContainer" style={{ padding: 10 }}>
							<Card.Header className="cardHeader">
								<Card.Title>ID: {game.roomID}</Card.Title>
								<img src={game.roomState === ROOM_STATE_WAITING? waitingIcon: playingIcon} alt="icon" style={{ height: 25, width: 25, marginBottom: '0.75rem' }}></img>
							</Card.Header>
							<Card.Body className="cardBody gameInformationDetail">
								<Card.Text className="gameDateCreate">
									<b>Số người: {game.users.length}</b>
								</Card.Text>
							</Card.Body>
							<Card.Footer className="cardFooter">
								<Button onClick={() => onJoinRoom()} variant="outline-info">Vào phòng</Button>
							</Card.Footer>
						</CardGroup>
					</div>
				</div>
			</div>
		</>
	)
}
export default GameCard;