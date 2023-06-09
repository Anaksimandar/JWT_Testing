require('dotenv').config();

const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');

app.use(express.json());

const posts = [
    {
        id:1,
        username:"Aleksandar",
        title:"Post 1"
    },
    {
        id:2,
        username:"Milos",
        title:"Post 2"
    },
    {
        id:3,
        username:"Ana",
        title:"Post 3"
    }
];

// const authenticateToken = (req,res,next)=>{
//     const authHeader = req.headers['authorization']; // Bearer Token
//     const token = authHeader && authHeader.split(' ')[1];
//     if(token == null) return res.status(401).send('You have to log in first');
//     jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
//         if(err) return res.status(403).send('Autorization failed');
//         req.user = user;
//         console.log(user);
//         next();
//     })
// }

const generateAccessToken = (user)=>{
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, {expiresIn:'15s'});
}

app.get('/posts', (req,res)=>{
    const authHeader = req.headers['authorization']; // Bearer Token
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token);
    if(!token) return res.status(401).send('You have to log in first');
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err) return res.status(403).send('Autorization failed');
        res.json(posts.filter(post=>post.username === user.username));
        
        
    })

    

    
})




app.listen(process.env.SERVER_ONE_PORT,(req,res)=>{
    console.log('Server is active on port ' + process.env.SERVER_ONE_PORT);
})