import React from 'react'
import back from '../img/in-game/backcard.png'
import "./css/Room.css"

const Room = () => {
    return (
        <div className="container-fluid">
            <div className="room-container row d-flex justify-content-between">

                <div className="game col-12 col-md-6">
                    <div className="opponent-cards d-flex justify-content-evenly">
                        <div>
                            <img src={back} alt="Opponent Card 1"/>
                        </div>
                        <div>
                            <img src={back} alt="Opponent Card 2"/>
                        </div>
                        <div>
                            <img src={back} alt="Opponent Card 3"/>
                        </div>
                        <div>
                            <img src={back} alt="Opponent Card 4"/>
                        </div>
                    </div>
    
                    <div className="ground-card d-flex justify-content-around">
                            <img src={back} alt="Ground Card"/>
                    </div>
    
                    <div className="my-cards d-flex justify-content-around">
                        <div>
                            <img src={back} alt="My Card 1"/>
                        </div>
                        <div>
                            <img src={back} alt="My Card 2"/>
                        </div>
                        <div>
                            <img src={back} alt="My Card 3"/>
                        </div>
                        <div>
                            <img src={back} alt="My Card 4"/>
                        </div>
                    </div>
                </div>

                <div className="buttons col-6 col-md-3 offset-md-1 d-flex align-items-end">
                    <div>
                        <button className="throw-card-button">Throw Card</button>
                        <button className="free-throw-button">Free Throw</button>
                        <button className="end-turn-button">End Turn</button>
                        <button className="activate-special-button">Activate Special</button>
                        <button className="monkey-button">MONKEY!</button>
                    </div>
                </div>

                <div className="next-card col-6 col-md-2 d-flex align-items-end">
                        <img src={back} alt="Next Card"/>
                </div>

                <div className="chat col-12 mt-5" style={{background: "black", color: "white", height: "15em"}}>
                    Chat Box Placeholder
                </div>

            </div>
        </div>
    )
}

export default Room