import React from 'react';
import { Link } from "react-router-dom";
import SERVER_URL from "../constants";

export default function SignUp() {

 async function  SignUpForm(e){ 
  //const history = useHistory();
  // const routerToHome = () => {
  //   history.push('/');
  // }


    // get values
    const form = document.querySelector('form');
    e.preventDefault();
    const emailError = document.querySelector('.email.error');
    const passwordError = document.querySelector('.password.error');
    const userError = document.querySelector('.username.error');
    const email = form.email.value;
    const password = form.password.value;
    const username = form.username.value;
    emailError.innerHTML = '';
    passwordError.innerHTML = '';
    userError.innerHTML = '';

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
          emailError.innerHTML = data.errors.email;
          passwordError.innerHTML = data.errors.password;
          userError.innerHTML = data.errors.username;
        }
        else if (data) {
          console.log(data.token);
          //onLogIn(form.username.value);
          window.location.assign('/');
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
        <div className="username error text-danger p1"></div>
        <input id="username" type="text" name="username" placeholder="Enter Your Username" />

        <label htmlFor="email">Email</label>
        <div className="email error text-danger p-1"></div>
        <input id="email" type="email" name="email" placeholder="Enter Your Email" />
        
        <label htmlFor="password">Password</label>
        <div className="password error text-danger p-1"></div>
        <input id="password" type="password" name="password" placeholder="Enter Your Password" />
        
        <input className="button bottom-button" type='submit' value='Sign Up'/>
      </form>

      <center><Link className="forget-password" to='/login'>Already have an account? Log in here!</Link></center>
    </div>
  )
}