const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoDB_URI = 'mongodb://<dbuser>:<dbpassword>@dsxxxxxx.mlab.com:xxxxx/gridfsDB';

// Stablish mongoose database connection
mongoose.connect(mongoDB_URI);

const conn = mongoose.connection;
const path = require('path');

// Require GridFS
const Grid = require('gridfs-stream');
// Require files system module
const fs = require('fs');

// Connect GridFS and mongo
Grid.mongo = mongoose.mongo;

conn.once('open', () => {
	console.log('- Connection open -');
	var gfs = Grid(conn.db);

	// Write content from DB to the file system with
	// the whatever name you want (in this case, 'myVideo-from-db.mp4')
	var fs_write_stream = fs.createWriteStream(path.join(__dirname, './writeTo/myVideo-from-db.mp4'));

	// Create a read-stream from mongodb
	// in this case, finding the correct file by 'filename'
	// but could also find by _id, or other properties
	var readstream = gfs.createReadStream({
		filename: 'myVideo-db.mp4'
	});

	// pipe the read-stream in to the write stream 
	readstream.pipe(fs_write_stream);
	fs_write_stream.on('close', () => {
		console.log('File has been written fully!');
		// Checkout 'writeTo' folder to see it
	});
});