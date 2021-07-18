import React, {useState, useEffect} from 'react';
import { Route, Switch,Link, useRouteMatch,useHistory} from 'react-router-dom';
import './styles/workoutPage.css';
import {Plans,MyPlans,AllPlans} from './workoutPlansPage';
import {Exercises, AllExercises, MyExercises} from './workoutExercisesPage';
import {SearchList} from './searchList';

function WorkoutPage(props){

    const { path } = useRouteMatch();
    //const [searchValue, setSearchValue] = useState("");
    const searchValue=React.useRef(null);
    const[categorie,setCategorie] = useState("Workout plans");
    const[workoutClass,setWorkoutClass] = useState("link-button");
    const[exerciseClass,setExerciseClass] = useState("link-button");
    const [searchDisable,setSearchDisable] = useState(false);
    const [tagsDisable,setTagsDisable] = useState(false);
    const[tagsChosen,setTagsChosen] = useState([]);
    let history=useHistory();
    let tags=[];

    //setting button Workouts in main navbar as selected
    useEffect(() => {
        props.handlerFunction();
   });

   //handling change of a search bar value
//    function changingSearchValue(e){
//         setSearchValue(e.target.value);
//    }

   //setting style of button that is picked
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

   //disabling clicking on tags when search is active
   function searchChosen(e){
    e.preventDefault();
       if(searchDisable){
        setSearchDisable(false);
       }

        if(!tagsDisable){
            setTagsDisable(true);
        }
   }

   //disabling search area when tags are in focus
   function tagsInFocus(){
       if(tagsDisable){
           setTagsDisable(false);
       }
       if(!searchDisable){
           setSearchDisable(true);
       }
   }

   //called when one of the tags is clicked, adds it in tagsChosen array
   function tagClicked(e){
       tagsInFocus();
       let str=e.target.innerText.toLowerCase();
       tags=tagsChosen.slice();
       if(!e.target.classList.contains("clicked")){
           e.target.classList.add("clicked");
           tags.push(str);
           setTagsChosen(tags);
       }
       else{
           let position=tags.indexOf(str);
           tags.splice(position,1);
           e.target.classList.remove("clicked");
           setTagsChosen(tags);
       }
   }

   function startSearch(e){
       e.preventDefault();
       console.log(searchValue.current.value);
        let currentPath=history.location.pathname;
        if(currentPath===`${path}/plans` || currentPath===`${path}/plans/MyPlans` || currentPath===`${path}/plans/AllPlans` || currentPath===`${path}`){
            history.push(path+"/plans/search/"+searchValue.current.value);
        }
        else if(currentPath===`${path}/exercise` || currentPath===`${path}/exercise/MyExercises` || currentPath===`${path}/exercise/AllExercises`){
            history.push(path+"/exercise/search/"+searchValue.current.value);
        }
   }


    return (
        <div className="workout-main-container">
            <div className="sideNavContainer">
                <nav class="workout-navigation">
                    <Link to="/workout/plans" className="nav-link upper-link"><button className={workoutClass} onClick={()=>menuButtonClicked("Workout plans")} value="Workout plans">Workout plans</button></Link><Link to="/workout/exercise" className="nav-link bottom-link"><button className={exerciseClass} onClick={()=>menuButtonClicked("Exercises")} value="Exercises">Exercises</button></Link>
                </nav>
                {searchDisable&&<button className="disable-search" onClick={searchChosen}></button>}
                {tagsDisable && <button className="disable-tags" onClick={tagsInFocus}></button>}
                <div class="search-container">
                        <form class="workout-search-form" onSubmit={startSearch}>
                            <input type="text" placeholder="Search" name="search" ref={searchValue}  onFocus={searchChosen}/>
                            <button type="submit" class="searchIcon"><i class="fas fa-search search-icon"></i></button>
                        </form>
                    </div>
                <div className="workout-tags-container">
                    <div className="workout-categorie first">
                        <p>Difficulty:</p>
                        <div className="workout-buttons-container">
                        <button className="workout-categorie-button" onClick={tagClicked}>Easy</button>
                        <button className="workout-categorie-button" onClick={tagClicked}>Medium</button>
                        <button className="workout-categorie-button" onClick={tagClicked}>Hard</button>
                        </div>
                    </div>
                    <div className="workout-categorie">
                        <p>Body part:</p>
                        <div className="workout-buttons-container">
                        <button className="workout-categorie-button" onClick={tagClicked}>Arms</button>
                        <button className="workout-categorie-button" onClick={tagClicked}>Back</button>
                        <button className="workout-categorie-button" onClick={tagClicked}>Chest</button>
                        <button className="workout-categorie-button" onClick={tagClicked}>Core</button>
                        <button className="workout-categorie-button" onClick={tagClicked}>Abs</button>
                        <button className="workout-categorie-button" onClick={tagClicked}>Booty</button>
                        </div>
                    </div>
                    <div className="workout-categorie last">
                        <p>Type:</p>
                        <div className="workout-buttons-container">
                        <button className="workout-categorie-button" onClick={tagClicked}>Warm up</button>
                        <button className="workout-categorie-button" onClick={tagClicked}>Cardio</button>
                        <button className="workout-categorie-button" onClick={tagClicked}>Stretching</button>
                        <button className="workout-categorie-button" onClick={tagClicked}>Strength</button>
                        </div>
                    </div>
                    <button className="search-button"><i class="fas fa-search search-icon"></i> Search</button>
                </div>
            </div>
            <div className="workouts-container">
            <Switch>
            <Route path={`${path}`} render={(props)=> (<Plans handlerFunction={menuButtonClicked}/>)} exact/>
                <Route path={`${path}/plans`} render={(props)=> (<Plans handlerFunction={menuButtonClicked}/>)} exact/>
                <Route path={`${path}/exercise`} render={(props)=> (<Exercises handlerFunction={menuButtonClicked}/>)} exact/>
                <Route path={`${path}/plans/MyPlans`} render={()=> (<MyPlans/>)}/>
                <Route path={`${path}/plans/AllPlans`} render={()=> (<AllPlans/>)}/>
                <Route path={`${path}/exercise/MyExercises`} render={()=> (<MyExercises/>)}/>
                <Route path={`${path}/exercise/AllExercises`} render={()=> (<AllExercises/>)}/>
                <Route path={`${path}/plans/search/:title`} render={() => (<SearchList parameter="search" value={searchValue.current.value}/>)}/>
                <Route path={`${path}/exercise/search/:title`} render={() => (<SearchList parameter="search"/>)}/>
            </Switch>
            </div>
        </div>
    );
}

export default WorkoutPage;