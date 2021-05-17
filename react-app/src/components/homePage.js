import React from 'react';
import PageTop from './pageTop';
import MyCalendar from './calendar';
import './styles/index.css';
class HomePage extends React.Component{
    render(){
        return(
            <div id="calendarContainer">
            <PageTop/>
             <MyCalendar/> 
     
            </div>
        );
    }
}


export default HomePage;