const { Worker } = require('worker_threads');

class TaskWorker {
  constructor(taskNumber) {
    this.taskNumber = taskNumber;
  }

  run() {
    return new Promise((resolve, reject) => {
      const delay = Math.floor(Math.random() * 3000) + 1000; // Atraso aleatório entre 1 e 4 segundos
      const worker = new Worker(`
        const { parentPort, workerData } = require('worker_threads');
        const delay = workerData.delay;
        const start = Date.now();
        while (Date.now() - start < delay); // Simula tarefa pesada com atraso variável
        parentPort.postMessage(\`Tarefa \${workerData.taskNumber} concluída após \${delay} ms\`);
      `, { eval: true, workerData: { taskNumber: this.taskNumber, delay } });

      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0)
          reject(new Error(`Worker finalizou com código ${code}`));
      });
    });
  }
}

async function executeTasks() {
  const tasks = [];
  for (let i = 1; i <= 10; i++) {
    const task = new TaskWorker(i);
    tasks.push(task.run());
  }
  const results = await Promise.all(tasks);
  results.forEach(result => console.log(result));
}

executeTasks();
