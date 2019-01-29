
const errorLine = document.getElementById('errors');
const xhr = new HttpRequest({ baseUrl: 'http://localhost:8000' });// eslint-disable-line
function processProgressBar(id, data) {
  const element = document.getElementById(id);
  let currentWidth = element.style.width;
  currentWidth = (data.loaded / data.total) * 100;
  element.style.width = `${currentWidth}%`;
  element.innerHTML = `${Number(currentWidth)}%`;
  document.title = `${Number(currentWidth)}%`;
}
function showProgressBar(id) {
  const element = document.getElementById(id);

  if (element.classList.contains('hidden')) {
    element.classList.remove('hidden');
  } else {
    element.classList.add('hidden');
  }
}

function drawImage(blob, imageElement) {
  const urlCreator = window.URL || window.webkitURL;
  const imageUrl = urlCreator.createObjectURL(blob);
  imageElement.src = imageUrl;
}

function saveFile(blob, fileName) {
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  const urlCreator = window.URL || window.webkitURL;
  const url = urlCreator.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
}


function fileProcessor(data, fileName, imageElement) {
  imageElement.src = '';

  if (data.contentType.startsWith('image')) {
    drawImage(data.blob, imageElement);
  } else {
    saveFile(data.blob, fileName);
  }
}

function loadFileTransformer(data) {
  const contentType = data.getResponseHeader('content-type');
  const arrayBufferView = new Uint8Array(data.response);
  const blob = new Blob([arrayBufferView], { type: contentType });

  return {
    contentType,
    blob
  };
}

document.getElementById('uploadForm').onsubmit = function(e) {
  e.preventDefault();
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
    document.getElementById('fileName').value = response.path;
    setTimeout(function() {
      document.title = windowtitle;
    }, 2000);
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
  })
    .catch(err => {
      let error = err;
      error = 'Cannot Download file Error: 404 (Not Found)';
      errorLine.innerHTML = error;
    });
  setTimeout(showProgressBar, 2000, 'downloadBar');
};

function drawFilesList(files) {
  const list = document.getElementById('files_list');
  list.innerHTML = '';
  files.forEach(element => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = `/files/${element}`;
    link.textContent = element;
    listItem.appendChild(link);
    list.appendChild(listItem);
  });
}

window.addEventListener('load', function(e) {
  xhr.get('/list', {}).then(data =>
    drawFilesList(JSON.parse(data)));
});
document.getElementById('upload_list').addEventListener('click', function(e) {
  xhr.get('/list', {}).then(data =>
    drawFilesList(JSON.parse(data)));
});


