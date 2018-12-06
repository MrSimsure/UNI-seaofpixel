

Entity = function()
{
    var self = 
    {
        x:250,
        y:250,
        spdX:0,
        spdY:0,
        id:""
    }

    self.update = function()
    {
        self.updatePosition();
    }

    self.updatePosition = function()
    {
        self.x += self.spdX;
        self.y += self.spdY;
    }

    return self;
}