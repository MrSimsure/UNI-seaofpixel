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



sprPlayer = loadSprite("spr_player");
sprWater = loadSprite("spr_water");
sprScia = loadSprite("spr_scia");
sprOnda = loadSprite("spr_onda");

stripBoat = loadStrip("spr_nave",23,40,40);



SETTINGS =
{
    WINDOW_WIDTH : screen.width-20,
    WINDOW_HEIGHT : screen.height-20,
    onMobile : false,
}

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) 
{SETTINGS.onMobile = true;}
else
{SETTINGS.onMobile = false;}