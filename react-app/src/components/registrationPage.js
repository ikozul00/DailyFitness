import React from 'react';
import './styles/login.css';
import './styles/registration.css';
import logoImage from './images/logo.png';
import axios from 'axios';
import {Link, useHistory} from 'react-router-dom';
import {useState} from 'react';

function RegistrationPage(){
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");
    const [repeatePassword,setRepeatePassword] = useState("");
    const [weight,setWeight] = useState(0);
    const [height,setHeight] = useState(0);
    const [age,setAge] = useState(0);
    const [page,setPage] = useState(true);
    const [errorsUsername,setErrorsUsername] = useState("");
    const [errorsPassword,setErrorsPassword] = useState("");
    const [errorsEmail,setErrorsEmail] = useState("");
    const [errorsAge,setErrorsAge] = useState("");
    const [validUsername,setValidUsername] = useState(false);
    const [validPassword,setValidPassword] = useState(false);
    const [validEmail,setValidEmail] = useState(false);
    const [validAge,setValidAge] = useState(false);
    const [formErrors,setFormErrors] = useState("");
    const [formValid,setFormValid] = useState(true);
    const [profileImg,setProfileImg] = useState("");
    const [imagePreview,setImagePreview] = useState(false);

    let history=useHistory();

    //handling input changes on all form fields while validating values
    function handleChange(event) {
        const name=event.target.name;
        const value=event.target.value;
        const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
        switch(name){
            case 'username':
                setUsername(value);
                if(value.length<3){
                    setErrorsUsername("Username must be at least 3 characters long.");
                    setValidUsername(false);
                }
                else{
                    setErrorsUsername("");
                    setValidUsername(true);
                }
                break;
            case "password":
                setPassword(value);
                if(value.length<8){
                    setErrorsPassword("Password must be at least 8 characters long.");
                    setValidPassword(false);
                }
                else{
                    setErrorsPassword("");
                    setValidPassword(true);
                }
                break;
            case "age":
                setAge(value);
                if(value<15){
                    setErrorsAge("You must be at least 15 years old.");
                    setValidAge(false);
                }
                else{
                    setErrorsAge("");
                    setValidAge(true);
                }
                break;
            case "email":
                setEmail(value);
                if(!validEmailRegex.test(value)){
                    setErrorsEmail("Invalid email address");
                    setValidEmail(false);
                }
                else{
                    setErrorsEmail("");
                    setValidEmail(true);
                }
                break;
            case "repeatPassword":
                setRepeatePassword(value);
                break;
            case "weight":
                setWeight(value);
                break;
            case "height":
                setHeight(value);
                break;
            default:
                console.log("error in switch-case");
                break;
        }
      }

       //function called when file is uploaded
    function fileUpload(e){
        setProfileImg(e.target.files[0]);
        setImagePreview(URL.createObjectURL(e.target.files[0]));
    }

      function validation(){
          let message="Please enter valid:";
          let valid=true;
          if(!validUsername||username.length<=0){
              valid=false;
              message=message+" username,";
          }
          if(!validPassword||password.length<=0||repeatePassword.length<=0||password!==repeatePassword){
              valid=false;
              message=message+" password,";
          }
          if(!validEmail||email.length<=0){
            valid=false;
            message=message+" email,";
          }
          if(!validAge&& age.length>0){
            valid=false;
            message=message+" age,";
          }
          if(!valid){       
              message=message.slice(0,message.length-1);
              message=message+".";              
              setFormErrors(message);
              setFormValid(false);
          }
          return valid;

      }

      //opening second page of a form
      function continueClicked(){
        setPage(false);
      }

      function backClicked(){
         setPage(true);
      }

      //opening home page
      function submitClicked(event){
        event.preventDefault();
        console.log("pozvana");
        console.log("validacija: ",validation());
          if(validation()){
            let data= new FormData();
            data.append("name",username);
            data.append("password",password);
            data.append("email",email);
            data.append("weight",weight);
            data.append("height",height);
            data.append("age",age);
            data.append("profileImg",profileImg);
              axios.post('/api/registration',data,{
                headers: {
                  "Content-Type": "multipart/form-data",
                }})
              .then(response =>{
                  if(response.data.correct){
                      sessionStorage.setItem('username', username);
                    history.push("/home");
                  }
                  else{
                      setFormErrors("Username is already taken.");
                  }
              },
              (error)=>{
                  console.log(error);
              });
          }
      }

      //removing upoladed image
      function closeImage(){
        setProfileImg("");
        setImagePreview(false);
      }

        return(
            <div className="registrationContainer">
                <img src={logoImage} alt="logo" className="logoImage"></img>
                {page && <div class="registrationFormContainer">
            <form id="registrationForm">
            <h1>Register</h1>
             <label for="username" className="form-labels">Username: </label>
             <br/>
                <input type="text" value={username} id="username" placeholder="Enter Username" name="username" onChange={handleChange}/>
                <div className="error_message"><span className="small">{errorsUsername}</span></div>
            <br/>
            <label for="email" className="form-labels">Email address: </label>
             <br/>
                <input type="text" value={email} id="usename" placeholder="Enter Email" name="email" onChange={handleChange}/>
                <div className="error_message"><span className="small">{errorsEmail}</span></div>
            <br/>
            <label className="form-labels" for="password">Password:</label>
            <br/>
                <input type="password" value={password} id="password" placeholder="Enter Password" name="password" onChange={handleChange}/>
                <div className="error_message"><span className="small">{errorsPassword}</span></div>
            <br/>
            <label className="form-labels" for="password-again">Repeat Password:</label>
            <br/>
                <input type="password" value={repeatePassword} id="password-again" name="repeatPassword" placeholder="Repeat Password" onChange={handleChange}/>
            <br/>
            {!formValid && <p class="form-errors">{formErrors}</p>}
            <br/>
            <input type="sumit" value="Continue" className="loginButton" onClick={continueClicked}/>
            <div>
                <div class="bottom-container">
            <span class="register"> Already have an account? <Link to="/login" >Sign In</Link></span>
            </div>
            </div>
            </form>
            </div>}

            {!page && <div class="registrationFormContainer">
            <form id="registrationForm">
            <h1>Register</h1>
            <p className="description">Some optional info</p>
             <label for="weight" className="form-labels">Weight (kg): </label>
             <br/>
                <input type="text"  id="weight" name= "weight" value={weight} placeholder="Enter Your Weight" onChange={handleChange}/>
            <br/>
            <label for="height" className="form-labels">Height (cm): </label>
             <br/>
                <input type="text"  id="height" name="height" value={height} placeholder="Enter Your Height" onChange={handleChange}/>
            <br/>
            <label className="form-labels" for="age">Age:</label>
            <br/>
                <input type="text"  id="age" name="age" placeholder="Enter Your Age" value={age} onChange={handleChange}/>
                <div className="error_message"><span className="small">{errorsAge}</span></div>
            <br/>
            <br/>
            {!imagePreview && <label class="custom-file-upload">
                <input type="file" onChange={fileUpload}/>
                Upload profile picture
            </label>}
            <br/>
            {imagePreview && <div className="registration-picture-container">
                <div>
            <img src={imagePreview} className="registration-image"></img>
            </div>
            <div>
            <button onClick={closeImage} className="close-button">Remove image</button>
            </div>
            </div>}
            <br/>
            {!formValid && <p class="form-errors">{formErrors}</p>}
            <div className="buttonHolder">
                <button className="smallLoginButton" onClick={backClicked}>Back</button>
            <input type="submit" value="Submit" className="smallLoginButton submit_button"  onClick={submitClicked}/>
            </div>
            <div>
                <div class="bottom-container">
            <span class="register"> Already have an account? <Link to="/login">Sign In</Link></span>
            </div>
            </div>
            </form>
            </div>}
            </div>
        );
   // }
}

export default RegistrationPage;