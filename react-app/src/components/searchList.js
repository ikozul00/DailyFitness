import axios from 'axios';
import React, {useState, useEffect} from 'react';
import { useLocation, useParams,useHistory,Link} from 'react-router-dom';
import {CreatePlans} from './workoutPlansPage';
import { CreateExercises } from './workoutExercisesPage';

export const SearchList=function (props){

    const [result,setResult] = useState("");
    const [date,setDate] = useState(false);
    const [plan,setPlan] = useState(false);
    const [planCreating, setPlanCreating] = useState(false);

    let history=useHistory();

    let type="";
    let location=useLocation();
    //acessing parameters from URL
    let {title} =useParams();
    //function is called when component is initially loaded and when value of title is changed
    useEffect(() => {
        if(location.pathname.indexOf("exercise")!==-1){
            type="exercise";
            if(sessionStorage.getItem("planCreating")){
                setPlanCreating(JSON.parse(sessionStorage.getItem("planCreating")));
            }
        }
        else if(location.pathname.indexOf("plan")!==-1){
            type="plan";
             //if there is plan in memory that is currently creating, remind user
            if(sessionStorage.getItem("planCreating")){
                history.push("/home/workout/plan/cancel");
            }
            //if some plan was previosy picked, reminding user
            if(sessionStorage.getItem("plan")){
                history.push("/home/workout/exercise/cancel");
            }
        }
        if(props.parameter==="search"){
            //sending get request to server with search value and information whether we are searching plans or exercises, this request is send and useeffect function is called only when text of search is changed
            axios.get('/api/search/?type='+type+'&value='+title)
            .then(response => {
                let res="";
                if(type==="plan"){
                    //using createPlans function from workoutsPlansPage script
                    res=CreatePlans(response.data.list,history);
                }
                else if(type==="exercise"){
                    //using createExercise function from workoutsExercisesPage script
                    res=CreateExercises(response.data.list,history);
                }
                 
                    setResult(res);
            }, error => {
                console.log(error);
            })
        }
        else if(props.parameter==="tags"){
            axios.post('/api/search/tags',{tags:props.tags,type:type})
            .then(response => {
                let res="";
                if(type==="plan"){
                    //using createPlans function from workoutsPlansPage script
                    res=CreatePlans(response.data.list,history);
                }
                else if(type==="exercise"){
                    //using createExercise function from workoutsExercisesPage script
                    res=CreateExercises(response.data.list,history);
                }
                    setResult(res);
            },error => {
                console.log(error);
            })
        }

         //checking if date on calendar is currently picked
         if(sessionStorage.getItem("date")){
            setDate(sessionStorage.getItem("date"));
        }

        //checking if user is currenly adding exercises to some plan
        if(sessionStorage.getItem("plan")){
            setPlan(JSON.parse(sessionStorage.getItem("plan")));
        }
       
    },[title,props.tags]);

    function quitDate(){
        sessionStorage.removeItem("date");
        history.push("/home/date/"+date);
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
              {plan && <div class="date-message"><p>You are currently located in plan:  <b>{  plan.title}</b> </p>  <button className="cancel-date-button" onClick={quitPlan}><i class="fas fa-times"></i> Quit</button></div>}
            {date && <div class="date-message"><p>You are currently located in day:  <b>{  date}</b> </p>  <button className="cancel-date-button" onClick={quitDate}><i class="fas fa-times"></i> Quit</button></div>}
            {planCreating && <div class="date-message"><p>You are currently located in creating plan:  <b>{  planCreating.title}</b> </p>  <button className="cancel-date-button" onClick={quitPlanCreating}><i class="fas fa-times"></i> Quit</button></div>}
            <div className="plans-container search-result">
                <h2>We have found...</h2>
                {result}
            </div>
        </div>
    );

}