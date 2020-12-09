import React,{useContext} from 'react';
import {Container } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


import {LoginContext} from '../../context/LoginContext';
import ListUser from '../../components/ListUser/ListUser';

const Home=()=>{
    const [isLogin]=useContext(LoginContext);
    //console.log(isLogin);
    if(!isLogin) return <Redirect to='/login' />
    return(
        <Container>
            <ListUser />
        </Container>
    )
}
export default Home;