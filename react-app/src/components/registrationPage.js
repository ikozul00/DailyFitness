import React from 'react';
import './styles/login.css';
import './styles/registration.css';
import logoImage from './images/logo.png';
class RegistrationPage extends React.Component{
    constructor(props){
        super(props);
        this.state={
            username:"",
            password:"",
            page:"first",
        }
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.continueClicked=this.continueClicked.bind(this);
        this.sumitClicked=this.sumitClicked.bind(this);
    }
    handleChangeUsername(event) {
        this.setState({username: event.target.value});
      }
      handleChangePassword(event) {
        this.setState({password: event.target.value});
      }
      continueClicked(){
        this.setState({page:"second"});
      }
      sumitClicked(){
          this.props.onRegistrationButtonClick("home");
      }
    render(){
        let registrationForm;
        if(this.state.page==="first"){
            registrationForm= <div class="registrationFormContainer">
            <form id="registrationForm">
            <h1>Register</h1>
             <label for="username" className="form-labels">Username: </label>
             <br/>
                <input type="text" value={this.state.username} id="usename" placeholder="Enter Username" onChange={this.handleChangeUsername}/>
            <br/>
            <label for="email" className="form-labels">Email address: </label>
             <br/>
                <input type="text" value={this.state.email} id="usename" placeholder="Enter Email" />
            <br/>
            <label className="form-labels" for="password">Password:</label>
            <br/>
                <input type="password" value={this.state.password} id="password" placeholder="Enter Password" onChange={this.handleChangePassword}/>
            <br/>
            <label className="form-labels" for="password-again">Repeat Password:</label>
            <br/>
                <input type="password" value={this.state.password} id="password-again" placeholder="Repeat Password" />
            <br/>
            <input type="sumit" value="Continue" className="loginButton" onClick={this.continueClicked}/>
            <div>
                <div class="bottom-container">
            <span class="register"> Already have an account? <a href="#">Sign In</a></span>
            </div>
            </div>
            </form>
            </div>
        }
        else{
            registrationForm= <div class="registrationFormContainer">
            <form id="registrationForm">
            <h1>Register</h1>
            <p className="description">Some optional info</p>
             <label for="weight" className="form-labels">Weight: </label>
             <br/>
                <input type="text"  id="weight" placeholder="Enter Your Weight"/>
            <br/>
            <label for="height" className="form-labels">Height: </label>
             <br/>
                <input type="text"  id="height" placeholder="Enter Your Height" />
            <br/>
            <label className="form-labels" for="age">Age:</label>
            <br/>
                <input type="text"  id="age" placeholder="Enter Your Age"/>
            <br/>
            <input type="sumit" value="Sumit" className="loginButton"  onClick={this.sumitClicked}/>
            <div>
                <div class="bottom-container">
            <span class="register"> Already have an account? <a href="#">Sign In</a></span>
            </div>
            </div>
            </form>
            </div>
        }
        return(
            <div className="registrationContainer">
                <img src={logoImage} alt="logo" className="logoImage"></img>
                {registrationForm};
            </div>
        );
    }
}

export default RegistrationPage;