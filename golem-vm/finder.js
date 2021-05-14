#!/usr/local/bin/node
const fs =require("fs");                                // File System
const bip39 = require ('bip39');                        // Convert mnemonic to seed tool
const HDKey = require('hdkey');                         // Generate from HD path tool
const ethUtils = require('ethereumjs-util');            // Convert to address tool

// object that will be written to /golem/output
let resultObj = {
  Success: false,
  scriptRun: false,
  path: null
}

/** Settings */
// MAX values
const MAX_ACCOUNT = 256;
const MAX_CHANGE = 256;
const MAX_INDEX = 100;
// START values
const START_ACCOUNT = 0;
const START_CHANGE = 0;
const START_INDEX = 0;

const raw = fs.readFileSync('/golem/input/input.json', 'utf8');
const params = JSON.parse(raw);

/** Settings */
// Wallet data
let purpose = params.firstTwo[0];
let coinType = params.firstTwo[1];
let mnemonic = params.mnemonic;
let password = params.password;
let lookingForAddr = params.addr;
let childkey = null;
let address = null;

/** Init */
let seed = bip39.mnemonicToSeedSync(mnemonic, password);                           // Convert mnemoic to seed
let hdkey = HDKey.fromMasterSeed(Buffer.from(seed, 'hex'));                        // Generate master key from seed
let seedWithoutPass = bip39.mnemonicToSeedSync(mnemonic, "");                      // Convert mnemoic to seed (no password)
let hdkeyWithoutPass = HDKey.fromMasterSeed(Buffer.from(seedWithoutPass, 'hex'));  // Generate master key from seed (no password)
runCycles();


/** 5 for cycles all together */
function runCycles() {
  for (let account = START_ACCOUNT; account <= MAX_ACCOUNT; account++) {
    for (let change = START_CHANGE; change <= MAX_CHANGE; change++) {
      for (let index = START_INDEX; index <= MAX_INDEX; index++) {
        runVariations(purpose, coinType, account, change, index);
      }
    }
  }
}

function runVariations(purpose, coinType, account, change, index) {
  // All the tick variations
  if (change === 0) {
    withoutChange(purpose, coinType, account, index);
  }
  if (account === 0) {
    withoutAccount(purpose, coinType, change, index);
  }
  if (change === 0 && account === 0) {
    withoutAccountAndChange(purpose, coinType, index);
  }
  all(purpose, coinType, account, change, index);
}

function all(purpose, coinType, account, change, index) {
  path = "m/" + purpose + "/" + coinType + "/" + account + "/" + change + "/" + index;
  deriveAddress(path);
  path = "m/" + purpose + "/" + coinType + "/" + account + "/" + change + "'/" + index;
  deriveAddress(path);
  path = "m/" + purpose + "/" + coinType + "/" + account + "'/" + change + "/" + index;
  deriveAddress(path);
  path = "m/" + purpose + "/" + coinType + "/" + account + "'/" + change + "'/" + index;
  deriveAddress(path);
  path = "m/" + purpose + "/" + coinType + "'/" + account + "/" + change + "/" + index;
  deriveAddress(path);
  path = "m/" + purpose + "/" + coinType + "'/" + account + "/" + change + "'/" + index;
  deriveAddress(path);
  path = "m/" + purpose + "/" + coinType + "'/" + account + "'/" + change + "/" + index;
  deriveAddress(path);
  path = "m/" + purpose + "/" + coinType + "'/" + account + "'/" + change + "'/" + index;
  deriveAddress(path);
  path = "m/" + purpose + "'/" + coinType + "/" + account + "/" + change + "/" + index;
  deriveAddress(path);
  path = "m/" + purpose + "'/" + coinType + "/" + account + "/" + change + "'/" + index;
  deriveAddress(path);
  path = "m/" + purpose + "'/" + coinType + "/" + account + "'/" + change + "/" + index;
  deriveAddress(path);
  path = "m/" + purpose + "'/" + coinType + "/" + account + "'/" + change + "'/" + index;
  deriveAddress(path);
  path = "m/" + purpose + "'/" + coinType + "'/" + account + "/" + change + "/" + index;
  deriveAddress(path);
  path = "m/" + purpose + "'/" + coinType + "'/" + account + "/" + change + "'/" + index;
  deriveAddress(path);
  path = "m/" + purpose + "'/" + coinType + "'/" + account + "'/" + change + "/" + index;
  deriveAddress(path);
  path = "m/" + purpose + "'/" + coinType + "'/" + account + "'/" + change + "'/" + index;
  deriveAddress(path);
}

