import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../src/tools/setAuthToken';
import { setCurrentUser, logoutUser } from './ducks/actions/authActions';
import store from '../src/ducks/store';
import Navbar from './components/Navbar'
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Footer from './components/Footer';
import './style.css'

// check for token
if(localStorage.jwtToken) {
  // Set auth token
  setAuthToken(localStorage.jwtToken);
  // Decode and get user info
  const decoded = jwt_decode(localStorage.jwtToken);
  // Now set user
  store.dispatch(setCurrentUser(decoded));

  // check for expired token
  const currentTime = Date.now() / 1000;
  if(decoded.exp < currentTime) {
    store.dispatch(logoutUser());

    // redirect
    window.location.href="/login";
  }
}
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route path="/" exact component={Landing}/>
              <div>
                <Route path="/register" component={Register}/>
                <Route path="/login" component={Login}/>
              </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
