'use strict';

const RESERVED_PROPS = {
  arguments : true,
  caller    : true,
  key       : true,
  length    : true,
  name      : true,
  prototype : true,
  ref       : true,
  type      : true
};

export default function copyStatics(fromClass, toObject) {
  // copy statics
  Object
    .getOwnPropertyNames(fromClass)
    .filter(key => {
      return fromClass.hasOwnProperty(key) && !RESERVED_PROPS[key];
    })
    .forEach(key => {
      toObject[key] = fromClass[key];
    });
}
