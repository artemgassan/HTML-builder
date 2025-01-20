const { stdout, stdin, exit } = process;
const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Введите текст:\n');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    exit();
  } else {
    output.write(data);
  }
});

process.on('exit', () => {
  stdout.write('\nВведенный текст записан в файл text.txt');
});

process.on('SIGINT', () => {
  exit();
});
