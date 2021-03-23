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

///////////////MONGO setup///////////////////////////////////
mongoose.connect('mongodb+srv://Blogs:VEaR2WXkcJobp00v@codingclub.p5vjk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
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
  url: 'mongodb+srv://Blogs:VEaR2WXkcJobp00v@codingclub.p5vjk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
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
var Blog = require("./models/blog");
var TeamMember = require("./models/teamMember");
var Project = require("./models/project");
var Event = require("./models/event");
var Achievement = require("./models/achievement");
var Materials = require("./models/material");
var Video = require("./models/video");
var Programming = require("./models/Programming");
var Webinar = require("./models/Webinar");


/////////////Landing/////////////////////////////////////////////////////////////
app.get("/", function (req, res) {
  res.render("index");
});
///////////////////Events/////////////////////////////////////////////////////
app.get("/events", function (req, res) {

  Event.find(function (err, obj) {
    if (err)
      res.send("Error occured");
    else {
      Achievement.find(function (err, obj1) {
        if (err)
          res.send("Error Occured");
        else {
          Programming.find(function (err, obj2) {
            if (err)
              res.send("Error Occurred");
            else {
              Webinar.find(function (err, obj3) {
                if (err)
                  res.send("Error Occurred");
                else {
                  res.render("event", {
                    arr: obj,
                    achievement: obj1,
                    programming: obj2,
                    webinar: obj3,
                  });
                }
              })
            }
          })
        }

      })

    }
  }).sort({
    StartDate: 1
  });
});
//add new event route
app.get("/admin/addEvent", function (req, res) {
  res.render("addEvent");
});
app.post("/admin/addEvent", upload.single('EventPoster'), function (req, res) {
  let newEvent = req.body;
  console.log(newEvent);
  newEvent["FileName"] = req.file.filename;
  Event.create(newEvent, (err, newUser) => {
    if (err)
      res.send("Data Not uploaded");
    else
      res.redirect("/admin/addEvent");
  });
});
app.get("/admin/addAchievement", function (req, res) {
  res.render("addAchievement");
});
app.post("/admin/addAchievement", upload.single('achievementImage'), function (req, res) {
  let newAchievement = req.body;
  console.log(newAchievement);
  newAchievement["FileName"] = req.file.filename;
  Achievement.create(newAchievement, (err, newAchievement) => {
    if (err)
      res.send("Data Not uploaded");
    else
      res.redirect("/admin/addAchievement");
  });
});
app.get("/admin/addProgramming", function (req, res) {
  res.render("addProgramming");
});
app.post("/admin/addProgramming", upload.single('Image'), function (req, res) {
  let newProgEvent = req.body;
  console.log(newProgEvent);
  newProgEvent["FileName"] = req.file.filename;
  Programming.create(newProgEvent, function (err, obj) {
    if (err)
      res.send("Error Occurred");
    else {
      res.redirect("/admin/addProgramming");
    }
  })
});
app.get("/admin/addWebinar", function (req, res) {
  res.render("addWebinar");
});
app.post("/admin/addWebinar", upload.single('Image'), function (req, res) {
  let newProgEvent = req.body;
  console.log(newProgEvent);
  newProgEvent["FileName"] = req.file.filename;
  Webinar.create(newProgEvent, function (err, obj) {
    if (err)
      res.send("Error Occurred");
    else {
      res.redirect("/admin/addProgramming");
    }
  })
});
//////////////////////////////////// Resources ///////////////////////////////////////////////////////////
app.get("/resources", function (req, res) {
  const f = Blog.find((err, obj) => {
    if (err) {
      res.send("error occured");
    } else {
      Materials.find((err, obj1) => {
        if (err)
          res.send("error Occurred");
        else {
          Video.find((err, obj2) => {
            if (err)
              res.send("Error Occurred");
            else {
              res.render("resource", {
                blog: obj,
                Material: obj1,
                Video: obj2,
              });
            }
          })
        }
      })
    }
  })
});

///new Blog
app.get("/admin/addBlog", (req, res) => {
  res.render("addBlog");
})

//create Blog
app.post("/admin/addBlog", upload.single('blogImage'), function (req, res) {

  let newData = req.body;
  console.log(newData);
  newData["FileName"] = req.file.filename;
  Blog.create(newData, (err, newBlog) => {
    if (err) {
      // alert("Please fill the details correctly");
      res.render("addBlog");
    } else {
      res.redirect("/resources");
    }
  });
});
//Show Blog
app.get("/admin/resources/blog/:id", (req, res) => {
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
app.get("/admin/addMaterial", function (req, res) {
  res.render("addMaterial");
});
app.post("/admin/addMaterial", function (req, res) {
  let newData = req.body;
  console.log(newData);
  let getYear = newData.AcademicYear;
  Materials.findOne({
    Year: getYear
  }, function (err, foundData) {
    if (err) {
      res.send("Error Occurred");
    } else {
      if (foundData === null) {
        let newobj = {
          Year: getYear,
          Field: {
            Orientation: {
              Event: [],
            },
            Assignment: {
              Event: [],
            },
            Presentation: {
              Event: [],
            }
          }
        }
        Materials.create(newobj, function (err, newBlog) {
          if (err) {
            // alert("Please fill the details correctly");
            res.send("Error Occured");
          } else {
            console.log("Object Added Successfully");
            var str = "Field." + newData.Field + ".Event";
            console.log(str);
            Materials.findOneAndUpdate({
              Year: getYear
            }, {
              $push: {
                [str]: {
                  Link: newData.Link,
                  Name: newData.Name
                }
              }
            }, null, function (err, docs) {
              if (err) {
                console.log(err);
                res.send("Error Occurred");
              } else {
                console.log("Original Doc : ", docs);
                res.send("Successfull");
              }
            });
          }
        });

      } else {
        var str = "Field." + newData.Field + ".Event";
        console.log(str);
        Materials.findOneAndUpdate({
          Year: getYear
        }, {
          $push: {
            [str]: {
              Link: newData.Link,
              Name: newData.Name
            }
          }
        }, null, function (err, docs) {
          if (err) {
            console.log(err);
            res.send("Error Occurred");
          } else {
            console.log("Original Doc : ", docs);
            res.send("Successfull");
          }
        });
      }
    }
  });

});
app.get("/admin/addVideo", function (req, res) {
  res.render("addVideo");
});
app.post("/admin/addVideo", function (req, res) {
  let newVideo = req.body;
  console.log(newVideo);
  Video.create(newVideo, function (err, obj) {
    if (err) {
      res.send("Error Occurred");
    } else {
      res.redirect("/admin/addVideo");
    }
  })
});
///////////////////////////////////Resources End///////////////////////////////////////////////////////////////////////////////

////////////////////////teams ///////////////////////////////////////////////////////

app.get("/teams", function (req, res) {
  TeamMember.find(function (err, obj) {
    if (err)
      res.send("Error occured");
    else
      res.render("team", {
        arr: obj,
      });
  }).sort({
    Designation: 1
  });
});



//@get for image with its filename
app.get('/admin/Image/:filename', (req, res) => {
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
app.get("/admin/addUser", function (req, res) {
  res.render("addUser");
});

//@post for adding a team member(Create user)
app.post("/admin/addUser", upload.single('profileImage'), function (req, res) {
  let data = req.body;
  console.log(data);
  data["filename"] = req.file.filename;
  TeamMember.create(data, (err, newUser) => {
    if (err)
      res.send("Data Not uploaded");
    else
      res.redirect("/admin/addUser");
  });
});

// ////////// Project//////////////////////////////////////////////////////////////
app.get("/projects", function (req, res) {
  Project.find(function (err, obj) {
    if (err)
      res.send("Error occured");
    else
      res.render("project", {
        arr: obj
      });
  }).sort({
    StartDate: 1
  });
});


app.get("/admin/addProject", function (req, res) {
  res.render("addProject");
})
app.post("/admin/addProject", upload.single('projectImage'), function (req, res) {
  // console.log(req.body.blog);
  let data = req.body;
  console.log(data);
  data["FileName"] = req.file.filename;
  Project.create(data, (err, newProject) => {
    if (err)
      res.send("Data Not uploaded");
    else
      res.redirect("/admin/addProject");
  });
})


app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});