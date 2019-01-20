ENGINE = {};

ENGINE.mod = function(x,y)
{
    return x - y * Math.floor(x / y)
}

ENGINE.radians = function(degrees) 
{
    return degrees * Math.PI / 180;
}
   

ENGINE.degrees = function(radians) 
{
    return radians * 180 / Math.PI;
}

ENGINE.lengthdir_x = function(len,dir)
{
    return Math.cos(dir/180*Math.PI)*len;
}

ENGINE.lengthdir_y = function(len,dir)
{
    return Math.sin(dir/180*Math.PI)*len;
}


ENGINE.point_direction = function(x1,y1,x2,y2)
{
    return ENGINE.degrees(Math.atan2(y1 - y2, x1 - x2))+180;
}


ENGINE.point_distance = function(x1,y1,x2,y2)
{
    var a = x1 - x2;
    var b = y1 - y2;

    return Math.sqrt( a*a + b*b );
}


ENGINE.random_range = function(min, max)
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


ENGINE.clamp = function(a,b,c)
{
    return Math.max(b,Math.min(c,a));
}