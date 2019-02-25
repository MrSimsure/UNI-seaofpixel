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


//cancella un utente dal DB
DB.deletUser = function(name)
{
      var sql = 'DELETE FROM users WHERE username = "'+name+'"';
      DB.connection.query(sql, function (err, result) 
      {
        if (err) return false;//throw err;
        return true;
      });  
}


//controlla se il nome inserito è gia utilizzato
DB.checkUser = function(name, callback)
{
          DB.connection.query("SELECT username FROM users", function (err, result, fields) 
          {     
                if (err) return callback(false); //throw err;

                for(let i=0; i<result.length; i++)
                {
                    if(result[i].username == name)
                    {return callback(true)}
                }
                return callback(false)
          }); 
}


//registra un nuovo utente
DB.registerUser = function(name)
{
          var sql = "INSERT INTO users (username, points) VALUES ('"+name+"',0)";
          DB.connection.query(sql, function (err, result) 
          {
            if (err) return false;//throw err;
            return true;
          });  
}

//aggiorna i punti dell'utente inserito
DB.updatePoints = function(name,points)
{
              var sql = "UPDATE users SET points = "+points+" WHERE username= '"+name+"'";
              DB.connection.query(sql, function (err, result) 
              {
                if (err) return false;//throw err;
                return true;
              });     
}


//quando effettui il log controlla i punti dell'utente nel DB
DB.getPoints = function(name, callback)
{
          DB.connection.query("SELECT  username,points FROM users", function (err, result, fields) 
          {
                if (err) return callback(-1);//throw err;

                for(let i=0; i<result.length; i++)
                {
                    if(result[i].username == name)
                    {return callback(result[i].points)}
                }
                return callback(0)
          });  
}