import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useParams } from "react-router-dom";
import Authorization from '../../utils/callAuth';
import CallAuthAPI from '../../utils/CallAuthAPI';

import './styles.css';
import Header from './../../components/Header/Header'

const ResetPassword = () => {
  const { token } = useParams();
  const [isPermission, setIsPermission] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [reNewPassword, setReNewPassword] = useState('');
  const [noticeForm, setNoticeForm] = useState('');
  const [errorAccess, setErrorAccess] = useState('');

  useEffect(() => {
    Authorization('auth/checktokenresetpassword', token).then((res) => {
      if (res.data.id) setIsPermission(true);
      else setErrorAccess('Truy cập không hợp lệ. Vui lòng kiểm tra lại!');
    })
      .then((err) => setErrorAccess('Truy cập không hợp lệ. Vui lòng kiểm tra lại!'));
  }, [token])
  const onReset = () => {
    if (newPassword.length < 7) {
      setNoticeForm('Mật khẩu phải có độ dài lớn hơn hoặc bẳng 7');
      return;
    }
    if (newPassword !== reNewPassword) {
      setNoticeForm('Mật khẩu mới và nhập lại mật khẩu mới không trùng khớp với nhau');
      return;
    }
    CallAuthAPI('auth/resetpassword', 'POST', {
      newPassword: newPassword,
    }, token)
      .then(res => {
        if (res.data) {
          setNoticeForm('Làm mới mật khẩu thành công. Đăng nhập để tiếp tục trải nghiệm ứng dụng!');
          setNewPassword('');
          setReNewPassword('');
        }
        else {
          setNoticeForm('Xảy ra lỗi. Vui lòng thử lại sau!');
        }
      })
  }

  const onChangeNewPassword = (e) => {
    setNewPassword(e.target.value);
  }

  const onChangeReNewPassword = (e) => {
    setReNewPassword(e.target.value);
  }

  return (
    <>
      <Header />
      <Form className="resetPasswordContainer">
        {
          isPermission ? (<>
            <h5 className='labelInputResetPassword'>Làm mới mật khẩu</h5>
            <div className="noticeResetPassword">{noticeForm}</div>
            <Form.Group controlId="password">
              <Form.Label className='labelInput'>Mật khẩu mới</Form.Label>
              <Form.Control onChange={onChangeNewPassword} value={newPassword} type="password" className="inputResetPassword" />
            </Form.Group>
            <Form.Group controlId="repassword">
              <Form.Label className='labelInput'>Nhập lại mật khẩu mới</Form.Label>
              <Form.Control onChange={onChangeReNewPassword} value={reNewPassword} className="inputResetPassword" type="password" />
            </Form.Group>
            <div className='submitResetPassword'>
              <Button className='btnPageResetPassword' onClick={onReset} id="signin" type="button">
                Làm mới</Button>
            </div>
          </>) : <div className="noticeResetPassword">{errorAccess}</div>
        }
      </Form>
    </>
  )
}
export default ResetPassword;