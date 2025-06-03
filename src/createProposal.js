const { ChronikClient } = require('chronik-client');
const { buildTx } = require('./wallet');
const { chronikUrl, daoAddress } = require('./config');

async function createProposal(wif, utxoTxid, utxoVout, utxoSats, proposalId, title) {
  const chronik = new ChronikClient(chronikUrl);
  const utxo = { txid: utxoTxid, vout: parseInt(utxoVout), sats: BigInt(utxoSats) };
  const hex = buildTx({
    wif,
    utxo,
    outputs: [{ address: daoAddress, sats: 546 }],
    opReturnData: `PROPOSAL|${proposalId}|${title}`,
  });
  const { txid } = await chronik.broadcastTx(hex);
  return txid;
}

if (require.main === module) {
  const [,, wif, txid, vout, sats, proposalId, ...titleParts] = process.argv;
  if (!wif || !txid || !vout || !sats || !proposalId || !titleParts.length) {
    console.error('Usage: node createProposal.js <wif> <utxo_txid> <vout> <sats> <proposalId> <title>');
    process.exit(1);
  }
  createProposal(wif, txid, vout, sats, proposalId, titleParts.join(' '))
    .then(txid => console.log('Proposal txid:', txid))
    .catch(err => console.error(err));
}

module.exports = createProposal;
