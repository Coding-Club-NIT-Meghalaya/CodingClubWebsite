var merge = require('merge');
var diskManagement = require('./utils/disk.management.js');
var utils = require('./utils/utils.js');
var path = require('path');
var fs = require('fs');

var defaultUploadOptions = {
    'fieldname': 'file',
    'validation': {
        'allowedExts': ['mp4', 'webm', 'ogg'],
        'allowedMimeTypes': [ 'video/mp4', 'video/webm', 'video/ogg' ]
    },
    'resize': null
};

/**
* Video upload to disk.
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
* Delete video from disk.
*
* @param src string path to video
* @param callback returns null/undefined or error string
*/
var _delete = function(src, callback) {
  diskManagement.delete(src, callback);
}




exports.Video = {
  upload: upload,
  'delete': _delete
}