import React from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { createTags} from './workoutsPage';
import './styles/plan.css';
import CostumCalendar from './calendar';

export const Plan=function (props) {
    const {title,author}=useParams();
    const [err,setErr]=useState(false);
    const [description,setDescription]=useState("");
    const [cal,setCal]=useState(0);
    const [tags,setTags]=useState("");
    const [exercise,setExercise]=useState("");
    const [pickedDate,setPickedDate] = useState(false);
    const[addButton,setAddButton] = useState(true);
    const[calendarDisplay,setCalendarDisplay] = useState(false);
    const[startDate,setStartDate] = useState(new Date());

    let history=useHistory();

    useEffect(() => {
        axios.get('/api/plan/?title='+title+'&author='+author)
        .then(response => {
            if(response.data.plan===null){
                setErr(true);
            }
            else{
                setErr(false);
                setDescription(response.data.plan.description);
                setCal(response.data.plan.calories);
                setTags(createTags(response.data.plan.tags));
                setExercise(createExercises(response.data.plan.exercise));
            }
        },error =>{
            console.log(error);
        });

          //checking if date on calendar is currently picked
          if(sessionStorage.getItem("date")){
            setPickedDate(sessionStorage.getItem("date"));
        }

    },[]);

     //function which sends request to server to add plan to certain date in calendar
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
        addToDB(pickedDay);
      }

    function closeCalendar(){
        setCalendarDisplay(false);
        setAddButton(true);
    }

    function createExercises(items){
        let br=0;
        let result=items.map((x) => {
            if(x!==null){
                br++;
                return(
                    <div className="plan-step-container">
                        <p>{br}.</p>
                        <p>{x.title}</p>
                        <p>by {x.username}</p>
                        <p>{x.calories} cal</p>
                        <p>{x.content}</p>
                        <p>{x.length} {x.measure}</p>
                    </div>
                );
            }
            else{
                return(<div></div>);
            }
        });
        return result;
    }

    function quitDate(){
        sessionStorage.removeItem("date");
        setPickedDate(false);
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
                {pickedDate && <div class="date-message"><p>You are currently located in day:  <b>{  pickedDate}</b> </p>  <button className="cancel-date-button" onClick={quitDate}><i class="fas fa-times"></i> Quit</button></div>}
                <div className="first-exercise-container">
                    <h1 className="exercise-title">{title}</h1>
                    <h3 className="exercise-author">by {author}</h3>
                    {addButton && <button className="add-button" onClick={()=>{addToCalendar()}}>Add</button>}
                    {calendarDisplay &&
                    <div className="plans-calendar-container">
                        <p>Pick a date:</p>
                        <button onClick={closeCalendar}>Close</button>
                        <CostumCalendar startDate={startDate} monthChange={activeMonthChange} pickDay={daySelected} classAdd="small"/> 
                    </div>
                    }
                </div>
                <div className="exercise-info">
                    <p>Burns:</p>
                    <div className="exercise-cal">
                        <p>{cal} cal</p>
                    </div>
                <div className="tags-container-exercise">{tags}</div>
                </div>
                <p className="exercise-content">{description}</p>
                <h4>Content:</h4>
                <div>{exercise}</div>

            </div>
        );
    }
}