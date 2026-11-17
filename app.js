import { paintWord, mergeProgress } from "./logic.js";
import { catalog, homeView } from "./arcade.js";
import { extraGames } from "./games.js";
import {
  questions,
  QUESTION_COUNT,
  normalize,
  matchAnswer,
  wordList,
  groups,
  groupLabels,
} from "./data.js";
const root = document.querySelector("#app");
const today = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
const key = "krillion.progress.v1",
  tokenKey = "krillion.token.v1";
const saved = () => {
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
};
let progress = {
    xp: 0,
    played: 0,
    best: 0,
    streak: 0,
    lastDay: "",
    wins: {},
    ...saved(),
  },
  user = null,
  token = localStorage.getItem(tokenKey),
  timer = null,
  session = null;
const icons = {
  dive: "🌊",
  word: "🟩",
  connections: "🧩",
  numbers: "🔢",
  reaction: "⚡",
  memory: "🧠",
};
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const rand = (max) => Math.floor(Math.random() * max);
const shuffle = (a) => {
  const result = [...a];
  for (let i = result.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};
const dayIndex = (n) =>
  Math.floor(Date.parse(today() + "T00:00:00Z") / 86400000) % n;

function persist() {
  localStorage.setItem(key, JSON.stringify(progress));
  if (token)
    fetch("/api/progress", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer " + token,
      },
      body: JSON.stringify({ progress }),
    })
      .then((r) => {
        syncStatus = r.ok
          ? "Synced with your account"
          : "Saved locally · cloud sync pending";
        if (!r.ok) toast("Saved on this device. Cloud sync unavailable.");
      })
      .catch(() => {
        syncStatus = "Saved locally · offline";
      });
}
function award(game, xp, won = true) {
  if (won) {
    celebrate();
    toast("+" + xp + " XP · Nice work!");
  }
  progress.played++;
  progress.xp += xp;
  progress.wins[game] = (progress.wins[game] || 0) + (won ? 1 : 0);
  const d = today();
  if (won && progress.lastDay !== d) {
    const yesterday = new Date(Date.parse(d + "T12:00:00Z") - 86400000)
      .toISOString()
      .slice(0, 10);
    progress.streak = progress.lastDay === yesterday ? progress.streak + 1 : 1;
    progress.lastDay = d;
  }
  persist();
}
let cleanups = [],
  syncStatus = "Saved on this device";
const onCleanup = (fn) => cleanups.push(fn);
let soundEnabled = localStorage.getItem("krillion.sound") === "true",
  audio;
