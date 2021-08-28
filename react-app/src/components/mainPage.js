import React, {useState, useEffect} from 'react';
import logoImage from './images/small-logo.png';
import './styles/mainPage.css';
import { Switch,Route,useRouteMatch, useHistory} from 'react-router-dom';
import {Link} from 'react-router-dom';
import Home from './homePage';
import Workout from './workoutsPage';
import DailyReport from './dailyReport';
import MyProfile from './myProfile';

//function component implemented using Hooks
function MainPage(props){
  //using useState Hook for state variables
  const [classHome, setClassHome] = useState("buttonActive");
  const [classExercise,setClassExercise] = useState("buttonInactive");
  const [classAbout, setClassAbout] = useState("buttonInactive");

  const { path } = useRouteMatch();
  let history=useHistory();

  function handleHomeButton(event){
    if(classHome==='buttonInactive'){
      setClassHome("buttonActive");
      setClassExercise("buttonInactive");
      setClassAbout("buttonInactive");
    } 
  }

  function handleProfileButton(e){
    if(classAbout==='buttonInactive'){
      setClassAbout("buttonActive");
      setClassExercise("buttonInactive");
      setClassHome("buttonInactive");
    } 
  }

  function handleExerciseButton(event){
    if(classExercise==='buttonInactive'){
      setClassExercise("buttonActive");
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
          <Link to="/home" className="links" style={{ textDecoration: 'none' }}>
            <button className={classHome}><i className="fa fa-home"></i>Home</button>
          </Link>
          <Link to="/home/workout" className="links" style={{ textDecoration: 'none' }}>
            <button className={classExercise}><i className="fas fa-running" ></i>Workouts</button>
          </Link>
          <Link to="/home/profile" className="links" style={{ textDecoration: 'none' }}>
            <button  className={classAbout}><i className="fa fa-user"></i>MyProfile</button>
          </Link>
          </nav>
          </div>
          </div>
          <div>
            <Switch>
          <Route path="/home">
          <Route path={`${path}`} render={(props)=> (<Home handlerFunction={handleHomeButton}/>)} exact/>
          <Route path={`${path}/workout`} render={(props)=> (<Workout handlerFunction={handleExerciseButton} date={false}/>)}/>
            <Route path={`${path}/profile`} render={(props)=> (<MyProfile handlerFunction={handleProfileButton} />)} />
            <Route path={`${path}/date/:date`} render={(props)=> (< DailyReport history={history}/>)}/>
          </Route>
          </Switch>
          </div>
          </div>
    );
}

 

export default MainPage;