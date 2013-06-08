/* global describe, it, before */

var expect = require('chai').expect;
var fsCompare = require('..');
var fs = require('fs');
var Path = require('path');

var tmpDir = Path.join(__dirname, 'tmp');
var smallFileName = Path.join(tmpDir, 'small.txt');
var bigFileName = Path.join(tmpDir, 'big.txt');
var missingFileName = Path.join(tmpDir, 'missing.txt');

var fsCompareSync = fsCompare.sync;

var testCompare = function (key, a, b, expectedDiff, done) {
  var diff = fsCompareSync[key](a, b);
  expect(diff).to.equal(expectedDiff);
  fsCompare[key](a, b, function (err, diff) {
    expect(diff).to.equal(expectedDiff);
    done();
  });
};

describe('fs-compare', function () {
  before(function (done) {
    var writeSmallFile, writeBigFile;
    fs.mkdir(tmpDir, function () {
      writeSmallFile();
    });
    writeSmallFile = function () {
      fs.writeFile(smallFileName, '01234', function () {
        // granularity of some file systems is 1 second
        setTimeout(writeBigFile, 1000);
      });
    };
    writeBigFile = function () {
      fs.writeFile(bigFileName, '0123456789', function () {
        done();
      });
    };
  });
  describe('mtime', function (done) {
    it('should say small file came before big file', function (done) {
      testCompare('mtime', smallFileName, bigFileName, -1, done);
    });
    it('should say big file came after small file', function (done) {
      testCompare('mtime', bigFileName, smallFileName, 1, done);
    });
    it('should say big file has same date as big file', function (done) {
      testCompare('mtime', bigFileName, bigFileName, 0, done);
    });
    it('should say missing file came before small file', function (done) {
      testCompare('mtime', missingFileName, smallFileName, -1, done);
    });
  });
  describe('size', function () {
    it('should say small file is smaller', function (done) {
      testCompare('size', smallFileName, bigFileName, -1, done);
    });
    it('should say big file is bigger', function (done) {
      testCompare('size', bigFileName, smallFileName, 1, done);
    });
    it('should say small file is equal to samll file', function (done) {
      testCompare('size', smallFileName, smallFileName, 0, done);
    });
  });
  describe('custom', function () {
    it('should use custom function', function (done) {
      var syncCtimeFn = function (fileName) {
        return fs.statSync(fileName).ctime;
      };
      var diff = fsCompare.sync(syncCtimeFn, smallFileName, bigFileName);
      expect(diff).to.equal(-1);
      var ctimeFn = function (fileName, cb) {
        fs.stat(fileName, function (err, stat) {
          if (err) {
            return cb(err);
          }
          return cb(null, stat.ctime);
        });
      };
      fsCompare(ctimeFn, smallFileName, bigFileName, function (err) {
        done(err);
      });
    });
  });
});

