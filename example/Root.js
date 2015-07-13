'use strict';

import * as React from 'react';
import Input from './Input';
import List from './List';
import AppAction from './AppAction';
import provideContext from '../src/providers/provideContext';
import provideActions from '../src/providers/provideActions';

@provideContext()
@provideActions([AppAction])
class Root extends React.Component{

  componentWillMount() {
    this.props.AppAction.initItems();
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

export default Root;
