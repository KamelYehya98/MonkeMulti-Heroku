import React from 'react';
import { Link } from "react-router-dom";
import logo from '../img/MonkeLogo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Home.css'

const Home = () => {
    
    return (
        <div className="container-fluid fluid-container">
                <div className="row d-flex flex-no-wrap flex-md-row flex-column">
                    <div className="col-md-6 order-md-0 order-1 d-flex justify-content-center left-col">
                        <img src={logo} alt='Monkey Logo' onContextMenu="return false;"/>
                    </div>

                    <div className="col-md-6 order-md-1 order-0 d-flex justify-content-center right-col">
                        <div className="right-col-content">
                            <h1>Welcome To Monke!</h1>
                            <p>Challenge your friends and other people online in this exciting card game that is fit for all ages!</p>
                            <Link className="play-now-btn">PLAY NOW!</Link>
                            <Link className="learn-to-play">Learn to play.</Link>
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default Home