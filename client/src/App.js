import React from 'react';
import './App.css';
import Signup from "./components/Signup"
import LoggedIn from "./LoggedIn"
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
          <Switch>
            <Route path="/" exact component={LoggedIn}/>
            <Route path="/search" exact component={LoggedIn}/>
            <Route path="/chat" exact component={LoggedIn}/>
            <Route path="/news" exact component={LoggedIn}/>
            <Route path="/home" exact component={LoggedIn}/>
            <Route path="/profile" exact component={LoggedIn}/>
            <Route path="/signup" component={Signup}/>
          </Switch>
      </BrowserRouter>
  );
}

export default App;
