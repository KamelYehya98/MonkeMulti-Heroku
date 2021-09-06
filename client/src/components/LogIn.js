import { Link, useHistory } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import SERVER_URL from "../constants";

export default function LogIn() {

  //const history = useHistory();
  console.log(`Working URL in Login ${SERVER_URL}`);
  //const state = {redirect: '/welocme'};

  // const routerToWelcome = () => {
  //     history.push('/welcome');
  // }
  async function LogInForm(e){
      const form = document.querySelector('form');
      const errorsUsername = document.querySelector('.username.error');
      const errorsPassword = document.querySelector('.password.error');
      e.preventDefault();

      //reset errors
      errorsPassword.innerHTML = "";
  
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
              errorsPassword.innerHTML = data.errors.password;
              errorsUsername.innerHTML = data.errors.username;
          }
          if(data.user){
              console.log('user logged in successfully');
<<<<<<< Updated upstream

              //onLogIn(form.username.value);
              onLogIn(form.username.value);
              routerToWelcome();
          }
          //window.location.assign('/welcome');
          
=======
              window.location.assign('/welcome');
          }          
>>>>>>> Stashed changes
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
          <div className="error username text-danger p-1" ></div>
          <input id="username" name="username" placeholder="Enter Your Username or Email" type="text" />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <div className="error password text-danger p-1"></div>
          <input id="password" name="password" placeholder="Enter Your Password" type="password" />
        </div>

        <Link className="forget-password" to='/forgot'>Forgot Password?</Link>
        <input className="button bottom-button" type='submit' value='Log In'/>
      </form>
      <center><Link className="forget-password" to='/signup'>Don't have an account? Create one here!</Link></center>
    </div>
  );
}