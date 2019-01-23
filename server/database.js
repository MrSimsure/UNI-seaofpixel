DB = {};

DB.mysql = require('mysql');

DB.connection = DB.mysql.createConnection(
    {
    host: "den1.mysql1.gear.host",
    user: "seasofpixel",
    password: "Fl9aDM0_wi-B",
    database: "seasofpixel"
    });



DB.isStringValide = function(string)
{
    if(string.match(/^([a-zA-Z0-9 _-]+)$/i) == null)
    {return true}
    else
    {return false}
}



//controlla se il nome inserito è gia utilizzato
DB.checkUser = function(name, callback)
{

          DB.connection.query("SELECT username FROM users", function (err, result, fields) 
          {
                if (err) throw err;

                for(let i=0; i<result.length; i++)
                {
                    if(result[i].username == name)
                    {return callback(true)}
                }
                return callback(false)
          });

  
}

//controlla se username e password sono corretti
DB.loginUser = function(name,password, callback)
{

          DB.connection.query("SELECT username,password FROM users", function (err, result, fields) 
          {
                if (err) throw err;

                for(let i=0; i<result.length; i++)
                {
                    if(result[i].username == name && result[i].password == password)
                    {return callback(true,result[i].points)}
                }
                return callback(false,0)
          });

  
}


//controlla se username e password sono corretti
DB.getPoints = function(name, callback)
{

          DB.connection.query("SELECT  username,points FROM users", function (err, result, fields) 
          {
                if (err) throw err;

                for(let i=0; i<result.length; i++)
                {
                    if(result[i].username == name)
                    {return callback(result[i].points)}
                }
                return callback(0)
          });

  
}

//registra un nuovo utente
DB.registerUser = function(name, password)
{

          var sql = "INSERT INTO users (username, password, points) VALUES ('"+name+"','"+password+"',0)";
          DB.connection.query(sql, function (err, result) 
          {
            if (err) throw err;
          });     
  
}


//aggiorna i punti dell'utente inserito
DB.updatePoints = function(name,points)
{

              var sql = "UPDATE users SET points = "+points+" WHERE username= '"+name+"'";
              DB.connection.query(sql, function (err, result) 
              {
                if (err) throw err;
              });     

}