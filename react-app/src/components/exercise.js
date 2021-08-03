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

    },[]);

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