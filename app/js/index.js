var url= null;
var filename = null;

var urlField = document.querySelector('#url');
var fnField = document.querySelector('#filename');
var btnDl = document.querySelector('#btn-dl');
var shout= document.querySelector('#shout');
btnDl.addEventListener("click", function(){
   url = urlField.value;
   filename = fnField.value;
   getLinkandDownload(url,filename);
});
var ipcRenderer = require('electron').ipcRenderer;

var closeEl = document.querySelector('#close');
closeEl.addEventListener('click', function () {
    ipcRenderer.send('close-main-window');
});

var request = require('request');
var fs = require('fs');
var path = require('path');
var home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
function getLinkandDownload(url,dest){
request(url, function (error, response, body) {
   
    if (error) shout.innerHTML = 'error: ' +error;
    
  if(response && response.statusCode==200)   shout.innerHTML = 'Preparando para descarregar' ;
  
  let pattern = /(https:\/\/streaming-ondemand\.rtp\.pt\/)(.*)(index\.m3u8\?tlm=hls&streams=)(.*)\.mp4/;
  let matches = body.match(pattern);
  let link = matches[1] + matches[2] + matches[4] + ".mp4";
  
  
  download(link,dest,cb);
  
});

}
var download = function(link, dest, cb) {
  
    var fullFilename = path.join(home,dest + '.mp4');
     shout.innerHTML = 'Descarregando...'  ;
    
  var file = fs.createWriteStream(fullFilename);
  request.get(link).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  }).pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  
};


var cb = function(show){  
   if (show) shout.innerHTML = show;
   else {
       shout.innerHTML = 'Descarregado.\n <a href="#" id="open">Abrir localização do ficheiro.</a>';
       document.querySelector('#open').addEventListener('click', function(event){
                // event.preventDefault();
                 event.defaultPrevented = true;
                 ipcRenderer.send('open-home');
       });
   }
};