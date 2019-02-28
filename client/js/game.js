
GAME = {};

//CARICA IMMAIGINI
GAME.loadImage = function(name)
{
    let temp = new Image();
    temp.src = "/client/img/"+name+".png";
    return temp;
}

//CARICA AUDIO
GAME.loadAudio = function(name)
{
    let temp = new Audio();
    temp.src = "/client/mp3/"+name+".mp3";
    return temp;
}


GAME.playAudio = function(name,volume)
{
    let au = name.cloneNode();
    au.volume = volume;               
    au.play();
}


//CREA UNO SPRITE
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

//DISEGNA UNO SPRITE
GAME.drawSprite = function(sprite,image,x,y,angle,scale_x,scale_y)
{
    DOM.ctx.save(); 
    DOM.ctx.translate(x, y);  
    DOM.ctx.rotate(angle * TO_RADIANS);
    DOM.ctx.scale(scale_x*SETTINGS.globalScaleX, scale_y*SETTINGS.globalScaleY);
    DOM.ctx.drawImage(
                sprite.image, 
                image * sprite.width , 
                0, 
                sprite.width , 
                sprite.height, 
                -(sprite.width/2), 
                -(sprite.height/2), 
                sprite.width , 
                sprite.height);
    DOM.ctx.restore(); 
   sprite.update();
 }

//RECTANGLE//
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

//CAMERA//
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

//PLAYERS//
GAME.Players = function(id,x,y,name,angle)
{
   var self = 
   {
       id: id,
       x:x,
       y:y,
       name:name,
       angle:angle,
       sprite: GAME.sprite(LOADER.sprBoat,23,40,40,0),
       life:0,
       ponts:0,
   }

   self.draw = function()
   {   
        let X = self.x*SETTINGS.globalScaleX-camera.xView;
        let Y = self.y*SETTINGS.globalScaleY-camera.yView;
        for(var n=0; n<23 ; n++)
        {
            GAME.drawSprite(self.sprite, n, X,  Y-SETTINGS.globalScaleY*n, self.angle, 1,1);
        }

        DOM.ctx.fillStyle = "black";
        DOM.ctx.fillRect(X-25*SETTINGS.globalScaleY,Y-38*SETTINGS.globalScaleY,50*SETTINGS.globalScaleY,5);
        DOM.ctx.fillStyle = "green";
        DOM.ctx.fillRect(X-25*SETTINGS.globalScaleY,Y-38*SETTINGS.globalScaleY,self.life/2*SETTINGS.globalScaleY,5);
        DOM.ctx.fillStyle = "black";
        DOM.ctx.textAlign = "center";
        DOM.ctx.font = (10*SETTINGS.globalScaleX)+"px pixelFont";
        DOM.ctx.fillText(self.name, X,  Y-48*SETTINGS.globalScaleY);
        DOM.ctx.textAlign = "left";
   }
   GAME.Players.list[self.id] = self;
   return self;
}
GAME.Players.list = [];

//BALL//
GAME.Balls = function(id,x,y)
{
   var self = 
   {
       id:id,
       x:x,
       y:y,  
       sprite: GAME.sprite(LOADER.sprBall,1,16,16,0),
   }
   self.draw = function()
   {  
        let X = self.x*SETTINGS.globalScaleX-camera.xView;
        let Y = self.y*SETTINGS.globalScaleY-camera.yView;

        GAME.drawSprite(self.sprite, 0, X,  Y, 0, 0.4,0.4); 
   }
   GAME.Balls.list[self.id] = self;
   return self;
}
GAME.Balls.list = [];

//SCIA//
GAME.Scia = function(x,y)
{
   var self = 
   {
       num: GAME.Scia.list.length,
       x:x,
       y:y,
       size:1,
       sprite:GAME.sprite(LOADER.sprScia,1,16,16,0),
   }
      self.update = function()
   {
       self.size -= 0.07;
       if(self.size <= 0.1)
       {
        let index = GAME.Scia.list.indexOf(self);
        GAME.Scia.list.splice(index,1);
       }
   }
   self.draw = function()
   {
        GAME.drawSprite(self.sprite, 0, self.x-camera.xView, self.y-camera.yView, 0, self.size,self.size);
   }
   GAME.Scia.list[self.num] = self;
   return self;
}
GAME.Scia.list = [];

 //ONDA//
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
        sprite:GAME.sprite(LOADER.sprOnda,1,64,64,0),
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
        GAME.drawSprite(self.sprite, 0, self.x-camera.xView, self.y-camera.yView, 0, self.size,self.size);
    }
    GAME.Onda.list[self.num] = self;
    return self;
 }
 GAME.Onda.list = [];

 //EXPLOSION//
