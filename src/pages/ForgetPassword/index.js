import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

import './styles.css';
import callApi from '../../utils/CallAPI';
import Header from './../../components/Header/Header'

const ForgetPassword = () => {
  const [input, setInput] = useState('');
  const [noticeForm, setNoticeForm] = useState('');
  const onChangeInput = (e) => {
    setInput(e.target.value);
  }
  const onSubmit = () => {
    if (!input) {
      setNoticeForm('Vui lòng nhập email để thực hiện tìm tài khoản');
      return;
    }
    if (/^\s*$/.test(input) || !input.includes('@')) {
      setNoticeForm('Email nhập vào không hợp lệ');
      return;
    }
    
    callApi('auth/forgetpassword', 'POST', { email: input }).then((res) => {
      if (res.data.err) {
        setNoticeForm(res.data.err);
      } else {
        setNoticeForm(res.data);
      }
    })
  }
  return (
    <>
    <Header></Header>
      <Form className='forgetPasswordContainer'>
        <h5 className='labelInputPageForgetPassword'>Tìm tài khoản của bạn</h5>
        <div className="noticeForgetPassword">{noticeForm}</div>
        <Form.Group controlId="email" className='forgetPasswordContent'>
          <Form.Control className="inputPageForgetPassword" onChange={onChangeInput} value={input} type="text" placeholder="Nhập vào email bạn sử dụng để đăng ký tài khoản" />
          <Button className='btnPageForgetPassword' onClick={onSubmit} id="findAccount" type="button">
            Tìm</Button>
        </Form.Group>
      </Form>
    </>
  )
}

export default ForgetPassword;