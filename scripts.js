var memes = 0;
var mps = 0;
var mpc = 1;
var potato = 0;
var potato_cost = 100;
var meme_cost = 1000;
var meme_count = 0;
var skill_count = 0;
var skill_cost = 10000;
var discord_cost = 100000;
var discord_count = 0;
var pc_cost = 1000000;
var pc_count = 0;
var limp_cost = 10000000;
var limp_count = 0;

setInterval(function() {
	memes += mps;
	document.getElementById("total_memes").innerText = memes;
	document.getElementById("mps").innerText = mps;
}, 1000) 

setInterval (function() {
  document.getElementById("total_memes").innerText = abbreviateNumber(memes);
  document.getElementById("mps").innerText = abbreviateNumber(mps);
  document.getElementById("mpc").innerText = abbreviateNumber(mpc);
  document.getElementById("potato_count").innerText = abbreviateNumber(potato);
  document.getElementById("potato_cost").innerText = abbreviateNumber(potato_cost);
  document.getElementById("meme_cost").innerText = abbreviateNumber(meme_cost);
  document.getElementById("meme_count").innerText = abbreviateNumber(meme_count);
  document.getElementById("skill_cost").innerText = abbreviateNumber(skill_cost);
  document.getElementById("skill_count").innerText = abbreviateNumber(skill_count);
  document.getElementById("discord_cost").innerText = abbreviateNumber(discord_cost);
  document.getElementById("discord_count").innerText = abbreviateNumber(discord_count); 
}, 0)
setInterval (function() {
  saveGame();
}, 0)


function add_one() {
	memes += mpc;
	document.getElementById("total_memes").innerText = memes;
}
function dark_mode() {
   	var element = document.body;
   	element.classList.toggle("dark-mode");
	var element = document.getElementById("settings-menu");
	element.classList.toggle("dark-settings")
	var element = document.getElementById("user-login");
	element.classList.toggle("dark-login")
  localStorage.setItem("darkMode", element.classList.contains("dark-mode"));
}
function snackbar() {
  var x = document.getElementById("snackbar");
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}
function buy_potato() {
  if (memes >= potato_cost) {
    memes -= potato_cost;
    document.getElementById("total_memes").innerText = memes;  // Update this line
    potato++;
    document.getElementById("potato_count").innerText = potato;
    potato_cost += 50;
    document.getElementById("potato_cost").innerText = potato_cost;
    mps += 1;
    document.getElementById("mps").innerText = mps;
    mpc += 1;
    document.getElementById("mpc").innerText = mpc;
  } else {
    snackbar();
  }
}

function open_login() {
	document.getElementById('user-login').style.display='block';
	document.getElementById("overlay").style.display="block";
}
function cancel_login() {
	document.getElementById('user-login').style.display='none';
	document.getElementById("overlay").style.display="none";
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
	document.getElementById("settings-menu").style.display="block";
	document.getElementById("overlay").style.display="block";
}
function close_settings() {
	document.getElementById("settings-menu").style.display="none";
	document.getElementById("overlay").style.display="none";
}
function save_changes() {
	var x = document.getElementById("savechanges");
  	x.className = "show";
  	setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}
