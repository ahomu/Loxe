'use strict';

import React, {PropTypes} from 'react';
import Component from '../classes/Component';
import Utils from '../Utils';
import Bus from '../classes/Bus';

/**
 * TODO remove
 *
 * @param {Date} time
 * @returns {String}
 */
function relativeTime(time) {
  let date    = new Date(time),
    diff    = (Date.now() - date.getTime()) / 1000,
    dayDiff = Math.floor(diff / 86400);

  if (isNaN(dayDiff) || dayDiff < 0 || dayDiff >= 31) {
    return date.getMonth()+1 + '月 ' + date.getDate() + '日';
  }

  return dayDiff === 0 && (
    diff < 60 && Math.floor(diff) + '秒前' ||
    diff < 120 && '1分前' ||
    diff < 3600 && Math.floor(diff / 60) + '分前' ||
    diff < 7200 && '1時間前' ||
    diff < 86400 && Math.floor(diff / 3600) + '時間前'
    ) ||
    dayDiff === 1 && '昨日' ||
    dayDiff < 7 && dayDiff + '日前' ||
    dayDiff < 31 && Math.floor(dayDiff / 7) + '週間前';
}

export default class List extends Component {

  state = {
    b : 'hfofe',
    a : {
      c : 'ddd',
      p : {
        items : []
      },
      s : 'dfd'
    },
    n : 'hfofe'
  };

  componentWillMount() {
    super.componentWillMount();
  }

  componentWillReceiveObservables(observables) {
    // [Implement Sideways Data Loading · Issue #3398 · facebook/react](https://github.com/facebook/react/issues/3398)
    return {
      b : 'hfofe',
      a : {
        c : 'ddd',
        p : {
          items : observables.update$
        },
        s : 'dfd'
      },
      n : 'hfofe'
    };
  }

  render() {
    return (
      <div>
        <style>{this.styles}</style>
        <ul id="List">
          {this.state.a.p.items.map((item) => (
            <li key={item.time}>
              {item.text}
              <time>{relativeTime(item.time)}</time>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  styles = (`
    #List {
      max-width: 400px;
      margin: 20px 0;
      padding: 0;
      list-style-type: none;
    }
    #List li {
      margin-bottom: 10px;
      word-break: break-all;
    }
    #List time {
      padding-left: 1em;
      font-size: 0.8em;
    }
  `)
}
