const moment = require('moment-timezone');
const fs = require('fs');

class Logger {
  constructor(filename) {
    this.filename = filename;
  }

  log(message) {
    const istTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
    const logEntry = `[${istTime}] ${message}\n`;
    fs.appendFile(this.filename, logEntry, (err) => {
      if (err) {
        console.error('Error writing to log file:', err);
      }
    });
  }
}

module.exports = Logger;
// Example usage:
// logger.log('This is a log message.');
