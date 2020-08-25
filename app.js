const express = require("express");
const app = express();
const socketio = require("socket.io");
const http = require("http");

const server = http.createServer(app);
const io = socketio(server);
const jsonParser = express.json();

var clicked = 0;

function getDate(){
    return Date(Date.now()).toString();
}

app.use(express.static(__dirname));

app.get("/", function(request, response){
    response.sendFile("index.html");
});

io.on("connection", function(socket){

    console.log(getDate()+" : user connected - "+socket.id);

    socket.on("click", function(){
        clicked++;
        io.emit("on_click", {body: "Clicked "+clicked+" times."});
    });

    socket.on("click_clb", function(data, callback){
        setTimeout(() => {
            callback({body: "Clicked "+clicked+" times. 3 secs passed."});
        }, 3000);
    });

    socket.on("disconnect", function(){
        console.log(getDate()+" : user disconncted - "+socket.id);
    });

});

// ВАЖНО для Socket.IO! Использовать именно ТАКУЮ строку: обратите внимание на 
// server вместо app и параметр порта
server.listen(process.env.PORT || 3000);