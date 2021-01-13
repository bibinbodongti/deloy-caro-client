import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Redirect, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import FacebookLogin from 'react-facebook-login';
import { GoogleLogin } from 'react-google-login';
import FacebookIcon from '../../components/Icons/FacebookIcon';


import './styles.css';
import { LoginContext } from '../../context/LoginContext';
import CallAPI from './../../utils/CallAPI';
import Header from './../../components/Header/Header'

const Login = () => {
    const [isLogin, handleLogin] = useContext(LoginContext);
    const [inputUsername, setInputUsername] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [noticeForm, setNoticeForm] = useState('');

    const onChangeUsername = (e) => {
        setInputUsername(e.target.value);
    }
    const onChangePassword = (e) => {
        setInputPassword(e.target.value);
    }
    const onLogin = async () => {
        if (inputUsername === '') {
            setNoticeForm("Vui lòng điền username");
            return;
        }
        else {
            if (inputPassword === '') {
                setNoticeForm("Vui lòng điền mật khẩu");
                return;
            }
            else {
                if (inputPassword.length < 7) {
                    setNoticeForm("Mật khẩu phải lớn hơn hoặc bằng 7 ký tự");
                    return;
                }
                else {
                    try {
                        CallAPI('auth/login', 'POST', {
                            username: inputUsername,
                            password: inputPassword
                        }).then(res => {
                            if (res.data.access_token) {
                                handleLogin(res.data.access_token);
                                setNoticeForm('Đăng nhập thành công');
                            }
                            else {
                                if (res.data.err) setNoticeForm(res.data.err);
                            }
                        }).catch(err => setNoticeForm('Mật khẩu sai, vui lòng kiểm tra lại'));
                    } catch (error) {
                        setNoticeForm('Xảy ra lỗi khi đăng nhập, vui lòng thử lại sau');
                    }
                }
            }
        }
    }
    const handleOnKeyPress = (e) => {
        if (e.keyCode === 13) onLogin();
    }

    const responseFacebook = (response) => {
        try {
            CallAPI('auth/facebook', 'POST', {
                access_token: response.accessToken,
                userID: response.userID
            }).then(res => {
                handleLogin(res.data.access_token);
                setNoticeForm('Đăng nhập thành công');
            }).catch(err => setNoticeForm('Login with Facebook fail'))
        } catch (error) {
            setNoticeForm('Xảy ra lỗi khi đăng nhập, vui lòng thử lại sau');
        }
    }
    const responseGoogle = (response) => {
        try {
            CallAPI('auth/google', 'POST', {
                access_token: response.tokenId,
            }).then(res => {
                handleLogin(res.data.access_token);
                setNoticeForm('Đăng nhập thành công');
            }).catch(err => setNoticeForm('Login with Google fail'));
        }
        catch (error) {
            setNoticeForm('Xảy ra lỗi khi đăng nhập, vui lòng thử lại sau');
        }
    }
    const facebookIcon = <div className='iconFb'><FacebookIcon /></div>;
    if (isLogin) return <Redirect to='/' />
    return (
        <>
        <Header/>
        <Form className="mainLogin">
            <h5 className='labelInput'>Đăng nhập</h5>
            <div className="noticeLogin">{noticeForm}</div>
            <Form.Group controlId="username">
                <Form.Label className='labelInput'>Username</Form.Label>
                <Form.Control onChange={onChangeUsername} value={inputUsername} type="text" placeholder="Enter your username" className="input" />
            </Form.Group>
            <Form.Group controlId="password">
                <Form.Label className='labelInput'>Password</Form.Label>
                <Form.Control onChange={onChangePassword} value={inputPassword} className="input" type="password" placeholder="Enter your password" onKeyPress={handleOnKeyPress} />
            </Form.Group>
            {/* <Form.Group className="cbSavePass" controlId="savepassword">
                <Form.Link to='/forgetpassword'/>
            </Form.Group> */}
            <Link to='/forgetpassword'><div className="noticeLogin">Quên mật khẩu?</div></Link>

            <div className="submit">
                <Button className='btnPageLogin' href='/signup' id="signup" type="button">
                    Đăng ký</Button>
                <Button className='btnPageLogin' onClick={onLogin} id="signin" type="button">
                    Đăng nhập</Button>
            </div>
            <div className="buttonSignInGGFBContainer">
                <FacebookLogin
                    appId="383205282732112"
                    autoLoad={false}
                    cssClass='btnLoginWithFacebook'
                    callback={responseFacebook}
                    icon={facebookIcon}
                    textButton="Đăng nhập với Facebook"
                />
                <GoogleLogin
                    className='btnLoginWithGoogle'
                    clientId="240672023608-4f2866cjcr4a85balfitk2eadkc7f4kc.apps.googleusercontent.com"
                    onSuccess={responseGoogle}
                    isSignedIn={false}
                    buttonText="Đăng nhập với Google"
                />
            </div>
        </Form>
        </>
    )
}

export default Login;