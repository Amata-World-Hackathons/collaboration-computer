# Honest Ticket Counter
Submission for Supernova (Internet Computer Web3 Hackathon – June 2022)

You can find the submission and full description
[here](https://devpost.com/software/honest-ticket-machine).

## Development

We use `yarn` to manage all the dependencies. Run:

```
yarn
```

to get the latest dependencies. You will also need the `dfx` tool installed (see
[here](https://internetcomputer.org/docs/current/developer-docs/ic-overview)).

The project can simply be run by:

```
dfx start --background --clean
dfx build
dfx deploy
```

Alternatively, if you want to take advantage of the live-reloading capabilities
of Next.js, you can run:

```
yarn workspace @honest-ticket-machine/web-client run dev
```

**TODO** replace the main package.json scripts with these commands.

**WARNING** deploying to mainnet is currently prohibitively expensive, this
needs to be re-evaluated and optimised for future builds.