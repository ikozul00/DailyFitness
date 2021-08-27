
import React, { useState } from 'react';
import './styles/login.css';
import logoImage from './images/logo.png';
import axios from 'axios';
import {Link, useHistory} from 'react-router-dom';

function LoginPage(props){
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [formErrors,setFormErrors] = useState("");
    let formValid=true;
    let history=useHistory();

       //controling username field
    function handleChangeUsername(event) {
        setUsername(event.target.value);
    }

     //controling password field
     function handleChangePassword(event) {
        setPassword(event.target.value);
      }

    //checking if username and password fields are empty
    function validateLogin(){
        if(username.length===0&&password.length===0){
            setFormErrors("Please enter your username and password!");
            formValid=false;
        }
        else if(username.length===0){
            setFormErrors("Please enter your username!");
            formValid=false;
        }
        else if(password.length===0){
            setFormErrors("Please enter your password!");
            formValid=false;
        }
        else{
            formValid=true;
        }
    }

    //checking user data
   function handleLogin(event){
        event.preventDefault();
        validateLogin();
        if(formValid){
            axios.post('/api/login', {name:username,password:password})
            .then(response => {
                if(response.data.correct){
                    sessionStorage.setItem('username', username);
                    history.push("/home");
                }
                else{
                    setFormErrors("Incorrect username or password!");
                }
            },
            (error) => {
                console.log(error);});
        }
    }

                return(
                    <div class="container">
                        <div className="logoContainer">
                        <img src={logoImage} alt="logo" className="logoImage"></img>
                        </div>
                    <div class="formContainer">
                        <form id="loginForm" onSubmit={handleLogin}>
                        <h1>Login</h1>
                        <label for="username" class="form-labels">Username: </label>
                        <br/>
                            <input type="text" value={username} id="usename" name="username" placeholder="Enter Username" onChange={handleChangeUsername}/>
                        <br/>
                        <label class="form-labels" for="password">Password:</label>
                        <br/>
                            <input type="password" value={password} id="password" name="password" placeholder="Enter Password" onChange={handleChangePassword}/>
                        <br/>
                        <input type="submit" value="Login" class="loginButton"/>
                        <div>
                            <div class="bottom-container">
                                <p class="form-errors">{formErrors}</p>
                            <span class="register"> New here? <Link to="/registration" >Create an account</Link></span>
                        </div>
                        </div>
                        </form>
                        </div>
                    </div>
                );
}

export default LoginPage;