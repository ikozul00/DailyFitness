import axios from 'axios';
import React, {useState, useEffect} from 'react';
import { useHistory} from 'react-router-dom';
import { CreateExercises } from './workoutExercisesPage';
import { CreatePlans } from './workoutPlansPage';

//component for presenting exercises added to favorite by currently logged user
export const FavoriteExercises = function(props){
    const [exercises,setExercises]=useState("");
    const [date,setDate] = useState(false);
    const [plan,setPlan] = useState(false);
    const [planCreating, setPlanCreating] = useState(false);

    let history=useHistory();

     //call only when component is mounting
     useEffect(() => {
        //retriving list of all exercises from database that currently logged user added to favorites
        axios.post('/api/favorites/exercises',{name:sessionStorage.getItem("username"),value:"exercise"})
        .then(response => {
            let res=CreateExercises(response.data.exercises,history);
            setExercises(res);
        }, error => {
            console.log(error);
        });

          //checking if date on calendar is currently picked
          if(sessionStorage.getItem("date")){
            setDate(sessionStorage.getItem("date"));
        }

        //checking if user is currenly adding exercises to some plan
        if(sessionStorage.getItem("plan")){
            setPlan(JSON.parse(sessionStorage.getItem("plan")));
        }

        //checking if user is currently adding exercises to some plan which is creating at the moment
        else if(sessionStorage.getItem("planCreating")){
            setPlanCreating(JSON.parse(sessionStorage.getItem("planCreating")));
        }
    },[]);

    function quitDate(){
        sessionStorage.removeItem("date");
        setDate(false);
    } 
    
    function quitPlan(){
        sessionStorage.removeItem("plan");
        history.push("/home/workout/plan/open/"+plan.title+"/"+plan.author);
        setPlan(false);
    }

    function quitPlanCreating(){
        history.push("/home/workout/plan/create");
    }
    

    return(
        <div>
            {date && <div class="date-message"><p>You are currently located in day:  <b>{  date}</b> </p>  <button className="cancel-date-button" onClick={quitDate}><i class="fas fa-times"></i> Quit</button></div>}
            {plan && <div class="date-message"><p>You are currently located in plan:  <b>{  plan.title}</b> </p>  <button className="cancel-date-button" onClick={quitPlan}><i class="fas fa-times"></i> Quit</button></div>}
            {planCreating && <div class="date-message"><p>You are currently located in creating plan:  <b>{  planCreating.title}</b> </p>  <button className="cancel-date-button" onClick={quitPlanCreating}><i class="fas fa-times"></i> Quit</button></div>}
            <div className="plans-container load-all">
            <h2>Favorite Exercises</h2>
                <p>List of exercises you have added to favorites.</p>
                {exercises}
            </div>
        </div>
    );
}


//component for presenting plans added to favorite by currently logged user
export const FavoritePlans = function(props){
    const [plans,setPlans]=useState("");
    const [date,setDate] = useState(false);

    let history=useHistory();

     //call only when component is mounting
     useEffect(() => {
        //retriving list of all plans from database that currently logged user added to favorites
        axios.post('/api/favorites/plans',{name:sessionStorage.getItem("username"),value:"exercise"})
        .then(response => {
            console.log(response.data.plans);
            let res=CreatePlans(response.data.plans,history);
            setPlans(res);
        }, error => {
            console.log(error);
        });

          //checking if date on calendar is currently picked
          if(sessionStorage.getItem("date")){
            setDate(sessionStorage.getItem("date"));
        }

       //if some plan was previosy picked, reminding user
       if(sessionStorage.getItem("plan")){
        history.push("/home/workout/exercise/cancel");
      }

          //if there is plan in memory that is currently creating, remind user
          if(sessionStorage.getItem("planCreating")){
            history.push("/home/workout/plan/cancel");
          }

    },[]);

    function quitDate(){
        sessionStorage.removeItem("date");
        setDate(false);
    } 
    

    return(
        <div>
            {date && <div class="date-message"><p>You are currently located in day:  <b>{  date}</b> </p>  <button className="cancel-date-button" onClick={quitDate}><i class="fas fa-times"></i> Quit</button></div>}
            <div className="plans-container load-all">
            <h2>Favorite Plans</h2>
                <p>List of plans you have added to favorites.</p>
                {plans}
            </div>
        </div>
    );
}