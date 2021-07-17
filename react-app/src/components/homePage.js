import React from 'react';
import './styles/homePage.css';
import './styles/calendar.css'
//import 'react-calendar/dist/Calendar.css';
import CostumCalendar from './calendar';
import DailyReport from './dailyReport';
import axios from 'axios';

class HomePage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          startDate:new Date(),
          message:"",
          showDay:false,
          calConsumed:0,
          calSpent:0,
          motivation:0
        };
        this.activeMonthChange = this.activeMonthChange.bind(this);
        this.daySelected=this.daySelected.bind(this);
        this.closePopup=this.closePopup.bind(this);
        this.valuesForMonthReport=this.valuesForMonthReport.bind(this);
        this.renderMotivation=this.renderMotivation.bind(this);
        this.returnMonth=this.returnMonth.bind(this);

        var pickedDay=new Date().toDateString();
      }

      //changing month that is displayed
      activeMonthChange(value){
          this.setState({startDate:value.activeStartDate});
          this.valuesForMonthReport(value.activeStartDate);
      }
    
      //retrieving username of currently logged user
      componentDidMount(){
        this.props.handlerFunction();
        this.setState({name:sessionStorage.getItem('username')});
        this.valuesForMonthReport(this.state.startDate);
      }

      //selecting a day
      daySelected(value){
        this.setState({showDay:true});
        this.pickedDay=value.toDateString();
      }

      closePopup(){
        this.valuesForMonthReport(this.state.startDate);
        this.setState({showDay:false});
      }

      //fetching values for monthly report from database
      valuesForMonthReport(date){
        let month=date.getMonth();
        let year=date.getFullYear();
          axios.post('/api/monthReport',{name:sessionStorage.getItem("username"),month:month,year:year})
          .then(response=>{
            let calEaten=isNaN(response.data.calEaten) ? 0 : (response.data.calEaten ? response.data.calEaten.toFixed(2) : 0);
            let calSpent=isNaN(response.data.calSpent) ? 0 : (response.data.calSpent ? response.data.calSpent.toFixed(2) : 0);
            let motivation=this.renderMotivation(Math.round(isNaN(response.data.motivation) ? 0 :response.data.motivation));
            this.setState({calConsumed:calEaten,calSpent:calSpent,motivation:motivation});
          },
          (error)=>{
            console.log(error);
          });
        }


        //rendering motivation icons
    renderMotivation(n){
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
    returnMonth(n){
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



    render(){
      let username=sessionStorage.getItem('username');
      if(username){
        return(
            <div id="calendarContainer"> 
             <CostumCalendar startDate={this.state.startDate} monthChange={this.activeMonthChange} pickDay={this.daySelected}/> 
             {this.state.showDay && <DailyReport togglePopup={this.closePopup} date={this.pickedDay}/>}
             <div className="monthly_report">
                <h2 class="welcomeTitle">Welcome {this.state.name}</h2>
                 <h3>Monthly report for {this.returnMonth(this.state.startDate.getMonth())}</h3>
                 <hr class="title-line"/>
                 <p>Calorie intake (daily): {this.state.calConsumed} cal</p>
                 <p>Calories spent (daily): {this.state.calSpent} cal</p>
                 <p>Motivation: {this.state.motivation}</p>

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
}


export default HomePage;