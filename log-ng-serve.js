import { spawn } from 'child_process';
import { createWriteStream } from 'fs';

// Create a writable stream for the log file
const logStream = createWriteStream('error-log.txt', { flags: 'a' });

// // Spawn the ng serve process
// const ngServe = spawn('ng', ['serve', '--o']);

const ngServe = spawn('ng', ['serve', '--o'], { shell: true });

// Function to log output with timestamp
const logWithTimestamp = (data) => {
  const timestamp = new Date().toISOString();
  logStream.write(`[${timestamp}] ${data}`);
};

// Log both stdout and stderr with timestamp
ngServe.stdout.on('data', (data) => {
  logWithTimestamp(data);
});

ngServe.stderr.on('data', (data) => {
  logWithTimestamp(data);
});

// Handle process exit
ngServe.on('close', (code) => {
  console.log(`ng serve process exited with code ${code}`);
});
