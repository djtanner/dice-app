import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import HighScores from './Components/HighScores';
import Login from './Components/Login';
import {useCookies} from 'react-cookie';
import Header from './Components/Header';


const root = ReactDOM.createRoot(document.getElementById('root'));

const Routing = () => {

  const [cookies, setCookie, removeCookie] = useCookies(['user'])

    const authToken = cookies.AuthToken

  return(
    
    <Router>
    <Header authToken={authToken}/>
      <Routes>
        <Route exact path="/" element={<App/>} />
        <Route path="/highscores" element={<HighScores/>} />  
        <Route path="/login" element={<Login/>} />  
        <Route path="/signup" element={<Login/>} />  
      </Routes>
    </Router>
  )
}





root.render(
  <React.StrictMode>
    {/* <App /> */}
    <Routing />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
