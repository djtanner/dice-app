import './App.css';
import Dice from './Components/Dice';
import RollButton from './Components/RollButton';
import React from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie'
import { Link, useNavigate } from "react-router-dom";


function App() {
  
  
  
  const [diceNumber, setDiceNumber] = React.useState('1');
  const [diceArray, setDiceArray] = React.useState([]);
  const [gameOver, setGameOver] = React.useState(false);
  const [btnDisabled,setBtnDisabled] = React.useState("");
  const [score, setScore] = React.useState(0);
  const [roll, setRoll] = React.useState("")
  const [ cookies, setCookie, removeCookie] = useCookies(null)
  let userID = cookies.UserId
  let navigate = useNavigate()

    React.useEffect(() => {
      axios.get('http://localhost:8082/roll')
     .then((res) => setRoll(res.data.roll));
 }, [diceArray]);

  
 function handleClick(){
     
      setDiceNumber(roll)
      setDiceArray(oldArray =>  [...oldArray,roll])
      setScore(prevScore => prevScore += parseInt(roll))
      
  }

  function resetGame(){
      setDiceArray([]);
      setScore(0);
      removeCookie('Score', score);
      setBtnDisabled("");
      setGameOver(false);
  }

  const handleSave = async (e) => {
    e.preventDefault()

    try{
      const response = await axios.post("http://localhost:8082/score", { userID, score})

      const success = response.status === 201
    
            if (success) navigate('/highscores')
            
    }
    catch(error){
      console.log(error)
    }
  }



  React.useEffect(() =>{
    //console.log(diceArray); 
    if(diceArray.length === 5){
      setGameOver(true);
      setBtnDisabled("disabled");
      setCookie('Score', score);
      
    };
  },[diceArray,score])

  const diceElements = diceArray.map((each,i) => (
    <Dice key={i}  value = {each}/>


  ))

  
  return (
    <div >
    
      <div className='app'>
            <h1>Roll the Dice and try to get the highest score!</h1>
    
            <Dice  value = {diceNumber}/>
            <RollButton handleClick={handleClick} disabled ={btnDisabled}/>

        <section className="bottom">
            {diceArray.length > 0? <h2 className="score-label">Score: {score} </h2> : ""}
                <div className="score">
                  {diceElements}
                </div>  

                {gameOver? <div className='gameOver'><h1>Game Over</h1> {userID? <button onClick={handleSave}>Save Score</button> : <button className = "login-link" onClick={() => navigate('/login')}>Login to Save Your Score</button>}<button onClick={resetGame}>Reset</button></div> : ""}
        </section>
        </div>
    </div>
  );
}

export default App;
