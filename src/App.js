import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.css';
import routes from './routes';
import Header from './components/Header/Header';
import {LoginProvider} from './context/LoginContext';

const showContentMenus = (routes) => {
  let result = null;
  if (routes.length > 0) {
    result = routes.map((route, index) => {
      return <Route
        key={index}
        path={route.path}
        exact={route.exact}
        component={route.main}
      />
    })
  }
  return result;
}
function App() {
  return (
    <Router>
      <LoginProvider>
      <div className='App-container'>
        <Header/>
        {
            <Switch>
              {showContentMenus(routes)}
            </Switch>
        }
      </div>
      </LoginProvider>
    </Router >
  );
}

export default App;
