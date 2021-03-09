var express = require("express");
var app = express();
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const mongoose = require("mongoose");
const db = mongoose.connection;
const bodyParser = require("body-parser");
const port = process.env.PORT || 8000;
const {
  connected
} = require("process");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.urlencoded());
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

app.set("views", __dirname + "/views"); // set express to look in this folder to render our view

//MONGO setup
mongoose.connect('mongodb+srv://Blogs:jrim6CerRL1qlDNd@codingclub.p5vjk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
let gfs;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("We are connected");
  //Init stream
  gfs = Grid(db.db, mongoose.mongo);
  gfs.collection('uploads');
});
const storage = new GridFsStorage({
  url: 'mongodb+srv://Blogs:jrim6CerRL1qlDNd@codingclub.p5vjk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({
  storage
});
//model config
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  writtenBy: String,
  created: {
    type: Date,
    default: Date.now
  }
});
var memberSchema = new mongoose.Schema({
  FirstName: String,
  LastName: String,
  Designation: Number,
  DesignationName: String,
  Github: String,
  LinkedIn: String,
  Instagram: String,
  filename: String,
});
var Blog = mongoose.model("Blog", blogSchema)
var TeamMember = mongoose.model("TeamMember", memberSchema);

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/events", function (req, res) {
  res.render("event");
});

//////////////////////////////////// Resources ///////////////////////////////////////////////////////////
app.get("/resources", function (req, res) {
  const f = Blog.find((err, obj) => {
    if (err) {
      res.send("error occured");
    } else
      res.render("resource", {
        blog: obj
      });
  })
});

//new Blog
app.get("/blogs/new", (req, res) => {
  res.render("newBlog");
})

//create Blog
app.post("/blogs", function (req, res) {
  // console.log(req.body.blog);
  Blog.create(req.body.blog, (err, newBlog) => {
    if (err) {
      // alert("Please fill the details correctly");
      res.render("newBlog");
    } else {
      res.redirect("resources");
    }
  })
})
//Show Blog
app.get("/resources/blog/:id", (req, res) => {
  let Foundid = req.params.id;
  // console.log(Foundid);
  Blog.findOne({
    _id: Foundid
  }, (err, foundBlog) => {
    if (err) {
      res.redirect("resources");
    } else {
      console.log(foundBlog);
      res.render("showBlog", {
        blog: foundBlog
      });
    }
  })
})

///////////////////////////////////Resources End///////////////////////////////////////////////////////////////////////////////


app.get("/projects", function (req, res) {
  res.render("project");
});




app.get("/teams", function (req, res) {
  TeamMember.find(function (err, obj) {
    if (err)
      res.send("Error occured");
    else
      res.render("team", {
        arr: obj,
        index: 0
      });
  }).sort({
    Designation: 1
  });
});



//@get for image with its filename
app.get('/profileImage/:filename', (req, res) => {
  gfs.files.findOne({
    filename: req.params.filename
  }, (err, file) => {
    //check if file 
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file Exists'
      });
    }
    //check if image
    if (file.contentType == 'image/jpeg' || file.contentType == 'img/png') {
      //Read output to the browser
      const readStream = gfs.createReadStream(file.filename);
      readStream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an Image'
      });
    }
  })
});
//new User
app.get("/addUser", function (req, res) {
  res.render("addUser");
});

//@post for adding a team member(Create user)
app.post("/adduser", upload.single('profileImage'), function (req, res) {
  let data = req.body;
  console.log(data);
  data["filename"] = req.file.filename;
  TeamMember.create(data, (err, newUser) => {
    if (err)
      res.send("Data Not uploaded");
    else
      res.redirect("adduser");
  });
});




app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});