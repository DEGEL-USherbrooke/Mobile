// http://jestjs.io/docs/en/troubleshooting.html

const { exec } = require('child_process');

// for mac : node --inspect-brk node_modules/.bin/jest --runInBand
exec('node --inspect-brk ./node_modules/jest/bin/jest.js --runInBand', (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    return;
  }

  // the *entire* stdout and stderr (buffered)
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});

console.log("open : chrome://inspect");