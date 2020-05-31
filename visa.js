var socketio = require("socket.io");
var io = socketio.listen(8472);
console.log('Socket listening on port 8472');

io.on('connect', onConnect);

function onConnect(socket) {
	io.emit('join');
	socket.on('comm', function(data) {
		console.log(">>>", data);
		if (data.command == "GET_DEVICE_LIST") {
	      	io.emit('comm', JSON.stringify(['USB:mock_connection_1', 'ETHERNET:mock_connection_2']));
		} else {
		    io.emit('comm', "Server: " + data.command);
		}
	});
}
