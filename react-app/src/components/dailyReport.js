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
            motivationLevel:0,
            weight:0,
            notes:"",
            done:0,
            total:0,
            exercise:"",
            meals:"",
            mealsOutOfPlan:"",
            loaded:false
        }
        this.renderList=this.renderList.bind(this);
        this.clickedDoneButton=this.clickedDoneButton.bind(this);
        this.deleteItem=this.deleteItem.bind(this);
        this.renderingExercises=this.renderingExercises.bind(this);
        this.renderingMeals=this.renderingMeals.bind(this);

        var modified=false;
  
    }

  

    //content for a popup
    componentDidMount(){
        let username=sessionStorage.getItem("username");
        if(username){
            axios.post('/api/dailyReport',{name:username,date:this.props.date})
            .then(response=>{
                var res=response.data;
                let exer= this.renderList(res.information.exercises,"exercises");
                let meals= this.renderList(res.information.meals,"meals");
                let mealsOut= this.renderList(res.information.mealsOutOfPlan,"mealsOut");
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
                    motivationLevel:res.information.motivation,
                    weight:res.information.weight,
                    notes:res.information.notes ? res.information.notes:"",
                    loaded:true
                });
            },
            (error)=>{
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



    render(){
        return(
            <div class="popup-box">
                {this.state.loaded&& 
                <div class="popup-content">
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
                                <label for="extraCalEaten">Eaten additionally: </label> <input type="text" value={this.state.extraCalEaten} id="extraCalEaten" name="extraCalEaten" className="popup-input calorie-input"/>
                                <hr/>
                                <p style={{fontWeight:"bold"}}>TOTAL: {this.state.extraCalEaten+this.state.CalEaten}</p>
                            </div>
                            <div class="calorie-report">
                                <h3>Calories spent</h3>
                                <p>Planned: {this.state.plannedCalSpent}</p>
                                <p>Spent: {this.state.CalSpent}</p>
                                <label for="extraCalSpent">Spent additionally: </label><input type="text" value={this.state.extraCalSpent} id="extraCalSpent" name="extraCalSpent" className="popup-input calorie-input"/>
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
                            <label for="weight">Weight: </label><input type="text" value={this.state.weight} id="weight" name="weight" className="popup-input additional-input"/>
                            <br/>
                            <p>Motivation level: {/*{this.state.motivationLevel}*/} <i class="far fa-grin-stars"></i> <i class="far fa-grin-stars"></i> <i class="far fa-grin-stars"></i> <i class="far fa-grin-stars"></i> <i class="far fa-grin-stars"></i></p>
                            <label for="notes">Notes: <br/><textarea className="popup-input popup-textarea" value={this.state.notes} /> </label>
                       </div> 
                    <button className="popup-save popup-button">Save changes</button>                                      
                    <button onClick={this.props.togglePopup} className="popup-close popup-button">Close</button>
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

export default DailyReport;
