// ============================================================
// Game Idle — Supabase integration
// Load order in index.html (all with `defer`):
//   1. supabase-js CDN
//   2. supabase-client.js  (this file)
//   3. scripts.js
// ============================================================

const SUPABASE_URL = "https://dlfdemfqceotopfclnvc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsZmRlbWZxY2VvdG9wZmNsbnZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzODk2MDcsImV4cCI6MjA5ODk2NTYwN30.qnXOEF2RNomfjbr7lVRUrW-cxFGYhSBnUw55ooLGrGw";

let sbClient;
try {
  if (!window.supabase) {
    throw new Error("Supabase library did not load. Check the CDN <script> tag in index.html.");
  }
  if (SUPABASE_URL.includes("YOUR-PROJECT-REF") || SUPABASE_ANON_KEY.includes("YOUR-ANON-PUBLIC-KEY")) {
    throw new Error("Supabase is not configured yet. Replace SUPABASE_URL and SUPABASE_ANON_KEY at the top of supabase-client.js with your project's real values.");
  }
  sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (err) {
  console.error(err.message);
}

let currentUser = null; // scripts.js checks this to decide cloud vs localStorage

function requireSupabase() {
  if (!sbClient) {
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
  const { data, error } = await sbClient.auth.signUp({
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
  const { data, error } = await sbClient.auth.signInWithPassword({ email, password });
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
  const { error } = await sbClient.auth.signOut();
  if (error) throw error;
}

// Keeps currentUser in sync and triggers a load whenever auth state changes.
// scripts.js defines window.onGameLoaded / window.onSignedOut.
if (sbClient) {
  sbClient.auth.onAuthStateChange((event, session) => {
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
if (sbClient) {
  sbClient.auth.getUser().then(({ data }) => {
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
  const { error } = await sbClient
    .from("saves")
    .update({ ...state, updated_at: new Date().toISOString() })
    .eq("user_id", currentUser.id);
  if (error) throw error;
}

async function loadGameFromCloud() {
  requireSupabase();
  if (!currentUser) return null;
  const { data, error } = await sbClient
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
  const { data, error } = await sbClient
    .from("leaderboard")
    .select("username, memes")
    .order("memes", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

async function getAllPlayers(limit = 200) {
  requireSupabase();
  const { data, error } = await sbClient
    .from("leaderboard")
    .select("username")
    .order("username", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data;
}

// --- Profiles ---

async function getProfile(username) {
  requireSupabase();
  const { data, error } = await sbClient
    .from("leaderboard")
    .select("username, memes, bio, avatar_emoji")
    .ilike("username", username)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function updateProfile({ bio, avatar_emoji }) {
  requireSupabase();
  if (!currentUser) throw new Error("Not logged in");
  const { error } = await sbClient
    .from("saves")
    .update({ bio, avatar_emoji, updated_at: new Date().toISOString() })
    .eq("user_id", currentUser.id);
  if (error) throw error;
}

// --- Chat ---

async function sendChatMessage(content) {
  requireSupabase();
  if (!currentUser) throw new Error("Not logged in");
  const username = currentUser.user_metadata?.username || currentUser.email.split("@")[0];
  const { error } = await sbClient
    .from("messages")
    .insert({ user_id: currentUser.id, username, content });
  if (error) throw error;
}

async function loadRecentMessages(limit = 50) {
  requireSupabase();
  const { data, error } = await sbClient
    .from("messages")
    .select("username, content, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data.reverse();
}

function subscribeToChat(onMessage) {
  if (!sbClient) return function () {}; // no-op unsubscribe
  const channel = sbClient
    .channel("public:messages")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages" },
      (payload) => onMessage(payload.new)
    )
    .subscribe();
  return () => sbClient.removeChannel(channel);
}

// --- Friends ---

async function lookupUserIdByUsername(username) {
  const { data, error } = await sbClient
    .from("leaderboard")
    .select("user_id, username")
    .ilike("username", username)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function sendFriendRequest(username) {
  requireSupabase();
  if (!currentUser) throw new Error("Not logged in");

  const target = await lookupUserIdByUsername(username);
  if (!target) throw new Error("No player with that username.");
  if (target.user_id === currentUser.id) throw new Error("You can't friend yourself.");

  // If they already sent *me* a pending request, accept it instead of
  // creating a duplicate, mismatched row.
  const { data: reverseRow, error: reverseErr } = await sbClient
    .from("friendships")
    .select("id, status")
    .eq("requester_id", target.user_id)
    .eq("addressee_id", currentUser.id)
    .maybeSingle();
  if (reverseErr) throw reverseErr;

  if (reverseRow) {
    if (reverseRow.status === "accepted") throw new Error("You're already friends with " + target.username + ".");
    const { error } = await sbClient.from("friendships").update({ status: "accepted" }).eq("id", reverseRow.id);
    if (error) throw error;
    return { autoAccepted: true, username: target.username };
  }

  const { error } = await sbClient
    .from("friendships")
    .insert({ requester_id: currentUser.id, addressee_id: target.user_id, status: "pending" });
  if (error) {
    if (error.code === "23505") throw new Error("You already sent " + target.username + " a request.");
    throw error;
  }
  return { autoAccepted: false, username: target.username };
}

async function getIncomingFriendRequests() {
  requireSupabase();
  if (!currentUser) return [];
  const { data, error } = await sbClient
    .from("friendships")
    .select("id, requester_id")
    .eq("addressee_id", currentUser.id)
    .eq("status", "pending");
  if (error) throw error;
  return attachUsernames(data, "requester_id");
}

async function getSentFriendRequests() {
  requireSupabase();
  if (!currentUser) return [];
  const { data, error } = await sbClient
    .from("friendships")
    .select("id, addressee_id")
    .eq("requester_id", currentUser.id)
    .eq("status", "pending");
  if (error) throw error;
  return attachUsernames(data, "addressee_id");
}

async function getFriendsList() {
  requireSupabase();
  if (!currentUser) return [];
  const { data, error } = await sbClient
    .from("friendships")
    .select("id, requester_id, addressee_id")
    .eq("status", "accepted")
    .or(`requester_id.eq.${currentUser.id},addressee_id.eq.${currentUser.id}`);
  if (error) throw error;

  const rows = data.map((row) => ({
    id: row.id,
    other_id: row.requester_id === currentUser.id ? row.addressee_id : row.requester_id,
  }));
  return attachUsernames(rows, "other_id");
}

// Given rows containing a user_id-holding field, look up display info
// (username/avatar) for each of those users in one batched query.
async function attachUsernames(rows, idField) {
  if (!rows.length) return [];
  const ids = [...new Set(rows.map((r) => r[idField]))];
  const { data: profiles, error } = await sbClient
    .from("leaderboard")
    .select("user_id, username, avatar_emoji")
    .in("user_id", ids);
  if (error) throw error;

  const byId = {};
  profiles.forEach((p) => (byId[p.user_id] = p));

  return rows.map((row) => ({
    ...row,
    username: byId[row[idField]] ? byId[row[idField]].username : "Unknown",
    avatar_emoji: byId[row[idField]] ? byId[row[idField]].avatar_emoji : "❔",
  }));
}

async function acceptFriendRequest(requestId) {
  requireSupabase();
  const { error } = await sbClient
    .from("friendships")
    .update({ status: "accepted" })
    .eq("id", requestId)
    .eq("addressee_id", currentUser.id);
  if (error) throw error;
}

async function declineOrCancelFriendRequest(requestId) {
  requireSupabase();
  const { error } = await sbClient
    .from("friendships")
    .delete()
    .eq("id", requestId);
  if (error) throw error;
}

async function removeFriend(friendshipId) {
  return declineOrCancelFriendRequest(friendshipId);
}

// --- Clans ---

async function getClanList(limit = 50) {
  requireSupabase();
  const { data: clans, error } = await sbClient
    .from("clans")
    .select("id, name, tag, bio, owner_id")
    .order("name", { ascending: true })
    .limit(limit);
  if (error) throw error;

  const { data: counts, error: countErr } = await sbClient.from("clan_member_counts").select("clan_id, member_count");
  if (countErr) throw countErr;
  const countById = {};
  counts.forEach((c) => (countById[c.clan_id] = c.member_count));

  return clans.map((c) => ({ ...c, member_count: countById[c.id] || 0 }));
}

async function getMyClanId() {
  requireSupabase();
  if (!currentUser) return null;
  const { data, error } = await sbClient
    .from("saves")
    .select("clan_id")
    .eq("user_id", currentUser.id)
    .maybeSingle();
  if (error) throw error;
  return data ? data.clan_id : null;
}

async function getClan(clanId) {
  requireSupabase();
  const { data, error } = await sbClient
    .from("clans")
    .select("id, name, tag, bio, owner_id")
    .eq("id", clanId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function getClanMembers(clanId) {
  requireSupabase();
  const { data, error } = await sbClient
    .from("leaderboard")
    .select("username, memes, avatar_emoji")
    .eq("clan_id", clanId)
    .order("memes", { ascending: false });
  if (error) throw error;
  return data;
}

async function createClan(name, tag) {
  requireSupabase();
  if (!currentUser) throw new Error("Not logged in");
  const { data, error } = await sbClient
    .from("clans")
    .insert({ name: name.trim(), tag: tag.trim() || null, owner_id: currentUser.id })
    .select()
    .single();
  if (error) {
    if (error.code === "23505") throw new Error("A clan with that name already exists.");
    throw error;
  }
  await sbClient.from("saves").update({ clan_id: data.id }).eq("user_id", currentUser.id);
  return data;
}

async function joinClan(clanId) {
  requireSupabase();
  if (!currentUser) throw new Error("Not logged in");
  const { error } = await sbClient.from("saves").update({ clan_id: clanId }).eq("user_id", currentUser.id);
  if (error) throw error;
}

async function leaveClan() {
  requireSupabase();
  if (!currentUser) throw new Error("Not logged in");
  const { error } = await sbClient.from("saves").update({ clan_id: null }).eq("user_id", currentUser.id);
  if (error) throw error;
}

async function updateClanBio(clanId, bio) {
  requireSupabase();
  const { error } = await sbClient.from("clans").update({ bio }).eq("id", clanId).eq("owner_id", currentUser.id);
  if (error) throw error;
}

async function deleteClan(clanId) {
  requireSupabase();
  const { error } = await sbClient.from("clans").delete().eq("id", clanId).eq("owner_id", currentUser.id);
  if (error) throw error;
}