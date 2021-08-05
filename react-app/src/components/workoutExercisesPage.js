import axios from 'axios';
import React, {useState, useEffect} from 'react';
import { useHistory} from 'react-router-dom';
import {createTags} from './workoutsPage';

//function component for displaying Exercises page
export const Exercises = function(props){
const [myExercises,setMyExercises]=useState("");
const[exercises,setExercises]=useState("");
const[loadExercises,setLoadExercises]=useState(true);
const[loadMyExercises,setLoadMyExercises]=useState(true);
const [date,setDate] = useState(false);

let history=useHistory();
const path=history.location.pathname;

    //call only when component is mounting
    useEffect(() => {
            //retriving list of all exercises from database whose author is logged user
            axios.post('/api/my',{name:sessionStorage.getItem("username"),size:2,value:"exercise"})
            .then(response => {
                //using createPlans function from workoutsPage script
                let res=CreateExercises(response.data.list,history);
                setMyExercises(res);
            }, error => {
                console.log(error);
            });
    
            //retreving list of  all public plans from databse
            axios.get('/api/all/?size='+2+'&value=exercise')
            .then(response => {
                //using createPlans function from workoutsPage script
                let res=CreateExercises(response.data.list,history);
                setExercises(res);
            }, error => {
                console.log(error);
            });
    
        //making side navbar button Exercises look like it is selected
        props.handlerFunction("Exercises");

          //checking if date on calendar is currently picked
          if(sessionStorage.getItem("date")){
            setDate(sessionStorage.getItem("date"));
        }
   },[]);

   function quitDate(){
    sessionStorage.removeItem("date");
    setDate(false);
}   


    return(
        <div>
           {date && <div class="date-message"><p>You are currently located in day:  <b>{  date}</b> </p>  <button className="cancel-date-button" onClick={quitDate}><i class="fas fa-times"></i> Quit</button></div>}
            <div className="plans-container">
            <a className="link-title" href="javascript:void(0);" onClick={()=>{history.push(path+'/MyExercises')}}><h2>My Exercises</h2></a>
                <p>Create your own custom exercises which you can then orginize in plans. Add them to your workout plans and share them with other users.</p>
                <button class="create-new plan"><i class="fas fa-plus"></i> Create New</button>
                {myExercises}
                {loadMyExercises && <a href="javascript:void(0);" onClick={()=>{history.push(path+'/MyExercises');setLoadMyExercises(false)}} class="load-more-link">Load more...</a>}
            </div>
            <div className="plans-container">
            <a className="link-title" href="javascript:void(0);" onClick={()=>{history.push(path+'/AllExercises')}}><h2>Exercises</h2></a>
                <p>If you don't want to bother with creating your own exercises search exercises that already exsist in app, organize them in your costum plans or save them for later.</p>
                {exercises}
                {loadExercises && <a href="javascript:void(0);" onClick={()=>{history.push(path+'/AllExercises');setLoadExercises(false)}} class="load-more-link">Load more...</a>}
            </div>

        </div>
    );
}

//component for presenting all public exercises
export const AllExercises = function(props){
    const[exercises,setExercises]=useState("");
    const [date,setDate] = useState(false);

    let history=useHistory();

     //call only when component is mounting
     useEffect(() => {
        //retreving list of  all public plans from databse
        axios.get('/api/all/?size='+0+'&value=exercise')
        .then(response => {
            //using createPlans function from workoutsPage script
            let res=CreateExercises(response.data.list,history);
            setExercises(res);
        }, error => {
            console.log(error);
        });

          //checking if date on calendar is currently picked
          if(sessionStorage.getItem("date")){
            setDate(sessionStorage.getItem("date"));
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
            <h2>Exercises</h2>
                <p>If you don't want to bother with creating your own exercises search exercises that already exsist in app, organize them in your costum plans or save them for later.</p>
                {exercises}
            </div>
        </div>
    );
}

//component for presenting exercises created by currently logged user
export const MyExercises = function(props){
    const [myExercises,setMyExercises]=useState("");
    const [date,setDate] = useState(false);

    let history=useHistory();

     //call only when component is mounting
     useEffect(() => {
        //retriving list of all exercises from database whose author is logged user
        axios.post('/api/my',{name:sessionStorage.getItem("username"),size:0,value:"exercise"})
        .then(response => {
            //using createPlans function from workoutsPage script
            let res=CreateExercises(response.data.list,history);
            setMyExercises(res);
        }, error => {
            console.log(error);
        });

          //checking if date on calendar is currently picked
          if(sessionStorage.getItem("date")){
            setDate(sessionStorage.getItem("date"));
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
            <h2>My Exercises</h2>
                <p>Create your own custom exercises which you can then orginize in plans. Add them to your workout plans and share them with other users.</p>
                <button class="create-new plan"><i class="fas fa-plus"></i> Create New</button>
                {myExercises}
            </div>
        </div>
    );
}



  //creating list of exercise by displaying every exercise in its div
  export const CreateExercises=function CreateExercises(plans,history){
    if(plans.length===0){
        return(<div>
            <p>No results found.</p>
        </div>);
    }
    let result = plans.map((x) => {
        let tags=createTags(x.tags);
        let linkStr="/home/workout/exercise/open/"+x.title+"/"+x.username;
        return(
         <div class="plan-container">
            <a href="javascript:void(0);" onClick={()=>{history.push(linkStr)}}>{x.title}</a>
             <p>by {x.username}</p>
             <p>{x.description}</p>
             <p>{x.calories} cal</p>  
             <div className="tags-container">{tags}</div>
         </div>
        );

    });
    return result;
}