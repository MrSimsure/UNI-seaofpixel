

sprPlayer= GAME.loadSprite("spr_player");
sprWater = GAME.loadSprite("spr_water");
sprScia =  GAME.loadSprite("spr_scia");
sprOnda =  GAME.loadSprite("spr_onda");
sprBall =  GAME.loadSprite("spr_ball");

stripBoat =  GAME.loadStrip("spr_nave",23,40,40);

var canvas = document.getElementById("canvas");
canvas.width = SETTINGS.WINDOW_WIDTH;
canvas.height = SETTINGS.WINDOW_HEIGHT;


var ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;




var page_login = document.getElementById("page_login");
var page_game = document.getElementById("page_game");

var login_username = document.getElementById("login_username");
var login_button = document.getElementById("login_button");

var Qlow = document.getElementById("Qlow");
var Qmed = document.getElementById("Qmed");
var Qhig = document.getElementById("Qhig");
var Qins = document.getElementById("Qins");

if(SETTINGS.onMobile)
{Qlow.checked = true;}
else
{Qhig.checked = true;}


//connettiti al server
var socket = io();
var id = 0;
var PlayersData = {};
var joystick  = null;

//window.onload = function()

// setup an object that represents the room
room = 
{
    width: 4000,
    height: 4000,
    //map: GAME.Map(4000, 4000)
};


sprWater.onload = function()  
{
    room.map.generate();
}

camera = new  GAME.Camera(0, 0, canvas, room);   



Qlow.onchange = function() 
{
    Qmed.checked = false;
    Qhig.checked = false;
    Qins.checked = false;
}

Qmed.onchange = function() 
{
    Qlow.checked = false;
    Qhig.checked = false;
    Qins.checked = false;
}

Qhig.onchange = function() 
{
    Qmed.checked = false;
    Qlow.checked = false;
    Qins.checked = false;
}

Qins.onchange = function() 
{
    Qmed.checked = false;
    Qlow.checked = false;
    Qhig.checked = false;
}