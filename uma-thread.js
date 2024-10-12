function executeTask(taskNumber) {
    console.log(`\nIniciando tarefa ${taskNumber} ...`);
    // Simula uma tarefa pesada
    const start = Date.now();
    while (Date.now() - start < 1000); // Espera 1 segundo
    console.log(`\nTarefa ${taskNumber} concluída!`);
  }
  
  // Executa 10 tarefas sequencialmente
  for (let i = 1; i <= 10; i++) {
    executeTask(i);
  }
  