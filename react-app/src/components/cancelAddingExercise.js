import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export const CancelAddingExercise= function CancelAddingExercise(props){

    const [plan,setPlan] = useState(false);

    let history=useHistory();

    useEffect(() => {
        if(sessionStorage.getItem("plan")){
           setPlan(JSON.parse(sessionStorage.getItem("plan")));
        }
    },[]);

    function yesClicked(){
        sessionStorage.removeItem("plan");
        history.goBack();
    }

    function noClicked(){
        history.push("/home/workout/exercise");
    }
    return(
        <div>
        {plan &&
        <div className="popup-box save-changes-box">
                <div className="save-changes">
                    <p>Do you want to cancel adding exercise to plan {plan.title}?</p>
                    <div className="save-button-container">
                    <button className="save-button" onClick={yesClicked}>YES</button>
                    <button className="no-save-button" onClick={noClicked}>NO</button>
                    </div>
                </div>
            </div>
        }

        {!plan && <div>Error! There is nothing to save!</div>}
        </div>
    );
}