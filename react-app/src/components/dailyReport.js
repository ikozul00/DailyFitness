import axios from 'axios';
import React from 'react';
import './styles/dailyReport.css';

class DailyReport extends React.Component{
    constructor(props){
        super(props);
        this.state={
            extraCalEaten:0,
            extraCalSpent:0 ,
            plannedCalEaten:0,
            plannedCalSpent:0,
            CalEaten:0,
            CalSpent:0,
            motivationIcons:"",
            motivation:0,
            weight:0,
            notes:"",
            done:0,
            total:0,
            exercise:"",
            meals:"",
            mealsOutOfPlan:"",
            loaded:false,
            totalCalEaten:0,
            totalCalSpent:0,
            errorExtraCalEaten:"",
            errorExtraCalSpent:"",
            errorWeight:"",
            modified:false,
            errorNotes:""
        }
        this.renderList=this.renderList.bind(this);
        this.clickedDoneButton=this.clickedDoneButton.bind(this);
        this.deleteItem=this.deleteItem.bind(this);
        this.renderingExercises=this.renderingExercises.bind(this);
        this.renderingMeals=this.renderingMeals.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.chooseErrorElement=this.chooseErrorElement.bind(this);
        this.renderMotivationIcons = this.renderMotivationIcons.bind(this);
        this.handleMotivationChange=this.handleMotivationChange.bind(this);
        this.onClickClose=this.onClickClose.bind(this);
        this.onClickSave=this.onClickSave.bind(this);
        this.sendModifiedData=this.sendModifiedData.bind(this);
    }

  

    //content for a popup
    componentDidMount(){
        let username=sessionStorage.getItem("username");
        if(username){
            console.log(this.props.date);
            axios.post('/api/dailyReport',{name:username,date:this.props.date})
            .then(response=>{
                var res=response.data;
                let exer= this.renderList(res.information.exercises,"exercises");
                let meals= this.renderList(res.information.meals,"meals");
                let mealsOut= this.renderList(res.information.mealsOutOfPlan,"mealsOut");
                let icons=this.renderMotivationIcons(res.information.motivation);
                this.setState({
                    exercise:exer,
                    meals:meals,
                    mealsOutOfPlan:mealsOut,
                    CalSpent:res.information.calSpent,
                    plannedCalSpent:res.information.plannedCalSpent,
                    CalEaten:res.information.calEaten,
                    plannedCalEaten:res.information.plannedCalEaten,
                    done:res.information.resultCount,
                    total:res.information.totalCount,
                    extraCalEaten:res.information.calEatenOutOfPlan,
                    extraCalSpent:res.information.calSpentOutOfPlan,
                    motivationIcons:icons,
                    motivation:res.information.motivation,
                    weight:res.information.weight,
                    notes:res.information.notes ? res.information.notes:"",
                    loaded:true,
                });
            },
            (error)=>{
                console.log(error);
            });
        }
    }


