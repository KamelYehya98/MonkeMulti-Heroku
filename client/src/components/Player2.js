import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';

export default function Player2({playerAction, CallButtons}) {

return (
    <div className="row d-md-flex flex-md-row justify-content-md-between flex-md-nowrap d-flex flex-column align-content-around addopacitymonkey">
                
    <div className="col-md-6 col-12 col-sm-12 d-flex justify-content-end justify-content-md-start m-0 p-0 order-md-1" id="assets-container-player2">
        <div className="col-md-3 col-3 m-2 p-0 d-flex align-items-center order-md-3">
            <img alt="" src="" className="img-fluid" id="player2pick" />
        </div>
        <div className="col-md-5 col-3 m-2 p-0 d-flex align-items-center order-md-2" id="specialdivplayer2">
            <p className="text-center" id="specialtextplayer2"></p>
            <img alt="" src="" className="img-fluid" id="specialimgplayer2" />
        </div>
        <div className="col-md-3 col-4 d-flex flex-column justify-content-center m-1 p-0 order-md-2" id="player2buttons">
            <button className="btn btn-primary mt-2 btn-sm" id="throwcardplayer2">THROW CARD</button>
            <button className="btn btn-success mt-2 btn-sm" id="freethrowplayer2">FREE THROW</button>
            <button className="btn btn-warning mt-2 btn-sm" id="monkeplayer2">MONKE</button>
            <button className="btn btn-danger mt-2 btn-sm" id="endturnplayer2">END TURN</button>
            <button className="btn btn-dark mt-2 btn-sm" id="specialplayer2">ACTIVATE SPECIAL</button>
        </div>
        <div className="order-md-0 vertical-line rounded"></div>
    </div>
    <div className="col-md-6 d-flex flex-row justify-content-around col-12 m-md-1 m-2 p-0 order-md-0" id="cards-container-player2">
        <div className="col-md-3 col-2 d-flex justify-content-center flex-column">
            <img alt="" src="" className="img-fluid image-player2" index="0" player="2" onClick={playerAction}/>
        </div>
        <div className="col-md-3 col-2 d-flex justify-content-center flex-column">
            <img alt="" src="" className="img-fluid image-player2" index="1" player="2" onClick={playerAction}/>
        </div>
        <div className="col-md-3 col-2 d-flex justify-content-center flex-column">
            <img alt="" src="" className="img-fluid image-player2" index="2" player="2" onClick={playerAction}/>
        </div>
        <div className="col-md-3 col-2 d-flex justify-content-center flex-column">
            <img alt="" src="" className="img-fluid image-player2" index="3" player="2" onClick={playerAction}/>
        </div>
    </div>
</div>

  );
}