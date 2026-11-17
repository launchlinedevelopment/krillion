# Deep Dive Arcade

Original trivia and word-game arcade for Vercel. Includes timed seven-question trivia, daily five-letter guessing, category grouping, number hunt, streaks, and local progress. Optional Neon Postgres accounts synchronize progress across devices.

## Deploy
Import this repository in Vercel (Framework preset: Other). Static games work without environment variables. Set `DATABASE_URL` to a Neon Postgres connection string in Vercel, then run `schema.sql` in the Neon SQL editor for cloud accounts and progress sync. Never add database credentials to the repository.

## Game rules
Deep Dive: seven rounds, 25 seconds per round. Type distinct answers fitting the prompt; accepted synonyms and common spelling mistakes are normalized, and typo tolerance is conservative to avoid incorrectly accepting unrelated answers. Rare answers earn more points. Question prompts are generated from curated categories with multiple phrasings. This is an independent game, not the original site's proprietary data or artwork.

## Account security
Passwords use PBKDF2 with a per-user random salt; login sessions are random bearer tokens stored as SHA-256 hashes in the DB. Server routes use parameterized queries. Production deployments should also add rate limiting, email verification, and password reset before inviting large numbers of public users.
