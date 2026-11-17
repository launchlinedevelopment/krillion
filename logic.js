// Pure mechanics shared by the games and regression tests.
export function slide2048(board, direction) {
  const next = [...board];
  let score = 0;
  for (let line = 0; line < 4; line++) {
    const ids = Array.from({ length: 4 }, (_, i) =>
      direction === "left"
        ? line * 4 + i
        : direction === "right"
          ? line * 4 + 3 - i
          : direction === "up"
            ? i * 4 + line
            : (3 - i) * 4 + line,
    );
    const values = ids.map((i) => board[i]).filter(Boolean),
      merged = [];
    for (let i = 0; i < values.length; i++) {
      if (values[i] === values[i + 1]) {
        merged.push(values[i] * 2);
        score += values[i] * 2;
        i++;
      } else merged.push(values[i]);
    }
    ids.forEach((id, i) => (next[id] = merged[i] || 0));
  }
  return { board: next, score, changed: next.some((v, i) => v !== board[i]) };
}
export const canMove2048 = (board) =>
  board.includes(0) ||
  ["left", "right", "up", "down"].some((d) => slide2048(board, d).changed);
export function neighbors(i, size = 8) {
  const row = Math.floor(i / size),
    col = i % size,
    result = [];
  for (let r = -1; r <= 1; r++)
    for (let c = -1; c <= 1; c++)
      if (
        (r || c) &&
        row + r >= 0 &&
        row + r < size &&
        col + c >= 0 &&
        col + c < size
      )
        result.push((row + r) * size + col + c);
  return result;
}
export function revealCells(index, mines, opened, size = 8) {
  const result = new Set(opened),
    queue = [index];
  while (queue.length) {
    const i = queue.pop();
    if (result.has(i) || mines.has(i)) continue;
    result.add(i);
    if (!neighbors(i, size).some((n) => mines.has(n)))
      queue.push(...neighbors(i, size));
  }
  return result;
}

export function paintWord(answer, guess) {
  const result = Array(5).fill("miss"),
    available = [...answer];
  for (let i = 0; i < 5; i++)
    if (guess[i] === answer[i]) {
      result[i] = "hit";
      available[i] = null;
    }
  for (let i = 0; i < 5; i++)
    if (result[i] !== "hit") {
      let k = available.indexOf(guess[i]);
      if (k >= 0) {
        result[i] = "near";
        available[k] = null;
      }
    }
  return result;
}

export function mergeProgress(a = {}, b = {}) {
  a = a || {};
  b = b || {};
  const defaults = {
    xp: 0,
    played: 0,
    best: 0,
    streak: 0,
    lastDay: "",
    wins: {},
  };
  const merged = { ...defaults, ...a, ...b };
  for (const k of ["xp", "played", "best"])
    merged[k] = Math.max(Number(a[k]) || 0, Number(b[k]) || 0);
  merged.wins = {};
  for (const k of new Set([
    ...Object.keys(a.wins || {}),
    ...Object.keys(b.wins || {}),
  ]))
    merged.wins[k] = Math.max(a.wins?.[k] || 0, b.wins?.[k] || 0);
  if ((a.lastDay || "") > (b.lastDay || "")) {
    merged.lastDay = a.lastDay;
    merged.streak = a.streak || 0;
  }
  return merged;
}
