const { spawn } = require('node:child_process');

const child = spawn(process.execPath, ['server.js'], {
  stdio: ['ignore', 'pipe', 'pipe'],
});

let started = false;

function finish(code) {
  child.kill('SIGTERM');
  process.exit(code);
}

async function checkHome() {
  try {
    const response = await fetch('http://127.0.0.1:3000');
    console.log(`HOME_STATUS=${response.status}`);
    finish(response.ok ? 0 : 1);
  } catch (error) {
    console.error(error);
    finish(1);
  }
}

child.stdout.on('data', (chunk) => {
  const output = chunk.toString();
  process.stdout.write(output);
  if (!started && output.includes('Ready')) {
    started = true;
    void checkHome();
  }
});

child.stderr.on('data', (chunk) => process.stderr.write(chunk));
child.on('exit', (code) => {
  if (!started) process.exit(code || 1);
});

setTimeout(() => {
  console.error('Web startup timeout');
  finish(1);
}, 20000);
