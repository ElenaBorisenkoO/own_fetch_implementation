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
