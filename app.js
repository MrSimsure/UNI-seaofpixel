

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

        accelleration : 0,
        speed : 4,
        shoot : false,
        angle : 0,

        life : 100,
        points : 0,
        savedPoints : 0,

        collider : Rectangle(x-20,y-20,20, 20),
    }


    self.update = function()
    {  
        //controlla che il giocatore sia ancora vivo
        if(self.life <= 0)
        {
            //manda a tutti la notifica di morte
            for(let i in socketList)
            {
                let current = socketList[i];
                current.emit("playerDie", pack={x:self.x, y:self.y});             
            } 

            //resetta la posizione
            self.x = Math.random()*2000;
            self.y = Math.random()*2000;
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
            if(self.accelleration < self.speed)
            {self.accelleration += 0.1}
        }
        else
        {
            if(self.accelleration > 0)
            {self.accelleration -= 0.1}
        }


        if(self.accelleration > 0) 
        {
            //controlla collisioni con i forzieri
            for(let i in GAME.chestList)
            {
                let current = GAME.chestList[i];
                if( self.collider.overlaps(current.collider))
                {
                    self.points += 100;
                    current.changePosition();
                }
            }

            //controlla movimento 
            if(GAME.playerCollision)
            {
                let tempX = self.x+lengthdir_x(self.accelleration,self.angle)
                let tempY = self.y+lengthdir_y(self.accelleration,self.angle)

                let moveX = true
                let moveY = true;
                
                //controlla se sei ai limiti del mondo
                if(tempX < 0 || tempX > 2000)
                {moveX = false;}

                if(tempY < 0 || tempY > 2000)
                {moveY = false;}

                //controlla collisioni con le altre navi
                for(let i in GAME.playerList)
                {     
                    let current = GAME.playerList[i];
                    let shipHit = false;

                    if(self.id != current.id)
                    {
                        if(tempX > current.x-20 && tempX < current.x+20 && self.y > current.y-20 && self.y < current.y+20)
                        {
                            moveX = false
                            shipHit = true
                        }

                        if(tempY > current.y-20 && tempY < current.y+20 && self.x > current.x-20 && self.x < current.x+20)
                        {
                            moveY = false
                            shipHit = true
                        }

                        //speronaggio nemico ed esplosioni
                        if(shipHit)
                        {
                            current.life -= 1;
                            for(let j in socketList)
                            {
                                let c = socketList[j];       
                                c.emit("hit", pack={x:current.x, y:current.y, num:1});       
                            } 
                        }
                    }
                
                }

                //se se lo spazio X o Y davanti a te sono liberi muovitici
                if(moveX) {self.x = tempX;}
                if(moveY) {self.y = tempY;}
            }

            //aggiorna collisioni
            self.collider.set(self.x-20, self.y-20, 20, 20)
        }

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

        if(self.timer > 40)
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
                    current.emit("hit", pack={x:self.x, y:self.y, num:3});       
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

    self.changePosition = function()
    {
        self.x = random_range(0,1000);
        self.y = random_range(0,1000);

        self.collider.set(self.x-8,self.y-8,8,8);
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
var maxChest = 20;


for(let i=0; i<maxChest; i++)
{
    Chest( random_range(0,2000), random_range(0,2000) );
}


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
                let player = Player(data.name, socket.id, Math.random()*2000,Math.random()*2000);

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
                    let current =  GAME.playerList[socket.id];


                            Balls(current.x,current.y,current.angle+90,8, socket.id)
                            Balls(current.x,current.y,current.angle+270,8, socket.id)

                });
        });



        //quando un giocatore si disconnette eliminalo dalla lista giocatori
        socket.on("disconnect", function()
        {
            //invia i dati ad ogni client
            for(let i in socketList)
            {
                let current = socketList[i];
                current.emit("disconnection", socket.id);
            } 

            delete socketList[socket.id];
            delete GAME.playerList[socket.id];

        });
    

});



updatePlayer = function()
{
    let pack = [];
    for(let i in GAME.playerList)
    {
        let current = GAME.playerList[i];
        current.update();

        pack.push
        ({
            id : current.id,
            name : current.name,
            x : current.x,
            y : current.y,
            angle: current.angle,
            life: current.life,
            points: current.points,
            savedPoints: current.savedPoints,
        });
    }
    
    return pack;
}

updateBall = function()
{
    let pack = [];
    for(let i in GAME.ballList)
    {
        let current = GAME.ballList[i];
        current.update();
        current = GAME.ballList[i];

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


updateChest = function()
{
    let pack = [];
    for(let i in GAME.chestList)
    {
        let current = GAME.chestList[i];

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

    let thisLoop = new Date();
    if(Math.random() > 0.8)
    {fps = Math.floor(1000 / (thisLoop - lastLoop));}
    lastLoop = thisLoop;


    let pack = 
    {
        players: updatePlayer(),
        balls: updateBall(),
        chests: updateChest(),
        fps:fps,
    }

    //invia i dati ad ogni client
    for(var i in socketList)
    {
        let current = socketList[i];
        current.emit("newPositions", pack);
    }        
}


    
setInterval(serverUpdate ,1000/30);
