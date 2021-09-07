import './styles/createNew.css';
import React from 'react';
import{ useEffect, useState} from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';

export const NewExercise=function CreateExercise()
{
    const [title,setTitle] = useState("");
    const [calories,setCalories] = useState("");
    const [description,setDescription] = useState("");
    const [content,setContent] = useState("");
    const [calError,setCalError] = useState("");
    const [formMessage,setFormMessage] = useState("");
    const [privateEx, setPrivateEx] = useState(false);
    const [tagsChosen,setTagsChosen] = useState([]);
    const [imageEx,setImageEx] = useState(false);
    const [imagePreview,setImagePreview] = useState(false);

    let history=useHistory();

    useEffect(() => {
         //if some plan was previosy picked, reminding user
         if(sessionStorage.getItem("plan")){
            history.push("/home/workout/exercise/cancel");
          }
  
          //if there is plan in memory that is currently creating, remind user
          if(sessionStorage.getItem("planCreating")){
            history.push("/home/workout/plan/cancel");
          }
    });

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
            case "content":
                setContent(value);
                break;
            case "private":
                setPrivateEx(event.target.checked);
                break;
            default:
                console.log("Problem in switch-case, in createExercise");
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
            if(content.length===0){
                message+=" text,";
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
        let valid = await formValidation();
        if(valid){
            let data= new FormData();
            if(imageEx){
                data.append('exerciseImg',imageEx,imageEx.name);
            }
            data.append("title",title);
            data.append("calories",calories);
            data.append("description",description);
            data.append("username",sessionStorage.getItem("username"));
            data.append("private",privateEx);
            data.append("tags",JSON.stringify(tagsChosen));
            data.append("content",content);
            axios.post('/api/create/exercise',data,{
                headers: {
                  "Content-Type": "multipart/form-data",
                }})
            .then(response => {
                if(response.data.exists){
                    alert(`You have already created exercise with title '${title}'!`);
                }
                else if(response.data.success){
                    history.push("/home/workout/exercise/open/"+title+"/"+sessionStorage.getItem("username"));
                }
                else{
                    alert("Problem has occured while adding exercise to datbase. Try again later!");
                }
            },error =>{
                console.log(error);
            });
        }
    }


    function cancelClicked(e){
        e.preventDefault();
        history.goBack();
    }

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

    //function called when file is uploaded
    function fileUploaded(e){
        setImageEx(e.target.files[0]);
        setImagePreview(URL.createObjectURL(e.target.files[0]));
    }

     //removing upoladed image
     function closeImage(){
        setImageEx(false);
        setImagePreview(false);
      }

    return(
        <div className="new-exercise-container">
            <form id="new-exercise-form">
            <div className="create-new-title">
                <h2>Create New Exercise</h2>
            </div>
                <div className="form-field">
                <label for="title"  className="form-text">Title: </label>
                <input type="text" id="title" name="title" value={title} onChange={handleChange}/>
                </div>
                <div className="form-field">
                <label for= "calories"  className="form-text">Burns (calories):</label>
                <input type="text" id="calories" name="calories" value={calories} onChange={handleChange}/>
                <div><span>{calError}</span></div>
                </div>
                <div className="form-field">
                <lable for="description"  className="form-text">Short description: </lable>
                <textarea name="description" id="description" rows="6" value={description} onChange={handleChange}/>
                </div>
                <div className="form-field">
                <lable for="content"  className="form-text">Content: </lable>
                <textarea name="content" rows="12" id="content" value={content} onChange={handleChange}/>
                </div>
                <div className="form-field checkbox">
                <label for = "private"  className="form-text">Private: </label>
                <input type="checkbox" name="private" id="private" checked={privateEx} onChange={handleChange}/>
                </div>
                <div className="private-message">* if you put the exercise on private only you will be able to see it and add it to your plans</div>
                <div>
                    <p  className="form-text">Choose tags: </p>
                <div className="workout-categorie">
                        <p>Difficulty:</p>
                        <div className="workout-buttons-container">
                        <button className="workout-categorie-button" onClick={tagClicked}>Easy</button>
                        <button className="workout-categorie-button" onClick={tagClicked}>Medium</button>
                        <button className="workout-categorie-button" onClick={tagClicked}>Hard</button>
                        </div>
                    </div>
                    <div className="workout-categorie">
                        <p>Body part:</p>
                        <div className="workout-buttons-container">
                        <button className="workout-categorie-button" onClick={tagClicked}>Arms</button>
                        <button className="workout-categorie-button" onClick={tagClicked}>Back</button>
                        <button className="workout-categorie-button" onClick={tagClicked}>Chest</button>
                        <button className="workout-categorie-button" onClick={tagClicked}>Core</button>
                        <button className="workout-categorie-button" onClick={tagClicked}>Abs</button>
                        <button className="workout-categorie-button" onClick={tagClicked}>Legs</button>
                        </div>
                    </div>
                    <div className="workout-categorie last">
                        <p>Type:</p>
                        <div className="workout-buttons-container">
                        <button className="workout-categorie-button" onClick={tagClicked}>Warm up</button>
                        <button className="workout-categorie-button" onClick={tagClicked}>Cardio</button>
                        <button className="workout-categorie-button" onClick={tagClicked}>Stretching</button>
                        <button className="workout-categorie-button" onClick={tagClicked}>Strength</button>
                        <button className="workout-categorie-button" onClick={tagClicked}>Whole body</button>
                        <button className="workout-categorie-button" onClick={tagClicked}>Aerobic</button>
                        </div>
                    </div>
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
                {(formMessage!=="") && <div className="form-error-message"><span>{formMessage}</span></div>}
                <div className="button-container-new">
                <input type="submit" value="Save" onClick={handleSave} className="save-button"/>
                <button onClick={cancelClicked} className="cancel-button">Cancel</button>    
                </div>  
            </form>

     
        </div>
    );
}