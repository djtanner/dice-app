const express = require('express');
const router = express.Router();
const app = express();


//API to send the value of a 6 sided dice roll
router.get('/roll', (req, res) =>{
    
    let roll = String(Math.floor(Math.random() * 6) + 1);
    
   //return res.send(roll)
   if (!roll){
    res.status(400).json({success:false, msg:'Problem with the roll' })
}
    res.status(201).json({success:true,roll:roll})


});




module.exports = router;