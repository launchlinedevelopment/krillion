# Verification — 2026-11-17

## Automated

`npm run build` passes JavaScript syntax checks and 13 regression tests. The build prepares `dist/` with only public assets. `npm install --ignore-scripts` reported zero dependency vulnerabilities.

Checks cover 2048 merges in all directions and dead boards; Minesweeper edges and flood fill; Wordle repeated letters; non-destructive progress merging; expanded Krillion room answers and typo tolerance; puzzle bank dimensions; password verification; request validation; bearer token rejection; and missing-database behavior.

## Browser

Tested in the browser at Chromebook size (1366×768) and phone size (390×844):

- Home renders with all 10 games, search and category filtering.
- 2048 moves and merges; a reload preserves board and score.
- Minesweeper first reveal is safe, flood opens neighboring squares, and flag mode marks a square.
- Wordle accepts a winning guess, awards XP, and restores the completed daily board after reload.
- Connections completes four groups, awards XP, restores its daily result, and removes solved tiles from the grid.
- Hangman accepts letters, completes the word, awards XP and disables finished input.
- Simon plays and accepts two growing sequences; wrong input reaches the completion/replay screen.
- Number Hunt completes all 16 numbers and reports elapsed time.
- Reaction Time detects early input and successful reaction input. Leaving a waiting round does not replace the next screen.
- Memory reveals and matches all eight pairs, reports moves and awards XP.
- Krillion rejects an unknown answer, accepts a valid answer with rarity/depth points, supports passing and advances through all seven rounds to the final result.
- Mobile Wordle and Connections fit without horizontal overflow. The profile shows persisted XP, wins and achievements.
- Browser error log was empty after the gameplay checks.

## Limits

The connected Vercel project had no `DATABASE_URL` configured during inspection. Password/authentication validation and the explicit unavailable-service response are tested; real database registration, login and cross-device synchronization cannot be validated until the database is configured and `schema.sql` is applied. Daily boards remain browser-local. These games use independent puzzle banks and curated Krillion rarity ordering.
