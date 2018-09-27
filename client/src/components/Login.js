import React, { Component } from 'react'

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: ''
    }
  }

  handleInputs = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onSubmit = (e) => {
    e.preventDefault();
    let loginUser = {
      email: this.state.email,
      password: this.state.password
    }

    console.log(loginUser)
  }

  render() {
    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">Sign in to your DevConnector account</p>
              <form action="dashboard.html" onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input 
                    type="email" 
                    className="form-control form-control-lg" 
                    placeholder="Email Address" 
                    name="email"
                    value={this.state.email}
                    onChange={this.handleInputs}
                />
                </div>
                <div className="form-group">
                  <input 
                    type="password" 
                    className="form-control form-control-lg" 
                    placeholder="Password" name="password"
                    value={this.state.password}
                    onChange={this.handleInputs}
                  />
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}




export default Login