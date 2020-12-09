import React, { useState, createContext } from 'react';
import io from "socket.io-client";

import Authorization from './../utils/callAuth'
import * as Config from './../constant/config'

export const LoginContext = createContext();
export const SocketContext = createContext();

const socket = io(Config.API_URL);

export const LoginProvider = props => {
    const [isLogin, setIsLogin] = useState(false);

    React.useEffect(() => {
        Authorization('auth/profile', JSON.parse(localStorage.getItem('id_token')))
            .then(res => {
                socket.emit('msgToServerOnline', res.data.id)
                setIsLogin(true);
            })
            .catch(err => { setIsLogin(false) })
    }, [])

    const handleLogin = (token) => {
        Authorization('auth/profile', token)
            .then(res => {
                socket.emit('msgToServerOnline', res.data.id)
                setIsLogin(true);
            })
            .catch(err => { setIsLogin(false) })
        localStorage.setItem('id_token', JSON.stringify(token));
    }
    
    const handleLogout = async () => {
        setIsLogin(false);
        Authorization('auth/profile', JSON.parse(localStorage.getItem('id_token')))
            .then(res => {
                socket.emit('msgToServerLogout', res.data.id);
                localStorage.removeItem("id_token");
            })
            .catch(err => { setIsLogin(false) })
    }
    return (
        <LoginContext.Provider value={[isLogin, handleLogin, handleLogout]}>
            <SocketContext.Provider value={socket}>
                {props.children}
            </SocketContext.Provider>
        </LoginContext.Provider>
    )
}