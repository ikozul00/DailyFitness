import axios from 'axios';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useState } from 'react';
import './styles/exercise.css';
import { createTags } from './workoutsPage';
import { useHistory } from 'react-router-dom';
import { DeleteItem } from './plan';

export const Exercise= function () {
    const {title,author}=useParams();
    const [err,setErr]=useState(false);
    const [content,setContent]=useState("");
    const [cal,setCal]=useState(0);
    const [tags,setTags]=useState("");
    const [date,setDate] = useState(false);
    const [privateEx,setPrivateEx] = useState(false);
    const [plan,setPlan] = useState(false);
    const [selectedValue,setSelectedValue] = useState("sec");
    const [duration,setDuration] = useState(0);
    const [formMessage,setFromMessage]= useState(false);
    const [addDisplay,setAddDisplay] = useState(false);
    const [formDisplay,setFormDisplay] = useState(false);
    const [planCreating, setPlanCreating] = useState(false);
    const [tagsText, setTagsText] = useState([]);
    const [shortDescription, setShortDescription] = useState("");
    const [displayDelete, setDisplayDelete] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(false);

    let history=useHistory();
    
    useEffect(() => {
        axios.get('/api/exercise/?title='+title+'&author='+author)
        .then(response => {
            if(response.data.exercise===null){
                setErr(true);
            }
            else{
                setErr(false);
                setContent(response.data.exercise.content);
                setCal(response.data.exercise.calories);
                setTagsText(response.data.exercise.tags);
                setTags(createTags(response.data.exercise.tags));
                setPrivateEx(response.data.exercise.privateEx);
                setShortDescription(response.data.exercise.description);
            }
        },error =>{
            console.log(error);
        });

         //checking if date on calendar is currently picked
         if(sessionStorage.getItem("date")){
            setDate(sessionStorage.getItem("date"));
        }

        if(sessionStorage.getItem("username") === author && !sessionStorage.getItem("date") && !sessionStorage.getItem("plan") && !sessionStorage.getItem("planCreating")){
            setDisplayDelete(true);
        }

         //checking if user is currenly adding exercises to some plan
        if(sessionStorage.getItem("plan")){
            setPlan(JSON.parse(sessionStorage.getItem("plan")));
            setAddDisplay(true);
        }
        else if(sessionStorage.getItem("planCreating")){
            setPlanCreating(JSON.parse(sessionStorage.getItem("planCreating")));
            setAddDisplay(true);
        }


    },[]);

    function quitDate(){
        sessionStorage.removeItem("date");
        setDate(false);
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
            console.log(planCreating);
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
    }

    function cancelClicked(e){
        e.preventDefault();
        setFormDisplay(false);
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
                {displayDelete && <button onClick={deleteExercise}>Delete</button>}
                {deleteMessage && <DeleteItem name={title} onDeleteYes={onDeleteYes} onDeleteNo={onDeleteNo} type="exercise"/>}
                {addDisplay && <button className="add-button" onClick={openForm}>Add</button>}
                {formDisplay && <form>
                <p>Adding to plan: {plan.title} by {plan.author}</p>
                <label>Duration:
                    <input type="text" name="lenght" id="lenght" value={duration} onChange={handleTextChange}/>
                    <select value={selectedValue} onChange={handleSelectChange}>
                        <option value="times">times</option>
                        <option value="sec">sec</option>
                        <option value="min">min</option>
                    </select>
                 </label>
                 <div><span>{formMessage}</span></div>
                 <input type="submit" value="Add" onClick={addExercise}/>
                 <button onClick={cancelClicked}>Cancel</button> 
            </form>
            }       
                <div className="first-exercise-container">
                    <h1 className="exercise-title">{title}</h1>
                    <h3 className="exercise-author">by {author}</h3>
                    {privateEx && <div>PRIVATE</div>}
                </div>
                <div className="exercise-info">
                    <p>Burns:</p>
                    <div className="exercise-cal">
                        <p>{cal} cal</p>
                    </div>
                <div className="tags-container-exercise">{tags}</div>
                </div>
                <p className="exercise-description"> {shortDescription}</p>
                <p className="exercise-content">{content}</p>

            </div>
        );
    }
    
}