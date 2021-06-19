var express = require("express");
var app = express();
const path = require('path');
const crypto = require('crypto');
const methodOverride = require('method-override');
const bodyParser = require("body-parser");
const morgan = require('morgan');
const db = require('./Mongodb/connection');
const checkAuth = require('./Authentication/middleware/check_auth');
var cors = require('cors');
const port = process.env.PORT || 8000;
var cookieParser = require('cookie-parser');
app.use(cookieParser());
require('dotenv').config();
const {
    connected
} = require("process");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.urlencoded());
app.use(cors());
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
const {
    response
} = require("express");
app.use('/api/v1/', require('./api_v1/project'), require('./api_v1/achievement'), require('./api_v1/event'),
    require('./api_v1/programmingEvent'), require('./api_v1/images'), require('./api_v1/webinarEvent'), require('./api_v1/blog'), require('./api_v1/material'), require('./api_v1/team'), require('./api_v1/video'));
var Blog = require('./models/blog');
var Team = require('./models/teamMember');
const teamMember = require("./models/teamMember");
app.use('/auth', require('./Authentication/routes/user'));
app.get("/admin/addEvent", checkAuth, function(req, res) {
    res.render("addEvent");
});
app.get("/admin/addAchievement", checkAuth, function(req, res) {
    res.render("addAchievement");
});
app.get("/admin/addProgramming", checkAuth, function(req, res) {
    res.render("addProgramming");
});
app.get("/admin/addWebinar", checkAuth, function(req, res) {
    res.render("addWebinar");
});
app.get("/admin/addBlog", checkAuth, (req, res) => {

    res.render("addBlog");
});
app.post("/admin/blogmanager", checkAuth, function(req, res) {
    console.log(req.body);
    Blog.find({
        $or: [{
            AuthorName: req.body.Author
        }, {
            Title: req.body.Author
        }]
    }, (err, obj) => {
        if (err) {
            res.status(500).json({
                error: err.message
            });
        } else {

            res.render("BlogManager", {
                blogs: obj,
            })

        }
    });
})
app.get("/admin/teammanager", checkAuth, function(req, res) {

    teamMember.find((err, obj) => {
        if (err) {
            res.status(500).json({
                error: err.message
            });
        } else {
            res.render("TeamManager", {
                obj: obj,
            })
        }
    });
});
app.post("/admin/teammanager", checkAuth, function(req, res) {
    console.log(req.body);
    Team.find({
        $or: [{
            FirstName: req.body.firstname
        }]
    }, (err, obj) => {
        if (err) {
            res.status(500).json({
                error: err.message
            });
        } else {

            res.render("TeamManager", {
                obj: obj,
            })

        }
    });
})
app.get('/', function(req, res) {

    res.status(200).json({
        Blog: {
            url: "https://codingclubnitm.herokuapp.com/api/v1/blog"
        },
        Events: {
            UpcomingEvent: {
                url: "https://codingclubnitm.herokuapp.com/api/v1/event"
            },
            ProgrammingEvent: {
                url: "https://codingclubnitm.herokuapp.com/api/v1/programming"
            },
            Webinar: {
                url: "https://codingclubnitm.herokuapp.com/api/v1/webinar"
            },
            Achievement: {
                url: "https://codingclubnitm.herokuapp.com/api/v1/achievement"
            }
        },
        Project: {
            url: "https://codingclubnitm.herokuapp.com/api/v1/project"
        },
        Resources: {
            Materials: {
                url: "https://codingclubnitm.herokuapp.com/api/v1/material"
            },
            Video: {
                url: "https://codingclubnitm.herokuapp.com/api/v1/video"
            }
        },
        Teams: {
            url: "https://codingclubnitm.herokuapp.com/api/v1/teammember"

        }
    });
});
app.get("/admin/blogmanager", checkAuth, function(req, res) {

    Blog.find((err, obj) => {
        if (err) {
            res.status(500).json({
                error: err.message
            });
        } else {
            res.render("BlogManager", {
                blogs: obj,
            })
        }
    });

});
app.get("/admin/addMaterial", checkAuth, function(req, res) {
    res.render("addMaterial");
});
app.get("/admin/addVideo", checkAuth, function(req, res) {
    res.render("addVideo");
});
app.get("/admin/addUser", checkAuth, function(req, res) {
    res.render("addUser");
});
app.get("/blog/:id", function(req, res) {
    var id = req.params.id;

    Blog.find({
        _id: id
    }, function(err, data) {
        if (err) {
            res.status(500).send(err.error);
        } else {
            var match = getHashTags(data[0].Tags);
            console.log(match);
            var url = "https://codingclubnitm.herokuapp.com/blog/" + data[0]._id;
            var imageurl = "https://codingclubnitm.herokuapp.com/api/v1/image/23653886ca4150e80f80a4cc5ca82d73.jpg"
            res.render('showBlog', {
                blog: data,
                match: match,
                url: url,
                imageurl: imageurl,
            });
        }
    });
})
app.get('/login', function(req, res) {
    res.render('login');
})
app.get('/admin', checkAuth, function(req, res) {
    res.render('admin', {
        name: req.cookies.name,
    });
});
app.get("/admin/addProject", checkAuth, function(req, res) {
    res.render("addProject");
});
app.post('/admin/blogpost', checkAuth, function(req, res) {
    console.log(req.body);
    res.send(req.body);
});

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Authorization");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,POST,DELETE,PATCH,GET');
        res.status(200).json({});
    }
    next();
});

function getHashTags(inputText) {
    var regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
    var matches = [];
    var match;

    while ((match = regex.exec(inputText))) {
        matches.push(match[1]);
    }

    return matches;
}
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});