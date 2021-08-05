import axios from 'axios';
import React, {useState, useEffect} from 'react';
import { useLocation, useParams,useHistory,Link} from 'react-router-dom';
//import {createTags} from './workoutsPage';
import {CreatePlans} from './workoutsPage';

export const SearchList=function (props){

    const [result,setResult] = useState("");
    const [date,setDate] = useState(false);

    let history=useHistory();

    let type="";
    let location=useLocation();
    //acessing parameters from URL
    let {title} =useParams();
    console.log(title);
    //function is called when component is initially loaded and when value of title is changed
    useEffect(() => {
        if(location.pathname.indexOf("exercise")!==-1){
            type="exercise";
        }
        else if(location.pathname.indexOf("plan")!==-1){
            type="plan";
        }
        if(props.parameter==="search"){
            //sending get request to server with search value and information whether we are searching plans or exercises, this request is send and useeffect function is called only when text of search is changed
            axios.get('/api/search/?type='+type+'&value='+title)
            .then(response => {
                console.log("new data search");
                 //using createPlans function from workoutsPage script
                    let res=CreatePlans(response.data.list,type,history);
                    setResult(res);
            }, error => {
                console.log(error);
            })
        }
        else if(props.parameter==="tags"){
            console.log("tags:"+props.tags);
            axios.post('/api/search/tags',{tags:props.tags,type:type})
            .then(response => {
                console.log("new data");
                console.log(response);
                //using createPlans function from workoutsPage script
                let res=CreatePlans(response.data.list,type,history);
                    setResult(res);
            },error => {
                console.log(error);
            })
        }

         //checking if date on calendar is currently picked
         if(sessionStorage.getItem("date")){
            setDate(sessionStorage.getItem("date"));
        }
       
    },[title,props.tags]);

    function quitDate(){
        sessionStorage.removeItem("date");
        setDate(false);
    }   


    return(
        <div>
 {date && <div class="date-message"><p>You are currently located in day:  <b>{  date}</b> </p>  <button className="cancel-date-button" onClick={quitDate}><i class="fas fa-times"></i> Quit</button></div>}
            <div className="plans-container search-result">
                <h2>We have found...</h2>
                {result}
            </div>
        </div>
    );

}