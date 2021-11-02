import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Welcome.css';
import CreateRoom from '../components/CreateRoom';
import JoinRoom from '../components/JoinRoom';
import PlayerStats from '../components/PlayerStats';
import MatchHistory from '../components/MatchHistory';
import GameHistory from '../components/GameHistory';
import RandomMatch from '../components/RandomMatch';
import guestImage from '../img/guest-monke-icon.svg';
import SERVER_URL from "../constants";

const Welcome = ({username}) => {

    async function loginAsGuest(){
        try{
            console.log('Reacccccccccccccccched logging in as guest');
              await fetch(`${SERVER_URL}/loginasguest`, {
                  method: 'POST',
                  body: JSON.stringify({ }),
                  headers: { 'Content-Type' : 'application/json' },
                  credentials: 'include'
              });
        }catch(err){
            console.log(err);
        }

        document.getElementById('loginrequire').remove();
    }

    async function checkIfUserLoggedIn(){
        console.log("Checking if User is logged in..............");
        let loggedIn = false;
        try{
            console.log('Reacccccccccccccccched Checking if theres a cookie');
              const res = await fetch(`${SERVER_URL}/checkuser`, {
                  method: 'POST',
                  body: JSON.stringify({ }),
                  headers: { 'Content-Type' : 'application/json' },
                  credentials: 'include'
              });
              const data = await res.json();
              if(data.user != null)
                loggedIn = true;
        }catch(err){
            console.log(err);
        }
        return loggedIn;
    }

    function isGuest(){
        if(username != null && username.length > 6 && username.slice(0, 6) === "Guest_")
            return true;
        return false;
    }

    return (
        <div className="container d-flex justify-content-center">
            <div className="row d-flex flex-no-wrap flex-md-row flex-column justify-content-center welcome-container">
                <div className="join-create-container welcome-card w-100">
                    <p>Join or Create a Room</p>
                    <div id="loginrequire" className="login-required-error bg-danger text-light text-center m-2 p-3 d-none">
                        <button onClick={loginAsGuest} style={{background: 'none', border: 'none'}}>
                            <img src={guestImage} alt="Guest"/>
                        </button>
                    </div>
                    <JoinRoom checkIfUserLoggedIn={checkIfUserLoggedIn}/>
                    <p className="or">OR</p>
                    <CreateRoom checkIfUserLoggedIn={checkIfUserLoggedIn}/>
                    <p className="or">OR</p>
                    <RandomMatch checkIfUserLoggedIn={checkIfUserLoggedIn}/>  
                </div>
                {!isGuest() && (<PlayerStats username={username} />)}
                {username!=null && !isGuest() && (<MatchHistory username={username}/>)} 
                {/* last thing done..................... */}
                {username!=null && !isGuest() && (<GameHistory username={username}/>)}
            </div>
        </div>
    )
}

export default Welcome