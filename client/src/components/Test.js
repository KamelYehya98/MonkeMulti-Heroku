import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Test({username}) {

    if(username){
        return(
            <h1>User exists</h1>
        );
    }
    else{
        return(
            <h1>User doesn't exist</h1>
        );
    }
}