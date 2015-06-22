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

`Domain` that manages the `Store` and `Action`. Each feature of Flux provides to `Component`, using the Context feature of the React.

Loxe uses [javascript-decorators](https://github.com/wycats/javascript-decorators) for the component. TypeScript or Babel with '--stage 1 ' option, use recommended. (As a function `Root = provideContext (Root);` you might also use)

```javascript
import { Domain, Store, Action, Subject } from 'loxe';

class AppDomain extends Domain {
  getObservables() {
    // Object returns that will provide to components, through `@provideObservables`.
    return {
      items$ : this.getStore(AppStore).items$,
      count$ : this.getStore(AppStore).items$.map(a => a.length)
    };
  }
}

class AppAction extends Action {
  addItem(item) {
    // `.publish()` is like a dispatch of the Flux.
    // By event name published here, you can subscribe from the Store. 
    this.publish('ADD_ITEM', item);
  }
}

class AppStore extends Store {
  constructor() {
    this._items = [];
    this.items$ = Subject.property(this._items);
  }

  intialize() {
    // `.plugStream$` is Observable, and `{event: string, payload: any}`
    // will be issued from the `Action` will be aggregated.
    // `.subscribeEvent(event, observer)` subscribe to Observable
    // that from plugStream filtered by events.
    this.subscribeEvent('ADD_ITEM', (item) => {
      this._items.push(item);
      this.items$.next(this._items);
    });
  }
}

// Becoming a root Component, `@provideContext` Decorator is required.
// It connects components Tree Root and Flux.
@provideContext()
class Root extends React.Component {
  render() {
    return <Child />;
  }
}

// @provideAction: Inject Action instance to the component props.
// @provideObservables: Value of the Observable will be provided
//                      from the domain mapped to the props.
@provideAction([AppAction])
@provideObservables(observables => ({
  items : observables.items$
}))
class Child extends React.Component {
  addItem() {
    this.props.AppAction.addItems({data: Date.now()});
  }
  render() {
    return (
      <div>
        <button onClick={this.addItem.bind(this)}>add item</button>
        <ul>
          {this.props.items.map(item => <li>{item.data}</li>)}
        </ul>
      </div>
    );
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
