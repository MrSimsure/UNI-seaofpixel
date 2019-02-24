require("./client/js/engine.js");
require("./server/database.js");


var GAME = {}
GAME.playerList = {};
GAME.ballList = {};
GAME.chestList = {};
GAME.krakenList = {};

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

Player = function(name, id, loginID, anonymus, x, y)
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
        loginID:loginID,
        anonymus:anonymus,
    }

    self.takeDamage = function(dmg)
    {
        self.life -= dmg;
        //controlla che il giocatore sia ancora vivo
        if(self.life <= 0)
        {
            let punti = 0;
            if(self.points >= 1500)
            {punti = 15}
            else
            {punti = (self.points/100)}

            self.points -= punti*100;
            DB.updatePoints(self.loginID, self.points)

            for(let n=0; n<punti; n++)
            {
                Chest( self.x+ENGINE.random_range(-100,100), self.y+ENGINE.random_range(-100,100) , true);
            }

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
    }

    self.update = function()
    {  
        //Con l'uso del metodo specifico per il calcolo del modulo l'applicazione subiva un ritardo di 2 millisecondi, il quale è totalmente inaccettabile.
        //Pertanto mi attengo strettamente all'uso dei calcoli sviluppati singolarmente in maniera "maunale".

        //se si preme il tasto "destra"
        if(self.pRight) 
        {
            self.angle -= 3; 
            if(self.angle < 0) 
            {self.angle = 360;}
        }
        //se si preme il tasto "sinistra"
        if(self.pLeft)
        {
            self.angle += 3; 
            if(self.angle > 360) 
            {self.angle = 0;}
        }
        //se si preme il tasto "avanti"
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
        //se la nave sta accelerando
        if(self.accelleration > 0) 
        {
            //controlla collisioni con tutti i forzieri
            for(let i in GAME.chestList)
            {
                let current = GAME.chestList[i];
                if( self.collider.overlaps(current.collider))
                {
                    self.points += 100;
                    current.changePosition();      
                    DB.updatePoints(self.loginID, self.points)
                    socketList[self.id].emit("chestTaken")
                }
            }
            let tempX = self.x+ENGINE.lengthdir_x(self.accelleration,self.angle)
            let tempY = self.y+ENGINE.lengthdir_y(self.accelleration,self.angle)
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
                //se non sei tu fai i dovuti calcoli
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
                            current.takeDamage(1)

                            for(let j in socketList)
                            {
                                let c = socketList[j];       
                                c.emit("hit", pack={x:current.x, y:current.y, num:1});       
                            } 
                        }
                }
                
            }
            //controlla collisioni con isole
            for(let i in GAME.krakenList)
            {     
                    let current = GAME.krakenList[i];

<<<<<<< HEAD
                    if(tempX > current.x-70 && tempX < current.x+50 && self.y > current.y+20 && self.y < current.y+150)
                    {
                        moveX = false
                    }
                    if(tempY > current.y+20 && tempY < current.y+150 && self.x > current.x-70 && self.x < current.x+50)
=======
                    if(tempX > current.x-20 && tempX < current.x+20 && self.y > current.y+20 && self.y < current.y+40)
                    {
                        moveX = false
                    }
                    if(tempY > current.y+20 && tempY < current.y+40 && self.x > current.x-20 && self.x < current.x+20)
>>>>>>> d11c023169733e686426a076a791c715e2bd526f
                    {
                        moveY = false
                    }     
            }                
            //se se lo spazio X o Y davanti a te sono liberi muovitici
            if(moveX) {self.x = tempX;}
            if(moveY) {self.y = tempY;}
        }
        //aggiorna collisioni
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
        //tempo di vita della palla
        if(self.timer > 30)
        {
            for(var i in socketList)
            {
                var current = socketList[i];
                current.emit("ballEnd", self.id);             
            } 
            delete GAME.ballList[self.id];  
        }
        //controlla collissioni con tutti i giocatori
        for(var i in GAME.playerList)
        {
            var current = GAME.playerList[i];
            if(self.owner != i && self.collider.overlaps(current.collider))
            {
                //fai subire i danni alla nave colpita
                current.takeDamage(10);
                //manda a tutte le navi l'informazione
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

        for(var i in GAME.krakenList)
        {
            var current = GAME.krakenList[i];
            if(self.owner != i && self.collider.overlaps(current.collider))
            {
                //fai subire i danni alla nave colpita
                current.takeDamage(10)
                //manda a tutte le navi l'informazione
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

Chest = function(x,y,temp)
{
    var self = 
    {
        id : Math.random(),
        x : x,
        y : y,   
        collider : Rectangle(x-12,y-12,12,12),
        temp:temp,
    }

    self.changePosition = function()
    {
        if(temp)
        {
            self.destroy();
        }
        else
        {
            self.x = ENGINE.random_range(0,2000);
            self.y = ENGINE.random_range(0,2000);
            self.collider.set(self.x-12,self.y-12,12,12);
        }
    }

    self.destroy = function()
    {
        for(var i in socketList)
        {
            var current = socketList[i];
            current.emit("chestEnd", self.id);             
        } 
        delete GAME.chestList[self.id];
    }

    if(temp == true)
    {setTimeout(self.destroy,30000+ENGINE.random_range(-1000,1000)); }

    GAME.chestList[self.id] = self;
    return self;
}

Kraken = function(x,y)
{
    var self = 
    {
        id : Math.random(),
        x : x,
        y : y,   
        collider : Rectangle(x-50,y-40,80,170),
        timer:200,
        life:500,
    }

    self.destroy = function()
    {
        for(var i in socketList)
        {
            var current = socketList[i];
            current.emit("krakenEnd", {id:self.id, x:self.x, y:self.y+80});             
        } 
        delete GAME.krakenList[self.id];
    }

    self.takeDamage = function(dmg)
    {
        self.life -= dmg;
        //controlla che il giocatore sia ancora vivo
        if(self.life <= 0)
        {
            for(let n=0; n<30; n++)
            {
                Chest( self.x+ENGINE.random_range(-100,100), self.y+ENGINE.random_range(-100,100) , true);
            }
            self.destroy();
        }
    }
    self.update = function()
    {

        if(self.timer > 0)
        {
            self.timer --;
        }
        else
        {
            self.state = -1;
            self.timer = 200;
            self.x += ENGINE.random_range(-100,100)
            self.y += ENGINE.random_range(-100,100)
            self.collider.set(self.x-50,self.y-40,80,170);
        }


        for(let i in GAME.playerList)
        {     
            let current = GAME.playerList[i];
            if(ENGINE.point_distance(self.x,self.y+100,current.x,current.y)<100)
            {
                current.takeDamage(1)

                for(let j in socketList)
                {
                    let c = socketList[j];       
                    c.emit("hit", pack={x:current.x, y:current.y, num:1});       
                } 
            }
        }
    }

    GAME.krakenList[self.id] = self;
    return self;
}

//EXPRESS//
var express = require("express");
var app = express();
var server = require("http").Server(app);


app.get("/", function(req, res)  {  res.sendFile(__dirname + "/client/index.html");});   
app.use("/client", express.static(__dirname + "/client"));
app.get("/serviceWorker.js", function(req, res)  { res.sendFile(__dirname + "/serviceWorker.js");});   
app.get("/favicon.ico", function(req, res)  { res.sendFile(__dirname + "/favicon.ico");});   
app.get("/.fonts", function(req, res)  { res.sendFile(__dirname + "/.fonts");});   

server.listen(process.env.PORT || 8080);

console.log("server started");



//SOCKET////////////////////////////////////////////////////

var io = require("socket.io")(server,{});
var socketList = {};
var maxChest = 20;

for(let i=0; i<maxChest; i++)
{
    Chest( ENGINE.random_range(0,2000), ENGINE.random_range(0,2000) , false);
}


//quando viene eseguita una connessione al socket
io.sockets.on("connection", function(socket)
{
        //aggiungi il socket alla lista
        socketList[socket.id] = socket;
        //manda un segnale di connessione avventua al client
        socket.emit("connection", socket.id);
        console.log("connesso  "+socketList[socket.id].id);


        //aggiungi un ascolto sul messaggio di gameStart
        socket.on("gameStart", function(data)
        {
                let nome;
                //AGGIUNGI IL GIOCATORE ALLA LISTA
                if(data.username != undefined)
                {nome = data.username}
                else
                {nome = ""}

                let player = Player(nome, socket.id, data.id, data.anonymus, Math.random()*2000,Math.random()*2000);
                Kraken(player.x, player.y)
                console.log(data.id+"   "+data.anonymus)

                    DB.checkUser(data.id, function(callback) 
                    {
                        if(callback == true)
                        {   
                            DB.getPoints(data.id, function(point){player.points = point});
                        }
                        else
                        {   
                            DB.registerUser(data.id);
                        }
                    });
                
                


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
                    Balls(current.x,current.y,current.angle+90,8, socket.id);
                    Balls(current.x,current.y,current.angle+270,8, socket.id);           
                });          
                
                socket.on("deleteUser", function(data)
                {
                    DB.deletUser(data);
                });  
        });

        //quando un giocatore si disconnette eliminalo dalla lista giocatori
        socket.on("disconnect", function()
        {
            //invia l'informazione ad ogni client
            for(let i in socketList)
            {
                let current = socketList[i];
                current.emit("disconnection", socket.id);
            } 
            delete socketList[socket.id];
            delete GAME.playerList[socket.id];
        });


        //quando un giocatore si disconnette eliminalo dalla lista giocatori
        socket.on("logout", function()
        {
            socket.removeAllListeners("keyPress")
            socket.removeAllListeners("shoot")
            //invia l'informazione ad ogni client
            for(let i in socketList)
            {
                let current = socketList[i];
                current.emit("disconnection", socket.id);
            } 
            delete GAME.playerList[socket.id];
        });        
});

//aggiorna e raccogli informazioni giocatori
var updatePlayer = function()
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

//aggiorna e raccogli informazioni palle
var updateBall = function()
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
                y : current.y,
                owner :current.owner
            });
        }
    }        
    return pack;
}

//raccogli informazioni casse
var updateChest = function()
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
                y : current.y,
            });
        }
    }        
    return pack;
}
//raccogli informazioni casse
var updateKraken = function()
{
    let pack = [];
    for(let i in GAME.krakenList)
    {
        let current = GAME.krakenList[i];
        current.update();
        if(current != undefined)
        {
            pack.push
            ({
                id : current.id,
                x : current.x,
                y : current.y,
                life:current.life,
            });
        }
    }        
    return pack;
}
//game loop
var serverUpdate = function()
{
    //raccogli informazioni su tutte le entità di gioco
    let pack = 
    {
        players: updatePlayer(),
        balls: updateBall(),
        chests: updateChest(),
        kraken: updateKraken(),
    }

    //invia i dati ad ogni client
    for(var i in socketList)
    {
        let current = socketList[i];
        current.emit("newPositions", pack);
    }
}  

setInterval(serverUpdate ,1000/30);