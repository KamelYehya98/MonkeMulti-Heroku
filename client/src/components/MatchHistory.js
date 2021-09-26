import 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import SERVER_URL from "../constants";
import React from 'react';

export default function MatchHistory({ username }) {
    
    function createRow(user1, user2, score1, score2, status1, status2, matchdate)
    {
        let table = document.getElementById("matchTable");
        let row = document.createElement('tr');
        row.classList.add('text-light');
        
        let col;
        col = document.createElement('td');
        col.innerHTML = "" + user1 + "<br>" + user2;
        row.appendChild(col);

        col = document.createElement('td');
        col.innerHTML = "" + score1 + "<br>" + score2;
        row.appendChild(col);

        col = document.createElement('td');
        col.innerHTML = "" + status1 + "<br>" + status2;
        row.appendChild(col);

        col = document.createElement('td');
        col.innerHTML = "" + new Date(Date.parse(matchdate)).toLocaleString();
        row.appendChild(col);

        table.appendChild(row);
    }

    async function getMatchHistory(){
        try{
            console.log('Reacccccccccccccccched getting match history');
            const res = await fetch(`${SERVER_URL}/getmatchhistory`, {
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
            data.matches.map(match=>{
                //setMatchHistory([
                    createRow(match.user1, match.user2, match.score1, match.score2, match.status1, match.status2, match.matchdate)
                //]);
            });
        }catch(err){
            console.log(err);
        }
    }

    getMatchHistory();

    async function createMatchHistory(){
        const user1 = 'hasagi';
        const user2 = 'taftaf';
        const score1 = 4;
        const score2 = 2;

        try{
            console.log('Reacccccccccccccccched creating match history');
            const res = await fetch(`${SERVER_URL}/creatematchhistory`, {
                method: 'POST',
                body: JSON.stringify({ user1, user2, score1, score2 }),
                headers: { 'Content-Type' : 'application/json' },
                credentials: 'include'
            });
        }catch(err){
            console.log(err);
        }
    }
    
    return (
        <div className="history-container  welcome-card w-100">
            <p>{username}'s match history</p>
            <table className="stats-table" id="matchTable">
                <tr className="text-light">
                    <th>Username</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            </table>
            <button onClick={createMatchHistory}>Create Fake Match</button>
        </div>
    );
}