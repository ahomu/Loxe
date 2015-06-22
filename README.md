# Loxe

[![npm version][npm-image]][npm-url] [![build status][circle-image]][circle-url] [![Dependency Status][deps-image]][deps-url]

Functional Reactive Programming philosophy incorporating Flux implementation.

- Mapping to props from observables. provide by Decorators

## Installation

Recommend for use browserify, or other CommonJS/ES6 modules resolver.

### Use browserify

To install the `loxe` by NPM.

```shell
npm i --save loxe
```

```javascript
// CommonJS
var Loxe = require('loxe');

// ES6 modules (babel)
import Loxe from 'loxe';
```

```shell
# Loxe depends on React. If you want to separate `react` as other bundle.
browserify index.js -x react -o bundle.js
browserify -r react -o libs.js
```

### Use `<script src="loxe.js">`

`loxe.js` built with browserify-shim. To run the Loxe `window.React` is required.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.13.3/react.js"></script>
<script src="loxe.js"></script>
```

## Usage

### Choose FRP library

At first, sets the FRP (_Functional Reactive Programming_) library, used internally by the `Subject`.

```javascript
import Rx from 'rx-lite';
import rxCombineTemplate from 'rx.observable.combinetemplate';
import { Subject } from 'loxe';

Subject.setBuilder(new Subject.RxSubjectBuilder(Rx));
Subject.setCombineTemplate(rxCombineTemplate);
```

Supported [Reactive-Extensions/RxJS](https://github.com/Reactive-Extensions/RxJS) and [rpominov/kefir](https://github.com/rpominov/kefir).

```javascript
import Kefir from 'kefir';
import kefirCombineTemplate from 'kefir.combinetemplate';
import { Subject } from 'loxe';

Subject.setBuilder(new Subject.KefirSubjectBuilder(Kefir));
Subject.setCombineTemplate(kefirCombineTemplate);
```

**This is a transitional period for the future within fixed on either side.**

### Setup Loxe

```javascript
import { Domain, Store, Action, Subject } from 'loxe';

class AppDomain extends Domain {
  getObservables() {
    return {
      items$ : this.getStore(AppStore).items$,
      count$ : this.getStore(AppStore).items$.map(a => a.length)
    };
  }
}

class AppStore extends Store {
  constructor() {
    this._items = [];
    this.items$ = Subject.property(this._items);
  }

  intialize() {
    this.subscribeEvent('ADD_ITEMS', (items) => {
      this._items = this._items.contat(items);
      this.items$.push(this._items);
    });
    this.getEvent('ADD_ITEMS').map()
  }
}

class AppAction extends Action {
  addItems(items) {
    this.publish('ADD_ITEMS', items);
  }
}

const appDomain = new AppDomain();
appDomain.registerAction(new AppAction());
appDomain.registerStore(new AppStore());
appDomain.mountRootComponent(Root, document.getElementById('app'));
```

## API Reference

### Core Classes

#### Action

##### `initialize()`

##### `publish()`

##### `do()`

alias of `publish()`

#### Domain

##### `registerAction()`

##### `registerStore()`

##### `mountRoottComponent()`

##### `getObservables()`

#### Store

##### `initialize()`

##### `getEvent()`

##### `subscribeEvent()`

##### `subscribe()`

#### Subject

##### `Sbuject.setBuilder()`

##### `Subject.setCombineTemplate()`

##### `Subject.stream()`

##### `Subject.property()`

##### `next()`

##### `throw()`

##### `return()`

### Providers

#### @provideAction

```javascript
// hogehoge
```

#### @provideContext

```javascript
// hogehoge
```

#### @provideObservables

```javascript
// hogehoge
```

## Tests

```
npm install
npm test
```

## Example

- [ahomu/flux-comparison](https://github.com/ahomu/flux-comparison/tree/master/loxe): fork of [flux-comparison](https://github.com/voronianski/flux-comparison).

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT

[npm-image]: https://img.shields.io/npm/v/loxe.svg
[npm-url]: https://npmjs.org/package/loxe
[circle-image]: https://circleci.com/gh/ahomu/Loxe.svg?style=shield&circle-token=a3b5fc6b1535871b1a7371cc7cbac69abd8f3f93
[circle-url]: https://circleci.com/gh/ahomu/Loxe
[deps-image]: https://david-dm.org/ahomu/Loxe.svg
[deps-url]: https://david-dm.org/ahomu/Loxe
