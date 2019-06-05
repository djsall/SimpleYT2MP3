const express 		= require('express');
const path 				= require('path');
const fs 					= require('fs');
const ytdl 				= require('ytdl-core');
const ffmpeg 			= require('fluent-ffmpeg');
const cors 				= require('cors');

const downloadPath = "C:/Users/DjSall/Documents/Code/js/ytdl/public/downloaded/"; //__dirname while deployed

const app = express();

let dlUrl = "";
let dlTitle = "";

app.use(cors());
app.listen(3000, () => console.log("app running..."));
app.use(express.static('public'));

app.get("/dlytvid", async(req, res, next) => {
	try {
	dlUrl = "";
	dlTitle = "";
	let url = req.query.URL;
	let title= await vidTitle(url);
	let file = downloadPath + title +'.mp3';

	let videoReadStream = ytdl(url);
	let proc = new ffmpeg({source:videoReadStream})
					.setFfmpegPath(path.resolve(__dirname, "ffmpeg/ffmpeg.exe"))
					.audioCodec('libmp3lame')
					.audioBitrate(320)
					.saveToFile(file)
					.on('end', (stdout, stderr)=> {
						console.log("Finished converting: "+title);
						dlUrl = url;
						dlTitle = title + ".mp3";
						res.json({Status: "Ready"})
							 .status(200);
					});
	}catch(err){
		next(err);
	}
});
app.get("/recytvid", (req, res)=>{
	let url = req.query.URL;
	if(url == dlUrl){
		res.download(__dirname+"/public/downloaded/"+dlTitle);
		console.log("Sent "+dlTitle);
	}else {
		console.error("Mismatch in download URL");
		res.status(404).json({Error: "Error occured while downloading. Please try again."});
	}
});
async function vidTitle(url){
	return new Promise((resolve, reject)=>{
		ytdl.getInfo(url, (err, info)=>{
			if(err) reject(err);
			let videoName = info.title.replace('|','').toString('ascii');
			console.log("Returning: "+videoName);
			return resolve(videoName);
		});
	})
}
