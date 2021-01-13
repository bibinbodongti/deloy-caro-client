import React, { useEffect, useState } from 'react';

import callApi from '../../utils/CallAPI';
import { useParams, Link } from "react-router-dom";
import './styles.css';
import Header from './../../components/Header/Header'


const ActiveAccount = () => {
  const { token } = useParams();
  const [notice, setNotice] = useState('Đang kiểm tra để kích hoạt tài khoản, vui lòng đừng thoát ra');
  useEffect(() => {
    callApi(`users/active/${token}`, 'GET', {}).then((res) => {
      if (res.data.err) setNotice(res.data.err);
      else setNotice(res.data);
    })
  }, [token])
  return (
    <>
      <Header></Header>
      <div className='acticeAccountContainer'>
        <h1>Kích hoạt tài khoản</h1>
        <div>{notice}</div>
        <div><Link to='/login' className='loginContinue'>Đăng nhập</Link> để tiếp tục trải nghiệm ứng dụng.</div>
      </div>
    </>
  )
}
export default ActiveAccount;