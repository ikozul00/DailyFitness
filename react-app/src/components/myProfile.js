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


    return (
      <div>
      {username &&
      <div>
        <div className = "personal-info">
        <button className="login-button-profile" onClick={logOut}>Log out</button>
        <p>Username: {username}</p>
        <p>Email: {email}</p>
        <p>Weight: {weight}</p>
        <p>Height: {height}</p>
        <p>Age: {age}</p>
        </div>
        <nav>
          <Link to="/home/profile/MyExercises">My Exercises</Link>
          <Link to="/home/profile/MyPlans">My Plans</Link>
          <Link to="/home/profile/favoriteExercises">Favorite Exercises</Link>
          <Link to="/home/profile/favoritePlans">Favorite Plans</Link>
        </nav>
        <div>
          <Switch>
            <Route path={`${path}`} render={()=> (<MyExercises/>)} exact/>
            <Route path={`${path}/MyExercises`} render={()=> (<MyExercises/>)}/>
            <Route path={`${path}/MyPlans`} render={()=> (<MyPlans/>)}/>
            <Route path={`${path}/favoriteExercises`} render={()=> (<FavoriteExercises/>)}/>
            <Route path={`${path}/favoritePlans`} render={()=> (<FavoritePlans/>)}/>
          </Switch>
        </div>
        </div>
        }
      {!username && <div>You must be logged in to access page!</div>}
      </div>
    );
  }