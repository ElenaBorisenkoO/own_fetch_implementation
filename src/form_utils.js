function setEnableElement(elem, styleCss) {
  const element = document.getElementById(elem);
  element.disabled = false;

  if (styleCss) {
    element.className = styleCss;
  }
}

document.getElementById('uploadinput').onchange = function(e) {
  const element = e.target.value.replace(/.*\\/, '');

  if (element) {
    document.querySelector('.upload__icon__text').innerHTML = element;
    setEnableElement('uploadButton', 'button enabled');
  }
};

document.getElementById('fileName').addEventListener('input', function(e) {
  if (e.target.value && e.target.value.length > 0) {
    setEnableElement('downloadButton', 'button enabled');
  }
});