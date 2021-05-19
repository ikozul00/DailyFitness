import React from 'react';
import './styles/login.css';
import './styles/registration.css';
import logoImage from './images/logo.png';
import axios from 'axios';

class RegistrationPage extends React.Component{
    constructor(props){
        super(props);
        this.state={
            username:"",
            password:"",
            email:"",
            repeatPassword:"",
            weight:0,
            height:0,
            age:0,
            page:true,
            errorsUsername:"",
            errorsPassword:"",
            errorsEmail:"",
            errorsAge:"",
            validUsername:false,
            validPassword:false,
            validEmail:false,
            validAge:false,
            formErrors:"",
            formValid:false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.continueClicked=this.continueClicked.bind(this);
        this.backClicked=this.backClicked.bind(this);
        this.submitClicked=this.submitClicked.bind(this);
        this.handleLoginLinkClick=this.handleLoginLinkClick.bind(this);
        this.validation=this.validation.bind(this);
    }

    //handling input changes on all form fields while validating values
    handleChange(event) {
        this.setState({[event.target.name] : event.target.value});
        const name=event.target.name;
        const value=event.target.value;
        const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
        switch(name){
            case 'username':
                if(value.length<3){
                    this.setState({errorsUsername:"Username must be at least 3 characters long."});
                    this.setState({validUsername:false});
                }
                else{
                    this.setState({errorsUsername:""});
                    this.setState({validUsername:true});
                }
                break;
            case "password":
                if(value.length<8){
                    this.setState({errorsPassword:"Password must be at least 8 characters long."});
                    this.setState({validPassword:false});
                }
                else{
                    this.setState({errorsPassword:""});
                    this.setState({validPassword:true});
                }
                break;
            case "age":
                if(value<15){
                    this.setState({errorsAge:"You must be at least 15 years old."});
                    this.setState({validAge:false});
                }
                else{
                    this.setState({errorsAge:""});
                    this.setState({validAge:true});
                }
                break;
            case "email":
                if(!validEmailRegex.test(value)){
                    this.setState({errorsEmail:"Invalid email address"});
                    this.setState({validEmail:false});
                }
                else{
                    this.setState({errorsEmail:""});
                    this.setState({validEmail:true});
                }
                break;
            default:
                console.log("error in switch-case");
                break;
        }
      }

      validation(){
          let message="Please enter valid:";
          let valid=true;
          if(!this.state.validUsername||this.state.username.length<=0){
              valid=false;
              message=message+" username,";
              console.log(valid);
          }
          if(!this.state.validPassword||this.state.password.length<=0||this.state.repeatPassword.length<=0||this.state.password!==this.state.repeatPassword){
              valid=false;
              message=message+" password,";
          }
          if(!this.state.validEmail||this.state.email.length<=0){
            valid=false;
            message=message+" email,";
          }
          if(!this.state.validAge&& this.state.age.length>0){
            valid=false;
            message=message+" age,";
          }
          if(!valid){       
              message=message.slice(0,message.length-1);
              message=message+".";              
              this.setState({formErrors:message});
          }
          return valid;

      }

      //opening second page of a form
      continueClicked(){
        this.setState({page:false});
      }

      backClicked(){
          this.setState({page:true});
      }

      //opening home page
      submitClicked(event){
        event.preventDefault();
          if(this.validation()){
              axios.post('/api/registration',{name:this.state.username,password:this.state.password,email:this.state.email,weight:this.state.weight,height:this.state.height,age:this.state.age})
              .then(response =>{
                  console.log(response.data.correct);
                  if(response.data.correct){
                    this.props.onPageChange("home");
                  }
                  else{
                      this.setState({formErrors:"Username is already taken."});
                  }
              },
              (error)=>{
                  console.log(error);
              });
          }
      }

      //opening login form
    handleLoginLinkClick(event){
        event.preventDefault();
        this.props.onPageChange("login");
    }  





    render(){
        let registrationForm;
        //opening first page of registration
        if(this.state.page){
            registrationForm= <div class="registrationFormContainer">
            <form id="registrationForm">
            <h1>Register</h1>
             <label for="username" className="form-labels">Username: </label>
             <br/>
                <input type="text" value={this.state.username} id="username" placeholder="Enter Username" name="username" onChange={this.handleChange}/>
                <div className="error_message"><span className="small">{this.state.errorsUsername}</span></div>
            <br/>
            <label for="email" className="form-labels">Email address: </label>
             <br/>
                <input type="text" value={this.state.email} id="usename" placeholder="Enter Email" name="email" onChange={this.handleChange}/>
                <div className="error_message"><span className="small">{this.state.errorsEmail}</span></div>
            <br/>
            <label className="form-labels" for="password">Password:</label>
            <br/>
                <input type="password" value={this.state.password} id="password" placeholder="Enter Password" name="password" onChange={this.handleChange}/>
                <div className="error_message"><span className="small">{this.state.errorsPassword}</span></div>
            <br/>
            <label className="form-labels" for="password-again">Repeat Password:</label>
            <br/>
                <input type="password" value={this.state.repeatPassword} id="password-again" name="repeatPassword" placeholder="Repeat Password" onChange={this.handleChange}/>
            <br/>
            <input type="sumit" value="Continue" className="loginButton" onClick={this.continueClicked}/>
            <div>
                <div class="bottom-container">
            <span class="register"> Already have an account? <a href="javascript:void(0);" onClick={this.handleLoginLinkClick}>Sign In</a></span>
            </div>
            </div>
            </form>
            </div>
        }
        else{
            //opening second page of registration
            registrationForm= <div class="registrationFormContainer">
            <form id="registrationForm">
            <h1>Register</h1>
            <p className="description">Some optional info</p>
             <label for="weight" className="form-labels">Weight (kg): </label>
             <br/>
                <input type="text"  id="weight" name= "weight" value={this.state.weight} placeholder="Enter Your Weight" onChange={this.handleChange}/>
            <br/>
            <label for="height" className="form-labels">Height (cm): </label>
             <br/>
                <input type="text"  id="height" name="height" value={this.state.height} placeholder="Enter Your Height" onChange={this.handleChange}/>
            <br/>
            <label className="form-labels" for="age">Age:</label>
            <br/>
                <input type="text"  id="age" name="age" placeholder="Enter Your Age" value={this.state.age} onChange={this.handleChange}/>
                <div className="error_message"><span className="small">{this.state.errorsAge}</span></div>
            <br/>
            <p class="form-errors">{this.state.formErrors}</p>
            <div className="buttonHolder">
                <button className="smallLoginButton" onClick={this.backClicked}>Back</button>
            <input type="submit" value="Submit" className="smallLoginButton submit_button"  onClick={this.submitClicked}/>
            </div>
            <div>
                <div class="bottom-container">
            <span class="register"> Already have an account? <a href="javascript:void(0);" onClick={this.handleLoginLinkClick}>Sign In</a></span>
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