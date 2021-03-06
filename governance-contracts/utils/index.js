const ethers = require('ethers');
const ethUtils = require('ethereumjs-util');


const { defaultAbiCoder: abiCoder, parseUnits, formatUnits } = ethers.utils;
const { BN } = ethUtils;

/**
 * ABI-encode a value to pass to a contract function
 * @param {*} type
 * @param {*} value
 */
function abiEncode(type, value) {
  return abiCoder.encode([type], [value]);
}

function asBytes(string) {
  return ethUtils.toBuffer(string);
}

/**
 * stripHexPrefix
 * Remove '0x' from the beginning of a string, if present
 * @param {String} value
 * @return String
 */
function stripHexPrefix(value) {
  // assume string
  const stripped = value.startsWith('0x') ? value.substring(2) : value;
  return stripped;
}

/**
 * bytesAsString
 * @param {String} bytes Hex-encoded string returned from a contract
 * @return UTF-8 encoded string
 */
function bytesAsString(bytes) {
  const stripped = stripHexPrefix(bytes);
  const decoded = Buffer.from(stripHexPrefix(stripped), 'hex');
  return decoded.toString();
}

/**
 * zeroHash
 * @dev Return a 32-byte value of all zeros
 */
function zeroHash() {
  return ethUtils.zeros(32);
}

const panDecimals = new BN(18);

/**
 * Convert the amount to PAN base units (string)
 * @param {number|string} tokens can be fractional
 * @return {string}
 */
function toPanBase(tokens) {
  // console.log('tokens', tokens);
  const baseTokens = parseUnits(tokens.toString(), panDecimals.toString());
  // console.log(`${tokens} -> ${baseTokens.toString()}`);
  return baseTokens.toString();
}

/**
 *
 * @param {ethers.utils.BigNumberish} baseValue
 * @return {string}
 */
function fromPanBase(baseValue) {
  // console.log('baseValue', baseValue.toString());
  const tokens = formatUnits(baseValue.toString(), panDecimals.toString());
  // console.log(`${baseValue.toString()} -> ${tokens}`);
  return tokens;
}

module.exports = {
  BN,
  abiEncode,
  asBytes,
  stripHexPrefix,
  bytesAsString,
  zeroHash,
  sha256: ethUtils.sha256,
  toPanBase,
  fromPanBase,
};
