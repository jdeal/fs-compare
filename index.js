var fs = require('fs');

var stat = function (key, fileName, cb) {
  fs.stat(fileName, function (err, stat) {
    if (err) {
      return cb(err);
    }
    cb(null, stat[key]);
  });
};

var fsCompare = function (statFn, fileNameA, fileNameB, cb) {
  statFn(fileNameA, function (errA, valueA) {
    statFn(fileNameB, function (errB, valueB) {
      // only allow missing file errors
      if (errA && errA.code !== 'ENOENT') {
        return cb(errA);
      }
      if (errB && errB.code !== 'ENOENT') {
        return cb(errB);
      }
      if (valueA instanceof Date) {
        valueA = valueA.getTime();
      }
      if (valueB instanceof Date) {
        valueB = valueB.getTime();
      }
      if (errA && errB) {
        return cb(null, 0);
      }
      if (errA || valueA < valueB) {
        return cb(null, -1);
      }
      if (errB || valueA > valueB) {
        return cb(null, 1);
      }
      return cb(null, 0);
    });
  });
};

['size', 'atime', 'mtime', 'ctime'].forEach(function (key) {
  fsCompare[key] = fsCompare.bind(null, stat.bind(null, key));
});

module.exports = fsCompare;
