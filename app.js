const express = require('express');
const app = express();
const roll = require('./routes/api/roll')
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config(); 
const  {v1:uuidv4} = require('uuid')
const uri = process.env.MONGO_URI;
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');



// cors
app.use(cors({ origin: true, credentials: true }));


app.get('/', (req, res) => res.send('Hello world!'));

//app.get('/test', (req, res) => res.send('test!')); 

//static assets
app.use(express.static('./methods-public'))
//app.use(express.static(__dirname + '/public'));

//parse form data !!!! use this built in method.
app.use(express.urlencoded({extended: false}))

//parse the json
app.use(express.json())

//Roll the dice
app.use('/', roll)

//Sign up a new user
app.post('/signup', async (req,res) => {
    const client = new MongoClient(uri)
    const {email, password, name} = req.body

    const generateduserID = uuidv4();
    const hashedPassword = await bcrypt.hash(password,10);

    try{
        await client.connect();
        const database = client.db('diceDB')
        const users = database.collection('users')

        const existingUser = await users.findOne({email})
        if (existingUser){
            return res.status(409).send('User already exists, please log in.')
        }

        const sanitizedEmail = email.toLowerCase();

        const data = {
            user_id: generateduserID,
            email: sanitizedEmail,
            pw: hashedPassword,
            name: name
        }
        const insertedUser = await users.insertOne(data);

        const token = jwt.sign(insertedUser,sanitizedEmail, {expiresIn: 60 * 24})
    
        res.status(201).json({token, userID: generateduserID, email: sanitizedEmail})
    }
    catch(error){
        console.log(error)
    }

}
)

//Login
app.post('/login', async (req,res) => {
    const client = new MongoClient(uri)
    const {email, password} = req.body  
    try{
        await client.connect()
        const database = client.db('diceDB')
        const users = database.collection('users')
    
        const user = await users.findOne({email})

        const correctPassword = ( await bcrypt.compare(password, user.pw))

        if (user && correctPassword ){
            const token = jwt.sign(user, email, {expiresIn: 60*24})

        
        res.status(201).json({token, userID: user.user_id, email})
        
    }

    res.status(400).send('Invalid Credentials')
}
 catch(error){
    console.log(error)
 }
})

//Post a score
app.post('/score', async (req,res) => {
    const client = new MongoClient(uri)
    const {userID, score} = req.body  
    try{
        await client.connect()
        const database = client.db('diceDB')
        const scores = database.collection('scores')
    
        const data = {
            user_id: userID,
            score: score
        }
        const insertedScore = await scores.insertOne(data);

        res.status(201).send('Saved score')
        
    }

 catch(error){
    console.log(error)
 }
})


//Get all users
app.get('/users', async (req,res) => {
    const client = new MongoClient(uri)

    try {
        await client.connect()
        const database = client.db('diceDB')
        const users = database.collection('users')

        const returnedUsers = await users.find().toArray()
        res.send(returnedUsers);

    } finally {
        await client.close();
    }
}) 

// Get individual user's scores
 app.get('/scores/', async (req, res) => {
    const client = new MongoClient(uri)
    const userID = req.query.userID
    try {
        await client.connect()
        const database = client.db('diceDB')
        const scores = database.collection('scores')
        
        const query = {user_id: userID}
        const scoreResult = await scores.find(query).toArray()
        res.send(scoreResult)
        
    } 
    
    catch(error){
        console.log(error)
     }
    
    finally {
        await client.close()
    }
}) 

//Get all the scores and join with users to return the names
app.get('/score', async (req,res) => {
    const client = new MongoClient(uri)

    try {
        await client.connect()
        const database = client.db('diceDB')
        const users = database.collection('scores')

        const returnedUsers = await users.aggregate([
            { $lookup:
                {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: 'user_id',
                    as:'userDetails'
                }

            }
        ]).toArray()
        res.send(returnedUsers);

    } 
    finally {
        await client.close();
    }
}) 






const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));

