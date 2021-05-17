import React from 'react';
import ReactDOM from 'react-dom';
import logoImage from './images/small-logo.png';
import './styles/pageTop.css';


class PageTop extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      name: "",
    };
  }
  render() {
    return (
      <header className="headerContainer">
        <div id="imageContainer"><img src={logoImage} alt="logo" class="logoImage"></img></div>
        <div className="pageTopContainer">
          <p>Welcome {this.state.name}</p>
          <nav className="navContainer">
          <button><i className="fa fa-home"></i>Home</button>
      <button><i className="fa fa-search"></i>Search</button>
      <button><i className="fa fa-user"></i>About</button>
          </nav>
          </div>
      </header>
    );
  }
 
}

export default PageTop;