function beep() {
  if (!soundEnabled) return;
  try {
    audio ||= new (window.AudioContext || window.webkitAudioContext)();
    const o = audio.createOscillator(),
      g = audio.createGain();
    o.connect(g);
    g.connect(audio.destination);
    o.frequency.value = 530;
    g.gain.setValueAtTime(0.025, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.09);
    o.start();
    o.stop(audio.currentTime + 0.1);
  } catch {}
}
function celebrate() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const el = document.createElement("div");
  el.className = "confetti";
  el.setAttribute("aria-hidden", "true");
  el.innerHTML = Array.from(
    { length: 35 },
    () =>
      `<i style="--x:${rand(100)}%;--c:${["#b5f86d", "#c1a1ff", "#f4b87a"][rand(3)]};--delay:${Math.random() * 0.4}s"></i>`,
  ).join("");
  document.body.append(el);
  setTimeout(() => el.remove(), 2500);
}
function toast(text) {
  document.querySelector(".toast")?.remove();
  const el = document.createElement("div");
  el.className = "toast";
  el.setAttribute("role", "status");
  el.textContent = text;
  document.body.append(el);
  setTimeout(() => el.remove(), 2300);
}
function layout(html) {
  clearInterval(timer);
  timer = null;
  root.innerHTML =
    '<div class="shell"><header class="site-header"><button class="logo" data-go="home" aria-label="Krillion Games home"><span class="logo-mark">✦</span><span>krillion<small>THE PLAY CLUB</small></span></button><nav class="nav" aria-label="Main navigation"><button class="nav-link ' +
    (location.hash === "#home" ? "active" : "") +
    '" data-go="home">The arcade</button><button class="nav-link" data-go="profile">Your progress</button><button class="nav-link" id="random-nav">Feeling lucky ↗</button></nav><div class="header-right"><button class="sound-button" id="sound" aria-label="Toggle sound" aria-pressed="' +
    soundEnabled +
    '">' +
    (soundEnabled ? "♫" : "♪") +
    '</button><button class="account-button" data-go="' +
    (user ? "profile" : "login") +
    '"><i class="status-dot"></i>' +
    esc(user?.username || "Player log in") +
    '</button></div></header><main id="main" tabindex="-1">' +
    html +
    '</main><footer class="footer"><b>✦ krillion games</b><span>Built for a little friendly competition.</span><span>' +
    esc(syncStatus) +
    " · " +
    QUESTION_COUNT.toLocaleString() +
    " trivia phrasings</span></footer></div>";
  root
    .querySelectorAll("[data-go]")
    .forEach((b) => (b.onclick = () => navigate(b.dataset.go)));
  root.querySelector("#random-nav").onclick = () =>
    navigate(catalog[rand(catalog.length)][0]);
  root.querySelector("#sound").onclick = () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem("krillion.sound", soundEnabled);
    root.querySelector("#sound").setAttribute("aria-pressed", soundEnabled);
    root.querySelector("#sound").textContent = soundEnabled ? "♫" : "♪";
    beep();
  };
}
const added = extraGames({
  root,
  layout,
  award,
  shuffle,
  rand,
  esc,
  onCleanup,
  celebrate,
});
function navigate(page) {
  cleanups.forEach((fn) => fn());
  cleanups = [];
  clearInterval(timer);
  history.replaceState({}, "", "#" + page);
  (
    ({
      home,
      profile,
      dive,
      word,
      connections,
      numbers,
      reaction,
      memory,
      login,
      ...added,
    })[page] || home
  )();
  window.scrollTo({ top: 0 });
}
window.addEventListener("hashchange", () => {
  if (location.hash !== "#main") navigate(location.hash.slice(1));
});
root.addEventListener("click", (e) => {
  if (e.target.closest("button:not(:disabled)")) beep();
});
function home() {
  layout(homeView(progress, user ? esc(user.username) : null));
  let category = "all";
  const filter = () => {
    const query = root.querySelector("#game-search").value.trim().toLowerCase();
    let count = 0;
    root.querySelectorAll(".game-card").forEach((card) => {
      card.hidden =
        !(category === "all" || card.dataset.category === category) ||
        !card.dataset.title.includes(query);
      if (!card.hidden) count++;
    });
    root.querySelector("#empty-games").hidden = count > 0;
  };
  root.querySelectorAll("[data-filter]").forEach(
    (b) =>
      (b.onclick = () => {
        category = b.dataset.filter;
        root.querySelectorAll("[data-filter]").forEach((x) => {
          x.classList.toggle("active", x === b);
          x.setAttribute("aria-pressed", x === b);
        });
        filter();
      }),
  );
  root.querySelector("#game-search").oninput = filter;
  root.querySelector("#surprise").onclick = () =>
    navigate(catalog[rand(catalog.length)][0]);
}
function achievements() {
  return (
    '<div class="achievement-grid">' +
    [
      ["🚀", "First launch", "Finish your first game", progress.played >= 1],
      ["✦", "Rising star", "Earn 500 XP", progress.xp >= 500],
      ["🔥", "On a roll", "Play on 3 days in a row", progress.streak >= 3],
      ["🌊", "Deep thinker", "Reach 3,000 m in Krillion", progress.best >= 300],
      [
        "🎮",
        "Explorer",
        "Win 5 different games",
        Object.values(progress.wins).filter((v) => v > 0).length >= 5,
      ],
      ["🏆", "Arcade regular", "Finish 25 games", progress.played >= 25],
    ]
      .map(
        ([icon, name, desc, unlocked]) =>
          '<div class="achievement ' +
          (unlocked ? "unlocked" : "") +
          '"><span>' +
          icon +
          "</span><b>" +
          name +
          (unlocked ? " ✓" : "") +
          "</b><p>" +
          desc +
          "</p></div>",
      )
      .join("") +
    "</div>"
  );
}
function profile() {
  layout(
    '<section class="panel"><h1>Your stats</h1><div class="stats"><div class="stat"><strong>' +
      progress.xp +
      '</strong>XP</div><div class="stat"><strong>' +
      progress.played +
      '</strong>Games</div><div class="stat"><strong>' +
      progress.best +
      '</strong>Best dive</div><div class="stat"><strong>' +
      progress.streak +
      '</strong>Day streak</div></div><h2 style="margin-top:35px">Achievements</h2>' +
      achievements() +
      "<h2>Game wins</h2>" +
      Object.entries(progress.wins)
        .map(
          ([a, b]) =>
            '<div class="answer"><span>' +
            esc(a) +
            "</span><b>" +
            b +
            " wins</b></div>",
        )
        .join("") +
      "<p>" +
      (user
        ? "Signed in as <b>" +
          esc(user.username) +
          "</b>. Your progress syncs to your account when online."
        : "Your progress currently saves on this Chromebook/browser. Create an account to sync across devices.") +
      '</p><div class="inline">' +
      (user
        ? '<button class="btn" id="logout">Log out</button>'
        : '<button class="btn primary" data-go="login">Log in / Sign up</button>') +
      '<button class="btn" data-go="home">Back to games</button></div></section>',
  );
  let logout = document.querySelector("#logout");
  if (logout)
    logout.onclick = () => {
      token = null;
      user = null;
      localStorage.removeItem(tokenKey);
      navigate("profile");
    };
}
function login() {
  let active = true;
  onCleanup(() => (active = false));
  layout(
    '<section class="panel form"><div class="eyebrow">Player accounts</div><h2>Save your adventure</h2><p>Log in or create a free account. Your scores always save on this device. Sign in to sync your stats across devices when cloud accounts are available.</p><form id="auth"><label for="username">Username</label><input id="username" placeholder="Username" minlength="3" maxlength="25" required autocomplete="username"><label for="password">Password</label><input id="password" type="password" minlength="8" placeholder="Password (8+ characters)" required autocomplete="current-password"><div class="inline"><button class="btn primary" id="login-submit" value="login">Log in</button><button class="btn" id="signup" type="button">Sign up</button></div><div id="auth-msg" class="message"></div></form></section>',
  );
  fetch("/api/status")
    .then((r) => (r.ok ? r.json() : null))
    .then((body) => {
      if (!active || !body) return;
      if (!body.accountsAvailable) {
        document.querySelector("#auth-msg").textContent =
          "Cloud accounts are not connected yet. Your game progress still saves on this device.";
        document.querySelector("#login-submit").disabled = true;
        document.querySelector("#signup").disabled = true;
      }
    })
    .catch(() => {});
  const submit = async (mode) => {
    if (!document.querySelector("#auth").reportValidity()) return;
    document.querySelector("#login-submit").disabled = true;
    document.querySelector("#signup").disabled = true;
    const username = document.querySelector("#username").value.trim(),
      password = document.querySelector("#password").value;
    const msg = document.querySelector("#auth-msg");
    msg.textContent = "Checking…";
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode, username, password }),
      });
      const body = await response.json();
      if (!active) return;
      if (!response.ok) throw Error(body.error || "Account error");
      token = body.token;
      user = body.user;
      localStorage.setItem(tokenKey, token);
      let remote = await fetch("/api/progress", {
        headers: { authorization: "Bearer " + token },
      }).then((r) => r.json());
      if (!active) return;
      progress = mergeProgress(progress, remote.progress);
      persist();
      navigate("profile");
    } catch (e) {
      if (!active) return;
      msg.textContent = e.message;
      document.querySelector("#login-submit").disabled = false;
      document.querySelector("#signup").disabled = false;
    }
  };
  document.querySelector("#auth").onsubmit = (e) => {
    e.preventDefault();
    submit("login");
  };
  document.querySelector("#signup").onclick = () => submit("register");
}
async function restore() {
  if (!token) return;
  try {
    const res = await fetch("/api/progress", {
      headers: { authorization: "Bearer " + token },
    });
    if (res.status === 401) {
      token = null;
      localStorage.removeItem(tokenKey);
      return;
    }
    if (!res.ok) throw Error("offline");
    const body = await res.json();
    user = body.user;
    progress = mergeProgress(progress, body.progress);
    persist();
    syncStatus = "Synced with your account";
  } catch {
    syncStatus = "Saved locally · cloud unavailable";
  }
}
function randomDailySet() {
  const day = Math.floor(Date.parse(today() + "T00:00:00Z") / 86400000),
    source = questions.filter((q, i) => q.id % 20 === 0);
  let state = (day + 17011) >>> 0;
  const random = () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  return [...source]
    .sort((a, b) => {
      const hash = (x) => {
        let h = (day + 1) * 17;
        for (const ch of x.prompt)
          h = (Math.imul(h, 33) + ch.charCodeAt(0)) >>> 0;
        return h;
      };
      return hash(a) - hash(b);
    })
    .slice(0, 7);
}
function dive() {
  layout(
    '<section class="game panel center"><div class="eyebrow">Krillion • Seven questions</div><h1>How deep can you go?</h1><p>One answer per question. You get a short preview and 25 seconds to find the rarest valid answer you can. Each point is 10 metres of depth.</p><div class="dive-illustration" aria-hidden="true"><div class="sonar"></div><div class="submarine"><span></span><i></i><b></b></div></div><div class="cards"><article class="card"><h3>Daily Dive</h3><p>Seven shared prompts, one scored attempt each day.</p><button class="btn primary" id="daily">Begin descent</button></article><article class="card"><h3>Endless Dive</h3><p>New random set every run. Replay anytime.</p><button class="btn primary" id="endless">Play endless</button></article></div></section>',
  );
  document.querySelector("#daily").onclick = () => startDive("daily");
  document.querySelector("#endless").onclick = () => startDive("endless");
}
function startDive(mode) {
  const day = today(),
    key = "krillion.daily." + day;
  if (mode === "daily") {
    try {
      const past = JSON.parse(localStorage.getItem(key) || "null");
      if (past && !past.completed && past.q) {
        session = past;
        drawDive();
        return;
      }
      if (past?.completed) {
        layout(
          '<section class="game panel center"><h2>Today’s dive is complete</h2><p>Score: ' +
            past.score +
            " points • " +
            (past.score * 10).toLocaleString() +
            ' metres</p><button class="btn primary" data-go="dive">Play endless instead</button></section>',
        );
        return;
      }
    } catch {}
  }
  const q =
    mode === "daily"
      ? randomDailySet()
      : shuffle(questions.filter((x) => x.id % 20 === 0)).slice(0, 7);
  session = {
    mode,
    round: 0,
    score: 0,
    remaining: 25,
    q,
    results: [],
    phase: "preview",
  };
  drawDive();
}
function diveTier(match, item) {
  if (!match) return { name: "Not accepted", score: 0 };
  const count = item.answers.length;
  const percentile = match.index / Math.max(count - 1, 1);
  if (percentile >= 0.98 && count >= 20)
    return { name: "Krillion", score: 100 };
  if (percentile >= 0.72) return { name: "Deep Cut", score: 85 };
  if (percentile >= 0.4) return { name: "Rare", score: 60 };
  if (percentile >= 0.13) return { name: "Schooler", score: 30 };
  if (percentile >= 0.06) return { name: "Too Clever", score: 15 };
  return { name: "Plankton", score: 10 };
}
function drawDive() {
  const s = session;
  if (s.mode === "daily")
    localStorage.setItem("krillion.daily." + today(), JSON.stringify(s));
  if (s.round >= 7) {
    progress.best = Math.max(progress.best, s.score);
    award("Krillion", s.score, s.score > 0);
    if (s.mode === "daily")
      localStorage.setItem(
        "krillion.daily." + today(),
        JSON.stringify({ completed: true, score: s.score, results: s.results }),
      );
    layout(
      '<section class="game panel center"><div class="big">🏁</div><div class="eyebrow">Dive complete • ' +
        esc(s.mode) +
        "</div><h1>" +
        s.score +
        " / 700</h1><h2>🌊 " +
        (s.score * 10).toLocaleString() +
        ' metres deep</h2><div class="bar"><div style="width:' +
        (s.score / 700) * 100 +
        '%"></div></div><div class="results">' +
        s.results
          .map(
            (r, i) =>
              '<div class="answer"><span>Round ' +
              (i + 1) +
              ": " +
              esc(r.answer || "No answer") +
              "</span><strong>" +
              esc(r.tier) +
              " • " +
              r.points +
              " pts</strong></div>",
          )
          .join("") +
        '</div><div class="inline" style="justify-content:center"><button class="btn primary" data-go="dive">More Krillion</button><button class="btn" data-go="home">All games</button></div></section>',
    );
    return;
  }
  const item = s.q[s.round];
  s.phase = "preview";
  layout(
    '<section class="game panel center"><div class="eyebrow">' +
      esc(s.mode) +
      " • Question " +
      (s.round + 1) +
      '/7</div><div class="big">🌊</div><h2>' +
      esc(item.prompt) +
      '</h2><p>Think of one uncommon, valid answer.</p><div class="stat">Get ready: <strong id="previewtimer">3</strong></div><div class="bar"><div id="timebar" style="width:100%"></div></div><p class="tiny">Total depth: ' +
      (s.score * 10).toLocaleString() +
      " m</p></section>",
  );
  let remaining = 3;
  timer = setInterval(() => {
    remaining--;
    const el = document.querySelector("#previewtimer");
    if (el) el.textContent = remaining;
    if (remaining <= 0) {
      clearInterval(timer);
      showAnswerPhase();
    }
  }, 1000);
}
function showAnswerPhase() {
  const s = session,
    item = s.q[s.round];
  s.phase = "answer";
  s.remaining = 25;
  s.endsAt = Date.now() + 25000;
  layout(
    '<section class="game"><div class="topline"><span class="eyebrow">' +
      esc(s.mode) +
      " • Question " +
      (s.round + 1) +
      ' / 7</span><div class="stats"><div class="stat">Depth <b>' +
      (s.score * 10).toLocaleString() +
      '</b> m</div><div class="stat">⏱ <b id="seconds">25</b>s</div></div></div><div class="bar"><div id="timebar" style="width:100%"></div></div><div class="question">' +
      esc(item.prompt) +
      '</div><p>Choose ONE answer. Rarer valid answers earn more points. You can retry if your answer is not recognized before time runs out.</p><div class="inline"><button class="pill" id="dailyhint">💡 Daily hint</button><button class="pill" id="passdive">Pass</button></div><form id="guess" class="entry"><input id="answer" placeholder="One clever answer…" autocomplete="off" autofocus><button class="btn primary">DIVE ↵</button></form><p id="feedback" class="tiny">Be accurate, but think beyond the obvious.</p></section>',
  );
  const input = document.querySelector("#answer");
  input.focus();
  document.querySelector("#passdive").onclick = () =>
    finishDiveAnswer("", null);
  document.querySelector("#dailyhint").onclick = () => {
    const k = "krillion.hint." + today();
    if (s.mode !== "daily") {
      document.querySelector("#feedback").textContent =
        "Hints are available in Daily Dive.";
      return;
    }
    if (localStorage.getItem(k)) {
      document.querySelector("#feedback").textContent =
        "You already used your hint today.";
      return;
    }
    localStorage.setItem(k, "1");
    const a = item.answers;
    const sample = [a[0], a[Math.floor(a.length / 2)], a[a.length - 1]].filter(
      Boolean,
    );
    document.querySelector("#feedback").textContent =
      "Examples at different depths: " + [...new Set(sample)].join(" • ");
  };
  document.querySelector("#guess").onsubmit = (e) => {
    e.preventDefault();
    if (s.phase !== "answer") return;
    const typed = input.value.trim();
    if (!typed) return;
    const m = matchAnswer(typed, item.answers);
    if (!m) {
      document.querySelector("#feedback").innerHTML =
        '<span class="wrong">Not recognized. Try another while time remains.</span>';
      input.select();
      return;
    }
    finishDiveAnswer(typed, m);
  };
  timer = setInterval(() => {
    s.remaining = Math.max(0, Math.ceil((s.endsAt - Date.now()) / 1000));
    const x = document.querySelector("#seconds");
    if (x) x.textContent = s.remaining;
    const b = document.querySelector("#timebar");
    if (b) b.style.width = (s.remaining / 25) * 100 + "%";
    if (s.remaining <= 0)
      finishDiveAnswer(
        input.value.trim(),
        matchAnswer(input.value.trim(), item.answers),
      );
  }, 1000);
}
function finishDiveAnswer(typed, m) {
  const s = session;
  if (s.phase !== "answer") return;
  clearInterval(timer);
  s.phase = "result";
  const item = s.q[s.round],
    tier = diveTier(m, item);
  s.score += tier.score;
  s.results.push({
    answer: m ? m.answer : typed,
    tier: tier.name,
    points: tier.score,
  });
  layout(
    '<section class="game panel center"><div class="eyebrow">Question ' +
      (s.round + 1) +
      ' / 7</div><div class="big">' +
      (m ? "🐠" : "⏳") +
      "</div><h2>" +
      (m ? "Answer accepted!" : "Out of air!") +
      '</h2><p class="question" style="font-size:32px">' +
      esc(m ? m.answer : "No valid answer") +
      "</p><h2>" +
      esc(tier.name) +
      " • +" +
      tier.score +
      " points</h2><p>" +
      (m?.typo ? "Spelling variation accepted. " : "") +
      "Total: " +
      s.score +
      " points • " +
      (s.score * 10).toLocaleString() +
      ' metres deep</p><div class="bar"><div style="width:' +
      (s.score / 700) * 100 +
      '%"></div></div><button class="btn primary" id="nextdive">' +
      (s.round === 6 ? "View final results" : "Next question →") +
      "</button></section>",
  );
  document.querySelector("#nextdive").onclick = () => {
    s.round++;
    drawDive();
  };
}
function localDay() {
  return today();
}
const wordAllowed = new Set([
  ...wordList,
  "ABOUT",
  "ABOVE",
  "ACORN",
  "ACTOR",
  "ADORE",
  "ADULT",
  "AFTER",
  "AGAIN",
  "ALARM",
  "ALBUM",
  "ALERT",
  "ALIEN",
  "ALIVE",
  "ALLOW",
  "ALONE",
  "ALONG",
  "ALTER",
  "AMBER",
  "AMONG",
  "ANGEL",
  "ANGER",
  "ANGLE",
  "ANGRY",
  "APART",
  "APPLY",
  "ARENA",
  "ARGUE",
  "ARISE",
  "ARMOR",
  "ARROW",
  "ASIDE",
  "ASSET",
  "AUDIO",
  "AVOID",
  "AWAKE",
  "AWARD",
  "AWARE",
  "BADGE",
  "BASIC",
  "BASIS",
  "BATCH",
  "BATHS",
  "BEANS",
  "BEARS",
  "BEGIN",
  "BEING",
  "BELLY",
  "BENCH",
  "BIBLE",
  "BIRTH",
  "BLACK",
  "BLANK",
  "BLAST",
  "BLEND",
  "BLESS",
  "BLIND",
  "BLOCK",
  "BLOOD",
  "BOARD",
  "BOAST",
  "BOOST",
  "BOUND",
  "BOXES",
  "BRAIN",
  "BRAND",
  "BREAK",
  "BREED",
  "BRING",
  "BROAD",
  "BROWN",
  "BUILD",
  "BUILT",
  "BUNCH",
  "BURST",
  "BUYER",
  "CABIN",
  "CABLE",
  "CAMEL",
  "CANAL",
  "CARRY",
  "CATCH",
  "CAUSE",
  "CHAIN",
  "CHALK",
  "CHARM",
  "CHASE",
  "CHEAP",
  "CHECK",
  "CHEEK",
  "CHEER",
  "CHEST",
  "CHIEF",
  "CHILD",
  "CHILI",
  "CHILL",
  "CHINA",
  "CHOIR",
  "CHORE",
  "CIVIC",
  "CIVIL",
  "CLAIM",
  "CLASS",
  "CLEAN",
  "CLEAR",
  "CLERK",
  "CLICK",
  "CLIMB",
  "CLOSE",
  "CLOTH",
  "COACH",
  "COAST",
  "COLOR",
  "COMET",
  "COMIC",
  "COUNT",
  "COURT",
  "COVER",
  "CRAFT",
  "CRASH",
  "CRAZY",
  "CREAM",
  "CREEK",
  "CRIME",
  "CROSS",
  "CROWD",
  "CRUSH",
  "CURVE",
  "CYCLE",
  "DAILY",
  "DEALT",
  "DEATH",
  "DEBUT",
  "DELAY",
  "DEPTH",
  "DIGIT",
  "DIRTY",
  "DOUBT",
  "DOZEN",
  "DRAFT",
  "DRAIN",
  "DRAMA",
  "DRESS",
  "DRILL",
  "DRINK",
  "DROVE",
  "DWARF",
  "EAGER",
  "EARLY",
  "EIGHT",
  "ELBOW",
  "ELITE",
  "EMPTY",
  "ENJOY",
  "ENTER",
  "ENTRY",
  "EQUAL",
  "ERROR",
  "EVENT",
  "EVERY",
  "EXACT",
  "EXIST",
  "EXTRA",
  "FAITH",
  "FALSE",
  "FANCY",
  "FATAL",
  "FAULT",
  "FAVOR",
  "FEAST",
  "FENCE",
  "FETCH",
  "FEVER",
  "FIBER",
  "FIFTH",
  "FIGHT",
  "FILMS",
  "FILTH",
  "FIRST",
  "FIXED",
  "FLASH",
  "FLEET",
  "FLESH",
  "FLOAT",
  "FLOOD",
  "FLOUR",
  "FLUID",
  "FOCUS",
  "FORCE",
  "FORGE",
  "FORTH",
  "FORTY",
  "FORUM",
  "FRAME",
  "FRANK",
  "FRAUD",
  "FREED",
  "FRIED",
  "FRONT",
  "FUNNY",
  "GIANT",
  "GIVEN",
  "GLASS",
  "GLOBE",
  "GLOVE",
  "GLORY",
  "GRACE",
  "GRADE",
  "GRAIN",
  "GRAND",
  "GRANT",
  "GRASS",
  "GREAT",
  "GRIEF",
  "GRILL",
  "GRIND",
  "GROUP",
  "GROWN",
  "GUARD",
  "GUESS",
  "GUEST",
  "GUIDE",
  "GUILT",
  "HABIT",
  "HANDS",
  "HARSH",
  "HASTE",
  "HATED",
  "HAVEN",
  "HAZEL",
  "HEARD",
  "HEAVY",
  "HELLO",
  "HENCE",
  "HIKER",
  "HINGE",
  "HOBBY",
  "HONOR",
  "HOOPS",
  "HOTEL",
  "HUMAN",
  "HUMOR",
  "IDEAL",
  "IMAGE",
  "IMPLY",
  "INDEX",
  "INNER",
  "INPUT",
  "INTRO",
  "ISSUE",
  "IVORY",
  "JEWEL",
  "JOKER",
  "JUDGE",
  "JUICE",
  "KNIFE",
  "KNOCK",
  "KNOWN",
  "LABEL",
  "LARGE",
  "LASER",
  "LATER",
  "LAYER",
  "LEARN",
  "LEAST",
  "LEAVE",
  "LEGAL",
  "LIFTS",
  "LIMIT",
  "LINEN",
  "LIVER",
  "LOCAL",
  "LOGIC",
  "LOOSE",
  "LOWER",
  "LUCKY",
  "LUNAR",
  "LYRIC",
  "MAJOR",
  "MAKER",
  "MANGO",
  "MARCH",
  "MATCH",
  "MAYBE",
  "MEALS",
  "MEANT",
  "MEDAL",
  "MEDIA",
  "MELON",
  "MERCY",
  "MERIT",
  "METER",
  "MIGHT",
  "MINOR",
  "MINUS",
  "MODEL",
  "MOIST",
  "MONTH",
  "MORAL",
  "MOTOR",
  "MOUNT",
  "MOUTH",
  "MOVIE",
  "NEVER",
  "NEWER",
  "NOBLE",
  "NOISE",
  "NORTH",
  "NOTED",
  "NOVEL",
  "NURSE",
  "OCCUR",
  "OFFER",
  "OFTEN",
  "OLDER",
  "OLIVE",
  "ONION",
  "OPERA",
  "ORDER",
  "OTHER",
  "OUTER",
  "OWNER",
  "OXIDE",
  "PANEL",
  "PANIC",
  "PARTY",
  "PASTA",
  "PATCH",
  "PAUSE",
  "PEACE",
  "PHASE",
  "PHOTO",
  "PILOT",
  "PITCH",
  "PLACE",
  "PLAIN",
  "PLATE",
  "PLAZA",
  "PLEAD",
  "PLUMB",
  "POEMS",
  "POKER",
  "POLAR",
  "PORCH",
  "POUND",
  "PRESS",
  "PRICE",
  "PRIDE",
  "PRIME",
  "PRINT",
  "PRIZE",
  "PROOF",
  "PROUD",
  "PROVE",
  "QUEEN",
  "QUICK",
  "QUIET",
  "QUITE",
  "QUOTE",
  "RADAR",
  "RADIO",
  "RAISE",
  "RALLY",
  "RANGE",
  "RAPID",
  "RATIO",
  "REACH",
  "REACT",
  "READY",
  "REALM",
  "REBEL",
  "RECAP",
  "REFER",
  "RELAX",
  "REPLY",
  "RESET",
  "RIDER",
  "RIDGE",
  "RIGHT",
  "RISKY",
  "ROAST",
  "ROUGH",
  "ROUTE",
  "RURAL",
  "SAFER",
  "SAINT",
  "SAUCE",
  "SCALE",
  "SCENE",
  "SCOPE",
  "SCOUT",
  "SCREW",
  "SEEDS",
  "SEIZE",
  "SENSE",
  "SERVE",
  "SEVEN",
  "SHADE",
  "SHAKE",
  "SHALL",
  "SHAPE",
  "SHARE",
  "SHARP",
  "SHEET",
  "SHIRT",
  "SHOCK",
  "SHORE",
  "SHORT",
  "SHOUT",
  "SIGHT",
  "SILLY",
  "SINCE",
  "SIXTH",
  "SKILL",
  "SKIRT",
  "SKULL",
  "SLICE",
  "SLIDE",
  "SLOPE",
  "SMALL",
  "SMELL",
  "SMITH",
  "SNACK",
  "SNOWY",
  "SOLID",
  "SOLVE",
  "SORRY",
  "SOUTH",
  "SPARE",
  "SPEAK",
  "SPEAR",
  "SPELL",
  "SPEND",
  "SPICE",
  "SPILL",
  "SPINE",
  "SPLIT",
  "SPOIL",
  "SPORT",
  "SPRAY",
  "SQUAD",
  "STACK",
  "STAFF",
  "STAGE",
  "STAIR",
  "STAKE",
  "STAMP",
  "STAND",
  "STARE",
  "STEAM",
  "STEEL",
  "STEEP",
  "STICK",
  "STILL",
  "STOCK",
  "STOLE",
  "STORE",
  "STORY",
  "STRAP",
  "STRIP",
  "STUCK",
  "STUDY",
  "STYLE",
  "SUEDE",
  "SUITE",
  "SUPER",
  "SUSHI",
  "SWAMP",
  "SWEAT",
  "SWEEP",
  "SWIFT",
  "SWING",
  "SWORD",
  "TAKEN",
  "TASTE",
  "TEACH",
  "TEARS",
  "TEETH",
  "THANK",
  "THEIR",
  "THEME",
  "THERE",
  "THESE",
  "THICK",
  "THIEF",
  "THING",
  "THINK",
  "THIRD",
  "THOSE",
  "THREE",
  "THROW",
  "THUMB",
  "TIDAL",
  "TIGHT",
  "TIRED",
  "TITLE",
  "TODAY",
  "TOKEN",
  "TOOLS",
  "TOOTH",
  "TOPIC",
  "TOTAL",
  "TOUCH",
  "TOUGH",
  "TOWER",
  "TRACE",
  "TRADE",
  "TRAIL",
  "TRIAL",
  "TRICK",
  "TRIED",
  "TRIPS",
  "TRUCK",
  "TRULY",
  "TRUST",
  "TRUTH",
  "TULIP",
  "TWICE",
  "UNDER",
  "UNION",
  "UNITE",
  "UNITY",
  "UNTIL",
  "UPPER",
  "UPSET",
  "URBAN",
  "USAGE",
  "USUAL",
  "VALID",
  "VIDEO",
  "VIRAL",
  "VISIT",
  "VITAL",
  "VOICE",
  "VOTER",
  "WAGON",
  "WAIST",
  "WASTE",
  "WATCH",
  "WEARY",
  "WEIGH",
  "WEIRD",
  "WHICH",
  "WHILE",
  "WHITE",
  "WHOLE",
  "WHOSE",
  "WIDEN",
  "WIDTH",
  "WITCH",
  "WOMAN",
  "WOMEN",
  "WORRY",
  "WORSE",
  "WORST",
  "WORTH",
  "WOULD",
  "WOUND",
  "WRIST",
  "WRITE",
  "WRONG",
  "YACHT",
  "YEARS",
  "YIELD",
  "YOUNG",
  "YOUTH",
]);

