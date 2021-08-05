import axios from 'axios';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useState } from 'react';
import './styles/exercise.css';
import { createTags } from './workoutsPage';

export const Exercise= function () {
    const {title,author}=useParams();
    const [err,setErr]=useState(false);
    const [content,setContent]=useState("");
    const [cal,setCal]=useState(0);
    const [tags,setTags]=useState("");
    const [date,setDate] = useState(false);
    
    useEffect(() => {
        axios.get('/api/exercise/?title='+title+'&author='+author)
        .then(response => {
            console.log(response.data);
            if(response.data.exercise===null){
                setErr(true);
            }
            else{
                setErr(false);
                setContent(response.data.exercise.content);
                setCal(response.data.exercise.calories);
                setTags(createTags(response.data.exercise.tags));
            }
        },error =>{
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
                {date && <div class="date-message"><p>You are currently located in day:  <b>{  date}</b> </p>  <button className="cancel-date-button" onClick={quitDate}><i class="fas fa-times"></i> Quit</button></div>}
                <div className="first-exercise-container">
                    <h1 className="exercise-title">{title}</h1>
                    <h3 className="exercise-author">by {author}</h3>
                </div>
                <div className="exercise-info">
                    <p>Burns:</p>
                    <div className="exercise-cal">
                        <p>{cal} cal</p>
                    </div>
                <div className="tags-container-exercise">{tags}</div>
                </div>
                <p className="exercise-content">{content}</p>

            </div>
        );
    }
    
}