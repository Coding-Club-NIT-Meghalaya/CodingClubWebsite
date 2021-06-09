var utils = require('./utils.js');
var Busboy = require('busboy');
var merge = require('merge');
var path = require('path');
var fs = require('fs');
var sha1 = require('sha1');
var gm = require('gm').subClass({imageMagick: true});

/**
* Upload a file to the specified location.
*
* @param req request stream
* @param fileRoute string
* @param options [optional]
*   {
*     fieldname: string
*     validation: array OR function(filePath, mimetype, callback)
*     resize: array [only for images]
*   }
* @param callback returns {link: 'linkPath'} or error string
*/
function upload(req, fileRoute, options, callback) {

  var saveToPath = null;
  var errorMessage = null;

  // Used for sending response.
  var link = null;

  function handleStreamError(error) {

    // Do not enter twice in here.
    if (errorMessage) {
      return;
    }
    errorMessage = error;

    // Cleanup.
    if (saveToPath) {
      return fs.unlink(saveToPath, function (err) {
        return callback(errorMessage);
      });
    }

    return callback(errorMessage);
  }

  try {
    var busboy = new Busboy({ headers: req.headers });
  } catch(e) {
    return callback(e);
  }

  function sendResponse() {
    callback(null, {link: link});
  }

  // Handle file arrival.
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {

    // Check fieldname:
    if (fieldname != options.fieldname) {

      // Stop receiving from this stream.
      file.resume();
      return callback('Fieldname is not correct. It must be: ' + options.fieldname);
    }

    // Generate link.
    var randomName = sha1(new Date().getTime()) + '.' + utils.getExtension(filename);
    link = fileRoute + randomName;

    var appDir = path.dirname(require.main.filename);
    // Generate path where the file will be saved.
    saveToPath = path.join(appDir, link);

    // Pipe reader stream (file from client) into writer stream (file from disk).
    file.on('error', handleStreamError);

    var diskWriterStream = fs.createWriteStream(saveToPath);
    diskWriterStream.on('error', handleStreamError);
    diskWriterStream.on('finish', function() {

      // Validate uploaded file.
      if (options.validation) {

        return utils.isValid(options.validation, saveToPath, mimetype, function(err, status) {

          if (err) {
            return handleStreamError(err);
          }

          if (!status) {
            return handleStreamError('File does not meet the validation.');
          }

          return sendResponse();
        });
      }
      return sendResponse();
    })

    if (options.resize && mimetype != 'image/svg+xml') {

      var gmFile = gm(file);
      var imageResizeStream = gmFile.resize.apply(gmFile, options.resize).stream();
      imageResizeStream.on('error', handleStreamError);

      imageResizeStream.pipe(diskWriterStream);
    } else {
      file.pipe(diskWriterStream);
    }
  });

  // Handle file upload termination.
  busboy.on('error', handleStreamError);
  req.on('error', handleStreamError);

  // Pipe reader stream into writer stream.
  return req.pipe(busboy);
}

/**
* Delete file from disk.
*
* @param src string path to file
* @param callback returns null/undefined or error string
*/
var _delete = function(src, callback) {

  fs.unlink(path.join(path.dirname(require.main.filename), src), function (err) {
    if (err) {
      return callback(err);
    }
    return callback();
  });
}


// Exporting:

exports['delete'] = _delete;
exports.upload = upload;
