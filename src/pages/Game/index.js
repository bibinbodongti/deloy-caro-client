import React from 'react';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './styles.css';
import GameArea from './GameArea/GameArea';
import ChatArea from './ChatArea/index';
import { useParams, Redirect } from "react-router-dom";
import { reconnectRoom, socket } from './../../context/Socket'
import ListUser from '../../components/ListUser/ListUser';

const Game = () => {
    const { id } = useParams();
    const [error, setError] = React.useState(false)
    
    React.useEffect(() => {
        reconnectRoom(id, setError);
        socket.on('message', res => console.log(res));
    }, [id])

    if (error) return <Redirect to='/' />

    return (
        <Container fluid className='gamePageContainer'>
            <div className='gameAreaContainer' >
                <GameArea roomID = {id}/>
            </div>
            <div className='listOnlineAreaContainer'>
                <ListUser/>
            </div>
            <div className='chatAreaContainer'>
                <ChatArea roomID={id}/>
            </div>
        </Container>
    )
}
export default Game;