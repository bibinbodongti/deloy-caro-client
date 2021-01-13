import React, { useState, createContext } from 'react';
import {  msgOnline, msgLogout } from './Socket'
export const LoginContext = createContext();
export const SocketContext = createContext();


export const LoginProvider = props => {
    const [isLogin, setIsLogin] = useState(false);

    React.useEffect(() => {
        msgOnline(setIsLogin)
    }, [])

    const handleLogin = (token) => {
        localStorage.setItem('id_token', JSON.stringify(token));
        msgOnline(setIsLogin)
    }

    const handleLogout = async () => {
        msgLogout(setIsLogin)
    }
    return (
        <LoginContext.Provider value={[isLogin, handleLogin, handleLogout]}>
                {props.children}
        </LoginContext.Provider>
    )
}