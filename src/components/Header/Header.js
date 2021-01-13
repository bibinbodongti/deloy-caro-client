import React, { useContext } from 'react';
import { Nav, Navbar, Form, FormControl, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

import { LoginContext } from '../../context/LoginContext';
import { leaveRoom } from './../../context/Socket'
import './styles.css';


const Header = () => {
  //phai khai bao dung thu tu va du props de lay dung gia tri props cua context
  const [isLogin, handleLogin, handleLogout] = useContext(LoginContext);
  return (
    <div className='headerContainer'>
      <Navbar className='navbarConfig' variant="dark">
        <Link to='/' >
          <Navbar.Brand as='div' onClick={() => {
            leaveRoom();
          }}><b>Advanced Caro</b></Navbar.Brand>
        </Link>
        <div className='headerContentContainer'>
          {
            isLogin ? (<>
              <Nav className="mr-auto">
                <Link to='/' >
                  <Nav.Link as='div' onClick={() => {
                    leaveRoom();
                  }}>Trang chủ</Nav.Link>

                </Link>
                <Link to='/profile' >
                  <Nav.Link as='div' onClick={() => {
                    leaveRoom();
                  }}>Thông tin cá nhân</Nav.Link>
                </Link>
                <Link to='/history' >
                  <Nav.Link as='div' onClick={() => {
                    leaveRoom();
                  }}>Lịch sử đấu</Nav.Link>
                </Link>
                <Link to='/bangxephang' >
                  <Nav.Link as='div' onClick={() => {
                    leaveRoom();
                  }}>Bảng xếp hạng</Nav.Link>
                </Link>
              </Nav>
              <Form inline>
                <FormControl type="text" placeholder="Tìm kiếm" className="mr-sm-2" />
                <Button variant="outline-light">Tìm kiếm</Button>
              </Form></>) : null
          }


          <Nav className="login">
            {!isLogin ? <Nav.Link href="/login"><Button variant="outline-light">Đăng nhập</Button></Nav.Link> : <Nav.Link><Button onClick={handleLogout} variant="outline-light">Đăng xuất</Button></Nav.Link>}
          </Nav>
        </div>
      </Navbar>
    </div>
  )
}
export default Header;