var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var ent = require('ent');

app.use(express.static('public'));

server.listen(3000, function() {
    console.log('listening on *:3000');
});

app.get('/', function(req, res) {
    res.redirect("/index");
});

app.get('/index', function(req, res) {
    res.sendFile(path.join(__dirname, '/public', 'index.html'));
});

var nbrUsers = 0;

io.on('connection', function(socket) {
    var addUser = false;
    socket.on('new user', function(pseudo) {
        if (addUser) return;
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        nbrUsers++;
        addUser = true;
        socket.broadcast.emit('user login', { nbrUsers: nbrUsers });
        socket.broadcast.emit('user joined', { pseudo: socket.pseudo, nbrUsers: nbrUsers });
        console.log(pseudo + ' is connected');
        socket.on('disconnect', function() {
            if (addUser) {
                nbrUsers--;
                socket.broadcast.emit('quit', { pseudo: socket.pseudo, nbrUsers: nbrUsers });
                console.log(pseudo + ' is disconnected');
            }
        });
    });

    socket.on('typing', function() {
        socket.broadcast.emit('typing', { pseudo: socket.pseudo });
    });

    socket.on('stop typing', function() {
        socket.broadcast.emit('stop typing', { pseudo: socket.pseudo });
    });


    socket.on('chat message', function(msg) {
        msg = ent.encode(msg);
        socket.broadcast.emit('chat message', { pseudo: socket.pseudo, msg: msg });
        console.log(socket.pseudo + ' says ' + msg);
    });
});


// var bodyParser = require('body-parser');
// var fs = require('fs');
// var datajson = require('./data/articles.json')

// app.use(bodyParser.json())

// app.use(bodyParser.urlencoded({ extended: true }))



// app.get('/data', function(req, res) {
//     res.send(datajson);
// });

// app.post('/post/article', function(req, res) {
//     fs.readFile('./data/articles.json', 'utf-8', function(err, data) {
//         if (err) {
//             throw err
//         };
//         var database = JSON.parse(data)
//         var article = req.body;
//         console.log(article)
//         var len = database.articles.length;
//         // article.id = len + 1;

//         database.articles.push({ id: len + 1, titre: article.title, content: article.content });

//         var newDatabase = JSON.stringify(database, null, 2)

//         console.log(newDatabase);

//         fs.writeFile('./data/articles.json', newDatabase, function(err) {
//             if (err) {
//                 console.log(err)
//             }
//         });
//     });
//     res.send("article posté")
// });