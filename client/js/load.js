
LOADER = {}

LOADER.sprPlayer= GAME.loadImage("spr_player");
LOADER.sprWater = GAME.loadImage("spr_water");
LOADER.sprScia =  GAME.loadImage("spr_scia");
LOADER.sprOnda =  GAME.loadImage("spr_onda");
LOADER.sprBall =  GAME.loadImage("spr_ball");
LOADER.sprBoat =  GAME.loadImage("spr_nave");
LOADER.sprExplosion = GAME.loadImage("spr_explosion")
LOADER.sprSplash = GAME.loadImage("spr_splash")
LOADER.sprChest = GAME.loadImage("spr_chest")
LOADER.sprFog = GAME.loadImage("spr_fog")
LOADER.sprBussola = GAME.loadImage("spr_bussola")
LOADER.sprFreccia = GAME.loadImage("spr_freccia")

DOM = {}
DOM.canvas = document.getElementById("canvas");
DOM.ctx = canvas.getContext("2d");
DOM.ctx.imageSmoothingEnabled = false;



DOM.page_login = document.getElementById("page_login");
DOM.page_game = document.getElementById("page_game");

DOM.login_username = document.getElementById("login_username");
DOM.login_button = document.getElementById("login_button");

DOM.Qlow = document.getElementById("Qlow");
DOM.Qmed = document.getElementById("Qmed");
DOM.Qhig = document.getElementById("Qhig");
DOM.Qins = document.getElementById("Qins");

if(SETTINGS.onMobile)
{DOM.Qlow.checked = true;}
else
{DOM.Qhig.checked = true;}


//connettiti al server
var socket = io();
var id = 0;
var joystick  = null;

//window.onload = function()

// setup an object that represents the room
room = 
{
    width: 2000,
    height: 2000,
};


camera = new  GAME.Camera(0, 0, DOM.canvas, room);   



DOM.Qlow.onchange = function() 
{
    DOM.Qmed.checked = false;
    DOM.Qhig.checked = false;
    DOM.Qins.checked = false;
}

DOM.Qmed.onchange = function() 
{
    DOM.Qlow.checked = false;
    DOM.Qhig.checked = false;
    DOM.Qins.checked = false;
}

DOM.Qhig.onchange = function() 
{
    DOM.Qmed.checked = false;
    DOM.Qlow.checked = false;
    DOM.Qins.checked = false;
}

DOM.Qins.onchange = function() 
{
    DOM.Qmed.checked = false;
    DOM.Qlow.checked = false;
    DOM.Qhig.checked = false;
}