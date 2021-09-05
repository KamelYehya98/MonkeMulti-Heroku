import { Link, useHistory } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import SERVER_URL from "../constants";

export default function LogIn({onLogIn}) {
  
  console.log(`Working URL in Login ${SERVER_URL}`);
  
  const history = useHistory();
  const state = {redirect: '/welocme'};
  const routerToWelcome = () => {
    history.push('/welcome');
  }
  async function LogInForm(e){
    const form = document.querySelector('form');
    const errorsUsername = document.querySelector('.username.error');
    const errorsPassword = document.querySelector('.password.error');
    e.preventDefault();

      //reset errors
      errorsPassword.textContent = "";
  
      //get the values
      const username = form.username.value;
      const password = form.password.value;
  
      try{
        console.log('Reacccccccccccccccched');
          const res = await fetch(`${SERVER_URL}/login`, {
              method: 'POST',
              body: JSON.stringify({ username, password }),
              headers: { 'Content-Type' : 'application/json' },
              credentials: 'include'
          });
          const data = await res.json();
          console.log(data);
          if(data.errors){
              errorsPassword.textContent = data.errors.password;
              errorsUsername.textContent = data.errors.username;
          }
          if(data.user){
              console.log('user logged in successfully');
              onLogIn(form.username.value);
          }
          //window.location.assign('/welcome');
          routerToWelcome();
      }catch(err){
          console.log(err);
      }
}

async function logOutCall(){
  try{
    console.log('Reacccccccccccccccched logout');
      const res = await fetch(`${SERVER_URL}/logout`, {
          method: 'GET',
          headers: { 'Content-Type' : 'application/json' },
          credentials: 'include'
      });
  }catch(err){
      console.log(err);
  }
}

return (
  <div>
      <center><h1>Welcome Back!</h1></center>
      <form onSubmit={LogInForm.bind(this)} >

        <div>
          <label htmlFor="username">Username</label>
          <input id="username" name="username" placeholder="Enter Your Username or Email" type="text" />
          <div className="error username" ></div>
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" placeholder="Enter Your Password" type="password" />
          <div className="error password"></div>
        </div>

        <Link className="forget-password" to='/forgot'>Forgot Password?</Link>
        
        <input className="button bottom-button" type='submit' value='Log In'/>
      
      </form>

      <button onClick={logOutCall}>Log Out</button>
    </div>
  );
}