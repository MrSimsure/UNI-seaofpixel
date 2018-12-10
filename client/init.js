

var canvas = document.getElementById("canvas");
canvas.width = WINDOW_WIDTH;
canvas.height = WINDOW_HEIGHT;

var ctx = canvas.getContext("2d");

var page_login = document.getElementById("page_login");
var page_game = document.getElementById("page_game");

var login_username = document.getElementById("login_username");
var login_button = document.getElementById("login_button");


var joystick = new VirtualJoystick(
                {
                mouseSupport: true,
		        stationaryBase: true,
                baseX: 200,
                baseY: 200,
		        limitStickTravel: true,
		        stickRadius: 50
                });

//connettiti al server
var socket = io();
var id = 0;
PlayersData = {};

window.onload = function() 
{
    // setup an object that represents the room
    room = 
    {
        width: 3000,
        height: 3000,
        map: new Game.Map(3000, 3000)
    };
    room.map.generate();

    camera = new Game.Camera(0, 0, canvas, room);   
}
