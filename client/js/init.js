//REINDERIZZA A HTTPS
if(window.location.href == "http://seaofpixel.herokuapp.com/")
{window.location.replace("https://seaofpixel.herokuapp.com/");}

//INSTALLA IL SERVICE WORKER
if ('serviceWorker' in navigator) 
{
    window.addEventListener('load', function() 
    {
        navigator.serviceWorker.register('../serviceWorker.js').then(
        function(registration) 
        {console.log('ServiceWorker registration successful with scope: ', registration.scope);}, 
        function(err)
        {console.log('ServiceWorker registration failed: ', err);});
    });
}

//CARICA IL CSS
let scripts = document.getElementsByTagName("script");
let src = scripts[scripts.length-1].src;
let pos = src.search("js");
src = src.slice(0,pos);

document.getElementById("css").href=src+"css/index.css";