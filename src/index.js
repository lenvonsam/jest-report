'use strict';

/* eslint-disable no-unused-vars */
const path = require('path');
const pathSep = path.sep;
const fs = require('fs-extra');
const md5 = require('md5');
const {fileSyncDB} = require('./db');
const JestReportTempDir = '.jest-report-temp';
if (!fs.existsSync(JestReportTempDir)) {
  fs.mkdirSync(JestReportTempDir);
}

function jestReporter(result) {
  // result.testResults.forEach(it => logTestSuite(it));
  const outputDir = process.env.reporterDirectory || './dist/test-report';
  const outputAssetDir = path.resolve(outputDir, 'asset');
  const boilerplateDir = path.join(__dirname, '../boilerplate/dist');
  fs.removeSync(outputDir);
  fs.ensureDirSync(outputDir);
  fs.ensureDirSync(outputAssetDir);
  // 2. 移动模板到当前目录
  fs.copySync(boilerplateDir, outputDir, {overwrite: true});
  let pictures = [];
  if (fs.existsSync(JestReportTempDir)) {
    fs.copySync(JestReportTempDir, outputAssetDir, {overwrite: true});
    pictures = fs.readdirSync(outputAssetDir);
  }
  // result.picturesData = pictures;
  result.testResults.forEach(suiteResult => {
    suiteResult.testResults.forEach((testResult) => {
      let key = 'key_' + md5(testResult.fullName);
      testResult.picturesData = pictures.filter(filename => filename.startsWith(key + "_img_"));
      const db = new fileSyncDB(path.resolve(outputAssetDir, key + '_db.json'));
      testResult.otherMsg = db.get();
      db.clean();
    })
  })
  fs.writeFileSync(path.resolve(outputDir, 'testResultData.json'), JSON.stringify(result, null, 4));
  fs.removeSync(JestReportTempDir);
  return result;
}


function monitorPage(key, page) {
  const db = new fileSyncDB(path.resolve(JestReportTempDir, key + '_db.json'));
  if (db.get().isMonitored) {
    return;
  }
  page.on('did-get-response-details', function (event, ...args) {
    db.merge({
      networkHist: [{
        event,
        args,
        timestamp: new Date().getTime()
      }]
    })
  });
  // page.on('did-navigate-in-page', function (event, ...args) {
  //   db.merge({
  //     pageUrlHistory: [{
  //       event,
  //       args,
  //       timestamp: new Date().getTime()
  //     }]
  //   })
  // });
  page.on('console', function (event, ...args) {
    db.merge({
      pageConsole: [{
        event,
        args,
        timestamp: new Date().getTime()
      }]
    });
  });
}

jestReporter.helperBuilder = function (suiteName, testName) {
  let testKey = 'key_' + md5((suiteName ? suiteName + ' ' : '') + (testName ? testName : ''));
  const db = new fileSyncDB(path.resolve(JestReportTempDir, testKey + '_db.json'));
  db.init({
    isMonitored: false,
    pageConsole: [],
    // pageUrlHistory: [],
    networkHist: [],
  });
  return {
    genPicturePath: () => path.resolve(JestReportTempDir, testKey + "_img_" + (new Date().getTime()) + '.png'),
    monitorPage: (page) => monitorPage(testKey, page),
  };
}

module.exports = jestReporter;
