
import React from 'react';
import './styles/login.css';
import logoImage from './images/logo.png';
import axios from 'axios';

class LoginPage extends React.Component{
    constructor(props){
        super(props);
        this.state={
            username:"",
            password:"",
            formErrors: "",
        }

        var formValid=false;
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.validateLogin=this.validateLogin.bind(this);
        this.handleRegistrationLinkClick=this.handleRegistrationLinkClick.bind(this);
    }

    //controling password field
       handleChangePassword(event) {
         this.setState({password: event.target.value});
       }

       //controling username field
    handleChangeUsername(event) {
        this.setState({username: event.target.value});
    }

    //checking if username and password fields are empty
    validateLogin(){
        if(this.state.username.length===0&&this.state.password.length===0){
            this.setState({formErrors:"Please enter your username and password!"});
            this.formValid=false;
        }
        else if(this.state.username.length===0){
            this.setState({formErrors:"Please enter your username!"});
            this.formValid=false;
        }
        else if(this.state.password.length===0){
            this.setState({formErrors:"Please enter your password!"});
            this.formValid=false;
        }
        else{
            this.formValid=true;
        }
    }

    //checking user data
    handleLogin(event){
        event.preventDefault();
        this.validateLogin();
        if(this.formValid){
            axios.post('/api/login', {name:this.state.username,password:this.state.password})
            .then(response => {
                if(response.data.correct){
                    this.props.onPageChange("home");
                }
                else{
                    this.setState({formErrors:"Incorrect username or password!"});
                }
            },
            (error) => {
                console.log(error);});
        }
    }

    //opening registration form
    handleRegistrationLinkClick(event){
        console.log("pozvana");
        event.preventDefault();
        this.props.onPageChange("register");

    }

    render(){
                return(
                    <div class="container">
                        <div className="logoContainer">
                        <img src={logoImage} alt="logo" className="logoImage"></img>
                        </div>
                    <div class="formContainer">
                        <form id="loginForm" onSubmit={this.handleLogin}>
                        <h1>Login</h1>
                        <label for="username" class="form-labels">Username: </label>
                        <br/>
                            <input type="text" value={this.state.username} id="usename" name="username" placeholder="Enter Username" onChange={this.handleChangeUsername}/>
                        <br/>
                        <label class="form-labels" for="password">Password:</label>
                        <br/>
                            <input type="password" value={this.state.password} id="password" name="password" placeholder="Enter Password" onChange={this.handleChangePassword}/>
                        <br/>
                        <input type="submit" value="Login" class="loginButton"/>
                        <div>
                            <div class="bottom-container">
                                <p class="form-errors">{this.state.formErrors}</p>
                            <span class="register"> New here? <a href="javascript:void(0);" onClick={this.handleRegistrationLinkClick}>Create an account</a></span>
                        </div>
                        </div>
                        </form>
                        </div>
                    </div>
                );
            }
}

export default LoginPage;