function start_buttons() {
	document.getElementById("meme-generator").disabled = true;
	document.getElementById("skill-boost").disabled = true;
	document.getElementById("discord-basement").disabled = true;
	document.getElementById("god-pc").disabled = true;
}
function buy_meme_generator() {
  if (memes >= meme_cost) {
    memes -= meme_cost;
    document.getElementById("total_memes").innerText = memes;
    meme_count++;
    document.getElementById("meme_count").innerText = meme_count;
    meme_cost += 100;
    document.getElementById("meme_cost").innerText = meme_cost;
    mps += 10;
    document.getElementById("mps").innerText = mps;
    mpc += 5;
    document.getElementById("mpc").innerText = mpc;
  } else {
    snackbar();
  }
}
function buy_skillboost() {
  if (memes >= skill_cost) {
    memes -= skill_cost;
    document.getElementById("total_memes").innerText = memes;
    skill_count++;
    document.getElementById("skill_count").innerText = skill_count;
    skill_cost += 1000;
    document.getElementById("skill_cost").innerText = skill_cost;
    mps += 100;
    document.getElementById("mps").innerText = mps;
    mpc += 50;
    document.getElementById("mpc").innerText = mpc;
  } else {
    snackbar();
  }
}
function buy_discordbasement() {
  if (memes >= discord_cost) {
    memes -= discord_cost;
    document.getElementById("total_memes").innerText = memes;
    discord_count++;
    document.getElementById("discord_count").innerText = discord_count;
    discord_cost += 10000;
    document.getElementById("discord_cost").innerText = discord_cost;
    mps += 1000;
    document.getElementById("mps").innerText = mps;
    mpc += 100;
    document.getElementById("mpc").innerText = mpc;
  } else {
    snackbar();
  }
}
function buy_godpc() {
  if (memes >= pc_cost) {
    memes -= pc_cost;
    document.getElementById("total_memes").innerText = memes;
    pc_count++;
    document.getElementById("pc_count").innerText = pc_count;
    pc_cost += 100000;
    document.getElementById("pc_cost").innerText = pc_cost;
    mps += 10000;
    document.getElementById("mps").innerText = mps;
    mpc += 500;
    document.getElementById("mpc").innerText = mpc;
  } else {
    snackbar();
  }
}
function buy_limp() {
  if (memes >= limp_cost) {
    memes -= limp_cost;
    document.getElementById("total_memes").innerText = memes;
    limp_count++;
    document.getElementById("limp_count").innerText = limp_count;
    limp_cost += 1000000;
    document.getElementById("limp_cost").innerText = limp_cost;
    mps += 100000;
    document.getElementById("mps").innerText = mps;
    mpc += 1000;
    document.getElementById("mpc").innerText = mpc;
  } else {
    snackbar();
  }
}
function saveGame() {
    localStorage.setItem("memes", memes);
    localStorage.setItem("mps", mps);
    localStorage.setItem("mpc", mpc);
    localStorage.setItem("potato", potato);
    localStorage.setItem("potato_cost", potato_cost);
    localStorage.setItem("meme_cost", meme_cost);
    localStorage.setItem("meme_count", meme_count);
    localStorage.setItem("skill_count", skill_count);
    localStorage.setItem("skill_cost", skill_cost);
    localStorage.setItem("discord_cost", discord_cost);
    localStorage.setItem("discord_count", discord_count);
    localStorage.setItem("pc_cost", pc_cost);
    localStorage.setItem("pc_count", pc_count);
    localStorage.setItem("selectedCursor", selectedCursor);
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
}


// Function to load the saved game progress
function loadGame() {
    memes = parseInt(localStorage.getItem("memes")) || memes;
    mps = parseInt(localStorage.getItem("mps")) || mps;
    mpc = parseInt(localStorage.getItem("mpc")) || mpc;
    potato = parseInt(localStorage.getItem("potato")) || potato;
    potato_cost = parseInt(localStorage.getItem("potato_cost")) || potato_cost;
    meme_cost = parseInt(localStorage.getItem("meme_cost")) || meme_cost;
    meme_count = parseInt(localStorage.getItem("meme_count")) || meme_count;
    skill_count = parseInt(localStorage.getItem("skill_count")) || skill_count;
    skill_cost = parseInt(localStorage.getItem("skill_cost")) || skill_cost;
    discord_cost = parseInt(localStorage.getItem("discord_cost")) || discord_cost;
    discord_count = parseInt(localStorage.getItem("discord_count")) || discord_count;
    pc_cost = parseInt(localStorage.getItem("pc_cost")) || pc_cost;
    pc_count = parseInt(localStorage.getItem("pc_count")) || pc_count;

    // Update the display with loaded values
    document.getElementById("total_memes").innerText = memes;
    document.getElementById("mps").innerText = mps;
    document.getElementById("mpc").innerText = mpc;
    document.getElementById("potato_count").innerText = potato;
    document.getElementById("potato_cost").innerText = potato_cost;
    document.getElementById("meme_cost").innerText = meme_cost;
    document.getElementById("meme_count").innerText = meme_count;
    document.getElementById("skill_cost").innerText = skill_cost;
    document.getElementById("skill_count").innerText = skill_count;
    document.getElementById("discord_cost").innerText = discord_cost;
    document.getElementById("discord_count").innerText = discord_count;
    document.getElementById("pc_cost").innerText = pc_cost;
    document.getElementById("pc_count").innerText = pc_count;

    var savedCursor = localStorage.getItem("cursor");
    if (savedCursor) {
        document.getElementById("cursors").value = savedCursor;
        changeCursor(); // Apply the saved cursor immediately
    }

    var darkModeStatus = localStorage.getItem("darkMode") === "true";
    if (darkModeStatus) {
        dark_mode(); // Enable dark mode if it was saved as on
    }
}

