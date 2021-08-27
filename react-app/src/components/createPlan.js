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
    const [exercisesText,setExercisesText] = useState([]);
    const [imagePlan,setImagePlan] = useState(false);
    const [imagePreview,setImagePreview] = useState(false);

    let history= useHistory();


    useEffect(() => {
        let plan=JSON.parse(sessionStorage.getItem("planCreating"));
        if(plan){
            console.log(plan.exercises);
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
            let tag=tags[i].replace(" ","_");
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
            let data= new FormData();
            if(imagePlan){
                data.append('planImg',imagePlan,imagePlan.name);
            }
            data.append("title",title);
            data.append("cal",calories);
            data.append("description",description);
            data.append("author",sessionStorage.getItem("username"));
            data.append("private",privatePlan);
            data.append("tags",JSON.stringify(tagsChosen));
            data.append("exercises",JSON.stringify(exercisesText));
            axios.post("/api/create/plan",data,{
                headers: {
                  "Content-Type": "multipart/form-data",
                }})
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
            let br=0;
            let result= exercises.map((x) => {
                if(x.picture===null){
                    x.picture="/images/no-image-found-360x250.png";
                }
                br++;
                return(
                    <div className="plan-step-container-main-new">
                    <div className="plan-step-container-new">
                         <div className="number-container">
                            <h2 style={{textDecoration:"none"}}>{br}.</h2>
                        </div>
                        <div className="img-container">
                        <img className="plan-step-image" src={x.picture}></img>
                        </div>
                        <div className="exercise-data-new">
                        <h2 className="exerciseInPlan-title">{x.title}</h2>
                        <h3 className="exercise-author">by <span className="exerciseInPlan-author">{x.author}</span></h3>
                        <p>burns <span className="cal"><b>{x.cal}</b></span> cal</p>
                        <h4>Short description:</h4>
                        <p className="description-text">{x.description}</p>   
                        </div>
                        <div className="repetition">
                            <p>{x.lengthEx} {x.measure}</p>
                        </div>
                        <button onClick={deleteExercise}>Cancel</button>
                        </div>
                        <div className="exercise-content-container">
                    <h4>Content:</h4>
                            <p className="content-text">{x.content}</p>
                    </div>
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

    //function called when file is uploaded
    function fileUploaded(e){
        setImagePlan(e.target.files[0]);
        setImagePreview(URL.createObjectURL(e.target.files[0]));
    }

      //removing upoladed image
      function closeImage(){
        setImagePlan(false);
        setImagePreview(false);
      }




    return(
        <div className="new-exercise-container">
            <form id="new-exercise-form">
                <div className="create-new-title">
                <h2>Create New Plan</h2>
                </div>
                <div className="form-field">
                <label for="title" className="form-text">Title: </label>
                <input type="text" id="title" name="title" value={title} onChange={handleChange}/>
                </div>
                <div className="form-field">
                <label for= "calories" className="form-text">Burns (cal):</label>
                <input type="text" id="calories" name="calories" value={calories} onChange={handleChange}/>
                <div><span>{calError}</span></div>
                </div>
                <div className="form-field">
                <lable for="description"  >Short description: </lable>
                <textarea name="description" rows="6" id="description" value={description} onChange={handleChange}/>
                </div>
                <div className="form-field checkbox">
                <label for = "private" className="form-text">Private: </label>
                <input type="checkbox" name="private" id="private" checked={privatePlan} onChange={handleChange}/>
                </div>
                <div className="private-message">* if you put the plan on private only you will be able to see it and add it to your calendar</div>
                <div>
                    <p className="form-text">Choose tags: </p>
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
                        <button className="workout-categorie-button legs" onClick={tagClicked}>Legs</button>
                        </div>
                    </div>
                    <div className="workout-categorie last">
                        <p>Type:</p>
                        <div className="workout-buttons-container">
                        <button className="workout-categorie-button warm_up" onClick={tagClicked}>Warm up</button>
                        <button className="workout-categorie-button cardio" onClick={tagClicked}>Cardio</button>
                        <button className="workout-categorie-button stretching" onClick={tagClicked}>Stretching</button>
                        <button className="workout-categorie-button strength" onClick={tagClicked}>Strength</button>
                        <button className="workout-categorie-button whole_body" onClick={tagClicked}>Whole body</button>
                        <button className="workout-categorie-button aerobic" onClick={tagClicked}>Aerobic</button>
                        </div>
                    </div>
                </div>
                <div className="added-exercises">
                    <div className="added-exercises-title">
                    <p className="form-text">Exercises:</p>
                    </div>
                {createExercisesList(exercisesText)}
                <button onClick={addExerciseClicked} className="add-exercise-button">Add Exercise</button>
                </div>
                <div>
                    <p className="form-text">Picture:</p>
                    {!imagePreview && <label class="custom-file-upload-new">
                <input type="file" onChange={fileUploaded} name="image"/>
                Upload picture
                </label>}
                {imagePreview && <div className="new-picture-container"><img src={imagePreview} className="image-upload-exercise"/>
                <button onClick={closeImage} className="close-button">Remove image</button>
                </div>
                }
                </div>
                { (formMessage!=="") && <div className="form-error-message"><span>{formMessage}</span></div>}
                <div className="button-container-new">
                <input type="submit" value="Save" onClick={handleSave} className="save-button"/>
                <button onClick={cancelClicked} className="cancel-button">Cancel</button>    
                </div>
            </form>
        </div>
    );
}