GAME.Explosion = function(id,x,y)
{
   var self = 
   {
       id:id,
       x:x,
       y:y,  
       sprite: GAME.sprite(LOADER.sprExplosion,10,34,34,1.4+ENGINE.random_range(-1.5,1.5)),
   }
   self.update = function()
   {
        if(self.sprite.frameIndex >= self.sprite.frameNum-1)
        {
            delete GAME.Explosion.list[self.id];
        }
   }
   self.draw = function()
   {  
        let X = self.x*SETTINGS.globalScaleX-camera.xView;
        let Y = self.y*SETTINGS.globalScaleY-camera.yView;

        GAME.drawSprite(self.sprite, self.sprite.frameIndex , X, Y, 0, 1,1); 
   }
   GAME.Explosion.list[self.id] = self;
   return self;
}
GAME.Explosion.list = [];

//SPLASH//
GAME.Splash = function(id,x,y)
{
   var self = 
   {
       id:id,
       x:x,
       y:y,  
       sprite: GAME.sprite(LOADER.sprSplash,10,34,34,1.4),
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
        GAME.drawSprite(self.sprite, self.sprite.frameIndex , X, Y, 0, 1,1); 
   }
   GAME.Splash.list[self.id] = self;
   return self;
}
GAME.Splash.list = [];

//CHEST//
GAME.Chest = function(id,x,y)
{
   var self = 
   {
       id:id,
       x:x,
       y:y,  
       sprite: GAME.sprite(LOADER.sprChest,3,21,21,2.8),
    }

   self.draw = function()
   {  
        let X = self.x*SETTINGS.globalScaleX-camera.xView;
        let Y = self.y*SETTINGS.globalScaleY-camera.yView;
        GAME.drawSprite(self.sprite, self.sprite.frameIndex, X,  Y, 0, 1.4,1.4); 
   }

   GAME.Chest.list[self.id] = self;
   return self;
}
GAME.Chest.list = [];

//FOG//
GAME.Fog = function(x,y)
{
   var self = 
   {
       id:GAME.Fog.list.length,
       x:x,
       y:y,  
       angle:Math.random()*360,
       rot:(Math.random()+0.2)*0.2,
       sprite: GAME.sprite(LOADER.sprFog,1,256,256,1),
   }

   self.draw = function()
   {  
        self.angle += self.rot;
        let X = self.x*SETTINGS.globalScaleX-camera.xView;
        let Y = self.y*SETTINGS.globalScaleY-camera.yView;
        DOM.ctx.globalAlpha = 0.8
        GAME.drawSprite(self.sprite, 0, X,  Y, self.angle, 2,2); 
        DOM.ctx.globalAlpha = 1
   }
   GAME.Fog.list[self.id] = self;
   return self;
}
GAME.Fog.list = [];

