import React, {useState, useEffect} from 'react';
import { Route, Switch,Link, useRouteMatch,useHistory, useParams} from 'react-router-dom';
import { __RouterContext } from 'react-router';
import './styles/workoutPage.css';
import {Plans,MyPlans,AllPlans} from './workoutPlansPage';
import {Exercises, AllExercises, MyExercises} from './workoutExercisesPage';
import {SearchList} from './searchList';
import {Plan} from './plan';
import {Exercise} from './exercise';
import { NewExercise } from './createExercise';
import {NewPlan } from './createPlan';
import { CancelCreatingPlan} from './cancelCreatingPlan';
import { CancelAddingExercise } from './cancelAddingExercise';

export const WorkoutPage=function WorkoutPage(props){

    const { path } = useRouteMatch();
    const searchValue=React.useRef(null);
    const[categorie,setCategorie] = useState("Workout plans");
    const[workoutClass,setWorkoutClass] = useState("link-button");
    const[exerciseClass,setExerciseClass] = useState("link-button");
    const [searchDisable,setSearchDisable] = useState(false);
    const [tagsDisable,setTagsDisable] = useState(false);
    const[tagsChosen,setTagsChosen] = useState([]);
    const[tagsToSend,setTagsToSend] = useState([]);
    // const [dateInfo,setDateInfo] = useState(false);

    let history=useHistory();
    let tags=[];
    let {date}=useParams();

    //setting button Workouts in main navbar as selected
    useEffect(() => {
        props.handlerFunction();
        // setDateInfo(date);
   },[]);


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
        let currentPath=history.location.pathname;
        if(currentPath.indexOf("exercise")!==-1){
            history.push(path+"/exercise/search/"+searchValue.current.value);
        }
        else{
            history.push(path+"/plans/search/"+searchValue.current.value);
        }
   }

   function startSearchTags(){
       let currentPath=history.location.pathname;
       if(currentPath.indexOf("exercise")!==-1){
           setTagsToSend(tagsChosen);
            history.push(path+"/exercise/search");
        }
        else{
            setTagsToSend(tagsChosen);
            history.push(path+"/plans/search");
        }
   }

   


    return (
        <div className="workout-main-container"> 
            <div className="sideNavContainer">
                <nav class="workout-navigation">
                    <Link to="/home/workout/plans" className="nav-link upper-link"><button className={workoutClass} onClick={()=>menuButtonClicked("Workout plans")} value="Workout plans">Workout plans</button></Link><Link to="/home/workout/exercise" className="nav-link bottom-link"><button className={exerciseClass} onClick={()=>menuButtonClicked("Exercises")} value="Exercises">Exercises</button></Link>
                </nav>
                <div class="search-container">
                {searchDisable&&<button className="disable-search" onClick={searchChosen}></button>}
                        <form class="workout-search-form" onSubmit={startSearch}>
                            <input type="text" placeholder="Search" name="search" ref={searchValue}  onFocus={searchChosen}/>
                            <button type="submit" class="searchIcon"><i class="fas fa-search search-icon"></i></button>
                        </form>
                    </div>
                <div className="workout-tags-container">
                {tagsDisable && <button className="disable-tags" onClick={tagsInFocus}></button>}
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
                        <button className="workout-categorie-button" onClick={tagClicked}>Legs</button>
                        </div>
                    </div>
                    <div className="workout-categorie last">
                        <p>Type:</p>
                        <div className="workout-buttons-container">
                        <button className="workout-categorie-button" onClick={tagClicked}>Warm up</button>
                        <button className="workout-categorie-button" onClick={tagClicked}>Cardio</button>
                        <button className="workout-categorie-button" onClick={tagClicked}>Stretching</button>
                        <button className="workout-categorie-button" onClick={tagClicked}>Strength</button>
                        <button className="workout-categorie-button" onClick={tagClicked}>Whole body</button>
                        <button className="workout-categorie-button" onClick={tagClicked}>Aerobic</button>
                        </div>
                    </div>
                    <button className="search-button" onClick={startSearchTags}><i class="fas fa-search search-icon"></i> Search</button>
                </div>
            </div>
            <div className="workouts-container">
            <Switch>
            <Route path={`${path}`} render={(props)=> (<Plans handlerFunction={menuButtonClicked}/>)} exact/>
                <Route path={`${path}/plans`} render={(props)=> (<Plans handlerFunction={menuButtonClicked}/>)} exact/>
                <Route path={`${path}/exercise`} render={(props)=> (<Exercises handlerFunction={menuButtonClicked}/>)} exact/>
                <Route path={`${path}/MyPlans`} render={()=> (<MyPlans/>)}/>
                <Route path={`${path}/AllPlans`} render={()=> (<AllPlans/>)}/>
                <Route path={`${path}/plans/MyPlans`} render={()=> (<MyPlans/>)}/>
                <Route path={`${path}/plans/AllPlans`} render={()=> (<AllPlans/>)}/>
                <Route path={`${path}/exercise/MyExercises`} render={()=> (<MyExercises/>)}/>
                <Route path={`${path}/exercise/AllExercises`} render={()=> (<AllExercises/>)}/>
                <Route path={`${path}/plans/search/:title`} render={() => (<SearchList parameter="search"/>)}/>
                <Route path={`${path}/exercise/search/:title`} render={() => (<SearchList parameter="search"/>)}/>
                <Route path={`${path}/exercise/search`} render={() => (<SearchList parameter="tags" tags={tagsToSend}/>)}/>
                <Route path={`${path}/plans/search`} render={() => (<SearchList parameter="tags" tags={tagsToSend}/>)}/>
                <Route path={`${path}/plan/open/:title/:author`} render={()=>(<Plan/>)}/>
                <Route path={`${path}/exercise/open/:title/:author`} render={()=>(<Exercise/>)}/>
                <Route path={`${path}/exercise/create`} render={()=>(<NewExercise/>)}/>
                <Route path={`${path}/plan/create`} render={()=>(<NewPlan/>)}/>
                <Route path={`${path}/plan/cancel`} render={()=>(<CancelCreatingPlan/>)}/>
                <Route path={`${path}/exercise/cancel`} render={()=>(<CancelAddingExercise/>)}/>
            </Switch>
            </div>
        </div>
    );
}

export default WorkoutPage;

   
//creating list of tags for a plan
export const createTags=function createTags(tags){
    if(!tags){
        return(
            <div></div>
        );
    }
    else{
        let result=tags.map((x) => {
            if(x!==null){
                return(
                    <div className="tag">
                        <p className="tag-text">{x}</p>
                    </div>
                )
            }
            else{
                return <div></div>
            }
        });
        return result;
    }
}


