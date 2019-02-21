var f = new FontFace('PixelFont', 'url(PixelFont.ttf)');

LOADER = {}
//CARICA TUTTE LE IMMAGINI
LOADER.sprWater = GAME.loadImage("spr_water");
LOADER.sprScia =  GAME.loadImage("spr_scia");
LOADER.sprOnda =  GAME.loadImage("spr_onda");
LOADER.sprBall =  GAME.loadImage("spr_ball");
LOADER.sprBoat =  GAME.loadImage("spr_nave");
LOADER.sprExplosion = GAME.loadImage("spr_explosion");
LOADER.sprSplash = GAME.loadImage("spr_splash");
LOADER.sprChest = GAME.loadImage("spr_chest");
LOADER.sprFog = GAME.loadImage("spr_fog");
LOADER.sprBussola = GAME.loadImage("spr_bussola");
LOADER.sprFreccia = GAME.loadImage("spr_freccia");
LOADER.sprIsland = GAME.loadImage("spr_island");
LOADER.sprPause = GAME.loadImage("spr_pause");
//CARICA TUTTI I SUONI
LOADER.souCannon = GAME.loadAudio("sou_cannon");
LOADER.musMenu = GAME.loadAudio("mus_menu");
LOADER.souHit = GAME.loadAudio("sou_ship_hit");
LOADER.souExpl = GAME.loadAudio("sou_cannonball_explosion");
//CARICA GLI SPRITE DELLA BUSSOLA E DELL'ISOLA
var sBussola = GAME.sprite(LOADER.sprBussola,1,64,64,1);
var sFreccia = GAME.sprite(LOADER.sprFreccia,1,64,64,1);
var sIsola = GAME.sprite(LOADER.sprIsland,1,200,200,1);
var sPause = GAME.sprite(LOADER.sprPause,1,100,100,1);

//SALVA TUTTI I DOM
DOM = {};
DOM.canvas = document.getElementById("canvas");
DOM.ctx = canvas.getContext("2d");
DOM.ctx.imageSmoothingEnabled = false;

DOM.page_init = document.getElementById("page_init");
DOM.page_menu = document.getElementById("page_menu");
DOM.page_pause = document.getElementById("page_pause");
DOM.page_game = document.getElementById("page_game");

//page init
DOM.music_on = document.getElementById("music_button_on");
DOM.music_off = document.getElementById("music_button_off");

//page menu
DOM.login_username = document.getElementById("login_username");
DOM.login_password = document.getElementById("login_password");
DOM.login_email= document.getElementById("login_email");

DOM.login_username_label = document.getElementById("login_username_label");
DOM.login_password_label = document.getElementById("login_password_label");
DOM.login_email_label= document.getElementById("login_email_label");

DOM.login_button = document.getElementById("login_button");
DOM.register_button = document.getElementById("register_button");


DOM.avanti = document.getElementById("avanti");
DOM.indietro = document.getElementById("indietro");

DOM.auth_google = document.getElementById("auth_google");
DOM.auth_email = document.getElementById("auth_email");
DOM.auth_guest = document.getElementById("auth_quest");


//page pause
DOM.logout = document.getElementById("logout");
DOM.audio = document.getElementById("audio");
DOM.fullscreen = document.getElementById("fullscreen");
DOM.back = document.getElementById("back");

DOM.splash = document.getElementById("splash");

//connettiti al server
var socket = io();
var id = 0;
var joystick = null;

// setup an object that represents the room
room = 
{
    width: 2000,
    height: 2000,
};

camera = new GAME.Camera(0, 0, DOM.canvas, room);   


DOM.music_on.onclick = function()
{
    SETTINGS.audio = true
    DOM.page_init.style.display = "none";
    DOM.page_menu.style.display = "flex";

    LOADER.musMenu.loop = true
    LOADER.musMenu.play()

    setLogin()
}

DOM.music_off.onclick = function()
{
    SETTINGS.audio = false
    DOM.page_init.style.display = "none";
    DOM.page_menu.style.display = "flex";

    setLogin()
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
    frasiArr[n] = 'Did I ever tell you the definition of INSANITY';  n++;
    frasiArr[n] = 'Let it go';  n++;
    frasiArr[n] = 'Team Nerd';  n++;
    frasiArr[n] = 'Use the Force';  n++;
    frasiArr[n] = 'ARH ARH!';  n++;
    frasiArr[n] = 'You were the chose one!';  n++;
    frasiArr[n] = 'Sequel trilogy is trash';  n++;
    frasiArr[n] = 'Italian Trap in trash!';  n++;
    frasiArr[n] = 'MISSION 1 START!';  n++;

    return frasiArr[ENGINE.random_range(0,frasiArr.length-1)];
}

DOM.splash.innerHTML = frasi();