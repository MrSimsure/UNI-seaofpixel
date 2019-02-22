////// INIT PAGE //////////////////////////////////////////////////////////////////////////
DOM.music_on.onclick = function()
{
    SETTINGS.audio = true
    SETTINGS.music = true
    DOM.page_init.style.display = "none";
    DOM.page_menu.style.display = "flex";

    LOADER.musMenu.loop = true
    LOADER.musMenu.volume = 0.3
    LOADER.musMenu.play()

    setLogin()

    SETTINGS.openFullscreen()
}

DOM.music_off.onclick = function()
{
    SETTINGS.audio = false
    SETTINGS.music = false
    DOM.page_init.style.display = "none";
    DOM.page_menu.style.display = "flex";

    setLogin()

    SETTINGS.openFullscreen()
}


////// LOGIN PAGE //////////////////////////////////////////////////////////////////////////
 DOM.auth_google.onclick = function()
    {   
        loginType = 0;

        
        DOM.auth_email.style.display = "none"
        DOM.auth_google.style.display = "none"
        DOM.auth_guest.style.display = "none"

        DOM.login_username.style.display = "block";
        DOM.login_username_label.style.display = "block";

        DOM.avanti.style.display = "inline-block";
        DOM.indietro.style.display = "inline-block";
            
    }

    DOM.auth_email.onclick = function()
    {  
        loginType = 1;

        DOM.auth_email.style.display = "none"
        DOM.auth_google.style.display = "none"
        DOM.auth_guest.style.display = "none"

        DOM.login_username.style.display = "block";
        DOM.login_password.style.display = "block";
        DOM.login_email.style.display = "block";

        DOM.login_username_label.style.display = "block";
        DOM.login_password_label.style.display = "block";
        DOM.login_email_label.style.display = "block";

        DOM.show_password.style.display = "block";
        DOM.show_password_label.style.display = "block";
        DOM.error_message.style.display = "block";

        DOM.avanti.style.display = "inline-block";
        DOM.indietro.style.display = "inline-block";
    }



    DOM.auth_guest.onclick = function()
    {  
        loginType = 2;

        DOM.auth_email.style.display = "none"
        DOM.auth_google.style.display = "none"
        DOM.auth_guest.style.display = "none"

        DOM.login_username.style.display = "block";
        DOM.login_username_label.style.display = "block";

        DOM.avanti.style.display = "inline-block";
        DOM.indietro.style.display = "inline-block";

    }

    DOM.show_password.onclick = function()
    {
        if (DOM.login_password.type === "password") 
        {DOM.login_password.type = "text";} 
        else 
        {DOM.login_password.type = "password";}
    }

    DOM.indietro.onclick = function()
    {  
        DOM.auth_email.style.display = "block"
        DOM.auth_google.style.display = "block"
        DOM.auth_guest.style.display = "block"

        DOM.login_username.style.display = "none";
        DOM.login_password.style.display = "none";
        DOM.login_email.style.display = "none";

        DOM.login_username_label.style.display = "none";
        DOM.login_password_label.style.display = "none";
        DOM.login_email_label.style.display = "none";

        DOM.show_password.style.display = "none";
        DOM.show_password_label.style.display = "none";
        DOM.error_message.style.display = "none";
        DOM.error_message.innerHTML = "";

        DOM.avanti.style.display = "none";
        DOM.indietro.style.display = "none";
    }


    DOM.avanti.onclick = function()
    {  

        switch(loginType)
        {
            //LOGIN CON GOOGLE
            case 0 :
            {
                
                var provider = new firebase.auth.GoogleAuthProvider();

                firebase.auth().signInWithPopup(provider).then(function(result) 
                {
                    var token = result.credential.accessToken;
                    var user = result.user;

                }).catch(function(error) 
                {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    var email = error.email;
                    var credential = error.credential;
                });
                break;
            }

            //LOGIN CON EMAIL
            case 1 :
            {
                firebase.auth().signInWithEmailAndPassword(login_email.value, login_password.value).catch(function(error) 
                {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log("errore nel login = "+errorCode)

                    if(errorCode == "auth/user-not-found")
                    {
                        firebase.auth().createUserWithEmailAndPassword(login_email.value, login_password.value).catch(function(error) 
                        {
                            // Handle Errors here.
                            var errorCode = error.code;
                            var errorMessage = error.message;
                            console.log("errore nella registrazione = "+errorCode)

                            if(errorCode == "auth/weak-password")
                            {
                                DOM.login_password.style = "top:50%;  width:80%; border: 2px solid red;"
                                DOM.error_message.innerHTML = "Weak Password"
                            }
                            });
                    }

                    if(errorCode == "auth/wrong-password")
                    {
                        DOM.login_password.style = "top:50%;  width:80%; border: 2px solid red;"
                        DOM.error_message.innerHTML = "Wrong Password"
                    }

                    if(errorCode == "auth/invalid-email")
                    {
                        DOM.login_email.style = "top:45%;  width:80%; border: 2px solid red;"
                        DOM.error_message.innerHTML = "Invalid Email"
                    }


                    
                });

                break;
            }

            //LOGIN COME GUEST
            case 2 :
            {
                firebase.auth().signInAnonymously().catch(function(error) 
                {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log("errore nel login = "+errorCode)
                });
                break;
            }

        }

        
    }



    
    DOM.login_password.onclick = function(){DOM.login_password.style = "top:50%;  width:80%;"}
    DOM.login_email.onclick = function(){DOM.login_email.style = "top:45%;  width:80%;"}


    ////// PAUSE PAGE //////////////////////////////////////////////////////////////////////////


    DOM.logout.onclick = function()
    {
        let user = firebase.auth().currentUser;
        firebase.auth().signOut().then(function() 
        {
            socket.emit("deleteUser",user.uid)
            
            if(user.isAnonymous)
            {
                user.delete().then(function() 
                {
                    // User deleted.
                }).catch(function(error) 
                {
                    // An error happened.
                });
            }

            socket.emit("logout");
            SETTINGS.inGame = false

            clearInterval(game_update);
            socket.removeAllListeners("hit")
            socket.removeAllListeners("playerDie")
            socket.removeAllListeners("ballEnd")
            socket.removeAllListeners("chestEnd")
            socket.removeAllListeners("chestTaken")
            socket.removeAllListeners("disconect")
            socket.removeAllListeners("newPositions")
            GAME.clearEntity();
            initMenu()
 

            DOM.login_username.style.display = "none";
            DOM.login_password.style.display = "none";
            DOM.login_email.style.display = "none";

            DOM.login_username_label.style.display = "none";
            DOM.login_password_label.style.display = "none";
            DOM.login_email_label.style.display = "none";
            
            DOM.avanti.style.display = "none";
            DOM.indietro.style.display = "none";

            DOM.show_password.style.display = "none";
            DOM.show_password_label.style.display = "none";
            DOM.error_message.style.display = "none";
            DOM.error_message.innerHTML = "";

            DOM.auth_email.style.display = "block"
            DOM.auth_google.style.display = "block"
            DOM.auth_guest.style.display = "block"

            DOM.page_pause.style.display = "none";
            DOM.page_menu.style.display = "inline-flex";
            


        }).catch(function(error) 
        {
            console.log("errore nel logout = "+error)
        });
    }

    DOM.audio.onclick = function()
    {
        SETTINGS.audio = !SETTINGS.audio

        if(SETTINGS.audio)
        {
            DOM.audio.innerHTML  = "AUDIO OFF"
        }
        else
        {
            DOM.audio.innerHTML  = "AUDIO ON"
        }
    }

    DOM.music.onclick = function()
    {
        SETTINGS.music = !SETTINGS.music

        if(SETTINGS.music)
        {
            DOM.music.innerHTML  = "MUSIC OFF"
            LOADER.musMenu.loop = true
            LOADER.musMenu.play()
        }
        else
        {
            DOM.music.innerHTML  = "MUSIC ON"
            LOADER.musMenu.pause();
        }
    }


    DOM.fullscreen.onclick = function()
    {
        SETTINGS.openFullscreen()
    }

    DOM.back.onclick = function()
    {
        setPause()
    }