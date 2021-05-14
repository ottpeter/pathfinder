/**  Needs editing*/
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const { Executor, Task, utils, vm } = require('yajsapi');
const { program } = require('commander');

const matrix = fs.readFileSync('array.json');

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
      let frame = task.data();
      
      ctx.send_json("/golem/input/input.json", {
        firstTwo: matrix[frame],
      });
      
      ctx.run("/golem/work/hello.js");

      ctx.download_file(
        `/golem/output/result.json`,
        path.join(__dirname, `./output_${frame[0]}_${frame[1]}.json`)
      );
      let resultObj = JSON.parse(fs.readFileSync('./output_${frame[0]}_${frame[1]}.json'));
      // Analyze return value (if result.json is created, then it was a successful run)
        // Success WE FOUND IT, exit
        // Success: remove from matrix (that does not mean that we found what we want)
        // Failure: don't remove from matrix (probably download_file wouldn't run at all)
      if (resultObj.Success === true) {
        // save
        // print
        // exit
      }
      if (resultObj.scriptRun === true) {
        //remove
        // rewrite array.json
      } else {
        // Do nothing
      }
      yield ctx.commit({timeout: dayjs.duration({ seconds: 120 }).asMilliseconds()});
      task.accept_result("output_file");
    }

    ctx.log("no more frames to render");
    return;
  }

  const frames = range(0, matrix.length, 1);
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
        frames.map((frame) => new Task(frame))
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

