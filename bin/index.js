#!/usr/bin/env node

const chalk = require("chalk");
const boxen = require("boxen");
const fs =require("fs");
const levenshtein = require('js-levenshtein');
const bip39 = require ('bip39');                        // Convert mnemonic to seed tool
const wordlist = bip39.wordlists.english;
const HDKey = require('hdkey');                         // Generate from HD path tool
const ethUtils = require('ethereumjs-util');            // Convert to address tool

const FAV = [2,4,8,16,32,64,128,256,512,1024,9,11,20,29,38,110,0];

/** Settings */
// MAX values
const MAX_PURPOSE = 44;
const MAX_COINTYPE = 60;
const MAX_ACCOUNT = 256;
const MAX_CHANGE = 256;
const MAX_INDEX = 100;
// START values
const START_PURPOSE = 44;
const START_COINTYPE = 60;
const START_ACCOUNT = 0;
const START_CHANGE = 0;
const START_INDEX = 0;

/** Settings */
// Wallet data
let mnemonic = "fresh outdoor blue asthma trigger digital come language alarm style purpose giant hello ghost jar person zero select canvas mercy reveal prison boss finish";
let password = "BadPassword";
let lookingForAddr = "0x11d7F8337C03459101D38DE3B4ABaBFE692Cf711";
let childkey = null;
let address = null;
let origArray = [];
let levMatrix = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];	      // Array of arrays, each array representing specific position of mnemoic. Those words will be listed, which Levenshtein distance is 1 or 2
let generatedMnemonics = [];
let hdkeyArray = [];
let seedArray = [];

// This is just message styling...
const greeting = chalk.white.bold("Start!"); const startMessage = boxen( greeting, { padding: 1, margin: 1, borderStyle: "round", borderColor: "green", backgroundColor: "#555555"} );
const success = chalk.green.bold("SUCCESS!"); const successMessage = boxen( success, { padding: 1, margin: 1, borderStyle: "round", borderColor: "green", backgroundColor: "#220022"} );

/** Init */
let seed = bip39.mnemonicToSeedSync(mnemonic, password);                           // Convert mnemoic to seed
let hdkey = HDKey.fromMasterSeed(Buffer.from(seed, 'hex'));                        // Generate master key from seed
let seedWithoutPass = bip39.mnemonicToSeedSync(mnemonic, "");                      // Convert mnemoic to seed (no password)
let hdkeyWithoutPass = HDKey.fromMasterSeed(Buffer.from(seedWithoutPass, 'hex'));  // Generate master key from seed (no password)
//seedAndKeyForGenerated();                                                        // Only if we use Levanshtein
//console.log("seed (with pass): ", seed);
//console.log("seed (without pass): ", seedWithoutPass);


/** RUN */
//fillLevenshteinMatrix();
//generateMnemonics();
console.log(startMessage);
forAll();         // or forFav()
/** END */


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



function  fillLevenshteinMatrix() {
  for (let i = 0; i < 24; i++) {					// Go through mnemonic array
    for (let k = 0; k < wordlist.length; k++) {				// Go through wordlist array
      let distance = levenshtein(origArray[i], wordlist[k]);
      if (distance == 1 || distance == 1) {
        console.log("distance: ", distance);
        console.log("mnemonic word: ", origArray[i]);
        console.log("similar: ", wordlist[k]);
        levMatrix[i].push(wordlist[k]);
      }
    }
  }
  console.log("levMatrix: ", levMatrix);
}


function generateMnemonics() {
  for (let i = 0; i < 24; i++) {
    for (let k = 0; k < levMatrix[i].length; k++) {
      generatedMnemonics.push(generateMnemonic(levMatrix[i][k], i));
    }
  }
  console.log("generated mnemonics: ", generatedMnemonics);
}

function generateMnemonic(word, position) {
  let theMnemonic = "";
  for (let i = 0; i < 24; i++) {
    if (i == position) {			// Swap
      theMnemonic = theMnemonic + " " + word;
    } else {
      theMnemonic = theMnemonic + " " + origArray[i];
    }
  }
  theMnemonic = theMnemonic.slice(1);
  return theMnemonic;
}

function seedAndKeyForGenerated() {
  /** For generated mnemonics */
  for (let i = 0; i < generatedMnemonics.length; i++) {
    seedArray[i] = bip39.mnemonicToSeedSync(generatedMnemonics[i], password);
    hdkeyArray[i] = HDKey.fromMasterSeed(Buffer.from(seedArray[i], 'hex'));
  }
  /** For generated mnemonics without pass*/
  for (let i = generatedMnemonics.length; i < generatedMnemonics.length*2; i++) {
    seedArray[i] = bip39.mnemonicToSeedSync(generatedMnemonics[i], "");
    hdkeyArray[i] = HDKey.fromMasterSeed(Buffer.from(seedArray[i], 'hex'));
  }
}

function deriveForGenerated() {
  for (let i = 0; i < hdkeyArray.length; i++) {
    childkey = hdkeyArray[i].derive(path);
    address = ethUtils.publicToAddress(childkey.publicKey, true);
    currentAddr = ethUtils.bufferToHex(address);
    console.log("path: ", path);
    console.log("Generated address: ", currentAddr);
  
    if (ethUtils.toChecksumAddress(currentAddr).includes(ethUtils.toChecksumAddress(lookingForAddr))) {
      done(path);
    }
  }
}

function done(path) {
  fs.writeFileSync( "output.txt", "Found! " + path);
  console.log(successMessage);
  console.log("Path: ", path);
  process.exit();
}