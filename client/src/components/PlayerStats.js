import React from 'react';
import 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function PlayerStats({ username }) {

    let gamesPlayed = '-';
    let roundsPlayed = '-';
    let winrate = '-';
    let rating = '-';

    function stay(){
        return new Promise(resolve=>{
            setTimeout(()=>{
                console.log("waiting...");
            }, 5000);
        });
    }
    
    async function getStats(){
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
                gamesPlayed = data.gamesPlayed;
                roundsPlayed = data.roundsPlayed;
                winrate = data.winrate;
                rating = data.rating;
                console.log(gamesPlayed + ", " + roundsPlayed + ", " + rating + ", " + winrate);
            }
        }catch(err){
            console.log(err);
        }
    }
    getStats();
    await stay();
    
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
                    <th>{rating}</th>
                    <th>{winrate}%</th>
                    <th>{gamesPlayed}</th>
                    <th>{roundsPlayed}</th>
                </tr>
            </table>
        </div>
    );
}