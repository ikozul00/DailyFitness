import React, {useState, useEffect} from 'react';
import { Route, Switch,Link, useRouteMatch} from 'react-router-dom';
import './styles/workoutPage.css';
import {Plans,MyPlans,AllPlans} from './workoutPlansPage';
import {Exercises} from './workoutExercisesPage';

function WorkoutPage(props){

    const { path } = useRouteMatch();
    const [searchValue, setSearchValue] = useState("");
    const[categorie,setCategorie] = useState("Workout plans");
    const[workoutClass,setWorkoutClass] = useState("link-button");
    const[exerciseClass,setExerciseClass] = useState("link-button");
    const [searchDisable,setSearchDisable] = useState(true);

    //setting button Workouts in main navbar as selected
    useEffect(() => {
        props.handlerFunction();
   });

   //handling change of a search bar value
   function changingSearchValue(e){
    setSearchValue(e.target.value);
   }

   function menuButtonClicked(title){
       if(title==="Workout plans"){
           setCategorie("Workout plans");
           setWorkoutClass("button-clicked");
           setExerciseClass("link-button");
       }
       else{
           setCategorie("Exercises");
           setExerciseClass("button-clicked");
           setWorkoutClass("link-button");
       }
   }

    return (
        <div className="workout-main-container">
            <div className="sideNavContainer">
                <nav class="workout-navigation">
                    <Link to="/workout/plans" className="nav-link upper-link"><button className={workoutClass} onClick={()=>menuButtonClicked("Workout plans")} value="Workout plans">Workout plans</button></Link><Link to="/workout/exercise" className="nav-link bottom-link"><button className={exerciseClass} onClick={()=>menuButtonClicked("Exercises")} value="Exercises">Exercises</button></Link>
                </nav>
                <div class="search-container">
                        <form class="workout-search-form">
                            <input type="text" placeholder="Search" name="search" value={searchValue} onChange={changingSearchValue}/>
                            <button type="submit" class="searchIcon"><i class="fas fa-search search-icon"></i></button>
                        </form>
                    </div>
                <div className="workout-tags-container">
                    <div className="workout-categorie first">
                        <p>Difficulty:</p>
                        <div className="workout-buttons-container">
                        <button className="workout-categorie-button">Easy</button>
                        <button className="workout-categorie-button">Medium</button>
                        <button className="workout-categorie-button">Hard</button>
                        </div>
                    </div>
                    <div className="workout-categorie">
                        <p>Body part:</p>
                        <div className="workout-buttons-container">
                        <button className="workout-categorie-button">Arms</button>
                        <button className="workout-categorie-button">Back</button>
                        <button className="workout-categorie-button">Chest</button>
                        <button className="workout-categorie-button">Core</button>
                        <button className="workout-categorie-button">Abs</button>
                        <button className="workout-categorie-button">Booty</button>
                        </div>
                    </div>
                    <div className="workout-categorie last">
                        <p>Type:</p>
                        <div className="workout-buttons-container">
                        <button className="workout-categorie-button">Warm up</button>
                        <button className="workout-categorie-button">Cardio</button>
                        <button className="workout-categorie-button">Stretching</button>
                        <button className="workout-categorie-button">Strength</button>
                        </div>
                    </div>
                    <button className="search-button"><i class="fas fa-search search-icon"></i> Search</button>
                </div>
            </div>
            <div className="workouts-container">
            <Switch>
                <Route path={`${path}/plans`} render={(props)=> (<Plans handlerFunction={menuButtonClicked}/>)} exact/>
                <Route path={`${path}/exercise`} render={(props)=> (<Exercises handlerFunction={menuButtonClicked}/>)}/>
                <Route path={`${path}/plans/MyPlans`} render={()=> (<MyPlans/>)}/>
                <Route path={`${path}/plans/AllPlans`} render={()=> (<AllPlans/>)}/>
            </Switch>
            </div>
        </div>
    );
}

export default WorkoutPage;