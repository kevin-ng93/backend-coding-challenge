# Backend Coding Challenge

This repository contains solutions for the backend coding challenge. Its purpose
is to demonstrate backend problem solving with TypeScript, ranging from a small
algorithm exercise, to a persistent CRUD API, to a backend system specification
for a realtime module.

## Purpose

The repository is organized as a complete submission package:

- Each problem lives in its own folder so it can be reviewed independently.
- Each folder has its own README describing the requirement, how to run it, and
  the relevant technical decisions.
- The solutions prioritize clarity, verifiability, and alignment with the task
  requirements over unnecessary frameworks or abstractions.

## Structure

```text
src/
  problem4/  # 3 TypeScript implementations of sum_to_n
  problem5/  # ExpressJS CRUD API with SQLite persistence
  problem6/  # Real-time scoreboard module specification and design diagrams
```

## Contents

### Problem 4: Sum to N

Provides 3 different TypeScript implementations of `sum_to_n`:

- Iterative accumulation.
- Arithmetic-series formula.
- Divide-and-conquer recursion.

See [src/problem4/README.md](./src/problem4/README.md) for details.

### Problem 5: ExpressJS CRUD API

An ExpressJS and TypeScript backend server that exposes CRUD APIs for
`resources` and persists data in SQLite.

Main features:

- Create resource.
- List resources with basic filters.
- Get resource details.
- Update resource.
- Delete resource.
- Typecheck, build, unit/e2e tests.

See [src/problem5/README.md](./src/problem5/README.md) for details.

### Problem 6: Real-Time Scoreboard Module Specification

A technical specification for a backend engineering team to implement a real-time
scoreboard module.

It includes:

- API specification for score updates and leaderboard snapshots.
- WebSocket specification for live updates.
- High-level architecture.
- Execution flow.
- Database schema.
- Redis leaderboard model.
- Fraud prevention, reliability, observability, and acceptance criteria.

See [src/problem6/README.md](./src/problem6/README.md) for details.

## How To Review

Review each problem using the README in its corresponding folder. The problems
can be read independently and do not require a shared root-level runtime.

## Quick Verification Commands

Problem 4:

```sh
cd src/problem4
npm install
npm run typecheck
npm run build
```

Problem 5:

```sh
cd src/problem5
npm install
npm run typecheck
npm test
npm run build
```

Problem 6 is a design specification and does not have a server runtime. Diagrams
are stored in `src/problem6/images`.
