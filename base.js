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
const matrix = JSON.parse(fs.readFileSync('array.json')).matrix;

dayjs.extend(duration);

const { asyncWith, logUtils, range } = utils;

async function main(subnetTag, driver, network) {
  const _package = await vm.repo({
    image_hash: "",
    min_mem_gib: 0.5,
    min_storage_gib: 2,
  });

  async function* worker(ctx, tasks) {
    for await (let task of tasks) {
      let index = task.data();
      
      ctx.send_json("/golem/input/input.json", {
        firstTwo: matrix[index],
      });
      
      ctx.run("/golem/work/finder.js");

      ctx.download_file(
        `/golem/output/result.json`,
        path.join(__dirname, `./output_${index[0]}_${index[1]}.json`)
      );
      let resultObj = JSON.parse(fs.readFileSync('./output_${frame[0]}_${frame[1]}.json'));
      if (resultObj.Success === true) {
        fs.writeFileSync( "SUCCESS.txt", "Found! " + resultObj.path);
        console.log(successMessage);
        console.log("Path: ", path);
        return;
      }
      if (resultObj.scriptRun === true) {
        matrix.splice(index, 1);
        fs.writeFileSync('array.json', JSON.stringify({matrix: matrix}));
      } else {
        console.log("This run was not successful, but mos likely this else-branch won't run. ");
      }
      yield ctx.commit({timeout: dayjs.duration({ seconds: 120 }).asMilliseconds()});
      task.accept_result("output_file");
    }

    ctx.log("no more frames to render");
    return;
  }

  const options = range(0, matrix.length, 1);
  const timeout = dayjs.duration({ minutes: 360 }).asMilliseconds();

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
        options.map((option) => new Task(option))
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

