const express = require("express");
const app= express();
const mongoose= require("mongoose");
const bodyParser= require("body-parser");
const jwt= require("jsonwebtoken");
const axios = require('axios');
//const url='mongodb://localhost:27017/test'
const url='mongodb+srv://Sizwenkala:sizwe123@cluster0.fejtt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const ejs= require("ejs");
const port=process.env.PORT || 2009


//middleware
app.use(express.static('public'));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// database models
const Blog= require("./models/Blog");

//connecting to the database
mongoose.connect(url,{useNewUrlParser: true,useUnifiedTopology: true});
const database = mongoose.connection
//checking if our connection to database was successful
database.on('error', (error)=>{
    console.log(error)
})
database.once('open', ()=>{
    console.log("database connected")
})


app.get('/', async(req,res)=>{
    try {
        //getting all blog post from the database
        const blogPosts=  await Blog.find({});
        blogPosts.sort((a,b)=> a._id - b._id);
        blogPosts.reverse();
        res.render('home', {blogPosts})
    } catch (error) {
        res.status(500).send({error: error.message})
    }
})

app.get('/proxy', async (req, res) => {
    try {
      const imageUrl = req.query.url;
  
      if (!imageUrl) {
        throw new Error('Image URL is missing.');
      }
  
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });
  
      if (response.status === 200) {
        const contentType = response.headers['content-type'];
        res.set('Content-Type', contentType);
        res.send(response.data);
      } else if (response.status === 404) {
        // Handle 404 Not Found
        res.status(404).send('Image not found');
      } else {
        throw new Error('Unexpected response status: ' + response.status);
      }
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).send('Internal Server Error');
    }
  });
  
  

app.get('/sizweAsadmin',(req,res)=>{
    const blogs=Blog.find({});
    res.render('admin', {blogs});
});

app.get('/article/:id/:tittle',async(req,res)=>{
    try {
        const post = await Blog.findById(req.params.id);
        const allBlogs= await Blog.find({});
       const recommended= allBlogs.filter(recommended => recommended.catergory.toString() === post.catergory)
       const removeCurrentPostFrmRecommended= recommended.filter(recommended => recommended._id.toString() !== req.params.id)
        res.render('post', {post, removeCurrentPostFrmRecommended})   
    } catch (error) {
        res.send(error)
    }
});

// The search function
app.get('/search/:searchString', async(req,res)=>{
    try {
        const searchedBlog= req.params.searchString;
       const post= await Blog.find({});
       const searchedBlogs= post.filter(searched => searched.tittle.toLowerCase().includes(searchedBlog) || searched.firstParagraph.toLowerCase().includes(searchedBlog));
        res.render('search', {searchedBlogs, searchedBlog});
    } catch (error) {
        res.status(500).send({error: error.message});
    }
})

app.get('/update_blogs', async(req,res)=>{
    try {
        const blogs= await Blog.find({});
        res.render('updateBlogs', {blogs});
    } catch (error) {
        res.status(500).send({error: error.message})
    }
});

app.get('/about', (req,res)=>{
    res.render('about', {});
});

app.post('/update_blog', async(req,res)=>{
    const{other,imageSrc,_id,firstParagraph,searchKeywords,contentImageUrl}= req.body; 
    try {
        Blog.findOne({_id:_id}).then(object => {
            if(!object){
                return res.status(404).send("object not found");
            }
            object.imageSrc=imageSrc;
            object.contentImageUrl=contentImageUrl;
            object.firstParagraph=firstParagraph;
            object.searchKeywords=searchKeywords
            object.other= other;

           return object.save();
        })
        .then(updatedObject =>{
            return res.status(200).redirect('/update_blogs')
        })
        .catch(err =>{
            return res.status(500).send({err: err.message})
        })
    } catch (error) {
        res.status(500).send({error:error.message})
    }
})

//creating new blog posts
app.post('/newBlog', async (req,res)=>{
    const{other,imageSrc,tittle,author,contentImageUrl,firstParagraph, date, catergory,searchKeywords}= req.body;
 
    //posting to the database
    try {
        const blog= new Blog({
            tittle:tittle,
            author:author,
            imageSrc: imageSrc,
            contentImageUrl:contentImageUrl,
            firstParagraph:firstParagraph,
            searchKeywords,
            other: other,
            date: date,
            catergory:catergory
        })
        //save to the database
blog.save();
res.redirect('/sizweAsadmin');
    } catch (error) {
        res.status(500).send({error: error.message})
    }
})

app.delete('/remove_blog/:id', async(req,res)=>{
    const objectId = req.params.id

    try {
        const deletedObject= await Blog.findByIdAndRemove(objectId);

        if(!deletedObject){
            return res.status(404).json({error: 'object not found'});
        }
        return res.json({message: 'object deleted successfully'});
    } catch (error) {
        return res.status(500).json({error: 'internal server error'});
    }
})

// rendering the image reducer to the front end
app.get('/image-perfector',(req,res)=>{
    res.render('imgReducer', {})
})

app.listen(port, ()=> console.log(`app is running on port ${port}`))
