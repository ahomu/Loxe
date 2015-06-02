'use strict';

import React, {PropTypes} from 'react';
import Component from '../classes/Component';
import Input from './Input';
import List from './List';
import AppIntent from './AppIntent';
import Bus from '../classes/Bus';

export default class Root extends Component{

  componentWillMount() {
    super.componentWillMount();

    AppIntent.newItems$([
      {text : '文字数カウント', time : Date.now() - 60 * 60 * 9 * 1000},
      {text : '文字数制限', time : Date.now() - 60 * 60 * 6 * 1000},
      {text : 'Shift+Enterでも投稿', time : Date.now() - 60 * 60 * 3 * 1000},
      {text : '投稿したらリストに反映', time : Date.now()}
    ].reverse());
  }

  render() {
    return (
      <div>
        <h1>Sample</h1>
        <Input />
        <List />
      </div>
    );
  }

}