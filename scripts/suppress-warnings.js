const originalEmit = process.emit;
process.emit = function (name, ...args) {
  if (name === 'warning' && args[0] && args[0].name === 'DeprecationWarning' && args[0].message.includes('util._extend')) {
    return false;
  }
  return originalEmit.apply(process, [name, ...args]);
};
