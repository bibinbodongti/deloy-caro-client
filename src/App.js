import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.css';
import routes from './routes';
import { LoginProvider } from './context/LoginContext';

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
    <div >
 <div className='App-container ' >  
    <Router>
      <LoginProvider>
        {
          <Switch>
            {showContentMenus(routes)}
          </Switch>
        }
      </LoginProvider>
    </Router >
    </div>

    </div>
   
  );
}

export default App;
