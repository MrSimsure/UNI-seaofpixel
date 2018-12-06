

Bullet = function(direction)
{
    var self = Entity();

    self.id = Math.random();
    self.speed = 4;
    self.spdX = Math.cos(direction/180*Math.PI)*self.speed;
    self.spdY = Math.sin(direction/180*Math.PI)*self.speed;

    self.timer = 0;
    self.toRemove = false;


    var superUpdate = self.update;
    self.update = function()
    {
        self.timer += 1 ;

        if(self.timer > 40)
        {
            delete Bullet.list[self.id];      
        }
              
        superUpdate();
    }

    Bullet.list[self.id] = self;

    return self;
}


Bullet.list = {};


Bullet.update = function()
{
    if(Math.random() < 1.0)
    {
        Bullet(Math.random()*360);
    }

    var pack = [];

    //aggiorna la posizione di ogni player ed inpacchetta i dati per inviarli
    for(var i in Bullet.list)
    {
        var current = Bullet.list[i];
        if(current != null)
        {
            current.update();

            pack.push
            ({
                x : current.x,
                y : current.y
            });
        }
    }

    return pack;

}