#!/usr/bin/env node

const chalk = require("chalk");
const boxen = require("boxen");
var bip39 = require ('bip39');                        // Convert mnemonic to seed tool
var HDKey = require('hdkey');                         // Generate from HD path tool
var ethUtils = require('ethereumjs-util');            // Convert to address tool

// This is just message styling...
const greeting = chalk.white.bold("Start!");
const msgBox = boxen( greeting, { padding: 1, margin: 1, borderStyle: "round", borderColor: "green", backgroundColor: "#555555"} );
console.log(msgBox);

// MAX values
const MAX_PURPOSE = 100;
const MAX_COINTYPE = 100;
const MAX_ACCOUNT = 100;
const MAX_CHANGE = 100;
const MAX_INDEX = 10;


// The credentials
let mnemonic = "pact blast security evolve faculty rural wheat ladder gun thrive garment urban";
let password = "";
let seed = null;
let hdkey = null;
let childkey = null;
let address = null;
let path = "m/44'/60'/0'/0/0";

/** Init */
seed = bip39.mnemonicToSeedSync(mnemonic, password);                // Convert mnemoic to seed
//console.log("bip39: ", seed);
hdkey = HDKey.fromMasterSeed(Buffer.from(seed, 'hex'));             // Generate master key from seed


/** 5 for cycles all together */
for (let purpose = 0; purpose <= MAX_PURPOSE; purpose++ ) {
  for (let coinType = 0; coinType <= MAX_COINTYPE; coinType++) {
    for (let account = 0; account <= MAX_ACCOUNT; account++) {
      for (let change = 0; change <= MAX_CHANGE; change++) {
        for (let index = 0; index <= MAX_INDEX; index++) {
          runVariations(purpose, coinType, account, change, index);
        }
      }
    }
  }
}



function runVariations() {
  // Végigírom őket kézzel mert nincs kedvem gondolkodni...
  path = "m/" + purpose + "/" + coinType + "/" + account + "/" + change + "/" + index;
  path = "m/" + purpose + "/" + coinType + "/" + account + "/" + change + "/" + index;
  path = "m/" + purpose + "/" + coinType + "/" + account + "/" + change + "/" + index;
  path = "m/" + purpose + "/" + coinType + "/" + account + "/" + change + "/" + index;
  path = "m/" + purpose + "/" + coinType + "/" + account + "/" + change + "/" + index;
  path = "m/" + purpose + "/" + coinType + "/" + account + "/" + change + "/" + index;
  path = "m/" + purpose + "/" + coinType + "/" + account + "/" + change + "/" + index;
  path = "m/" + purpose + "/" + coinType + "/" + account + "/" + change + "/" + index;
  path = "m/" + purpose + "/" + coinType + "/" + account + "/" + change + "/" + index;
  path = "m/" + purpose + "/" + coinType + "/" + account + "/" + change + "/" + index;
  path = "m/" + purpose + "/" + coinType + "/" + account + "/" + change + "/" + index;
  path = "m/" + purpose + "/" + coinType + "/" + account + "/" + change + "/" + index;
  path = "m/" + purpose + "/" + coinType + "/" + account + "/" + change + "/" + index;
  path = "m/" + purpose + "/" + coinType + "/" + account + "/" + change + "/" + index;
  path = "m/" + purpose + "/" + coinType + "/" + account + "/" + change + "/" + index;
  path = "m/" + purpose + "/" + coinType + "/" + account + "/" + change + "/" + index;

  // 1. tick
  // 2. null
}

// with
  // without

for (let i = 0; i <= 10; i++) {
  //console.log("hdkey: ", hdkey);
  childkey = hdkey.derive(path);
  //console.log("childkey: ", childkey);
  address = ethUtils.publicToAddress(childkey.publicKey, true);

  console.log("Generated address: ", ethUtils.bufferToHex(address));
}



//console.log("Checksum address: ", ethUtils.toChecksumAddress(ethUtils.bufferToHex(address)))