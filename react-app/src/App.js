
// import './App.css';
import React from 'react';
import HomePage from './components/homePage';
import LoginPage from './components/loginPage';
import RegistrationPage from './components/registrationPage';
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


class App extends React.Component{
    constructor(props){
        super(props);
        this.handleLoginButtonClick = this.handleLoginButtonClick.bind(this);
        this.handleRegistrationButtonClick=this.handleRegistrationButtonClick.bind(this);
        this.state={
            page: "login",
        }
    };
    handleLoginButtonClick(name){
        this.setState({page:name});
    }
    handleRegistrationButtonClick(name){
        this.setState({page:name});
    }
    render(){
        const pageName=this.state.page;
        if(pageName==="login"){
            return(
                <LoginPage onloginButtonClick={this.handleLoginButtonClick}/>
             )
        }
       else if(pageName==="home"){
            return(
                <HomePage/>
            )
        }
        else if(pageName==="register"){
            return(
                <RegistrationPage onRegistrationButtonClick={this.handleRegistrationButtonClick}/>
            )
        }
    }
}

export default App;