import React from 'react';

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';

const routes=[
    {
        path: process.env.PUBLIC_URL+'/login',
        exact: true,
        main: () => <Login />
    },
    {
        path: process.env.PUBLIC_URL+'/signup',
        exact: true,
        main: () => <SignUp />
    },
    {
        path: process.env.PUBLIC_URL+'/',
        exact: false,
        main: () => <Home />
    },  
]
export default routes;