const Servers = require('./Servers/servers.js').Servers;
const fs = require('fs');
const server = new Servers('config.json', 'object');

server.tcp.on('connection', (socket) => { // при подключсении к серверу

	console.log(socket.address());
	socket.write("nickname");

	socket.on('connect', () => { // при подключении к сокету
		socket.setTimeout(server.config.timeout);
		socket.setEncoding('utf8');
	});

	socket.on('ready', () => { // при готовности сокета
		
	});

	socket.on('data', (data) => { // при получении данных
		console.log(data.toString("utf8"));
	});

	socket.on('end', () => { // при разрыве соединения клиентом
		console.log('Клиент разорвал соединение');
	});
	socket.on('error', (err) => {
		console.log('Ошибка сокета');
		console.error(err);
	});

	socket.on('close', (hadError) => { // при закрытии соединения
		if (hadError){
			console.log('Соединение закрыто из-за ошибки');
		}
		else {
			console.log('Соединение закрыто');
		}
	})
});

server.tcp.on('error', (err) => { // при ошибке сервера
	console.log(err);
});

server.tcp.on('close', () => { // при закрытии сервера сохраняем вайт и блек лист
	fs.writeFile(server.config.access, server.access, function (err_) {
		if (err_) {
			return console.error(err_);
		}
		console.log('Успешно сохранено');
	});
});

server.tcp.on("listening", () => {
	console.log('Слушает...');
});

server.createServers();