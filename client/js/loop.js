initGame = function()
{
    lastLoop = 0;
    SETTINGS.inGame = true
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

    }
    //INIZIA LOOP DI GIOCO
    clearInterval(game_update);
    game_update = setInterval(clientUpdate ,1000/30); 

    //DISPLAY DEI DOOM
    DOM.page_init.style.display = "none";
    DOM.page_menu.style.display = "none";
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
        if(SETTINGS.onMobile == true)
        {
            let movingUP = false
            let movingSX = false
            let movingDX = false


            //left
            if(GAME.insideRect(tuchX,tuchY,buttonX+buttonMargin*0+buttonSize*0, window.innerHeight-buttonMargin*1-buttonSize, buttonSize,buttonSize))
            {
                movingDX = true;
            }
            //right
            if(GAME.insideRect(tuchX,tuchY,buttonX+buttonMargin*2+buttonSize*2, window.innerHeight-buttonMargin*1-buttonSize, buttonSize,buttonSize))
            {
                movingSX = true;
            }
            //up-left
            if(GAME.insideRect(tuchX,tuchY,buttonX+buttonMargin*0+buttonSize*0, window.innerHeight-buttonMargin*2-buttonSize*2, buttonSize,buttonSize))
            {
                movingUP = true;
                movingDX = true;
            }
            //up
            if(GAME.insideRect(tuchX,tuchY,buttonX+buttonMargin*1+buttonSize*1, window.innerHeight-buttonMargin*2-buttonSize*2, buttonSize,buttonSize))
            {
                movingUP = true;
            }  
            //up-right
            if(GAME.insideRect(tuchX,tuchY,buttonX+buttonMargin*2+buttonSize*2, window.innerHeight-buttonMargin*2-buttonSize*2, buttonSize,buttonSize))
            {
                movingUP = true;
                movingSX = true;
            }    
    
    
            if(movingUP)
            {socket.emit("keyPress", {id:"up", state:true}); moving = true;}
            else
            {socket.emit("keyPress", {id:"up", state:false}); moving = false;}
    
            if(movingSX)
            {socket.emit("keyPress", {id:"left", state:true}); }
            else
            {socket.emit("keyPress", {id:"left", state:false}); }
    
            if(movingDX)
            {socket.emit("keyPress", {id:"right", state:true}); }
            else
            {socket.emit("keyPress", {id:"right", state:false}); }
        }
}

