import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Welcome.css';
import CreateRoom from '../components/CreateRoom';
import JoinRoom from '../components/JoinRoom';
import PlayerStats from '../components/PlayerStats';
import MatchHistory from '../components/MatchHistory';
import './css/Welcome.css';

const Welcome = ({username}) => {
    return (
        <div className="container d-flex justify-content-center">
            <div className="row d-flex flex-no-wrap flex-md-row flex-column justify-content-center welcome-container">
                <div className="join-create-container welcome-card w-100">
                    <p>Join or Create a Room</p>
                    <JoinRoom />
                    <p className="or">OR</p>
                    <CreateRoom />
                </div>
                <PlayerStats username={username} />
                {username!=null && (<MatchHistory username={username}/>)}
            </div>
        </div>
    )
}

export default Welcome