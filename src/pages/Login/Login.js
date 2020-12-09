import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import FacebookLogin from 'react-facebook-login';
import { GoogleLogin } from 'react-google-login';

import './styles.css';
import { LoginContext } from '../../context/LoginContext';
import CallAPI from './../../utils/CallAPI';


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
                    setNoticeForm("Mat khau phai >= 7 ky tu");
                    return;
                }
                else {
                    try {
                        CallAPI('auth/login', 'POST', {
                            username: inputUsername,
                            password: inputPassword
                        }).then(res => {
                            handleLogin(res.data.access_token);
                            setNoticeForm('Đăng nhập thành công');
                        }).catch(err => setNoticeForm('Mật khẩu sai'))
                    } catch (error) {
                        console.log("Error: " + error.message);
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
        console.log(response);
        try {
            CallAPI('auth/facebook', 'POST', {
                access_token: response.accessToken,
                userID: response.userID
            }).then(res => {
                handleLogin(res.data.access_token);
                setNoticeForm('Đăng nhập thành công');
            }).catch(err => setNoticeForm('Login with Facebook fail'))
        } catch (error) {
            console.log("Error: " + error.message);
            setNoticeForm('Xảy ra lỗi khi đăng nhập, vui lòng thử lại sau');
        }
    }
    const responseGoogle = (response) => {
        console.log('reponse: ' + response);
        try {
            CallAPI('auth/google', 'POST', {
                access_token: response.tokenId,
            }).then(res => {
                handleLogin(res.data.access_token);
                setNoticeForm('Đăng nhập thành công');
            }).catch(err => setNoticeForm('Login with Google fail'));
        }
        catch (error) {
            console.log("Error: " + error.message);
            setNoticeForm('Xảy ra lỗi khi đăng nhập, vui lòng thử lại sau');
        }
    }

    if (isLogin) return <Redirect to='/' />
    return (
        <Form className="mainLogin">
            <h5 style={{ color: 'blue' }}>Đăng nhập</h5>
            <Form.Group controlId="username">
                <Form.Label >Username</Form.Label>
                <Form.Control onChange={onChangeUsername} value={inputUsername} type="text" placeholder="Enter your username" className="input" />
            </Form.Group>
            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control onChange={onChangePassword} value={inputPassword} className="input" type="password" placeholder="Enter your password" onKeyPress={handleOnKeyPress} />
            </Form.Group>
            <Form.Group className="cbSavePass" controlId="savepassword">
                <Form.Check type="checkbox" label="Lưu mật khẩu" />
            </Form.Group>
            <div className="notice">{noticeForm}</div>
            <div className="submit">
                <Button href='/signup' id="signup" variant="primary" type="button">
                    Đăng ký</Button>
                <Button onClick={onLogin} id="signin" variant="primary" type="button">
                    Đăng nhập</Button>
            </div>
            <div className="buttonSignInGG">
                <FacebookLogin
                    appId="383205282732112"
                    autoLoad={false}
                    callback={responseFacebook}
                    cssClass="my-facebook-button-class"
                    icon="fa-facebook"
                    render={renderProps => (
                        <Button
                            variant="secondary" onClick={renderProps.onClick}>Login with Facebook</Button>
                    )}

                />
                <GoogleLogin
                    clientId="240672023608-4f2866cjcr4a85balfitk2eadkc7f4kc.apps.googleusercontent.com"
                    onSuccess={responseGoogle}
                    isSignedIn={false}
                    buttonText="Login with google"
                />
            </div>
        </Form>
    )
}

export default Login;