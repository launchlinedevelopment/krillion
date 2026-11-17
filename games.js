import { slide2048, canMove2048, neighbors, revealCells } from "./logic.js";
export function extraGames({
  root,
  layout,
  award,
  shuffle,
  rand,
  esc,
  onCleanup,
  celebrate,
}) {
  const heading = (tag, title, desc) =>
    `<div class="eyebrow">${tag}</div><h1>${title}</h1><p>${desc}</p>`;
  const end = (title, detail, id) => {
    layout(
      `<section class="panel game center">${heading("ROUND COMPLETE", title, detail)}<button class="btn primary" data-go="${id}">Play again ↻</button><button class="btn" data-go="home">All games</button></section>`,
    );
  };
  function tiles() {
    let state;
    try {
      state = JSON.parse(localStorage.getItem("krillion.2048"));
    } catch {}
    let board = state?.board?.length === 16 ? state.board : Array(16).fill(0),
      score = state?.score || 0,
      won = state?.won || false;
    const spawn = () => {
      const free = board
        .map((v, i) => (v ? null : i))
        .filter((i) => i !== null);
      if (free.length)
        board[free[rand(free.length)]] = Math.random() < 0.9 ? 2 : 4;
    };
    if (!state) {
      spawn();
      spawn();
    }
    const save = () =>
      localStorage.setItem(
        "krillion.2048",
        JSON.stringify({ board, score, won }),
      );
    const render = () => {
      layout(
        `<section class="panel game center">${heading("MERGE YOUR WAY UP", "2048", "Use the arrow keys, swipe, or tap the controls. Merge equal tiles to reach 2048.")}<div class="score-line"><span>Score <b>${score}</b></span><button class="pill" id="reset2048">New game</button></div><div class="board2048" id="board2048" aria-label="2048 board">${board.map((v) => `<div class="cell2048 value-${Math.min(v, 2048)}">${v || ""}</div>`).join("")}</div><p aria-live="polite">${!canMove2048(board) ? "No moves left. Start a new game." : won ? "2048 reached! Keep going for a higher score." : "Every move counts."}</p><div class="direction-controls">${[
          ["up", "↑"],
          ["left", "←"],
          ["down", "↓"],
          ["right", "→"],
        ]
          .map(
            ([d, t]) =>
              `<button class="btn" data-direction="${d}" aria-label="Move ${d}">${t}</button>`,
          )
          .join("")}</div></section>`,
      );
      root
        .querySelectorAll("[data-direction]")
        .forEach((b) => (b.onclick = () => move(b.dataset.direction)));
      root.querySelector("#reset2048").onclick = () => {
        localStorage.removeItem("krillion.2048");
        tiles();
      };
      const el = root.querySelector("#board2048");
      let touch;
      el.ontouchstart = (e) => {
        touch = e.touches[0];
      };
      el.ontouchend = (e) => {
        if (!touch) return;
        const x = e.changedTouches[0].clientX - touch.clientX,
          y = e.changedTouches[0].clientY - touch.clientY;
        if (Math.max(Math.abs(x), Math.abs(y)) > 20)
          move(
            Math.abs(x) > Math.abs(y)
              ? x > 0
                ? "right"
                : "left"
              : y > 0
                ? "down"
                : "up",
          );
      };
    };
    function move(d) {
      const result = slide2048(board, d);
      if (!result.changed) return;
      board = result.board;
      score += result.score;
      spawn();
      if (board.some((v) => v >= 2048) && !won) {
        won = true;
        award("2048", 400);
        celebrate();
      } else if (!canMove2048(board) && !state?.ended) {
        award("2048", Math.max(10, Math.floor(score / 50)), false);
        state = { ended: true };
      }
      save();
      render();
    }
    const handler = (e) => {
      if (location.hash !== "#2048" || e.altKey || e.metaKey || e.ctrlKey)
        return;
      const d = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      }[e.key];
      if (d) {
        e.preventDefault();
        move(d);
      }
    };
    window.removeEventListener("keydown", window._tilesKeys);
    window._tilesKeys = handler;
    window.addEventListener("keydown", handler);
    render();
    save();
  }
  function mines() {
    let bombs = new Set(),
      opened = new Set(),
      flags = new Set(),
      first = true,
      finished = false,
      flagMode = false;
    function render(msg = "First click is always safe.") {
      layout(
        `<section class="game panel center">${heading("A FIELD OF POSSIBILITIES", "Minesweeper", "Reveal every safe square. Numbers show nearby mines. Right-click or switch to flag mode to mark a mine.")}<div class="score-line"><span>⚑ ${10 - flags.size} mines</span><button class="pill ${flagMode ? "selected" : ""}" id="flag-mode">${flagMode ? "Flag mode ON" : "Reveal mode"} ⇄</button><button class="pill" data-go="mines">Restart</button></div><div class="mine-board">${Array.from(
          { length: 64 },
          (_, i) => {
            const n = neighbors(i).filter((j) => bombs.has(j)).length,
              open = opened.has(i);
            return `<button data-cell="${i}" class="mine-cell ${open ? "open" : ""} n${n}" aria-label="Square ${i + 1}${flags.has(i) ? ", flagged" : open ? ", " + n + " adjacent mines" : ""}" ${finished || open ? "disabled" : ""}>${finished && bombs.has(i) ? "✹" : flags.has(i) ? "⚑" : open ? n || "·" : ""}</button>`;
          },
        ).join("")}</div><p aria-live="polite">${msg}</p></section>`,
      );
      root.querySelector("#flag-mode").onclick = () => {
        flagMode = !flagMode;
        render();
      };
      root.querySelectorAll("[data-cell]").forEach((b) => {
        const i = +b.dataset.cell;
        const flag = () => {
          if (finished || opened.has(i)) return;
          if (flags.has(i)) flags.delete(i);
          else if (flags.size < 10) flags.add(i);
          render();
        };
        b.oncontextmenu = (e) => {
          e.preventDefault();
          flag();
        };
        b.onclick = () => {
          if (flagMode) {
            flag();
            return;
          }
          if (flags.has(i) || finished) return;
          if (first) {
            const safe = new Set([i, ...neighbors(i)]);
            bombs = new Set(
              shuffle(
                Array.from({ length: 64 }, (_, i) => i).filter(
                  (i) => !safe.has(i),
                ),
              ).slice(0, 10),
            );
            first = false;
          }
          if (bombs.has(i)) {
            finished = true;
            award("Minesweeper", 10, false);
            render("Mine hit! Start a new field and try again.");
            return;
          }
          opened = revealCells(i, bombs, opened);
          flags = new Set([...flags].filter((i) => !opened.has(i)));
          if (opened.size === 54) {
            finished = true;
            award("Minesweeper", 200);
            celebrate();
            render("Field cleared! +200 XP");
          } else render();
        };
      });
    }
    render();
  }
  function hangman() {
    const bank = [
      ["ASTEROID", "Space"],
      ["KEYBOARD", "At your desk"],
      ["JELLYFISH", "Ocean life"],
      ["LABYRINTH", "A place to get lost"],
      ["CHAMELEON", "An animal"],
      ["SYMPHONY", "Music"],
      ["SUNFLOWER", "In the garden"],
      ["AVALANCHE", "In the mountains"],
      ["CHROMIUM", "An element"],
      ["BLUEPRINT", "A design"],
    ];
    const [answer, hint] = bank[rand(bank.length)];
    let guesses = [],
      awarded = false;
    function press(ch) {
      if (awarded || guesses.includes(ch)) return;
      guesses.push(ch);
      render();
    }
    function render() {
      const wrong = guesses.filter((ch) => !answer.includes(ch)),
        won = [...answer].every((ch) => guesses.includes(ch)),
        lost = wrong.length >= 6;
      if ((won || lost) && !awarded) {
        awarded = true;
        award("Hangman", won ? 120 : 10, won);
        if (won) celebrate();
      }
      layout(
        `<section class="panel game center">${heading("ONE LETTER AT A TIME", "Hangman", `Clue: ${hint}. You have six incorrect guesses.`)}<svg class="hangman-art" viewBox="0 0 200 160" aria-label="${wrong.length} of 6 wrong guesses"><path d="M20 150H150 M45 150V15H120V35"/>${['<circle cx="120" cy="50" r="15"/>', '<path d="M120 65V105"/>', '<path d="M120 75L95 90"/>', '<path d="M120 75L145 90"/>', '<path d="M120 105L100 135"/>', '<path d="M120 105L140 135"/>'].slice(0, wrong.length).join("")}</svg><div class="hangman-word">${[...answer].map((ch) => `<span>${guesses.includes(ch) || lost ? ch : "_"}</span>`).join("")}</div><p aria-live="polite">${won ? "Word saved! +120 XP" : lost ? "The word was " + answer : 6 - wrong.length + " guesses remaining"}</p><div class="keyboard">${[..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].map((ch) => `<button data-letter="${ch}" ${guesses.includes(ch) || awarded ? "disabled" : ""} class="${guesses.includes(ch) ? (answer.includes(ch) ? "hit" : "miss") : ""}">${ch}</button>`).join("")}</div>${awarded ? '<button class="btn primary" data-go="hangman">Next word →</button>' : ""}</section>`,
      );
      root
        .querySelectorAll("[data-letter]")
        .forEach((b) => (b.onclick = () => press(b.dataset.letter)));
    }
    const handler = (e) => {
      if (
        location.hash === "#hangman" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        /^[a-z]$/i.test(e.key)
      )
        press(e.key.toUpperCase());
    };
    window.removeEventListener("keydown", window._hangKeys);
    window._hangKeys = handler;
    window.addEventListener("keydown", handler);
    render();
  }
  function simon() {
    let sequence = [],
      index = 0,
      playing = false,
      alive = true,
      scheduled = [];
    onCleanup(() => {
      alive = false;
      scheduled.forEach(clearTimeout);
    });
    const later = (fn, ms) =>
      scheduled.push(
        setTimeout(() => {
          if (alive) fn();
        }, ms),
      );
    function flash(i) {
      const el = root.querySelector(`[data-pad="${i}"]`);
      if (el) {
        el.classList.add("lit");
        later(() => el.classList.remove("lit"), 300);
      }
    }
    function next() {
      playing = false;
      index = 0;
      sequence.push(rand(4));
      render("Watch the sequence…");
      sequence.forEach((i, j) => later(() => flash(i), 500 + j * 600));
      later(
        () => {
          playing = true;
          const msg = root.querySelector("#simon-msg");
          if (msg) msg.textContent = "Your turn. Repeat the pattern.";
        },
        600 + sequence.length * 600,
      );
    }
    function render(msg = "Ready when you are.") {
      layout(
        `<section class="panel game center">${heading("TUNE IN. KEEP UP.", "Simon", "Watch the pads light up, then repeat the sequence. Each round adds one more.")}<p>Round <b>${sequence.length || 1}</b></p><div class="simon-board">${["Mint", "Purple", "Coral", "Blue"].map((name, i) => `<button class="simon-pad pad-${i}" data-pad="${i}" aria-label="${name} pad">${i + 1}</button>`).join("")}</div><p id="simon-msg" aria-live="polite">${msg}</p>${sequence.length ? "" : '<button class="btn primary" id="simon-start">Start sequence</button>'}</section>`,
      );
      const start = root.querySelector("#simon-start");
      if (start) start.onclick = next;
      root.querySelectorAll("[data-pad]").forEach(
        (b) =>
          (b.onclick = () => {
            if (!playing) return;
            const i = +b.dataset.pad;
            flash(i);
            if (i !== sequence[index]) {
              playing = false;
              award(
                "Simon",
                Math.max(10, (sequence.length - 1) * 20),
                sequence.length > 1,
              );
              later(
                () =>
                  end(
                    "Sequence complete",
                    `You remembered ${sequence.length - 1} rounds. Try to beat it!`,
                    "simon",
                  ),
                400,
              );
              return;
            }
            index++;
            if (index === sequence.length) {
              playing = false;
              later(next, 700);
            }
          }),
      );
    }
    render();
  }
  return { 2048: tiles, mines, hangman, simon };
}
