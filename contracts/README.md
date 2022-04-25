# Nation3 smart contracts

## Overview

- [NATION Token](./src/tokens/NATION.sol)
- [Voting Escrow (veNATION)](./src/governance/VotingEscrow.vy)
- [NATION Airdrop Distributor](./src/distributors/MerkleDistributor.sol)
- Liquidity Rewards Distributor (WIP)
- Passport Token (WIP)
- Passport Issuer (WIP)

## Contributing

### Requirements

- foundry
- node v16
- working rpc node (local chain)

### Local Setup

```zsh
# Install dependencies
yarn install

# Set up environment variables
cp .env.sampe .env

# Compile solidity and vyper contracts
yarn compile

# Install git submodules
forge install

# Deploy stack for local development
yarn dev-deploy
```

### Running a node

If you want to test/develop locally, you'll need to run a local node, for example with [Ganache](https://trufflesuite.com/ganache/).

### Testing

[Forge testing guide](https://book.getfoundry.sh/forge/tests.html)

## Audits

- [GoldmanDAO Nation3 launch report](https://prong-distance-e49.notion.site/Nation3-Launch-Report-59990449a8ef4814985f44eadb1c75a1)
