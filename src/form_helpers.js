function setStatusElements(elem, styleCss) {
  const element = document.querySelector(elem);
  element.disabled = false;

  if (styleCss) {
    element.className = styleCss;
  }
}

document.querySelector('.uploadinput').onchange = function(e) {
  const element = e.target.value.replace(/.*\\/, '');

  if (element) {
    document.querySelector('.upload__icon__text').innerHTML = element;
    setStatusElements('.uploadButton', 'button enabled');
  }
};

document.querySelector('.fileName').addEventListener('input', function(e) {
  if (e.target.value && e.target.value.length > 0) {
    setStatusElements('.downloadButton', 'button enabled');
  }
});