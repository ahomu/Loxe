'use strict';

import * as Kefir from 'kefir';

window.Kefir = Kefir;

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
   * @param {Kefir.Stream|Kefir.Property} BaseClass
   * @param {*} [initialValue]
   * @returns {Kefir.Observable}
   */
  static create(BaseClass, initialValue) {

    function Subject() {
      Subject._emitValue.apply(Subject, arguments);
    }

    for (let key in BaseClass.prototype) {
      Subject[key] = BaseClass.prototype[key];
    }

    Subject.push  = Subject._emitValue;
    Subject.error = Subject._emitError;
    Subject.end   = Subject._emitEnd;

    BaseClass.call(Subject, initialValue);

    return Subject;
  }

  //static createFromRx(BaseClass, initialValue) {
  //
  //  function Subject() {
  //    Subject.onNext.apply(Subject, arguments);
  //  }
  //
  //  for (let key in BaseClass.prototype) {
  //    Subject[key] = BaseClass.prototype[key];
  //  }
  //
  //  // aliases
  //  Subject.push  = Subject.onNext;
  //  Subject.error = Subject.onError;
  //  Subject.end   = Subject.onEnd;
  //
  //  // construct `Rx.Subject` as Subject
  //  BaseClass.call(Subject, initialValue);
  //
  //  return Subject;
  //}
}
