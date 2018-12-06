
Player = function(name, id)
{
    var self = Entity();

    self.id = id,
    self.name = name,

    self.pLeft = false,
    self.pRight = false,
    self.pUp = false,
    self.pDown = false,

    self.speed = 10

    targetX = -1;
    targetY = -1;

    self.updatePosition = function()
    {  
    	if(self.targetX != -1)
    	{
    		if(self.targetX < self.x)
    		{
    			self.x -= self.speed;
    		}
    		else if(self.targetX > self.x)
    		{
    		self.x += self.speed;
    		}
    		else {self.targetX = -1;}
    	}
    	
    	
    	
    	if(self.targetY != -1)
    	{
    		if(self.targetY < self.y)
    		{
    		self.y -= self.speed;
 		   	}
	    	else if(self.targetY > self.y)
	    	{
	    	self.y += self.speed;
	    	}
    		else {self.targetY = -1;}
    	}
    	
        if(self.pRight) {self.x += self.speed;}
        if(self.pLeft) {self.x -= self.speed;}
        if(self.pUp) {self.y -= self.speed;}
        if(self.pDown) {self.y += self.speed;}
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
        {player.pDown = d