import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import 'react-big-calendar/lib/css/react-big-calendar.css'
const locales = {
  'en-US': require('date-fns/locale/en-US'),
}
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

class  MyCalendar extends React.Component{
  constructor(props){
    super(props);
    const now = new Date();
    const events = [
      {
          id: 0,
          title: 'All Day Event very long title',
          allDay: true,
          start: new Date(2021, 6, 0),
          end: new Date(2021, 6, 1),
      },
      {
          id: 1,
          title: 'Long Event',
          start: new Date(2021, 3, 7),
          end: new Date(2021, 3, 10),
      },
      {
          id: 2,
          title: 'Right now Time Event',
          start: now,
          end: now,
      },
    ]
    this.state = {
      events
    };
  }
  render(){
    return(
    <div>
    <Calendar
      localizer={localizer}
      events={this.state.events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    />
    </div>
    )
    }
  }

export default MyCalendar;