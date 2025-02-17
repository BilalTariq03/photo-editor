document.querySelector(".choose-img").addEventListener("click", () => {
document.querySelector(".file-input").click();
})

let imageSelected = document.getElementById('image');
let inputFile = document.querySelector(".file-input");

let filters ={
  brightness: 100,
  saturate: 100,
  invert: 0,
  grayscale: 0,
  sepia: 0,
  blur: 0
};


inputFile.onchange = function(){
  imageSelected.src=URL.createObjectURL(inputFile.files[0]);
}

function toggle(btnId){
  
  let btn =document.getElementById(btnId);
  if(!btn.classList.contains('is-toggled'))
  {
    turnOffPreviousButton();
    btn.classList.add('is-toggled');
    changeFilterAndScale(btnId)
  }
  
}

function turnOffPreviousButton(){
  let previousButton = document.querySelector('.is-toggled');
  if(previousButton)
  {
    previousButton.classList.remove('is-toggled');
  }
}

function changeFilterAndScale(btnId){
  document.querySelector('.filter-info .name').innerHTML = btnId

  const filterMap = new Map([
    ["brightness", "brightness"],
    ["saturation", "saturate"],
    ["inversion","invert"],
    ["grayscale","grayscale"],
    ["sepia","sepia"],
    ["blur","blur"]
  ]);

  let currentFilter = filterMap.get(btnId.toLowerCase());
  let percent =filters[currentFilter];

  let scale = document.querySelector('.js-range-bar');
  scale.value=percent;
  if(btnId != "Brightness" && btnId != "Saturation")
  {
    scale.max=100;
  }
  else{
    scale.max = 200;
  }
  document.querySelector('.value').innerHTML = `${percent}%`
}


function applyFilter(value){
  let filterName = document.querySelector('.filter-info .name').innerHTML.toLowerCase();

  const filterMap = new Map([
    ["brightness", "brightness"],
    ["saturation", "saturate"],
    ["inversion","invert"],
    ["grayscale","grayscale"],
    ["sepia","sepia"],
    ["blur","blur"]
  ]);

  let currentFilter = filterMap.get(filterName);
  filters[currentFilter] = value;
  document.querySelector('.value').innerHTML = `${value}%`;

  let filterString = `
  brightness(${filters.brightness}%)
  saturate(${filters.saturate}%)
  invert(${filters.invert}%)
  grayscale(${filters.grayscale}%)
  sepia(${filters.sepia}%)
  blur(${filters.blur}px)
  `;

  imageSelected.style.filter =filterString;
}

let angle =0;
let isFlippedX =false;
let isFlippedY =false;
function rotateImage(rotation){
  
  angle+=rotation;
  transformImage();
}

function flipHorizontally(){
  isFlippedX =!isFlippedX;
  transformImage();
}

function flipVertically(){
  isFlippedY=!isFlippedY;
  transformImage();
}

function transformImage(){
    imageSelected.style.transform = `rotate(${angle}deg) scaleX(${isFlippedX? -1:1}) scaleY(${isFlippedY? -1:1})`
}

function rotatePicture(value)
{
  document.querySelector('.rotate-value').innerHTML = `${value}&deg;`;
  imageSelected.style.transform =`rotate(${value}deg)`;
}

function reset(){
  filters.brightness=100;
  filters.saturate=100;
  filters.invert=0;
  filters.grayscale=0;
  filters.sepia =0;
  filters.blur=0;
  angle=0;
  isFlippedX=isFlippedY=false;

  let filterString = `
  brightness(${filters.brightness}%)
  saturate(${filters.saturate}%)
  invert(${filters.invert}%)
  grayscale(${filters.grayscale}%)
  `;

  imageSelected.style.filter =filterString;
  imageSelected.style.transform = `rotate(${angle}deg) scaleX(1) scaleY(1)`;

  document.querySelector(".js-range-bar").value = 100;
  document.querySelector(".value").innerHTML = `100%`;

  document.querySelector(".js-rotate-bar").value = 100;
  document.querySelector(".rotate-value").innerHTML = `0&deg;`;

  toggle('Brightness');
}


function saveImage(){
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    // Set canvas dimensions to match the image
    const img = document.getElementById('image');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
  
    // Apply current filters and transformations to the canvas
    ctx.filter = `
      brightness(${filters.brightness}%)
      saturate(${filters.saturate}%)
      invert(${filters.invert}%)
      grayscale(${filters.grayscale}%)
      sepia(${filters.sepia}%)
      blur(${filters.blur}px)
    `;
  
    // Apply transformations (rotate, flip)
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.scale(isFlippedX ? -1 : 1, isFlippedY ? -1 : 1);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
  
    // Draw the image on the canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
    // Convert the canvas to a data URL
    const dataURL = canvas.toDataURL('image/png');
  
    // Create a temporary link element to trigger the download
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'edited-image.png'; // Set the filename for the downloaded image
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}