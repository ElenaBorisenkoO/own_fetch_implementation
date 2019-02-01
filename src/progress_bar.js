function processProgressBar(className, data) {
  const element = document.querySelector(className);
  let currentWidth = element.style.width;
  currentWidth = (data.loaded / data.total) * 100;
  element.style.width = `${currentWidth}%`;
  element.innerHTML = `${Number(currentWidth)}%`;
  document.title = `${Number(currentWidth)}%`;
}

function showProgressBar(className) {
  const element = document.querySelector(className);

  if (element.classList.contains('hidden')) {
    element.classList.remove('hidden');
  } else {
    element.classList.add('hidden');
  }
}
