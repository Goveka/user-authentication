const express= require("express");
const app=express();

const bcrypt = require('bcryptjs');
const assert = require('assert');
const mongoose = require('mongoose');
//const url='mongodb://localhost:27017/test'
const url='mongodb+srv://Sizwenkala:sizwe123@cluster0.fejtt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
 const port=process.env.PORT || 3007



//connect to bd
mongoose.connect(url,()=>{
console.log("connected to db!");
});

//middleware
app.use(express.static("public"));
app.use(express.json());
app.use(require('body-parser')());

app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/form.html')
})

function verify(req,res,next){
  const token=req.header('auth-token');
  if (!token) {
  return res.status(401).send('Access Denied');
  }
  try {
    const verified=jwt.verify(token,"dsfjewfjefwj");
    req.user=verified
  } catch (e) {
res.status(400).send('invalid token')
  }

}


// THE LOG IN AND SIGN UP FUNCTION

const User= require('./model/User');
const jwt=require('jsonwebtoken')


app.post('/register', async(req,res)=>{
//hashing
const salt = await bcrypt.genSalt();
const hashedPassword= await bcrypt.hash(req.body.password, salt);


//checking the user if is in database
const emailExist= await User.findOne({email: req.body.email});
const nameExist= await User.findOne({email: req.body.name});
if (emailExist) {
return res.status(400).send("the username and email  already exists, try loging in")
}

console.log(emailExist);

const user= new User({
  name:req.body.name,
  surname:req.body.surname,
  email:req.body.email,
  password:hashedPassword
});
try {
  const savedUser= await user.save()
  res.redirect('todo.html')
} catch (e) {
  res.status(400).send(e)
}
});

app.post('/login', async(req,res)=>{
  //checking email
  const user= await User.findOne({email: req.body.email});
if (!user) {
  return res.status(400).send("user not found, try signing up")
}
//checking password
const validPass=await bcrypt.compare(req.body.password, user.password);
if (!validPass) {
  return res.status(400).send('invalid password')
}else{
  return res.status(200).redirect('todo.html');
}

//create and assing jsonwebtoken
const token=jwt.sign({name: user.name}, "dsfjewfjefwj")
res.header("auth-token", token).send(token);



})
app.listen(port,()=> console.log("server is up and running on server 3007") )
