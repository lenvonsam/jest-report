import React, { Component } from 'react';
import {PhotoSwipeGallery} from 'react-photoswipe';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { Row, Col, Button, Icon, Input, Card, Collapse, message } from 'antd';
import { stringify } from 'qs';
import { port, isStatic } from './config';
import styles from './reporter.less';
import 'react-photoswipe/lib/photoswipe.css'
import {timeDisFormat} from "./utils";


const Panel = Collapse.Panel;

/* eslint no-underscore-dangle:0 */

class TestResultItem extends Component {
  render() {
    const item = this.props.data;
    const { picturesData } = item;

    const getThumbnailContent = (item) => {
      return (
        <img src={item.src} width={120} height={90}/>
      );
    }

    const items = picturesData.map(i => ({
      src: 'images/'+ i,
      // thumbnail: 'images/'+ i,
      w: 1200,
      h: 900,
      title: item.fullName
    }));

    const options = {};

    return <div>
      <div>
        {(item.failureMessages && item.failureMessages.length) ? (
          <pre>
          {escape(item.failureMessages)}
        </pre>
        ):false}
      </div>
      {(items.length > 0) &&
        <PhotoSwipeGallery items={items} options={options} thumbnailContent={getThumbnailContent}/>}
    </div>;
  }
}

class TestSuiteResultItem extends Component {
  render() {
    const {
      testFilePath,
      ancestorTitles,
      perfStats,
      numFailingTests,
      numPassingTests,
      testResults,
    } = this.props.data;

    const testResultAtFirst = testResults[0];
    const numTotalTests = numFailingTests + numPassingTests;

    return (
      <Card
        className={styles.testSuiteResultItem}
        bodyStyle={{ padding: 5 }}
      >
        <Row type="flex" justify="space-between" align="top">
          <Col span={20}>
            <div className={styles.title}>
              {numFailingTests == 0 ?
                <Icon type="check" style={{color:'#41bb5b'}} /> :
                <Icon type="close" style={{color:'#d33c3d'}} />
              }
              {testResultAtFirst.ancestorTitles[0]||testResultAtFirst.title}
            </div>
            <div className={styles.testFilePath}>
              {testFilePath}
            </div>
            <div style={{ padding: 5 }}>
              <Row className={styles.testResultInfo} type="flex" justify="flex-start" align="top">
                <Col span={5}>
                  <Icon type="clock-circle-o" />
                  <span>
                  {timeDisFormat(perfStats.end-perfStats.start)}
                </span>
                </Col>
                <Col span={5}>
                  <Icon type="book" />
                  <span>
                  {numPassingTests}
                </span>
                </Col>
                <Col span={5}>
                  <Icon type="check" style={{color:'#41bb5b'}} />
                  <span>
                  {numTotalTests}
                </span>
                </Col>
                <Col span={5}>
                  <Icon type="close" style={{color:'#d33c3d'}} />
                  <span>
                  {numFailingTests}
                </span>
                </Col>

              </Row>
            </div>
          </Col>

          <Col span={4}><div style={{textAlign:'right'}}>
            {100*numPassingTests/(numFailingTests+numPassingTests)}%
          </div></Col>

        </Row>
        <div style={{ padding: 5 }}>
          <Collapse bordered={false}  accordion>
            {testResults.map((item,index)=><Panel
              header={
                <Row type="flex" justify="space-between" align="top">
                  <Col span={20}>
                    {item.status === 'passed' ?
                      <Icon type="check" style={{color: '#41bb5b'}}/> :
                      <Icon type="close" style={{color: '#d33c3d'}}/>
                    }
                    <span style={{marginLeft: 3}}>{item.fullName}</span>
                  </Col>
                  <Col span={4} style={{textAlign: 'right'}}>
                    {item.duration} ms <Icon type="clock-circle-o" />
                  </Col>
                </Row>
              }
              key={''+index}>
              <TestResultItem data={item}></TestResultItem>
            </Panel>)}
          </Collapse>
        </div>
      </Card>
    );
  }
}
// eslint-disable-next-line
class TestResultDoc extends Component {

  constructor(props){
    super(props);
    this.state={
      filter: '',
      data: {},
    }
  }

