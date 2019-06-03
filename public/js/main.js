let convertBtn = document.getElementById("dl");
let URLinput = document.getElementById("URL-input");

let body = document.body.classList;
let messages = document.getElementById("messages");

convertBtn.addEventListener("click", () =>{
		sendURL(URLinput.value);
});
function fetchDl(URL){
	window.location.href = "http://localhost:3000/dl?URL="+URL;
}
function sendURL(URL){
	if(URL == "" || URL == undefined){
		messageString("The URL field shouldn't be empty!", "red");
	}else {
		messageString("Download started...", "green");
		fetch("http://localhost:3000/fetch?URL="+URL);
		timer();
	}
}
function timer(){
	var sec = 9;
	var timer = setInterval(function(){
			convertBtn.innerHTML='00:0'+sec;
			sec--;
			if (sec < 0) {
					clearInterval(timer);
					convertBtn.innerHTML = "Start";
					fetchDl(URLinput.value);
			}
	}, 1000);
}
function messageString(string, color){
	messages.innerHTML = string;
	if(color != "-red"){
		messages.classList.add(color);
	}else {
		messages.classList.remove("red");
	}
}
