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
]

const refreshTokens = [

]

const setUser = (req,res,next)=>{
    const userId = req.body.userId;
    const user = posts.filter(u=>u.id === userId)[0];
    req.user = user;
    next();
}

const authUser = (req,res,next)=>{
    const user = req.user;
    if(!user){
        return res.status(400).send('You have to log in');
    }
    next();
}

const generateAccessToken = (user)=>{
    // Kreiranje jwt tokena koji istice za 30s
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{expiresIn:'30s'});
    return accessToken;

}

app.post('/login',setUser, authUser,(req,res)=>{
    // Authenticate User
    
    const username = req.user.username;
    const user = {username:username};
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN);
    console.log(refreshToken);
    refreshTokens.push(refreshToken);
    res.json({accessToken:accessToken,refreshToken:refreshToken});
})

app.post('/token',(req,res)=>{
    const refreshToken = req.body.token;
    if(!refreshToken) return res.status(401).send('You didnt provided refresh token');
    if(!refreshToken.includes(refreshToken)) return res.status(403).send('Token is not valid')
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN,(err,user)=>{
        console.log(user);
        if(err) return res.status(403).send('Your token is not valid');
            const accessToken = generateAccessToken({username:user.username});
            console.log(accessToken);
            res.status(203).json({accessToken:accessToken});
    })


    
})



app.listen(process.env.SERVER_TWO_PORT,(req,res)=>{
    console.log('Server is active on port ' + process.env.SERVER_TWO_PORT);
})

// Server na portu 5000 koristimo da autentifikujemo korisnika na serveru 4000

// Korisnik je ostavio podatke, u ovom slucaju username, realan slucaj username + password
// Posle verifikacije lozinke kreiramo jwt token
// Delovi tokena 
            // header(algoritam za sifrovanje, tip)
            // payload(podaci)
            // potpis (sifrovani header + sifrovani payload + 256 byte secret passoword)

// Dobijamo accessToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFsZWtzYW5kYXIiLCJpYXQiOjE2ODYyNjQ1NjIsImV4cCI6MTY4NjI2NDU5Mn0.q_KGe3ncv_Lsjoan2lfaG3qlRC8SZ5PV1dDGE5of1mo
            
// Pristup resursima mozemo ograniciti vremenom postojanja tokena

// Kada token istekne potreban nam je refreshToken ne bi li dobili ponovo access Token

// Refresh token kreiramo kao i access token s time da imamo posebnu "tajnuRec" koja se razlikuje
// od one koju smo koristili za access token.

// Pri kreiranju access tokena dobijamo i refresh token koji je kreiran istom metodom kao access token
// s time sto ima drugaciju tajnu rec.

// Posto znamo refresh token i tajnu sifru iz toga mozemo izvuci podakte o korisniku 

// jwt.verify(secretToken,refreshSecret) = user