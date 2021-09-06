import { useHistory } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import SERVER_URL from "../constants";

export default function LogOut() {

    const history = useHistory();
    console.log(`Working URL in LogOut ${SERVER_URL}`);
    const state = {redirect: '/login'};

    const routerToLogin = () => {
        history.push('/login');
    }

    async function logOutCall(){
        try{
            console.log('Reacccccccccccccccched logout');
            const res = await fetch(`${SERVER_URL}/logout`, {
                method: 'POST',
                headers: { 'Content-Type' : 'application/json' },
                credentials: 'include'  
            });
            routerToLogin();
        }catch(err){
            console.log(err);
        }
    }

    return (
        <button className="btn btn-danger text-light" onClick={logOutCall}>Log Out</button>
    );
}