var merge = require('merge');
var diskManagement = require('./utils/disk.management.js');

var defaultUploadOptions = {
  'fieldname': 'file',
  'validation': {
    'allowedExts': ['txt', 'pdf', 'doc'],
    'allowedMimeTypes': ['text/plain', 'application/msword', 'application/x-pdf', 'application/pdf']
  }
};

/**
* File upload to disk.
*
* @param req request stream
* @param fileRoute string
* @param options [optional]
*   {
*     fieldname: string
*     validation: array OR function(filePath, mimetype, callback)
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
* Delete file from disk.
*
* @param src string path to file
* @param callback returns null/undefined or error string
*/
var _delete = function(src, callback) {

  diskManagement.delete(src, callback);  
}

exports.File = {
  upload: upload,
  'delete': _delete
}