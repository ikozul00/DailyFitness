import React from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { createTags,addToDB } from './workoutsPage';
import './styles/plan.css';

export const Plan=function (props) {
    const {title,author}=useParams();
    const [err,setErr]=useState(false);
    const [description,setDescription]=useState("");
    const [cal,setCal]=useState(0);
    const [tags,setTags]=useState("");
    const [exercise,setExercise]=useState("");
    const [pickedDate,setPickedDate] = useState(false);

    let history=useHistory();

    useEffect(() => {
        axios.get('/api/plan/?title='+title+'&author='+author)
        .then(response => {
            console.log(response.data);
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
                    <button className="add-button" onClick={()=>{addToDB("plan",title,author,history)}}>Add</button>
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