import React,{useEffect, useState} from 'react';
import { Route, Switch,Link, useRouteMatch,useHistory} from 'react-router-dom';
import axios from 'axios';
import './styles/profile.css';
import { MyExercises } from './workoutExercisesPage';
import { MyPlans } from './workoutPlansPage';
import { FavoriteExercises } from './favorites';
import { FavoritePlans } from './favorites';

export default function MyProfile(props) {

  const [username,setUsername] = useState(false);
  const [email,setEmail] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const[myExChecked, setMyExChecked] = useState(false);
  const[myPChecked, setMyPChecked] = useState(false);
  const [favExChecked, setFavExChecked] = useState(false);
  const[favPChecked, setFavPChecked] = useState(false);

  let history=useHistory();
  const { path } = useRouteMatch();

  useEffect(() => {
    if(sessionStorage.getItem("username")){
      setUsername(sessionStorage.getItem("username"));
      let user=sessionStorage.getItem("username");
      axios.get("/api/user?name="+user)
      .then(response => {
        let user=response.data.user;
        setEmail(user.email==="" ? "no data" : user.email);
        setAge(user.age===0 ? "no data" :user.age);
        setWeight(user.weight === 0 ? "no data" : user.weight);
        setHeight(user.height === 0 ? "no data" : user.height);
        setProfileImg(user.img===null ? "/images/no-image-found-360x250.png" : user.img);
      }, error => {
        console.log(error);
      });
    }


    //setting button MyProfile in main navbar as selected
    props.handlerFunction();
  },[]);
  function logOut(){
    if(sessionStorage.getItem("username")){
      sessionStorage.removeItem("username");
      history.push("/login");
    }
  }


  function elementChoosen(e, name){
    if(e){
      name=e.target.innerText;
    }
    if(name==="My Exercises"){
        setMyExChecked("checked");
        setMyPChecked("");
        setFavExChecked("");
        setFavPChecked("");
    }
    else if(name==="My Plans"){
        setMyExChecked("");
        setMyPChecked("checked");
        setFavExChecked("");
        setFavPChecked("");
    }
    else if(name==="Favorite Exercises"){
      setMyExChecked("");
        setMyPChecked("");
        setFavExChecked("checked");
        setFavPChecked("");
    }
    else if(name==="Favorite Plans"){
      setMyExChecked("");
        setMyPChecked("");
        setFavExChecked("");
        setFavPChecked("checked");
    }
  }


    return (
      <div>
      {username &&
      <div>
      <div className="profile-data">
        <div id="image-container"> 
        <img className="plan-page-image" src={profileImg}></img> 
        </div>
        <div className = "personal-info">
        <p><b>Username: </b><span >{username}</span></p>
        <p><b>Email: </b><span>{email}</span></p>
        <p><b>Weight: </b><span>{weight}</span></p>
        <p><b>Height: </b><span>{height}</span></p>
        <p><b>Age: </b><span>{age}</span></p>
        </div>
        <div>
        <button className="logout-button-profile" onClick={logOut}>Log out</button>
        </div>
        </div>
        <nav className="profile-navigation">
          <Link to="/home/profile/MyExercises"  style={{ textDecoration: 'none' }}><button className={`profile-nav-button ${myExChecked}`} onClick={elementChoosen}>My Exercises</button></Link>
          <Link to="/home/profile/MyPlans"  style={{ textDecoration: 'none' }}><button className={`profile-nav-button ${myPChecked}`} onClick={elementChoosen}>My Plans</button></Link>
          <Link to="/home/profile/favoriteExercises"  style={{ textDecoration: 'none' }}><button className="profile-nav-button" className={`profile-nav-button ${favExChecked}`} onClick={elementChoosen}>Favorite Exercises</button></Link>
          <Link to="/home/profile/favoritePlans"  style={{ textDecoration: 'none' }}><button className="profile-nav-button" className={`profile-nav-button ${favPChecked}`} onClick={elementChoosen}>Favorite Plans</button></Link>
        </nav>
        <div className="second-profile-container">
          <Switch>
            <Route path={`${path}`} render={()=> (<MyExercises setChoosen={elementChoosen}/>)} exact/>
            <Route path={`${path}/MyExercises`} render={()=> (<MyExercises setChoosen={elementChoosen}/>)}/>
            <Route path={`${path}/MyPlans`} render={()=> (<MyPlans setChoosen={elementChoosen}/>)}/>
            <Route path={`${path}/favoriteExercises`} render={()=> (<FavoriteExercises setChoosen={elementChoosen}/>)}/>
            <Route path={`${path}/favoritePlans`} render={()=> (<FavoritePlans setChoosen={elementChoosen}/>)}/>
          </Switch>
        </div>
        </div>
        }
      {!username && <div>You must be logged in to access page!</div>}
      </div>
    );
  }