import React, { useState } from "react";
import { Link } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import arrow from './img/arrow.svg'
import menu from './img/menu.svg'
import exit from './img/exit.svg'
import accountImage from './img/account.svg'
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import LogOut from "./components/LogOut";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LogInSignUp from "./pages/LogInSignUp";
import Lobby from "./pages/Lobby";
import {socket} from "./services/socket";

function App() {
    
    // Global state variables
    

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
            if (user == null || data.user == null || data.user.username !== user.username)
            {
                setUser( data.user );
            }
            if (user == null)
            {
                console.log("User ba3do null");
            }
            else
            {
                console.log("L user battal null. It's: " + user.username);
                if (socket.connected && user.username !== null)
                {
                    socket.emit('set username', user.username);
                    socket.emit('welcome');
                }
            }
            
        }catch(err){
            console.log(err);
        }
    }
    checkUser();
    
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
                            <LogOut checkUser={checkUser}/>
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
                    <Route path='/joinroom' exact component={Lobby} />
                </Switch>
            </main>
            
        </Router>
    );
}

export default App;