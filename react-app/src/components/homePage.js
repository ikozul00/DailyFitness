import React, { useEffect } from 'react';
import './styles/homePage.css';
import './styles/calendar.css'
//import 'react-calendar/dist/Calendar.css';
import CostumCalendar from './calendar';
import axios from 'axios';
import {useState} from 'react';
import {useHistory} from 'react-router-dom';

function HomePage(props){
      const [startDate,setStartDate]=useState(new Date());
      const [showDay,setShowDay] = useState(false);
      const [calConsumed,setCalConsumed] = useState(0);
      const [calSpent, setCalSpent] = useState(0);
      const [motivation, setMotivation] = useState(0);
      const [name,setName] = useState("");
      let pickedDay=new Date().toDateString();

      let history=useHistory();

      //changing month that is displayed
      function activeMonthChange(value){
          setStartDate(value.activeStartDate);
          valuesForMonthReport(value.activeStartDate);
      }
    
      //retrieving username of currently logged user
      useEffect(() => {
        props.handlerFunction();
        valuesForMonthReport(startDate);
        setName(sessionStorage.getItem('username'));

        //if some date was previously picked, removing it from memory
        if(sessionStorage.getItem("date")){
          sessionStorage.removeItem("date");
        }
      },[]);

      //selecting a day
      function daySelected(value){
        // setShowDay(true);
        pickedDay=value.toDateString();
        // setPickedDay(value.toDateString());
        history.push("/home/date/"+pickedDay);
      }


      //fetching values for monthly report from database
      function valuesForMonthReport(date){
        let month=date.getMonth();
        let year=date.getFullYear();
          axios.post('/api/monthReport',{name:sessionStorage.getItem("username"),month:month,year:year})
          .then(response=>{
            let calEaten=isNaN(response.data.calEaten) ? 0 : (response.data.calEaten ? response.data.calEaten.toFixed(2) : 0);
            let calSpent=isNaN(response.data.calSpent) ? 0 : (response.data.calSpent ? response.data.calSpent.toFixed(2) : 0);
            let motivation=renderMotivation(Math.round(isNaN(response.data.motivation) ? 0 :response.data.motivation));
            setCalConsumed(calEaten);
            setCalSpent(calSpent);
            setMotivation(motivation);
          },
          (error)=>{
            console.log(error);
          });
        }


        //rendering motivation icons
    function renderMotivation(n){
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
          <i className={`${full} fa-grin-stars motivation-icons`} ></i>
        );
      });

      return listItems;
    }

    //returns month name based on a month number
    function returnMonth(n){
      let m="";
      switch(n){
        case 0:
          m="January";
          break;
        case 1:
          m="February";
          break;
        case 2:
          m="March";
          break;
        case 3:
          m="April";
          break;
        case 4:
          m="May";
          break;
        case 5:
          m="June";
          break;
        case 6:
          m="July";
          break;
        case 7:
          m="August";
          break;
        case 8:
          m="September";
          break;
        case 9:
          m="October";
          break;
        case 10:
          m="November";
          break;
        case 11:
          m="December";
          break;
        default:
          m="Error";
      }
      return m;
    }



      let username=sessionStorage.getItem('username');
      if(username){
        return(
            <div id="calendarContainer"> 
             <CostumCalendar startDate={startDate} monthChange={activeMonthChange} pickDay={daySelected}/> 
             <div className="monthly_report">
                <h2 class="welcomeTitle">Welcome {name}</h2>
                 <h3>Monthly report for {returnMonth(startDate.getMonth())}</h3>
                 <hr class="title-line"/>
                 <p>Calorie intake (daily): {calConsumed} cal</p>
                 <p>Calories spent (daily): {calSpent} cal</p>
                 <p>Motivation: {motivation}</p>

             </div>
            </div>
        );
    }
  else{
    return(
      <p>You must be logged in to access page.</p>
    );
  }
}


export default HomePage;