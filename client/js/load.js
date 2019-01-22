
LOADER = {}

LOADER.sprP
layer= GAME.loadImage("spr_player");
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


LOADER.souCannon = GAME.loadAudio("sou_cannon")
LOADER.musMenu = GAME.loadAudio("mus_menu")


DOM = {}
DOM.canvas = document.getElementById("canvas");
DOM.ctx = canvas.getContext("2d");
DOM.ctx.imageSmoothingEnabled = false;


DOM.page_init = document.getElementById("page_init");
DOM.page_menu = document.getElementById("page_menu");
DOM.page_option = document.getElementById("page_option");
DOM.page_login = document.getElementById("page_login");
DOM.page_game = document.getElementById("page_game");

//page init
DOM.music_on = document.getElementById("music_button_on");
DOM.music_off = document.getElementById("music_button_off");


//page menu
DOM.login_username = document.getElementById("login_username");
DOM.login_password = document.getElementById("login_password");

DOM.login_button = document.getElementById("login_button");
DOM.register_button = document.getElementById("register_button");


DOM.Qlow = document.getElementById("Qlow");
DOM.Qmed = document.getElementById("Qmed");
DOM.Qhig = document.getElementById("Qhig");
DOM.Qins = document.getElementById("Qins");




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




DOM.music_on.onclick = function()
{
    SETTINGS.audio = true
    DOM.page_init.style.display = "none";
    DOM.page_menu.style.display = "flex";


    LOADER.musMenu.loop = true
    LOADER.musMenu.play()
}

DOM.music_off.onclick = function()
{
    SETTINGS.audio = false
    DOM.page_init.style.display = "none";
    DOM.page_menu.style.display = "flex";
}