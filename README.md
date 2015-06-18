# Loxe

[![npm version][npm-image]][npm-url] [![build status][circle-image]][circle-url] [![Dependency Status][deps-image]][deps-url]

Functional Reactive Programming philosophy incorporating Flux implementation.

-
- Mapping to props from observables. provide by Decorater

## Installation

Recommend for use browserify, or other CommonJS/ES6 modules resolver.

### Use browserify

```shell
npm i --save loxe
```

```javascript
// CommonJS
var Loxe = require('loxe');

// ES6 modules (babel)
import Loxe from 'loxe';

// if you using babel with `--modules commonStrict` or TypeScript
import * as Loxe from 'loxe';
```

```shell
# normal
browserify index.js

# Loxe depends on React. If you want to separate `react` as other bundle.
browserify index.js -x react -o bundle.js
browserify -r react -o libs.js
```

### Use `<script src="loxe.js">`

`loxe.js` built with browserify-shim. To run the Loxe `window.React` is required.

```
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.13.3/react.js"></script>
<script src="vendor/loxe.js"></script>
```

## Usage


## API

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

##### `Subject..setCombineTemplate()`

##### `stream()`

##### `property()`

### Providers

#### @provideAction

```javascript
```

#### @provideContext

```javascript
```

#### @provideObservables

```javascript
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
