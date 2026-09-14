# BlobOps

Docker Compose + Jenkins CI/CD pipeline built around an agar.io clone, used as a sandbox for practicing container orchestration and deployment automation.

## Built on

The game itself is a fork of [owenashurst/agar.io-clone](https://github.com/owenashurst/agar.io-clone) (MIT licensed).
I did not write the core game server or client rendering.

## What I have built

- **Bot clients** (`src/bot/`) — scriptable players that connect over socket.io and play autonomously (food-seeking behavior). Scalable in number with docker compose `--scale bot=N` option.
- **Docker Compose setup** — containerizes the game server and bots as separate
  services on a shared network.
- **Jenkins CI/CD pipeline** (`Jenkinsfile`) — runs the existing test suite in a container, rebuilds and redeploys via Compose, then runs an HTTP smoke test against the running container.

## Run the application

```bash
docker compose up --build
# Accessible at http://localhost:3000
```

This will start the game server and any bot clients defined in the Compose file. You can scale the number of bot clients by using the `--scale bot=N` option, where `N` is the desired number of bots.

## Status

I am currently busy and not actively working on this project. The existing features work as intended but here's what I would like to add or improve in the future:

- CI/CD rollback in case of test-suite failures.
- Jenkins pipeline has integrated the legacy test suite but there are no tests for the new bot clients or CI layer.
- Kubernetes deployment for production environment was the original stretch goal but it has not been started.

## License

MIT (inherited from the upstream project — see `LICENSE`).

## System requirements

- Docker
- Docker Compose
- Jenkins
- javascript
- Node.js
- npm
