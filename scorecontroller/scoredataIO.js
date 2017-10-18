var _ = require('lodash');
var filename = __dirname + '/../apps/diceMatrix/scorefile/score.json';
var scores = [];
var clients = 0;
var fs = require('fs');

//check file if empty, init, read txt file at server startup, split (filter name and score), push in array
var initScore = function (app, io) {
	fs.readFile(filename, "utf8", (err, data) => {
		if (err) {
			return console.log(err);
		}
		if (data !== "") {
			var dataArr = data.split("\n");
			scores = JSON.parse(dataArr);
		}
	});

	io.on('connection', function (socket) {

		console.log('new user connected');
		clients++;
		io.sockets.emit('broadcast', clients + "x Players connected");
		socket.on("message", function (msg) {
			io.sockets.emit("message", msg);
			var currentMode = {
				"x": msg.x,
				"y": msg.y
			};
			var topScore = [];
			//after adding new score entry, sort, limit and convert to text  
			scores.push({ 'x': msg.x, 'y': msg.y, 'name': msg.name, 'score': parseFloat(msg.score) });
			topScore = _.orderBy(scores, ['x', 'y', 'score'], ['asc', 'asc', 'desc']);
			scores = topScore;
			spliceData(topScore, currentMode, function (data) {
				arr2JSON(data, function (str) {
					str2Text(str);
				});
			});
		});
		socket.on("disconnect", function (msg) {
			clients--;
			io.sockets.emit('broadcast', clients + "x Players connected");
			console.log("disconnected");
		});
	});

	//strings from arr to single string
	var arr2JSON = function (top10, callback) {
		var textStr = "";
		callback(JSON.stringify(top10));
	}

	//single string to textfile
	var str2Text = function (jsonStr) {
		fs.writeFile(filename, jsonStr, function (err) {
			if (err) {
				return console.log(err);
			}
		});
	}

	//limit by 10 (topten) per mode/level, view via html table (client side)
	var spliceData = function (topScore, currentMode, callback) {
		var pos = 0;
		for (var i = 0; i < topScore.length; i++) {
			if (topScore[i].x === currentMode.x && topScore[i].y === currentMode.y) {
				if (0 === (pos + 1) % 11) {
					topScore.splice(i, 1);
				}
				pos++;
			}
		}
		callback(topScore);
	}
}
module.exports.initScore = initScore;