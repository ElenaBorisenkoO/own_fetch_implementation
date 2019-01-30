/* eslint-disable */
const xhr = new HttpRequest({ baseUrl: 'http://localhost:8000' });
const errorLine = document.getElementById('errors');

document.getElementById('uploadForm').onsubmit = function(e) {
  e.preventDefault();
  errorLine.innerHTML = '';
  const form = new FormData();
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'multipart/form-data');
  form.append('sampleFile', e.target.sampleFile.files[0]);
  showProgressBar('uploadBar');
  const windowtitle = document.title;
  xhr.post('/upload', {
    data: form,
    onUploadProgress: data => {
      processProgressBar('uploadBar', data);
    }
  }).then(data => {
    const response = JSON.parse(data);
    setTimeout(function() {
      document.title = windowtitle;
    }, 2000);
    document.getElementById('chooseFile').innerHTML = 'Choose your file';
  })
    .catch(err => {
      let error = err;
      error = 'Cannot Upload file  Error: 404 (Not Found)';
      errorLine.innerHTML = error;
    });
  setTimeout(showProgressBar, 2000, 'uploadBar');
};

document.getElementById('downloadForm').onsubmit = function(e) {
  e.preventDefault();
  const fileName = document.getElementById('fileName').value;
  errorLine.innerHTML = '';

  if (!fileName) {
    errorLine.innerHTML = 'Please specify file name';
  }
  showProgressBar('downloadBar');
  const windowtitle = document.title;
  xhr.get(`/files/${fileName}`, {
    responseType: 'arraybuffer',
    onDownloadProgress: data => {
      processProgressBar('downloadBar', data);
    },
    transformResponse: loadFileTransformer

  }).then(data => {
    fileProcessor(data, fileName, document.getElementById('image'));
    setTimeout(function() {
      document.title = windowtitle;
    }, 2000);
    document.getElementById('downloadForm').reset();
  })
    .catch(err => {
      let error = err;
      error = 'Cannot Download file Error: 404 (Not Found)';
      errorLine.innerHTML = error;
    });
  setTimeout(showProgressBar, 2000, 'downloadBar');
};

window.addEventListener('load', function(e) {
  xhr.get('/list', {}).then(data =>
    drawFilesList(JSON.parse(data)));
});

document.getElementById('upload_list').addEventListener('click', function(e) {
  xhr.get('/list', {}).then(data =>
    drawFilesList(JSON.parse(data)));
});
