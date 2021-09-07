import React from 'react';
import {useParams} from 'react-router-dom';
import SERVER_URL from "../constants";

export default function Reset() {

  const { token } = useParams();
  console.log("token: " + token);

 async function  NewPasswordForm(e){ 

    // get values
    const form = document.querySelector('form');

    e.preventDefault();
    const passwordError = document.querySelector('.password.error');
    const password1 = form.password1.value;
    const password2 = form.password2.value;
    passwordError.innerHTML = '';

    if(password1 !== password2)
        passwordError.innerHTML = "Passwords don't match<br>";
    
    if(password1.length < 6)
        passwordError.innerHTML += "Minimum Length is 6 Characters";

    if(passwordError.innerHTML !== "")
      return;
    

    try {
        console.log("new password reached");
        const res = await fetch(`${SERVER_URL}/reset/:` + {token}, { 
          method: 'POST', 
          body: JSON.stringify({ password1, token }),
          headers: {'Content-Type': 'application/json'},
          credentials: 'include'
        });
        const data = await res.json();  
        if(data) {
          passwordError.innerHTML = data.message;
        }
    }
    catch (err) {
      passwordError.innerHTML = err.message;
    }
  }
  return (
    <form onSubmit={NewPasswordForm.bind(this)} >
      <center><h1>Change Your Password</h1></center> 

      <div className="password error"></div>

      <label htmlFor="password1">Enter Password</label>
      <input type="text" id="password1" name="password1" placeholder="Enter Password" />

      <label htmlFor="password2">Confirm Password</label>
      <input type="password" id="password2" name="password2" placeholder="Confirm Password" />

      <input className="button bottom-button" type='submit' value='Submit Changes'/>
    </form>
  )
}