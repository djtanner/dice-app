import React from "react";
import axios from 'axios';
import {useCookies} from 'react-cookie'


export default function HighScores(){
    const[scoresTable, setScoresTable] = React.useState([])
    const[userScores, setUserScores] = React.useState([])
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const userID = cookies.UserId

   
    
    React.useEffect(() => {
       getScores()
    }, []) 


    //get a signed in user's scores
    const getScores = async () => {
          try {
            const response = await axios.get('http://localhost:8082/scores', {
                params: {userID}
            })
            setUserScores(response.data)
        } catch (error) {
            console.log(error)
        }
          
    }

   



    React.useEffect(() => {
        axios.get('http://localhost:8082/score')
       .then((res) => setScoresTable(res.data))
        
   }, []);

   // Get the names and scores from the data
   let scoreArray = scoresTable.map((each,i)=>(
    {name: each.userDetails[0].name, score:each.score}
   ))

   // Sort by highest score
   scoreArray.sort((a, b) => {
    return b.score - a.score;
});
   
    //Get the top 5 scores
    let topFive = scoreArray.slice(0,5)


   const tableElements = topFive.map((each,i) => (
    <tr key={i}> <td>{each.name}</td> 
    <td>  {each.score}</td>
    </tr>
  )
   )

   //Show signed in user's scores

   userScores.sort((a, b) => {
    return b.score - a.score;
});

   const userTable = userScores.map((each,i) => (
    <tr key={i}>
    <td>  {each.score}</td>
    </tr>
  )
   )



    return(
            <div>
                
                <h1>High Scores</h1>
                    <div className = "high-scores-container">
                        <table>
                            <thead>
                                <tr>
                                    <th> Name </th>
                                    <th> Score </th>
                                </tr>
                            </thead>

                            <tbody>
                            {tableElements}
                            
                            </tbody>
                        </table>
                    </div>

                        <h1>My Scores</h1>
                        <div className = "high-scores-container">
                        <table>
                            <thead>
                                <tr>
                                    <th> Scores </th>
                                </tr>
                            </thead>

                            <tbody>
                            {userTable}
                            
                            </tbody>
                        </table>
                        




                    </div>


            </div>


    )
}