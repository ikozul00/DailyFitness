
import React from 'react';
import LoginPage from './components/loginPage';
import RegistrationPage from './components/registrationPage';
import MainPage from './components/mainPage';
import { BrowserRouter} from 'react-router-dom';


class App extends React.Component{
    constructor(props){
        super(props);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.state={
            page: 'home',
        }
    };
    handlePageChange(name){
        this.setState({page:name});
    }
    render(){
        if(sessionStorage.getItem('username')&& this.state.page==='home'){
            return(
                <BrowserRouter>
                <MainPage/>
                </BrowserRouter>
            )
        }
        else if(!sessionStorage.getItem('username')&& this.state.page==='register'){
            return(
                <RegistrationPage onPageChange={this.handlePageChange}/>
            )
        }
        else{
            return(
                <LoginPage onPageChange={this.handlePageChange} />
             )
        }
    }
}

export default App;