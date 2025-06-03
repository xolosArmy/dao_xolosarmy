const { ChronikClient } = require('chronik-client');
const { buildTx } = require('./wallet');
const { chronikUrl, daoAddress } = require('./config');

async function castVote(wif, utxoTxid, utxoVout, utxoSats, proposalId, option) {
  const chronik = new ChronikClient(chronikUrl);
  const utxo = { txid: utxoTxid, vout: parseInt(utxoVout), sats: BigInt(utxoSats) };
  const hex = buildTx({
    wif,
    utxo,
    outputs: [{ address: daoAddress, sats: 546 }],
    opReturnData: `VOTE|${proposalId}|${option}`,
  });
  const { txid } = await chronik.broadcastTx(hex);
  return txid;
}

if (require.main === module) {
  const [,, wif, txid, vout, sats, proposalId, option] = process.argv;
  if (!wif || !txid || !vout || !sats || !proposalId || !option) {
    console.error('Usage: node castVote.js <wif> <utxo_txid> <vout> <sats> <proposalId> <YES|NO>');
    process.exit(1);
  }
  castVote(wif, txid, vout, sats, proposalId, option.toUpperCase())
    .then(txid => console.log('Vote txid:', txid))
    .catch(err => console.error(err));
}

module.exports = castVote;
