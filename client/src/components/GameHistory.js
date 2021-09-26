import 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import SERVER_URL from "../constants";

import React from 'react';


export default function GameHistory({ username }) {
    
    function createRow(user1, user2, nbrounds, status1, status2, matchdate)
    {
        let table = document.getElementById("gameTable");
        let row = document.createElement('tr');
        row.classList.add('text-light');
        
        let col;
        col = document.createElement('td');
        col.innerHTML = "" + user1 + "<br>" + user2;
        row.appendChild(col);

        col = document.createElement('td');
        col.innerHTML = "" + status1 + "<br>" + status2;
        row.appendChild(col);

        col = document.createElement('td');
        col.innerHTML = "" + nbrounds;
        row.appendChild(col);

        col = document.createElement('td');
        col.innerHTML = "" + new Date(Date.parse(matchdate)).toLocaleString();
        row.appendChild(col);


        table.appendChild(row);
    }

    async function getGameHistory(){
        try{
            console.log('Reacccccccccccccccched getting game history');
            const res = await fetch(`${SERVER_URL}/getgamehistory`, {
                method: 'POST',
                body: JSON.stringify({ username }),
                headers: { 'Content-Type' : 'application/json' },
                credentials: 'include'
            });
            const data = await res.json();
            console.log(data);
            if(data.err){
                console.log("an error has been caught in matchhistory: " + data.err);
            }
            data.games.map(game=>{
                //setMatchHistory([
                    createRow(game.user1, game.user2, game.nbrounds, game.status1, game.status2, game.gamedate)
                //]);
            });
        }catch(err){
            console.log(err);
        }
    }



    getGameHistory();

    return (
        <div className="history-container  welcome-card w-100">
            <p>{username}'s game history</p>
            <table className="stats-table" id="gameTable">
                <tr className="text-light">
                    <th>Username</th>
                    <th>Status</th>
                    <th>Nb Rounds</th>
                    <th>Date</th>
                </tr>
            </table>
        </div>
    );
}