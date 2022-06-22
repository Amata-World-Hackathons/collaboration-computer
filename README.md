# Honest Ticket Counter
Submission for Supernova (Internet Computer Web3 Hackathon – June 2022)

You can find the submission and full description
[here](https://devpost.com/software/honest-ticket-machine).

See the app running live on IC [here](https://mymdv-biaaa-aaaan-qam2q-cai.ic0.app/).

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
yarn start:web
```

### Local Internet Identity and Ledger

To use a local copy of the Internet Identity and Ledger services, you will need
to deploy them both separately.

For the Internet Identity canister, simply run:

```
dfx deploy internet_identity --no-wallet --argument '(null)'
```

This should work out of the box.

For the Ledger, it gets a bit more involved, however there are very detailed
instructions on the [official docs](https://internetcomputer.org/docs/current/developer-docs/functionality/ledger/ledger-local-setup).
In summary, you will need to start the canister with a minting principal defined
and with funds preloaded onto your canister. You can then transfer those funds
to other identities for testing using:

```
dfx identity use <account-with-preloaded-icp>
dfx ledger transfer --amount <amount-in-e8s> <account-id>
```