window.Game = {};


// wrapper for "class" Rectangle
(function()
    {
    function Rectangle(x, y, w, h)
    {
        this.x = x;
        this.y = y;
        this.w = x + w;
        this.h = y + h;
    }

    Rectangle.prototype.set = function(x, y, w, h)
    {
        this.x = x;
        this.y = y;
        this.w = x + w;
        this.h = y + h;
    }

    Rectangle.prototype.within = function(r) 
    {
        return (r.x <= this.x && r.w >= this.w && r.y <= this.y && r.h >= this.h);
    }       

    Rectangle.prototype.overlaps = function(r) 
    {
        return (this.x < r.w &&  r.x < this.w && this.y < r.h && r.y < this.h);
    }

    Game.Rectangle = Rectangle;
})();   


// wrapper for "class" Camera
(function()
{
    var AXIS = 
    {
        NONE: "none", 
        HORIZONTAL: "horizontal", 
        VERTICAL: "vertical", 
        BOTH: "both"
    };

    // Camera constructor
    function Camera(xView, yView, canvas, world)
    {
        // position of camera (left-top coordinate)
        this.xView = xView || 0;
        this.yView = yView || 0;

        // distance from followed object to border before camera starts move
        this.xDeadZone = canvas.width/2; // min distance to horizontal borders
        this.yDeadZone = canvas.height/2; // min distance to vertical borders

        // viewport dimensions
        this.wView = canvas.width;
        this.hView = canvas.height;          

        // allow camera to move in vertical and horizontal axis
        this.axis = AXIS.BOTH;  

        // rectangle that represents the viewport
        this.viewportRect = new Game.Rectangle(this.xView, this.yView, this.wView, this.hView);             

        // rectangle that represents the world's boundary (room's boundary)
        this.worldRect = new Game.Rectangle(0, 0, world.width, world.height);

    }

    Camera.prototype.update = function(followX, followY)
    {
      
            if(this.axis == AXIS.HORIZONTAL || this.axis == AXIS.BOTH)
            {       
                // moves camera on horizontal axis based on followed object position
                if(followX - this.xView  + this.xDeadZone > this.wView)
                    this.xView = followX - (this.wView - this.xDeadZone);
                else if(followX  - this.xDeadZone < this.xView)
                    this.xView = followX  - this.xDeadZone;

            }
            if(this.axis == AXIS.VERTICAL || this.axis == AXIS.BOTH)
            {
                // moves camera on vertical axis based on followed object position
                if(followY - this.yView + this.yDeadZone > this.hView)
                    this.yView = followY - (this.hView - this.yDeadZone);
                else if(followY - this.yDeadZone < this.yView)
                    this.yView = followY - this.yDeadZone;
            }                       
     

        // update viewportRect
        this.viewportRect.set(this.xView, this.yView);

        // don't let camera leaves the world's boundary
        if(!this.viewportRect.within(this.worldRect))
        {
            if(this.viewportRect.left < this.worldRect.left)
                this.xView = this.worldRect.left;
            if(this.viewportRect.top < this.worldRect.top)                  
                this.yView = this.worldRect.top;
            if(this.viewportRect.right > this.worldRect.right)
                this.xView = this.worldRect.right - this.wView;
            if(this.viewportRect.bottom > this.worldRect.bottom)                    
                this.yView = this.worldRect.bottom - this.hView;
        }

    }   

    // add "class" Camera to our Game object
    Game.Camera = Camera;

})();


// wrapper for "class" Map
(function(){
    function Map(width, height)
    {
        // map dimensions
        this.width = width;
        this.height = height;

        // map texture
        this.image = null;
    }

    // generate an example of a large map
    Map.prototype.generate = function()
    {
        var temp = document.createElement("canvas").getContext("2d");        
        temp.canvas.width = this.width;
        temp.canvas.height = this.height;        

        var rows = ~~(this.width/128) + 1;
        var columns = ~~(this.height/128) + 1;


        for (var x = 0, i = 0; i < rows; x+=128, i++) 
        {    
            for (var y = 0, j=0; j < columns; y+=128, j++) 
            {          
                temp.drawImage(sprWater, x, y,128,128); 
            }
        }   


        // store the generate map as this image texture
        this.image = new Image();
        this.image.src = temp.canvas.toDataURL("image/png", 1.0);                 

        temp = null;
    }

    // draw the map adjusted to camera
    Map.prototype.draw = function(context, xView, yView)
    {                   
        context.drawImage(this.image, 0, 0, this.image.width, this.image.height, -xView, -yView, this.image.width, this.image.height);     
    }

    // add "class" Map to our Game object
    Game.Map = Map;

})();



var drawSprite = function(ctx,image,x,y,angle)
{
    var TO_RADIANS = Math.PI/180; 

    ctx.save(); 
    ctx.translate(x, y);  
    ctx.rotate(angle * TO_RADIANS);

    ctx.drawImage(image, -(image.width/2), -(image.height/2));

    ctx.restore(); 
    
}


var drawFrame = function(ctx,spriteStrip,frame,x,y,angle)
{
    var TO_RADIANS = Math.PI/180; 

    ctx.save(); 
    ctx.translate(x, y);  
    ctx.rotate(angle * TO_RADIANS);
    ctx.scale(4, 4);
    ctx.drawImage(
                spriteStrip.image, 
                frame * spriteStrip.width, 
                0, 
                spriteStrip.width , 
                spriteStrip.height, 
                -(spriteStrip.width/2), 
                -(spriteStrip.height/2), 
                spriteStrip.width , 
                spriteStrip.height);

   ctx.restore(); 


 }
    
