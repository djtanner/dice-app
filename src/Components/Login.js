import React from "react";
import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {useCookies } from 'react-cookie'


export default function Login(props){
    const [name, setName] = React.useState(null)
    const [email, setEmail] = React.useState(null)
    const [password, setPassword] = React.useState(null)
    const [error, setError] = React.useState(null)
    const [ cookies, setCookie, removeCookie] = useCookies(null)
    const [isSignUp, setIsSignUp] = React.useState(false)

    let navigate = useNavigate()

    function handleSignUp(){
        setIsSignUp(prevSignUp => !prevSignUp);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            if(password.length < 5){
                setError('Password must be at least 5 characters long')
                return;
            }
    
            const response = await axios.post(`http://localhost:8082/${isSignUp ? 'signup' : 'login'}`, { email, password, name})
    
            setCookie('UserId', response.data.userID);
            setCookie('AuthToken', response.data.token);
    
            const success = response.status === 201
    
            if (success && !isSignUp) navigate('/highscores')
            if (success && isSignUp) navigate('/')

            window.location.reload()
    
            }
        catch (error){
            console.log(error)
        }
    }

    return(

        <div>
        
        { isSignUp ? 
            <h2 className="login-title">Please create an account.</h2> :
        <h2 className="login-title">Welcome Back! Please Log In.</h2>
        }
            <div className="login">
            
                <form onSubmit={handleSubmit}>
            
              { isSignUp?  <label>
                        Your Name for the High Scores:
                    
                        <input 
                            type="text" 
                            name="name"
                            id = "name"
                            placeholder = "name"
                            required = {true}
                            onChange={(e) => setName(e.target.value)}
                            />
                    </label> :""}


                    <label>
                    Email:
                            <input type="text" 
                            name="email"
                            id = "email"
                            placeholder = "email"
                            required = {true}
                            onChange={(e) => setEmail(e.target.value)}
                             />
                    </label>
                    
                    <label>
                    Password:
                    <input 
                        type="password"
                        id="password"
                        name="password"
                        placeholder="password"
                        required={true}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    </label>
                    <input type="submit"/>
                </form>

                { isSignUp ?
                    <span>Already have an account? <button className="login-link" onClick = {handleSignUp}><Link to={`/login`}>Log in</Link></button></span> :
                    <span>Need an account? <button className="login-link" onClick = {handleSignUp}><Link to={`/signup`}>Sign Up</Link></button></span>

                }
            </div>



        </div>
    )
}