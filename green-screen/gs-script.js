$(window).on("load",function(){
  $(".loading").fadeOut(500)
}

);

$("#fg, #bg").click(function(){
  var fn = 'upload' + $(this).attr('id');
  var inp = $(this).attr('id') + 'img';
  $('#' + inp).click();
  $('#' + inp).change(function(e){
    if($(this).val()){
      window[fn]();
    }
  })
});

$("#cc").click(function(){
  greenScreen();
});

$("#clr").click(function(){
  clr();
});
 
var fgimage = null;
var bgimage = null;

function fitToContainer(canvas){
  canvas.style.width ='100%';
  canvas.style.height='100%';
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

function uploadfg() {
  var canvas = document.getElementById("fcan");
  fitToContainer(canvas);
  var file = document.getElementById("fgimg");
  fgimage = new SimpleImage(file);
  fgimage.drawTo(canvas);
}

function uploadbg() {
  var canvas = document.getElementById("bcan");
  fitToContainer(canvas);
  var file = document.getElementById("bgimg");
  bgimage = new SimpleImage(file);
  bgimage.drawTo(canvas);
}

function clr() {
  var fcanvas = document.getElementById("fcan");
  var bcanvas = document.getElementById("bcan");
  var ocanvas = document.getElementById("ocan");
  fgimage = null;
  bgimage = null;
   var ct1 = fcanvas.getContext('2d');
   ct1.clearRect(0,0,fcanvas.width,fcanvas.height);
   var ct2 = bcanvas.getContext('2d');
   ct2.clearRect(0,0,bcanvas.width,bcanvas.height);
   var ct3 = ocanvas.getContext('2d');
   ct3.clearRect(0,0,ocanvas.width,ocanvas.height);
}

function greenScreen() {
  if(fgimage == null || !fgimage.complete())
    alert("Foreground Image not found");
  else if(bgimage == null || !bgimage.complete())
    alert("background Image not found");
  else if(fgimage.getWidth() != bgimage.getWidth()|| fgimage.getHeight() != bgimage.getHeight())
    alert("The size of Images Should be Same");
  else
    {
      var output = new SimpleImage(fgimage.getWidth(),fgimage.getHeight())
      for(var pixel of fgimage.values())
        {
          var x = pixel.getX();
          var y = pixel.getY();
          if(pixel.getGreen() > pixel.getRed() + pixel.getBlue())
            {
              var bgPixel = bgimage.getPixel(x, y);
              output.setPixel(x, y, bgPixel);
            }
          else
            output.setPixel(x, y, pixel);    
        }  
      var ocanvas = document.getElementById("ocan");
      fitToContainer(ocanvas);
      output.drawTo(ocanvas);
    }
}