import React from 'react';
import './styles/homePage.css';
import './styles/calendar.css'
//import 'react-calendar/dist/Calendar.css';
import CostumCalendar from './calendar';
import DailyReport from './dailyReport';

class HomePage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          name: "",
          startDate:new Date(),
          message:"",
          showDay:false,
        };
        this.activeMonthChange = this.activeMonthChange.bind(this);
        this.daySelected=this.daySelected.bind(this);
        this.closePopup=this.closePopup.bind(this);
        var pickedDay=new Date();
      }

      //changing month that is displayed
      activeMonthChange(value){
          this.setState({startDate:value.activeStartDate});
          this.setState({message:value.activeStartDate.toDateString()})
      }
    
      //retrieving username of currently logged user
      componentDidMount(){
        this.setState({name:sessionStorage.getItem('username')});
      }

      //selecting a day
      daySelected(value){
        this.setState({showDay:true});
        this.pickedDay=value.toDateString();
      }

      closePopup(){
        this.setState({showDay:false});
      }
    render(){
      let username=sessionStorage.getItem('username');
      if(username){
        return(
            <div id="calendarContainer">
                <h4 class="nameContainer">Welcome {this.state.name}</h4>
             <CostumCalendar startDate={this.state.startDate} monthChange={this.activeMonthChange} pickDay={this.daySelected}/> 
             {this.state.showDay && <DailyReport togglePopup={this.closePopup} date={this.pickedDay}/>}
             <div className="monthly_report">
                 <p>Monthly Report</p>
                 <span><p>Average calorie consumation (daily):1400</p></span>
                 <span><p>Average time spent working out (daily):1400</p></span>
                 <span><p>Grade:3</p></span>
                 <span><p>Message:{this.state.message}</p></span>

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