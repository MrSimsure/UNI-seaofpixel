DB = {};

DB.mysql = require('mysql');

DB.connection = DB.mysql.createConnection(
    {
    host: "den1.mysql1.gear.host",
    user: "seasofpixel",
    password: "Fl9aDM0_wi-B",
    database: "seasofpixel"
    });


    
DB.checkUser = function(name)
{
    DB.connection.connect(function(err) 
    {
          if (err) throw err;

  
          DB.connection.query("SELECT username FROM users", function (err, result, fields) 
          {
                if (err) throw err;

                for(let i=0; i<result.length; i++)
                {
                    if(result[i].username == name)
                    {return true}
                }
                return false
          });
        
    });
  
}

DB.loginUser = function(name,password)
{
    DB.connection.connect(function(err) 
    {
          if (err) throw err;

  
          DB.connection.query("SELECT username,password FROM users", function (err, result, fields) 
          {
                if (err) throw err;

                for(let i=0; i<result.length; i++)
                {
                    if(result[i].username == name && result[i].password == password)
                    {return true}
                }
                return false
          });
        
    });
  
}

DB.registerUser = function(name, password)
{
    DB.connection.connect(function(err) 
    {
          if (err) throw err;

          var sql = "INSERT INTO users (username, password, points) VALUES ("+name+","+password+",0)";
          DB.connection.query(sql, function (err, result) 
          {
            if (err) throw err;
          });     
    });
  
}



DB.updatePoints = function(name,points)
{
        DB.connection.connect(function(err) 
        {
              if (err) throw err;
    
              var sql = "UPDATE users SET points = "+points+" WHERE username= '"+name+"'";
              DB.connection.query(sql, function (err, result) 
              {
                if (err) throw err;
              });     
        });
}