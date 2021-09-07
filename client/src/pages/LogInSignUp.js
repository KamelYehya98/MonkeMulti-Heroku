import React from 'react';
import { Route } from 'react-router-dom';
import cards from '../img/DecoratingCards.svg';
import LogIn from '../components/LogIn';
import SignUp from '../components/SignUp';
import Forgot from '../components/Forgot';
import Reset from '../components/Reset';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/LogInSignUp.css';

const LogInSignUp = () => {
    return (
        <div className="container d-flex justify-content-center">

            <div className="content">
                <img src={cards} className='card-decor' alt="Decor"/>
                
                <Route path='/login' exact component={LogIn} />          
                
                <Route path='/signup' exact component={SignUp} />
                
                <Route path='/forgot' exact component={Forgot}/>
                <Route path='/reset/:token' exact component={Reset} />
            </div>
        </div>
    );
}

export default LogInSignUp