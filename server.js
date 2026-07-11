const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Ezzel az egy fájllal kiszolgáljuk a HTML-t is
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <body>
        <div id="chat" style="height:300px; overflow-y:scroll; border:1px solid #ccc;"></div>
        <input id="msg" type="text"><button onclick="send()">Küldés</button>
        <script src="/socket.io/socket.io.js"></script>
        <script>
            const socket = io();
            function send() {
                socket.emit('chat message', document.getElementById('msg').value);
                document.getElementById('msg').value = '';
            }
            socket.on('chat message', (msg) => {
                const div = document.createElement('div');
                div.textContent = msg;
                document.getElementById('chat').appendChild(div);
            });
        </script>
    </body>
    </html>
    `);
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => io.emit('chat message', msg));
});

http.listen(process.env.PORT || 3000, () => console.log('Fut a szerver!'));
