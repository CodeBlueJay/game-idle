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
  document.getElementById("potato_count").innerText = formatCount(potato);
  document.getElementById("potato_cost").innerText = abbreviateNumber(potato_cost);
  document.getElementById("meme_cost").innerText = abbreviateNumber(meme_cost);
  document.getElementById("meme_count").innerText = formatCount(meme_count);
  document.getElementById("skill_cost").innerText = abbreviateNumber(skill_cost);
  document.getElementById("skill_count").innerText = formatCount(skill_count);
  document.getElementById("discord_cost").innerText = abbreviateNumber(discord_cost);
  document.getElementById("discord_count").innerText = formatCount(discord_count);
  document.getElementById("pc_cost").innerText = abbreviateNumber(pc_cost);
  document.getElementById("pc_count").innerText = formatCount(pc_count);
  document.getElementById("limp_cost").innerText = abbreviateNumber(limp_cost);
  document.getElementById("limp_count").innerText = formatCount(limp_count);
  update_buy_buttons();
}, 100) // was 0ms (i.e. as fast as the browser would allow) — 100ms is
        // still instant-feeling and far less wasteful on CPU/battery.
setInterval (function() {
  saveGame();
}, 10000) // every 10s — was 0ms (i.e. constantly) before, which is fine for
          // localStorage but would spam Supabase with requests non-stop.

// Whole numbers only (no decimals) — used for "owned" counts, since
// fractional/decimal-looking counts (e.g. "3.00") read oddly for something
// you can only ever own a whole number of.
function formatCount(number) {
    return Math.floor(number).toLocaleString();
}

// Disables a shop's Buy button unless the player can currently afford it.
// This replaces the old start_buttons() behavior, which permanently
// disabled four of the six buttons at page load and never re-enabled them
// regardless of affordability — while the other two (Potato Computer and
// L.I.M.P.) were never included at all, so they stayed clickable no matter
// what the player could actually afford.
function update_buy_buttons() {
    var shopButtons = [
        { id: "potato", cost: potato_cost },
        { id: "meme-generator", cost: meme_cost },
        { id: "skill-boost", cost: skill_cost },
        { id: "discord-basement", cost: discord_cost },
        { id: "god-pc", cost: pc_cost },
        { id: "limp", cost: limp_cost },
    ];
    shopButtons.forEach(function (item) {
        var button = document.getElementById(item.id);
        if (button) {
            button.disabled = memes < item.cost;
        }
    });
}


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
    document.getElementById("potato_count").innerText = formatCount(potato);
    potato_cost += 50;
    document.getElementById("potato_cost").innerText = potato_cost;
    mps += 1;
    document.getElementById("mps").innerText = mps;
    mpc += 1;
    document.getElementById("mpc").innerText = mpc;
    update_buy_buttons();
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
	update_buy_buttons();
}
function buy_meme_generator() {
  if (memes >= meme_cost) {
    memes -= meme_cost;
    document.getElementById("total_memes").innerText = memes;
    meme_count++;
    document.getElementById("meme_count").innerText = formatCount(meme_count);
    meme_cost += 100;
    document.getElementById("meme_cost").innerText = meme_cost;
    mps += 10;
    document.getElementById("mps").innerText = mps;
    mpc += 5;
    document.getElementById("mpc").innerText = mpc;
    update_buy_buttons();
  } else {
    snackbar();
  }
}
function buy_skillboost() {
  if (memes >= skill_cost) {
    memes -= skill_cost;
    document.getElementById("total_memes").innerText = memes;
    skill_count++;
    document.getElementById("skill_count").innerText = formatCount(skill_count);
    skill_cost += 1000;
    document.getElementById("skill_cost").innerText = skill_cost;
    mps += 100;
    document.getElementById("mps").innerText = mps;
    mpc += 50;
    document.getElementById("mpc").innerText = mpc;
    update_buy_buttons();
  } else {
    snackbar();
  }
}
function buy_discordbasement() {
  if (memes >= discord_cost) {
    memes -= discord_cost;
    document.getElementById("total_memes").innerText = memes;
    discord_count++;
    document.getElementById("discord_count").innerText = formatCount(discord_count);
    discord_cost += 10000;
    document.getElementById("discord_cost").innerText = discord_cost;
    mps += 1000;
    document.getElementById("mps").innerText = mps;
    mpc += 100;
    document.getElementById("mpc").innerText = mpc;
    update_buy_buttons();
  } else {
    snackbar();
  }
}
function buy_godpc() {
  if (memes >= pc_cost) {
    memes -= pc_cost;
    document.getElementById("total_memes").innerText = memes;
    pc_count++;
    document.getElementById("pc_count").innerText = formatCount(pc_count);
    pc_cost += 100000;
    document.getElementById("pc_cost").innerText = pc_cost;
    mps += 10000;
    document.getElementById("mps").innerText = mps;
    mpc += 500;
    document.getElementById("mpc").innerText = mpc;
    update_buy_buttons();
  } else {
    snackbar();
  }
}
function buy_limp() {
  if (memes >= limp_cost) {
    memes -= limp_cost;
    document.getElementById("total_memes").innerText = memes;
    limp_count++;
    document.getElementById("limp_count").innerText = formatCount(limp_count);
    limp_cost += 1000000;
    document.getElementById("limp_cost").innerText = limp_cost;
    mps += 100000;
    document.getElementById("mps").innerText = mps;
    mpc += 1000;
    document.getElementById("mpc").innerText = mpc;
    update_buy_buttons();
  } else {
    snackbar();
  }
}
function saveGame() {
    // Progress only persists with an account — without this, buying
    // items/clicking still works for the current tab, but nothing survives
    // a reload. manual_save_click() below shows a message explaining this
    // when someone hits the Save button while logged out.
    if (typeof currentUser === "undefined" || !currentUser) {
        return;
    }

    var nowTimestamp = Date.now();

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
    localStorage.setItem("limp_cost", limp_cost);
    localStorage.setItem("limp_count", limp_count);
    localStorage.setItem("selectedCursor", selectedCursor);
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
    localStorage.setItem("updatedAt", nowTimestamp.toString());

    saveGameToCloud({
        memes: memes,
        mps: mps,
        mpc: mpc,
        potato: potato,
        potato_cost: potato_cost,
        meme_cost: meme_cost,
        meme_count: meme_count,
        skill_cost: skill_cost,
        skill_count: skill_count,
        discord_cost: discord_cost,
        discord_count: discord_count,
        pc_cost: pc_cost,
        pc_count: pc_count,
        limp_cost: limp_cost,
        limp_count: limp_count,
        selected_cursor: localStorage.getItem("selectedCursor") || "none",
        dark_mode: document.body.classList.contains("dark-mode"),
    }).catch(function (err) {
        console.error("Cloud save failed:", err);
    });
}

