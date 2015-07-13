import Root      from './Root';
import AppDomain from './AppDomain';
import AppStore  from './AppStore';
import AppAction from './AppAction';
import Subject, { KefirBuilder } from '../src/classes/Subject';

import * as Kefir from 'kefir';
import * as kefirCombineTemplate from 'kefir.combinetemplate';

Subject.setBuilder(new KefirBuilder(Kefir));
Subject.setCombineTemplate(kefirCombineTemplate);

let appDomain = new AppDomain();

appDomain.registerStore(new AppStore());
appDomain.registerAction(new AppAction());
appDomain.mountRootComponent(Root, document.getElementById('app'));
