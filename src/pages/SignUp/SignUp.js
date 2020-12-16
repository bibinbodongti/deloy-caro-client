import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import { LoginContext } from '../../context/LoginContext';
import CallAPI from './../../utils/CallAPI'
import './styles.css';

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
            setNoticeForm('Không điền full dữ liệu');
            return;
        } else {
            if (inputPassword.length < 7) {
                setNoticeForm('Mat khau phai >= 7 ky tu');
                return;
            }
            else {
                if (inputPassword !== inputRePassword) {
                    setNoticeForm('Mat khau nhap lai khong giong mat khau');
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
                            setNoticeForm('Register success');
                            setInputUsername('');
                            setInputPassword('');
                            setInputRePassword('');
                            setInputName('');
                            setInputEmail('');
                        }).catch(error => {
                            setNoticeForm('Register fail');

                        })

                    }
                }
            }
        }
    }
    if (isLogin) return <Redirect to='/' />
    return (
        <div>
            <Form className="mainLogin">
                <h5 style={{ color: 'blue' }}>Register</h5>
                <Form.Group controlId="name">
                    <Form.Label >Name</Form.Label>
                    <Form.Control onChange={onChangeName} value={inputName} type="text" placeholder="Enter your Name" className="input" />
                </Form.Group>
                <Form.Group controlId="email">
                    <Form.Label >Email</Form.Label>
                    <Form.Control onChange={onChangeEmail} value={inputEmail} type="text" placeholder="Enter your Email" className="input" />
                </Form.Group>
                <Form.Group controlId="username">
                    <Form.Label >Username</Form.Label>
                    <Form.Control onChange={onChangeUsername} value={inputUsername} type="text" placeholder="Enter your username" className="input" />
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control onChange={onChangePassword} value={inputPassword} className="input" type="password" />
                </Form.Group>
                <Form.Group controlId="repassword">
                    <Form.Label>Retype Password</Form.Label>
                    <Form.Control onChange={onChangeRePassword} value={inputRePassword} className="input" type="password" />
                </Form.Group>
                <div className="notice">{noticeForm}</div>
                <div className="register">
                    <Button onClick={onRegister} id="signup" variant="primary" type="button">
                        Register</Button>
                </div>
            </Form>
        </div>
    )
}
export default SignUp;