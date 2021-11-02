import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function RandomMatch ({checkIfUserLoggedIn}) {
    const history = useHistory();
    const routerToRoom = async () => {
        let loggedIn = await checkIfUserLoggedIn();
        if(!loggedIn){
            document.querySelector(".join-room-input").style.borderTopLeftRadius = "0";
            document.querySelector(".join-room-input").style.borderTopRightRadius = "0";
            let login_err_text = document.getElementById("loginrequire");
            login_err_text.classList.remove('d-none');
            let txt = document.createElement('p');
            txt.innerHTML = "Please Login or SignUp in order to continue.<br/> You can click on the MONKE icon above to play as a guest or SignUp and keep track of your winrate, rating, match history and more.";
            login_err_text.appendChild(txt);
            return;
        }
      history.push(`/randomlobby`);
    }
    
    return (
        <div>
            <button onClick={routerToRoom} className="create-room-button">Random Match</button>
        </div>
    )
}