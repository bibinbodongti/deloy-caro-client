import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { LoginContext } from '../../context/LoginContext';
import './styles.css';
import EmptyUserImage from './EmptyUserImage';
import { Redirect, Link } from 'react-router-dom';
import callAuthAPI from '../../utils/CallAuthAPI';
import { convertDateToStringV2 } from '../../service/date';
import getfile from './ImportImage';
import Header from './../../components/Header/Header'

// //config datetime
// const moment = require('moment');
// moment.locale('vi');


const Profile = () => {
  const [isLogin] = useContext(LoginContext);
  const [login, setLogin] = useState({
    state: false,
    isLogin: false,
  });
  const [fileImage, setFileImage] = useState(null);
  const [sourceImage, setSourceImage] = useState(null);
  const [notice, setNotice] = useState('');
  const [refesh, setRefesh] = useState(true);
  const [isLoad, setIsLoad] = useState(false);
  const [account, setAccount] = useState({});
  useEffect(() => {
    callAuthAPI('information', 'GET', {
    }, JSON.parse(localStorage.getItem('id_token')))
      .then(res => {
        console.log(res.data);
        setAccount(res.data);
        setLogin({
          state: true,
          isLogin: true,
        })
      })
      .catch((err) => setLogin({
        state: true,
        isLogin: false,
      }))
  }, [isLogin, refesh]);
  const getFile = (e) => {
    console.log(e.target.files);
    console.log(e.target.files[0].type);
    if (e.target.files[0].size > 5242880) {
      console.log('Dung lượng file không được lớn hơn 2MB');
      setNotice('Dung lượng file không được lớn hơn 2MB');
      setSourceImage(null);
      setFileImage(null);
      return;
    }
    if (e.target.files[0].type !== 'image/png' && e.target.files[0].type !== 'image/gif' && e.target.files[0].type !== 'image/jpeg' && e.target.files[0].type !== 'image/pjpeg') {
      console.log('File phải là file hình ảnh');
      setNotice('File phải là file hình ảnh');
      setSourceImage(null);
      setFileImage(null);
      return;
    }
    setFileImage(e.target.files);
    var reader = new FileReader();
    reader.onload = function () {
      setSourceImage(reader.result);
      setNotice('');
    }
    reader.readAsDataURL(e.target.files[0]);
  }
  const UploadImg = async () => {
    setNotice('');
    const linkImage = await getfile(fileImage, setIsLoad, setSourceImage);
    if (linkImage) {
      var bodyFormData = new FormData();
      bodyFormData.append('fileimg', linkImage);
      callAuthAPI('users/uploadavt', 'POST', {
        linkImage: linkImage,
      }, JSON.parse(localStorage.getItem('id_token')))
        .then(res => {
          console.log(res.data);
          setRefesh(!refesh);
          setNotice('Tải lên thành công');
        })
        .catch((err) => { })
    }
  }
  if (login.state) if (!login.isLogin) return <Redirect to='/login' />
  return (
    <>
      <Header />
      <Form className="profileContainer">
        {
          login.isLogin ? (
            <>
              <h5 className='titleProfile'>Thông tin cá nhân</h5>
              <div className='bodyProfile'>
                <div className='profileImage'>
                  {
                    account ? sourceImage ? <img height='300px' width='300px' src={sourceImage} alt="Đang load"></img> : account.image ? <img height='300px' width='300px' src={account.image} alt="Đang load"></img>
                      : <div className='profileImageContainer'>
                        <EmptyUserImage />
                      </div>
                      : <div className='profileImageContainer'>
                        <EmptyUserImage />
                      </div>
                  }
                  <h5 className='labelUploadImage'>Upload ảnh</h5>
                  <input id="photo" type="file" className='uploadImage' name="mainimage" onChange={getFile} />
                  {
                    isLoad ? <ProgressBar animated className='progessBar' now={99} label={`${99}%`} /> : null
                  }
                  {
                    sourceImage ? <Button className='btnPageProfile' onClick={UploadImg}>Tải ảnh lên</Button> : null
                  }
                  {
                    notice !== '' ? <div className='noticeProfile'>{notice}</div> : null
                  }

                </div>
                <div className='profileInformation'>
                  <Form.Group controlId="username">
                    <Form.Label className='labelInput'>Tên tài khoản</Form.Label>
                    <Form.Control readOnly={true} value={account ? account.username : ''} type="text" placeholder="Loading your username..." className="input" />
                  </Form.Group>
                  <Form.Group controlId="name">
                    <Form.Label className='labelInput'>Họ Tên</Form.Label>
                    <Form.Control readOnly={true} value={account ? account.name : ''} className="input" placeholder="Loading your name..." />
                  </Form.Group>
                  <Form.Group controlId="email">
                    <Form.Label className='labelInput'>Email</Form.Label>
                    <Form.Control readOnly={true} value={account ? account.email : ''} className="input" placeholder="Loading your email..." />
                  </Form.Group>
                  <Form.Group controlId="dateCreate">
                    <Form.Label className='labelInput'>Ngày tham gia</Form.Label>
                    <Form.Control readOnly={true} value={convertDateToStringV2(account ? account.dateCreate : '')} className="input" placeholder="Loading your date Created..." />
                  </Form.Group>
                </div>
                <div className='achievement'>
                  <Form.Group controlId="countMatch">
                    <Form.Label className='labelInput'>Số trận đã chơi</Form.Label>
                    <Form.Control readOnly={true} value={account ? account.countMatch : ''} className="input" placeholder="Loading your count Match..." required={true} />
                  </Form.Group>
                  <Form.Group controlId="countCup">
                    <Form.Label className='labelInput'>Số cup</Form.Label>
                    <Form.Control readOnly={true} value={account ? account.cup : ''} className="input" placeholder="Loading your count Cup..." required={true} />
                  </Form.Group>
                  <Form.Group controlId="winRatio">
                    <Form.Label className='labelInput'>Tỷ lệ thắng</Form.Label>
                    <Form.Control readOnly={true} value={account ? account.winRatio : ''} className="input" placeholder="Loading your win ratio..." required={true} />
                  </Form.Group>
                  <Form.Group controlId="rank">
                    <Form.Label className='labelInput'>Cấp bậc</Form.Label>
                    <Form.Control readOnly={true} value={account ? account.rank : ''} className="input" placeholder="Loading your rank..." required={true} />
                  </Form.Group>
                  <Link to='/changepassword'><Button className='btnPageProfile'>Đổi mật khẩu</Button></Link>
                </div>
              </div>
            </>
          ) : null
        }
      </Form>
    </>
  )
}
export default Profile;