import React from 'react';
import Calendar from 'react-calendar'
import './styles/calendar.css'

class CustomCalendar extends React.Component{
  constructor(props){
      super(props);

    }
    render(){
      return(
        <Calendar locale="en" activeStartDate={this.props.startDate} maxDetail="month" minDetail="month"
        next2Label={null} prev2Label={null} view="month" tileClassName="dateField" className={this.props.classAdd}
        onClickDay={(value,event) => this.props.pickDay(value,event)} returnValue="start" value={new Date()} 
        showNeighboringMonth={true} onActiveStartDateChange={(value)=>this.props.monthChange(value)} 
        showFixedNumberOfWeeks={true}/> 
      )
    }

  }

  export default CustomCalendar;