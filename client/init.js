var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var page_login = document.getElementById("page_login");
var page_game = document.getElementById("page_game");

var login_username = document.getElementById("login_username");
var login_button = document.getElementById("login_button");



//connettiti al server
var socket = io();
var id = 0;
PlayersData = {};



// setup an object that represents the room
var room = 
{
    width: 5000,
    height: 3000,
    map: new Game.Map(5000, 3000)
};
room.map.generate();

var camera = new Game.Camera(0, 0, canvas, room);   
