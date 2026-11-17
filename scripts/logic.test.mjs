import { test } from "node:test";
import assert from "node:assert/strict";
import {
  slide2048,
  canMove2048,
  neighbors,
  revealCells,
  paintWord,
  mergeProgress,
} from "../logic.js";
import {
  questions,
  matchAnswer,
  wordList,
  groups,
  groupLabels,
} from "../data.js";
test("2048 merges each tile once and scores correctly", () => {
  const b = [2, 2, 2, 2, ...Array(12).fill(0)];
  const r = slide2048(b, "left");
  assert.deepEqual(r.board.slice(0, 4), [4, 4, 0, 0]);
  assert.equal(r.score, 8);
  assert.deepEqual(b.slice(0, 4), [2, 2, 2, 2]);
});
test("2048 handles all four directions and invalid moves", () => {
  for (const [d, indices] of [
    ["left", [0, 4]],
    ["right", [3, 7]],
    ["up", [0, 1]],
    ["down", [12, 13]],
  ]) {
    const b = Array(16).fill(0);
    if (d === "up" || d === "down") {
      b[0] = b[4] = b[1] = b[5] = 2;
    } else {
      b[0] = b[1] = b[4] = b[5] = 2;
    }
    const r = slide2048(b, d);
    assert.equal(r.score, 8);
    indices.forEach((i) => assert.equal(r.board[i], 4));
    assert.equal(r.board.filter(Boolean).length, 2);
  }
  assert.equal(
    slide2048([2, 0, 0, 0, ...Array(12).fill(0)], "left").changed,
    false,
  );
});
test("2048 detects a dead board and playable merge", () => {
  const b = [2, 4, 2, 4, 4, 2, 4, 2, 2, 4, 2, 4, 4, 2, 4, 2];
  assert.equal(canMove2048(b), false);
  b[0] = 4;
  assert.equal(canMove2048(b), true);
});
test("Minesweeper adjacency never wraps an edge", () => {
  assert.deepEqual(neighbors(0), [1, 8, 9]);
  assert.equal(neighbors(7).includes(8), false);
  assert.equal(neighbors(27).length, 8);
});
test("Minesweeper flood reveals safe cells and stops at mine boundaries", () => {
  const bombs = new Set([0, 1, 8]);
  const opened = revealCells(63, bombs, new Set());
  assert.equal(opened.has(0), false);
  assert.equal(opened.has(1), false);
  assert.equal(opened.has(8), false);
  assert.equal(opened.size, 61);
  assert.equal(revealCells(0, bombs, new Set()).size, 0);
});
test("Wordle consumes repeated letters only once after greens", () => {
  assert.deepEqual(paintWord("APPLE", "ALLEY"), [
    "hit",
    "near",
    "miss",
    "near",
    "miss",
  ]);
  assert.deepEqual(paintWord("CIVIC", "CIVIC"), Array(5).fill("hit"));
  assert.deepEqual(paintWord("ROBOT", "ROTOR"), [
    "hit",
    "hit",
    "near",
    "hit",
    "miss",
  ]);
});
test("Restoring remote progress preserves local records and per-game wins", () => {
  const p = mergeProgress(
    {
      xp: 900,
      played: 8,
      best: 400,
      wins: { Wordle: 4, Memory: 2 },
      lastDay: "2026-11-17",
      streak: 3,
    },
    {
      xp: 500,
      played: 5,
      wins: { Wordle: 1, Simon: 2 },
      lastDay: "2026-11-16",
      streak: 2,
    },
  );
  assert.equal(p.xp, 900);
  assert.equal(p.streak, 3);
  assert.deepEqual(p.wins, { Wordle: 4, Memory: 2, Simon: 2 });
  assert.equal(mergeProgress({}, null).played, 0);
});
test("Krillion accepts expanded rooms and spelling variations", () => {
  const room = questions.find((q) =>
    q.prompt.toLowerCase().includes("room in a house"),
  );
  assert.ok(room);
  for (const v of ["studio", "sunroom", "Sunrom", "Studoi"])
    assert.ok(matchAnswer(v, room.answers), v);
  assert.equal(matchAnswer("zzzzzzzz", room.answers), null);
});
test("Puzzle banks have valid shapes and no repeated words within a puzzle", () => {
  assert.ok(questions.length > 1000);
  assert.ok(wordList.every((w) => /^[A-Z]{5}$/.test(w)));
  assert.equal(groups.length, groupLabels.length);
  for (const puzzle of groups) {
    assert.equal(puzzle.length, 4);
    assert.ok(puzzle.every((g) => g.length === 4));
    assert.equal(new Set(puzzle.flat()).size, 16);
  }
});
