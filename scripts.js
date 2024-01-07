var memes = 0;
var mps = 0;
var mpc = 1;
var potato = 0;
var potato_cost = 100;

setInterval(function() {
	memes += mps;
	document.getElementById("add_one").innerText = memes;
	document.getElementById("mps").innerText = mps;
}, 1000) 

function add_one() {
	memes += mpc;
	document.getElementById("add_one").innerText = memes;
}
function dark_mode() {
   var element = document.body;
   element.classList.toggle("dark-mode");
}
function snackbar() {
  var x = document.getElementById("snackbar");
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}
function buy_potato() {
  if (memes >= potato_cost) {
		memes -= potato_cost;
		document.getElementById("memes").innerText = memes;
		potato++;
		document.getElementById("potato_count").innerText = potato;
		potato_cost *= 1.1;
		document.getElementById("potato_cost").innerText = potato_cost;
		mps += 1;
		document.getElementById("mps").innerText = mps;	
    	mpc += 1;
		document.getElementById("mpc").innerText = mpc;
	}	else {
		snackbar() 
	}
}
function open_login() {
	document.getElementById('user-login').style.display='block'
}
function cancel_login() {
	document.getElementById('user-login').style.display='none'
}
function outside_click() {
	var modal = document.getElementById('user-login');
	window.onclick = function(event) {
    	if (event.target == modal) {
        	modal.style.display = "none";
    	}
	}
}
function open_settings() {
	document.getElementById("settings-menu").style.display="block"
}