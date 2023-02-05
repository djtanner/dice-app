import React from "react";
import { Link } from "react-router-dom";
import { useCookies } from 'react-cookie'


export default function Header(props){
    const [ cookies, setCookie, removeCookie ] = useCookies(['user'])

    const logout = () => {
        removeCookie('UserId', cookies.UserId)
        removeCookie('AuthToken', cookies.AuthToken)
        window.location.reload()
    }

    return(
        <div className = "header-component">

        <ul>
        <li><Link to={`/`}>Home</Link></li>
        <li><Link to={`/highscores`}>High Scores</Link></li>
        </ul>
       {props.authToken ?  <button onClick={logout}> Sign Out </button> : <button> <Link to={`/login`}>Login</Link></button>}



        </div>



    )
}