import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import { LoginContext } from '../../context/LoginContext';
import CallAPI from './../../utils/CallAPI'
import './styles.css';
import Header from './../../components/Header/Header'

const SignUp = () => {
  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputRePassword, setInputRePassword] = useState('');
  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [noticeForm, setNoticeForm] = useState('');

  const [isLogin] = useContext(LoginContext);

  const onChangeUsername = (e) => {
    setInputUsername(e.target.value);
  }
  const onChangePassword = (e) => {
    setInputPassword(e.target.value);
  }
  const onChangeRePassword = (e) => {
    setInputRePassword(e.target.value);
  }
  const onChangeName = (e) => {
    setInputName(e.target.value);
  }
  const onChangeEmail = (e) => {
    setInputEmail(e.target.value);
  }
  const onRegister = () => {
    if (inputUsername === "" || inputName === "" || inputPassword === "" || inputEmail === "") {
      setNoticeForm('Vui lòng điền đầy đủ thông tin');
      return;
    } else {
      if (inputPassword.length < 7) {
        setNoticeForm('Mật khẩu phải lớn hơn hoặc bằng 7 ký tự');
        return;
      }
      else {
        if (inputPassword !== inputRePassword) {
          setNoticeForm('Mật khẩu nhập lại không khớp');
          return;
        } else {
          if (!inputEmail.includes('@')) {
            setNoticeForm('Email không đúng định dạng');
            return;
          } else {
            CallAPI('auth/signup', 'POST', {
              username: inputUsername,
              name: inputName,
              email: inputEmail,
              password: inputPassword
            }).then(res => {
              if (res.data.err) {
                setNoticeForm(res.data.err);
              }
              else {
                setNoticeForm(res.data);
                setInputUsername('');
                setInputPassword('');
                setInputRePassword('');
                setInputName('');
                setInputEmail('');
              }
            }).catch(error => {
              setNoticeForm('Đăng ký thất bại');
            })

          }
        }
      }
    }
  }
  if (isLogin) return <Redirect to='/' />
  return (
    <>
      <Header />
      <div>
        <Form className="mainSignUp">
          <h5 className='labelInput'>Đăng ký</h5>
          <div className="noticeSignUp">{noticeForm}</div>
          <Form.Group controlId="name">
            <Form.Label className='labelInput'>Họ tên</Form.Label>
            <Form.Control onChange={onChangeName} value={inputName} type="text" placeholder="Enter your Name" className="input" />
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label className='labelInput'>Email</Form.Label>
            <Form.Control onChange={onChangeEmail} value={inputEmail} type="text" placeholder="Enter your Email" className="input" />
          </Form.Group>
          <Form.Group controlId="username">
            <Form.Label className='labelInput'>Tên tài khoản</Form.Label>
            <Form.Control onChange={onChangeUsername} value={inputUsername} type="text" placeholder="Enter your username" className="input" />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label className='labelInput'>Mật khẩu</Form.Label>
            <Form.Control onChange={onChangePassword} value={inputPassword} className="input" type="password" />
          </Form.Group>
          <Form.Group controlId="repassword">
            <Form.Label className='labelInput'>Nhập lại mật khẩu</Form.Label>
            <Form.Control onChange={onChangeRePassword} value={inputRePassword} className="input" type="password" />
          </Form.Group>
          <div className="registerButtonContainer">
            <Button onClick={onRegister} id="signup" className='btnPageRegister' type="button">
              Đăng ký</Button>
          </div>
        </Form>
      </div>
    </>
  )
}
export default SignUp;