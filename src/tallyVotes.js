const { ChronikClient } = require('chronik-client');
const { chronikUrl, daoAddress } = require('./config');

async function tallyVotes(proposalId) {
  const chronik = new ChronikClient(chronikUrl);
  const history = await chronik.address(daoAddress).history(0, 50);
  const votes = { YES: 0, NO: 0 };
  for (const tx of history.txs) {
    for (const out of tx.outputs) {
      if (out.outputScript.startsWith('6a')) {
        const data = Buffer.from(out.outputScript.slice(2), 'hex').toString('utf8');
        const [type, id, option] = data.split('|');
        if (type === 'VOTE' && id === String(proposalId)) {
          votes[option] = (votes[option] || 0) + 1;
        }
      }
    }
  }
  return votes;
}

if (require.main === module) {
  const [,, proposalId] = process.argv;
  if (!proposalId) {
    console.error('Usage: node tallyVotes.js <proposalId>');
    process.exit(1);
  }
  tallyVotes(proposalId)
    .then(v => console.log('Votes:', v))
    .catch(err => console.error(err));
}

module.exports = tallyVotes;
