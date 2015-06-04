'use strict';

module.exports = function(config) {
  config.set({
    frameworks : ['browserify', 'mocha'],

    files : [
      'src/**/__test__/*.js'
    ],

    preprocessors : {
      'src/**/__test__/*.js' : 'browserify'
    },

    browserify : {
      transform : [
        require('babelify').configure({
          modules  : 'commonStrict',
          stage    : 0,
          optional : ['runtime'],
          plugins  : ['babel-plugin-espower']
        })
      ],
      debug : true,
      extensions : ['.js']
    },

    browsers : ['Firefox'],

    autoWatch : true,

    reporters : ['dots']
  });
};
