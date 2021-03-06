import axios from 'axios';
import React, {useState, useEffect} from 'react';
import { useHistory} from 'react-router-dom';
import {createTags} from './workoutsPage';
import CostumCalendar from './calendar';

//function component for displaying Exercises page
export const Exercises = function(props){
const [myExercises,setMyExercises]=useState("");
const[exercises,setExercises]=useState("");
const[loadExercises,setLoadExercises]=useState(true);
const[loadMyExercises,setLoadMyExercises]=useState(true);
const [date,setDate] = useState(false);
const [plan,setPlan] = useState(false);
const [planCreating, setPlanCreating] = useState(false);

let history=useHistory();
const path=history.location.pathname;

    //call only when component is mounting
    useEffect(() => {
            //retriving list of all exercises from database whose author is logged user
            axios.post('/api/my',{name:sessionStorage.getItem("username"),size:2,value:"exercise"})
            .then(response => {
                let res=CreateExercises(response.data.list,history);
                setMyExercises(res);
            }, error => {
                console.log(error);
            });
    
            //retreving list of  all public plans from databse
            axios.get('/api/all/?size='+2+'&value=exercise')
            .then(response => {
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
        //checking if user is currenly adding exercises to some plan
        if(sessionStorage.getItem("plan")){
            setPlan(JSON.parse(sessionStorage.getItem("plan")));
        }

        else if(sessionStorage.getItem("planCreating")){
            setPlanCreating(JSON.parse(sessionStorage.getItem("planCreating")));
        }


   },[]);

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
              {planCreating && <div class="date-message"><p>You are currently adding exercises to plan:  <b>{  planCreating.title}</b> </p>  <button className="cancel-date-button" onClick={quitPlanCreating}><i class="fas fa-times"></i> Quit</button></div>}
           {date && <div class="date-message"><p>You are currently located in day:  <b>{  date}</b> </p>  <button className="cancel-date-button" onClick={quitDate}><i class="fas fa-times"></i> Quit</button></div>}
            <div className="plans-container">
            <a className="link-title" href="javascript:void(0);" onClick={()=>{history.push(path+'/MyExercises')}}><h2>My Exercises</h2></a>
                <p>Create your own custom exercises which you can then orginize in plans. Add them to your workout plans and share them with other users.</p>
                {!date && !plan && !planCreating && <button class="create-new plan" onClick={()=>{history.push(path+'/create')}}><i class="fas fa-plus"></i> Create New</button>}
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
    const [plan,setPlan] = useState(false);
    const [planCreating, setPlanCreating] = useState(false);

    let history=useHistory();

     //call only when component is mounting
     useEffect(() => {
        //retreving list of  all public plans from databse
        axios.get('/api/all/?size='+0+'&value=exercise')
        .then(response => {
            let res=CreateExercises(response.data.list,history);
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

        else if(sessionStorage.getItem("planCreating")){
            setPlanCreating(JSON.parse(sessionStorage.getItem("planCreating")));
        }
},[]);

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
              {planCreating && <div class="date-message"><p>You are currently adding exercises to plan:  <b>{  planCreating.title}</b> </p>  <button className="cancel-date-button" onClick={quitPlanCreating}><i class="fas fa-times"></i> Quit</button></div>}
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
    const [plan,setPlan] = useState(false);
    const [planCreating, setPlanCreating] = useState(false);

    let history=useHistory();

     //call only when component is mounting
     useEffect(() => {
        //retriving list of all exercises from database whose author is logged user
        axios.post('/api/my',{name:sessionStorage.getItem("username"),size:0,value:"exercise"})
        .then(response => {
            let res=CreateExercises(response.data.list,history);
            setMyExercises(res);
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

        else if(sessionStorage.getItem("planCreating")){
            setPlanCreating(JSON.parse(sessionStorage.getItem("planCreating")));
        }
    },[]);

    useEffect(() => {
        if(props.setChoosen!==undefined){
            props.setChoosen(false,"My Exercises");
           }
    });

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
            {date && <div class="date-message"><p>You are currently located in day:  <b>{  date}</b> </p>  <button className="cancel-date-button" onClick={quitDate}><i class="fas fa-times"></i> Quit</button></div>}
            {plan && <div class="date-message"><p>You are currently located in plan:  <b>{  plan.title}</b> </p>  <button className="cancel-date-button" onClick={quitPlan}><i class="fas fa-times"></i> Quit</button></div>}
            {planCreating && <div class="date-message"><p>You are currently adding exercises to plan:  <b>{  planCreating.title}</b> </p>  <button className="cancel-date-button" onClick={quitPlanCreating}><i class="fas fa-times"></i> Quit</button></div>}
            <div className="plans-container load-all">
            <h2>My Exercises</h2>
                <p>Create your own custom exercises which you can then orginize in plans. Add them to your workout plans and share them with other users.</p>
                {!date && !plan && !planCreating && <button class="create-new plan" onClick={()=>{history.push("/home/workout/exercise/create")}}><i class="fas fa-plus"></i> Create New</button>}
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
        if(x.picture===null){
            x.picture="/images/no-image-found-360x250.png";
        }
        return(
        <ShortExercise title={x.title} username={x.username} description={x.description} calories={x.calories} private={x.private} tags={x.tags} picture={x.picture}/>
        );

    });
    return result;
}


function ShortExercise(props){
    const [formDisplay,setFormDisplay] = useState(false);
    const [addToPlan,setAddToPlan] = useState(false);
    const [plan,setPlan] = useState({});
    const [selectedValue,setSelectedValue] = useState("sec");
    const [duration,setDuration] = useState(0);
    const [formMessage,setFromMessage]= useState(false);
    const [planCreating, setPlanCreating] = useState(false);
    const [privateExercise,setPrivateExercise] = useState(false);
    const[calendarDisplay,setCalendarDisplay] = useState(false);
    const[startDate,setStartDate] = useState(new Date());
    const[addButton,setAddButton] = useState(true);

    let history=useHistory();

    let tags=props.tags.length===0 ? false : createTags(props.tags);
    let linkStr="/home/workout/exercise/open/"+props.title+"/"+props.username;

    useEffect(() => {
        if(sessionStorage.getItem("plan")){
            setAddButton(false);
            setAddToPlan(true);
            setPlan(JSON.parse(sessionStorage.getItem("plan")));
        }

        if(sessionStorage.getItem("planCreating")){
            setAddButton(false);
            setAddToPlan(true);
            setPlanCreating(JSON.parse(sessionStorage.getItem("planCreating")));
        }

        setPrivateExercise(props.private);
    }, []);

    //function which sends request to server to add exercise to certain date in calendar
    function addToCalendar(){
        let date=sessionStorage.getItem("date");
        if(date){
            addToDB(date);
        }
        else{
            setCalendarDisplay(true);
            setAddButton(false);
        }
    }

    function addToDB(date){
        axios.post('/api/add/exercise',{title:props.title, author:props.username,username:sessionStorage.getItem("username"), date:date})
        .then(response => {
            console.log(response);
            if(response.data.status){
                    history.push("/home/date/"+date);
            }
            else{
                if(response.data.exists){
                    alert("Already added to calendar!");
                }
                else{
                    alert("Problem while adding exercise to calendar! Try later.");
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
        addToDB(pickedDay);
      }

    function closeCalendar(){
        setCalendarDisplay(false);
        setAddButton(true);
    }


    function handleSelectChange(event){
        setSelectedValue(event.target.value);
    }

    function handleTextChange(event){
        let value=event.target.value;
        if(value==""){
            setFromMessage("");
            setDuration("");
        }
        else if(value.indexOf(".")!==-1 || value.indexOf(",")!==-1 || isNaN(value[value.length-1])){
            setFromMessage("*input must be a non-decimal number");
            setDuration(value);
        }
        else{
            setFromMessage("");
            setDuration(parseInt(value));
        }
    }

    function addExercise(event){
        event.preventDefault();
        if(plan.title){
            //accessing container which contains exercise we want to add to plan
            // let item=event.target.parentElement.parentElement;
            // let exTitle=item.querySelector(".exercise-title").innerHTML;
            // let exAuthor=item.querySelector(".exercise-author").innerHTML;
            axios.post("/api/modify/plan",{"title":plan.title,"author":plan.author,"exAuthor":props.username,"exTitle":props.title,"length":duration,"measure":selectedValue})
            .then(response => {
                if(response.data.exists){
                    alert(`Exercise '${props.title}' is already a part of plan '${plan.title}'.`);
                }
                else{
                    if(response.data.success){
                        history.push("/home/workout/plan/open/"+plan.title+"/"+plan.author);
                        sessionStorage.removeItem("plan");
                    }
                    else{
                        alert("Problem adding exercise to plan. Try again later!");
                    }
                }
            },error =>{
                console.log(error);
            });
        }
        else if(planCreating.title || planCreating.title===""){
            console.log(planCreating);
            let exercise={};
            //accessing container which contains exercise we want to add to plan
            let item=event.target.parentElement.parentElement.parentElement;
            console.log(item);
            exercise.title=item.querySelector(".exercise-title").innerHTML;
            exercise.author=item.querySelector(".exercise-author").innerHTML;
            exercise.cal=item.querySelector(".exercise-cal").innerHTML;
            exercise.private=privateExercise;
            exercise.lengthEx=duration;
            exercise.measure=selectedValue;
            exercise.description=item.querySelector(".exercise-description").innerHTML;
            exercise.picture=props.picture;
            let exTags=item.querySelectorAll(".tag-text");
            exercise.tags=[];
            exTags.forEach(element => {
                exercise.tags.push(element.innerHTML);
            });
            axios.get("/api/exercise/description?title="+exercise.title+"&author="+exercise.author)
            .then(response => {
                if(response.data.content){
                    exercise.content=response.data.content;
                    planCreating.exercises.push(exercise);
                    sessionStorage.setItem("planCreating",JSON.stringify(planCreating));
                    history.push("/home/workout/plan/create");
                }
                else{
                    alert("Trouble adding exercise to plan. Try again later!");
                }
            }, error => {
                console.log(error);
            });
        }
    }

    function openForm(){
        setFormDisplay(true);
    }

    function cancelClicked(e){
        e.preventDefault();
        setFormDisplay(false);
    }
   
    return(
        <div class="plan-container">
            <div className="first-container">
            <div className="image-container">
            <img src={props.picture} className="list-picture"></img>
            </div>
            <div>
           <a href="javascript:void(0);" className="exercise-title" onClick={()=>{history.push(linkStr)}}>{props.title}</a>
           <p>by <span className="exercise-author">{props.username}</span></p>
           <p>burns <span className="exercise-cal">{props.calories}</span> calories</p>
           {privateExercise && <div className="private-container"><p>PRIVATE</p></div>}
            <p className="exercise-description">{props.description}</p>
            {tags && <div className="tags-container">Tags: {tags}</div>}
            </div>
            </div>

            <div className="additional-info">
            {addToPlan && !formDisplay && <button className="add-button-to-plan" onClick={openForm}>Add to plan</button>}
            {formDisplay && <form className="add-to-plan-form">
                <p className="form-description">Adding to plan: <b>{plan.title}</b></p>
                <label>Duration:
                    <input type="text" name="lenght" id="lenght" value={duration} onChange={handleTextChange} className="exercise-duration"/>
                    <select value={selectedValue} onChange={handleSelectChange} className="exercise-measure">
                        <option value="times">times</option>
                        <option value="sec">sec</option>
                        <option value="min">min</option>
                    </select>
                 </label>
                 <div><span>{formMessage}</span></div>
                 <input type="submit" value="ADD" onClick={addExercise} className="add-exercise"/>
                 <button onClick={cancelClicked} className="cancel-adding">QUIT</button> 
            </form>
            }    
            <div className="add-to-calendar"> 
            {addButton && <button className="add-button" onClick={addToCalendar}>Add to calendar</button>}   
            {calendarDisplay &&
            <div className="exercise-calendar-container">
                <p className="calendar-description">Pick a date:</p>
                <button onClick={closeCalendar} className="close-calendar"><i class="fas fa-times"></i></button>
                <CostumCalendar startDate={startDate} monthChange={activeMonthChange} pickDay={daySelected} classAdd="small"/> 
            </div>
            }  
            </div>  
            </div>
              
        </div>
       );

}