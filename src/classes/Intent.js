'use strict';

import {PropTypes} from 'react';
import ReflectionImpl from '../implements/ReflectionImpl';

/**
 * Intent to convert event data received from the Component, call the Action method of the Domain.
 * Only Intent is familiar with both data from Component and the Domain interface.
 *
 * @class Intent
 */
export default class Intent {
  /**
   * @returns {string}
   */
  getClassName() {
    return ReflectionImpl.getClassName.apply(this);
  }
}
