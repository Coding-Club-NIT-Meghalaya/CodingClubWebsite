var merge = require('merge');
var diskManagement = require('./utils/disk.management.js');
var utils = require('./utils/utils.js');
var path = require('path');
var fs = require('fs');

var defaultUploadOptions = {
  'fieldname': 'file',
  'validation': {
    'allowedExts': ['gif', 'jpeg', 'jpg', 'png', 'svg', 'blob'],
    'allowedMimeTypes': ['image/gif', 'image/jpeg', 'image/pjpeg', 'image/x-png', 'image/png', 'image/svg+xml']
  },
  'rezise': null
};

/**
* Image upload to disk.
*
* @param req request stream
* @param fileRoute string
* @param options [optional]
*   {
*     fieldname: string
*     validation: array OR function(filePath, mimetype, callback)
*     resize: array
*   }
* @param callback returns {link: 'linkPath'} or error string
*/
function upload(req, fileRoute, options, callback) {

  if (typeof options == 'function') {

    callback = options;
    options = null;
  }

  var defaultUploadOptionsClone = merge(true, defaultUploadOptions);
  if (!options) {
    options = defaultUploadOptionsClone;
  } else {
    options = merge(defaultUploadOptionsClone, options);
  }

  diskManagement.upload(req, fileRoute, options, callback);
}

/**
* Delete image from disk.
*
* @param src string path to image
* @param callback returns null/undefined or error string
*/
var _delete = function(src, callback) {
  diskManagement.delete(src, callback);
}

/**

List images from disk

@param folderPath string
@param thumbPath string
@param callback returns error status and images array

*/
function list(folderPath, thumbPath, callback) {

  if (typeof thumbPath == 'function') {

    callback = thumbPath;
    thumbPath = folderPath;
  }

  // TODO problem: callback hell + too hackish ---> use async lib instead

  var images = [];

  var absoluteFolderName = path.join(path.dirname(require.main.filename), folderPath);
  fs.readdir(absoluteFolderName, function(err, list) {

    if (err) {
      return callback(err);
    }

    if (!list || !list.length) {
      return callback(null, images);
    }

    var errObj = null;
    var step = 0;
    list.forEach(function(fileName) {

      var extension = utils.getExtension(fileName).toLowerCase();

      fs.stat(path.join(absoluteFolderName, fileName), function(err, stats) {

        if (err) {
          errObj = err;
        } else if (stats.isFile() && defaultUploadOptions['validation']['allowedExts'].indexOf(extension) != -1) {
          images.push({
            url: folderPath + fileName,
            thumb: thumbPath + fileName,
            tag: fileName
          })
        }

        step++;
        if (step == list.length) {

          if (errObj) {
            return callback(err);
          }
          return callback(null, images);
        }
      });
    });
  });
}

exports.Image = {
  upload: upload,
  'delete': _delete,
  list: list
}