//BALL//
GAME.Kraken = function(id,x,y,state)
{
   var self = 
   {
       id:id,
       x:x,
       y:y,  
       newX:x,
       newY:y,
       spriteSpawn : GAME.sprite(LOADER.sprKrakenSpawn,10,85,122,2),
       spriteDespawn : GAME.sprite(LOADER.sprKrakenDespawn,10,85,122,2),
       spriteAttack : GAME.sprite(LOADER.sprKrakenAttack,11,85,122,2),
       sprite: null,
       state: state,
       life:500,
       spawn:true,
   }

   self.update = function()
   {
       //emersione
       if(self.state == 0)
       {
            if(self.sprite != self.spriteSpawn)
            {
                self.sprite = self.spriteSpawn;
                self.sprite.frameIndex = 0;
            }

           if(self.sprite.frameIndex >= self.sprite.frameNum-1)
           {
                self.state = 1;
                self.sprite = self.spriteAttack;
                self.sprite.frameIndex = 0;
           }
       }

       //immersione
       if(self.state == 2)
       {
            if(self.sprite != self.spriteDespawn)
            {
                self.sprite = self.spriteDespawn;
                self.sprite.frameIndex = 0;
            }

            if(self.sprite.frameIndex >= self.sprite.frameNum-1)
            {
                 self.state = 0;
                 self.sprite = self.spriteSpawn;
                 self.sprite.frameIndex = 0;
                 self.x = self.newX;
                 self.y = self.newY;
            }
       }
   
   }

   self.draw = function()
   {  
        let X = self.x*SETTINGS.globalScaleX-camera.xView;
        let Y = self.y*SETTINGS.globalScaleY-camera.yView;

        GAME.drawSprite(self.sprite, self.sprite.frameIndex, X,  Y, 0, 2,2); 

        DOM.ctx.fillStyle = "black";
        DOM.ctx.fillRect(X-35*SETTINGS.globalScaleY,Y+120*SETTINGS.globalScaleY,50*SETTINGS.globalScaleY,5);
        DOM.ctx.fillStyle = "green";
        DOM.ctx.fillRect(X-35*SETTINGS.globalScaleY,Y+120*SETTINGS.globalScaleY,self.life/10*SETTINGS.globalScaleY,5);

        if(self.spawn)
        {
        DOM.ctx.fillStyle = "black";
        DOM.ctx.font = (10*SETTINGS.globalScaleX)+"px pixelFont";
        DOM.ctx.textAlign = "center";
        DOM.ctx.fillText("Il kraken è emerso dagli abissi. Uccidilo per ottenere tesori!",window.innerWidth/2,100*SETTINGS.globalScaleY)
        DOM.ctx.textAlign = "left";
        }
   }
   setTimeout(function(){self.spawn = false},10000)
   GAME.Kraken.list[self.id] = self;
   return self;
}
GAME.Kraken.list = [];

//TSUNAMI//
GAME.Tsunami = function(id,x,y,dir)
{
   var self = 
   {
       id:id,
       x:x,
       y:y,  
       sprite: GAME.sprite(LOADER.sprTsunami,1,96,96,0),
       dir:dir,
       size:1,
   }
   self.draw = function()
   {  
        let X = self.x*SETTINGS.globalScaleX-camera.xView;
        let Y = self.y*SETTINGS.globalScaleY-camera.yView;
        let scale_x = self.size;

        if(self.dir > 90 && self.dir < 270) {scale_x = -self.size}
        GAME.drawSprite(self.sprite, 0, X,  Y, 0, scale_x,self.size); 
        DOM.ctx.scale(1,1);
   }
   GAME.Tsunami.list[self.id] = self;
   return self;
}
GAME.Tsunami.list = [];

//elimina ogni istanza di gioco
GAME.clearEntity = function()
{
    for(let i in GAME.Onda.list)
    {       
        delete  GAME.Onda.list[i];
    }
    for(let i in GAME.Scia.list)
    {       
        delete  GAME.Scia.list[i];
    }
    for(let i in  GAME.Chest.list)
    {
        delete  GAME.Chest.list[i];
    }
    for(let i in  GAME.Players.list)
    {
        delete  GAME.Players.list[i];
    }
    for(let i in  GAME.Balls.list)
    {
        delete GAME.Balls.list[i];
    }
    for(let i in  GAME.Explosion.list)
    {
        delete  GAME.Explosion.list[i];
    }
    for(let i in  GAME.Splash.list)
    {
        delete  GAME.Splash.list[i];
    }
    for(let i in  GAME.Fog.list)
    {
        delete  GAME.Fog.list[i];
    }
    for(let i in  GAME.Kraken.list)
    {
        delete  GAME.Kraken.list[i];
    }
    for(let i in  GAME.Tsunami.list)
    {
        delete  GAME.Tsunami.list[i];
    }
    GAME.Players.list = [];
    GAME.Balls.list = [];
    GAME.Scia.list = [];
    GAME.Onda.list = [];
    GAME.Explosion.list = [];
    GAME.Splash.list = [];
    GAME.Chest.list = [];
    GAME.Fog.list = [];
    GAME.Kraken.list = [];
    GAME.Tsunami.list = [];

}

//controlla che due punti siano nel riquadro
GAME.insideRect = function(x,y, x0,y0,x1,y1)
{
    if(x > x0 && x < x0+x1 && y > y0 && y < y0+y1)
    {return true}
    else
    {return false}
}