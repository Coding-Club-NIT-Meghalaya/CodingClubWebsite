var express = require("express");
var app = express();
app.set('view engine', 'html');

app.engine('html', require('ejs').renderFile);
app.set("views", __dirname + "/views"); // set express to look in this folder to render our view
app.get("/",function(req,res)
{
res.render("index.html")
});
app.get("/events",function(req,res)
{
res.render("Event_2.0/event.html")
});
app.get("/resources",function(req,res)
{
res.render("resource_page/index.html")
});
app.get("/projects",function(req,res)
{
res.render("Project_page/index.html")
});
app.get("/team",function(req,res)
{
res.render("team_page/index.html")
});


const port= 8000;
app.set("port", process.env.port || port); // set express to use this port

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
  