router.post('/login', async(req,res)=>{
  //checking email
  const emailExist= await User.findOne({email: req.body.email});
if (!emailExist) {
  return res.status(400).send("the user doesn't  exists, try signup in")
}

res.send('sucess');

})



const emailExist= await User.find({email: req.body.email});
if (emailExist) {
  return res.status(400).send("the user already exists, try loggin in")
}
res.send("sucess")
