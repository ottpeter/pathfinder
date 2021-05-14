/**  Needs editing*/
const path = require('path');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const { Executor, Task, utils, vm } = require('yajsapi');
const { program } = require('commander');
const chalk = require("chalk");
const boxen = require("boxen");
const fs = require('fs');

// This is just message styling...
const greeting = chalk.white.bold("Start!"); const startMessage = boxen( greeting, { padding: 1, margin: 1, borderStyle: "round", borderColor: "green", backgroundColor: "#555555"} );
const success = chalk.green.bold("SUCCESS!"); const successMessage = boxen( success, { padding: 1, margin: 1, borderStyle: "round", borderColor: "green", backgroundColor: "#220022"} );
const matrix = JSON.parse(fs.readFileSync('./ethfinder/array.json')).matrix;

dayjs.extend(duration);

const { asyncWith, logUtils, range } = utils;

async function main(subnetTag, driver, network) {
  const _package = await vm.repo({
    image_hash: "",
    min_mem_gib: 0.3,
    min_storage_gib: 0.5,
  });

  async function* worker(ctx, tasks) {
    for await (let task of tasks) {
      let index = task.data();
      
      ctx.send_json("/golem/input/input.json", {
        firstTwo: matrix[index],
        mnemonic: "fresh outdoor blue asthma trigger digital come language alarm style purpose giant hello ghost jar person zero select canvas mercy reveal prison boss finish",
        password: "PasswordMayOrMayNotBeUsed",
        addr: "0x11d7F8337C03459101D38DE3B4ABaBFE692Cf711"
      });
      
      ctx.run("/golem/work/finder.js");

      ctx.download_file(
        `/golem/output/result.json`,
        path.join(__dirname, `./output_${matrix[index][0]}_${matrix[index][1]}.json`)
      );
      yield ctx.commit({timeout: dayjs.duration({ seconds: 120 }).asMilliseconds()});
      let resultObj = JSON.parse(fs.readFileSync(path.join(__dirname, `./output_${matrix[index][0]}_${matrix[index][1]}.json`)));
      if (resultObj.Success === true) {
        fs.writeFileSync( "SUCCESS.txt", "Found! " + resultObj.path);
        console.log(successMessage);
        console.log("Path: ", resultObj.path);
        return;
      }
      if (resultObj.scriptRun === true) {
        matrix.splice(index, 1);
        fs.writeFileSync('./ethfinder/array.json', JSON.stringify({matrix: matrix}));
        task.accept_result(`./output_${matrix[index][0]}_${matrix[index][1]}.json`);
      } else {
        console.log("This run was not successful, but mos likely this else-branch won't run. ");
        task.reject_task("This run was not successul");
      }
    }

    ctx.log("end");
    return;
  }

  const variations = range(0, matrix.length, 1);
  const timeout = dayjs.duration({ minutes: 15 }).asMilliseconds();

  await asyncWith(
    new Executor({
      task_package: _package,
      max_workers: 6,
      timeout: timeout,
      budget: "10.0",
      subnet_tag: subnetTag,
      driver: driver,
      network: network,
      event_consumer: logUtils.logSummary(),
    }),
    async (executor) => {
      for await (let task of executor.submit(
        worker,
        variations.map((variant) => new Task(variant))
      )) {
        console.log("result=", task.result());
      }
    }
  );
  return;
}

program
  .option("--subnet-tag <subnet>", "set subnet name", "devnet-beta.1")
  .option("--driver <driver>", "payment driver name, for example 'zksync'", "zksync")
  .option("--network <network>", "network name, for example 'rinkeby'", "rinkeby")
  .option("-d, --debug", "output extra debugging");
program.parse(process.argv);
if (program.debug) {
  utils.changeLogLevel("debug");
}
console.log(`Using subnet: ${program.subnetTag}, network: ${program.network}, driver: ${program.driver}`);
main(program.subnetTag, program.driver, program.network);

