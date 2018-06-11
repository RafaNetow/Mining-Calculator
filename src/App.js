import React, { Component } from 'react';
import logo from './sup-logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
const baseUrl = 'http://superior-coin.com:8081/api';

class App extends Component {
  constructor() {
    super();
    this.state = {
      hashRate: 0,
      netWorkHash: 0,
      perSecond: 0,
      perMinute: 0,
      perHour: 0,
      fPerHour: 0,
      perDay: 0,
      fPerDay: 0,
      perBlock: 0,
      perHour: 0,
      perDay: 0,
      height: 0,
      fPerSecond: 0,
      blockArray: [],
      hr: 0
    }
    this.networkInformation = this.networkInformation.bind(this);
    this.searchBlockAndPushInArray = this.searchBlockAndPushInArray.bind(this);
    this.miningCalculation = this.miningCalculation.bind(this);
    this.handlerHashRateChange = this.handlerHashRateChange.bind(this);


  }

  networkInformation() {
    const netowrkInfoUrl = `${baseUrl}/networkinfo`
    const that = this;
    return new Promise((resolve) => {
      fetch(netowrkInfoUrl)
        .then(res => res.json())
        .then((transactionResponse) => {
          const hr = transactionResponse.data.hash_rate;
          const netWorkHash = hr / 1000;
          const Height = transactionResponse.data.height;
          that.setState({ Height });
          that.setState({ netWorkHash });
          that.setState({ hr });
          return resolve();
        });
    });
  }

  searchBlockAndPushInArray(block) {
    const blockUrl = `${baseUrl}/search/${block}`;
    const that = this;
    return new Promise((resolve) => {
      fetch(blockUrl)
        .then(res => res.json())
        .then((blockResponse) => {

          var joined = this.state.blockArray.concat(blockResponse);
          this.setState({ blockArray: joined })
          return resolve();
        });
    });
  }

  handlerHashRateChange(e) {
    const hashRate = Number(e.target.value);
    this.setState({ hashRate });
    this.miningCalculation();
  }

  miningCalculation() {
    const that = this;
    this.networkInformation().then(() => {
      const promise = this.searchBlockAndPushInArray(that.state.Height - 1);
      promise.then(() => {
        const secondPromise = this.searchBlockAndPushInArray(that.state.Height - 2);
        secondPromise.then(() => {
          const that = this;
          const seconds = that.state.blockArray[0].data.timestamp - that.state.blockArray[1].data.timestamp;
          const perSecond = (this.state.blockArray[0].data.txs[0].xmr_outputs / seconds) / 100000000;
          const reward = seconds * perSecond;
          const perBlock = perSecond * 120;
          const fPerHour = perBlock * 30;
          const fPerDay = fPerHour * 24;
          const fPerSecond = ((that.state.hashRate / 1000) / that.state.netWorkHash) * (perBlock / 120)
          const perMinute = fPerSecond * 60;
          const perHour = perMinute * 60;
          const perDay = perHour * 24;
          that.setState({ seconds });
          that.setState({ fPerSecond })
          that.setState({ perSecond });
          that.setState({ reward });
          that.setState({ perBlock });
          that.setState({ fPerHour });
          that.setState({ fPerDay });
          that.setState({ perMinute });
          that.setState({ perHour });
          that.setState({ perDay });

        });
      })
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Superior Coin Mining Pool</h1>
        </header>


        <div className="container">
          <div className="row">
            <div className="col-sm-3 alert alert-success"><i class="fa fa-coins"></i> Total SUP mined </div>
            <div className="col-sm-3 alert alert-warning" > <i class="fa fa-clock"></i> Per Block: <label>{parseFloat(this.state.perBlock).toFixed(2)} </label> </div>
            <div className="col-sm-3 alert alert-warning"> <i class="fa fa-clock"></i> Per hour: <label>{parseFloat(this.state.fPerHour).toFixed(2)} </label>  </div>
            <div className="col-sm-3 alert alert-warning"> <i class="fa fa-clock"></i> Per day: {parseFloat(this.state.fPerDay).toFixed(2)}</div>
          </div>
          <div className="row">
          <div class="alert alert-info col-sm-12">
           <strong>Estimate mining rework</strong>
          </div>
          </div>

          <div className="row">
            <div className="col-sm-3 alert alert-success"> <i class="fas fa-align-justify"></i> Network Hash KH/s : {this.state.netWorkHash}   </div>
            <div className="col-sm-3 alert alert-warning"> <i class="fa fa-clock"></i> Per Second: {parseFloat(this.state.fPerSecond).toFixed(2)}</div>
            <div className="col-sm-3 alert alert-warning"> <i class="fas fa-clock"></i> Per Minute: {parseFloat(this.state.perMinute).toFixed(2)}</div>
            <div className="col-sm-3 alert alert-warning"> <i class="fas fa-clock"></i> Per Day:{parseFloat(this.state.perDay).toFixed(2)}</div>
          </div>
          <div className="row alert alert-success">
            <div className="col-sm-3"><i class="fa fa-tachometer-alt"></i>Hash Rate H/s: </div>
            <div className="col-sm-3"> </div>
            <div className="col-sm-6">
              <input
                className="col-sm-6 form-control"
                type="number"
                name="base"
                value={this.state.hashRate}
                onChange={this.handlerHashRateChange}
              /></div>
          </div>
        </div>


      </div>
    );
  }
}



export default App;
