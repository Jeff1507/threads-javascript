const { Worker } = require('worker_threads');

function runTask(taskNumber) {
  return new Promise((resolve, reject) => {
    const delay = Math.floor(Math.random() * 3000) + 1000; // Atraso aleatório entre 1 e 4 segundos
    const worker = new Worker(`
      const { parentPort, workerData } = require('worker_threads');
      const start = Date.now();
      const delay = workerData.delay;
      while (Date.now() - start < delay); // Simula tarefa pesada com atraso variável
      parentPort.postMessage(\`Tarefa \${workerData.taskNumber} concluída após \${delay} ms\`);
    `, { eval: true, workerData: { taskNumber, delay } });

    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker finalizou com código ${code}`));
    });
  });
}

async function executeTasks() {
  const promises = [];
  for (let i = 1; i <= 10; i++) {
    promises.push(runTask(i));
  }
  const results = await Promise.all(promises);
  results.forEach(result => console.log(result));
}

executeTasks();
