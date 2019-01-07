
window.GAME = {};


GAME.loadImage = function(name)
{
    let temp = new Image();
    temp.src = "/client/img/"+name+".png";
    return temp;
}

GAME.sprite = function(name, frameNum, width, height, speed)
{
    var self = {};
					
    self.image = name;
    self.frameNum = frameNum;
    self.width = width;
    self.height = height;
    self.frameIndex = 0,
    self.tickCount = 0,
    self.ticksPerFrame = speed || 0;

    self.update = function () 
    {
        self.tickCount += 1;
			
        if (self.tickCount > self.ticksPerFrame) 
        {    
            self.tickCount = 0;
        
            // If the current frame index is in range
            if (self.frameIndex < self.frameNum ) 
            {self.frameIndex += 1;} 
            else 
            {self.frameIndex = 0; }
        }
    }

    return self;    
}


GAME.drawSprite = function(sprite,image,x,y,angle,size)
{

    ctx.save(); 
    ctx.translate(x, y);  
    ctx.rotate(angle * TO_RADIANS);
    ctx.scale(size*SETTINGS.globalScaleX, size*SETTINGS.globalScaleY);
    ctx.drawImage(
                sprite.image, 
                image * sprite.width , 
                0, 
                sprite.width , 
                sprite.height, 
                -(sprite.width/2), 
                -(sprite.height/2), 
                sprite.width , 
                sprite.height);

   ctx.restore(); 


   sprite.update();
 
}





///RECTANGLE////////
GAME.Rectangle = function(x, y, w, h)
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


///CAMERA////////
GAME.Camera = function(xView, yView, canvas, world)
{
        var self =
        {
            // position of camera (left-top coordinate)
            xView : xView || 0,
            yView : yView || 0,

            // distance from followed object to border before camera starts move
            xDeadZone :canvas.width/2, // min distance to horizontal borders
            yDeadZone: canvas.height/2, // min distance to vertical borders

            // viewport dimensions
            wView : canvas.width,
            hView : canvas.height,

            // rectangle that represents the viewport
            viewportRect : GAME.Rectangle(xView, yView, canvas.width, canvas.height),           

            // rectangle that represents the world's boundary (room's boundary)
            worldRect : GAME.Rectangle(0, 0, world.width, world.height),
        }
    

    self.update = function(followX, followY)
    {
            // moves camera on horizontal axis based on followed object position
            if(followX - self.xView  + self.xDeadZone > self.wView)
                self.xView = followX - (self.wView - self.xDeadZone);
            else if(followX  - self.xDeadZone < self.xView)
                self.xView = followX  - self.xDeadZone;

            

            // moves camera on vertical axis based on followed object position
            if(followY - self.yView + self.yDeadZone > self.hView)
                self.yView = followY - (self.hView - self.yDeadZone);
            else if(followY - self.yDeadZone < self.yView)
                self.yView = followY - self.yDeadZone;
                             
     
            // update viewportRect
            self.viewportRect.set(self.xView, self.yView);

            // don't let camera leaves the world's boundary
            if(!self.viewportRect.within(self.worldRect))
            {
                if(self.viewportRect.left < self.worldRect.left)
                    self.xView = self.worldRect.left;
                if(self.viewportRect.top < self.worldRect.top)                  
                    self.yView = self.worldRect.top;
                if(self.viewportRect.right > self.worldRect.right)
                    self.xView = self.worldRect.right - self.wView;
                if(self.viewportRect.bottom > self.worldRect.bottom)                    
                    self.yView = self.worldRect.bottom - self.hView;
            }

    }

    return self;

}


///MAP////////
GAME.Map = function(width, height)
{

        var self = 
        {
        // map dimensions
        width : width,
        height : height,

        // map texture
        image : null,
        }
    

    // generate an example of a large map
    self.generate = function()
    {
        var temp = document.createElement("canvas").getContext("2d");        
        temp.canvas.width = self.width;
        temp.canvas.height = self.height;        


        var rows = ~~(self.width/128) + 1;
        var columns = ~~(self.height/128) + 1;


        for (var x = 0, i = 0; i < rows; x+=128, i++) 
        {    
            for (var y = 0, j=0; j < columns; y+=128, j++) 
            {          
                temp.drawImage(sprWater, x, y,128,128); 
            }
        }   


        // store the generate map as this image texture
        self.image = new Image();
        self.image.src = temp.canvas.toDataURL("image/png", 1.0);                 

        temp = null;
    }

    // draw the map adjusted to camera
    self.draw = function(context, xView, yView)
    {   
        context.drawImage(self.image, 0, 0, self.image.width*4, self.image.height*4, -xView, -yView, self.image.width*4, self.image.height*4);       
    }

    return self;
}



