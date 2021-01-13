import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useParams } from "react-router-dom";
import Authorization from '../../utils/callAuth';
import CallAuthAPI from '../../utils/CallAuthAPI';

import './styles.css';
import Header from './../../components/Header/Header'


const ChangePassword = () => {
  const [isPermission, setIsPermission] = useState(false);
  const [oldPassword,setOldPassword]=useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reNewPassword, setReNewPassword] = useState('');
  const [noticeForm, setNoticeForm] = useState('');
  const [errorAccess,setErrorAccess]=useState('');

  useEffect(() => {
    Authorization('auth/profile', JSON.parse(localStorage.getItem('id_token'))).then((res) => {
      if (res.data.id) setIsPermission(true);
      else setErrorAccess('Truy cập không hợp lệ. Vui lòng kiểm tra lại!');
    })
      .then((err) => setErrorAccess('Truy cập không hợp lệ. Vui lòng kiểm tra lại!'));
  }, [])
  const onReset = () => {
    if(newPassword.length<7){
      setNoticeForm('Mật khẩu mới phải có độ dài lớn hơn hoặc bẳng 7');
      return;
    }
    if(newPassword!==reNewPassword){
      setNoticeForm('Mật khẩu mới và nhập lại mật khẩu mới không trùng khớp với nhau');
      return;
    }
    CallAuthAPI('users/changepassword', 'POST', {
      oldPassword: oldPassword,
      newPassword: newPassword,
    },JSON.parse(localStorage.getItem('id_token')))
      .then(res => {
        if(res.data){
          setNoticeForm('Đổi mật khẩu thành công');
          setOldPassword('');
          setNewPassword('');
          setReNewPassword('');
        }
        else{
          setNoticeForm('Đổi mật khẩu thất bại, vui lòng kiểm tra lại');
        }
      })
  }

  const onChangeOldPassword = (e) => {
    setOldPassword(e.target.value);
  }

  const onChangeNewPassword = (e) => {
    setNewPassword(e.target.value);
  }

  const onChangeReNewPassword = (e) => {
    setReNewPassword(e.target.value);
  }

  return (
    <>
    <Header></Header>
      <Form className="resetPasswordContainer">
        {
          isPermission ? (<>
            <h5 className='labelInputResetPassword'>Đổi mật khẩu</h5>
            <div className="noticeResetPassword">{noticeForm}</div>
            <Form.Group controlId="oldpassword">
              <Form.Label className='labelInput'>Mật khẩu cũ</Form.Label>
              <Form.Control onChange={onChangeOldPassword} value={oldPassword} type="password" className="inputResetPassword" />
            </Form.Group>
            <Form.Group controlId="newpassword">
              <Form.Label className='labelInput'>Mật khẩu mới</Form.Label>
              <Form.Control onChange={onChangeNewPassword} value={newPassword} type="password" className="inputResetPassword" />
            </Form.Group>
            <Form.Group controlId="repassword">
              <Form.Label className='labelInput'>Nhập lại mật khẩu mới</Form.Label>
              <Form.Control onChange={onChangeReNewPassword} value={reNewPassword} className="inputResetPassword" type="password" />
            </Form.Group>
            <div className='submitResetPassword'>
              <Button className='btnPageResetPassword' onClick={onReset} id="signin" type="button">
                Xác nhận</Button>
            </div>
          </>) : <div className="noticeResetPassword">{errorAccess}</div>
        }
      </Form>
    </>
  )
}
export default ChangePassword;