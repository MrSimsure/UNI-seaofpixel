require("./client/js/engine.js");
<<<<<<< HEAD
require("./server/database.js")
var firebase = require("firebase");

=======
require("./server/database.js");
>>>>>>> ec532e7b5d959862ad3c619929e54f527a16b1fe

var GAME = {}
GAME.playerList = {};
GAME.ballList = {};
GAME.chestList = {};
GAME.islandList = {};
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

    self.takeDamage = function(dmg)
    {
        self.life -= dmg;
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
                    DB.updatePoints(self.name, self.points)
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
            for(let i in GAME.islandList)
            {     
                    let current = GAME.islandList[i];

                    if(tempX > current.x-100 && tempX < current.x+100 && self.y > current.y-100 && self.y < current.y+100)
                    {
                        moveX = false
                    }
                    if(tempY > current.y-100 && tempY < current.y+100 && self.x > current.x-100 && self.x < current.x+100)
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
        self.x = ENGINE.random_range(0,2000);
        self.y = ENGINE.random_range(0,2000);
        self.collider.set(self.x-8,self.y-8,8,8);
    }
    GAME.chestList[self.id] = self;
    return self;
}

Island = function(x,y)
{
    var self = 
    {
        id : Math.random(),
        x : x,
        y : y,   
        collider : Rectangle(x-100,y-100,100,100),
    }
    GAME.islandList[self.id] = self;
    return self;
}
Kraken = function(x,y)
{}

//EXPRESS//
var express = require("express");
var app = express();
var server = require("http").Server(app);
var fps;
var lastLoop;
//app.use(express.static("client"));
app.get("/", function(req, res)  {  res.sendFile(__dirname + "/client/index.html");});   
app.use("/client", express.static(__dirname + "/client"));
server.listen(process.env.PORT || 8080);
app.get("/serviceWorker.js", function(req, res)  { res.sendFile(__dirname + "/serviceWorker.js");});   
app.get("/favicon.ico", function(req, res)  { res.sendFile(__dirname + "/favicon.ico");});   
app.get("/.fonts", function(req, res)  { res.sendFile(__dirname + "/.fonts");});   
console.log("server started");

<<<<<<< HEAD

   // Initialize Firebase
    var config = 
    {
        apiKey: "AIzaSyAX_ecFSz5hGIRMH3dIsn-PlUEdQhWWyvk",
        authDomain: "sea-of-pixel.firebaseapp.com",
        databaseURL: "https://sea-of-pixel.firebaseio.com",
        projectId: "sea-of-pixel",
        storageBucket: "sea-of-pixel.appspot.com",
        messagingSenderId: "400694456140"
    };
    firebase.initializeApp(config);
//SOCKET////////////////////////////////////////////////////


=======
//SOCKET//
>>>>>>> ec532e7b5d959862ad3c619929e54f527a16b1fe
var io = require("socket.io")(server,{});
var socketList = {};
var maxChest = 20;
for(let i=0; i<maxChest; i++)
{
    Chest( ENGINE.random_range(0,2000), ENGINE.random_range(0,2000) );
}
Island( 70, 100 );

//quando viene eseguita una connessione al socket
io.sockets.on("connection", function(socket)
{
        //aggiungi il socket alla lista
        socketList[socket.id] = socket;
        //manda un segnale di connessione avventua al client
        socket.emit("connection", socket.id);
        console.log("connesso  "+socketList[socket.id].id);
        //aggiungi un ascolto sul messaggio di login
        socket.on("login", function(data)
        {
<<<<<<< HEAD
            firebase.auth().signInWithEmailAndPassword(data.name, data.password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;     
            //socket.emit("acces", true);
            });
=======
                DB.loginUser(data.name, data.password , 
                    function(check,points)
                    {
                        socket.emit("acces", check);
                    });
>>>>>>> ec532e7b5d959862ad3c619929e54f527a16b1fe
        });  
        
        socket.on("login_google",function(data)
        {
            var provider = new firebase.auth.GoogleAuthProvider();

            firebase.auth().signInWithPopup(provider).then(function(result) 
            {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                // ...
              }).catch(function(error) 
              {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
              });
        });

        //aggiungi un ascolto sul messaggio di registrazione
        socket.on("register", function(data)
        {
            firebase.auth().createUserWithEmailAndPassword(data.name, data.password).catch(function(error) 
            {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            });
        });  

<<<<<<< HEAD
        firebase.auth().onAuthStateChanged(function(user) 
        {
            if (user) 
            {
            console.log(user.displayName+"   "+user.email+"   "+user.uid)
              // User is signed in.
              var isAnonymous = user.isAnonymous;
              var uid = user.uid;
            } 
            else 
            {
              // User is signed out.
            }
          });

=======
>>>>>>> ec532e7b5d959862ad3c619929e54f527a16b1fe
        //aggiungi un ascolto sul messaggio di gameStart
        socket.on("gameStart", function(data)
        {
                let nome;
                //AGGIUNGI IL GIOCATORE ALLA LISTA
                if(data != undefined)
                {nome = data}
                else
                {nome = ""}
                let player = Player(nome, socket.id, Math.random()*2000,Math.random()*2000);
                DB.getPoints(nome, function(point){player.points = point});
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

//game loop
var serverUpdate = function()
{
    //fps del server
    let thisLoop = new Date();
    if(Math.random() > 0.8)
    {fps = Math.floor(1000 / (thisLoop - lastLoop));}
    lastLoop = thisLoop;
    //raccogli informazioni su tutte le entità di gioco
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