'use strict';

import assert from 'power-assert';
import React from 'react/dist/react-with-addons';
import Component from '../src/classes/Component';

let TestUtils = React.addons.TestUtils;

describe('Component', ()=> {
  it('throw error when receive invalid type object as `domains`', ()=> {
    class Test extends Component { }

    assert.throws(() => {
      TestUtils.renderIntoDocument(<Test domains={[false]} />);
    });
  });
});
