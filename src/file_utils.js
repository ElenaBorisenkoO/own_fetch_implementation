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

function drawFilesList(files) {
  const list = document.querySelector('.files_list');
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