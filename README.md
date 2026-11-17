# Krillion Games — The Play Club

A responsive arcade with ten playable games, animated original artwork, optional sound, reduced-motion support, daily puzzles, XP, streaks, and achievements. Built with browser-native modules: no client framework or game downloads.

## Games

- **Krillion:** seven prompts, a 3-second preview and 25-second answer clock; daily and unlimited dives, retry unknown answers, typo matching, one daily hint, pass, and rarity/depth scoring. Daily dives resume at the last saved round.
- **Wordle:** six guesses, duplicate-letter scoring, physical/on-screen keyboards, hard-mode letter requirements, daily saved board and sharing.
- **Connections:** four groups, four mistakes, one-away feedback, shuffle, saved daily board and sharing. Completed groups leave the selection grid; a lost puzzle reveals all groups.
- **2048:** single-merge moves, keyboard/swipe/button controls, saved board and score, win and no-move detection.
- **Minesweeper:** 8×8 field with 10 mines, safe opening neighborhood, flood reveal, flags, touch flag mode, wins and losses.
- **Hangman:** themed clues, six mistakes, keyboard controls, win/loss and replay.
- **Simon:** growing animated sequences, input lock during playback, round scoring and replay.
- **Number Hunt, Reaction Time, Memory:** timed ordering, reflex challenge, and eight-pair matching with XP rewards.

The Krillion bank contains 117 underlying topics and 2,340 prompt phrasings. Its curated rarity ranking is independent of the original site's player statistics. Wordle and Connections also use independent puzzle banks.

## Run and verify

```sh
npm ci
npm test
npm run build
npm run preview
```

`preview` serves static files at `http://127.0.0.1:4173`. For the Vercel API routes locally, install the Vercel CLI and run `npm run dev`. `build` checks JavaScript syntax, runs regression tests, and copies only the public assets to `dist/`. Vercel serves `dist/` and the root `api/` functions.

## Progress and accounts

Games work without a database. Existing `krillion.progress.v1` browser progress is preserved, along with daily Wordle/Connections saves. 2048 boards persist separately. XP, wins, best dive and streaks sync when an account is connected. Daily boards and unfinished games are browser-local. Merging cloud stats keeps the larger local/cloud totals and per-game wins; it does not add overlapping totals.

Cloud accounts require **DATABASE_URL** on Vercel and the tables in **schema.sql**. Import this repository using Framework preset **Other**, add the connection string through Vercel's private environment settings, run `schema.sql` on that database, and redeploy. Never commit credentials. `GET /api/status` reports only whether a database connection is configured. The sign-in screen explains when cloud accounts are unavailable.

Passwords use salted PBKDF2; random session tokens are stored as hashes in PostgreSQL, and queries are parameterized. Accounts currently have no password reset, email verification or public-service abuse throttling. This arcade is intended for a small private group, as requested.

## Verification

`npm run build` includes tests for 2048 moves and loss detection, Minesweeper adjacency/flood reveal, Wordle repeated letters, progress merging, Krillion answer tolerance, puzzle bank shapes, password hashing, invalid authentication, bearer tokens and missing database behavior. See `VERIFICATION.md` for browser checks and deployment limits.
