'use strict';

import * as React from 'react';

import Subject from '../src/classes/Subject';
import AppAction from './AppAction';
import provideActions from '../src/providers/provideActions';

@provideActions([
  AppAction
])
class Input extends React.Component {

  static propTypes = {
    maxLength : React.PropTypes.number.isRequired
  };

  static defaultProps = {
    maxLength : 140
  };

  state = {
    currentLength : 0,
    isLengthOver  : false
  };

  ui = {
    inputKey$  : Subject.stream(),
    submitBtn$ : Subject.stream()
  };

  componentWillMount() {
    let currentLength$ = this.ui.inputKey$
      .map(e => e.target.value.length)
      .skipDuplicates();

    let isLengthOver$ = currentLength$
      .map(v => v > this.props.maxLength)
      .skipDuplicates();

    currentLength$.onValue(v => this.setState({currentLength : v}));
    isLengthOver$.onValue(v => this.setState({isLengthOver : v}));

    let shiftEnter$ = this.ui.inputKey$
      .filter(e => e.shiftKey && e.keyCode === 13);

    let sendText$ = shiftEnter$.merge(this.ui.submitBtn$)
      .map(() => React.findDOMNode(this.refs.input).value)
      .filter(() => !this.state.isLengthOver && this.state.currentLength);

    sendText$.onValue(v => {
      this.props.AppAction.addItem({
        text : v,
        time : Date.now()
      });
      React.findDOMNode(this.refs.input).value = '';
      this.setState({
        currentLength : 0,
        isLengthOver  : false
      });
    });
  }

  render() {
    return (
      <div id="Input">
        <style>{this.styles}</style>
        <textarea ref="input" onKeyUp={this.ui.inputKey$}></textarea>
        <span className="count">
        <span style={{color : this.state.isLengthOver ? 'red' : 'black'}}>
          {this.state.currentLength}</span> / {this.props.maxLength}
        </span>
        <button onClick={this.ui.submitBtn$}>Submit</button>
      </div>
    );
  }

  styles = (`
    #Input {
      width: 405px;
      position: relative;
    }
    #Input textarea {
      width: 330px;
      height: 100px;
      border: 1px solid #aaa;
      border-radius: 5px;
      box-sizing: border-box;
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

export default Input;
