# fs-compare

[![Build Status](https://secure.travis-ci.org/jdeal/fs-compare.png)](http://travis-ci.org/jdeal/fs-compare)

Simple comparison of attributes of two files.

# Installation

```bash
npm install fs-compare
```

# Usage

## Asynchronous

```js
var fsCompare = require('fs-compare');

var modifiedTime = function (fileName, cb) {
  fs.stat(fileName, function (err, stat) {
    if (err) {
      return cb(err);
    }
    return cb(null, stat.mtime);
  });
};

fsCompare(modifiedTime, 'foo.txt', 'bar.txt', function (err, diff) {
  // diff is -1 if foo.txt was created before bar.txt
  // diff is 0 if foo.txt was created at the same time as bar.txt
  // diff is 1 if foo.txt was created after bar.txt
});
```

Stat helpers are included, so you can shortcut the above with:

```js
var fsCompare = require('fs-compare');

fsCompare.ctime('foo.txt', 'bar.txt', function (err, diff) {
  // diff is -1 if foo.txt was created before bar.txt
  // diff is 0 if foo.txt was created at the same time as bar.txt
  // diff is 1 if foo.txt was created after bar.txt
});
```

## Synchronous

```js
var fsCompareSync = require('fs-compare').sync;

var modifiedTime = function (fileName, cb) {
  return fs.statSync(fileName).mtime;
};

var diff = fsCompareSync(modifiedTime, 'foo.txt', 'bar.txt');

// diff is -1 if foo.txt was created before bar.txt
// diff is 0 if foo.txt was created at the same time as bar.txt
// diff is 1 if foo.txt was created after bar.txt
```

Stat helpers are included, so you can shortcut the above with:

```js
var fsCompareSync = require('fs-compare').sync;

var diff = fsCompareSync.mtime(modifiedTime, 'foo.txt', 'bar.txt');

// diff is -1 if foo.txt was created before bar.txt
// diff is 0 if foo.txt was created at the same time as bar.txt
// diff is 1 if foo.txt was created after bar.txt
```

# API

## fsCompare(testFunction, fileNameA, fileNameB, callback)

- `testFunction` - Function with parameters `(fileName, cb)` which tests the
file and returns the value to be compared on the callback.
- `fileNameA`, `fileNameB` - Filenames of files to be tested.
- `callback` - Callback to accept `(error, diff)`, where `diff` is:
    - -1 - file A tests less than file B
    - 0 - file A tests equal to file B
    - 1 - file A tests greater than file B

## fsCompare.mtime(fileNameA, fileNameB, callback)

Compares the modified timestamp of the files.

## fsCompare.ctime(fileNameA, fileNameB, callback)

Compares the created timestamp of the files.

## fsCompare.atime(fileNameA, fileNameB, callback)

Compares the access timestamp of the files.

## fsCompare.size(fileNameA, fileNameB, callback)

Compares the size of the files.

## fsCompareSync(testFunction, fileNameA, fileNameB)

Synchronous version of `fsCompare`.

## fsCompareSync.mtime(fileNameA, fileNameB, callback)

Synchronous version of `fsCompare.mtime`.

## fsCompareSync.ctime(fileNameA, fileNameB, callback)

Synchronous version of `fsCompare.ctime`.

## fsCompareSync.atime(fileNameA, fileNameB, callback)

Synchronous version of `fsCompare.atime`.

## fsCompareSync.size(fileNameA, fileNameB, callback)

Synchronous version of `fsCompare.size`.