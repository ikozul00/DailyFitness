import axios from 'axios';
import React, {useState, useEffect} from 'react';
import { useHistory} from 'react-router-dom';
//functional component which displays all the information about workout plans
export const Plans=function (props){
    const [myPlans, setMyPlans] = useState("");
    const [plans,setPlans] = useState("");
    const [loadPlans,setLoadPlans]=useState(true);
    const [loadMyPlans,setLoadMyPlans]=useState(true);
    let history=useHistory();

    const path=history.location.pathname;


    //call only when component is mounting
    useEffect(() => {
        //retriving list of all plans from database whose author is logged user
        axios.post('/api/my',{name:sessionStorage.getItem("username"),size:2,value:"plan"})
        .then(response => {
            let res=createPlans(response.data.list);
            setMyPlans(res);
        }, error => {
            console.log(error);
        });

        //retreving list of  all public plans from databse
        axios.get('/api/all/?size='+2+'&value=plan')
        .then(response => {
            let res=createPlans(response.data.list);
            setPlans(res);
        }, error => {
            console.log(error);
        });

        //making side navbar button Plans look like it is selected
        props.handlerFunction("Workout plans");
   },[]);

    return(
        <div>
            <div className="plans-container">
            <a className="link-title" href="javascript:void(0);" onClick={()=>{history.push(path+'/MyPlans')}}><h2>My Plans</h2></a>
                <p>Create your own custom workout plans. Add them to your schedule and share them with other users.</p>
                <button class="create-new plan"><i class="fas fa-plus"></i> Create New</button>
                {myPlans}
                {loadMyPlans && <a href="javascript:void(0);" onClick={()=>{history.push(path+'/MyPlans')}} class="load-more-link">Load more...</a>}
            </div>
            <div className="plans-container">
            <a className="link-title" href="javascript:void(0);" onClick={()=>{history.push(path+'/AllPlans')}}><h2>Plans</h2></a>
                <p>If you don't want to bother with creating your own plans search plans that already exsist in app, add them to your schedule or save them for later.</p>
                {plans}
                {loadPlans && <a href="javascript:void(0);" onClick={()=>{history.push(path+'/AllPlans')}} class="load-more-link">Load more...</a>}
            </div>

        </div>
    );

}





 //creating list of plans by displaying plan data by displaying every plan in its div
 export const createPlans = function(plans){
    if(plans.length===0){
        return(<div>
            <p>No plans found.</p>
        </div>);
    }
    let result = plans.map((x) => {
        return(
         <div class="plan-container">
             <h3>{x.title}</h3>
             <p>{x.username}</p>
             <p>{x.description}</p>
             <p>{x.calories}</p>  
         </div>
        );

    });
    return result;
}


//component for presenting Plans created by currently logged user
export const MyPlans=function (){
    const [myPlans, setMyPlans] = useState("");

    useEffect(() => {
        //retriving list of all plans from database whose author is logged user
        axios.post('/api/my',{name:sessionStorage.getItem("username"),size:0,value:"plan"})
        .then(response => {
            let res=createPlans(response.data.list);
            setMyPlans(res);
        }, error => {
            console.log(error);
        });
   },[]);


    return(
        <div>
            <div className="plans-container load-all">
                <h2>My Plans</h2>
                <p>Create your own custom workout plans. Add them to your schedule and share them with other users.</p>
                <button class="create-new plan"><i class="fas fa-plus"></i> Create New</button>
                {myPlans}
            </div>
        </div>
    );
}

//component for presenting all public plans
export const AllPlans=function(){
    const [plans,setPlans] = useState("");

    useEffect(() => {
        //retreving list of  all public plans from databse
        axios.get('/api/all/?size='+0+'&value=plan')
        .then(response => {
            let res=createPlans(response.data.list);
            setPlans(res);
        }, error => {
            console.log(error);
        });
   },[]);

   return(
    <div>
        <div className="plans-container load-all">
            <h2>Plans</h2>
            <p>If you don't want to bother with creating your own plans search plans that already exsist in app, add them to your schedule or save them for later.</p>
            {plans}
        </div>

    </div>
);
}