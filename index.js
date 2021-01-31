var express = require("express");
var app = express();
app.set('view engine', 'html');

app.engine('html', require('ejs').renderFile);
app.set("views", __dirname + "/views"); // set express to look in this folder to render our view
app.get("/",function(req,res)
{
res.render("index.html")
});


const port= 8000;
app.set("port", process.env.port || port); // set express to use this port

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
  