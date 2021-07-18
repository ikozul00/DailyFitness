import React, {useState, useEffect} from 'react';
import { useLocation, useParams} from 'react-router-dom';

export const SearchList=function (props){
    let type="";
    let location=useLocation();
    //acessing parameters from URL
    let {title} =useParams();
    useEffect(() => {
        if(location.pathname.indexOf("exercise")!==-1){
            console.log("exercise");
            type="exercise";
        }
        else if(location.pathname.indexOf("plan")!==-1){
            console.log("plan");
            type="plan";
        }
        if(props.parameter==="search"){
            console.log(title);
        }
        else if(props.parameter==="tags"){
            console.log("tags");
        }
       
    });

    return(
        <p>Search</p>
    );

}