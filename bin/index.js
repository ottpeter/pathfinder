#!/usr/bin/env node

const chalk = require("chalk");
const boxen = require("boxen");
var bip39 = require ('bip39');                        // Convert mnemonic to seed tool
var HDKey = require('hdkey');                         // Generate from HD path tool
var ethUtils = require('ethereumjs-util');            // Convert to address tool

// This is just message styling...
const greeting = chalk.white.bold("Hello!");
const msgBox = boxen( greeting, { padding: 1, margin: 1, borderStyle: "round", borderColor: "green", backgroundColor: "#555555"} );
console.log(msgBox);

// The credentials
let mnemonic = "pact blast security evolve faculty rural wheat ladder gun thrive garment urban";
let password = "";
let seed = null;
let hdkey = null;
let childkey = null;
let address = null;

for (let i = 0; i <= 10; i++) {
  // Convert mnemoic to seed
  seed = bip39.mnemonicToSeedSync(mnemonic, password);
  //console.log("bip39: ", seed);
  // Generate master key from seed
  hdkey = HDKey.fromMasterSeed(Buffer.from(seed, 'hex'));
  //console.log("hdkey: ", hdkey);
  childkey = hdkey.derive("m/44'/60'/0'/0/" + i);
  //console.log("childkey: ", childkey);
  address = ethUtils.publicToAddress(childkey.publicKey, true);

  console.log("Generated address: ", ethUtils.bufferToHex(address));
  //console.log("Checksum address: ", ethUtils.toChecksumAddress(ethUtils.bufferToHex(address)))
}