// Wrapper for the manual Save button in Settings — same as saveGame(),
// but explains itself instead of silently doing nothing when logged out.
function manual_save_click() {
    if (typeof currentUser === "undefined" || !currentUser) {
        alert("Create an account to save your progress! Without one, your game will reset when you reload the page.");
        return;
    }
    saveGame();
    save_changes();
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
    limp_cost = parseInt(localStorage.getItem("limp_cost")) || limp_cost;
    limp_count = parseInt(localStorage.getItem("limp_count")) || limp_count;

    // Update the display with loaded values
    document.getElementById("total_memes").innerText = memes;
    document.getElementById("mps").innerText = mps;
    document.getElementById("mpc").innerText = mpc;
    document.getElementById("potato_count").innerText = formatCount(potato);
    document.getElementById("potato_cost").innerText = potato_cost;
    document.getElementById("meme_cost").innerText = meme_cost;
    document.getElementById("meme_count").innerText = formatCount(meme_count);
    document.getElementById("skill_cost").innerText = skill_cost;
    document.getElementById("skill_count").innerText = formatCount(skill_count);
    document.getElementById("discord_cost").innerText = discord_cost;
    document.getElementById("discord_count").innerText = formatCount(discord_count);
    document.getElementById("pc_cost").innerText = pc_cost;
    document.getElementById("pc_count").innerText = formatCount(pc_count);
    document.getElementById("limp_cost").innerText = limp_cost;
    document.getElementById("limp_count").innerText = formatCount(limp_count);
    update_buy_buttons();

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
try {
    if (localStorage.getItem("memes")) {
        loadGame();
    }
} catch (err) {
    console.error("loadGame() failed:", err);
}
function confirmWipeSave() {
    showConfirmationPopup(
        "Are you sure you want to wipe your save data? This action cannot be undone.",
        "Yes, Wipe Data",
        wipeSaveData
    );
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
    pc_cost = 1000000;
    pc_count = 0;
    limp_cost = 10000000;
    limp_count = 0;

    // Update the display with the reset values
    document.getElementById("total_memes").innerText = memes;
    document.getElementById("mps").innerText = mps;
    document.getElementById("mpc").innerText = mpc;
    document.getElementById("potato_count").innerText = formatCount(potato);
    document.getElementById("potato_cost").innerText = potato_cost;
    document.getElementById("meme_cost").innerText = meme_cost;
    document.getElementById("meme_count").innerText = formatCount(meme_count);
    document.getElementById("skill_cost").innerText = skill_cost;
    document.getElementById("skill_count").innerText = formatCount(skill_count);
    document.getElementById("discord_cost").innerText = discord_cost;
    document.getElementById("discord_count").innerText = formatCount(discord_count);
    document.getElementById("pc_cost").innerText = pc_cost;
    document.getElementById("pc_count").innerText = formatCount(pc_count);
    document.getElementById("limp_cost").innerText = limp_cost;
    document.getElementById("limp_count").innerText = formatCount(limp_count);
    update_buy_buttons();

    // Close the settings menu after wiping save data
    close_settings();
    closeConfirmationPopup();
}
// Add these functions at the end of your JavaScript code

var confirmationCallback = null;

function showConfirmationPopup(text, confirmLabel, callback) {
    document.getElementById('confirmation-popup-text').innerText = text || "Are you sure?";
    document.getElementById('confirmation-popup-confirm-btn').innerText = confirmLabel || "Yes";
    confirmationCallback = callback;
    var confirmationPopup = document.getElementById('confirmation-popup');
    confirmationPopup.style.display = 'block';
}

function runConfirmationCallback() {
    var cb = confirmationCallback;
    closeConfirmationPopup();
    if (typeof cb === "function") cb();
}

function closeConfirmationPopup() {
    var confirmationPopup = document.getElementById('confirmation-popup');
    confirmationPopup.style.display = 'none';
    confirmationCallback = null;
}
function changeCursor() {
    var selectedCursor = document.getElementById("cursors").value;
    document.body.style.cursor = selectedCursor;
    // Save the selected cursor in local storage
    localStorage.setItem("selectedCursor", selectedCursor);
}

try {
    document.getElementById('cursors').addEventListener('change', changeCursor);
} catch (err) {
    console.error("Cursor listener setup failed:", err);
}
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

// ============================================================
// Supabase-backed accounts, cross-device saves, chat, leaderboard
// ============================================================

// Called by supabase-client.js whenever a user signs in (or a session
// is restored on page load). Overwrites local state with their cloud save.
window.onGameLoaded = function (save) {
    if (!save) return;

    // If localStorage holds a save newer than what's actually in the
    // cloud, that almost always means a previous cloud save didn't
    // finish (e.g. the tab closed mid-request) — not that local progress
    // should be thrown away. In that case, keep what's already loaded
    // in memory/localStorage and push it back up to resync the cloud,
    // instead of overwriting it with the stale cloud copy.
    var localUpdatedAt = parseInt(localStorage.getItem("updatedAt")) || 0;
    var cloudUpdatedAt = save.updated_at ? new Date(save.updated_at).getTime() : 0;
    if (localUpdatedAt > cloudUpdatedAt) {
        saveGame();
        cancel_login();
        return;
    }

    memes = Number(save.memes) || 0;
    mps = Number(save.mps) || 0;
    mpc = Number(save.mpc) || 1;
    potato = save.potato || 0;
    potato_cost = Number(save.potato_cost) || 100;
    meme_cost = Number(save.meme_cost) || 1000;
    meme_count = save.meme_count || 0;
    skill_cost = Number(save.skill_cost) || 10000;
    skill_count = save.skill_count || 0;
    discord_cost = Number(save.discord_cost) || 100000;
    discord_count = save.discord_count || 0;
    pc_cost = Number(save.pc_cost) || 1000000;
    pc_count = save.pc_count || 0;
    limp_cost = Number(save.limp_cost) || 10000000;
    limp_count = save.limp_count || 0;

    document.getElementById("total_memes").innerText = abbreviateNumber(memes);
    document.getElementById("mps").innerText = abbreviateNumber(mps);
    document.getElementById("mpc").innerText = abbreviateNumber(mpc);
    document.getElementById("potato_count").innerText = formatCount(potato);
    document.getElementById("potato_cost").innerText = abbreviateNumber(potato_cost);
    document.getElementById("meme_cost").innerText = abbreviateNumber(meme_cost);
    document.getElementById("meme_count").innerText = formatCount(meme_count);
    document.getElementById("skill_cost").innerText = abbreviateNumber(skill_cost);
    document.getElementById("skill_count").innerText = formatCount(skill_count);
    document.getElementById("discord_cost").innerText = abbreviateNumber(discord_cost);
    document.getElementById("discord_count").innerText = formatCount(discord_count);
    document.getElementById("pc_cost").innerText = abbreviateNumber(pc_cost);
    document.getElementById("pc_count").innerText = formatCount(pc_count);
    document.getElementById("limp_cost").innerText = abbreviateNumber(limp_cost);
    document.getElementById("limp_count").innerText = formatCount(limp_count);
    update_buy_buttons();

    if (save.dark_mode && !document.body.classList.contains("dark-mode")) {
        dark_mode();
    }

    var loginLink = document.getElementById("account-btn-label");
    if (loginLink) loginLink.innerText = save.username;

    cancel_login();
};

window.onSignedOut = function () {
    var loginLink = document.getElementById("account-btn-label");
    if (loginLink) loginLink.innerText = "Login";
};

// --- Login form wiring (replaces the old accounts.php POST) ---

var loginForm = document.querySelector("#user-login form");
var isSignupMode = false;

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var statusEl = document.getElementById("login-status");
        statusEl.style.display = "none";

        var username = loginForm.uname.value.trim();
        var password = loginForm.passw.value;

        if (!username) {
            statusEl.textContent = "Please enter a username.";
            statusEl.style.display = "block";
            return;
        }

        if (isSignupMode && !/^[A-Za-z0-9_ ]{3,20}$/.test(username)) {
            statusEl.textContent = "Username must be 3-20 characters: letters, numbers, spaces, or underscores only.";
            statusEl.style.display = "block";
            return;
        }

        if (typeof signIn !== "function" || typeof signUp !== "function") {
            statusEl.textContent = "Supabase isn't loaded. Check the console for details.";
            statusEl.style.display = "block";
            return;
        }

        var action = isSignupMode
            ? signUp(username, password)
            : signIn(username, password);

        action
            .then(function (result) {
                if (isSignupMode && !result.session) {
                    // Supabase's default setting requires confirming an email
                    // before a session is created. Since accounts here don't
                    // use a real email, this must be turned off in your
                    // Supabase project (Authentication -> Sign In / Providers
                    // -> Email -> disable "Confirm email").
                    statusEl.textContent = "Account created, but couldn't log you in automatically. Ask the site owner to disable email confirmation in Supabase, then try logging in.";
                    statusEl.style.display = "block";
                    isSignupMode = false;
                    document.querySelector("#user-login .login_button").innerText = "Login";
                    document.querySelector("#user-login .signup").innerText = "Create Account";
                    return;
                }
                cancel_login();
            })
            .catch(function (err) {
                statusEl.textContent = err.message;
                statusEl.style.display = "block";
            });
    });
} else {
    console.error("Login form wiring failed: #user-login form not found in the page.");
}

