/**
 *  ECDSA in JavaScript: secp256k1-based sign / verify / recoverPubKey 
 *  https://gist.github.com/nakov/1dcbe26988e18f7a4d013b65d8803ffc
 */

const sha3 = require('js-sha3');
const elliptic = require('elliptic');
const ec = new elliptic.ec('secp256k1');
// let txLib = require('./t')



const hash = (strMsg) => {
  return sha3.keccak256(strMsg);
}


/** API: sign()
 * 
 * @param {String} hash 
 * @param {String} privateKey 
 */
const sign = (hash, privateKey) => {
  // console.log('hash: ', hash)
  // console.log('privateKey: ', privateKey)
  return ec.sign(hash, privateKey, "hex", { canonical: true });
}

const signObj = (dataObj, privateKey) => {

  const str = JSON.stringify(dataObj)
  const hash = sha3.keccak256(str)
  const sign = sign(hash, privateKey)

  return [str, hash, sign]
}

const signString = (str, privateKey) => {
  // verifyKeyFormat64HexStr(privateKey);
  let hash = hash(str);
  // verifyTxSign(txHash);
  let signature = ec.sign(hash, privateKey, "hex", { canonical: true });

  return signature
}

// https://stackoverflow.com/questions/6182315/how-to-do-base64-encoding-in-node-js
// > console.log(Buffer.from("Hello World").toString('base64'));
// SGVsbG8gV29ybGQ =
// > console.log(Buffer.from("SGVsbG8gV29ybGQ=", 'base64').toString('ascii'))
// Hello World

const strToBase64 = (data) => {
  return Buffer.from(data).toString('base64')
  // const buff = Buffer.from(`${data}`);
  // return buff.toString('base64');
}

const base64ToStr = (data) => {
  // let data = 'c3RhY2thYnVzZS5jb20=';
  // let buff = new Buffer(data, 'base64');
  // let text = buff.toString('ascii');

  return Buffer.from(data, 'base64').toString('ascii')

}



const getAddressFromPair = (pair) => {
  const a = pair.getPublic().encode("hex").substr(2)
  return (a).substr(0, 4) //or hash(a) ?
}

const getAddressFromPubKey = (pubKey) => {
  return (pubKey).substr(0, 4)
}


const getPrivateHex = (pair) => {
  return pair.getPrivate("hex")
}

const getPublicHex = (pair) => {
  return pair.getPublic().encode("hex").substr(2)
}


const generatePair = () => { return ec.genKeyPair() }


const generatePairFromPrivate = (k) => {
  if (!verifyKeyFormat64HexStr(k)) {
    throw new Error('private key must be 64 characters length hex string')
  }
  return ec.keyFromPrivate(privateKey);
}

const verifyKeyFormat64HexStr = (k) => {

  if (!/^[0-9a-f]{64}$/.test(k)) {
    throw new Error('private key must be 64 characters length hex string')
  }

  return true;
}




/** verifies a signature of hash string 
* 
*/
const verifyTxSign = (hash, signature) => {

  const hexToDecimal = (x) => ec.keyFromPrivate(x, "hex").getPrivate().toString(10);
  const pubKeyRecovered = ec.recoverPubKey(
    hexToDecimal(hash),
    signature,
    signature.recoveryParam,
    "hex"
  );

  if (!ec.verify(hash, signature, pubKeyRecovered)) {
    return false
  }
  return true;
}


/** TEST-ZONE
 * 
 * 
 */



const pair = generatePair()
const privateKey = pair.getPrivate("hex")
const publicKey = pair.getPublic("hex")

const strHash = hash('data to sign goes here...');
const newKey = ec.keyFromPrivate(privateKey);

const signature = sign(strHash, newKey)

console.log(
  privateKey,
  newKey.verify(strHash, signature),
)
// const newPar = 
const result = verifyTxSign(strHash, signature)


console.log(
  'qqqq\n',
  'results:', Object.keys(result), //must have [ 'curve', 'type', 'precomputed', 'x', 'y', 'inf' ]
  'signature:', Object.keys(signature),// must have [ 'r', 's', 'recoveryParam' ] 
  '\n', signature.r.toString(),
  '\n', signature.r.toString(),
  '\n', signature.recoveryParam.toString(), // always 1
)

module.exports = {
  getPublicHex,
  getPrivateHex,
  getAddressFromPair,
  getAddressFromPubKey,
  signObj,
  signString,
  base64ToStr,
  strToBase64,
  sign,
  hash,
  generatePair,
  generatePairFromPrivate,
  // signTx,
  verifyTxSign
}

