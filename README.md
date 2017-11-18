# jest-report

![Build Status](https://img.shields.io/travis/yunqaingwu/jest-report.svg)
![Coverage](https://img.shields.io/coveralls/yunqaingwu/jest-report.svg)
![Downloads](https://img.shields.io/npm/dm/jest-report.svg)
![Downloads](https://img.shields.io/npm/dt/jest-report.svg)
![npm version](https://img.shields.io/npm/v/jest-report.svg)
![dependencies](https://img.shields.io/david/yunqaingwu/jest-report.svg)
![dev dependencies](https://img.shields.io/david/dev/yunqaingwu/jest-report.svg)
![License](https://img.shields.io/npm/l/jest-report.svg)
> Generate Jest test results reporter into your CI builds

![Downloads](docs/preview.png)

## Getting Started

Install it via npm:

```shell
npm install jest-report
```

And include in your project:


The reporter integrates with Jest in form of a [testResultsProcessor](https://facebook.github.io/jest/docs/api.html#testresultsprocessor-string). Put this into your projects `package.json`:

```
"jest": {
    "testResultsProcessor": "jest-report"
}
```
Then, just use Jest as usual, e.g. put this in your `package.json`

```
"scripts": {
    "test": "jest"
}
```
Then, simply run `npm test`, and open `./dist/testReport/reporter.html` is HTML reporter
## License

MIT
