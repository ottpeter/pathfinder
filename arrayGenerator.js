const { writeFileSync } = require('fs');

fs = require('fs');

const MAX_PURPOSE = 256;
const MAX_COINTYPE = 256;

let matrix = [];

for (let purpose = 0; purpose <= 256; purpose++) {
  for (let coinType = 0; coinType <= 256; coinType++) {
    matrix.push([purpose, coinType]);
  }
}

console.log("Matrix: ", matrix);

fs.writeFileSync('array.json', JSON.stringify({matrix: matrix}));