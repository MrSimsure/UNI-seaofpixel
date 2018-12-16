

Balls = function(x,y,direction)
{
    var self = Entity();

    self.x = x;
    self.y = y;
    self.id = Math.random();
    self.speed = 8;
    self.spdX = Math.cos(direction/180*Math.PI)*self.speed;
    self.spdY = Math.sin(direction/180*Math.PI)*self.speed;

    self.timer = 0;


    var superUpdate = self.update;
    self.update = function(socketList)
    {
        self.timer += 1 ;

        if(self.timer > 100)
        {
            //invia i dati ad ogni client
            for(var i in socketList)
            {
                var current = socketList[i];
                current.emit("ballEnd", self.id);
            } 
            delete Balls.list[self.id];      
        }
              
        superUpdate();
    }

    Balls.list[self.id] = self;

    return self;
}


Balls.list = {};


Balls.update = function()
{
    var pack = [];

    //aggiorna la posizione di ogni player ed inpacchetta i dati per inviarli
    for(var i in Balls.list)
    {
        var current = Balls.list[i];
        if(current != null)
        {
            current.update();

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