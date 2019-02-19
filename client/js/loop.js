initGame = function()
{
    inGame = true;
    lastLoop = 0;

    //BLOCCA IL LOOP DEL MENU
    clearInterval(menu_update);

    //INSTANZIA LA NEBBIA AI CONFINI DEL MONDO
    for(let i=-2; i<(room.width/200)+2; i++)
    {
        GAME.Fog(i*200,-180);
        GAME.Fog(i*200,room.height+180);
    }

    for(let i=-2; i<(room.height/200)+2; i++)
    {
        GAME.Fog(-200,i*200);
        GAME.Fog(room.width+200,i*200);
    }
      
    //SE SU MOBILE ATTIVA FULLSCREEN E JOYSTICK
    if(SETTINGS.onMobile)
    {
        SETTINGS.openFullscreen();     
        joystick = new VirtualJoystick(
                    {
                    mouseSupport: true,
                    stationaryBase: true,
                    baseX: 90,
                    baseY: 260,
                    limitStickTravel: true,
                    stickRadius: 50,
                    });
    }
    //INIZIA LOOP DI GIOCO
    setInterval(clientUpdate ,1000/30); 
    //DISPLAY DEI DOOM
    DOM.page_menu.style.display = "none";
    DOM.page_login.style.display = "none";
    DOM.page_game.style.display = "inline";
}

update = function()
{
        //CONTROLLA LE DIMENSIONI DELLA FINESTRA
        if(lastScaleX !=window.innerWidth || lastScaleY != window.innerHeight)
        {
            lastScaleX = window.innerWidth;
            lastScaleY = window.innerHeight;

            SETTINGS.setScaleFactor();
            SETTINGS.canvasResize();
        }

        //CARICA SE TIENI PREMUTO
        if(keys[32] || touch == true) //space
        { if(charge < 10) {charge += 0.5}}

        //AGGIORNA FPS
        let thisLoop = new Date();
        if(Math.random() > 0.8)
        {fpsClient = Math.floor(1000 / (thisLoop - lastLoop));}
        lastLoop = thisLoop;
        let me = GAME.Players.list[id];
        let minDist = 99999999;
        let final = null;

        //CICLA I GIOCATORI 
        for(let i in  GAME.Players.list)
        {
            let current =  GAME.Players.list[i];
            //CREA LA SCIA SOTTO OGNI NAVE
            GAME.Scia(current.x*SETTINGS.globalScaleX,  current.y*SETTINGS.globalScaleY);
            //SE TROVI TE STESSO AGGIORNA LA TELECAMERA E CREA LE ONDE
            if(current.id == id)
            {
                for(let i=0; i<SETTINGS.quality; i++)
                {GAME.Onda(Math.random()*room.width*SETTINGS.globalScaleX, Math.random()*room.height*SETTINGS.globalScaleY);} 

                camera.update(current.x*SETTINGS.globalScaleX, current.y*SETTINGS.globalScaleY);
            }
            else
            {    
                //CALCOLA LA NAVE PIU VICINA A TE
                let dist = ENGINE.point_distance(me.x,me.y,current.x,current.y)
                if(dist < minDist)
                {
                    final = current;
                    minDist = dist;
                }
            }
        }

        //TROVA IL GIOCATORE PIU VICINO
        if(final != null)
        {nearPlayer = ENGINE.point_direction(me.x,me.y,final.x,final.y) ;}
        else
        {nearPlayer = 0}
        final = null;
        minDist = 999999999;

        //TROVA LA CASSA PIU VICINA
        for(let i in  GAME.Chest.list)
        {
            let current =  GAME.Chest.list[i];
            let dist = ENGINE.point_distance(me.x,me.y,current.x,current.y)
            if(dist < minDist)
            {
                final = current
                minDist = dist
            }
        }        
        if(final != null)
        {nearChest = ENGINE.point_direction(me.x,me.y,final.x,final.y) ;}
        else
        {nearChest = 0}

        //JOYSTICK
        if(SETTINGS.onMobile == true && joystick != null)
        {
            if( joystick.right() )
            { socket.emit("keyPress", {id:"right", state:true}); } else { socket.emit("keyPress", {id:"right", state:false}); }
            if( joystick.left() )
            {  socket.emit("keyPress", {id:"left", state:true});} else {  socket.emit("keyPress", {id:"left", state:false});}
            if( joystick.up() )
            {  socket.emit("keyPress", {id:"up", state:true}); } else {  socket.emit("keyPress", {id:"up", state:false}); }
            if( joystick.down() )
            {  socket.emit("keyPress", {id:"down", state:true}); } else {  socket.emit("keyPress", {id:"down", state:false}); }
        }
}

