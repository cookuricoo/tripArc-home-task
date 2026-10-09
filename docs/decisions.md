# Interview decision notes

- **Small Page Object Model:** clear boundaries and readable business specs, without a generic framework factory or unnecessary inheritance. One base page owns common element readiness; focused helper classes own reusable infrastructure.
- **One scenario per spec/session:** stronger isolation and natural spec-level parallelism. A full local Android reinstall is slower but removes hidden state; optimize only after measured stability.
- **Synchronization at state boundaries:** wait for the cart badge, each quantity change, exact subtotal, and new screen markers. Presence alone cannot catch an incorrect price or stale total.
- **Integer cents:** exact assertions for expected prices and delivery totals; no floating-point tolerance masking incorrect values.
- **Real platform abstraction:** native product data and validation behavior differ. Keep those differences inside fixtures/pages, not conditional branches in specs.
- **Local parallelism, serial cloud:** avoids assuming a trial account grants concurrent sessions and saves cloud minutes for actual cross-platform validation.
- **Diagnostics preserve the original failure:** collect independent artifacts with settled promises and record unavailable logs instead of throwing a second failure.
- **API extension only:** inspected catalog/cart/checkout state is local. No fake endpoints or unrelated fixture service presented as app integration.

Walkthrough: show a concise business spec, follow one action into its page/locator map, explain the quantity race and assertion, demonstrate a failure artifact, show the parallel spec partition, and point to real run evidence. Explain unverified capabilities candidly.
