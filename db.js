mongoose = require('mongoose');

var connectionString='mongodb://localhost:27017/eventdb';
  
mongoose.connection.on('connecting', function() {
	console.log('=========> Connecting to MongoDB <==========');
});

mongoose.connection.on('error', function(error) {
	console.error('Error in MongoDb connection: ' + error);
	mongoose.disconnect();
});

mongoose.connection.on('connected', function() {
	console.log('==========> Connected to MongoDB <==========');
});

mongoose.connection.once('open', function() {
	console.log('==========> Connection opened to MongoDB <==========');
});

mongoose.connection.on('reconnected', function () {
	console.log('==========> Reconnected to MongoDB <==========');
});

mongoose.connection.on('disconnected', function() {
	console.log('==========> MongoDB disconnected <==========');
});

global.db = mongoose.connect(connectionString, {server:{auto_reconnect:true}});
global.mongoose = mongoose;
