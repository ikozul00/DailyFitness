import React from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { createTags} from './workoutsPage';
import './styles/plan.css';
import CostumCalendar from './calendar';

export const Plan=function (props) {
    const {title,author}=useParams();
    const [err,setErr]=useState(false);
    const [description,setDescription]=useState("");
    const [cal,setCal]=useState(0);
    const [tags,setTags]=useState(false);
    const [exercises,setExercises]=useState("");
    const [pickedDate,setPickedDate] = useState(false);
    const[addButton,setAddButton] = useState(true);
    const[calendarDisplay,setCalendarDisplay] = useState(false);
    const[startDate,setStartDate] = useState(new Date());
    const [privatePlan, setPrivatePlan] = useState(false);
    const [displayAddExercise,setDisplayAddExercise] = useState(false);
    const [displayDelete, setDisplayDelete] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(false);
    const [heartIcon, setHeartIcon] = useState("far");
    const [planId,setPlanId] = useState("");
    const [image, setImage] = useState("");
    const [displayDeleteEx, setDisplayDeleteEx] = useState(false);

    let history=useHistory();

    useEffect(() => {
        axios.get('/api/plan/?title='+title+'&author='+author+'&user='+sessionStorage.getItem("username"))
        .then(response => {
            if(response.data.plan===null){
                setErr(true);
            }
            else{
                setErr(false);
                setDescription(response.data.plan.description);
                setCal(response.data.plan.calories);
                setTags(response.data.plan.tags[0]===null ? false : createTags(response.data.plan.tags));
                setExercises(response.data.plan.exercise);
                setPrivatePlan(response.data.plan.privatePlan);
                setPlanId(response.data.plan.planId);
                setImage(response.data.plan.img===null ? "/images/no-image-found-360x250.png" : response.data.plan.img);
                if(response.data.plan.favorite){
                    setHeartIcon("fas");
                }
                else{
                    setHeartIcon("far");
                }
                if(sessionStorage.getItem("username")===author && !sessionStorage.getItem("date")){
                    setDisplayDelete(true);
                }
            }
        },error =>{
            console.log(error);
        });

          //checking if date on calendar is currently picked
          if(sessionStorage.getItem("date")){
            setPickedDate(sessionStorage.getItem("date"));
        }

        if(author===sessionStorage.getItem("username") && !sessionStorage.getItem("date")){
            setDisplayAddExercise(true);
            setDisplayDeleteEx(true);
        }

        
        //if some plan was previosy picked, reminding user
        if(sessionStorage.getItem("plan")){
            history.push("/home/workout/exercise/cancel");
          }

           //if there is plan in memory that is currently creating, remind user
        if(sessionStorage.getItem("planCreating")){
            history.push("/home/workout/plan/cancel");
          }

    },[]);

     //function which sends request to server to add plan to certain date in calendar
     function addToCalendar(){
        let date=sessionStorage.getItem("date");
    if(date){
       addToDB(date);
    }
    else{
        setCalendarDisplay(true);
        setAddButton(false);
    }
    }


    //function sending request to server to store information about adding plan to some date by certain user
    function addToDB(date){
        axios.post('/api/add/plan',{title:title, author:author,username:sessionStorage.getItem("username"), date:date})
        .then(response => {
            if(response.data.status){
                history.push("/home/date/"+date);
            }
            else{
                if(response.data.exists){
                    alert("Already added to calendar!");
                }
                else{
                    alert("Problem while adding plan to calendar! Try later.");
                }
            }
        }, error => {
            console.log(error);
        });
    }

    //changing month that is displayed
    function activeMonthChange(value){
        setStartDate(value.activeStartDate);
    }

    //selecting a day
    function daySelected(value,event){
        let pickedDay=value.toDateString();
        addToDB(pickedDay);
      }

    function closeCalendar(){
        setCalendarDisplay(false);
        setAddButton(true);
    }

    function deleteExercise(e){
        let item=e.target;
        let exTitle;
        let exAuthor;
        if(item.classList.contains("fa-times")){
            item=item.parentElement.parentElement.parentElement;
        }
        else if(item.classList.contains("delete-exercise-button")){
            item=item.parentElement.parentElement;
        }
        exTitle = item.querySelector(".exercise-title").innerHTML;
        exAuthor=item.querySelector(".exercise-author").innerHTML;
        axios.delete("/api/delete/planExercise/?title="+exTitle+"&author="+exAuthor+"&plan="+planId)
        .then(response => {
            if(!response.data.success){
                alert(`Trouble deleting exercise!`);
            }
            else{
                let index=0;
                for(let i=0;i<exercises.length;i++){
                    if(exercises[i].title===exTitle && exercises[i].username===exAuthor){
                        index=i;
                        break;
                    }
                }
                exercises.splice(index,1);
                let temp=[];
                for(let i=0;i<exercises.length;i++){
                    temp.push(exercises[i]);
                }
                setExercises(temp);
            }
        }, error => {
            console.log(error);
        });
        
    }

    function createExercises(items){
        let br=0;
        if(items.length!==0){
        let result=items.map((x) => {
            if(x!==null){
                br++;
                if(x.picture===null){
                    x.picture="/images/no-image-found-360x250.png";
                }
                return(
                    <div className="plan-step-container-main">
                    <div className="plan-step-container">
                        <div className="number-container">
                        <h2>{br}.</h2>
                        </div>
                        <div className="img-container">
                        <img className="plan-step-image" src={x.picture}></img>
                        </div>
                        <div className="exercise-data">
                        <h2 className="exercise-title">{x.title}</h2>
                        <h3 className="exercise-author-container">by <span className="exercise-author">{x.username}</span></h3>
                        <div className="general-info">
                            <p>burns <span className="cal"><b>{x.calories}</b></span> calories</p>
                            <h4>Short description:</h4>
                            <p className="description-text">{x.description}</p>   
                        </div>
                        </div>
                        <div className="repetition">
                            <p>{x.length} {x.measure}</p>
                        </div>
                        {displayDeleteEx && <div>
                            <button className="delete-exercise-button" onClick={deleteExercise}><i class="fas fa-times"></i></button>
                        </div>}
                    </div>
                    <div className="exercise-content-container">
                    <h4>Content:</h4>
                            <p className="content-text">{x.content}</p>
                    </div>
                    </div>
                );
            }
            else{
                return(<div></div>);
            }
        });
        return result;
    }
    }

    function quitDate(){
        sessionStorage.removeItem("date");
        history.push("/home/date/"+pickedDate);
    } 


    function addExercise(){
        sessionStorage.setItem("plan",JSON.stringify({"title":title,"author":author}));
        history.push('/home/workout/exercise');
    }

    function deletePlan(){
        setDeleteMessage(true);
    }

    //sending request to server to delete plan from database
    function onDeleteYes(){
        axios.delete("/api/delete/plan/?name="+title+"&author="+author)
        .then(response => {
            if(response.data.success){
                history.goBack();
            }
            else{
                alert("Problem deleting plan from database");
            }
        }, error => {
            console.log(error);
        });       
    }

    function onDeleteNo(){
        setDeleteMessage(false);
    }

    function heartIconClicked(e){
        let save=false;
        if(heartIcon==="far"){
            save=true;
        }
        else if(heartIcon==="fas"){
            save=false;
        }
        axios.post('/api/modify/planSave',{planId:planId, save:save, user:sessionStorage.getItem("username")})
        .then(response => {
            if(save && response.data.success){
                setHeartIcon("fas");
            }
            else if(!save && response.data.success){
                setHeartIcon("far");
            }
            else{
                alert("Problem has occured!");
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
            <div className="plan-main-container">
                {deleteMessage && <DeleteItem name={title} onDeleteYes={onDeleteYes} onDeleteNo={onDeleteNo} type="plan"/>}
                {pickedDate && <div class="date-message"><p>You are currently located in day:  <b>{  pickedDate}</b> </p>  <button className="cancel-date-button" onClick={quitDate}><i class="fas fa-times"></i> Quit</button></div>}
               
                <div className="first-plan-container">
                
                    <div className="basic-plan-info">
                    <h1 className="plan-title">{title}</h1>
                    <h3 className="plan-author">by {author}</h3>
                    <i class={`${heartIcon} fa-heart heart-icon`} onClick={heartIconClicked}></i>
                    </div>
                    <div className="second-plan-container">
                    <img className="plan-page-image" src={image}></img>
                    <div className="plan-info">
                    {privatePlan && <div className="private-container"><p className="private-text">PRIVATE</p></div>}
                    <p>burns <span className="plan-cal">{cal}</span> calories</p>
                    {tags && <div className="tags-container-plan"><b>Tags:</b> {tags}</div>}
                    <div id="description-container-plan">
                <h4 style={{marginTop:"0px"}}>Short description:</h4>
                <p className="plan-description">{description}</p>
                </div>
                    </div>
                </div>

                <div className="plan-content-container">
                
             
                <h3 className="title">Steps:</h3>
                <div>{createExercises(exercises)}</div>
                {displayAddExercise &&
                <div className="plus-container">
                    <button className="plus-button-plan" onClick={addExercise}><i class="fas fa-plus"></i></button>
                </div>
                }
                </div>

                </div>
                <div className="button-container">
                {displayDelete && <button className="delete-button" onClick={deletePlan}>DELETE</button>}
                {addButton && <button className="add-button-plan" onClick={()=>{addToCalendar()}}>Add to calendar</button>}
                    {calendarDisplay &&
                    <div className="plan-calendar-container">
                        <button className="close-calendar" onClick={closeCalendar}><i class="fas fa-times"></i></button>
                        <p className="calendar-text">Pick a date:</p>
                        <CostumCalendar startDate={startDate} monthChange={activeMonthChange} pickDay={daySelected} classAdd="small"/> 
                    </div>
                    }
                    </div>

            </div>
        );
    }
}

//small class component for displaying message
export const DeleteItem = class DeleteItem  extends React.Component{
    constructor(props){
        super(props);
        this.state={message:""};
    }

    componentDidMount(){
        if(this.props.type==="plan"){
            this.setState({message:`Are you sure you want to delete '${this.props.name}' from application? Deleting it will also delete it from calendar wherever it was added!`});
        }
        else if(this.props.type==="exercise"){
            this.setState({message:`Are you sure you want to delete '${this.props.name}' from application? Deleting it will also delete it from calendar wherever it was added and from all the plans it was added to!`});
        }
    }


    render(){
        return(
            <div className="popup-box save-changes-box">
                <div className="save-changes">
                    <p>{this.state.message}</p>
                    <div className="save-button-container">
                    <button className="save-button" onClick={this.props.onDeleteYes}>YES</button>
                    <button className="no-save-button" onClick={this.props.onDeleteNo}>NO</button>
                    </div>
                </div>
            </div>
        );
    }
}
