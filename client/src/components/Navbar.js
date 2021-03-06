import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../ducks/actions/authActions';

class Navbar extends Component {
  logOut = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  }
  render() {
    const { isAuthenticated } = this.props.auth
    const authLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <a onClick={this.logOut} className="nav-link">Logout</a>
        </li>
      </ul>
    )

    const guestLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link to="/register" className="nav-link">Sign Up</Link>
        </li>
        <li className="nav-item">
          <Link to="/login" className="nav-link">Login</Link>
        </li>
      </ul>
    )
    return (
          <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
    <div className="container">
      <Link to="/" className="navbar-brand">DevConnector</Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mobile-nav">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="mobile-nav">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to="/profiles" className="nav-link"> Developers
            </Link>
          </li>
        </ul>
        {isAuthenticated ? authLinks : guestLinks}
      </div>
    </div>
  </nav>
 
    )
  }
}

Navbar.prototypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
});


export default connect(mapStateToProps, { logoutUser })(Navbar)