///PLAYERS////////
GAME.Players = function(id,x,y,name,angle)
{
   var self = 
   {
       id: id,
       x:x,
       y:y,
       name:name,
       angle:angle,
       sprite: GAME.sprite(sprBoat,23,40,40,0)
   }


   self.draw = function()
   {   
        let X = self.x*SETTINGS.globalScaleX-camera.xView;
        let Y = self.y*SETTINGS.globalScaleY-camera.yView;


        for(var n=0; n<23 ; n++)
        {
            GAME.drawSprite(self.sprite, n, X,  Y-SETTINGS.globalScaleY*n, self.angle, 1);
        }

        ctx.font = (20*SETTINGS.globalScaleX)+"px Georgia";
        ctx.fillText(self.name, X-(self.name.length*8),  Y-64);
   }

   GAME.Players.list[self.id] = self;
   return self;
}
GAME.Players.list = [];



///BALL///////
GAME.Balls = function(id,x,y)
{
   var self = 
   {
       id:id,
       x:x,
       y:y,  
       sprite: GAME.sprite(sprBall,1,16,16,0)
   }


   self.draw = function()
   {  
        let X = self.x*SETTINGS.globalScaleX-camera.xView;
        let Y = self.y*SETTINGS.globalScaleY-camera.yView;

        GAME.drawSprite(self.sprite, 0, X,  Y, 0, 0.4); 
   }

   GAME.Balls.list[self.id] = self;
   return self;
}
GAME.Balls.list = [];


///SCIA/////////
GAME.Scia = function(x,y)
{
   var self = 
   {
       num: GAME.Scia.list.length,
       x:x,
       y:y,
       size:1,
       sprite:GAME.sprite(sprScia,1,16,16,0)
   }

   
   self.update = function()
   {
       self.size -= 0.07;
       if(self.size <= 0.1)
       {
            let index = GAME.Scia.list.indexOf(self);
            GAME.Scia.list.splice(index,1);
       }
       return "";
       
   }

   self.draw = function()
   {
        GAME.drawSprite(self.sprite, 0, self.x-camera.xView, self.y-camera.yView, 0, self.size);
   }


   GAME.Scia.list[self.num] = self;
   return self;
}
GAME.Scia.list = [];


 ///ONDA//////////
 GAME.Onda = function(x,y)
 {
    var self = 
    {
        num:  GAME.Onda.list.length,
        x:x,
        y:y,
        grow:false,
        maxSize: 1,
        size:0,
        speed : Math.random()*2,
        sprite:GAME.sprite(sprOnda,1,64,64,0)
    }
 
    
    self.update = function()
    {
        self.x += self.speed;
        
        if(self.grow)
        {
            self.size -= 0.01;
            if(self.size <= 0)
            {
                let index = GAME.Onda.list.indexOf(self);
                GAME.Onda.list.splice(index,1);
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
        GAME.drawSprite(self.sprite, 0, self.x-camera.xView, self.y-camera.yView, 0, self.size);
    }


    GAME.Onda.list[self.num] = self;
    return self;
 }
 GAME.Onda.list = [];



GAME.Explosion = function(id,x,y)
{
   var self = 
   {
       id:id,
       x:x,
       y:y,  
       sprite: GAME.sprite(sprExplosion,10,34,34,1.4+random_range(-1.5,1.5))
   }

   self.update = function()
   {
        if(self.sprite.frameIndex >= self.sprite.frameNum-1)
        {
            delete GAME.Explosion.list[self.id]
        }
   }

   self.draw = function()
   {  
        let X = self.x*SETTINGS.globalScaleX-camera.xView;
        let Y = self.y*SETTINGS.globalScaleY-camera.yView;

        GAME.drawSprite(self.sprite, self.sprite.frameIndex , X, Y, 0, 1); 
   }

   GAME.Explosion.list[self.id] = self;
   return self;
}
GAME.Explosion.list = [];


GAME.Splash = function(id,x,y)
{
   var self = 
   {
       id:id,
       x:x,
       y:y,  
       sprite: GAME.sprite(sprSplash,10,34,34,1.4)
   }

   self.update = function()
   {
        if(self.sprite.frameIndex >= self.sprite.frameNum-1)
        {
            delete GAME.Splash.list[self.id]
        }
   }

   self.draw = function()
   {  
        let X = self.x*SETTINGS.globalScaleX-camera.xView;
        let Y = self.y*SETTINGS.globalScaleY-camera.yView;

        GAME.drawSprite(self.sprite, self.sprite.frameIndex , X, Y, 0, 1); 
   }

   GAME.Splash.list[self.id] = self;
   return self;
}
GAME.Splash.list = [];