function word() {
  const answer = wordList[dayIndex(wordList.length)],
    date = localDay(),
    storeKey = "krillion.word." + date;
  let state;
  try {
    state = JSON.parse(localStorage.getItem(storeKey));
  } catch {}
  state = state || { guesses: [], hard: false };
  let draft = "",
    notice = "";
  function done() {
    return state.guesses.includes(answer) || state.guesses.length >= 6;
  }
  function save() {
    localStorage.setItem(storeKey, JSON.stringify(state));
  }
  function submit() {
    if (done()) return;
    if (draft.length !== 5) {
      notice = "Not enough letters";
      render();
      return;
    }
    if (!wordAllowed.has(draft)) {
      notice = "Not in the word list";
      render();
      return;
    }
    if (state.hard && state.guesses.length) {
      for (const g of state.guesses) {
        const status = paintWord(answer, g),
          required = {};
        for (let i = 0; i < 5; i++) {
          if (status[i] === "hit" && draft[i] !== g[i]) {
            notice = "Hard mode: keep green letters in place";
            render();
            return;
          }
          if (status[i] !== "miss") required[g[i]] = (required[g[i]] || 0) + 1;
        }
        for (const [ch, n] of Object.entries(required))
          if ([...draft].filter((x) => x === ch).length < n) {
            notice = "Hard mode: use all revealed letters, including repeats";
            render();
            return;
          }
      }
    }
    state.guesses.push(draft);
    draft = "";
    save();
    if (done())
      award(
        "Wordle",
        state.guesses.includes(answer) ? 150 : 20,
        state.guesses.includes(answer),
      );
    render();
  }
  function press(k) {
    if (done()) return;
    if (k === "ENTER") submit();
    else if (k === "BACKSPACE") {
      draft = draft.slice(0, -1);
      render();
    } else if (/^[A-Z]$/.test(k) && draft.length < 5) {
      draft += k;
      render();
    }
  }
  function render() {
    const ended = done();
    let keyboard = {};
    for (const g of state.guesses) {
      let statuses = paintWord(answer, g);
      for (let i = 0; i < 5; i++) {
        const ch = g[i],
          s = statuses[i];
        if (
          { miss: 0, near: 1, hit: 2 }[s] >
          ({ miss: 0, near: 1, hit: 2 }[keyboard[ch]] ?? -1)
        )
          keyboard[ch] = s;
      }
    }
    let rows = Array.from({ length: 6 }, (_, row) => {
      const w =
        state.guesses[row] || (row === state.guesses.length ? draft : "");
      const status = state.guesses[row] ? paintWord(answer, w) : [];
      return Array.from(
        { length: 5 },
        (_, col) =>
          '<div class="tile ' +
          (status[col] || "") +
          '" aria-label="row ' +
          (row + 1) +
          " column " +
          (col + 1) +
          '">' +
          esc(w[col] || "") +
          "</div>",
      ).join("");
    }).join("");
    layout(
      '<section class="panel game center"><div class="eyebrow">Daily word puzzle</div><div class="topline"><h2>Wordle</h2><label class="tiny"><input id="hard" type="checkbox" ' +
        (state.hard ? "checked" : "") +
        " " +
        (state.guesses.length ? "disabled" : "") +
        '> Hard mode</label></div><p>Guess the five-letter word in six tries. Green is the correct spot. Yellow means the letter belongs elsewhere.</p><div class="word-grid">' +
        rows +
        '</div><p class="' +
        (notice ? "wrong" : "tiny") +
        '" aria-live="polite">' +
        esc(
          ended
            ? state.guesses.includes(answer)
              ? "Solved in " + state.guesses.length + "/6! 🎉"
              : "The word was " + answer
            : notice || "Use your keyboard or the keys below.",
        ) +
        '</p><div class="keyboard">' +
        [..."QWERTYUIOPASDFGHJKLZXCVBNM"]
          .map(
            (k) =>
              '<button data-k="' +
              k +
              '" class="' +
              (keyboard[k] || "") +
              '">' +
              k +
              "</button>",
          )
          .join("") +
        '<button data-k="ENTER">ENTER</button><button data-k="BACKSPACE">⌫</button></div><div class="inline" style="justify-content:center"><button class="btn" id="wordshare" ' +
        (!ended ? "disabled" : "") +
        '>Share result</button><button class="btn" data-go="home">Games</button></div></section>',
    );
    root
      .querySelectorAll("[data-k]")
      .forEach((el) => (el.onclick = () => press(el.dataset.k)));
    document.querySelector("#hard").onchange = (e) => {
      state.hard = e.target.checked;
      save();
    };
    document.querySelector("#wordshare").onclick = () => {
      const result = state.guesses
        .map((g) =>
          paintWord(answer, g)
            .map((s) => ({ hit: "🟩", near: "🟨", miss: "⬛" })[s])
            .join(""),
        )
        .join("\n");
      navigator.clipboard
        ?.writeText(
          "Wordle " +
            date +
            " " +
            (state.guesses.includes(answer) ? state.guesses.length : "X") +
            "/6\n" +
            result,
        )
        .then(() => {
          notice = "Copied!";
          render();
        })
        .catch(() => {
          notice = "Clipboard unavailable. Try sharing in a secure browser.";
          render();
        });
    };
  }
  const keyboardHandler = (e) => {
    if (
      location.hash !== "#word" ||
      e.target.matches("input,textarea") ||
      (e.key === "Enter" && e.target.matches("button"))
    )
      return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const k = e.key.toUpperCase();
    if (k === "ENTER" || k === "BACKSPACE" || /^[A-Z]$/.test(k)) {
      e.preventDefault();
      press(k);
    }
  };
  window.removeEventListener("keydown", window._wordKeys);
  window._wordKeys = keyboardHandler;
  window.addEventListener("keydown", keyboardHandler);
  render();
}
function connections() {
  const date = localDay(),
    key = "krillion.connections." + date,
    idx = dayIndex(groups.length),
    answers = groups[idx],
    labels = groupLabels[idx];
  let state;
  try {
    state = JSON.parse(localStorage.getItem(key));
  } catch {}
  state = state || {
    order: shuffle(answers.flat()),
    selected: [],
    solved: [],
    mistakes: 0,
    history: [],
    awarded: false,
  };
  const save = () => localStorage.setItem(key, JSON.stringify(state));
  const ended = () => state.solved.length === 4 || state.mistakes >= 4;
  function render() {
    const selected = state.selected,
      solved = state.solved,
      mistakes = state.mistakes;
    layout(
      '<section class="game center"><div class="eyebrow">Daily puzzle</div><h2>Connections</h2><p>Find four groups of four words. The groups go from easiest (yellow) to hardest (purple).</p><div class="topline"><span class="muted">Mistakes remaining: ' +
        "● ".repeat(Math.max(0, 4 - mistakes)) +
        '</span><span class="muted">' +
        solved.length +
        '/4 solved</span></div><div class="connections" style="margin:22px 0">' +
        state.order
          .filter(
            (w) => !solved.includes(answers.findIndex((g) => g.includes(w))),
          )
          .map(
            (w) =>
              '<button class="conn ' +
              (selected.includes(w) ? "sel " : "") +
              (solved.includes(answers.findIndex((g) => g.includes(w)))
                ? "solved"
                : "") +
              '" data-word="' +
              esc(w) +
              '" ' +
              (solved.includes(answers.findIndex((g) => g.includes(w))) ||
              ended()
                ? "disabled"
                : "") +
              ">" +
              esc(w) +
              "</button>",
          )
          .join("") +
        '</div><div class="inline" style="justify-content:center"><button class="btn" id="shuffleconn">Shuffle</button><button class="btn" id="clearconn">Deselect All</button><button class="btn primary" id="checkconn">Submit</button></div><p id="connmsg">' +
        (ended()
          ? solved.length === 4
            ? "Perfect!"
            : "No more guesses"
          : "Select four related words.") +
        '</p><div class="results">' +
        (ended() && solved.length < 4 ? answers.map((_, i) => i) : solved)
          .map(
            (i) =>
              '<div class="answer" style="background:' +
              ["#6e591c", "#166658", "#29517c", "#58427a"][i] +
              '"><strong>' +
              esc(labels[i]) +
              "</strong><span>" +
              answers[i].join(" • ") +
              "</span></div>",
          )
          .join("") +
        "</div>" +
        (ended()
          ? '<button class="btn" id="connshare">Share result</button>'
          : "") +
        "</section>",
    );
    root.querySelectorAll("[data-word]").forEach(
      (el) =>
        (el.onclick = () => {
          const w = el.dataset.word;
          if (state.selected.includes(w))
            state.selected = state.selected.filter((x) => x !== w);
          else if (state.selected.length < 4) state.selected.push(w);
          save();
          render();
        }),
    );
    document.querySelector("#clearconn").onclick = () => {
      state.selected = [];
      save();
      render();
    };
    document.querySelector("#shuffleconn").onclick = () => {
      state.order = shuffle(state.order);
      save();
      render();
    };
    document.querySelector("#checkconn").onclick = () => {
      if (selected.length !== 4 || ended()) return;
      const chosen = [...selected];
      const group = answers.findIndex((g) =>
        g.every((w) => chosen.includes(w)),
      );
      state.history.push(
        chosen.map((w) => answers.findIndex((g) => g.includes(w))),
      );
      if (group >= 0 && !state.solved.includes(group)) {
        state.solved.push(group);
      } else {
        state.mistakes++;
      }
      state.selected = [];
      if (ended() && !state.awarded) {
        state.awarded = true;
        award(
          "Connections",
          state.solved.length === 4 ? 200 : state.solved.length * 25,
          state.solved.length === 4,
        );
      }
      save();
      render();
      if (group < 0 && !ended())
        document.querySelector("#connmsg").textContent = answers.some(
          (g) => g.filter((w) => chosen.includes(w)).length === 3,
        )
          ? "One away…"
          : "Not quite. Try again.";
    };
    const share = document.querySelector("#connshare");
    if (share)
      share.onclick = () => {
        const squares = ["🟨", "🟩", "🟦", "🟪"];
        navigator.clipboard
          ?.writeText(
            "Connections " +
              date +
              "\n" +
              state.history
                .map((row) => row.map((i) => squares[i]).join(""))
                .join("\n"),
          )
          .then(() => {
            document.querySelector("#connmsg").textContent = "Copied!";
          })
          .catch(() => {
            document.querySelector("#connmsg").textContent =
              "Clipboard unavailable in this browser.";
          });
      };
  }
  render();
}
function numbers() {
  let order = shuffle(Array.from({ length: 16 }, (_, i) => i + 1)),
    next = 1,
    start = performance.now();
  function render() {
    layout(
      '<section class="game panel center"><div class="eyebrow">Speed challenge</div><h2>Number Hunt</h2><p>Click the numbers from 1 to 16 as quickly as you can.</p><div class="stat">Next: <strong>' +
        next +
        '</strong></div><div class="numgrid">' +
        order
          .map(
            (n) =>
              '<button data-n="' +
              n +
              '" class="' +
              (n < next ? "found" : "") +
              '" ' +
              (n < next ? "disabled" : "") +
              ">" +
              n +
              "</button>",
          )
          .join("") +
        '</div><p id="nummsg">Stay focused!</p></section>',
    );
    root.querySelectorAll("[data-n]").forEach(
      (b) =>
        (b.onclick = () => {
          if (+b.dataset.n !== next) return;
          next++;
          if (next === 17) {
            let time = ((performance.now() - start) / 1000).toFixed(2);
            award(
              "Number Hunt",
              Math.max(20, Math.round(200 - Number(time) * 3)),
            );
            layout(
              '<section class="game panel center"><div class="big">🏆</div><h2>Finished in ' +
                time +
                ' seconds!</h2><button class="btn primary" data-go="numbers">Play again</button></section>',
            );
          } else render();
        }),
    );
  }
  render();
}
function reaction() {
  let active = true;
  onCleanup(() => {
    active = false;
    clearTimeout(timeout);
  });
  let phase = "ready",
    start = 0,
    timeout = 0;
  function render(msg = "Wait for the green signal.") {
    layout(
      '<section class="panel game center"><div class="eyebrow">Reflex test</div><h2>Reaction Time</h2><p>Click Start. Wait until the panel turns green, then tap it!</p><button id="target" type="button" style="width:100%;color:white;border:0;background:' +
        (phase === "go"
          ? "#12865b"
          : phase === "waiting"
            ? "#9b3238"
            : "#1d3852") +
        ';padding:90px 10px;border-radius:18px;margin:20px 0;cursor:pointer;font-size:25px;font-weight:900">' +
        (phase === "go"
          ? "CLICK NOW!"
          : phase === "waiting"
            ? "WAIT…"
            : "READY?") +
        "</button><p>" +
        esc(msg) +
        '</p><button id="reactstart" class="btn primary">Start round</button></section>',
    );
    document.querySelector("#reactstart").onclick = () => {
      clearTimeout(timeout);
      phase = "waiting";
      render();
      timeout = setTimeout(
        () => {
          if (!active) return;
          phase = "go";
          start = performance.now();
          render();
        },
        1200 + rand(2500),
      );
    };
    document.querySelector("#target").onclick = () => {
      if (phase === "waiting") {
        clearTimeout(timeout);
        phase = "ready";
        render("Too early! Try again.");
      } else if (phase === "go") {
        let ms = Math.round(performance.now() - start);
        phase = "ready";
        award("Reaction Time", Math.max(10, Math.round(50000 / (ms + 100))));
        render("Your reaction time: " + ms + " milliseconds!");
      }
    };
  }
  render();
}
function memory() {
  let active = true;
  onCleanup(() => (active = false));
  let cards = shuffle(Array.from({ length: 8 }, (_, i) => [i, i]).flat()),
    flipped = [],
    matched = [],
    moves = 0,
    locked = false;
  const symbols = ["🎸", "🚀", "🌈", "🐙", "🍕", "🎲", "⭐", "🦋"];
  function render() {
    layout(
      '<section class="panel game center"><div class="eyebrow">Brain training</div><h2>Memory</h2><p>Match all eight pairs. Moves: ' +
        moves +
        '</p><div class="numgrid">' +
        cards
          .map(
            (v, i) =>
              '<button data-i="' +
              i +
              '" class="' +
              (matched.includes(v) ? "found" : "") +
              '" style="font-size:30px">' +
              (flipped.includes(i) || matched.includes(v) ? symbols[v] : "?") +
              "</button>",
          )
          .join("") +
        "</div></section>",
    );
    root.querySelectorAll("[data-i]").forEach(
      (b) =>
        (b.onclick = () => {
          let i = Number(b.dataset.i),
            v = cards[i];
          if (locked || flipped.includes(i) || matched.includes(v)) return;
          flipped.push(i);
          render();
          if (flipped.length === 2) {
            moves++;
            if (cards[flipped[0]] === cards[flipped[1]]) {
              matched.push(v);
              flipped = [];
              if (matched.length === 8) {
                award("Memory", Math.max(25, 300 - moves * 10));
                setTimeout(() => {
                  if (!active) return;
                  layout(
                    '<section class="game panel center"><div class="big">🧠</div><h2>All pairs matched!</h2><p>' +
                      moves +
                      ' moves</p><button class="btn primary" data-go="memory">Play again</button></section>',
                  );
                }, 350);
              } else render();
            } else {
              locked = true;
              setTimeout(() => {
                if (!active) return;
                flipped = [];
                locked = false;
                render();
              }, 800);
            }
          }
        }),
    );
  }
  render();
}
restore().then(() => navigate(location.hash.slice(1) || "home"));

document.querySelector(".skip-link").onclick = (e) => {
  e.preventDefault();
  document.querySelector("#main")?.focus();
};