function withoutChange(purpose, coinType, account, index) {
  path = "m/" + purpose + "/" + coinType + "/" + account + "/"  + index;
  deriveAddress(path);
  path = "m/" + purpose + "/" + coinType + "/" + account + "'/"  + index;
  deriveAddress(path);
  path = "m/" + purpose + "/" + coinType + "'/" + account + "/"  + index;
  deriveAddress(path);
  path = "m/" + purpose + "/" + coinType + "'/" + account + "'/"  + index;
  deriveAddress(path);
  path = "m/" + purpose + "'/" + coinType + "/" + account + "/"  + index;
  deriveAddress(path);
  path = "m/" + purpose + "'/" + coinType + "/" + account + "'/"  + index;
  deriveAddress(path);
  path = "m/" + purpose + "'/" + coinType + "'/" + account + "/"  + index;
  deriveAddress(path);
  path = "m/" + purpose + "'/" + coinType + "'/" + account + "'/"  + index;
  deriveAddress(path);
}

function withoutAccount(purpose, coinType, change, index) {
  path = "m/" + purpose + "/" + coinType + "/" + change + "/"  + index;
  deriveAddress(path);
  path = "m/" + purpose + "/" + coinType + "/" + change + "'/"  + index;
  deriveAddress(path);
  path = "m/" + purpose + "/" + coinType + "'/" + change + "/"  + index;
  deriveAddress(path);
  path = "m/" + purpose + "/" + coinType + "'/" + change + "'/"  + index;
  deriveAddress(path);
  path = "m/" + purpose + "'/" + coinType + "/" + change + "/"  + index;
  deriveAddress(path);
  path = "m/" + purpose + "'/" + coinType + "/" + change + "'/"  + index;
  deriveAddress(path);
  path = "m/" + purpose + "'/" + coinType + "'/" + change + "/"  + index;
  deriveAddress(path);
  path = "m/" + purpose + "'/" + coinType + "'/" + change + "'/"  + index;
  deriveAddress(path);
}

// Shorter path (without 'account' and 'change')
function withoutAccountAndChange(purpose, coinType, index) {
  path = "m/" + purpose + "/" + coinType + "/"  + index;
  deriveAddress(path);
  path = "m/" + purpose + "/" + coinType + "'/"  + index;
  deriveAddress(path);
  path = "m/" + purpose + "'/" + coinType + "/" + index;
  deriveAddress(path);
  path = "m/" + purpose + "'/" + coinType + "'/" + index;
  deriveAddress(path);
}

function deriveAddress(path) {
  // With password
  childkey = hdkey.derive(path);
  address = ethUtils.publicToAddress(childkey.publicKey, true);
  let currentAddr = ethUtils.bufferToHex(address);
  console.log("path (with password)   : ", path);
  console.log("Generated address      : ", currentAddr);
  
  if (currentAddr.includes(lookingForAddr) || ethUtils.toChecksumAddress(currentAddr).includes(lookingForAddr)) {
    done(path);
  } 

  // Without password
  childkey = hdkeyWithoutPass.derive(path);
  address = ethUtils.publicToAddress(childkey.publicKey, true);
  currentAddr = ethUtils.bufferToHex(address);
  console.log("path (without password): ", path);
  console.log("Generated address      : ", currentAddr);
  
  if (ethUtils.toChecksumAddress(currentAddr).includes(ethUtils.toChecksumAddress(lookingForAddr))) {
    done(path);
  } 

  //deriveForGenerated();                                                     // for generated mnemonics only
}

function done(path) {
  resultObj.path = path;
  resultObj.Success = true;
  fs.writeFileSync('/golem/output/result.json', JSON.stringify(resultObj));
  process.exit();
}

resultObj.scriptRun = true;
fs.writeFileSync('/golem/output/result.json', JSON.stringify(resultObj));
