import React from 'react';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import arrow from '../img/arrow.svg';
import menu from '../img/menu.svg';
import exit from '../img/exit.svg';
import accountImage from '../img/account.svg';
import SERVER_URL from "../constants";

const Header = ({user, checkUser}) => {

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
        //document.querySelector(".account-options").style.display="block";
        document.querySelector('main').addEventListener('click', hideAccountOptions);
    }

    function hideAccountOptions(){
        document.querySelector(".account-options").style.display="none";
        document.querySelector('main').removeEventListener('click', hideAccountOptions);
    }

    function hideShowOptions() {
        if(window.innerWidth>1000){
            var e = document.querySelector(".account-options");
            if (e.style.display){
                if (e.style.display != 'none')
                {
                    e.style.display = 'none';
                }
                else
                {
                    e.style.display = 'block';
                    showAccountOptions();
                }
                //e.style.display = ((e.style.display!='none') ? 'none' : 'block');
            }
            else {
                e.style.display='block';
            }
        }
    }

    async function logOutCall(){
        let usr = await GetUsername();
        try{
            console.log('Reacccccccccccccccched logout');
            await fetch(`${SERVER_URL}/logout`, {
                method: 'POST',
                body: JSON.stringify({usr}),
                headers: { 'Content-Type' : 'application/json' },
                credentials: 'include'  
            });
            checkUser();
            hideAccountOptions();
        }catch(err){
            console.log(err);
        }
    }

    async function GetUsername(){
        let usr = undefined;
        try{
            console.log("GETTTTTTTTTTTING USEER");
            const res = await fetch(`${SERVER_URL}/checkuser`, {
                method: 'POST',
                headers: { 'Content-Type' : 'application/json' },
                credentials: 'include' 
            });
            const data = await res.json();
            usr = data.user;
            console.log("USER IN HEADER IS: " + usr);
        }catch(err){
            console.log(err);
        }
        return usr.username;
    }

    return (
        <header className="d-flex justify-content-between">
                <Link className="link logo" to="/">MONKE</Link>

                <img className="menu-button" src={menu} alt="Open Navigation" onClick={showNav}/>
                
                <nav>
                    <img className="exit-button" src={exit} alt="Close Navigation" onClick={hideNav}/>
                    <ul className="primary-nav">
                        <li><Link to="/welcome" className="link">Play</Link></li>
                        <li><Link to="/howtoplay" className="link">How To Play</Link></li>
                        <li><Link to="/about" className="link">About</Link></li>
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
                            <div className="account-nav" onClick={hideShowOptions}>
                                <p>{user}</p> <img src={accountImage} alt="Account"/>
                            </div>
                        )
                    }       

                    {user !=null && 
                        (<ul className="account-options">
                            <li>
                                <button className="link" onClick={logOutCall}>Log Out</button>
                            </li>
                        </ul>)
                    }
                    
                </nav>
            </header>
    )
}

export default Header;