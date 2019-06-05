(()=>{

let convertBtn = document.getElementById("dl");
let URLinput = document.getElementById("URL-input");

const domain = "localhost:3000"

let body = document.body.classList;
let messages = document.getElementById("messages");

convertBtn.addEventListener("click", () =>{
	sendURL(URLinput.value);
});
async function sendURL(dlURL){
	if(dlURL == "" || dlURL == undefined){
		messageString("The URL field shouldn't be empty!", "red");
	}else {
		let assembledURL = "http://" + domain + "/dlytvid?URL="+dlURL;
		let fileURL = "http://" + domain + "/recytvid?URL="+dlURL;
		messageString("Download in progress...", "green");
		fetch(assembledURL)
		.then((response)=>{
			return response.json();
		})
		.then((myJson)=>{
			if(myJson.Status == "Ready"){
				window.location.href = fileURL;
				messageString("Download completed.", "green");
				timer(2);
			}
		});
	}
}
function messageString(string, color){
	messages.innerHTML = string;
	if(color != "-"){
		messages.classList.add(color);
	}else {
		messages.classList.remove("red");
		messages.classList.remove("green");
	}
}
function timerDoOnExpire(){
	messageString("", "-");
	URLinput.value = "";
}
function timer(sec){
	let timeLeft = sec;
	let countDown = setInterval(()=>{
		timeLeft--;
		if(timeLeft <= 0){
			timerDoOnExpire();
			clearInterval(countDown);
		}
	}, 1000);
}
})();
