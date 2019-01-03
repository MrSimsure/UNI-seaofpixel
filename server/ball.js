

Balls = function(x,y,direction,speed)
{
    var self = 
    {
        id : Math.random(),
        x : x,
        y : y,   
        spdX : Math.cos(direction/180*Math.PI)*speed,
        spdY : Math.sin(direction/180*Math.PI)*speed,

        timer : 0,
    }


    self.update = function(socketList)
    {

        self.x += self.spdX;
        self.y += self.spdY;

        
        self.timer += 1 ;

        if(self.timer > 100)
        {
            for(var i in socketList)
            {
                var current = socketList[i];
                current.emit("ballEnd", self.id);             
            } 
            delete Balls.list[self.id];      
        }

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