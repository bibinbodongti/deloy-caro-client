import React from 'react';

import Game from './pages/Game';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import History from './pages/History/index'
import Profile from './pages/Profile/index';
import ForgetPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import ActiveAccount from './pages/ActiveAccount';
import GameHistory from './pages/HistoryGame/index'
import LeaderBoard from './pages/LeaderBoard';
import ChangePassword from './pages/ChangePassword';

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
        path: process.env.PUBLIC_URL + '/history/:id',
        exact: true,
        main: () => <GameHistory />
    },
    {
        path: process.env.PUBLIC_URL + '/room/:id',
        exact: true,
        main: () => <Game />
    },
    {
        path: process.env.PUBLIC_URL + '/profile',
        exact: true,
        main: () => <Profile />
    },
    {
        path: process.env.PUBLIC_URL + '/changepassword',
        exact: true,
        main: () => <ChangePassword />
    },
    {
        path: process.env.PUBLIC_URL + '/forgetpassword',
        exact: true,
        main: () => <ForgetPassword />
    },
    {
        path: process.env.PUBLIC_URL + '/resetpassword/:token',
        exact: true,
        main: () => <ResetPassword />
    },
    {
        path: process.env.PUBLIC_URL + '/active/:token',
        exact: true,
        main: () => <ActiveAccount />
    },
    {
        path: process.env.PUBLIC_URL + '/bangxephang',
        exact: true,
        main: () => <LeaderBoard />
    },

]
export default routes;