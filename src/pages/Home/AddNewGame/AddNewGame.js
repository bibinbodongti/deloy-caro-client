import React from 'react';
import { Card, Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './styles.css';

const AddNewGame = ({ addNew }) => {
  return (
    <>
      <Card key="add" className="addNewGameContainer">
        <Card.Header><Card.Title className='titleAddNewGame'>Tạo phòng mới</Card.Title></Card.Header>
        <Card.Body className='btnAddContainer'>
            <Button className='btnAdd' onClick={() => addNew()} variant="outline-info" size='lg'>Tạo</Button>
        </Card.Body>
      </Card>
    </>
  )
}
export default AddNewGame;