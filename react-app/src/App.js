
import React from 'react';
import LoginPage from './components/loginPage';
import RegistrationPage from './components/registrationPage';
import MainPage from './components/mainPage';
import { BrowserRouter, Switch,Route,Redirect} from 'react-router-dom';
import WorkoutPage from'./components/workoutsPage';



class App extends React.Component{
    constructor(props){
        super(props);
    };
    render(){
        return(
        <BrowserRouter>
        <Switch>
            {/* if there is already logged user redirects to home page, if there is no logged user redirects to login page */}
            <Route path="/" render={() => {return(sessionStorage.getItem('username') ? <Redirect to="/home"/> : <Redirect to="/login"/>)}} exact/>
            <Route path="/home" render={() => (<MainPage/>)}/>
            <Route path="/login" render={() => (<LoginPage/>)} exact/>
            <Route path="/registration" render={() => (<RegistrationPage/>)} exact/>
            {/* <Route path="/home/workout" render={() =>(<WorkoutPage/>)}/> */}
        </Switch>
        </BrowserRouter>
        );
    }
}

export default App;