draw = function()
{   
        //pulisci il canvas
        DOM.ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        //disegna il mare
        DOM.ctx.fillStyle = "#32479C";
        DOM.ctx.fillRect(0,0,canvas.width,canvas.height);


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
        //disegna tutti i kraken
        for(let i in  GAME.Kraken.list)
        {
            let current =  GAME.Kraken.list[i];
            current.update();
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

        DOM.ctx.fillStyle = "black";
        DOM.ctx.font = (6*SETTINGS.globalScaleX)+"px pixelFont";

        //scrivi informazioni di debug
        if(DEBUG)
        {
            DOM.ctx.fillText("FPS CLIENT:"+fpsClient, 10,  200*SETTINGS.globalScaleY);
            DOM.ctx.fillText("FPS SERVER:"+fpsServer, 10,  220*SETTINGS.globalScaleY);
            DOM.ctx.fillText("PLAYERS:"+Object.keys(GAME.Players.list).length, 10,  240*SETTINGS.globalScaleY);
        }

        //scrivi classifica giocatori
        for(let n=0; n<scoreBoard.length; n++)
        {
            let current = scoreBoard[n];
            let YY = 0;

            if(current.me)
            {DOM.ctx.fillStyle = "red";}
            else
            {DOM.ctx.fillStyle = "black";}

            if(SETTINGS.onMobile)
            {YY = window.innerHeight-buttonSize*3-10*n*SETTINGS.globalScaleY}
            else
            {YY = window.innerHeight-10-10*n*SETTINGS.globalScaleY}

            DOM.ctx.fillText( (scoreBoard.length-n)+"° "+current.name+"="+current.points, 5*SETTINGS.globalScaleX, YY)
        }

        DOM.ctx.fillStyle = "black";

        //disegna bussola 
        GAME.drawSprite(sBussola, 0, (640-32)*SETTINGS.globalScaleX,  32*SETTINGS.globalScaleY, 0, 1);
        GAME.drawSprite(sFreccia, 0, (640-32)*SETTINGS.globalScaleX,  32*SETTINGS.globalScaleY, nearChest, 0.8);
        if(Object.keys(GAME.Players.list).length > 1)
        {GAME.drawSprite(sFreccia, 1, (640-32)*SETTINGS.globalScaleX,  32*SETTINGS.globalScaleY, nearPlayer, 0.8);}

        //disegna pulsante di pausa
        GAME.drawSprite(sPause,0,25*SETTINGS.globalScaleX,25*SETTINGS.globalScaleY,0,0.6)

        //disegna controlli mobile
        if(SETTINGS.onMobile)
        {
            DOM.ctx.globalAlpha = 0.7
            //sx
            GAME.drawSprite(sArrow,0,(buttonX+buttonMargin*0+buttonSize*0)+buttonSize/2, (window.innerHeight-buttonMargin*1-buttonSize)+buttonSize/2,180,1)
            DOM.ctx.beginPath();    DOM.ctx.rect(buttonX+buttonMargin*0+buttonSize*0, window.innerHeight-buttonMargin*1-buttonSize, buttonSize,buttonSize);    DOM.ctx.stroke()
            //dx
            GAME.drawSprite(sArrow,0,(buttonX+buttonMargin*2+buttonSize*2)+buttonSize/2, (window.innerHeight-buttonMargin*1-buttonSize)+buttonSize/2,0,1)
            DOM.ctx.beginPath();    DOM.ctx.rect(buttonX+buttonMargin*2+buttonSize*2, window.innerHeight-buttonMargin*1-buttonSize, buttonSize,buttonSize);    DOM.ctx.stroke()
            //up-sx
            GAME.drawSprite(sArrow,0,(buttonX+buttonMargin*0+buttonSize*0)+buttonSize/2, (window.innerHeight-buttonMargin*2-buttonSize*2)+buttonSize/2,225,1)
            DOM.ctx.beginPath();    DOM.ctx.rect(buttonX+buttonMargin*0+buttonSize*0, window.innerHeight-buttonMargin*2-buttonSize*2, buttonSize,buttonSize);    DOM.ctx.stroke()
            //up
            GAME.drawSprite(sArrow,0,(buttonX+buttonMargin*1+buttonSize*1)+buttonSize/2, (window.innerHeight-buttonMargin*2-buttonSize)-buttonSize/2,270,1)
            DOM.ctx.beginPath();    DOM.ctx.rect(buttonX+buttonMargin*1+buttonSize*1, window.innerHeight-buttonMargin*2-buttonSize*2, buttonSize,buttonSize);    DOM.ctx.stroke()
            
            GAME.drawSprite(sArrow,0,(buttonX+buttonMargin*2+buttonSize*2)+buttonSize/2, (window.innerHeight-buttonMargin*2-buttonSize)-buttonSize/2,315,1)
            DOM.ctx.beginPath();    DOM.ctx.rect(buttonX+buttonMargin*2+buttonSize*2, window.innerHeight-buttonMargin*2-buttonSize*2, buttonSize,buttonSize);    DOM.ctx.stroke()

            DOM.ctx.beginPath()
            DOM.ctx.arc( (window.innerWidth-buttonMargin*2-buttonSize*2)+buttonSize, ( window.innerHeight-buttonMargin*2-buttonSize*2)+buttonSize, buttonSize, 0, 2*Math.PI,false)
            DOM.ctx.stroke()

            DOM.ctx.globalAlpha = 1
        }
    
        //disegna sfondo di pausa
        if(SETTINGS.inGame == false)
        {
            DOM.ctx.beginPath();    
            DOM.ctx.globalAlpha = 0.7
            DOM.ctx.fillRect(0, 0,  window.innerWidth, window.innerHeight);   
            DOM.ctx.globalAlpha = 1 
        }
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
    clearInterval(menu_update);
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
    DOM.ctx.fillStyle = "#ffb86d";
    DOM.ctx.fillRect(0,0,DOM.canvas.width,DOM.canvas.height);
    DOM.ctx.fillStyle = "#746dff";
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