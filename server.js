/* eslint-disable */

const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const app = express();

app.use('/form', express.static(`${__dirname}/index.html`));
app.use('/style.css', express.static(`${__dirname}/src/style.css`));
app.use('/main.js', express.static(`${__dirname}/src/main.js`));
app.use('/progress_bar.js', express.static(`${__dirname}/src/progress_bar.js`));
app.use('/file_utils.js', express.static(`${__dirname}/src/file_utils.js`));
app.use('/form_utils.js', express.static(`${__dirname}/src/form_utils.js`));
app.use('/HttpRequest.js', express.static(`${__dirname}/src/HttpRequest.js`));
app.use('/files', express.static(`${__dirname}/uploads`));

// default options
app.use(fileUpload());

app.post('/ping', function(req, res) {
  res.send('pong');
});

app.get('/ping', function(req, res) {
  res.send('pong');
});

app.get('/list', function(req, res) {
  let filelist = [];
  fs.readdirSync(`${__dirname}/uploads/`).forEach(file => {
    filelist.push(file);
  });
  res.send(filelist);
});

app.post('/upload', function(req, res) {
  let sampleFile;
  let uploadPath;

  if (Object.keys(req.files).length == 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }

  console.log('req.files >>>', req.files);

  sampleFile = req.files.sampleFile;

  uploadPath = `${__dirname}/uploads/${sampleFile.name}`;

  sampleFile.mv(uploadPath, function(err) {
    if (err) {
      return res.status(500).send(err);
    }

    // res.send(`File uploaded to ${uploadPath}`);
    res.send(JSON.stringify({ 'path': sampleFile.name }));
  });
});

app.listen(8000, function() {
  console.log('Express server listening on port 8000'); // eslint-disable-line
});