# bug-fix-demo

A small invented Node app with two bugs, failing tests, the fix and a write-up. Shows how I work on bug-fix jobs. See [WRITEUP.md](WRITEUP.md).

```
npm run test:before   # buggy code: 3 fail, 2 pass
npm test              # fixed code: 5 pass
node demo.mjs before  # receipt with the bugs
node demo.mjs after   # receipt after the fix
```

Node 22, no dependencies, no network. `fix.diff` is `diff -u before/checkout.js after/checkout.js`. The app is invented; nothing here comes from a client. AI tools, mainly Claude, are used under my supervision, and I run and review every change. MIT licensed.

## Hire me

I build small, tested automations like this one for clients.

- Upwork: https://www.upwork.com/freelancers/~011ec6fab9b610aea9

AI tools, mainly Claude, are used under my supervision; I review and test every delivery.