    //sending changed data from fields Eaten additionally, Spent additionally, Weight, Motivation level and Notes to database
    sendModifiedData(){
        this.props.togglePopup();
        if(this.state.modified){
            let caloriesE=this.state.extraCalEaten==="" ? 0 : this.state.extraCalEaten;
            let caloriesS=this.state.extraCalSpent==="" ? 0: this.state.extraCalSpent;
            let w=this.state.weight==="" ? 0: this.state.weight;
            axios.put('/api/modify/day',{name:sessionStorage.getItem('username'),date:this.props.date,motivation:this.state.motivation,notes:this.state.notes,calEaten:caloriesE,calSpent:caloriesS,weight:w})
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
    renderList(items,categorie){
        let listItems=items.map((x)=>{
            let done="not-done";
            let checkable=true;
            let checked="";
            if(categorie==="exercises" || categorie==="meals"){
                checkable=true;
            }
            else{
                checkable=false;
            }
            if(x[3]){
                done="done";
                checked="checked";
            }
            return(
                <div className={`listItem ${done} ${categorie}`}>
                    <button className="x-button" onClick={this.deleteItem}><i class="fas fa-times"></i></button>
                    <p className="item-title">{x[0]}</p>
                    <p style={{fontSize:"small"}} className="item-author">{x[1]}</p>
                    <p className="item-calories">{x[2]} cal</p>
                    {checkable && <button className={`check-button ${checked}`} onClick={this.clickedDoneButton}><i class="fas fa-check"></i></button>}
                </div>
            );
        });
        return listItems;
    }


    //changing status of exercises and meals
    clickedDoneButton(event){
        var item=event.target.parentElement.parentElement;
        let title=item.querySelector(".item-title").innerHTML;
        let author=item.querySelector(".item-author").innerHTML;
        let done=false;
        done=!item.classList.contains("done");
        let categorie="";
        //changing status of an exercise plan
        if(item.classList.contains("exercises")){
            categorie="exercises";
            axios.post(`/api/done/${categorie}`,{done:done,date:this.props.date,title:title,author:author,username:sessionStorage.getItem('username')})
            .then(response=>{
                if(response.status===200){
                    this.renderingExercises(response.data);                             
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
            axios.post(`/api/done/${categorie}`,{done:done,date:this.props.date,title:title,author:author,username:sessionStorage.getItem('username')})
            .then(response=>{
                if(response.status===200){
                   this.renderingMeals(response.data);                              
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
    deleteItem(event){
        var item=event.target.parentElement.parentElement;
        let title=item.querySelector(".item-title").innerHTML;
        let author=item.querySelector(".item-author").innerHTML;
        let categorie="";

        //removing exercise
        if(item.classList.contains("exercises")){
            categorie="exercises";
            axios.post(`/api/remove/${categorie}`,{date:this.props.date,title:title,author:author,username:sessionStorage.getItem('username')})
            .then(response=>{
                if(response.status===200){
                    this.renderingExercises(response.data);          
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
            axios.post(`/api/remove/${categorie}`,{date:this.props.date,title:title,author:author,username:sessionStorage.getItem('username')})
            .then(response=>{
                if(response.status===200){
                    this.renderingMeals(response.data);                             
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

    renderingExercises(res){
        let exer= this.renderList(res.information.exercises,"exercises");
        this.setState({
            exercise:exer,
            CalSpent:res.information.calSpent,
            plannedCalSpent:res.information.plannedCalSpent,
        });
    }

    renderingMeals(res){
        let meals= this.renderList(res.information.meals,"meals");
        let mealsOut= this.renderList(res.information.mealsOutOfPlan,"mealsOut");
        this.setState({
            meals:meals,
            CalEaten:res.information.calEaten,
            plannedCalEaten:res.information.plannedCalEaten,
            mealsOutOfPlan:mealsOut,
        });
    }


    //changing content of fields Additional calories eaten, Additional calories spent, weight and notes
    handleChange(event){
        let value=event.target.value;
        let name=event.target.name;
        if(name!=="notes"){
            if(value!==""){
                let text=value;
                if(text[text.length-1]===","){
                    this.chooseErrorElement("* decimal numbers must be written using '.' ",name);
                }
                else if(text[text.length-1]==="."){
                    if(text.search(".")===-1){
                        this.setState({[event.target.name]:text,modified:true});
                        this.chooseErrorElement("* number must end with a digit",name);
                    }
                    else{
                        this.chooseErrorElement("* invalid input",name);
                        this.setState({[event.target.name]:text,modified:true});
                    }
                }
                else if(isNaN(text[text.length-1])){
                    this.chooseErrorElement("* input must be a number",name);
                }
                else{
                    this.setState({[event.target.name]:parseFloat(text),modified:true});
                    this.chooseErrorElement("",name);
                }
            }
            else{
                this.setState({[event.target.name]:"",modified:true});
            }
        }
        else{
            this.setState({notes:value,modified:true});
        }
    }

    //rendering error messages for invalid inputs for fields Additional calories eaten, Additional calories spent and weight
    chooseErrorElement(message,name){
        switch(name){
            case "extraCalEaten":
                this.setState({errorExtraCalEaten:message});
                break;
            case "extraCalSpent": 
                this.setState({errorExtraCalSpent:message});
                break;
            case "weight":
                this.setState({errorWeight:message});
                break;
            default:
                alert("Error in switch-case");
                break;
        }
    }


    //rendering matching emojis to a motivation level
    renderMotivationIcons(n){
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
                <button className="popup-icons" onClick={this.handleMotivationChange}>
                <i className={`${full} fa-grin-stars`} ></i>
                </button>
            );
        });

        return listItems;
    }

    handleMotivationChange(event){
        this.modified=true;
        let target=event.target;
        let emojis=document.querySelectorAll(".popup-icons");
        let br=1;
        for(let x of emojis){
            if(x.children[0]==target){
                 this.setState({motivationIcons:this.renderMotivationIcons(br),modified:true,motivation:br});
            }
            br+=1;
        }
    }

    //closing popup and save changes window
    onClickClose(name){
        if(name==="dailyReport"){
            if(!this.state.modified){
                this.props.togglePopup();
            }
            else if(this.state.errorExtraCalSpent==="" && this.state.errorExtraCalEaten==="" && this.state.errorWeight==="" && this.state.errorNotes===""){
                this.setState({saveChanges:true});
            }
            else{
                alert("All values must contain valid input!");
            }
        }
        else if(name==="saveChanges"){
            this.props.togglePopup();
        }
    }

    //closing popup and calling function to save modifications
    onClickSave(){
        this.sendModifiedData();
         this.props.togglePopup();
    }


    render(){
        return(
            <div class="popup-box">
                {this.state.loaded&& 
                <div class="popup-content">
                    {this.state.saveChanges && <SaveChanges onSave={this.onClickSave} onDont={this.onClickClose}/>}
                    <h2 class="popup-main-title">{this.props.date}</h2>
                    <div className="popup-categorie">
                        <p className="popup-title">Meal plan</p>
                        <p className="popup-description">Make a list of dishes you plan to eat through the day.</p>
                        <div className="popup-items-container">
                            {this.state.meals}
                            <div className="plus-container">
                                <button className="plus-button"><i class="fas fa-plus"></i></button>
                            </div>
                        </div>
                    </div>
                    <div className="popup-categorie">
                        <p className="popup-title">Cheat meals</p>
                        <p className="popup-description">Have you eaten some dishes out of your meal plan today?</p>
                        <div className="popup-items-container">
                            {this.state.mealsOutOfPlan}
                            <div className="plus-container">
                                <button className="plus-button"><i class="fas fa-plus"></i></button>
                            </div>
                         </div>
                    </div>
                    <div className="popup-categorie">
                        <p className="popup-title">Exercise plan</p>
                        <p className="popup-description">Organize your workout for the day.</p>
                        <div className="popup-items-container">
                            {this.state.exercise}
                            <div className="plus-container">
                                <button className="plus-button"><i class="fas fa-plus"></i></button>
                            </div>
                         </div>
                    </div>
                    <div className="popup-categorie">
                    <div class="daily-information">
                        <div className="calorie-information">
                            <div class="calorie-report">                       
                                <h3>Calorie intake</h3>
                                <p>Planned: {this.state.plannedCalEaten}</p>
                                <p>Eaten: {this.state.CalEaten}</p>
                                <label for="extraCalEaten">Eaten additionally: </label> <input type="text" value={this.state.extraCalEaten} id="extraCalEaten" name="extraCalEaten" className="popup-input calorie-input" onChange={this.handleChange}/>
                                <div className="error_message"><span className="small">{this.state.errorExtraCalEaten}</span></div>
                                <hr/>
                                <p style={{fontWeight:"bold"}}>TOTAL: {this.state.extraCalEaten+this.state.CalEaten}</p>
                            </div>
                            <div class="calorie-report">
                                <h3>Calories spent</h3>
                                <p>Planned: {this.state.plannedCalSpent}</p>
                                <p>Spent: {this.state.CalSpent}</p>
                                <label for="extraCalSpent">Spent additionally: </label><input type="text" value={this.state.extraCalSpent} id="extraCalSpent" name="extraCalSpent" className="popup-input calorie-input" onChange={this.handleChange}/>
                                <div className="error_message"><span className="small">{this.state.errorExtraCalSpent}</span></div>
                                <hr/>
                                <p style={{fontWeight:"bold"}}>TOTAL: {this.state.extraCalSpent+this.state.CalSpent}</p>
                            </div>
                            <p className="popup-description">* You can modify fields Eaten additionally and Spent additionally to track calories eaten outside of recipies this app offers or track physical activity outside of workouts this app offers.</p>
                        </div>
                        </div>
                        </div>
                        <div class="additional-report">
                            <h3>Additional information</h3>
                            <p className="popup-description">Add some additional information about the day if you want to.</p>
                            <label for="weight">Weight: </label><input type="text" value={this.state.weight} id="weight" name="weight" className="popup-input additional-input" onChange={this.handleChange}/>
                            <div className="error_message"><span className="small">{this.state.errorWeight}</span></div>
                            <br/>
                            <p>Motivation level: {this.state.motivationIcons} </p>
                            <label for="notes">Notes: <br/><textarea className="popup-input popup-textarea" value={this.state.notes} name="notes" id="notes" onChange={this.handleChange}/> </label>
                       </div>
                    <button onClick={()=>{this.onClickClose("dailyReport")}} className="popup-close popup-button">Close</button>
                </div>
                }
                {!this.state.loaded && 
                <div>
                    <p>Loading!!</p>
                </div>}
            </div>
        )
    }
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
