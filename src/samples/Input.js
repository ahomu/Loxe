'use strict';

import React, {PropTypes} from 'react';
import Component from '../classes/Component';
import Bus from '../classes/Bus';
import assign from 'object-assign';
import Rx from 'rx-lite';

export default class Input extends Component {

  static propTypes = {
    maxLength : PropTypes.number.isRequired
  };

  static defaultProps = {
    maxLength : 140
  };

  state = {
    currentLength : 0,
    isLengthOver  : false
  };

  observables = {
    newItem$   : Bus.create(),
    inputKey$  : Bus.create(),
    submitBtn$ : Bus.create()
  };

  componentWillMount() {
    super.componentWillMount();

    let currentLength = this.observables.inputKey$
      .map((e) => e.target.value.length)
      .distinctUntilChanged();

    let isLengthOver = currentLength
      .map((v) => v > this.props.maxLength)
      .distinctUntilChanged();

    currentLength.subscribe((v) => this.setState({currentLength : v}));
    isLengthOver.subscribe((v) => this.setState({isLengthOver : v}));

    let sendTextStream = this.observables.submitBtn$
      .map(() => this.refs.input.getDOMNode().value)
      .filter(() => !this.state.isLengthOver && this.state.currentLength);

    sendTextStream.subscribe((v) => {
      this.publish('newItem$', {
        text : v,
        time : Date.now()
      });
      this.refs.input.getDOMNode().value = '';
      this.setState({
        currentLength : 0,
        isLengthOver  : false
      });
    });

    //let shiftEnterStream = this.observables.inputKey$
    //  .filter((e) => e.shiftKey && e.keyCode === 13);
    //
    //this.observables.submitBtn$.merge(shiftEnterStream);
  }

  render() {
    return (
      <div id="Input">
        <style>{this.styles}</style>
        <textarea ref="input" onKeyUp={this.observables.inputKey$}></textarea>
        <span className="count">
        <span style={{color : this.state.isLengthOver ? 'red' : 'black'}}>{this.state.currentLength}</span> / {this.props.maxLength}
        </span>
        <button onClick={this.observables.submitBtn$}>Submit</button>
      </div>
    );
  }

  styles = (`
    #Input {
      position: relative;
    }
    #Input textarea {
      width: 330px;
      height: 100px;
      border: 1px solid #aaa;
      border-radius: 5px;
    }
    #Input .count {
      position: absolute;
      bottom: 10px;
      left: 200px;
      text-align: right;
      display: inline-block;
      width: 100px;
      padding: 0 20px;
      font-size: 0.8em;
    }
    #Input button {
      float: right;
      border: none;
      width: 70px;
      height: 100px;
      font-weight: bold;
      color: #333;
      background-color: lightblue;
    }
  `)
}
