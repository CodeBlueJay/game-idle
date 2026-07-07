// ============================================================
// Game Idle — Supabase integration
// Load order in index.html (all with `defer`):
//   1. supabase-js CDN
//   2. supabase-client.js  (this file)
//   3. scripts.js
// ============================================================

const SUPABASE_URL = "https://YOUR-PROJECT-REF.supabase.co";
const SUPABASE_ANON_KEY = "YOUR-ANON-PUBLIC-KEY";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null; // scripts.js checks this to decide cloud vs localStorage

// --- Auth ---

async function signUp(email, password, username) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });
  if (error) throw error;
  return data;
}

async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Keeps currentUser in sync and triggers a load whenever auth state changes.
// scripts.js defines window.onGameLoaded / window.onSignedOut.
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

// Restore session on page load (e.g. after a refresh)
supabase.auth.getUser().then(({ data }) => {
  currentUser = data.user;
  if (currentUser && typeof window.onGameLoaded === "function") {
    loadGameFromCloud().then((save) => window.onGameLoaded(save));
  }
});

// --- Save / Load ---

async function saveGameToCloud(state) {
  if (!currentUser) throw new Error("Not logged in");
  const { error } = await supabase
    .from("saves")
    .update({ ...state, updated_at: new Date().toISOString() })
    .eq("user_id", currentUser.id);
  if (error) throw error;
}

async function loadGameFromCloud() {
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
  if (!currentUser) throw new Error("Not logged in");
  const username = currentUser.user_metadata?.username || currentUser.email.split("@")[0];
  const { error } = await supabase
    .from("messages")
    .insert({ user_id: currentUser.id, username, content });
  if (error) throw error;
}

async function loadRecentMessages(limit = 50) {
  const { data, error } = await supabase
    .from("messages")
    .select("username, content, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data.reverse();
}

function subscribeToChat(onMessage) {
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
