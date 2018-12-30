function loadSprite(name)
{
    let temp = new Image();
    temp.src = "/client/img/"+name+".png";

    return temp;
}

function loadStrip(name , frameNum ,width, height)
{
    let temp = new Image();
    temp.src = "/client/img/"+name+".png";

    var that = {};
					
    that.image = temp;
    that.frameNum = frameNum;
    that.width = width;
    that.height = height;

    return that;
}


/* View in fullscreen */
function openFullscreen() 
{
    window.scrollTo(0,1);
    var elem = document.documentElement;

  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}



function setScaleFactor()
{
  SETTINGS.globalScaleX = (window.innerWidth-20)/480;      
  SETTINGS.globalScaleY = (window.innerHeight-20)/270;
  
  SETTINGS.WINDOW_WIDTH = 480*SETTINGS.globalScaleX;
  SETTINGS.WINDOW_HEIGHT = 270*SETTINGS.globalScaleY;
}


sprPlayer = loadSprite("spr_player");
sprWater = loadSprite("spr_water");
sprScia = loadSprite("spr_scia");
sprOnda = loadSprite("spr_onda");
sprBall = loadSprite("spr_ball");

stripBoat = loadStrip("spr_nave",23,40,40);



SETTINGS =
{
    WINDOW_WIDTH : 480,
    WINDOW_HEIGHT : 270,
    onMobile : false,
    globalScaleX:1,
    globalScaleY:1
}

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) 
{SETTINGS.onMobile = true;}
else
{SETTINGS.onMobile = false;}


