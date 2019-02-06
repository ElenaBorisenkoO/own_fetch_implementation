/* eslint-disable */
const xhr = new HttpRequest({ baseUrl: 'http://localhost:3000' });
const errorLine = document.querySelector('.errors');
const windowtitle = document.title;
const uploadForm = document.getElementById('uploadForm');
const downloadForm = document.getElementById('downloadForm');

function onFileUploadSubmit(e) {
  e.preventDefault();

  errorLine.innerHTML = '';
  const [file] = e.target.sampleFile.files;
  const form = new FormData();
  const myHeaders = new Headers();

  myHeaders.append('Content-Type', 'multipart/form-data');
  form.append('sampleFile', file);
  showProgressBar('.uploadBar');
  xhr.post('/upload', {
    data: form,
    onUploadProgress: data => {
      processProgressBar('.uploadBar', data);
    }
  }).then(data => {
    const response = JSON.parse(data);
    setTimeout(function () {
      document.title = windowtitle;
    }, 2000);
    document.querySelector('.chooseFile').innerHTML = 'Choose your file';
  })
    .catch(err => {
      let error = err;
      error = 'Cannot Upload file  Error: 404 (Not Found)';
      errorLine.innerHTML = error;
    });
  setTimeout(showProgressBar, 2000, '.uploadBar');
};

 function onFileDownloadSubmit(e) {
  e.preventDefault();
  
  const fileName = document.querySelector('.fileName').value;
  errorLine.innerHTML = '';

  if (!fileName) {
    errorLine.innerHTML = 'Please specify file name';
  }
  showProgressBar('.downloadBar');
  xhr.get(`/files/${fileName}`, {
    responseType: 'arraybuffer',
    onDownloadProgress: data => {
      processProgressBar('.downloadBar', data);
    },
    transformResponse: loadFileTransformer

  }).then(data => {
    fileProcessor(data, fileName, document.querySelector('.image'));
    setTimeout(function () {
      document.title = windowtitle;
    }, 2000);
    document.getElementById('downloadForm').reset();
  })
    .catch(err => {
      let error = err;
      error = 'Cannot Download file Error: 404 (Not Found)';
      errorLine.innerHTML = error;
    });
  setTimeout(showProgressBar, 2000, '.downloadBar');
};

window.addEventListener('load', function (e) {
  xhr.get('/list', {}).then(data =>
    drawFilesList(JSON.parse(data)));
});

document.querySelector('.upload_list').addEventListener('click', function (e) {
  xhr.get('/list', {}).then(data =>
    drawFilesList(JSON.parse(data)));
});

uploadForm.onsubmit = onFileUploadSubmit;
downloadForm.onsubmit = onFileDownloadSubmit;