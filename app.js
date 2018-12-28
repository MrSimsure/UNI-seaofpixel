require("./server/engine.js");
require("./server/entity.js");
require("./server/player.js");
require("./server/ball.js");



var express = require("express");
var app = express();
var server = require("http").Server(app);


app.get("/", function(req, res)  { res.sendFile(__dirname + "/client/index.html");});   
app.use("/client", express.static(__dirname + "/client"));
server.listen(process.env.PORT || 8080);

console.log("server started");

var io = require("socket.io")(server,{});

var socketList = {};


//quando viene eseguita una connessione al socket
io.sockets.on("connection", function(socket)
{

        socketList[socket.id] = socket;
        socket.emit("connection", socket.id);

        console.log("connesso  "+socketList[socket.id].id);
        

        //quando ricevi un messaggio dal client
        socket.on("login", function(data)
        {
            Player.onConnect(socket,data.name);
        });


        //quando ricevi un messaggio dal client
        socket.on("shoot", function(data)
        {
            var current =  Player.list[socket.id];

            if(data.state == true)
            {
                if(current.shoot == false)
                {
                    Balls(current.x,current.y,current.angle+90)
                    Balls(current.x,current.y,current.angle+270)
                }
                current.shoot = true;
            }
            else
            {
                current.shoot = false;
            }
        });

        //quando un giocatore si disconnette eliminalo dalla lista giocatori
        socket.on("disconnect", function()
        {
            //invia i dati ad ogni client
            for(var i in socketList)
            {
                var current = socketList[i];
                current.emit("disconnection", socket.id);
            } 

            delete socketList[socket.id];
            Player.onDisconnect(socket);
        });
    



});



//game loop
var serverUpdate = function()
{
        var pack = 
        {
            players:Player.update(),
            balls:Balls.update(socketList)
        }

        //invia i dati ad ogni client
        for(var i in socketList)
        {
            var current = socketList[i];
            current.emit("newPositions", pack);
        }        
}


    
setInterval(serverUpdate ,1000/30);