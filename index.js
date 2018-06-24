const {
  Worker, isMainThread, parentPort, workerData
} = require('worker_threads');

const fs = require('fs');

if (isMainThread) {
  async function parseJSAsync(script) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: script
      });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  };
	for (let i=0;i<5;i++) {
		parseJSAsync(__filename)
		.then(val => console.dir(val))
		.then(() => {console.log('\n\n\n')})
		.catch(e => console.dir(e))
	}
} else {
  const script = workerData;
  parentPort.postMessage(fs.readFileSync(script).toString());
}


