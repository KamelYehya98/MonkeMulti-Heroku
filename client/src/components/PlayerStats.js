import React, { useState, useEffect } from 'react';
import 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function PlayerStats({ username }) {

    setTimeOut(()=>{

        let gamesPlayedVal = useState(0);
        let roundsPlayedVal = useState(0);
        let winrateVal = useState(0);
        let ratingVal = useState(0);

        let gamesPlayed = document.getElementById('gamesPlayed');
        let roundsPlayed = document.getElementById('roundsPlayed');
        let winrate = document.getElementById('winrate');
        let rating = document.getElementById('rating');
    
        useEffect(()=>{
            gamesPlayed.innerHTML = gamesPlayedVal;
            roundsPlayed.innerHTML = roundsPlayedVal;
            winrate.innerHTML = winrateVal;
            rating.innerHTML = ratingVal;
        });

        try{
            console.log('Reacccccccccccccccched getting stats');
            const res = await fetch('/getstats', {
                method: 'POST',
                body: JSON.stringify({ username }),
                headers: { 'Content-Type' : 'application/json' },
                credentials: 'include'
            });
            const data = await res.json();
            console.log("Stats data is:" +  data);
            let err_text = document.getElementById('stats-container');
            if(data.error){
                console.log("error in getting stats: " + data.error);
                err_text.innerHTML = "Your session ended - Please login again";
            }else{
                console.log("reached the else condition");
                gamesPlayedVal = data.gamesPlayed;
                roundsPlayedVal = data.roundsPlayed;
                winrateVal = data.winrate;
                ratingVal = data.rating;
                console.log(gamesPlayedVal + ", " + roundsPlayedVal + ", " + ratingVal + ", " + winrateVal);
            }
        }catch(err){
            console.log(err);
        }
    }, 2000);

    
    return (
        <div id='stats-container' className="text-danger w-100">
            <table className="table table-dark table-striped text-light">
                <tr className="text-light">
                    <th>Rating</th>
                    <th>Winrate</th>
                    <th>Games Played</th>
                    <th>Rounds Played</th>
                </tr>
                <tr className="text-light">
                    <th id="rating">{ratingVal}</th>
                    <th id="winrate">{winrateVal}%</th>
                    <th id="gamesPlayed">{gamesPlayedVal}</th>
                    <th id="roundsPlayed">{roundsPlayedVal}</th>
                </tr>
            </table>
        </div>
    );
}