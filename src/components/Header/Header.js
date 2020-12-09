import React,{useContext} from 'react';
import {Nav,Navbar,Form, FormControl, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import {LoginContext} from '../../context/LoginContext';
import './styles.css';


const Header=()=>{
  //phai khai bao dung thu tu va du props de lay dung gia tri props cua context
  const [isLogin,handleLogin,handleLogout]=useContext(LoginContext);
  return(
    <Navbar bg="primary" variant="dark">
    <Navbar.Brand href="/"><b>Advanced Caro</b></Navbar.Brand>
    <Nav className="mr-auto">
      <Nav.Link href="/">Home</Nav.Link>
      <Nav.Link href="/profile">Profile</Nav.Link>
    </Nav>
    <Form inline>
      <FormControl type="text" placeholder="Search" className="mr-sm-2" />
      <Button variant="outline-light">Search</Button>
    </Form>
    <Nav className="login">
      {!isLogin?<Nav.Link href="/login"><Button variant="outline-light">Đăng nhập</Button></Nav.Link>:<Nav.Link><Button onClick={handleLogout} variant="outline-light">Đăng xuất</Button></Nav.Link>}
    </Nav>
  </Navbar>
  )
}
export default Header;