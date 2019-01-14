

require("./server/engine.js");
require("./server/database.js")

var GAME = {}
GAME.playerList = {};
GAME.ballList = {};
GAME.chestList = {};
GAME.playerCollision = true;

Rectangle = function(x, y, w, h)
{
    var self =
    {
        x : x,
        y : y,
        w : x + w,
        h : y + h,
    }

    self.set = function(x, y, w, h)
    {
        self.x = x;
        self.y = y;
        self.w = x + w;
        self.h = y + h;
    }

    self.within = function(r) 
    {
        return (r.x <= self.x && r.w >= self.w && r.y <= self.y && r.h >= self.h);
    }       


    self.overlaps = function(r) 
    {
        return (self.x < r.w &&  r.x < self.w && self.y < r.h && r.y < self.h);
    }

    return self;
}


Player = function(name, id, x, y)
{
    var self =
    {
        id : id,    
        x : x,
        y : y,
        
        name : name,

        pLeft : false,
        pRight : false,
        pUp : false,
        pDown : false,

        speed : 4,
        shoot : false,
        angle : 0,

        life : 100,
        collider : Rectangle(x-20,y-20,20, 20),
    }

    self.update = function()
    {  
        if(self.life == 0)
        {
            self.x = 500;
            self.y = 500;
            self.life = 100;
        }

        if(self.pRight) 
        {
            self.angle -= 3; 
            if(self.angle < 0) 
            {self.angle = 360;}
        }

        if(self.pLeft)
        {
            self.angle += 3; 
            if(self.angle > 360) 
            {self.angle = 0;}
        }

        if(self.pUp) 
        {
            if(GAME.playerCollision)
            {
                let original = self.collider;
                let tempX = self.x+lengthdir_x(self.speed,self.angle)
                let tempY = self.y+lengthdir_y(self.speed,self.angle)

                self.collider.set(tempX-20,tempY-20,20, 20)

                for(var i in GAME.playerList)
                {
                    var current = GAME.playerList[i];
                    if(self.id != i && self.collider.overlaps(current.collider))
                    {
                        self.x -= lengthdir_x(self.speed,self.angle)
                        self.y -= lengthdir_y(self.speed,self.angle)
                    }
                    else
                    {
                        self.x = tempX;
                        self.y = tempY;
                        self.collider = original;
                    }
                }
            }
            else
            {
                self.x += lengthdir_x(self.speed,self.angle);   
                self.y += lengthdir_y(self.speed,self.angle);
            }
        }


        self.collider.set(self.x-20, self.y-20, 20, 20)
   
    }


    GAME.playerList[id] = self;
    return self;
}


Balls = function(x,y,direction,speed,player)
{
    var self = 
    {
        id : Math.random(),
        x : x,
        y : y,   
        spdX : Math.cos(direction/180*Math.PI)*speed,
        spdY : Math.sin(direction/180*Math.PI)*speed,

        timer : 0,

        collider : Rectangle(x-8,y-8,8,8),
        owner : player,
    }


    self.update = function()
    {

        self.x += self.spdX;
        self.y += self.spdY;

        self.collider.set(self.x-8, self.y-8, 8, 8)

        self.timer += 1 ;

        if(self.timer > 100)
        {
            for(var i in socketList)
            {
                var current = socketList[i];
                current.emit("ballEnd", self.id);             
            } 
            delete GAME.ballList[self.id];  
        }


        for(var i in GAME.playerList)
        {
            var current = GAME.playerList[i];
            if(self.owner != i && self.collider.overlaps(current.collider))
            {
                current.life -= 10;

                for(var i in socketList)
                {
                    var current = socketList[i];
                    current.emit("ballEnd", self.id);         
                    current.emit("hit", pack={x:self.x, y:self.y});       
                } 
                delete GAME.ballList[self.id];  
                break;
            }
        }

    }

    GAME.ballList[self.id] = self;
    return self;
}


Chest = function(x,y)
{
    var self = 
    {
        id : Math.random(),
        x : x,
        y : y,   
        collider : Rectangle(x-8,y-8,8,8),
    }

    GAME.chestList[self.id] = self;
    return self;
}


//EXPRESS////////////////////////////////////////////////////
var express = require("express");
var app = express();
var server = require("http").Server(app);

//app.use(express.static("client"));

app.get("/", function(req, res)  { res.sendFile(__dirname + "/client/index.html");});   
app.use("/client", express.static(__dirname + "/client"));
server.listen(process.env.PORT || 8080);

console.log("server started");

//SOCKET////////////////////////////////////////////////////
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
                //AGGIUNGI IL GIOCATORE ALLA LISTA
                var player = Player(data.name, socket.id, 500,500);


                //RICEVUTO MESAGGIO DI MOVIMENTO
                socket.on("keyPress", function(data)
                {
                    if(data.id == "left")
                    {player.pLeft = data.state;}
                
                    else if(data.id == "right")
                    {player.pRight = data.state;}
                
                    else if(data.id == "up")
                    {player.pUp = data.state;}
                
                    else if(data.id == "down")
                    {player.pDown = data.state;}
                });


                
                //RICEVUTO MESSAGGIO DI ATTACCO
                socket.on("shoot", function(data)
                {
                    var current =  GAME.playerList[socket.id];

                    if(data.state == true)
                    {
                        if(current.shoot == false)
                        {
                            Balls(current.x,current.y,current.angle+90,8, socket.id)
                            Balls(current.x,current.y,current.angle+270,8, socket.id)
                        }
                        current.shoot = true;
                    }
                    else
                    {
                        current.shoot = false;
                    }
                });
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
            delete GAME.playerList[socket.id];

        });
    

});



updatePlayer = function()
{
    var pack = [];
    for(var i in GAME.playerList)
    {
        var current = GAME.playerList[i];
        current.update();
        pack.push
        ({
            id : current.id,
            name : current.name,
            x : current.x,
            y : current.y,
            angle: current.angle,
            life: current.life,
        });
    }
    
    return pack;
}

updateBall = function()
{
    var pack = [];
    for(var i in GAME.ballList)
    {
        var current = GAME.ballList[i];
        current.update();
        var current = GAME.ballList[i];
        if(current != undefined)
        {
            pack.push
            ({
                id : current.id,
                x : current.x,
                y : current.y
            });
        }
    }        
    return pack;
}

var fps;
var lastLoop;
//game loop
var serverUpdate = function()
{

    var thisLoop = new Date();
    if(Math.random() > 0.8)
    {fps = Math.floor(1000 / (thisLoop - lastLoop));}
    lastLoop = thisLoop;

        var pack = 
        {
            players: updatePlayer(),
            balls: updateBall(),
            fps:fps,
        }

        //invia i dati ad ogni client
        for(var i in socketList)
        {
            var current = socketList[i];
            current.emit("newPositions", pack);
        }        
}


    
setInterval(serverUpdate ,1000/30);
