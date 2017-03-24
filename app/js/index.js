var url= null;
var filename = null;
var urlField = document.querySelector('#url');
var fnField = document.querySelector('#filename');
var btnDl = document.querySelector('#btn-dl');
btnDl.addEventListener("click", function(){
   url = urlField.value;
   filename = fnField.value;
   console.log(url,filename);
   getLinkandDownload(url,filename + '.mp4');
});
var ipcRenderer = require('electron').ipcRenderer;

var closeEl = document.querySelector('#close');
closeEl.addEventListener('click', function () {
    ipcRenderer.send('close-main-window');
});

var request = require('request');
var fs = require('fs');
function getLinkandDownload(url,dest){
request(url, function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  
  let pattern = /(https:\/\/streaming-ondemand\.rtp\.pt\/)(.*)(index\.m3u8\?tlm=hls&streams=)(.*)\.mp4/;
  let matches = body.match(pattern);
  let link = matches[1] + matches[2] + matches[4] + ".mp4";
  
  
  download(link,dest,cb);
  
});

}
var download = function(link, dest, cb) {
  var file = fs.createWriteStream(dest);
  request.get(link).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  }).pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  
};


var cb = function(show){ console.log('done:',show);
};