// Check if there is saved data and load it
if (localStorage.getItem("memes")) {
    loadGame();
}
function confirmWipeSave() {
    showConfirmationPopup();
}


// Function to wipe the save data
function wipeSaveData() {
    localStorage.clear();
    // Reset all variables to their initial values
    memes = 0;
    mps = 0;
    mpc = 1;
    potato = 0;
    potato_cost = 100;
    meme_cost = 1000;
    meme_count = 0;
    skill_count = 0;
    skill_cost = 10000;
    discord_cost = 100000;
    discord_count = 0;

    // Update the display with the reset values
    document.getElementById("total_memes").innerText = memes;
    document.getElementById("mps").innerText = mps;
    document.getElementById("mpc").innerText = mpc;
    document.getElementById("potato_count").innerText = potato;
    document.getElementById("potato_cost").innerText = potato_cost;
    document.getElementById("meme_cost").innerText = meme_cost;
    document.getElementById("meme_count").innerText = meme_count;
    document.getElementById("skill_cost").innerText = skill_cost;
    document.getElementById("skill_count").innerText = skill_count;
    document.getElementById("discord_cost").innerText = discord_cost;
    document.getElementById("discord_count").innerText = discord_count;

    // Close the settings menu after wiping save data
    close_settings();
    closeConfirmationPopup();
}
// Add these functions at the end of your JavaScript code

function showConfirmationPopup() {
    var confirmationPopup = document.getElementById('confirmation-popup');
    confirmationPopup.style.display = 'block';
}

function closeConfirmationPopup() {
    var confirmationPopup = document.getElementById('confirmation-popup');
    confirmationPopup.style.display = 'none';
}
function changeCursor() {
    var selectedCursor = document.getElementById("cursors").value;
    document.body.style.cursor = selectedCursor;
    // Save the selected cursor in local storage
    localStorage.setItem("selectedCursor", selectedCursor);
}

document.getElementById('cursors').addEventListener('change', changeCursor);
// Set the autosave interval (e.g., every 5 minutes)
var autosaveInterval = 5 * 60 * 1000; // 5 minutes in milliseconds

// Function to perform autosave
function autosave() {
    saveGame();
}

// Set up the autosave interval
var autosaveTimer = setInterval(autosave, autosaveInterval);

// Add a function to stop autosave when the page is closed or navigated away
window.addEventListener('beforeunload', function() {
    clearInterval(autosaveTimer);
});
// Function to abbreviate large numbers
function abbreviateNumber(number) {
    const abbreviations = ["", "K", "M", "B", "T", "Q", "QI", "S", "SP", "O", "N", "D", "UD", "DD", "TD", "QD", "QiD", "SD", "SPD", "OD", "ND", "V", "UV", "DV", "TV", "QV", "QiV", "SV", "SPV", "OV", "NV", "TT", "UT", "DT", "G", "QT"];

    let index = 0;
    while (number >= 1000) {
        number /= 1000;
        index++;
    }

    return number.toFixed(2) + abbreviations[index];
}

// Update the display with abbreviated values

