
const errorLine = document.getElementById('errors');
const xhr = new HttpRequest({ baseUrl: 'http://localhost:8000' });
function processProgressBar(id, data) {
  const element = document.getElementById(id);
  let currentWidth = element.style.width;
  // console.log(loaded);
  // console.log(total);
  // console.log(currentWidth);
  currentWidth = (data.loaded / data.total) * 100;
  element.style.width = `${currentWidth}%`;
  element.innerHTML = `${Number(currentWidth)}%`;
}

document.getElementById('uploadForm').onsubmit = function(e) {
  e.preventDefault();
  const form = new FormData();
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'multipart/form-data');
  form.append('sampleFile', e.target.sampleFile.files[0]);
  xhr.post('/upload', {
    data: form,
    onUploadProgress: data => processProgressBar('uploadBar', data)
  }).then(data => {
    // console.log(data);
    const response = JSON.parse(data);
    document.getElementById('fileName').value = response.path;
    document.getElementById('upload_list').click();
  })
    .catch(err => {
      let error = err;
      error = 'Cannot Upload file  Error: 404 (Not Found)';
      errorLine.innerHTML = error;
    });
};

document.getElementById('downloadForm').onsubmit = function(e) {
  e.preventDefault();
  const fileName = document.getElementById('fileName').value;

  if (!fileName) {
    errorLine.innerHTML = 'Please specify file name';
  }

  xhr.get(`/files/${fileName}`, {
    responseType: 'arraybuffer',
    onDownloadProgress: data => processProgressBar('downloadBar', data)
  }).then(data => {
    const arrayBufferView = new Uint8Array(data);
    const blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
    const urlCreator = window.URL || window.webkitURL;
    const imageUrl = urlCreator.createObjectURL(blob);
    document.getElementById('image').src = imageUrl;
  })
    .catch(err => {
      let error = err;
      error = 'Cannot Download file Error: 404 (Not Found)';
      errorLine.innerHTML = error;
    });
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
document.getElementById('upload_list').addEventListener('click', function(e) {
  xhr.get('/list', {}).then(data =>
    drawFilesList(JSON.parse(data)));
});
