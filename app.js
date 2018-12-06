require("./server/entity.js");
require("./server/player.js");
require("./server/bullet.js");

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
        console.log("connesso  "+socketList[socket.id].id);

        //quando ricevi un messaggio dal client
         socket.on("login", function(data)
         {console.log(data.name);
            Player.onConnect(socket,data.name);
        });

        socket.on("touch", function(data)
        {
            Player.list[socket.id].targetX = data.x;
           Player.list[socket.id].targetY = data.y;
       });
       
        //quando un giocatore si disconnette eliminalo dalla lista giocatori
        socket.on("disconnect", function()
        {
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
            bullets:Bullet.update()
        }

        //invia i dati ad ogni client
        for(var i in socketList)
        {
            var current = socketList[i];
            current.emit("newPositions", pack);
        }        
}


    
setInterval(serverUpdate ,1000/60);