export const catalog = [
  [
    "dive",
    "Krillion",
    "Think rare. Dive deeper.",
    "word",
    "7 rounds",
    "cyan",
    "01",
  ],
  [
    "word",
    "Wordle",
    "Five letters. Six chances.",
    "word",
    "Daily",
    "green",
    "02",
  ],
  [
    "connections",
    "Connections",
    "Find the hidden threads.",
    "word",
    "Daily",
    "purple",
    "03",
  ],
  [
    "2048",
    "2048",
    "Small moves. Big numbers.",
    "logic",
    "Endless",
    "orange",
    "04",
  ],
  [
    "mines",
    "Minesweeper",
    "A little logic. A lot of nerve.",
    "logic",
    "8 × 8",
    "blue",
    "05",
  ],
  [
    "hangman",
    "Hangman",
    "Save the word, one letter at a time.",
    "word",
    "Unlimited",
    "pink",
    "06",
  ],
  [
    "simon",
    "Simon",
    "Watch. Remember. Repeat.",
    "memory",
    "Unlimited",
    "purple",
    "07",
  ],
  [
    "reaction",
    "Reaction Time",
    "Blink and you’ll miss it.",
    "speed",
    "Reflex test",
    "orange",
    "08",
  ],
  [
    "memory",
    "Memory",
    "Make a connection. Then another.",
    "memory",
    "8 pairs",
    "pink",
    "09",
  ],
  [
    "numbers",
    "Number Hunt",
    "Sixteen numbers. One fast brain.",
    "speed",
    "Time trial",
    "green",
    "10",
  ],
];
export function art(id) {
  if (id === "dive")
    return '<div class="sonar"></div><div class="submarine"><span></span><i></i><b></b></div><div class="bubble b1"></div><div class="bubble b2"></div><div class="bubble b3"></div><span class="depth-label">↓ 7,000 m</span>';
  if (id === "word")
    return (
      '<div class="mini-word">' +
      [..."PLAY?"].map((x, i) => `<b class="mw${i}">${x}</b>`).join("") +
      "</div>"
    );
  if (id === "connections")
    return (
      '<div class="mini-connect">' +
      Array.from(
        { length: 12 },
        (_, i) => `<i class="c${Math.floor(i / 4)}"></i>`,
      ).join("") +
      "</div>"
    );
  if (id === "2048")
    return '<div class="mini-2048"><b>2</b><b>8</b><b>64</b><b>2048</b></div>';
  if (id === "mines")
    return (
      '<div class="mini-mines">' +
      ["", "1", "⚑", "1", "2", "", "", "✦", ""]
        .map((x) => `<b>${x}</b>`)
        .join("") +
      "</div>"
    );
  if (id === "simon")
    return '<div class="mini-simon"><i></i><i></i><i></i><i></i></div>';
  return `<span class="art-glyph">${{ hangman: "A _ Z", reaction: "ϟ", memory: "✿", numbers: "1 2 3" }[id]}</span><div class="art-orbit"></div>`;
}
export function homeView(progress, username) {
  const level = Math.floor(progress.xp / 500) + 1;
  return `<div class="lobby-top"><span class="eyebrow"><i class="status-dot"></i> YOUR NEXT HIGH SCORE STARTS HERE</span><span class="tiny">10 games. Zero downloads.</span></div>
 <section class="hero"><div class="hero-copy"><span class="season-label">THE ARCADE IS OPEN <span>✦</span></span><h1>A little escape.<br><em>A lot of play.</em></h1><p>Your daily brain break, upgraded. Dive into clever puzzles, chase a personal best, or just play one more round.</p><div class="inline"><button class="btn primary" data-go="dive">Let’s dive in <span>↗</span></button><button class="btn ghost" id="surprise">Surprise me <span>⚄</span></button></div><div class="hero-note"><span class="keycap">↵</span> Free to play. Hard to put down.</div></div><div class="hero-art" aria-hidden="true"><div class="orbital o1"></div><div class="orbital o2"></div><div class="hero-star s1">✦</div><div class="hero-star s2">✧</div><div class="float-block block-word">W<span>O</span>R</div><div class="float-block block-2048">2048</div><div class="float-block block-connect"><i></i><i></i><i></i><i></i></div><div class="float-block block-bolt">ϟ</div><div class="art-caption"><i class="status-dot"></i> GOOD TIMES, LOADING…</div></div></section>
 <section class="player-strip" aria-label="Your progress"><div class="player-greeting"><div class="avatar">${username ? username[0].toUpperCase() : "✦"}</div><div><b>${username ? "Welcome back, " + username : "Hey, player."}</b><span>Make today a personal best.</span></div></div><div class="strip-stat"><b>${progress.streak}<small> 🔥</small></b><span>day streak</span></div><div class="strip-stat"><b>${progress.played}</b><span>games played</span></div><div class="level-stat"><div><b>Level ${level}</b><span>${progress.xp % 500} / 500 XP</span></div><div class="bar"><div style="width:${(progress.xp % 500) / 5}%"></div></div></div><button class="text-button" data-go="profile">Your progress ↗</button></section>
 <section class="library" id="library"><div class="library-heading"><div><span class="eyebrow">PICK YOUR NEXT OBSESSION</span><h2>The good stuff<span class="count">10</span></h2></div><label class="search-wrap"><span>⌕</span><input id="game-search" aria-label="Search games" placeholder="Find your game…" type="search"></label></div><div class="filters" role="group" aria-label="Game categories">${[
   ["all", "All games"],
   ["word", "Words & trivia"],
   ["logic", "Logic"],
   ["speed", "Quick reflexes"],
   ["memory", "Memory"],
 ]
   .map(
     ([id, name]) =>
       `<button class="filter ${id === "all" ? "active" : ""}" data-filter="${id}" aria-pressed="${id === "all"}">${name}</button>`,
   )
   .join(
     "",
   )}</div><div class="game-cards">${catalog.map(([id, name, desc, category, time, color, num]) => `<button class="game-card ${color}" data-go="${id}" data-category="${category}" data-title="${name.toLowerCase()}"><div class="card-art">${art(id)}<span class="card-number">/${num}</span>${["2048", "mines", "hangman", "simon"].includes(id) ? '<span class="new-tag">NEW</span>' : ""}</div><div class="card-info"><div class="card-title"><h3>${name}</h3><span class="card-arrow">↗</span></div><p>${desc}</p><div class="card-meta"><span>${category === "word" ? "WORDS & TRIVIA" : category.toUpperCase()}</span><span>◷ ${time}</span></div></div></button>`).join("")}</div><p id="empty-games" hidden>No games found. Try a different search.</p></section><section class="bottom-banner"><span class="banner-star">✧</span><div><h3>A little better every day.</h3><p>Play, earn XP, and collect achievements. Your next level is closer than you think.</p></div><button class="btn" data-go="profile">See your achievements ↗</button></section>`;
}