draw = function()
{   
        //pulisci il canvas
        DOM.ctx.clearRect(0, 0, canvas.width, canvas.height);
        //disegna la mappa
        DOM.ctx.fillStyle = "#32479C";
        DOM.ctx.fillRect(0,0,canvas.width,canvas.height);
        DOM.ctx.fillStyle = "#000000";
        //aggiorna e disegna le scie
        for(let i = GAME.Onda.list.length-1 ; i >= 0; i--)
        {       
            let current =  GAME.Onda.list[i];
            current.update();
            current.draw();
        }
        //aggiorna e disegna le onde
        for(let i = GAME.Scia.list.length-1 ; i >= 0; i--)
        {       
            let current =  GAME.Scia.list[i];
            current.update();
            current.draw();
        }
        //disegna le casse
        for(let i in  GAME.Chest.list)
        {
            let current =  GAME.Chest.list[i];
            current.draw();
        }
        //disegna tutti i giocatori
        for(let i in  GAME.Players.list)
        {
            let current =  GAME.Players.list[i];
            current.draw();
        }
        //disegna palle di cannone
        for(let i in  GAME.Balls.list)
        {
            let current =  GAME.Balls.list[i];
            current.draw();
        }
        //disegna esplosioni
        for(let i in  GAME.Explosion.list)
        {
            let current =  GAME.Explosion.list[i];
            current.update();
            current.draw();
        }
        //disegna splash
        for(let i in  GAME.Splash.list)
        {
            let current =  GAME.Splash.list[i];
            current.update();
            current.draw();
        }
        GAME.drawSprite(sIsola, 0, (150-camera.xView),  (150-camera.yView), 0, 1);
        //disegna nebbia
        for(let i in  GAME.Fog.list)
        {
            let current =  GAME.Fog.list[i];
            current.draw();
        }
        //disegna barra caricamento cannone
        if(charge > 0)
        {
            let X = GAME.Players.list[id].x*SETTINGS.globalScaleX-camera.xView;
            let Y = GAME.Players.list[id].y*SETTINGS.globalScaleY-camera.yView;
            DOM.ctx.fillStyle = "black";
            DOM.ctx.fillRect(X-25*SETTINGS.globalScaleY, Y+30*SETTINGS.globalScaleY, 50*SETTINGS.globalScaleY, 5);    
            DOM.ctx.fillStyle = "red";
            DOM.ctx.fillRect(X-25*SETTINGS.globalScaleY, Y+30*SETTINGS.globalScaleY, charge*5*SETTINGS.globalScaleY, 5);
        }
        //disegna fps
        DOM.ctx.fillStyle = "black";
        DOM.ctx.font = (8*SETTINGS.globalScaleX)+"px Georgia";
        DOM.ctx.fillText("FPS C:"+fpsClient, 10,  (480-64)*SETTINGS.globalScaleY);
        DOM.ctx.fillText("FPS S:"+fpsServer, 10,  (480-32)*SETTINGS.globalScaleY);
        //disegna punteggio
        DOM.ctx.fillText("POINTS:"+GAME.Players.list[socket.id].points, 10, 16*SETTINGS.globalScaleY);
        //disegna bussola 
        GAME.drawSprite(sBussola, 0, (640-32)*SETTINGS.globalScaleX,  32*SETTINGS.globalScaleY, 0, 1);
        GAME.drawSprite(sFreccia, 0, (640-32)*SETTINGS.globalScaleX,  32*SETTINGS.globalScaleY, nearChest, 0.8);
        if(Object.keys(GAME.Players.list).length > 1)
        {GAME.drawSprite(sFreccia, 1, (640-32)*SETTINGS.globalScaleX,  32*SETTINGS.globalScaleY, nearPlayer, 0.8);}
}

clientUpdate = function()
{
    update();
    draw();
}

initMenu = function()
{
    lastScaleX = 0;
    lastScaleY = 0;
    time = new Date();
    seaPoint = [];
    waveNum = Math.round(DOM.canvas.width/13);
    waveHeight = DOM.canvas.height/3;
    nu = 0
    for(let i=0; i<waveNum; i++)
    { 
        seaPoint[i] = 
        {
            x : i/waveNum * DOM.canvas.width,
            y : 0,
            spd : 0,
        }
    }
    menu_update = setInterval(menuDraw ,1000/90);  
}

menuDraw = function()
{
    DOM.splash.style.top = String( 15+Math.sin( (Date.now()-time.getTime())/200)  )+"%";

    if(lastScaleX !=window.innerWidth || lastScaleY != window.innerHeight)
    {
        lastScaleX = window.innerWidth;
        lastScaleY = window.innerHeight;
        SETTINGS.setScaleFactor();
        SETTINGS.canvasResize();
        waveNum = Math.round(DOM.canvas.width/13);
        waveHeight = DOM.canvas.height/3;
        for(let i=0; i<waveNum; i++)
        { 
            seaPoint[i] = 
            {
                x : i/waveNum * DOM.canvas.width,
                y : 0,
                spd : 0,
            }
        }
    }

    DOM.ctx.clearRect(0,0,DOM.canvas.width,DOM.canvas.height);
    DOM.ctx.fillStyle = "#99E6F9";
    DOM.ctx.fillRect(0,0,DOM.canvas.width,DOM.canvas.height);
    DOM.ctx.fillStyle = "#3D61D8";
    DOM.ctx.beginPath();
    DOM.ctx.moveTo(0,DOM.canvas.height);

    for(let i=0; i<waveNum; i++)
    {
        let tempo = Date.now()-time.getTime();
        let movimentoOnda = (Math.sin(tempo/5000));
        let movimentoMare = Math.sin(tempo/5000);
        let ondaVicina = ENGINE.mod(i-Math.round(nu),waveNum);
        DOM.ctx.lineTo( seaPoint[i].x , waveHeight+(Math.sin( movimentoOnda+seaPoint[ondaVicina].x)*10 )+movimentoMare );
    }    
    nu+=0.2;
    if(nu > waveNum)
    {nu=0}
    DOM.ctx.lineTo( DOM.canvas.width+16 , waveHeight );
    DOM.ctx.lineTo(DOM.canvas.width, DOM.canvas.height);
    DOM.ctx.fill();
}