import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Test() {

    const [data, setData] = useState(null);

    
    async function khara(){
        try{
            console.log('Reacccccccccccccccched getting GET requests');
            const res = await fetch('checkuser', {
                method: 'POST',
                headers: { 'Content-Type' : 'application/json' },
                credentials: 'include'
            });
            const dummy = await res.json();
            if (dummy !== data)
            {
                setData(dummy);
            }
            console.log(data);
        }catch(err){
            console.log(err);
        }
    }
    
    khara();

    if(data){
        if(data.user){
            return(
                <h1>User exists</h1>
            );
        }else{
            return(
                <h1>User doesn't exist</h1>
            );
        }
    }else{
        return(
            <h1>Data undefined</h1>
        );
    }
}