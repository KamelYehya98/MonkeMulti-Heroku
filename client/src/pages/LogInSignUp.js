import React from 'react';
import { Route } from 'react-router-dom';
import { Link } from "react-router-dom";
import cards from '../img/DecoratingCards.svg';
import LogIn from '../components/LogIn';
import SignUp from '../components/SignUp';
import Forgot from '../components/Forgot';
import Reset from '../components/Reset';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/LogInSignUp.css';

const LogInSignUp = ({onLogIn}) => {
    return (
        <div className="container d-flex justify-content-center">
                <div className="content">
                    <img src={cards} className='card-decor' alt="Decor"/>
                    
                    <Route path='/login' exact>
                        <LogIn onLogIn = {onLogIn}/>
                        <center><Link className="forget-password" to='/signup'>Don't have an account? Create one here!</Link></center>
                    </Route>
                    <Route path='/signup' exact>
                        <SignUp onLogIn = {onLogIn}/>
                        <center><Link className="forget-password" to='/login'>Already have an account? Log in here!</Link></center>
                    </Route>
                    <Route path='/forgot' exact component={Forgot}/>
                    <Route path='/reset/:token' exact component={Reset} />
                </div>
        </div>
    )
}

export default LogInSignUp