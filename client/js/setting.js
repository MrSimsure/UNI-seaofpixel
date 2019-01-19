const TO_RADIANS = Math.PI/180;

window.SETTINGS =
{
    W : 640,
    H : 480,
    WINDOW_WIDTH : 640,
    WINDOW_HEIGHT : 480,
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
    let elem = document.documentElement;

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
    let W,H;

    if(window.innerHeight > window.innerWidth)
    { W = window.innerHeight;    H = window.innerWidth}
    else
    { W = window.innerWidth;    H = window.innerHeight}

    SETTINGS.globalScaleX = (W)/SETTINGS.W;      
    SETTINGS.globalScaleY = (H)/SETTINGS.H;
    
    SETTINGS.WINDOW_WIDTH = SETTINGS.W*SETTINGS.globalScaleX;
    SETTINGS.WINDOW_HEIGHT = SETTINGS.H*SETTINGS.globalScaleY;
}


SETTINGS.canvasResize = function()
{
    DOM.canvas.width = SETTINGS.WINDOW_WIDTH;
    DOM.canvas.height = SETTINGS.WINDOW_HEIGHT;  

    DOM.ctx.imageSmoothingEnabled = false;

    camera = new GAME.Camera(0, 0, DOM.canvas, room);   

}
