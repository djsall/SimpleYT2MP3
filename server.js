const express 		= require('express');
const path 				= require('path');
const fs 					= require('fs');
const ytdl 				= require('ytdl-core');
const ffmpeg 			= require('fluent-ffmpeg');
const cors 				= require('cors');

const downloadPath = "C:/Users/DjSall/Documents/Code/js/ytdl/downloaded/"; //__dirname while deployed
const convertPath = "C:/Users/DjSall/Documents/Code/js/ytdl/converted/"; //__dirname while deployed

const app = express();

let dlUrl = "";
let dlTitle = "";
let completed = false;

app.use(cors());
app.listen(3000, () => console.log("app running..."));
app.use(express.static('public'));

app.get("/fetch", (req, res, next) => {
	let url = req.query.URL;
	downloadAudio(url);
});
app.get("/dl", (req, res) => {
	let url = req.query.URL;
	if(url == dlUrl){
		res.download(__dirname+"/converted/"+dlTitle);
	}else {
		console.log("Mismatch in download URL");
		res.status(404).json({Error: "Error occured while downloading. Please try again."});
	}
});

function downloadAudio(url) {
	completed = false;
	ytdl.getInfo(url, (err, info) => {
		var title = info.title;
		let filename = title + ".mp4";
		let outputName  = title + ".mp3";
		let inputPath =  downloadPath+ filename;
		let outputPath = convertPath + outputName;
		dlUrl = url;
		dlTitle = outputName;
		ytdl(url, {
			filter: (format) => format.container === "mp4"
		})
			.pipe(fs.createWriteStream("downloaded/"+filename))
			.on('finish', ()=> {
				console.log("Downloaded: " + title);
				let proc = new ffmpeg({source:inputPath})
				.setFfmpegPath(path.resolve(__dirname, "ffmpeg/ffmpeg.exe"))
				.toFormat('mp3')
				.saveToFile(outputPath)
				.on('end', ()=> {
					console.log("Converted "+title);
					completed = true;
					return outputPath;
				});
			})
	});

	}