  componentDidMount(){
    this.props.testDataPromise().then((data)=>{
      this.setState({
        data:data,
      });
    });
  }

  handleChangeFilter(filterAction){
    const { filter } = this.state;
    let newFilter = '';
    if(filter == '' || (filter && filterAction &&  filter !== filterAction)){
      newFilter = filterAction;
    }
    this.setState({
      filter: newFilter,
    });
  }

  render() {
    const { data } = this.state;

    if(!data || !data.testResults){
      return (<div>Loading</div>);
    }

    const {
      startTime,
      numTotalTestSuites,
      numTotalTests,
      numPassedTests,
      numFailedTests,
      success,
      testResults,
    } = data;

    const successRate = Math.round((numPassedTests / numTotalTests)*100) + '%';
    const failedRate = Math.round((numFailedTests / numTotalTests)*100) + '%';
    const { filter } = this.state;

    const startTimeDis = moment(startTime).fromNow();
    const filteredTestResult = (!filter)?testResults:testResults
      .filter((item)=>{
        if(!filter){
          return true;
        }
        if(filter === 'P'){
          return item.numFailingTests === 0;
        }
        if(filter === 'F'){
          return item.numFailingTests !== 0;
        }
      });

    return (
      <div className={styles.testResultDoc}>
        <header>
          <h1>前端自动化测试报告</h1>
          <Card>
            <Row type="flex" justify="space-around" align="top">
              <Col span={4}>
                <div className={styles.infoValue}>{startTimeDis}</div>
                <div className={styles.infoTitle}>Time</div>
              </Col>
              <Col span={4}>
                <div className={styles.infoValue}>{numTotalTestSuites}</div>
                <div className={styles.infoTitle} >Suite</div>
              </Col>
              <Col span={4}>
                <div className={styles.infoValue}>{numTotalTests}</div>
                <div className={styles.infoTitle} >TESTS</div>
              </Col>
              <Col span={4} onClick={this.handleChangeFilter.bind(this,'P')}>
                <div className={styles.infoValue} style={{color:'#41bb5b'}}>{numPassedTests}</div>
                <div className={styles.infoTitle} style={{color: filter==='P'&&'blue'}}>PASSED <Icon type="filter"  /></div>
              </Col>
              <Col span={4} onClick={this.handleChangeFilter.bind(this,'F')}>
                <div className={styles.infoValue} style={{color:'#d33c3d'}}>{numFailedTests}</div>
                <div className={styles.infoTitle} style={{color: filter==='F'&&'blue'}} >FAILED <Icon type="filter" /></div>
              </Col>
            </Row>
          </Card>
          <Row  type="flex" justify="end" align="top">
            <Col span={4}>
              <div ><span style={{color: '#41bb5b'}}>{successRate} Passing</span></div>
            </Col>
            <Col span={4}>
              <div ><span style={{color: '#d33c3d'}}>{failedRate} Failed</span></div>
            </Col>
          </Row>
        </header>
        <div>
          {
            filteredTestResult.map((item)=><TestSuiteResultItem data={item}></TestSuiteResultItem>)
          }
        </div>
      </div>
    );
  }
}


let testDataPromise;


try{
  let env = process.env;
  if(env.NODE_ENV === 'development'){
    testDataPromise = ()=>import('../public/testResultData.json');
  }else{
    testDataPromise = ()=>fetch('testResultData.json').then(data=>data.json())
  }
  console.log(env);
}catch (e){
  testDataPromise = ()=>import('../public/testResultData.json');
}





ReactDOM.render(<TestResultDoc testDataPromise={testDataPromise} />, document.getElementById('root'));

function escape(message) {
  if (message === null || message === undefined) {
    return '';
  }
  return message;
  return message.toString()
    .replace(/\|/g, '||')
    .replace(/'/g, "|'")
    .replace(/\n/g, '|n\n')
    .replace(/\r/g, '|r')
    .replace(/\u0085/g, '|x')
    .replace(/\u2028/g, '|l')
    .replace(/\u2029/g, '|p')
    .replace(/\[/g, '|[')
    .replace(/]/g, '|]');
}
