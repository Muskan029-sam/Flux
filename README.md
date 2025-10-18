Flux — Robocept-style site

This branch adds a richer frontend, a telemetry visualization using Chart.js, and a Firebase Hosting + Functions stub so you can host this site on Google (Firebase).

What I added
- index.html: a more complete landing page and telemetry dashboard
- css/styles.css: improved styles
- js/main.js: telemetry polling and Chart.js integration
- functions/: Firebase Functions stub that serves /api/telemetry with simulated data
- firebase.json: hosting config to rewrite /api/** to the functions

Quick deploy guide (Firebase Hosting + Functions)
1) Install Firebase CLI: npm install -g firebase-tools
2) Login and choose/create project: firebase login
3) From the repo root: firebase init hosting,functions
   - When prompted, select the existing project or create a new one.
   - Use "public" as the public directory and choose to configure as a single-page app (yes).
   - Choose JavaScript for functions, and when asked to install dependencies, say yes.
4) Copy this branch to your local machine and install functions deps: cd functions && npm install
5) Deploy: firebase deploy --only hosting,functions

Notes and next steps
- You must pick or create a Firebase project (this deploys to Google-managed hosting).
- For production telemetry, replace the stub in functions/index.js with your real telemetry backend or forward data from your devices.
- If you prefer Google Cloud Run or App Engine, I can produce a Dockerfile/Service YAML instead.

If you want, I can:
- Open a PR with these changes (I can create the PR in your repo).
- Add a GitHub Action to automatically deploy to Firebase on merges to main.
- Replace polling with Socket.IO for true real-time telemetry.

Tell me which of those you want me to do next.
