import React from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './styles.css';
import blackCircle from './blackCircle.svg';
import { socket } from './../../context/Socket'
import CallAuthAPI from './../../utils/CallAuthAPI'
import { getOnlines } from './../../context/Socket'
const ListUser = () => {
    // const socket = React.useContext(SocketContext);
    const [users, setUsers] = React.useState([]);

    React.useEffect(() => {
        getOnlines(setUsers);
        socket.on('newConnect', users => {
            CallAuthAPI('users/online', 'POST', {
                users: users,
            }, JSON.parse(localStorage.getItem('id_token')))
                .then(res => {
                    setUsers(res.data)
                })
        })

    }, [])


    return (
        <Container className='listUserContainer'>
            <h5>Danh sách người dùng đang online</h5>
            <ListGroup className='listUserOnline'>
                {
                    users.map((user, index) => {
                        return <ListGroup.Item key={index} action variant="light" className='itemUserOnline'><div>{user.username}</div> <img src={blackCircle} alt="active" /></ListGroup.Item>
                    })
                }
            </ListGroup>

        </Container>
    )
}
export default ListUser;