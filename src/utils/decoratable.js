'use strict';

/**
 * can be used as decorators
 * Main purpose the higher-order component to use as a Decorator.
 *
 * https://github.com/wycats/javascript-decorators
 *
 * ```
 *   let decoratableSubject = decoratable(subject);
 *   @decoratableSubject(foo, bar, baz)
 *   class AcmeClass {
 *     // acme implements
 *   }
 *
 *   // same as below
 *
 *   class AcmeClass {
 *     // acme implements
 *   }
 *   subject(AcmeClass, foo, bar, baz);
 * ```
 *
 * @param {Function} subjectFunc
 */
export default function decoratable(subjectFunc) {
  return function(...initialArgs) {

    // Decorator
    if (initialArgs.length < subjectFunc.length) {
      let diff = subjectFunc.length - initialArgs.length;

      return function decorateWrapper(...targetKeyDescriptor) {
        return subjectFunc.apply(null, [...targetKeyDescriptor.slice(0, diff), ...initialArgs]);
      };
    }

    // Normally
    return subjectFunc.apply(null, initialArgs);
  };
}
