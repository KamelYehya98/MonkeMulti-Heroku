import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Test() {

    let data = undefined;
    try{
        console.log('Reacccccccccccccccched getting GET requests');
        const res = await fetch('*', {
            method: 'GET',
            headers: { 'Content-Type' : 'application/json' },
            credentials: 'include'
        });
        data = await res.json();
        console.log(data);
    }catch(err){
        console.log(err);
    }

    if(data.user){
        return(
            <h1>User exists</h1>
        );
    }else{
        return(
            <h1>User doesn't exist</h1>
        );
    }
}