if(window.location.href == "http://seaofpixel.herokuapp.com/")
{window.location.replace("https://seaofpixel.herokuapp.com/");}


//installa service worker
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

