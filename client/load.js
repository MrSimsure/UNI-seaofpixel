function spriteStrip(options) 
{				
    var that = {};
					
    that.image = options.image;
    that.frameNum = options.frameNum;
    that.width = options.width;
    that.height = options.height;
    return that;
}



var sprPlayer = new Image();
sprPlayer.src = "/client/img/spr_player.png";

var sprGround = new Image();
sprGround.src = "/client/img/spr_ground.png";

var sprWater = new Image();
sprWater.src = "/client/img/spr_water.png";

var sprBoat = new Image();
sprBoat.src = "/client/img/spr_nave.png";

var stripBoat = spriteStrip({
    image: sprBoat,
    frameNum: 23,
    width: 40,
    height: 40
});


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