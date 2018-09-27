import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from '../src/ducks/store';
import Navbar from './components/Navbar'
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Footer from './components/Footer';
import './style.css'



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
