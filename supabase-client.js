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

// --- Auth ---

async function signUp(email, password, username) {
  requireSupabase();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });
  if (error) throw error;
  return data;
}

async function signIn(email, password) {
  requireSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
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
