const WINDOW_WIDTH = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
const WINDOW_HEIGHT = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
const WORLD_SIZE = { width: 1600, height: 1200 }

var game;
PlayersList = {};

var setup_game = function()
{
    
    var config = 
    {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        scene: 
        {
            preload: preload,
            create: create,
            update: update
        }
    };

    game = new Phaser.Game(config);



    function addSprite(game,id,x,y)
    {
        PlayersData[id].sprite = game.add.image(x, y, 'player');
        /*
        PlayersList[id] = 
        {
            sprite:game.add.image(x, y, 'player'),
            x:x,
            y:y
        }
        */
    }

    function removePlayer(id)
    {
        delete PlayersList[id];
    }
    
    
    
    function preload () 
    {
        this.load.crossOrigin = 'Anonymous'
        this.load.image('player', `/client/img/spr_Player.png`)
        this.load.image('ground', `/client/img/spr_ground.png`)
    }



    function create () 
    {

        const { width, height } = WORLD_SIZE


        let groundTiles = []
        for (let i = 0; i <= width / 64 + 1; i++) 
        {
            for (let j = 0; j <= height / 64 + 1; j++) 
            {
                const groundSprite = this.add.sprite(i * 64, j * 64, 'ground')
                groundTiles.push(groundSprite)
            }
        }

        // Configures the game camera
        //game.camera.x = this.player.sprite.x - 800 / 2
        //game.camera.y = this.player.sprite.y - 600 / 2

        // Scale game to fit the entire window
    
    }


    function update()
    {
        for(var i in PlayersData)
        {
            if(PlayersData[i].sprite == null)
            {
                addSprite(this,PlayersData[i].id,PlayersData[i].x,PlayersData[i].y);
            }

            PlayersData[i].sprite.x = PlayersData[i].x;
            PlayersData[i].sprite.y = PlayersData[i].y;

            /*
           if(PlayersList[i] != null)
           {
                addPlayer(this,PlayersData[i].id, PlayersData[i].x, PlayersData[i].y)
           }
           PlayersList[i].sprite.destroy();
           */
        }
    }

    return game;
}

