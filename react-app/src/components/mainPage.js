import React from 'react';
import logoImage from './images/small-logo.png';
import './styles/mainPage.css';
import { BrowserRouter, Route, Switch,Link } from 'react-router-dom';
import Home from './homePage';
import Search from './search';
import About from './about';


class MainPage extends React.Component{
  constructor(props){
    super(props);
    this.state={
        classHome:'buttonActive',
        classSearch:'buttonInactive',
        classAbout:'buttonInactive',
    }
    this.handleHomeButton = this.handleHomeButton.bind(this);
    this.handleSearchButton = this.handleSearchButton.bind(this);
    this.handleAboutButton = this.handleAboutButton.bind(this);
  }
  
  handleHomeButton(){
    if(this.state.classHome==='buttonInactive'){
      this.setState({classHome:"buttonActive"});
      this.setState({classSearch:"buttonInactive"});
      this.setState({classAbout:"buttonInactive"});
    } 
  }

  handleAboutButton(){
    if(this.state.classAbout==='buttonInactive'){
      this.setState({classAbout:"buttonActive"});
      this.setState({classSearch:"buttonInactive"});
      this.setState({classHome:"buttonInactive"});
    } 
  }

  handleSearchButton(){
    if(this.state.classSearch==='buttonInactive'){
      this.setState({classSearch:"buttonActive"});
      this.setState({classHome:"buttonInactive"});
      this.setState({classAbout:"buttonInactive"});
    } 
  }

  render() {
    return (
      <BrowserRouter>
      <div className="headerContainer">
        <div id="imageContainer"><img src={logoImage} alt="logo" class="logoImage"></img></div>
        <div className="pageTopContainer">
          <nav className="navContainer">
          <Link to="/" className="links" style={{ textDecoration: 'none' }}><button onClick={this.handleHomeButton} className={this.state.classHome}><i className="fa fa-home"></i>Home</button></Link>
          <Link to="/search" className="links" style={{ textDecoration: 'none' }}><button onClick={this.handleSearchButton} className={this.state.classSearch}><i className="fa fa-search"></i>Search</button></Link>
      <Link to="/about" className="links" style={{ textDecoration: 'none' }}><button onClick={this.handleAboutButton} className={this.state.classAbout}><i className="fa fa-user"></i>About</button></Link>
          </nav>
          </div>
          </div>
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/search" component={Search} />
            <Route path="/about" component={About} />
          </Switch>
          </BrowserRouter>
    );
  }
 
}

export default MainPage;