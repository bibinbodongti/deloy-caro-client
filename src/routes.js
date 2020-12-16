import React from 'react';
import Game from './pages/Game';

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import History from './pages/History/index'

const routes = [
    {
        path: process.env.PUBLIC_URL + '/',
        exact: true,
        main: () => <Home />
    },
    {
        path: process.env.PUBLIC_URL + '/login',
        exact: true,
        main: () => <Login />
    },

    {
        path: process.env.PUBLIC_URL + '/signup',
        exact: true,
        main: () => <SignUp />
    },
    {
        path: process.env.PUBLIC_URL + '/history',
        exact: true,
        main: () => <History />
    },
    {
        path: process.env.PUBLIC_URL + '/room/:id',
        exact: true,
        main: () => <Game />
    },

]
export default routes;