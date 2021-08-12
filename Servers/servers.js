const net = require('net');
const fs = require('fs');
const dgram = require('dgram');


module.exports.Servers = class Servers
{
	constructor(configPath = 'config.json', GBU = null)
	{
		this.tcp = net.createServer();
		this.udp = dgram.createSocket('udp4');
		this.config = JSON.parse(fs.readFileSync(configPath));
		this.access = JSON.parse(fs.readFileSync(this.config.access));

		if (GBU == 'array'){
			this.accessIsDenied = this.getArrayBannedUsers(this.access.isDenied);
		}
		else if (GBU == 'object'){
			this.accessIsDenied = this.getObjectBannedUsers(this.access.isDenied);
		}
		
		this.tcp.maxConnections = this.config.limit;
	}
	createServers()
	{
		this.createUdp(this.config.host, this.config.udpPort);
		this.createTcp(this.config.host, this.config.tcpPort);
	}
	createTcp(address = 'localhost', port = null){
		this.tcp.listen({
			address: address,
			port: port,
			exclusive: false
		});
	}
	createUdp(address = 'localhost', port = null){
		this.udp.bind({
			address: address,
			port: port,
			exclusive: false
		});
	}
	getObjectBannedUsers(array) {
		let object = {};
		array.forEach((item) => {
			object[item.nickname] = item.ip;
		});
		return object;
	}
	getArrayBannedUsers(arr) {
		let list = [];
		array.forEach((item) => {
			list.push({[item.nickname]: item.ip });
		});
		return list;
	}
}

