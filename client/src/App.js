import React, { useState, useEffect } from 'react';
import './css/App.css';
import UserContext from './components/AccountContext';
import { ToggleColorMode } from "./components/ToggleColorMode";
import { useLocation, Link } from "react-router-dom";
import Views from './components/Views';
import Logout from './components/login/Logout'
function App() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("Чё палишь?");
    fetch('https://p2w.pro/api/auth/me/')
      .then(response => response.json())
      .then(data => {
        if (data.loggedIn) {
          setLoggedIn(true);
          setUser(data.user);
        } else {
          setLoggedIn(false);
        }
      });
  }, []);

  return (
    <UserContext>
      <ToggleColorMode />
      <ul className='container'>
        {!isHomePage && (
          <li>
            <Link to="/" className='App-buttonToMain'>
              To Main
            </Link>
          </li>
        )}
        {loggedIn ? (
          <div className='GreetForm'>
            <Link to="/home/" className='Greet'>LoggedIn as {user.username}</Link>
            <Link onClick={Logout} className='Greet'>Logout</Link>
          </div>
        ) : (
          <Link to="/login/" className='Greet'>Sign Up</Link>
        )}
      </ul>
      <Views />
    </UserContext>
  );
}

export default App;