import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LogInSignUp from "./pages/LogInSignUp";
import Lobby from "./pages/Lobby";
import Room from "./pages/Room";
import Header from "./components/Header";
import sok from "./services/socket";
import HowToPlay from "./pages/HowToPlay";
import About from "./pages/About";
import Footer from "./components/Footer";
import RandomLobby from "./pages/RandomLobby";

function App() {
    let socket = null;
        
    const [user, setUser] = useState(null);

    
    async function checkUser(){
        try{
            const res = await fetch('checkuser', {
                method: 'POST',
                headers: { 'Content-Type' : 'application/json' },
                credentials: 'include'
            });
            const data = await res.json();
            if (user == null || data.user == null || data.user.username !== user.username)
            {
                setUser( data.user );
            }
            if (user == null)
            {
                console.log("User ba3do null");
            }
            else
            {
                console.log("L user battal null. It's: " + user.username);
                socket = sok.getSocket();
                if (user.username !== null)
                {
                    socket.emit('set username', user.username);
                    socket.emit('welcome');
                }
            }
            
        }catch(err){
            console.log(err);
        }
    }
    checkUser();
    
    return (
        <Router>
            <Header user={user==null ? null : user.username} checkUser={checkUser}/>
            <main>
                <Switch>
                    <Route path='/' exact component={Home} />
                    <Route path="/welcome" exact> 
                        <Welcome username={user==null ? null : user.username}/>
                    </Route>
                    <Route path='/login' exact component={LogInSignUp} />
                    <Route path='/signup' exact component={LogInSignUp} />
                    <Route path='/joinroom' exact component={Lobby} />
                    <Route path='/room' exact  component={Room} />
                    <Route path='/howtoplay' exact component={HowToPlay} />
                    <Route path='/about' exact component={About} />
                    <Route path='/lobby/:roomID' exact  component={Lobby} />
                    <Route path='/randomlobby' exact component={RandomLobby} />
                </Switch>
            </main>
            <Footer/>
        </Router>
    );
}

export default App;