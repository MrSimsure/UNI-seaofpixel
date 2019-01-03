Player = function(name, id)
{
    var self =
    {
        id : id,    
        x : 500,
        y : 500,
        
        name : name,

        pLeft : false,
        pRight : false,
        pUp : false,
        pDown : false,

        speed : 4,
        shoot : false,
        angle : 0
    }

    self.update = function()
    {  
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
            self.x+= lengthdir_x(self.speed,self.angle);   
            self.y+= lengthdir_y(self.speed,self.angle);
        }
   
    }


    Player.list[id] = self;
    return self;
}

 Player.list = {};


Player.onConnect = function(socket,name)
{
    var player = Player(name,socket.id);
     //quando ricevi un messaggio dal client
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
}


Player.onDisconnect = function(socket)
{
    delete Player.list[socket.id];
}

 
Player.update = function()
{
    var pack = [];
     //aggiorna la posizione di ogni player ed inpacchetta i dati per inviarli
    for(var i in Player.list)
    {
        var current = Player.list[i];
        current.update();
         pack.push
        ({
            id : current.id,
            name : current.name,
            x : current.x,
            y : current.y,
            angle: current.angle
        });
    }
     return pack;
 } 