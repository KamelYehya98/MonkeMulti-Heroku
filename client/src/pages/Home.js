import React from 'react';
import { Link } from "react-router-dom";
import logo from '../img/MonkeLogo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Home.css'

const Home = () => {

    return (
        <div className="container-fluid fluid-container">
                <div className="d-flex flex-xl-row flex-column align-items-center row" >
                
                    <div className="order-1 order-xl-0 col-12 mt-5 col-md-8 offset-md-2 col-xl-5 offset-xl-0">
                        <img src={logo} alt='Monkey Logo' onContextMenu="return false;" className="mb-2 col-10 offset-1 offset-md-0 col-xl-10 offset-xl-1"/>
                    </div>
                    
                    <div className="order-0 order-xl-0 col right-col mb-lg-5 col-xl-7 offset-xl-0 align-items-xl-center mb-xl-0">
                    
                        <div className="text-center right-col-content col-12 col-md-10 offset-md-1 col-xl-10 offset-xl-1">
                            <h1>Welcome To Monke!</h1>
                            <p className="text-center">Challenge your friends and other people online in this exciting card game that is fit for all ages!</p>
                            <Link to='/welcome' className="play-now-btn">PLAY NOW!</Link>
                            <Link to = '/howtoplay' className="learn-to-play">Learn to play.</Link>
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default Home