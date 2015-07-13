'use strict';

import * as React from 'react';
import provideObservables from '../src/providers/provideObservables';

/**
 * @class List
 */
@provideObservables(observables => ({
  items : observables.items$
}))
class List extends React.Component {

  static defaultProps = {
    items : []
  };

  render() {
    return (
      <div>
        <style>{this.styles}</style>
        <ul id="List">
          {this.props.items.map((item) => (
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

export default List;

/**
 * @param {Date} time
 * @returns {String}
 */
function relativeTime(time) {
  let date    = new Date(time),
    diff    = (Date.now() - date.getTime()) / 1000,
    dayDiff = Math.floor(diff / 86400);

  if (isNaN(dayDiff) || dayDiff < 0 || dayDiff >= 31) {
    return date.getMonth() + 1 + '月 ' + date.getDate() + '日';
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
