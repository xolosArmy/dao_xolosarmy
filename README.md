# XolosArmy DAO

This repository contains a reference implementation of a community DAO for voting on the eCash blockchain.
Votes are signaled with transactions that include an `OP_RETURN` field. Voters must hold the eToken **Xolo `$RMZ`** in their wallet.
The Chronik indexer is used to broadcast and query transactions.

## Usage

Install dependencies with:
```bash
npm install
```
Update `src/config.js` with the DAO receiving address and token id.

### Create a Proposal
Provide a wallet WIF and an unspent transaction output to spend:
```bash
node src/createProposal.js <wif> <utxo_txid> <vout> <sats> <proposalId> "Proposal title"
```

### Cast a Vote
```bash
node src/castVote.js <wif> <utxo_txid> <vout> <sats> <proposalId> <YES|NO>
```

### Tally Votes
```bash
node src/tallyVotes.js <proposalId>
```

This code is for educational purposes and should be thoroughly audited before use on mainnet.
