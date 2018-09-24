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

// Where to find the video in the file system that we will store in the DB
var videoPath = path.join(__dirname, './readFrom/myVideo.mp4');

// Connect GridFS and mongo
Grid.mongo = mongoose.mongo;

conn.once('open', () => {
	console.log('- Connection open -');
	var gfs = Grid(conn.db);

	// When connection is open, create write stream with
	// the name to store files as in the DB
	var writeStream = gfs.createWriteStream({
		// Will be store in mongo as 'intro-linux-security-db.mp4'
		filename: 'myVideo-db.mp4'
	});

	// Create a read-stream from where the video currently is (videoPath)
	// and pipe it into the database (through write-stream)
	fs.createReadStream(videoPath).pipe(writeStream);

	writeStream.on('close', (file) => {
		// Do something with 'file'
		// Console logging that it was written succesfully
		console.log(`${file.filename} was written to DB`);

	});
});