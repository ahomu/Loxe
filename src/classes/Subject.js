'use strict';

import * as Kefir from 'kefir';

/**
 * @class Subject
 */
export default class Subject {

  /**
   * Subject for `Component` ui events & `Action` publish events.
   *
   * @returns {Kefir.Stream}
   */
  static stream() {
    return Subject.create(Kefir.Stream);
  }

  /**
   * Subject for `Store` data property.
   * Even when starting to subscribe to retained latest value will be published.
   *
   * @param {*} initialValue
   * @returns {Kefir.Property}
   */
  static property(initialValue) {
    return Subject.create(Kefir.Property, initialValue);
  }

  /**
   * @param {Kefir.Observable} BaseClass
   * @param {*} initialValue
   * @returns {Kefir.Observable}
   */
  static create(BaseClass, initialValue) {

    function _subject() {
      _subject._emitValue.apply(_subject, arguments);
    }

    for (let key in BaseClass.prototype) {
      _subject[key] = BaseClass.prototype[key];
    }

    _subject.push  = _subject._emitValue;
    _subject.error = _subject._emitError;
    _subject.end   = _subject._emitEnd;

    BaseClass.call(_subject);

    if (initialValue !== undefined) {
      _subject._active = true;
      _subject._currentEvent = {type : 'value', value : initialValue, current : true};
    }

    return _subject;
  }
}
