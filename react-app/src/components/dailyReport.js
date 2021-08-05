import axios from 'axios';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './styles/dailyReport.css';
import {useState} from 'react';

function DailyReport(props){

    const [extraCalEaten,setExtraCalEaten] = useState(0);
    const [extraCalSpent,setExtraCalSpent] = useState(0);
    const [plannedCalEaten,setPlannedCalEaten] = useState(0);
    const [plannedCalSpent,setPlannedCalSpent] = useState(0);
    const [CalEaten,setCalEaten] = useState(0);
    const [CalSpent,setCalSpent] = useState(0);
    const [motivationIcons,setMotivationIcons] = useState("");
    const [motivation,setMotivation] = useState("");
    const [weight,setWeight] = useState(0);
    const [notes,setNotes] = useState(0);
    const [done,setDone] = useState(0);
    const [total,setTotal] = useState(0);
    const [exercise,setExercise] = useState("");
    const [meals,setMeals] = useState("");
    const [mealsOutOfPlan,setMealsOutOfPlan] = useState("");
    const [loaded,setLoaded] = useState(false);
    const [totalCalEaten,setTotalCalEaten] = useState(0);
    const [totalCalSpent,setTotalCalSpent] = useState(0);
    const [errorExtraCalEaten,setErrorExtraCalEaten] = useState("");
    const [errorExtraCalSpent,setErrorExtraCalSpent] = useState("");
    const [errorWeight,setErrorWeight] = useState("");
    const [modified,setModified] = useState(false);
    const [errorNotes,setErrorNotes] = useState("");
    const [saveChanges,setSaveChanges] = useState(false);

    let {date}=useParams();

    //content for a popup
    useEffect(() =>{
        let username=sessionStorage.getItem("username");
        if(username){
            axios.post('/api/dailyReport',{name:username,date:date})
            .then(response=>{
                var res=response.data;
                let exer= renderList(res.information.exercises,"plan");
                let meals= renderList(res.information.meals,"meals");
                let mealsOut= renderList(res.information.mealsOutOfPlan,"mealsOut");
                let icons=renderMotivationIcons(res.information.motivation);
                setExercise(exer);
                setMeals(meals);
                setMealsOutOfPlan(mealsOut);
                setCalSpent(res.information.calSpent);
                setPlannedCalSpent(res.information.plannedCalSpent);
                setCalEaten(res.information.calEaten);
                setPlannedCalEaten(res.information.plannedCalEaten);
                setDone(res.information.resultCount);
                setTotal(res.information.totalCount);
                setExtraCalEaten(res.information.calEatenOutOfPlan);
                setExtraCalSpent(res.information.calSpentOutOfPlan);
                setMotivationIcons(icons);
                setMotivation(res.information.motivation);
                setWeight(res.information.weight);
                setNotes(res.information.notes ? res.information.notes:"");
                setLoaded(true);
            },
            (error)=>{
                console.log(error);
            });
        }
         //if some date was previously picked, removing it from memory
         if(sessionStorage.getItem("date")){
            sessionStorage.removeItem("date");
          }
    },[]);


    //sending changed data from fields Eaten additionally, Spent additionally, Weight, Motivation level and Notes to database
    function sendModifiedData(){
        if(modified){
            let caloriesE=extraCalEaten==="" ? 0 : extraCalEaten;
            let caloriesS=extraCalSpent==="" ? 0: extraCalSpent;
            let w=weight==="" ? 0: weight;
            axios.put('/api/modify/day',{name:sessionStorage.getItem('username'),date:date,motivation:motivation,notes:notes,calEaten:caloriesE,calSpent:caloriesS,weight:w})
            .then(response=>{
                if(response.status===404){
                    alert("Error updating database");
                }  
            }, (error)=>{
                console.log(error);
            });
        }
    }


    // rendering lists of exercises and meals
    function renderList(items,categorie){
        let listItems=items.map((x)=>{
            let done="not-done";
            let checkable=true;
            let checked="";
            if(categorie==="plan" || categorie==="meals"){
                checkable=true;
            }
            else{
                checkable=false;
            }
            if(x[3]){
                done="done";
                checked="checked";
            }
            let linkStr;
            if(categorie==="plan"){
                linkStr="/home/workout/"+categorie+"/open/"+x[0]+"/"+x[1];
            }
            else{
                linkStr="/home";
            }
            return(
                <div className={`listItem ${done} ${categorie}`}>
                    <button className="x-button" onClick={deleteItem}><i class="fas fa-times"></i></button>
                    <a href="javascript:void(0);" onClick={()=>{props.history.push(linkStr)}} className="item-title">{x[0]}</a>
                    <p style={{fontSize:"small"}} className="item-author">{x[1]}</p>
                    <p className="item-calories">{x[2]} cal</p>
                    {checkable && <button className={`check-button ${checked}`} onClick={clickedDoneButton}><i class="fas fa-check"></i></button>}
                </div>
            );
        });
        return listItems;
    }


    //changing status of exercises and meals
    function clickedDoneButton(event){
        var item=event.target.parentElement.parentElement;
        let title=item.querySelector(".item-title").innerHTML;
        let author=item.querySelector(".item-author").innerHTML;
        let done=false;
        done=!item.classList.contains("done");
        let categorie="";
        //changing status of an exercise plan
        if(item.classList.contains("plan")){
            categorie="plan";
            axios.post(`/api/done/${categorie}`,{done:done,date:date,title:title,author:author,username:sessionStorage.getItem('username')})
            .then(response=>{
                if(response.status===200){
                    renderingExercises(response.data);                             
                }
                else if(response.status===404){
                    alert("Trouble updating database! Try later.");
                }
            },
            (error)=>{
                console.log(error);
            });
        }

        //changing status of meal
        else if(item.classList.contains("meals")){
            categorie="meals";
            axios.post(`/api/done/${categorie}`,{done:done,date:date,title:title,author:author,username:sessionStorage.getItem('username')})
            .then(response=>{
                if(response.status===200){
                   renderingMeals(response.data);                              
                }
                else if(response.status===404){
                    alert("Trouble updating database! Try later.");
                }
            },
            (error)=>{
                console.log(error);
            });
        }      
    }

    //deleting item
    function deleteItem(event){
        var item=event.target.parentElement.parentElement;
        let title=item.querySelector(".item-title").innerHTML;
        let author=item.querySelector(".item-author").innerHTML;
        let categorie="";

        //removing exercise
        if(item.classList.contains("plan")){
            categorie="plan";
            axios.post(`/api/remove/${categorie}`,{date:date,title:title,author:author,username:sessionStorage.getItem('username')})
            .then(response=>{
                if(response.status===200){
                    renderingExercises(response.data);          
                }
                else if(response.status===404){
                    alert("Trouble updating database! Try later.");
                }
            },
            (error)=>{
                console.log(error);
            });
        }

        //removing meal
        else if(item.classList.contains("meals") || item.classList.contains("mealsOut")){
            categorie="meals";
            axios.post(`/api/remove/${categorie}`,{date:date,title:title,author:author,username:sessionStorage.getItem('username')})
            .then(response=>{
                if(response.status===200){
                    renderingMeals(response.data);                             
                }
                else if(response.status===404){
                    alert("Trouble updating database! Try later.");
                }
            },
            (error)=>{
                console.log(error);
            });
        }      
    }

    function renderingExercises(res){
        let exer= renderList(res.information.exercises,"plan");
        setExercise(exer);
        setCalSpent(res.information.calSpent);
        setPlannedCalSpent(res.information.plannedCalSpent);
    }

    function renderingMeals(res){
        let meals= renderList(res.information.meals,"meals");
        let mealsOut= renderList(res.information.mealsOutOfPlan,"mealsOut");
        setMeals(meals);
        setCalEaten(res.information.calEaten);
        setPlannedCalEaten(res.information.plannedCalEaten);
        setMealsOutOfPlan(mealsOut);
    }


    //changing content of fields Additional calories eaten, Additional calories spent, weight and notes
    function handleChange(event){
        let value=event.target.value;
        let name=event.target.name;
        if(name!=="notes"){
            if(value!==""){
                let text=value;
                if(text[text.length-1]===","){
                    chooseErrorElement("* decimal numbers must be written using '.' ",name);
                }
                else if(text[text.length-1]==="."){
                    if(text.search(".")===-1){
                        setValue(name,text);
                        setModified(true);
                        chooseErrorElement("* number must end with a digit",name);
                    }
                    else{
                        chooseErrorElement("* invalid input",name);
                        setValue(name,text);
                        setModified(true);
                    }
                }
                else if(isNaN(text[text.length-1])){
                    chooseErrorElement("* input must be a number",name);
                }
                else{
                    setValue(name,parseFloat(text));
                    setModified(true);
                    chooseErrorElement("",name);
                }
            }
            else{
                setValue(name,"");
                setModified(true);
            }
        }
        else{
            setNotes(value);
            setModified(true);
        }
    }

    function setValue(name,value){
        if(name==="extraCalEaten"){
            setExtraCalEaten(value);
        }
        else if(name==="extraCalSpent"){
            setExtraCalSpent(value);
        }
        else if(name==="weight"){
            setWeight(value);
        }
    }

    //rendering error messages for invalid inputs for fields Additional calories eaten, Additional calories spent and weight
   function chooseErrorElement(message,name){
        switch(name){
            case "extraCalEaten":
                setErrorExtraCalEaten(message);
                break;
            case "extraCalSpent": 
                setErrorExtraCalSpent(message);
                break;
            case "weight":
                setErrorWeight(message);
                break;
            default:
                alert("Error in switch-case");
                break;
        }
    }


    //rendering matching emojis to a motivation level
    function renderMotivationIcons(n){
        let row=[];
        for(let i=0;i<n;i++){
            row.push(true);
        }
        for(let i=n;i<5;i++){
            row.push(false);
        }
        let full="";
        let listItems=row.map((x)=>{
            if(x){
                full="fas";
            }
            else{
                full="far";
            }
            return(
                <button className="popup-icons" onClick={handleMotivationChange}>
                <i className={`${full} fa-grin-stars`} ></i>
                </button>
            );
        });

        return listItems;
    }

    function handleMotivationChange(event){
        setModified(true);
        let target=event.target;
        let emojis=document.querySelectorAll(".popup-icons");
        let br=1;
        for(let x of emojis){
            if(x.children[0]===target){
                setMotivationIcons(renderMotivationIcons(br));
                setModified(true);
                setMotivation(br);
            }
            br+=1;
        }
    }

    //closing popup and save changes window
    function onClickClose(name){
        if(name==="dailyReport"){
            if(!modified){
                props.history.goBack();
            }
            else if(errorExtraCalSpent==="" && errorExtraCalEaten==="" && errorWeight==="" && errorNotes===""){
                setSaveChanges(true);
            }
            else{
                alert("All values must contain valid input!");
            }
        }
        else if(name==="saveChanges"){
            props.history.goBack();
        }
    }

    //closing popup and calling function to save modifications
    function onClickSave(){
        sendModifiedData();
        props.history.goBack();
    }

    function addItem(){
        sessionStorage.setItem('date', date);
        props.history.push("/home/workout");
        if(modified){
            sendModifiedData();
        }
    }


        return(
            <div class="popup-box">
                {loaded&& 
                <div class="popup-content">
                    {saveChanges && <SaveChanges onSave={onClickSave} onDont={onClickClose}/>}
                    <h2 class="popup-main-title">{date}</h2>
                    <div className="popup-categorie">
                        <p className="popup-title">Meal plan</p>
                        <p className="popup-description">Make a list of dishes you plan to eat through the day.</p>
                        <div className="popup-items-container">
                            {meals}
                            <div className="plus-container">
                                <button className="plus-button"><i class="fas fa-plus"></i></button>
                            </div>
                        </div>
                    </div>
                    <div className="popup-categorie">
                        <p className="popup-title">Cheat meals</p>
                        <p className="popup-description">Have you eaten some dishes out of your meal plan today?</p>
                        <div className="popup-items-container">
                            {mealsOutOfPlan}
                            <div className="plus-container">
                                <button className="plus-button"><i class="fas fa-plus"></i></button>
                            </div>
                         </div>
                    </div>
                    <div className="popup-categorie">
                        <p className="popup-title">Exercise plan</p>
                        <p className="popup-description">Organize your workout for the day.</p>
                        <div className="popup-items-container">
                            {exercise}
                            <div className="plus-container">
                                <button className="plus-button" onClick={addItem}><i class="fas fa-plus"></i></button>
                            </div>
                         </div>
                    </div>
                    <div className="popup-categorie">
                    <div class="daily-information">
                        <div className="calorie-information">
                            <div class="calorie-report">                       
                                <h3>Calorie intake</h3>
                                <p>Planned: {plannedCalEaten}</p>
                                <p>Eaten: {CalEaten}</p>
                                <label for="extraCalEaten">Eaten additionally: </label> <input type="text" value={extraCalEaten} id="extraCalEaten" name="extraCalEaten" className="popup-input calorie-input" onChange={handleChange}/>
                                <div className="error_message"><span className="small">{errorExtraCalEaten}</span></div>
                                <hr/>
                                <p style={{fontWeight:"bold"}}>TOTAL: {extraCalEaten+CalEaten}</p>
                            </div>
                            <div class="calorie-report">
                                <h3>Calories spent</h3>
                                <p>Planned: {plannedCalSpent}</p>
                                <p>Spent: {CalSpent}</p>
                                <label for="extraCalSpent">Spent additionally: </label><input type="text" value={extraCalSpent} id="extraCalSpent" name="extraCalSpent" className="popup-input calorie-input" onChange={handleChange}/>
                                <div className="error_message"><span className="small">{errorExtraCalSpent}</span></div>
                                <hr/>
                                <p style={{fontWeight:"bold"}}>TOTAL: {extraCalSpent+CalSpent}</p>
                            </div>
                            <p className="popup-description">* You can modify fields Eaten additionally and Spent additionally to track calories eaten outside of recipies this app offers or track physical activity outside of workouts this app offers.</p>
                        </div>
                        </div>
                        </div>
                        <div class="additional-report">
                            <h3>Additional information</h3>
                            <p className="popup-description">Add some additional information about the day if you want to.</p>
                            <label for="weight">Weight: </label><input type="text" value={weight} id="weight" name="weight" className="popup-input additional-input" onChange={handleChange}/>
                            <div className="error_message"><span className="small">{errorWeight}</span></div>
                            <br/>
                            <p>Motivation level: {motivationIcons} </p>
                            <label for="notes">Notes: <br/><textarea className="popup-input popup-textarea" value={notes} name="notes" id="notes" onChange={handleChange}/> </label>
                       </div>
                    <button onClick={()=>{onClickClose("dailyReport")}} className="popup-close popup-button">Close</button>
                </div>
                 } 
                {!loaded && 
                <div>
                    <p>Loading!!</p>
                </div>
                }
            </div>
        )
}


class SaveChanges  extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className="popup-box save-changes-box">
                <div className="save-changes">
                    <p>Do you want to save changes you made in values Eaten additionally, Spent additionally, Weight, Motivation level and Notes?</p>
                    <div className="save-button-container">
                    <button className="save-button" onClick={this.props.onSave}>Save</button>
                    <button className="no-save-button" onClick={()=>{this.props.onDont("saveChanges")}}>Don't save</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default DailyReport;
