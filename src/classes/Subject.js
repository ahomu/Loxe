'use strict';

export class RxSubjectBuilder {

  /**
   * @type {Rx}
   */
  MyRx = null;

  /**
   * @constructor
   * @param {Rx} Rx
   */
  constructor(Rx) {
    this.MyRx = Rx;
  }

  /**
   * Subject for `Component` ui events & `Action` publish events.
   *
   * @returns {Rx.Subject}
   */
  stream() {
    return this.create(this.MyRx.Subject);
  }

  /**
   * Subject for `Store` data property.
   * Even when starting to subscribe to retained latest value will be published.
   *
   * @param {*} initialValue
   * @returns {Rx.BehaviorSubject}
   */
  property(initialValue) {
    return this.create(this.MyRx.BehaviorSubject, initialValue);
  }

  /**
   * @param {Rx.Subject} BaseClass
   * @param {*} [initialValue]
   * @returns {Rx.Subject}
   */
  create(BaseClass, initialValue) {

    function _subject() {
      _subject.onNext.apply(_subject, arguments);
    }

    for (let key in BaseClass.prototype) {
      _subject[key] = BaseClass.prototype[key];
    }

    _subject.push  = _subject.onNext;
    _subject.error = _subject.onError;
    _subject.end   = _subject.onCompleted;

    BaseClass.call(_subject, initialValue);

    return _subject;
  }
}

export class KefirSubjectBuilder {

  /**
   * @type {Kefir}
   */
  MyKefir = null;

  /**
   * @constructor
   * @param {Kefir} Kefir
   */
  constructor(Kefir) {
    this.MyKefir = Kefir;
  }

  /**
   * Subject for `Component` ui events & `Action` publish events.
   *
   * @returns {Kefir.Stream}
   */
  stream() {
    return this.create(this.MyKefir.Stream);
  }

  /**
   * Subject for `Store` data property.
   * Even when starting to subscribe to retained latest value will be published.
   *
   * @param {*} initialValue
   * @returns {Kefir.Observable}
   */
  property(initialValue) {
    return this.create(this.MyKefir.Property, initialValue);
  }

  /**
   * @param {Kefir.Stream} BaseClass
   * @param {*} [initialValue]
   * @returns {Observable}
   */
  create(BaseClass, initialValue) {

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

/**
 * @class Subject
 */
export default class Subject {

  static builder;

  static combineTemplate;

  /**
   * @returns {Observable}
   */
  static stream() {
    return Subject.builder.stream.apply(Subject.builder, arguments);
  }

  /**
   * @param {*} initialValue
   * @returns {Observable}
   */
  static property() {
    return Subject.builder.property.apply(Subject.builder, arguments);
  }

  /**
   * @param {Object} templateObject
   * @returns {Observable}
   */
  static combineTemplate() {
    return Subject.combineTemplate.apply(Subject.combineTemplate, arguments);
  }

  /**
   * @param {RxSubjectBuilder|KefirSubjectBuilder} builderInstance
   */
  static setBuilder(builderInstance) {
    Subject.builder = builderInstance;
  }

  /**
   * @param {Function} combineTemplateFn
   */
  static setCombineTemplate(combineTemplateFn) {
    Subject.combineTemplate = combineTemplateFn;
  }
}
