$(window).on("load",function(){
  $(".loading").fadeOut(500)
}

);

$("#fg, #bg, #st").click(function(){
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
  stego();
});

$("#ret").click(function(){
  rhi();
});

$("#clr").click(function(){
  clr();
});
 
var fgimage = null;
var bgimage = null;
var output = null;

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

function uploadst() {
  var canvas = document.getElementById("ocan");
  fitToContainer(canvas);
  var file = document.getElementById("stimg");
  output = new SimpleImage(file);
  output.drawTo(canvas);
}

function clr() {
  var fcanvas = document.getElementById("fcan");
  var bcanvas = document.getElementById("bcan");
  var ocanvas = document.getElementById("ocan");
  fgimage = null;
  bgimage = null;
  output = null;
   var ct1 = fcanvas.getContext('2d');
   ct1.clearRect(0,0,fcanvas.width,fcanvas.height);
   var ct2 = bcanvas.getContext('2d');
   ct2.clearRect(0,0,bcanvas.width,bcanvas.height);
   var ct3 = ocanvas.getContext('2d');
   ct3.clearRect(0,0,ocanvas.width,ocanvas.height);
}

function clearbits(colorval) {
  var x = Math.floor(colorval/16) * 16;
  return x;
}

function chop2hide(img){
  for(var px of img.values()){
    px.setRed(clearbits(px.getRed()));
    px.setBlue(clearbits(px.getBlue()));
    px.setGreen(clearbits(px.getGreen()));
  }
  return img;
}

function shift(img){
  for(var px of img.values()){
    px.setRed(px.getRed() / 16);
    px.setBlue(px.getBlue() / 16);
    px.setGreen(px.getGreen() / 16);
  }
  return img;
}

function combine(show, hide){
  var com = new SimpleImage(show.getWidth(), show.getHeight());
  for(var px of com.values()){
    var x = px.getX();
    var y = px.getY();
    var showpx = show.getPixel(x,y);
    var hidepx = hide.getPixel(x,y);
    px.setRed(showpx.getRed() + hidepx.getRed());
    px.setBlue(showpx.getBlue() + hidepx.getBlue());
    px.setGreen(showpx.getGreen() + hidepx.getGreen());
  }
  return com;
}

function stego() {
  if(fgimage == null || !fgimage.complete())
    alert("Foreground Image not found");
  else if(bgimage == null || !bgimage.complete())
    alert("background Image not found");
  else if(fgimage.getWidth() != bgimage.getWidth()|| fgimage.getHeight() != bgimage.getHeight())
    alert("The size of Images Should be Same");
  else
    {
      var show = chop2hide(fgimage);
      var hide = shift(bgimage);
      output = combine(show,hide);
      var ocanvas = document.getElementById("ocan");
      fitToContainer(ocanvas);
      output.drawTo(ocanvas);
    }
}

function rhi(){
  if(output == null || !output.complete())
    alert("Stego Image not found");
  else{
    var hidden = new SimpleImage(output.getWidth(), output.getHeight());
    var cover = new SimpleImage(output.getWidth(), output.getHeight());
    for(var px of output.values()){
      var x = px.getX();
      var y = px.getY();
      var hdpx = hidden.getPixel(x,y);
      var cpx = cover.getPixel(x,y);
      hdpx.setRed((px.getRed() % 16) * 16);
      cpx.setRed(px.getRed() - (px.getRed() % 16));
      hdpx.setBlue((px.getBlue() % 16) * 16);
      cpx.setBlue(px.getBlue() - (px.getBlue() % 16));
      hdpx.setGreen((px.getGreen() % 16) * 16);
      cpx.setGreen(px.getGreen() - (px.getGreen() % 16));
    }
    fgimage = cover;
    bgimage = hidden;
    var fcanvas = document.getElementById("fcan");
    fitToContainer(fcanvas);
    var bcanvas = document.getElementById("bcan");
    fitToContainer(bcanvas);
    cover.drawTo(fcanvas);
    hidden.drawTo(bcanvas);
  }
}

