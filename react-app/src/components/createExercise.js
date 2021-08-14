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
    const [imageEx,setImageEx] = useState("");
    const [imageUrl,setImageUrl] = useState("");
    // const FileInput=React.useRef(null);

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
        axios.post('/api/create/exercise',{"title":title,"calories":calories,"description":description,"content":content,"username":sessionStorage.getItem("username"),"private":privateEx,"tags":tagsChosen})
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

    function fileUploaded(e){
        console.log(e.target.files[0]);
        setImageEx(e.target.files[0]);
        //FileReader object lets web applications asynchronously read the contents of files
        let reader=new FileReader();
       
        reader.onloadend = () => {
            console.log(reader.result);
            setImageUrl(reader.result);}

        reader.readAsDataURL(e.target.files[0]);
    }

    function SendPicture(e){
        e.preventDefault();
        let data= new FormData();
        data.append('image',imageEx,imageEx.name);
        console.log(data);
        axios.post("/api/picture",{"data":data})
        .then(response=>{
            console.log(response);
        },error => {
            console.log(error);
        });
    }

    return(
        <div className="new-exercise-container">
            <form id="new-exercise-form">
                <h4>Create New Exercise</h4>
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
                <div className="form-field">
                <lable for="content">Text: </lable>
                <textarea name="content" id="content" value={content} onChange={handleChange}/>
                </div>
                <div className="form-field checkbox">
                <label for = "private">Private: </label>
                <input type="checkbox" name="private" id="private" checked={privateEx} onChange={handleChange}/>
                </div>
                <div>* if you put exercise on private only you will be able to see it and add it to your plans</div>
                <div>
                    <p>Tags: </p>
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
                        <button className="workout-categorie-button" onClick={tagClicked}>Booty</button>
                        </div>
                    </div>
                    <div className="workout-categorie">
                        <p>Type:</p>
                        <div className="workout-buttons-container">
                        <button className="workout-categorie-button" onClick={tagClicked}>Warm up</button>
                        <button className="workout-categorie-button" onClick={tagClicked}>Cardio</button>
                        <button className="workout-categorie-button" onClick={tagClicked}>Stretching</button>
                        <button className="workout-categorie-button" onClick={tagClicked}>Strength</button>
                        </div>
                    </div>
                </div>
                <div>
    <input type="file" onChange={fileUploaded} />
    <img src={imageUrl}/>
    </div>
                <button onClick={SendPicture}>Send Picture</button>
                <div><span>{formMessage}</span></div>
                <input type="submit" value="Save" onClick={handleSave}/>
                <button onClick={cancelClicked}>Cancel</button>    
            </form>

     
        </div>
    );
}