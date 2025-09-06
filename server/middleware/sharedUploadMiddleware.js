const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/shared/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.originalname.split('.')[0].replace(/\s/g, '_') + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip|ppt|pptx|xls|xlsx|md|py|ipynb/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype || extname) {
    return cb(null, true);
  } else {
    cb(new Error('Validation Error: This file type is not allowed!'));
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 25000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('sharedNoteFile');

// This line is crucial for exporting the upload middleware.
module.exports = upload;