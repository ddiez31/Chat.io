$(function() {
    var connected = false;
    var typing = false;
    var socket = io();
    var pseudo = prompt('Enter your pseudo');
    socket.emit('new user', pseudo);

    socket.on('chat message', function(data) {
        sendMsg(data.pseudo, data.msg);
    });

    socket.on('user joined', function() {
        $('#messages').prepend('<li><em>' + pseudo + ' is connected</em></li>');
    });

    socket.on('quit', function() {
        $('#messages').prepend('<li><em>' + pseudo + ' is disconnected</em></li>');
    });

    $('form').submit(function() {
        var msg = $('#m').val();
        socket.emit('chat message', msg);
        sendMsg(pseudo, msg);
        $('#m').val('').focus();
        return false;
    });

    // socket.on('chat message', function(msg) {
    //     $('#messages').append($('<li>').text(msg));
    // });

    function sendMsg(pseudo, msg) {
        $('#messages').prepend('<li><strong>' + pseudo + '</strong> says ' + msg + '</li>');
    };


});


// (function() {

// var app = {
//     init: function() {
//         this.data = "data/.json";
//         this.getJson(app.data);
//     },
//     getJson: function(data) {
//         $.ajax({
//             url: data,
//             success: this.success,
//             error: function(err) {
//                 if (err) {
//                     console.log(err);
//                 };
//             }
//         });
//     }
// }
// app.init();
// })();