function toggle_signup_mode() {
    isSignupMode = !isSignupMode;
    document.querySelector("#user-login .login_button").innerText = isSignupMode ? "Create Account" : "Login";
    document.querySelector("#user-login .signup").innerText = isSignupMode ? "Back to Login" : "Create Account";
    document.getElementById("login-status").style.display = "none";
}

function do_logout() {
    signOutUser();
}

// --- Chat ---

function open_chat() {
    document.getElementById("chat-panel").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    loadRecentMessages().then(function (messages) {
        var list = document.getElementById("chat-messages");
        list.innerHTML = "";
        messages.forEach(appendChatMessage);
        list.scrollTop = list.scrollHeight;
    });
}

function close_chat() {
    document.getElementById("chat-panel").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function appendChatMessage(msg) {
    var list = document.getElementById("chat-messages");
    var line = document.createElement("div");

    var nameLink = document.createElement("span");
    nameLink.className = "profile-link";
    nameLink.textContent = msg.username;
    nameLink.addEventListener("click", function () {
        open_profile(msg.username);
    });

    line.appendChild(nameLink);
    line.appendChild(document.createTextNode(": " + msg.content));

    list.appendChild(line);
    list.scrollTop = list.scrollHeight;
}

function submit_chat_message() {
    var input = document.getElementById("chat-input");
    if (!input.value.trim()) return;
    if (!currentUser) {
        alert("Log in to chat.");
        return;
    }
    sendChatMessage(input.value.trim())
        .then(function () {
            input.value = "";
        })
        .catch(function (err) {
            alert(err.message);
        });
}

// Live updates for everyone with the chat open
subscribeToChat(function (msg) {
    if (document.getElementById("chat-panel").style.display === "block") {
        appendChatMessage(msg);
    }
});

// --- Leaderboard ---

function open_leaderboard() {
    document.getElementById("leaderboard-panel").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    getLeaderboard(20).then(function (rows) {
        var list = document.getElementById("leaderboard-list");
        list.innerHTML = "";
        rows.forEach(function (row, i) {
            var line = document.createElement("div");

            var rank = document.createElement("span");
            rank.textContent = (i + 1) + ". ";

            var nameLink = document.createElement("span");
            nameLink.className = "profile-link";
            nameLink.textContent = row.username;
            nameLink.addEventListener("click", function () {
                open_profile(row.username);
            });

            var score = document.createElement("span");
            score.textContent = " — " + abbreviateNumber(Number(row.memes)) + " memes";

            line.appendChild(rank);
            line.appendChild(nameLink);
            line.appendChild(score);
            list.appendChild(line);
        });
    });
}

function close_leaderboard() {
    document.getElementById("leaderboard-panel").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// --- Gamble ---

var GAMBLE_TIERS = {
    safe:    { chance: 0.55, payout: 1.8,  label: "Safe" },
    risky:   { chance: 0.30, payout: 3.5,  label: "Risky" },
    jackpot: { chance: 0.08, payout: 12,   label: "Jackpot" },
};

function open_gamble() {
    document.getElementById("gamble-panel").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    document.getElementById("gamble-balance").innerText = abbreviateNumber(memes);
    document.getElementById("gamble-result").innerText = "";
    document.getElementById("gamble-result").className = "";
}

function close_gamble() {
    document.getElementById("gamble-panel").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function set_max_bet() {
    document.getElementById("gamble-bet").value = Math.floor(memes);
}

function place_bet(tierName) {
    var resultEl = document.getElementById("gamble-result");
    var betInput = document.getElementById("gamble-bet");
    var bet = Math.floor(Number(betInput.value));
    var tier = GAMBLE_TIERS[tierName];

    if (!bet || bet <= 0) {
        resultEl.innerText = "Enter a bet amount first.";
        resultEl.className = "lose";
        return;
    }
    if (bet > memes) {
        resultEl.innerText = "You don't have that many memes.";
        resultEl.className = "lose";
        return;
    }

    memes -= bet;

    var won = Math.random() < tier.chance;
    if (won) {
        var payout = Math.floor(bet * tier.payout);
        memes += payout;
        resultEl.innerText = tier.label + " bet won! +" + abbreviateNumber(payout) + " memes.";
        resultEl.className = "win";
    } else {
        resultEl.innerText = tier.label + " bet lost. -" + abbreviateNumber(bet) + " memes.";
        resultEl.className = "lose";
    }

    document.getElementById("total_memes").innerText = abbreviateNumber(memes);
    document.getElementById("gamble-balance").innerText = abbreviateNumber(memes);
    betInput.value = "";
    saveGame();
}

// --- People List ---

function open_people_list() {
    document.getElementById("people-list-panel").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    var list = document.getElementById("people-list");
    list.innerHTML = "Loading...";

    getAllPlayers(200)
        .then(function (rows) {
            list.innerHTML = "";
            if (!rows.length) {
                list.innerHTML = "No players yet.";
                return;
            }
            rows.forEach(function (row) {
                var line = document.createElement("div");
                line.className = "profile-link";
                line.textContent = row.username;
                line.addEventListener("click", function () {
                    open_profile(row.username);
                });
                list.appendChild(line);
            });
        })
        .catch(function (err) {
            list.innerText = err.message;
        });
}

function close_people_list() {
    document.getElementById("people-list-panel").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// --- Profile ---

var viewingOwnProfile = false;
var selectedEditAvatar = "🐸";
var DEFAULT_BIO_PLACEHOLDER_SELF = "Add a bio to tell people about yourself.";
var DEFAULT_BIO_PLACEHOLDER_OTHER = "This player hasn't written a bio yet.";

function get_my_username() {
    return currentUser && currentUser.user_metadata && currentUser.user_metadata.username;
}

function open_own_profile() {
    if (!currentUser) {
        open_login();
        return;
    }
    var username = get_my_username() || document.getElementById("account-btn-label").innerText;
    open_profile(username);
}

function open_profile(username) {
    document.getElementById("profile-panel").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    document.getElementById("profile-view").style.display = "block";
    document.getElementById("profile-edit").style.display = "none";

    document.getElementById("profile-username").innerText = username;
    document.getElementById("profile-avatar").innerText = "…";
    document.getElementById("profile-bio").innerText = "";
    document.getElementById("profile-memes").innerText = "0";
    var statusEl = document.getElementById("profile-status");
    statusEl.style.display = "none";

    var myUsername = get_my_username();
    viewingOwnProfile = !!(myUsername && myUsername.toLowerCase() === username.toLowerCase());
    document.getElementById("profile-edit-btn").style.display = viewingOwnProfile ? "inline-block" : "none";

    if (typeof getProfile !== "function") {
        statusEl.innerText = "Supabase isn't loaded. Check the console for details.";
        statusEl.style.display = "block";
        return;
    }

    getProfile(username)
        .then(function (profile) {
            if (!profile) {
                document.getElementById("profile-bio").innerText = "This player couldn't be found.";
                document.getElementById("profile-avatar").innerText = "❔";
                return;
            }
            document.getElementById("profile-username").innerText = profile.username;
            document.getElementById("profile-avatar").innerText = profile.avatar_emoji || "🐸";
            document.getElementById("profile-bio").innerText =
                profile.bio || (viewingOwnProfile ? DEFAULT_BIO_PLACEHOLDER_SELF : DEFAULT_BIO_PLACEHOLDER_OTHER);
            document.getElementById("profile-memes").innerText = abbreviateNumber(Number(profile.memes) || 0);
        })
        .catch(function (err) {
            statusEl.innerText = err.message;
            statusEl.style.display = "block";
        });
}

function close_profile() {
    document.getElementById("profile-panel").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function enter_profile_edit_mode() {
    var currentBioText = document.getElementById("profile-bio").innerText;
    var isPlaceholder = currentBioText === DEFAULT_BIO_PLACEHOLDER_SELF || currentBioText === DEFAULT_BIO_PLACEHOLDER_OTHER;

    selectedEditAvatar = document.getElementById("profile-avatar").innerText;
    document.getElementById("profile-bio-input").value = isPlaceholder ? "" : currentBioText;
    highlight_selected_avatar();

    document.getElementById("profile-view").style.display = "none";
    document.getElementById("profile-edit").style.display = "block";
}

function cancel_profile_edit() {
    document.getElementById("profile-edit").style.display = "none";
    document.getElementById("profile-view").style.display = "block";
}

function select_avatar(emoji) {
    selectedEditAvatar = emoji;
    highlight_selected_avatar();
}

function highlight_selected_avatar() {
    var options = document.querySelectorAll("#emoji-picker .emoji-option");
    for (var i = 0; i < options.length; i++) {
        var btn = options[i];
        if (btn.getAttribute("data-emoji") === selectedEditAvatar) {
            btn.classList.add("selected");
        } else {
            btn.classList.remove("selected");
        }
    }
}

function save_profile_edits() {
    var bio = document.getElementById("profile-bio-input").value.trim();
    var statusEl = document.getElementById("profile-edit-status");
    statusEl.style.display = "none";

    if (typeof updateProfile !== "function") {
        statusEl.innerText = "Supabase isn't loaded. Check the console for details.";
        statusEl.style.display = "block";
        return;
    }

    updateProfile({ bio: bio, avatar_emoji: selectedEditAvatar })
        .then(function () {
            document.getElementById("profile-bio").innerText = bio || DEFAULT_BIO_PLACEHOLDER_SELF;
            document.getElementById("profile-avatar").innerText = selectedEditAvatar;
            cancel_profile_edit();
        })
        .catch(function (err) {
            statusEl.innerText = err.message;
            statusEl.style.display = "block";
        });
}

// Wire up the emoji picker buttons once at load
try {
    var emojiButtons = document.querySelectorAll("#emoji-picker .emoji-option");
    for (var e = 0; e < emojiButtons.length; e++) {
        (function (btn) {
            btn.addEventListener("click", function () {
                select_avatar(btn.getAttribute("data-emoji"));
            });
        })(emojiButtons[e]);
    }
} catch (err) {
    console.error("Emoji picker setup failed:", err);
}

// --- Friends ---

function require_login_for_socials(panelName) {
    if (typeof currentUser === "undefined" || !currentUser) {
        alert("Log in to use " + panelName + ".");
        return true;
    }
    if (typeof sendFriendRequest !== "function") {
        alert("Supabase isn't loaded. Check the console for details.");
        return true;
    }
    return false;
}

function open_friends() {
    if (require_login_for_socials("Friends")) return;
    document.getElementById("friends-panel").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    refresh_friends_panel();
}

function close_friends() {
    document.getElementById("friends-panel").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function build_social_row(entry, actions) {
    var row = document.createElement("div");
    row.className = "social-row";

    var left = document.createElement("span");
    left.className = "profile-link";
    left.textContent = (entry.avatar_emoji ? entry.avatar_emoji + " " : "") + entry.username;
    left.addEventListener("click", function () {
        open_profile(entry.username);
    });
    row.appendChild(left);

    var actionsWrap = document.createElement("span");
    actionsWrap.className = "social-row-actions";
    actions.forEach(function (action) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = action.className || "cancelbtn";
        btn.textContent = action.label;
        btn.addEventListener("click", action.onClick);
        actionsWrap.appendChild(btn);
    });
    row.appendChild(actionsWrap);

    return row;
}

function fill_social_list(elementId, items, emptyMessage, rowBuilder) {
    var container = document.getElementById(elementId);
    container.innerHTML = "";
    if (!items.length) {
        var empty = document.createElement("p");
        empty.className = "social-empty";
        empty.textContent = emptyMessage;
        container.appendChild(empty);
        return;
    }
    items.forEach(function (item) {
        container.appendChild(rowBuilder(item));
    });
}

function refresh_friends_panel() {
    getIncomingFriendRequests()
        .then(function (requests) {
            fill_social_list("friend-requests-list", requests, "No pending requests.", function (req) {
                return build_social_row(req, [
                    { label: "Accept", className: "login_button", onClick: function () { respond_to_request(req.id, true); } },
                    { label: "Decline", className: "cancelbtn", onClick: function () { respond_to_request(req.id, false); } },
                ]);
            });
        })
        .catch(function (err) { console.error(err); });

    getSentFriendRequests()
        .then(function (sent) {
            fill_social_list("friend-sent-list", sent, "No sent requests.", function (req) {
                return build_social_row(req, [
                    { label: "Cancel", className: "cancelbtn", onClick: function () { cancel_sent_request(req.id); } },
                ]);
            });
        })
        .catch(function (err) { console.error(err); });

    getFriendsList()
        .then(function (friends) {
            fill_social_list("friends-list", friends, "No friends yet.", function (friend) {
                return build_social_row(friend, [
                    { label: "Remove", className: "cancelbtn", onClick: function () { remove_friend(friend.id); } },
                ]);
            });
        })
        .catch(function (err) { console.error(err); });
}

function send_friend_request() {
    var input = document.getElementById("friend-username-input");
    var statusEl = document.getElementById("friend-add-status");
    var username = input.value.trim();
    statusEl.style.display = "none";

    if (!username) return;

    sendFriendRequest(username)
        .then(function (result) {
            statusEl.textContent = result.autoAccepted
                ? "You're now friends with " + result.username + "!"
                : "Friend request sent to " + result.username + ".";
            statusEl.style.display = "block";
            input.value = "";
            refresh_friends_panel();
        })
        .catch(function (err) {
            statusEl.textContent = err.message;
            statusEl.style.display = "block";
        });
}

function respond_to_request(requestId, accept) {
    var action = accept ? acceptFriendRequest(requestId) : declineOrCancelFriendRequest(requestId);
    action.then(refresh_friends_panel).catch(function (err) { alert(err.message); });
}

function cancel_sent_request(requestId) {
    declineOrCancelFriendRequest(requestId).then(refresh_friends_panel).catch(function (err) { alert(err.message); });
}

function remove_friend(friendshipId) {
    removeFriend(friendshipId).then(refresh_friends_panel).catch(function (err) { alert(err.message); });
}

// --- Clans ---

function open_clans() {
    if (require_login_for_socials("Clans")) return;
    document.getElementById("clans-panel").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    refresh_clans_panel();
}

function close_clans() {
    document.getElementById("clans-panel").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function refresh_clans_panel() {
    getMyClanId()
        .then(function (clanId) {
            if (clanId) {
                document.getElementById("clan-browse-view").style.display = "none";
                document.getElementById("clan-mine-view").style.display = "block";
                render_my_clan(clanId);
            } else {
                document.getElementById("clan-mine-view").style.display = "none";
                document.getElementById("clan-browse-view").style.display = "block";
                render_clan_browse_list();
            }
        })
        .catch(function (err) {
            console.error(err);
        });
}

function render_clan_browse_list() {
    getClanList()
        .then(function (clans) {
            var container = document.getElementById("clan-browse-list");
            container.innerHTML = "";
            if (!clans.length) {
                var empty = document.createElement("p");
                empty.className = "social-empty";
                empty.textContent = "No clans yet — start one!";
                container.appendChild(empty);
                return;
            }
            clans.forEach(function (clan) {
                var row = document.createElement("div");
                row.className = "social-row";

                var left = document.createElement("span");
                left.textContent = clan.name + (clan.tag ? " [" + clan.tag + "]" : "") + " · " + clan.member_count + " members";
                row.appendChild(left);

                var joinBtn = document.createElement("button");
                joinBtn.type = "button";
                joinBtn.className = "login_button";
                joinBtn.textContent = "Join";
                joinBtn.addEventListener("click", function () {
                    joinClan(clan.id).then(refresh_clans_panel).catch(function (err) { alert(err.message); });
                });
                row.appendChild(joinBtn);

                container.appendChild(row);
            });
        })
        .catch(function (err) {
            console.error(err);
        });
}

function create_clan() {
    var nameInput = document.getElementById("clan-name-input");
    var tagInput = document.getElementById("clan-tag-input");
    var statusEl = document.getElementById("clan-create-status");
    statusEl.style.display = "none";

    var name = nameInput.value.trim();
    if (name.length < 2) {
        statusEl.textContent = "Clan name must be at least 2 characters.";
        statusEl.style.display = "block";
        return;
    }

    createClan(name, tagInput.value.trim())
        .then(function () {
            nameInput.value = "";
            tagInput.value = "";
            refresh_clans_panel();
        })
        .catch(function (err) {
            statusEl.textContent = err.message;
            statusEl.style.display = "block";
        });
}

var currentClanId = null;
var currentClanIsOwner = false;

function render_my_clan(clanId) {
    currentClanId = clanId;
    var statusEl = document.getElementById("clan-mine-status");
    statusEl.style.display = "none";

    getClan(clanId)
        .then(function (clan) {
            if (!clan) {
                // The clan was deleted out from under us; drop back to browse view.
                refresh_clans_panel();
                return;
            }
            document.getElementById("clan-mine-name").innerText = clan.name;
            document.getElementById("clan-mine-tag").innerText = clan.tag ? "[" + clan.tag + "]" : "";
            document.getElementById("clan-mine-bio").innerText = clan.bio || "No description yet.";

            currentClanIsOwner = currentUser && clan.owner_id === currentUser.id;
            document.getElementById("clan-owner-controls").style.display = currentClanIsOwner ? "block" : "none";
            if (currentClanIsOwner) {
                document.getElementById("clan-bio-input").value = clan.bio || "";
            }

            return getClanMembers(clanId);
        })
        .then(function (members) {
            if (!members) return;
            fill_social_list("clan-mine-members", members, "No members.", function (member) {
                return build_social_row(
                    { username: member.username, avatar_emoji: member.avatar_emoji },
                    []
                );
            });
        })
        .catch(function (err) {
            statusEl.textContent = err.message;
            statusEl.style.display = "block";
        });
}

function save_clan_bio() {
    var bio = document.getElementById("clan-bio-input").value.trim();
    var statusEl = document.getElementById("clan-mine-status");
    updateClanBio(currentClanId, bio)
        .then(function () {
            document.getElementById("clan-mine-bio").innerText = bio || "No description yet.";
            statusEl.textContent = "Saved.";
            statusEl.style.display = "block";
        })
        .catch(function (err) {
            statusEl.textContent = err.message;
            statusEl.style.display = "block";
        });
}

function confirm_delete_clan() {
    showConfirmationPopup(
        "Delete this clan? All members will be removed from it. This cannot be undone.",
        "Yes, Delete Clan",
        function () {
            deleteClan(currentClanId).then(refresh_clans_panel).catch(function (err) { alert(err.message); });
        }
    );
}

function leave_clan() {
    leaveClan().then(refresh_clans_panel).catch(function (err) { alert(err.message); });
}