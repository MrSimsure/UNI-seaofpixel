
Players = function(id,x,y,name,angle)
{
   var self = 
   {
       id: id,
       x:x,
       y:y,
       name:name,
       angle:angle,
   }


   Players.list[self.id] = self;
   return self;
}
Players.list = [];



 Scia = function(x,y)
 {
    var self = 
    {
        num: Scia.list.length,
        x:x,
        y:y,
        size:1,
    }
 
    
    self.update = function()
    {
        self.size -= 0.07;
        if(self.size <= 0.1)
        {
            var index = Scia.list.indexOf(self);
            Scia.list.splice(index,1);
        }
        return "";
        
    }
 
    self.draw = function()
    {
        drawSprite(sprScia,self.x-camera.xView,self.y-camera.yView,0,self.size);
    }


    Scia.list[self.num] = self;
    return self;
 }
 Scia.list = [];



 
 Onda = function(x,y)
 {
    var self = 
    {
        num: Onda.list.length,
        x:x,
        y:y,
        grow:false,
        maxSize: 1,
        size:0,
        speed : Math.random()*2
    }
 
    
    self.update = function()
    {
        self.x += self.speed;
        
        if(self.grow)
        {
            self.size -= 0.01;
            if(self.size <= 0)
            {
                var index = Onda.list.indexOf(self);
                Onda.list.splice(index,1);
            }
        }
        else
        {
            if(self.size <= self.maxSize)
            {self.size += 0.01;}
            else
            {self.grow = true;}
        }
        
    }
 
    self.draw = function()
    {
        drawSprite(sprOnda,self.x-camera.xView,self.y-camera.yView,0,self.size);
    }


    Onda.list[self.num] = self;
    return self;
 }
 Onda.list = [];
