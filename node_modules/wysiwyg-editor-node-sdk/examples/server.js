var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var path = require('path');
var fs = require('fs');
var gm = require('gm').subClass({imageMagick: true});
var FroalaEditor = require('../lib/froalaEditor.js');

app.use(express.static(__dirname + '/'));
app.use('/bower_components',  express.static(path.join(__dirname, '../bower_components')));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});


app.post('/upload_image', function (req, res) {

  FroalaEditor.Image.upload(req, '/uploads/', function(err, data) {

    if (err) {
      return res.send(JSON.stringify(err));
    }
    res.send(data);
  });
});

app.post('/upload_video', function (req, res) {

  FroalaEditor.Video.upload(req, '/uploads/', function(err, data) {

    if (err) {
      return res.send(JSON.stringify(err));
    }
    res.send(data);
  });
});

app.post('/upload_image_resize', function (req, res) {

  var options = {
    resize: [300, 300]
  }
  FroalaEditor.Image.upload(req, '/uploads/', options, function(err, data) {

    if (err) {
      return res.send(JSON.stringify(err));
    }
    res.send(data);
  });
});

app.post('/upload_image_validation', function (req, res) {

  var options = {
    fieldname: 'myImage',
    validation: function(filePath, mimetype, callback) {

      gm(filePath).size(function(err, value){

        if (err) {
          return callback(err);
        }

        if (!value) {
          return callback('Error occurred.');
        }

        if (value.width != value.height) {
          return callback(null, false);
        }
        return callback(null, true);
      });
    }
  }

  FroalaEditor.Image.upload(req, '/uploads/', options, function(err, data) {

    if (err) {
      return res.send(JSON.stringify(err));
    }
    res.send(data);
  });
});

app.post('/upload_file', function (req, res) {

  var options = {
    validation: null
  }

  FroalaEditor.File.upload(req, '/uploads/', options, function(err, data) {

    if (err) {
      return res.status(404).end(JSON.stringify(err));
    }
    res.send(data);
  });
});

app.post('/upload_file_validation', function (req, res) {

  var options = {
    fieldname: 'myFile',
    validation: function(filePath, mimetype, callback) {

      fs.stat(filePath, function(err, stat) {

        if(err) {
          return callback(err);
        }

        if (stat.size > 10 * 1024 * 1024) { // > 10M
          return callback(null, false);
        }

        return callback(null, true);

      });
    }
  }

  FroalaEditor.File.upload(req, '/uploads/', options, function(err, data) {

    if (err) {
      return res.status(404).end(JSON.stringify(err));
    }
    res.send(data);
  });
});

app.post('/delete_image', function (req, res) {

  FroalaEditor.Image.delete(req.body.src, function(err) {

    if (err) {
      return res.status(404).end(JSON.stringify(err));
    }
    return res.end();
  });
});
app.post('/delete_video', function (req, res) {

  FroalaEditor.Video.delete(req.body.src, function(err) {

    if (err) {
      return res.status(404).end(JSON.stringify(err));
    }
    return res.end();
  });
});

app.post('/delete_file', function (req, res) {

  FroalaEditor.File.delete(req.body.src, function(err) {

    if (err) {
      return res.status(404).end(JSON.stringify(err));
    }
    return res.end();
  });
});

app.get('/load_images', function (req, res) {

  FroalaEditor.Image.list('/uploads/', function(err, data) {

    if (err) {
      return res.status(404).end(JSON.stringify(err));
    }
    return res.send(data);
  });
});

app.get('/get_amazon', function (req, res) {

  var configs = {
    bucket: process.env.AWS_BUCKET,
    region: process.env.AWS_REGION,
    keyStart: process.env.AWS_KEY_START,
    acl: process.env.AWS_ACL,
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_ACCESS_KEY
  }

  var configsObj = FroalaEditor.S3.getHash(configs);
  res.send(configsObj);
});

// Create folder for uploading files.
var filesDir = path.join(path.dirname(require.main.filename), 'uploads');
if (!fs.existsSync(filesDir)){
    fs.mkdirSync(filesDir);
}

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
