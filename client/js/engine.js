
Math.radians = function(degrees) 
{
    return degrees * Math.PI / 180;
}
   

Math.degrees = function(radians) 
{
    return radians * 180 / Math.PI;
}

lengthdir_x = function(len,dir)
{
    return Math.cos(dir/180*Math.PI)*len;
}

lengthdir_y = function(len,dir)
{
    return Math.sin(dir/180*Math.PI)*len;
}


point_direction = function(x1,y1,x2,y2)
{
    return -Math.degrees(Math.atan2(y1 - y2, x1 - x2))+180;
}


point_distance = function(x1,y1,x2,y2)
{
    var a = x1 - x2;
    var b = y1 - y2;

    return Math.sqrt( a*a + b*b );
}


random_range = function(min, max)
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}