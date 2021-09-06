import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import arrow from './img/arrow.svg'
import menu from './img/menu.svg'
import exit from './img/exit.svg'
import accountImage from './img/account.svg'
import Home from "./pages/Home";
import Forgot from "./pages/LogInSignUp";
import Reset from "./pages/LogInSignUp";
import Welcome from "./pages/Welcome";
import Lobby from "./pages/Lobby";
import LogOut from "./components/LogOut";
import PlayerStats from "./components/PlayerStats";
import {io} from 'socket.io-client';
import Test from './components/Test'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LogInSignUp from "./pages/LogInSignUp";
//import { set } from "mongoose";


function App() {
    
    // Global state variables
    const socket = io();
    socket.on('connection');
    socket.emit('welcome');
    const [user, setUser] = useState(null);


    // Funtion to replace log in and sign up buttons with the account name

    // const onLogIn = (username) => {
    //     //setUsername(username);
    //     document.querySelector('.secondary-nav').style.display = 'none';
    //     document.querySelector('.account-nav').style.display = 'flex';
    //     document.querySelector('.account-options').style.display = 'none';
    // };

    // To hide and display the navigation tab and account options menu (log out and stats)

    const elements = document.getElementsByClassName("link");

    for(var i = 0; i<elements.length; i++){
        elements[i].addEventListener("click", hideNav);
    }

    function showNav(){
        const nav = document.querySelector("nav");
        nav.classList.add('nav-shown');
        document.querySelector('main').addEventListener('click', hideNav);
    }

    function hideNav(){
        const nav = document.querySelector("nav");
        nav.classList.remove('nav-shown');
        document.querySelector('main').removeEventListener('click', hideNav);
    }

    function showAccountOptions(){
        document.querySelector(".account-options").style.display="block";
        document.querySelector('main').addEventListener('click', hideAccountOptions);
    }

    function hideAccountOptions(){
        document.querySelector(".account-options").style.display="none";
        document.querySelector('main').removeEventListener('click', hideAccountOptions);
    }

    function hideShowOptions() {
        var menu = document.querySelector(".account-options");
        if (menu.style.display === "none") {
          showAccountOptions();
        } else {
          hideAccountOptions();
        }
    }

    async function checkUser(){
        try{
            const res = await fetch('checkuser', {
                method: 'POST',
                headers: { 'Content-Type' : 'application/json' },
                credentials: 'include'
            });
            const data = await res.json();
            setUser( data.user );
        }catch(err){
            console.log(err);
        }
    }
    useEffect(() => {
        checkUser();
    });
    
    return (
        <Router>
            <header className="d-flex justify-content-between">
                <Link className="link logo" to="/">MONKE</Link>

                <img className="menu-button" src={menu} alt="Open Navigation" onClick={showNav}/>
                
                <nav>
                    <img className="exit-button" src={exit} alt="Close Navigation" onClick={hideNav}/>
                    <ul className="primary-nav">
                        <li><Link to="" className="link">Play</Link></li>
                        <li><Link to="" className="link">How To Play</Link></li>
                        <li><Link to="" className="link">About</Link></li>
                    </ul>

                    {user==null &&
                        (
                        <ul className="secondary-nav">
                            <li><Link to="/login" className="link">Log in</Link></li>
                            <li><Link to="/signup" className="link sign-up">Sign Up <img src={arrow} alt=''/></Link></li>
                        </ul>
                        )
                    }

                    {user!=null &&
                        (
                        <ul className="secondary-nav">
                            <LogOut />
                        </ul>
                        )
                    }       

                    <div className="account-nav" onClick={hideShowOptions}>
                        {user!=null && (<div><p>{user.username}</p> <img src={accountImage} alt="Account Image"/></div>)}
                    </div>

                    {/* <ul className="account-options">
                        <li>
                            <button className="link">Stats</button>
                        </li>
                    </ul> */}
                    
                </nav>
            </header>

            <main>
                <Switch>
                    <Route path='/' exact component={Home} />
                    <Route path="/welcome" exact> 
                        <Welcome username={user!=null ? user.username: null}/>
                    </Route>
                    <Route path='/login' exact component={LogInSignUp} />
                    <Route path='/signup' exact component={LogInSignUp} />
                    <Route path='/logout' exact component={LogOut} />
                    <Route path='/forgot' exact component={Forgot} />
                    <Route path='/reset/:token' exact component={Reset} />
                    <Route path='/createroom' exact component={Lobby} />
                    <Route path='/joinroom' exact component={Lobby} />
                    <Route path='/getstats' exact>
                        <PlayerStats username={user!=null ? user.username: null} />
                    </Route>
                    <Route path='*' exact component={Test} />
                </Switch>
            </main>
            
        </Router>
    );
}

export default App;