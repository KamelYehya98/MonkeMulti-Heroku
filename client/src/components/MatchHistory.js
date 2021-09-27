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

    async function createFakeMatchHistory(){
        const user1 = document.getElementsByName("user1")[0].value;
        const user2 = document.getElementsByName("user2")[0].value;
        const score1 = parseInt(document.getElementsByName("score1")[0].value);
        const score2 = parseInt(document.getElementsByName("score2")[0].value);

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
            <div className="container mt-2 border stats-table">
                <div className="row fake-match-maker">
                    <span for="user1" className="col-3">Username:</span><input name="user1" type="text" className="col-9 text-dark" />
                    <span for="score1" className="col-3">Score:</span><input name="score1" type="text" className="col-9 text-dark"/>
                </div>
                <div className="row fake-match-maker">
                    <span for="user2" className="col-3">Username:</span><input name="user2" type="text" className="col-9 text-dark" />
                    <span for="score2" className="col-3">Score:</span><input name="score2" type="text" className="col-9 text-dark" />
                </div>
                <button onClick={createFakeMatchHistory} className="btn btn-success mt-1">Create Fake Match</button>
            </div>
        </div>
    );
}