import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Welcome.css';
import CreateRoom from '../components/CreateRoom';
import JoinRoom from '../components/JoinRoom';
import PlayerStats from '../components/PlayerStats';
import MatchHistory from '../components/MatchHistory';

const Welcome = ({username}) => {
    return (
        <div className="container">
            <div className="row d-flex flex-no-wrap flex-md-row flex-column">
                <CreateRoom />
                <JoinRoom />
                <PlayerStats username={username} />
                {username!=null && (<MatchHistory username={username}/>)}
            </div>
        </div>
    )
}

export default Welcome