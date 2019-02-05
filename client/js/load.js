
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
LOADER.sprIsland = GAME.loadImage("spr_island")


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


DOM.splash = document.getElementById("splash")

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



let frasi = function()
{
    let frasiArr = [];
    let n = 0
    //frasiArr[n] = '';  n++;
    frasiArr[n] = 'Tu non sei giocabile!';  n++;
    frasiArr[n] = 'Corpo di mille balene';  n++;
    frasiArr[n] = 'Mi hai rotto il javascript';  n++;
    frasiArr[n] = 'Non è un bug, è un feature';  n++;
    frasiArr[n] = 'Mettere le parentesi a capo è piu elegante e pulito, change my mind';  n++;
    frasiArr[n] = 'Nessun materiale è stato rubato da Sea Of Thieves....probabilmente';  n++;
    frasiArr[n] = 'Totalmente efficente e performante';  n++;
    frasiArr[n] = 'Soon on your game boy color';  n++;
    frasiArr[n] = 'Skin personalizate a partire da 200 euri';  n++;
    frasiArr[n] = 'Javascript è amore, javascript è vita';  n++;
    frasiArr[n] = 'Only pure,fresh and beautiful JS';  n++;
    frasiArr[n] = 'Mark Anthony Exception';  n++;
    frasiArr[n] = 'Progressive Web App <3';  n++;
    frasiArr[n] = 'Release the Kraken!!!';  n++;
    frasiArr[n] = 'I have a Java....i have a Script...ahhh....JavaScript';  n++;
    frasiArr[n] = '42';  n++;
    frasiArr[n] = "ST0856 - BUSINESS E MANAGEMENT NELL'INFORMATION TECHNOLOGY";  n++;
    frasiArr[n] = 'Like a true pirate, AYE!!!';  n++;
    frasiArr[n] = 'Game Design tip : more explosions = better game';  n++;


    return frasiArr[ENGINE.random_range(0,frasiArr.length-1)];
}

DOM.splash.innerHTML = frasi();

