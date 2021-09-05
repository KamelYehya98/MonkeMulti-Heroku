import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import SERVER_URL from "../constants";

export default function Forgot() {

  async function ForgotPass(e){

    const form = document.querySelector('form');
    const errorsEmail = document.querySelector('.email.error');
    e.preventDefault();

    //reset errors
    errorsEmail.textContent = "";

    //get the values
    const email = form.email.value;

    try{
        console.log('Reacccccccccccccccched Forgot Password');
        const res = await fetch(`${SERVER_URL}/forgot`, {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: { 'Content-Type' : 'application/json' }, 
            credentials: 'include'
        });
        const data = await res.json();
        console.log(data);
        if(data){
            errorsEmail.textContent = data.message;
        }
    }catch(err){
        console.log(err);
    }
}

return (
    <form onSubmit={ForgotPass.bind(this)} className="form-group">
      <center>
        <h1>Forgot Password?</h1>
        <p>You can reset your password using the email you enter below.</p>
      </center>
      
      <div className="error email"></div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" placeholder="Enter Your Email" type="email"/>
      </div>
      <input className="button bottom-button" type='submit' value='Submit'/>
    </form>
  );
}