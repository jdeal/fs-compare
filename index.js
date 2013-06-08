var fs = require('fs');

var stat = function (key, fileName, cb) {
  fs.stat(fileName, function (err, stat) {
    if (err) {
      return cb(err);
    }
    cb(null, stat[key]);
  });
};

var statSync = function (key, fileName) {
  var stat = fs.statSync(fileName);
  return stat[key];
};

var compareTest = function (errA, valueA, errB, valueB) {
  // only allow missing file errors
  if (errA && errA.code !== 'ENOENT') {
    return [errA];
  }
  if (errB && errB.code !== 'ENOENT') {
    return [errB];
  }
  if (valueA instanceof Date) {
    valueA = valueA.getTime();
  }
  if (valueB instanceof Date) {
    valueB = valueB.getTime();
  }
  if (errA && errB) {
    return [null, 0];
  }
  if (errA || valueA < valueB) {
    return [null, -1];
  }
  if (errB || valueA > valueB) {
    return [null, 1];
  }
  return [null, 0];
};

var fsCompare = function (statFn, fileNameA, fileNameB, cb) {
  statFn(fileNameA, function (errA, valueA) {
    statFn(fileNameB, function (errB, valueB) {
      var result = compareTest(errA, valueA, errB, valueB);
      // only allow missing file errors
      return cb(result[0], result[1]);
    });
  });
};

var fsCompareSync = function (statFn, fileNameA, fileNameB) {
  var valueA;
  var valueB;
  var errA;
  var errB;
  try {
    valueA = statFn(fileNameA);
  } catch (err) {
    errA = err;
  }
  try {
    valueB = statFn(fileNameB);
  } catch (err) {
    errB = err;
  }
  var result = compareTest(errA, valueA, errB, valueB);
  if (result[0]) {
    throw result[0];
  } else {
    return result[1];
  }
};

['size', 'atime', 'mtime', 'ctime'].forEach(function (key) {
  fsCompare[key] = fsCompare.bind(null, stat.bind(null, key));
  fsCompareSync[key] = fsCompareSync.bind(null, statSync.bind(null, key));
});

fsCompare.sync = fsCompareSync;

module.exports = fsCompare;