import React from 'react';
import { useHistory } from "react-router-dom";
import { SERVER_URL } from '../constants';

export default function SignUp({onLogIn}) {

 async function  SignUpForm(e){ 
  const history = useHistory();
  const routerToHome = () => {
    history.push('/');
  }


    // get values
    const form = document.querySelector('form');
    e.preventDefault();
    const emailError = document.querySelector('.email.error');
    const passwordError = document.querySelector('.password.error');
    const userError = document.querySelector('.username.error');
    const email = form.email.value;
    const password = form.password.value;
    const username = form.username.value;
    emailError.textContent = '';
    passwordError.textContent = '';
    userError.textContent = '';

    try {
        console.log("signup reached");
        const res = await fetch(`${SERVER_URL}/signup`, { 
          method: 'POST', 
          body: JSON.stringify({ email, password, username }),
          headers: {'Content-Type': 'application/json'},
          credentials: 'include'
        });
        const data = await res.json();
        if (data.errors) {
          emailError.textContent = data.errors.email;
          passwordError.textContent = data.errors.password;
          userError.textContent = data.errors.username;

        }
        if (data.user) {
          console.log(data.token);
          onLogIn(form.username.value);
          // window.location.assign('/');
          routerToHome();
        }
    }
    catch (err) {
      console.log(err);
    }
  }
  return (
    <div>
      <center>
        <h1>Create an Account</h1>
        <p>Keep track of your wins, rating and more by creating a new account!</p>
      </center>

      <form onSubmit={SignUpForm.bind(this)}>

        <label htmlFor="username">Username</label>
        <input id="username" type="text" name="username" placeholder="Enter Your Username" />
        <div className="username error"></div>

        <label htmlFor="email">Email</label>
        <input id="email" type="email" name="email" placeholder="Enter Your Email" />
        
        <div className="email error"></div>

        <label htmlFor="password">Password</label>
        <input id="password" type="password" name="password" placeholder="Enter Your Password" />
        <div className="password error"></div>

        <input className="button bottom-button" type='submit' value='Sign Up'/>
      </form>
    </div>
  )
}