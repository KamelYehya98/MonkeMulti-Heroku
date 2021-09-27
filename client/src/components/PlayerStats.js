import React, {useState} from 'react';
import '../pages/css/Welcome.css';
import 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import SERVER_URL from "../constants";

export default function PlayerStats({ username }) {

    const [stats, setStats] = useState(
        {
            rating: 0,
            winrate: 0,
            roundsPlayed: 0,
            gamesPlayed: 0,
        }
    );
    
    async function getStats(){
        try{
            console.log('Reacccccccccccccccched getting stats');
            const res = await fetch(`${SERVER_URL}/getstats`, {
                method: 'POST',
                body: JSON.stringify({ username }),
                headers: { 'Content-Type' : 'application/json' },
                credentials: 'include'
            });
            const data = await res.json();
            let err_text = document.getElementById('stats-container');
            // if(data.error != undefined){
            //     err_text.innerHTML = "Your session ended - Please login again";
            // }else{
            if (data.rating !== stats.rating || data.winrate !== stats.winrate || data.roundsPlayed !== stats.roundsPlayed || data.gamesPlayed !== stats.gamesPlayed)
            {
                setStats({rating:data.rating, winrate:data.winrate, roundsPlayed:data.roundsPlayed, gamesPlayed:data.gamesPlayed});
            }
            //}
        }catch(err){
            console.log(err);
        }
    }
    getStats();
    
    return (
        <div id='stats-container' className="welcome-card w-100">
            <p>{username}'s stats</p>
            <table className="stats-table">
                <tr>
                    <th>Rating</th>
                    <th>Winrate</th>
                    <th>Games Played</th>
                    <th>Rounds Played</th>
                </tr>
                <tr className="text-light">
                    <th id="rating">{parseInt(stats.rating)}</th>
                    <th id="winrate">{parseFloat(stats.winrate).toFixed(2)}%</th>
                    <th id="gamesPlayed">{stats.gamesPlayed}</th>
                    <th id="roundsPlayed">{stats.roundsPlayed}</th>
                </tr>
            </table>
        </div>
    );
}