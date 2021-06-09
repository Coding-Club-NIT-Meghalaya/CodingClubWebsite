
// Test if a file is valid based on its extension and mime type.
function isFileValid(filename, mimetype, allowedExts, allowedMimeTypes) {

  if (!allowedExts || ! allowedMimeTypes) {
    return false;
  }

  var extension = getExtension(filename);

  return allowedExts.indexOf(extension.toLowerCase()) != -1  &&
    allowedMimeTypes.indexOf(mimetype) != -1
  ;
}

// Generic file validation.
function isValid(validation, filePath, mimetype, callback) {

  // No validation means you dont want to validate, so return affirmative.
  if (!validation) {
    return callback(null, true);
  }

  // Validation is a function provided by the user.
  if (typeof(validation) == 'function') {
    return validation(filePath, mimetype, callback);
  }

  if (typeof(validation) == 'object') {
    return callback(null, isFileValid(filePath, mimetype, validation['allowedExts'], validation['allowedMimeTypes']));
  }

  // Else: no specific validating behaviour found.
  return callback(null,false);
}


// Gets a filename extension.
function getExtension(filename) {
  return filename.split('.').pop();
}


// Exporting...

exports.isValid = isValid;
exports.getExtension = getExtension;
