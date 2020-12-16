import React, { useContext } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { LoginContext } from '../../context/LoginContext';
import ListUser from '../../components/ListUser/ListUser';
import ManageListGameCard from './ManagerListHomeCard/ManagerListHomeCard';
import './styles.css';

const Home = () => {
    const [isLogin] = useContext(LoginContext);
  
    if (!isLogin) return <Redirect to='/login' />
    return (
        <Container fluid className='homeContainer'>
            <div className='listGameContainer'>
                <ManageListGameCard />
            </div>
            <div className = 'listOnlineContainer'>
                <ListUser/>
            </div>
        </Container>
    )
}
export default Home;