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

