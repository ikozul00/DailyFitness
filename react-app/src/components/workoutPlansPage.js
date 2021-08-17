import axios from 'axios';
import React, {useState, useEffect} from 'react';
import { useHistory,useRouteMatch} from 'react-router-dom';
import './styles/workoutPage.css';
import {createTags} from './workoutsPage';
import CostumCalendar from './calendar';
import './styles/smallCalendar.css';

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
            let res=CreatePlans(response.data.list,history);
            setMyPlans(res);
        }, error => {
            console.log(error);
        });

        //retreving list of  all public plans from databse
        axios.get('/api/all/?size='+2+'&value=plan')
        .then(response => {
            //using createPlans function from workoutsPage script
            let res=CreatePlans(response.data.list,history);
            setPlans(res);
        }, error => {
            console.log(error);
        });

        //making side navbar button Plans look like it is selected
        props.handlerFunction("Workout plans");

        
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
    history.push("/home/date/"+date);
} 



    return(
        <div>
             {date && <div class="date-message"><p>You are currently located in day:  <b>{  date}</b> </p>  <button className="cancel-date-button" onClick={quitDate}><i class="fas fa-times"></i> Quit</button></div>}
            <div className="plans-container">
            <a className="link-title" href="javascript:void(0);" onClick={()=>{history.push(path+'/MyPlans')}}><h2>My Plans</h2></a>
                <p>Create your own custom workout plans. Add them to your schedule and share them with other users.</p>
                {!date && <button class="create-new plan" onClick={()=>{history.push("/home/workout/plan/create")}}><i class="fas fa-plus"></i> Create New</button>}
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
            let res=CreatePlans(response.data.list,history);
            setMyPlans(res);
        }, error => {
            console.log(error);
        });

        
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
    history.push("/home/date/"+date);
} 


    return(
        <div>
                  {date && <div class="date-message"><p>You are currently located in day:  <b>{  date}</b> </p>  <button className="cancel-date-button" onClick={quitDate}><i class="fas fa-times"></i> Quit</button></div>}
            <div className="plans-container load-all">
                <h2>My Plans</h2>
                <p>Create your own custom workout plans. Add them to your schedule and share them with other users.</p>
                {!date && <button class="create-new plan" onClick={()=>{history.push("/home/workout/plan/create")}}><i class="fas fa-plus"></i> Create New</button>}
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
    history.push("/home/date/"+date);
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


 //creating list of plan by displaying every plan in its div
 export const CreatePlans=function CreatePlans(plans,history){
    if(plans.length===0){
        return(<div>
            <p>No results found.</p>
        </div>);
    }
    let result = plans.map((x) => {
        return(
         <ShortPlan tags={x.tags} title={x.title} username={x.username} description={x.description} calories={x.calories} history={history} private={x.private}/>
        );

    });
    return result;
}

//functional component which creates short description of a plan, and displays it in a list
function ShortPlan(props){
    const[calendarDisplay,setCalendarDisplay] = useState(false);
    const[startDate,setStartDate] = useState(new Date());
    const[addButton,setAddButton] = useState(true);
    let history=useHistory();

    let tags=createTags(props.tags);
    let linkStr="/home/workout/plan/open/"+props.title+"/"+props.username;

    //function which sends request to server to add plan to certain date in calendar
    function addToCalendar(title,author){
        let date=sessionStorage.getItem("date");
    if(date){
       addToDB(date,title,author);
    }
    else{
        setCalendarDisplay(true);
        setAddButton(false);
    }
    }


    function addToDB(date,title,author){
        axios.post('/api/add/plan',{title:title, author:author,username:sessionStorage.getItem("username"), date:date})
        .then(response => {
            if(response.data.status){
                    history.push("/home/date/"+date);
            }
            else{
                if(response.data.exists){
                    alert("Already added to calendar!");
                }
                else{
                    alert("Problem while adding plan to calendar! Try later.");
                }
            }
        }, error => {
            console.log(error);
        });
    }

    //changing month that is displayed
    function activeMonthChange(value){
        setStartDate(value.activeStartDate);
    }

    //selecting a day
    function daySelected(value,event){
        let pickedDay=value.toDateString();
        //getting clicked planContainer
        let item=event.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
        if(item.classList.contains("plans-calendar-container")){
            item=item.parentElement;
        }
        let title=item.querySelector(".plan-title").innerHTML;
        let author=item.querySelector(".plan-author").innerHTML;
        addToDB(pickedDay,title,author);
      }

    function closeCalendar(){
        setCalendarDisplay(false);
        setAddButton(true);
    }

    return(
        <div class="plan-container">
           <a className="plan-title" href="javascript:void(0);" onClick={()=>{history.push(linkStr)}}>{props.title}</a>
           <p>by <span className="plan-author">{props.username}</span></p>
            <p>{props.description}</p>
            <p>{props.calories} cal</p>  
            {props.private && <p>PRIVATE</p>}
            {calendarDisplay &&
            <div className="plans-calendar-container">
                <p>Pick a date:</p>
                <button onClick={closeCalendar}>Close</button>
                <CostumCalendar startDate={startDate} monthChange={activeMonthChange} pickDay={daySelected} classAdd="small"/> 
            </div>
            }
            <div className="tags-container">{tags}</div>
          {addButton && <button className="add-button" onClick={()=>{addToCalendar(props.title,props.username)}}>Add</button>}


        </div>
       );
}