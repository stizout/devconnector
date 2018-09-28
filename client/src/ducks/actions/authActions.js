import { GET_ERRORS, SET_CURRENT_USER } from './types';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthHeader from '../../tools/setAuthToken';
// Register User

export const registerUser = (userData, history) => dispatch => {
  axios.post('/api/users/register', userData).then(res => {
    history.push('/login');
  }).catch(err => dispatch({
    type: GET_ERRORS,
    payload: err.response.data
  }));
}

// Login User

export const loginUser = (userData) => dispatch => {
  axios.post('/api/users/login', userData).then(res => {
    const { token } = res.data
    // set token in localstorage
    localStorage.setItem('jwtToken', token);
    // set it into the authorization header
    setAuthHeader(token)
    // Now decode the token to get user data
    const decoded = jwt_decode(token);
    // Set current User
    dispatch(setCurrentUser(decoded));
  }).catch(err => dispatch({
    type: GET_ERRORS,
    payload: err.response.data
  }));
}

export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  }
}

// Log out

export const logoutUser = () => dispatch => {
  // remove token
  localStorage.removeItem('jwtToken');
  // remove auth header
  setAuthHeader(false);
  // set isAuthenticated and user in redux to false and empty
  dispatch(setCurrentUser({}));
}