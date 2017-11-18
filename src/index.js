'use strict';

/* eslint-disable no-unused-vars */
const path = require('path');
const pathSep = path.sep;
const fs = require('fs-extra');
const md5 = require('md5');

const JestReportTempDir = '.jest-report-temp';

function jestReporter(result) {
  // result.testResults.forEach(it => logTestSuite(it));
  const outputDir = process.env.reporterDirectory || './dist/test-report';
  const outputImgDir = path.resolve(outputDir,'images');
  const boilerplateDir = path.join(__dirname, '../boilerplate/dist');
  fs.removeSync(outputDir);
  fs.ensureDirSync(outputDir);
  fs.ensureDirSync(outputImgDir);
  // 2. 移动模板到当前目录
  fs.copySync(boilerplateDir, outputDir, { overwrite: true });
  let pictures = [];
  if(fs.existsSync(JestReportTempDir)){
    fs.copySync(JestReportTempDir, outputImgDir, { overwrite: true });
    fs.removeSync(JestReportTempDir);
    pictures = fs.readdirSync(outputImgDir);
  }
  // result.picturesData = pictures;
  result.testResults.forEach(suiteResult=>{
    suiteResult.testResults.forEach((testResult)=>{
      let picSuffix = md5(testResult.fullName);
      testResult.picturesData = pictures.filter(filename => filename.startsWith(picSuffix) )
    })
  })
  fs.writeFileSync(path.resolve(outputDir, 'testResultData.json'), JSON.stringify(result, null, 4));
  return result;
}

jestReporter.screenshotPathGenerater = function (suiteName,testName) {
  if(!fs.existsSync(JestReportTempDir)){
    fs.mkdirSync(JestReportTempDir);
  }
  let fileNamePrefix = md5((suiteName?suiteName+' ':'')+testName);
  return () => path.resolve( JestReportTempDir,fileNamePrefix +"_"+ (new Date().getTime())+'.png');
}



module.exports = jestReporter;
