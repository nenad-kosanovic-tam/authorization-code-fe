import React, {Component} from 'react';
import {Route, Routes} from "react-router-dom";
import {Login} from "./containers/Login";

class App extends Component {
  render() {
    return (
        <Routes>
          <Route path="/" element={<Login code={window.location.search.replace('?code=', '')}/>} />
          <Route path="login"  element={<Login code={window.location.search.replace('?code=', '')}/>} />
        </Routes>
    );
  }
}

export default App;
