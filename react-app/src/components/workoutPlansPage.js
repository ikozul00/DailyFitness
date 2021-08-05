import axios from 'axios';
import React, {useState, useEffect} from 'react';
import { useHistory,useRouteMatch} from 'react-router-dom';
import {CreatePlans} from './workoutsPage';
import './styles/workoutPage.css';
//import {createTags} from './workoutsPage';

//functional component which displays all the information about workout plans
export const Plans=function (props){
    const [myPlans, setMyPlans] = useState("");
    const [plans,setPlans] = useState("");
    const [loadPlans,setLoadPlans]=useState(true);
    const [loadMyPlans,setLoadMyPlans]=useState(true);
    const [date,setDate] = useState(false);
    let history=useHistory();

    const path=history.location.pathname;

    //call only when component is mounting
    useEffect(() => {

         //checking if date on calendar is currently picked
         if(sessionStorage.getItem("date")){
            setDate(sessionStorage.getItem("date"));
        }

        //retriving list of all plans from database whose author is logged user
        axios.post('/api/my',{name:sessionStorage.getItem("username"),size:2,value:"plan"})
        .then(response => {
            //using createPlans function from workoutsPage script
            let res=CreatePlans(response.data.list,"plan",history,path);
            setMyPlans(res);
        }, error => {
            console.log(error);
        });

        //retreving list of  all public plans from databse
        axios.get('/api/all/?size='+2+'&value=plan')
        .then(response => {
            //using createPlans function from workoutsPage script
            let res=CreatePlans(response.data.list,"plan",history,path);
            setPlans(res);
        }, error => {
            console.log(error);
        });

        //making side navbar button Plans look like it is selected
        props.handlerFunction("Workout plans");

   },[]);

   function quitDate(){
       sessionStorage.removeItem("date");
       setDate(false);
   }


    return(
        <div>
             {date && <div class="date-message"><p>You are currently located in day:  <b>{  date}</b> </p>  <button className="cancel-date-button" onClick={quitDate}><i class="fas fa-times"></i> Quit</button></div>}
            <div className="plans-container">
            <a className="link-title" href="javascript:void(0);" onClick={()=>{history.push(path+'/MyPlans')}}><h2>My Plans</h2></a>
                <p>Create your own custom workout plans. Add them to your schedule and share them with other users.</p>
                {!date && <button class="create-new plan"><i class="fas fa-plus"></i> Create New</button>}
                {myPlans}
                {loadMyPlans && <a href="javascript:void(0);" onClick={()=>{history.push(path+'/MyPlans')}} class="load-more-link">Load more...</a>}
            </div>
            <div className="plans-container">
            <a className="link-title" href="javascript:void(0);" onClick={()=>{history.push(path+'/AllPlans')}}><h2>Plans</h2></a>
                <p>If you don't want to bother with creating your own plans search plans that already exsist in app, add them to your schedule or save them for later.</p>
                {plans}
                {loadPlans && <a href="javascript:void(0);" onClick={()=>{history.push(path+'/AllPlans')}} class="load-more-link">Load more...</a>}
            </div>

        </div>
    );

}


//component for presenting Plans created by currently logged user
export const MyPlans=function (props){
    const [myPlans, setMyPlans] = useState("");
    const [date,setDate] = useState(false);

    const path=useRouteMatch();
    let history=useHistory();
    useEffect(() => {
          //checking if date on calendar is currently picked
          if(sessionStorage.getItem("date")){
            setDate(sessionStorage.getItem("date"));
        }

        //retriving list of all plans from database whose author is logged user
        axios.post('/api/my',{name:sessionStorage.getItem("username"),size:0,value:"plan"})
        .then(response => {
            //using createPlans function from workoutsPage script
            let res=CreatePlans(response.data.list,"plan",history,path);
            setMyPlans(res);
        }, error => {
            console.log(error);
        });
   },[]);

   function quitDate(){
    sessionStorage.removeItem("date");
    setDate(false);
}

    return(
        <div>
                  {date && <div class="date-message"><p>You are currently located in day:  <b>{  date}</b> </p>  <button className="cancel-date-button" onClick={quitDate}><i class="fas fa-times"></i> Quit</button></div>}
            <div className="plans-container load-all">
                <h2>My Plans</h2>
                <p>Create your own custom workout plans. Add them to your schedule and share them with other users.</p>
                {!date && <button class="create-new plan"><i class="fas fa-plus"></i> Create New</button>}
                {myPlans}
            </div>
        </div>
    );
}

//component for presenting all public plans
export const AllPlans=function(props){
    const [plans,setPlans] = useState("");
    const [date,setDate] = useState(false);

    let history=useHistory();
    const path=useRouteMatch();

    useEffect(() => {
         //checking if date on calendar is currently picked
         if(sessionStorage.getItem("date")){
            setDate(sessionStorage.getItem("date"));
        }

        //retreving list of  all public plans from databse
        axios.get('/api/all/?size='+0+'&value=plan')
        .then(response => {
            //using createPlans function from workoutsPage script
            let res=CreatePlans(response.data.list,"plan",history,path);
            setPlans(res);
        }, error => {
            console.log(error);
        });       
   },[]);

   function quitDate(){
    sessionStorage.removeItem("date");
    setDate(false);
}   

   return(
    <div>
             {date && <div class="date-message"><p>You are currently located in day:  <b>{  date}</b> </p>  <button className="cancel-date-button" onClick={quitDate}><i class="fas fa-times"></i> Quit</button></div>}
        <div className="plans-container load-all">
            <h2>Plans</h2>
            <p>If you don't want to bother with creating your own plans search plans that already exsist in app, add them to your schedule or save them for later.</p>
            {plans}
        </div>

    </div>
);
}