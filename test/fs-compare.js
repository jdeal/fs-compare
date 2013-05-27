/* global describe, it, before */

var expect = require('chai').expect;
var fsCompare = require('..');
var fs = require('fs');
var Path = require('path');

var tmpDir = Path.join(__dirname, 'tmp');
var smallFileName = Path.join(tmpDir, 'small.txt');
var bigFileName = Path.join(tmpDir, 'big.txt');
var missingFileName = Path.join(tmpDir, 'missing.txt');

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
      fsCompare.mtime(smallFileName, bigFileName, function (err, diff) {
        expect(diff).to.equal(-1);
        done();
      });
    });
    it('should say big file came after small file', function (done) {
      fsCompare.mtime(bigFileName, smallFileName, function (err, diff) {
        expect(diff).to.equal(1);
        done();
      });
    });
    it('should say big file has same date as big file', function (done) {
      fsCompare.mtime(bigFileName, bigFileName, function (err, diff) {
        expect(diff).to.equal(0);
        done();
      });
    });
    it('should say missing file came before small file', function (done) {
      fsCompare.mtime(missingFileName, smallFileName, function (err, diff) {
        expect(diff).to.equal(-1);
        done();
      });
    });
  });
  describe('size', function () {
    it('should say small file is smaller', function (done) {
      fsCompare.size(smallFileName, bigFileName, function (err, diff) {
        expect(diff).to.equal(-1);
        done();
      });
    });
    it('should say big file is bigger', function (done) {
      fsCompare.size(bigFileName, smallFileName, function (err, diff) {
        expect(diff).to.equal(1);
        done();
      });
    });
    it('should say small file is equal to samll file', function (done) {
      fsCompare.size(smallFileName, smallFileName, function (err, diff) {
        expect(diff).to.equal(0);
        done();
      });
    });
  });
});

