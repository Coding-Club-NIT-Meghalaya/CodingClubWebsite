var express = require("express");
var app = express();
const path = require('path');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { connected } = require("process");


app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));

app.set("views", __dirname + "/views"); // set express to look in this folder to render our view


//MONGO setup
mongoose.connect('mongodb+srv://Blogs:Fuu1act2J6PwKodj@codingclub.p5vjk.mongodb.net/blog?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})  

//model config
var blogSchema= new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  writtenBy: String,
  created: {type: Date, default:Date.now}
});
var Blog = mongoose.model("Blog", blogSchema)

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/events", function (req, res) {
  res.render("event");
});

app.get("/resources", function (req, res) {
  const f = Blog.find((err, obj)=>{
    if(err){
      res.send("error occured");
    }else
    res.render("resource", {blog: obj});
  })

});
app.get("/projects", function (req, res) {
  res.render("project");
});
app.get("/teams", function (req, res) {
  res.render("team");
});

app.get("/blogs/new", (req, res)=>{
  res.render("newBlog");
})

//create
app.post("/blogs", function(req, res){
  // console.log(req.body.blog);
  Blog.create(req.body.blog, (err, newBlog)=>{
    if(err){
      alert("Please fill the details correctly");
      res.render("newBlog");
    }else{
      res.redirect("resources");
    }
  })
})

app.get("/resources/blog/:id", (req, res)=>{

  let Foundid= req.params.id;
  // console.log(Foundid);
  Blog.findOne({_id: Foundid}, (err, foundBlog)=>{
    if(err){
        res.redirect("resources");
    }else{
      console.log(foundBlog);
      res.render("showBlog", {blog: foundBlog});
    }
  })
})

const port = 8000;
app.set("port", process.env.PORT || port); // set express to use this port


app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});


