const ecash = require('ecashjs-lib');
const { encodeCashAddress } = require('ecashaddrjs');

function getNetwork() {
  return ecash.networks.bitcoin; // eCash uses same params as BCH
}

function addressFromWIF(wif) {
  const keyPair = ecash.ECPair.fromWIF(wif, getNetwork());
  const pubkey = keyPair.getPublicKeyBuffer();
  const hash = ecash.crypto.hash160(pubkey);
  return encodeCashAddress('ecash', 'p2pkh', hash.toString('hex'));
}

function buildTx({ wif, utxo, outputs, opReturnData }) {
  const network = getNetwork();
  const keyPair = ecash.ECPair.fromWIF(wif, network);
  const txb = new ecash.TransactionBuilder(network);
  txb.addInput(utxo.txid, utxo.vout);
  outputs.forEach(o => txb.addOutput(o.address, o.sats));
  if (opReturnData) {
    const data = Buffer.from(opReturnData, 'utf8');
    const script = ecash.script.compile([
      ecash.opcodes.OP_RETURN,
      data,
    ]);
    txb.addOutput(script, 0);
  }
  const hashType = ecash.Transaction.SIGHASH_ALL | ecash.Transaction.SIGHASH_BITCOINCASHBIP143;
  txb.sign(0, keyPair, undefined, hashType, utxo.sats);
  const tx = txb.build();
  return tx.toHex();
}

module.exports = { addressFromWIF, buildTx };
