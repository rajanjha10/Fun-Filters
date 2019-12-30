$(window).on("load",function(){
  $(".loading").fadeOut(500)
}

);

$("#img").click(function(){
  $('#u' + $(this).attr('id')).click();
  $('#u' + $(this).attr('id')).change(function(e){
    if($(this).val()){
      upload();
    }
  })
});

$("#gs, #red, #blur, #clr, #rainbow, #reset").click(function(){
  window[$(this).attr('id')]();
});

var image = null;
var canvas = document.getElementById("can");
fitToContainer(canvas);
 
function fitToContainer(canvas){
  canvas.style.width ='100%';
  canvas.style.height='100%';
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

function upload() {
  var file = document.getElementById("uimg");
  image = new SimpleImage(file);
  image.drawTo(canvas);
}

function imageIsLoaded() {
  if(image == null || !image.complete())
    alert("Image not uploaded");
  else
    return true;
}

function gs() {
  if (imageIsLoaded()) {
    var gimage = new SimpleImage(image);
    filterGray(gimage);
    gimage.drawTo(canvas);         
  }
}

function red() {
  if (imageIsLoaded()) {
    var rimage = new SimpleImage(image);
    filterRed(rimage);
    rimage.drawTo(canvas);         
  }
}

function blur() {
  if (imageIsLoaded()) {
    var bimage = new SimpleImage(image);
    filterBlur(bimage);
    bimage.drawTo(canvas);         
  }
}

function rainbow() {
  if (imageIsLoaded()) {
    var rbimage = new SimpleImage(image);
    filterRainbow(rbimage);
    rbimage.drawTo(canvas);        
  }
}

function filterGray(gimage) { 
  for (var pixel of gimage.values())
  {
      var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue())/3;
      pixel.setRed(avg);
      pixel.setBlue(avg);
      pixel.setGreen(avg);
    }
}

function filterRed(rimage) { 
  for (var pixel of rimage.values())
  {
      var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;
    if (avg < 128) {
      pixel.setRed(2 * avg);
      pixel.setGreen(0);
      pixel.setBlue(0);
    } else {
      pixel.setRed(255);
      pixel.setGreen(2 * avg - 255);
      pixel.setBlue(2 * avg - 255);
    }   
  }
}

function filterRainbow(rbimage) {
  var h = rbimage.getHeight();
  for (var pixel of rbimage.values())
  {
    var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue())/3;
    var y = pixel.getY();
    if(avg < 128){
      if(y < h/7){
        pixel.setRed(2*avg);
        pixel.setGreen(0);
        pixel.setBlue(0);
      }
      else if(y < 2*h/7){
        pixel.setRed(2*avg);
        pixel.setGreen(0.8*avg);
        pixel.setBlue(0);
      }
      else if(y < 3*h/7){
        pixel.setRed(2*avg);
        pixel.setGreen(2*avg);
        pixel.setBlue(0);
      }
      else if(y < 4*h/7){
        pixel.setRed(0);
        pixel.setGreen(2*avg);
        pixel.setBlue(0);
      }
      else if(y < 5*h/7){
        pixel.setRed(0);
        pixel.setGreen(0);
        pixel.setBlue(2*avg);
      }
      else if(y < 6*h/7){
        pixel.setRed(0.8*avg);
        pixel.setGreen(0);
        pixel.setBlue(2*avg);
      }
      else{
        pixel.setRed(1.6*avg);
        pixel.setGreen(0);
        pixel.setBlue(1.6*avg);
      }
    }
    else{
      if(y < h/7){
        pixel.setRed(255);
        pixel.setGreen(2*avg-255);
        pixel.setBlue(2*avg-255);
      }
      else if(y < 2*h/7){
        pixel.setRed(255);
        pixel.setGreen(1.2*avg-51);
        pixel.setBlue(2*avg-255);
      }
      else if(y < 3*h/7){
        pixel.setRed(255);
        pixel.setGreen(255);
        pixel.setBlue(2*avg-255);
      }
      else if(y < 4*h/7){
        pixel.setRed(2*avg-255);
        pixel.setGreen(255);
        pixel.setBlue(2*avg-255);
      }
      else if(y < 5*h/7){
        pixel.setRed(2*avg-255);
        pixel.setGreen(2*avg-255);
        pixel.setBlue(255);
      }
      else if(y < 6*h/7){
        pixel.setRed(1.2*avg-51);
        pixel.setGreen(2*avg-255);
        pixel.setBlue(255);
      }
      else{
        pixel.setRed(0.4*avg+153);
        pixel.setGreen(2*avg-255);
        pixel.setBlue(0.4*avg+153);
      }
    }
  }
}

function filterBlur(bimage) {
    function insideImage (coordinate, size) {
      if (coordinate < 0) {
          return 0;
      }
      if (coordinate >= size) {
          return size - 1;
      }
      return coordinate;
    }

    function getNearbyPixel (image, x, y, range) {
        var dx = Math.random() * range - range / 2;
        var dy = Math.random() * range - range / 2;
        var newx = insideImage(x + dx, image.getWidth());
        var newy = insideImage(y + dy, image.getHeight());
        return image.getPixel(newx, newy);
    }

    for (var pixel of image.values()) {
        var x = pixel.getX();
        var y = pixel.getY();
        if (Math.random() > 0.5) {
            var other = getNearbyPixel(image, x, y, 10);
            bimage.setPixel(x, y, other);
        }
        else {
            bimage.setPixel(x, y, pixel);
        }
    }
}

function clr(){
  var ct = canvas.getContext('2d');
  ct.clearRect(0,0,canvas.width,canvas.height);
  image = null; 
}

function reset(){
  if(imageIsLoaded())
    {
      image.drawTo(canvas);
    }
 }