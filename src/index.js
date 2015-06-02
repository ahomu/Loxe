'use strict';

import React     from 'react';
import Rx        from 'rx-lite';

import Component from './classes/Component';
import Domain    from './classes/Domain';
import Store     from './classes/Store';
import Intent    from './classes/Intent';
import Bus       from './classes/Bus';

import Root      from './samples/Root';
import AppDomain from './samples/AppDomain';

if (!window.mocha) {
  // TODO Domain を Component に結びつける必要ある？

  React.render(
    React.createFactory(Root)({domain : AppDomain}),
    document.getElementById('app')
  );
}

export {Component, Domain, Store, Intent, Bus, React, Rx}
