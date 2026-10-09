# Friday, October 9 — Toronto time

Implementation has started before Friday. Use these stages to validate and finish the deliverable; preserve actual execution evidence rather than marking a stage done based only on code.

| Time | Stage | Exit gate |
| --- | --- | --- |
| 9–10:30 | Environment and app exploration | Emulator boots, doctor passes, pinned app launches; Sauce Labs account ready |
| 10:30–12 | Framework and Page Objects | Review boundaries and source-backed locators; static checks pass |
| 12–12:30 | Lunch | |
| 12:30–2 | Purchase | Full Android checkout passes with exact cart/review assertions |
| 2–3 | Edge cases/mobile | Cart, shipping recovery, lifecycle all pass independently |
| 3–3:15 | Break | |
| 3:15–4:30 | Cloud and iOS | Shared purchase/cart tests pass on Android/iOS cloud devices |
| 4:30–5:30 | Parallelism/diagnostics | Two workers pass; intentional failure captures screenshot/source |
| 5:30–6 | Dinner | |
| 6–7 | CI/API extension | CI runs; future API adapter boundary reviewed |
| 7–8 | Final verification/docs | Three consecutive Android suites; documented evidence and limitations |

Prioritize a reliable Android purchase flow. If cloud access is delayed, finish local validation and move cloud/iOS verification to Saturday. Saturday: reach five consecutive passes and verify clean clone/CI. Sunday: demonstration and interview rehearsal. Monday, October 12: verify public repository/evidence links and submit.

Record actual work start/end and breaks here or in the submission notes. Do not claim compliance with a two-hour build limit for this expanded implementation.
