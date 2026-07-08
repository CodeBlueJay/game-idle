// ============================================================
// Game Idle — Supabase integration
// Load order in index.html (all with `defer`):
//   1. supabase-js CDN
//   2. supabase-client.js  (this file)
//   3. scripts.js
// ============================================================

const SUPABASE_URL = "https://YOUR-PROJECT-REF.supabase.co";
const SUPABASE_ANON_KEY = "YOUR-ANON-PUBLIC-KEY";

let supabase;
try {
  if (!window.supabase) {
    throw new Error("Supabase library did not load. Check the CDN <script> tag in index.html.");
  }
  if (SUPABASE_URL.includes("YOUR-PROJECT-REF") || SUPABASE_ANON_KEY.includes("YOUR-ANON-PUBLIC-KEY")) {
    throw new Error("Supabase is not configured yet. Replace SUPABASE_URL and SUPABASE_ANON_KEY at the top of supabase-client.js with your project's real values.");
  }
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (err) {
  console.error(err.message);
}

let currentUser = null; // scripts.js checks this to decide cloud vs localStorage

function requireSupabase() {
  if (!supabase) {
    throw new Error("Supabase isn't configured. Add your project URL and anon key to the top of supabase-client.js.");
  }
}

// Supabase's built-in auth is email/password under the hood, but this game
// only wants a username. We derive a stable, fake-but-valid email from the
// username so Supabase is happy, while the player never sees or types one.
// Two side effects worth knowing:
//   1. Usernames must be unique (Supabase enforces this via the derived
//      email's uniqueness), which is what you want anyway.
//   2. Because the "email" isn't real, you MUST turn off "Confirm email"
//      in your Supabase project (Authentication -> Sign In / Providers ->
//      Email -> Confirm email), or accounts can never be confirmed.
function usernameToEmail(username) {
  const slug = username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
  if (!slug) throw new Error("Username must contain at least one letter or number.");
  return slug + "@players.game-idle.local";
}

// --- Auth ---

async function signUp(username, password) {
  requireSupabase();
  const email = usernameToEmail(username);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username: username.trim() } },
  });
  if (error) {
    if (error.message && /already registered|already exists/i.test(error.message)) {
      throw new Error("That username is already taken.");
    }
    throw error;
  }
  return data;
}

async function signIn(username, password) {
  requireSupabase();
  const email = usernameToEmail(username);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.message && /invalid login credentials/i.test(error.message)) {
      throw new Error("Incorrect username or password.");
    }
    throw error;
  }
  return data;
}

async function signOutUser() {
  requireSupabase();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Keeps currentUser in sync and triggers a load whenever auth state changes.
// scripts.js defines window.onGameLoaded / window.onSignedOut.
if (supabase) {
  supabase.auth.onAuthStateChange((event, session) => {
    currentUser = session?.user ?? null;

    if (event === "SIGNED_IN") {
      loadGameFromCloud().then((save) => {
        if (typeof window.onGameLoaded === "function") window.onGameLoaded(save);
      });
    }
    if (event === "SIGNED_OUT") {
      if (typeof window.onSignedOut === "function") window.onSignedOut();
    }
  });
}

// Restore session on page load (e.g. after a refresh)
if (supabase) {
  supabase.auth.getUser().then(({ data }) => {
    currentUser = data.user;
    if (currentUser && typeof window.onGameLoaded === "function") {
      loadGameFromCloud().then((save) => window.onGameLoaded(save));
    }
  });
}

// --- Save / Load ---

async function saveGameToCloud(state) {
  requireSupabase();
  if (!currentUser) throw new Error("Not logged in");
  const { error } = await supabase
    .from("saves")
    .update({ ...state, updated_at: new Date().toISOString() })
    .eq("user_id", currentUser.id);
  if (error) throw error;
}

async function loadGameFromCloud() {
  requireSupabase();
  if (!currentUser) return null;
  const { data, error } = await supabase
    .from("saves")
    .select("*")
    .eq("user_id", currentUser.id)
    .single();
  if (error) throw error;
  return data;
}

// --- Leaderboard ---

async function getLeaderboard(limit = 20) {
  requireSupabase();
  const { data, error } = await supabase
    .from("leaderboard")
    .select("username, memes")
    .order("memes", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

// --- Chat ---

async function sendChatMessage(content) {
  requireSupabase();
  if (!currentUser) throw new Error("Not logged in");
  const username = currentUser.user_metadata?.username || currentUser.email.split("@")[0];
  const { error } = await supabase
    .from("messages")
    .insert({ user_id: currentUser.id, username, content });
  if (error) throw error;
}

async function loadRecentMessages(limit = 50) {
  requireSupabase();
  const { data, error } = await supabase
    .from("messages")
    .select("username, content, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data.reverse();
}

function subscribeToChat(onMessage) {
  if (!supabase) return function () {}; // no-op unsubscribe
  const channel = supabase
    .channel("public:messages")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages" },
      (payload) => onMessage(payload.new)
    )
    .subscribe();
  return () => supabase.removeChannel(channel);
}