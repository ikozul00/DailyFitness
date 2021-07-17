import React, {useState, useEffect} from 'react';
import logoImage from './images/small-logo.png';
import './styles/mainPage.css';
import { Route, Switch,Link, useLocation} from 'react-router-dom';
import Home from './homePage';
import Search from './search';
import About from './about';
import Workout from './workoutsPage';

//function component implemented using Hooks
function MainPage(props){
  //using useState Hook for state variables
  const [classHome, setClassHome] = useState("buttonActive");
  const [classExercise,setClassExercise] = useState("buttonInactive");
  const [classAbout, setClassAbout] = useState("buttonInactive");
  const [classRecipe, setClassRecipe] = useState("buttonInactive");

  
  function handleHomeButton(){
    if(classHome==='buttonInactive'){
      setClassHome("buttonActive");
      setClassExercise("buttonInactive");
      setClassAbout("buttonInactive");
      setClassRecipe("buttonInactive");
    } 
  }

  function handleAboutButton(){
    if(classAbout==='buttonInactive'){
      setClassAbout("buttonActive");
      setClassExercise("buttonInactive");
      setClassHome("buttonInactive");
      setClassRecipe("buttonInactive");
    } 
  }

  function handleExerciseButton(){
    if(classExercise==='buttonInactive'){
      setClassExercise("buttonActive");
      setClassHome("buttonInactive");
      setClassAbout("buttonInactive");
      setClassRecipe("buttonInactive");
    } 
  }

  function handleRecipeButton(){
    if(classRecipe==='buttonInactive'){
      setClassRecipe("buttonActive");
      setClassExercise("buttonInactive")
      setClassHome("buttonInactive");
      setClassAbout("buttonInactive");
    }
  }
    return (
      <div className="main-container">
      <div className="headerContainer">
        <div id="imageContainer"><img src={logoImage} alt="logo" class="logoImage"></img></div>
        <div className="pageTopContainer">
          <nav className="navContainer">
          <Link to="/" className="links" style={{ textDecoration: 'none' }}><button onClick={handleHomeButton} className={classHome}><i className="fa fa-home"></i>Home</button></Link>
          <Link to="/workout" className="links" style={{ textDecoration: 'none' }}><button onClick={handleExerciseButton} className={classExercise}><i className="fas fa-running" ></i>Workouts</button></Link>
          <Link to="/recipe" className="links" style={{ textDecoration: 'none' }}><button onClick={handleRecipeButton} className={classRecipe}><i className="fa fa-cutlery"></i>Recipes</button></Link>
          <Link to="/about" className="links" style={{ textDecoration: 'none' }}><button onClick={handleAboutButton} className={classAbout}><i className="fa fa-user"></i>About</button></Link>
          </nav>
          </div>
          </div>
          <Switch>
            <Route path="/" render={(props)=> (<Home handlerFunction={handleHomeButton}/>)} exact />
            <Route path="/workout" render={(props)=> (<Workout handlerFunction={handleExerciseButton}/>)}/>
            <Route path="/recipe" component={Search} />
            <Route path="/about" component={About} />
          </Switch>
          </div>
    );
}

 

export default MainPage;