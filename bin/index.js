#!/usr/bin/env node

const chalk = require("chalk");
const boxen = require("boxen");
const fs =require("fs");
var bip39 = require ('bip39');                        // Convert mnemonic to seed tool
var HDKey = require('hdkey');                         // Generate from HD path tool
var ethUtils = require('ethereumjs-util');            // Convert to address tool

// This is just message styling...
const greeting = chalk.white.bold("Start!");
const msgBox = boxen( greeting, { padding: 1, margin: 1, borderStyle: "round", borderColor: "green", backgroundColor: "#555555"} );
console.log(msgBox);
const success = chalk.green.bold("SUCCESS!");
const sucBox = boxen( success, { padding: 1, margin: 1, borderStyle: "round", borderColor: "green", backgroundColor: "#220022"} );

// MAX values
const MAX_PURPOSE = 100;
const MAX_COINTYPE = 100;
const MAX_ACCOUNT = 0;
const MAX_CHANGE = 0;
const MAX_INDEX = 10;

// START values
const START_PURPOSE = 0;
const START_COINTYPE = 0;
const START_ACCOUNT = 0;
const START_CHANGE = 0;
const START_INDEX = 0;

const FAV = [2,4,8,16,32,64,128,256,512,1024,9,11,20,29,38,110,0];


// The credentials
let mnemonic = "beach ceiling square fiscal success ghost lady gossip betray ostrich canal average sting blind exchange assault since they wet hen spin age mechanic coil";
let password = "Oxy63Lufiyogasii613";
let lookingForAddr = "0x05ff2FA8D64F55627b9B0F8911Ff8d80c481C973";
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
function forAll() {
  for (let purpose = START_PURPOSE; purpose <= MAX_PURPOSE; purpose++ ) {
    for (let coinType = START_COINTYPE; coinType <= MAX_COINTYPE; coinType++) {
      for (let account = START_ACCOUNT; account <= MAX_ACCOUNT; account++) {
        for (let change = START_CHANGE; change <= MAX_CHANGE; change++) {
          for (let index = START_INDEX; index <= MAX_INDEX; index++) {
            runVariations(purpose, coinType, account, change, index);
          }
        }
      }
    }
  }
}

/** 5 for cycles FAV */
function forFav() {
  for (let purpose = 0; purpose < FAV.length; purpose++ ) {
    for (let coinType = 0; coinType < FAV.length; coinType++) {
      for (let account = 0; account < FAV.length; account++) {
        for (let change = 0; change < FAV.length; change++) {
          for (let index = 0; index <= 25; index++) {
            runVariations(FAV[purpose], FAV[coinType], FAV[account], FAV[change], index);
          }
        }
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


function deriveAddress(path) {
  childkey = hdkey.derive(path);
  address = ethUtils.publicToAddress(childkey.publicKey, true);
  let currentAddr = ethUtils.bufferToHex(address);

  console.log("path: ", path);
  console.log("Generated address: ", currentAddr);
  
  if (currentAddr.includes(lookingForAddr) || ethUtils.toChecksumAddress(currentAddr).includes(lookingForAddr)) {
    fs.writeFileSync( "output.txt", "Found! " + path)
    console.log(sucBox);
    console.log("Path: ", path);
    process.exit();
  } 
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

withoutChange(purpose, coinType, account, index) {
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

withoutAccount(purpose, coinType, change, index) {
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

withoutAccountAndChange(purpose, coinType, index) {
  path = "m/" + purpose + "/" + coinType + "/"  + index;
  deriveAddress(path);
  path = "m/" + purpose + "/" + coinType + "'/"  + index;
  deriveAddress(path);
  path = "m/" + purpose + "'/" + coinType + "/" + index;
  deriveAddress(path);
  path = "m/" + purpose + "'/" + coinType + "'/" + index;
  deriveAddress(path);
}