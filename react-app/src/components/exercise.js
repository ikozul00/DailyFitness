import axios from 'axios';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useState } from 'react';
import './styles/exercise.css';
import { createTags } from './workoutsPage';
import { useHistory } from 'react-router-dom';
import { DeleteItem } from './plan';
import CostumCalendar from './calendar';

export const Exercise= function () {
    const {title,author}=useParams();
    const [err,setErr]=useState(false);
    const [content,setContent]=useState("");
    const [cal,setCal]=useState(0);
    const [tags,setTags]=useState(false);
    const [picture, setPicture] = useState("");
    const [date,setDate] = useState(false);
    const [privateEx,setPrivateEx] = useState(false);
    const [plan,setPlan] = useState(false);
    const [selectedValue,setSelectedValue] = useState("sec");
    const [duration,setDuration] = useState(0);
    const [formMessage,setFromMessage]= useState(false);
    const [calendarButton,setCalendarButton] = useState(true);
    const [formDisplay,setFormDisplay] = useState(false);
    const [planCreating, setPlanCreating] = useState(false);
    const [tagsText, setTagsText] = useState([]);
    const [shortDescription, setShortDescription] = useState("");
    const [displayDelete, setDisplayDelete] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(false);
    const [heartIcon, setHeartIcon] = useState("far");
    const [exerciseId, setExerciseId] = useState("");
    const[addToPlan,setAddToPlan] = useState(false);
    const[calendarDisplay,setCalendarDisplay] = useState(false);
    const[startDate,setStartDate] = useState(new Date());

    let history=useHistory();
    
    useEffect(() => {
        axios.get('/api/exercise/?title='+title+'&author='+author+'&user='+sessionStorage.getItem("username"))
        .then(response => {
            if(response.data.exercise===null){
                setErr(true);
            }
            else{
                setErr(false);
                setContent(response.data.exercise.content);
                setCal(response.data.exercise.calories);
                setTagsText(response.data.exercise.tags);
                setTags(response.data.exercise.tags[0]===null ? false : createTags(response.data.exercise.tags));
                setPrivateEx(response.data.exercise.privateEx);
                setShortDescription(response.data.exercise.description);
                setExerciseId(response.data.exercise.exerciseId);
                setPicture(response.data.exercise.img===null ? "/images/no-image-found-360x250.png" : response.data.exercise.img);
                if(response.data.exercise.favorite){
                    setHeartIcon("fas");
                }
                else{
                    setHeartIcon("far");
                }
            }
        },error =>{
            console.log(error);
        });

         //checking if date on calendar is currently picked
         if(sessionStorage.getItem("date")){
            setDate(sessionStorage.getItem("date"));
            setAddToPlan(false);
        }

        if(sessionStorage.getItem("plan") || sessionStorage.getItem("planCreating")){
            setCalendarButton(false);
        }

        if(sessionStorage.getItem("username") === author && !sessionStorage.getItem("date") && !sessionStorage.getItem("plan") && !sessionStorage.getItem("planCreating")){
            setDisplayDelete(true);
        }

         //checking if user is currenly adding exercises to some plan
        if(sessionStorage.getItem("plan")){
            setPlan(JSON.parse(sessionStorage.getItem("plan")));
            setAddToPlan(true);
        }
        else if(sessionStorage.getItem("planCreating")){
            setPlanCreating(JSON.parse(sessionStorage.getItem("planCreating")));
            setAddToPlan(true);
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
            axios.post("/api/modify/plan",{"title":plan.title,"author":plan.author,"exAuthor":author,"exTitle":title,"length":duration,"measure":selectedValue})
            .then(response => {
                if(response.data.exists){
                    alert(`Exercise '${title}' is already a part of plan '${plan.title}'.`);
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
            if(planCreating.exercises===""){
                planCreating.exercises=[];
            }
            let exist=false;
            for(let i=0;i<planCreating.exercises.length;i++){
                if(title===planCreating.exercises[i].title && author===planCreating.exercises[i].author){
                    exist=true;
                }
            }
            if(exist){
                alert(`Exercise '${title}' has already been added to plan '${planCreating.title}'. `);
            }
            else{
                let exercise={};
                exercise.title=title;
                exercise.author=author;
                exercise.cal=cal;
                exercise.private=privateEx;
                exercise.content=content;
                exercise.lengthEx=duration;
                exercise.measure=selectedValue;
                exercise.description=shortDescription;
                exercise.content=content;
                exercise.picture=picture;
                exercise.tags=[];
                exercise.tags.push(tagsText);
                planCreating.exercises.push(exercise);
                sessionStorage.setItem("planCreating",JSON.stringify(planCreating));
                history.push("/home/workout/plan/create");
            }
        }

    }

    function openForm(){
        setFormDisplay(true);
        setAddToPlan(false);
    }

    function cancelClicked(e){
        e.preventDefault();
        setFormDisplay(false);
        setAddToPlan(true);
    }

    function deleteExercise(){
        setDeleteMessage(true);
    }

    function onDeleteNo(){
        setDeleteMessage(false);
    }

    function onDeleteYes(){
        axios.delete("/api/delete/exercise/?name="+title+"&author="+author)
        .then(response => {
            if(response.data.success){
                history.goBack();
            }
            else{
                alert("Problem deleting exercise from database");
            }
        }, error => {
            console.log(error);
        });       
    }

    function heartIconClicked(e){
        let save=false;
        if(heartIcon==="far"){
            save=true;
        }
        else if(heartIcon==="fas"){
            save=false;
        }
        axios.post('/api/modify/exerciseSave',{exerciseId:exerciseId, save:save, user:sessionStorage.getItem("username")})
        .then(response => {
            if(save && response.data.success){
                setHeartIcon("fas");
            }
            else if(!save && response.data.success){
                setHeartIcon("far");
            }
            else{
                alert("Problem has occured!");
            }
        }, error => {
            console.log(error);
        });
    }

      //function which sends request to server to add exercise to certain date in calendar
      function addToCalendar(){
        if(date){
            addToDB(date);
        }
        else{
            setCalendarDisplay(true);
            setCalendarButton(false);
        }
    }

    function addToDB(date){
        axios.post('/api/add/exercise',{title:title, author:author,username:sessionStorage.getItem("username"), date:date})
        .then(response => {
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
        setCalendarButton(true);
        setCalendarDisplay(false);
    }

    

    if(err){
        return(
            <div>
                <p>Problem retriving info.</p>
            </div>
        );
    }
    else{
        return(
            <div className="exercise-main-container">
                {plan && <div class="date-message"><p>You are currently located in plan:  <b>{  plan.title}</b> </p>  <button className="cancel-date-button" onClick={quitPlan}><i class="fas fa-times"></i> Quit</button></div>}
                {planCreating && <div class="date-message"><p>You are currently located in creating plan:  <b>{  planCreating.title}</b> </p>  <button className="cancel-date-button" onClick={quitPlanCreating}><i class="fas fa-times"></i> Quit</button></div>}
                {date && <div class="date-message"><p>You are currently located in day:  <b>{  date}</b> </p>  <button className="cancel-date-button" onClick={quitDate}><i class="fas fa-times"></i> Quit</button></div>}
                {deleteMessage && <DeleteItem name={title} onDeleteYes={onDeleteYes} onDeleteNo={onDeleteNo} type="exercise"/>}
                
                <div className="first-exercise-container">
                    <div className="basic-exercise-info">
                    <h1 className="exercise-title">{title}</h1>
                    <h3 className="exercise-author">by {author}</h3>
                    <i class={`${heartIcon} fa-heart heart-icon`} onClick={heartIconClicked}></i>
                    </div>
                    <div className="second-exercise-container">
                    <img className="plan-page-image" src={picture}></img>
                    <div className="exercise-info">
                    {privateEx && <div className="private-container"><p className="private-text">PRIVATE</p></div>}
                    <p>burns <span className="exercise-cal">{cal}</span> calories</p>
                    {tags && <div className="tags-container-exercise"><b>Tags: </b>{tags}</div>}
                    <div id="description-container-exercise">
                        <h4 style={{marginTop:"0px"}}>Short description:</h4>
                        <p className="exercise-description"> {shortDescription}</p>
                    </div>
                    </div>
                    </div>
                    <div className="exercise-content-container">
                        <h3 className="title">Content:</h3>
                        <p className="exercise-content">{content}</p>
                    </div>

                </div>

                <div className="button-container">
                {displayDelete && <button onClick={deleteExercise} className="delete-button">DELETE</button>}
                
                {addToPlan && <button className="add-button" onClick={openForm}>Add to plan</button>}
                {formDisplay && <form className="add-to-plan-form">
                <p  className="form-description">Adding to plan: <b>{plan.title}</b></p>
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
              {calendarButton && <button className="add-button" onClick={()=>{addToCalendar()}}>Add to calendar</button>}
                    {calendarDisplay &&
                    <div className="plan-calendar-container">
                        <button onClick={closeCalendar} className="close-calendar"><i class="fas fa-times"></i></button>
                        <p className="calendar-text">Pick a date:</p>
                        <CostumCalendar startDate={startDate} monthChange={activeMonthChange} pickDay={daySelected} classAdd="small"/> 
                    </div>
                    }
                    </div>
                

            </div>
        );
    }
    
}