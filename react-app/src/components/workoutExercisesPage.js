import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {createPlans} from './workoutPlansPage';
import { useHistory} from 'react-router-dom';

//function component for displaying Exercises page
export const Exercises = function(props){
const [myExercises,setMyExercises]=useState("");
const[exercises,setExercises]=useState("");
const[loadExercises,setLoadExercises]=useState(true);
const[loadMyExercises,setLoadMyExercises]=useState(true);

let history=useHistory();
const path=history.location.pathname;

    //call only when component is mounting
    useEffect(() => {
            //retriving list of all exercises from database whose author is logged user
            axios.post('/api/my',{name:sessionStorage.getItem("username"),size:0,value:"exercise"})
            .then(response => {
                let res=createPlans(response.data.list);
                setMyExercises(res);
            }, error => {
                console.log(error);
            });
    
            //retreving list of  all public plans from databse
            axios.get('/api/all/?size='+0+'&value=exercise')
            .then(response => {
                console.log(response.data.list);
                let res=createPlans(response.data.list);
                setExercises(res);
            }, error => {
                console.log(error);
            });
    
        //making side navbar button Exercises look like it is selected
        props.handlerFunction("Exercises");
   },[]);

    return(
        <div>
            <div className="plans-container">
            <a className="link-title" href="javascript:void(0);" onClick={()=>{history.push(path+'/MyExercises')}}><h2>My Exercises</h2></a>
                <p>Create your own custom exercises which you can then orginize in plans. Add them to your workout plans and share them with other users.</p>
                <button class="create-new plan"><i class="fas fa-plus"></i> Create New</button>
                {myExercises}
                {loadMyExercises && <a href="javascript:void(0);" onClick={()=>{history.push(path+'/MyExercises')}} class="load-more-link">Load more...</a>}
            </div>
            <div className="plans-container">
            <a className="link-title" href="javascript:void(0);" onClick={()=>{history.push(path+'/AllExercises')}}><h2>Exercises</h2></a>
                <p>If you don't want to bother with creating your own exercises search exercises that already exsist in app, organize them in your costum plans or save them for later.</p>
                {exercises}
                {loadExercises && <a href="javascript:void(0);" onClick={()=>{history.push(path+'/AllExercises')}} class="load-more-link">Load more...</a>}
            </div>

        </div>
    );
}

//component for presenting all public exercises
export const AllExercises = function(){
    const[exercises,setExercises]=useState("");

     //call only when component is mounting
     useEffect(() => {
        //retreving list of  all public plans from databse
        axios.get('/api/all/?size='+0+'&value=exercise')
        .then(response => {
            console.log(response.data.list);
            let res=createPlans(response.data.list);
            setExercises(res);
        }, error => {
            console.log(error);
        });
},[]);


    return(
        <div>
            <div className="plans-container load-all">
            <h2>Exercises</h2>
                <p>If you don't want to bother with creating your own exercises search exercises that already exsist in app, organize them in your costum plans or save them for later.</p>
                {exercises}
            </div>
        </div>
    );
}

//component for presenting exercises created by currently logged user
export const MyExercises = function(){
    const [myExercises,setMyExercises]=useState("");

     //call only when component is mounting
     useEffect(() => {
        //retriving list of all exercises from database whose author is logged user
        axios.post('/api/my',{name:sessionStorage.getItem("username"),size:1,value:"exercise"})
        .then(response => {
            let res=createPlans(response.data.list);
            setMyExercises(res);
        }, error => {
            console.log(error);
        });
    },[]);

    return(
        <div>
            <div className="plans-container load-all">
            <h2>My Exercises</h2>
                <p>Create your own custom exercises which you can then orginize in plans. Add them to your workout plans and share them with other users.</p>
                <button class="create-new plan"><i class="fas fa-plus"></i> Create New</button>
                {myExercises}
            </div>
        </div>
    );
}