import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export const CancelCreatingPlan= function (){

    const [plan,setPlan] = useState(false);

    let history=useHistory();

    useEffect(() => {
        if(sessionStorage.getItem("planCreating")){
            setPlan(JSON.parse(sessionStorage.getItem("planCreating")));
        }
    },[]);

    function yesClicked(){
        sessionStorage.removeItem("planCreating");
        history.goBack();
    }

    function noClicked(){
        history.push("/home/workout/plan/create");
    }
    return(
        <div>
        {plan &&
        <div className="popup-box save-changes-box">
                <div className="save-changes">
                    <p>Do you want to cancel creating new plan {plan.title}? If you cancel all changes you have made will be lost!</p>
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