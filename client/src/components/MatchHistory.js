import 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import SERVER_URL from "../constants";

import React from 'react';


export default function MatchHistory({ username }) {

    //const [matchhistory, setMatchHistory] = useState([]);
    
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
        col.innerHTML = "" + matchdate
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
    // useEffect(() => {
    //     getMatchHistory();
    // }, );

    getMatchHistory();

    async function createMatchHistory(){
        const user1 = 'hasagi';
        const user2 = 'taftaf';
        const score1 = 1;
        const score2 = 20;
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
        <div>
            <table className="table table-dark table-striped text-light" id="matchTable">
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