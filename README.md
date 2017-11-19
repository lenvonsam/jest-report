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

## Example
jest test file
```
import Nightmare from 'nightmare';
import { helperBuilder } from 'jest-report';
import webConfig from '../common/config';

describe('Login', () => {
  let page;
  beforeEach(() => {
    page = Nightmare({ show: false }).viewport(1024, 768);
    page.goto('http://localhost:8000/#/user/login');
  });

  it('should login with failure', async () => {
    const reportHelper = helperBuilder('Login', 'should login with failure');
    reportHelper.monitorPage(page);
    await page
      .type('#userName', 'mockuser')
      .type('#password', 'wrong_password')
      .click('button[type="submit"]')
      .wait('.ant-alert-error'); // should display error
    await page.screenshot(reportHelper.genPicturePath());
    await page.end();
    console.log(reportHelper.genPicturePath());
    console.log(reportHelper.genPicturePath());
  });

  it('should login successfully', async () => {
    const text = await page
      .type('#userName')
      .type('#userName', 'admin')
      .type('#password')
      .type('#password', '888888')
      .click('button[type="submit"]')
      .wait('.ant-layout-sider h1') // should display error
      .evaluate(() => document.body.innerHTML)
      .end();
    expect(text).toContain(`<h1>${webConfig.logoText}</h1>`);
  });
});
```

## License

MIT
