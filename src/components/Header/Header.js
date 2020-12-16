import React, { useContext } from 'react';
import { Nav, Navbar, Form, FormControl, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

import { LoginContext } from '../../context/LoginContext';
import {leaveRoom} from './../../context/Socket'
import './styles.css';


const Header = () => {
  //phai khai bao dung thu tu va du props de lay dung gia tri props cua context
  const [isLogin, handleLogin, handleLogout] = useContext(LoginContext);
  return (
    <Navbar bg="primary" variant="dark">
      <Link to='/' >
        <Navbar.Brand as='div' onClick={() => {
          leaveRoom();
        }}><b>Advanced Caro</b></Navbar.Brand>

      </Link>
      <Nav className="mr-auto">
        <Link to='/' >
          <Nav.Link as='div' onClick={() => {
            leaveRoom();
          }}>Home</Nav.Link>

        </Link>
        <Link to='/profile' >
          <Nav.Link as='div' onClick={() => {
            leaveRoom();
          }}>Profile</Nav.Link>
        </Link>
        <Link to='/history' >
          <Nav.Link as='div' onClick={() => {
            leaveRoom();
          }}>Lịch sử đấu</Nav.Link>
        </Link>
      </Nav>
      <Form inline>
        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
        <Button variant="outline-light">Search</Button>
      </Form>
      <Nav className="login">
        {!isLogin ? <Nav.Link href="/login"><Button variant="outline-light">Đăng nhập</Button></Nav.Link> : <Nav.Link><Button onClick={handleLogout} variant="outline-light">Đăng xuất</Button></Nav.Link>}
      </Nav>
    </Navbar>
  )
}
export default Header;