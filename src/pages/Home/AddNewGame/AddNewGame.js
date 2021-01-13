import React from 'react';
import { Card, Button, CardGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './styles.css';

const AddNewGame = ({ addNew }) => {
  return (
    <>
    <div class="outer-border-gamecard">
				<div class="mid-border-gamecard">
					<div class="inner-border-gamecard">
						<CardGroup key="add" className="gameContainer" style={{ padding: 10 }}>
							<Card.Header className="cardHeader"><Card.Title>Tạo phòng mới</Card.Title></Card.Header>
							<Card.Footer className="cardFooter">
								<Button onClick={() => addNew()} variant="outline-info">Tạo</Button>
							</Card.Footer>
						</CardGroup>
					</div>
				</div>
			</div>
    </>
  )
}
export default AddNewGame;