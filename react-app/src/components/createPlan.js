import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { createTags } from "./workoutsPage";

export const NewPlan = function NewPlan(){

    const [tagsChosen,setTagsChosen] = useState([]);
    const [title, setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [calories,setCalories] = useState("");
    const [privatePlan,setPrivatePlan] = useState(false);
    const [calError,setCalError] = useState("");
    const [formMessage,setFormMessage] = useState("");
    const [exercisesText,setExercisesText] = useState("");

    let history= useHistory();


    useEffect(() => {
        let plan=JSON.parse(sessionStorage.getItem("planCreating"));
        if(plan){
            setTitle(plan.title);
            setDescription(plan.description);
            setCalories(plan.calories);
            setPrivatePlan(plan.private);
            setClickedTags(plan.tags);
            setTagsChosen(plan.tags);
            setExercisesText(plan.exercises);
        }
    },[]);

    function tagClicked(e){
        e.preventDefault();
        let str=e.target.innerText.toLowerCase();
        let tags=tagsChosen.slice();
        if(!e.target.classList.contains("clicked")){
            e.target.classList.add("clicked");
            tags.push(str);
            setTagsChosen(tags);
        }
        else{
            let position=tags.indexOf(str);
            tags.splice(position,1);
            e.target.classList.remove("clicked");
            setTagsChosen(tags);
        }
    }


    function setClickedTags(tags){
        for(let i=0;i<tags.length;i++){
            let tag=tags[i].replace("_"," ");
            let item=document.querySelector("."+tag);
            if(!item.classList.contains("clicked")){
                item.classList.add("clicked");
            }
        }
    }

    function handleChange(event){
        const name=event.target.name;
        const value=event.target.value;
        switch(name){
            case "title":
                setTitle(value);
                break;
            case "calories":
                if(value===""){
                    setCalError("");
                    setCalories("");
                }
                else if(value.indexOf(".")!==-1 || value.indexOf(",")!==-1 || isNaN(value[value.length-1])){
                    setCalError("*input must be a non-decimal number");
                    setCalories(value);
                }
                else{
                    setCalories(parseInt(value));
                    setCalError("");
                }
                break;
            case "description":
                setDescription(value);
                break;
            case "private":
                setPrivatePlan(event.target.checked);
                break;
            default:
                console.log("Problem in switch-case, in createPlan");
        }
    }

    function formValidation(){
        return new Promise((resolve,reject) => {
            let message="Please enter";
            let valid=true;
            if(title.length===0){
                message+=" title,";
                valid=false;
            }
            if(calories.length===0){
                message+=" number of calories,";
                valid=false;
            }
            if(description.length===0){
                message+=" short description,";
                valid=false;
            }
            if(!valid){
                message=message.slice(0,message.length-1);
                message+='.';
                if(calError!==""){
                    message=message+"\nCalories must be expressed in non-decimal number.";
                }
                setFormMessage(message);
            }
            else{
                if(calError!==""){
                    message="Calories must be expressed in non-decimal number.";
                    setFormMessage(message);
                    valid=false;
                }
                else{
                    setFormMessage("");
                }
            }
            resolve(valid);
        });
    }


    async function handleSave(e){
        e.preventDefault();
        let valid= await formValidation();
        if(valid){
            axios.post("/api/create/plan",{"title":title,"description":description,"cal":calories,"author":sessionStorage.getItem("username"),"private":privatePlan,"tags":tagsChosen,"exercises":exercisesText})
            .then(response => {
                if(response.data.exists){
                    setFormMessage("Plan with that title already exists!");
                }
                else{
                    if(!response.data.success){
                        alert("Problem has occured while adding plan to datbase. Try again later!");
                    }
                    else{
                        sessionStorage.removeItem("planCreating");
                        history.push("/home/workout/plan/open/"+title+"/"+sessionStorage.getItem("username"));
                    }
                }
            },error => {
                console.log(error);
            });
        }
    }

    function addExerciseClicked(e){
        e.preventDefault();
        let plan={};
        if(privatePlan===undefined){
            plan.private=false;
        }
        else{
            plan.private=privatePlan;
        }
        plan.title=title;
        plan.calories=calories;
        plan.description=description;
        plan.tags=tagsChosen;
        plan.exercises=exercisesText;
        sessionStorage.setItem("planCreating",JSON.stringify(plan));
        history.push('/home/workout/exercise');
    }

    function createExercisesList(exercises){
        if(exercises.length===0){
            return (<div></div>);
        }
        else{
            let result= exercises.map((x) => {
                let tags=createTags(x.tags);
                return(
                    <div class="plan-container">
                        <p className="exerciseInPlan-title">{x.title}</p>
                        <p>{x.author}</p>
                        <p>{x.cal}</p>
                        <p>{x.description}</p>
                        <p>{x.content}</p>
                        <div>{tags}</div>
                        <p>{x.lengthEx}</p>
                        <p>{x.measure}</p>
                        <button onClick={deleteExercise}>Cancel</button>
                    </div>
                );
            });
            return result;
        }
    }

    function deleteExercise(e){
        e.preventDefault();
        let item=e.target.parentElement;
        let title=item.querySelector(".exerciseInPlan-title").innerText;
        let exercisesModified = [];
        for(let i=0;i<exercisesText.length;i++){
            if(title!==exercisesText[i].title){
                exercisesModified.push(exercisesText[i]);
            }
        }
        setExercisesText(exercisesModified);
    }

    function cancelClicked(e){
        e.preventDefault();
        sessionStorage.removeItem("planCreating");
        history.push("/home/workout/plans");
    }



    return(
        <div className="new-exercise-container">
            <form id="new-exercise-form">
                <h4>Create New Plan</h4>
                <div className="form-field">
                <label for="title">Title: </label>
                <input type="text" id="title" name="title" value={title} onChange={handleChange}/>
                </div>
                <div className="form-field">
                <label for= "calories">Burns (cal):</label>
                <input type="text" id="calories" name="calories" value={calories} onChange={handleChange}/>
                <div><span>{calError}</span></div>
                </div>
                <div className="form-field">
                <lable for="description">Short description: </lable>
                <textarea name="description" id="description" value={description} onChange={handleChange}/>
                </div>
                <div className="form-field checkbox">
                <label for = "private">Private: </label>
                <input type="checkbox" name="private" id="private" checked={privatePlan} onChange={handleChange}/>
                </div>
                <div>* if you put plan on private only you will be able to see it and add it to your calendar</div>
                <div>
                    <p>Tags: </p>
                <div className="workout-categorie">
                        <p>Difficulty:</p>
                        <div className="workout-buttons-container">
                        <button className="workout-categorie-button easy" onClick={tagClicked}>Easy</button>
                        <button className="workout-categorie-button medium" onClick={tagClicked}>Medium</button>
                        <button className="workout-categorie-button hard" onClick={tagClicked}>Hard</button>
                        </div>
                    </div>
                    <div className="workout-categorie">
                        <p>Body part:</p>
                        <div className="workout-buttons-container">
                        <button className="workout-categorie-button arms" onClick={tagClicked}>Arms</button>
                        <button className="workout-categorie-button back" onClick={tagClicked}>Back</button>
                        <button className="workout-categorie-button chect" onClick={tagClicked}>Chest</button>
                        <button className="workout-categorie-button core" onClick={tagClicked}>Core</button>
                        <button className="workout-categorie-button abs" onClick={tagClicked}>Abs</button>
                        <button className="workout-categorie-button booty" onClick={tagClicked}>Booty</button>
                        </div>
                    </div>
                    <div className="workout-categorie">
                        <p>Type:</p>
                        <div className="workout-buttons-container">
                        <button className="workout-categorie-button warm_up" onClick={tagClicked}>Warm up</button>
                        <button className="workout-categorie-button cardio" onClick={tagClicked}>Cardio</button>
                        <button className="workout-categorie-button stretching" onClick={tagClicked}>Stretching</button>
                        <button className="workout-categorie-button strength" onClick={tagClicked}>Strength</button>
                        </div>
                    </div>
                </div>
                {createExercisesList(exercisesText)}
                <button onClick={addExerciseClicked}>Add Exercise</button>
                <div><span>{formMessage}</span></div>
                <input type="submit" value="Save" onClick={handleSave}/>
                <button onClick={cancelClicked}>Cancel</button>    
            </form>
        </div>
    );
}
