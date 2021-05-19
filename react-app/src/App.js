
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
        this.handlePageChange = this.handlePageChange.bind(this);
        this.state={
            page: "login",
        }
    };
    handlePageChange(name){
        this.setState({page:name});
    }
    render(){
        const pageName=this.state.page;
        if(pageName==="login"){
            return(
                <LoginPage onPageChange={this.handlePageChange} />
             )
        }
       else if(pageName==="home"){
            return(
                <HomePage/>
            )
        }
        else if(pageName==="register"){
            return(
                <RegistrationPage onPageChange={this.handlePageChange}/>
            )
        }
    }
}

export default App;