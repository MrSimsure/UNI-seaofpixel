const TO_RADIANS = Math.PI/180;
333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
window.SETTINGS =
{
    WINDOW_WIDTH : 480,
    WINDOW_HEIGHT : 270,
    onMobile : false,
    globalScaleX:1,
    globalScaleY:1,
    quality:2,
}

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) 
{SETTINGS.onMobile = true;}
else
{SETTINGS.onMobile = false;}


/* View in fullscreen */
SETTINGS.openFullscreen = function() 
{
    window.scrollTo(0,1);
    var elem = document.documentElement;

  if (elem.requestFullscreen) 
  {elem.requestFullscreen();} 
  else if (elem.mozRequestFullScreen) //Firefox 
  {elem.mozRequestFullScreen();} 
  else if (elem.webkitRequestFullscreen) // Chrome, Safari and Opera 
  {elem.webkitRequestFullscreen();} 
  else if (elem.msRequestFullscreen) // IE/Edge 
  {elem.msRequestFullscreen();}
}


SETTINGS.setScaleFactor = function()
{
  if(window.innerHeight > window.innerWidth)
  {var W = window.innerHeight;   var H = window.innerWidth}
  else
  {var W = window.innerWidth;   var H = window.innerHeight}

  SETTINGS.globalScaleX = (W)/480;      
  SETTINGS.globalScaleY = (H)/270;
  
  SETTINGS.WINDOW_WIDTH = 480*SETTINGS.globalScaleX;
  SETTINGS.WINDOW_HEIGHT = 270*SETTINGS.globalScaleY;
}


SETTINGS.canvasResize = function()
{
    canvas.width = SETTINGS.WINDOW_WIDTH;
    canvas.height = SETTINGS.WINDOW_HEIGHT; 
    //canvasShader.width = SETTINGS.WINDOW_WIDTH;
    //canvasShader.height = SETTINGS.WINDOW_HEIGHT; 

    ctx.imageSmoothingEnabled = false;

    camera = new GAME.Camera(0, 0, canvas, room);   

}
