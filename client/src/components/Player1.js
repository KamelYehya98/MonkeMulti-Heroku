import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Images from "../game_classes/Images";

export default function Player1({playerAction, CallButtons}) {

return (
    <div className="row d-md-flex flex-md-row justify-content-md-between flex-md-nowrap d-flex flex-column align-content-around addopacitymonkey">
    <div className="col-md-6 d-flex flex-row justify-content-around col-12 m-1 p-0 order-md-0 gap-1" id="cards-container-player1">
        <div className="col-md-3 col-2 d-flex justify-content-center flex-column image">
            <img alt="" src="" className="img-fluid image-player1" index="0" player="1" onClick={playerAction}/>
        </div>
        <div className="col-md-3 col-2 d-flex justify-content-center flex-column image">
            <img alt="" src="" className="img-fluid image-player1" index="1" player="1" onClick={playerAction}/>
        </div>
        <div className="col-md-3 col-2 d-flex justify-content-center flex-column image">
            <img alt="" src="" className="img-fluid image-player1" index="2" player="1" onClick={playerAction}/>
        </div>
        <div className="col-md-3 col-2 d-flex justify-content-center flex-column image">
            <img alt="" src="" className="img-fluid image-player1" index="3" player="1" onClick={playerAction}/>
        </div>
    </div>
    <div className="col-md-6 col-12 col-sm-12 d-flex justify-content-start justify-content-md-start order-md-1 p-0 m-2 m-md-auto" id="assets-container-player1">
        <div className="col-md-3 col-4 d-flex flex-column justify-content-center m-1 pt-4 order-md-2" id="player1buttons">
            <button className="btn mt-2 btn-sm btn-primary" id="throwcardplayer1" onClick={CallButtons}>THROW CARD</button>
            <button className="btn mt-2 btn-sm btn-success" id="freethrowplayer1" onClick={CallButtons}>FREE THROW</button>
            <button className="btn mt-2 btn-sm btn-warning" id="monkeplayer1" onClick={CallButtons}>MONKE</button>
            <button className="btn mt-2 btn-sm btn-danger" id="endturnplayer1" onClick={CallButtons}>END TURN</button>
            <button className="btn mt-2 btn-sm btn-dark" id="specialplayer1" onClick={CallButtons}>ACTIVATE SPECIAL</button>
        </div>
        <div className="col-md-5 col-3 m-2 p-0 d-flex align-items-center order-md-1" id="specialdivplayer1">
            <p className="text-center font-bold text-white" id="specialtextplayer1"></p>
            <img alt="" src="" className="img-fluid" id="specialimgplayer1" />
        </div>
        <div className="col-md-3 col-3 m-2 p-0 d-flex align-items-center order-md-3">
            <img alt="" src={Images["transparent"]} className="img-fluid" id="player1pick" />
        </div>
        <div className="order-md-0 vertical-line rounded"></div>
    </div>
</div>

  );
}