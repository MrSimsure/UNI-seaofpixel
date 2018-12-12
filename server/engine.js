
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
    //dir+=180;
    //dir = dir-(Math.floor(dir/360)*360);
    return Math.cos(dir/180*Math.PI)*len;
}

lengthdir_y = function(len,dir)
{
    //dir+=180;
    //dir = dir-(Math.floor(dir/360)*360);
    return Math.sin(dir/180*Math.PI)*len;
}


point_direction = function(x1,y1,x2,y2)
{
    return -Math.degrees(Math.atan2(y1 - y2, x1 - x2))+180;
}

point_distance = function(x1,y1,x2,y2)
{
    return -Math.degrees(Math.atan2(y1 - y2, x1 - x2))+180;
}