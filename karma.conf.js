'use strict';

module.exports = function(config) {
  config.set({
    frameworks : ['browserify', 'mocha'],

    files : [
      'src/**/__tests__/*.js'
    ],

    preprocessors : {
      'src/**/__tests__/*.js' : 'browserify'
    },

    browserify : {
      transform : [
        require('babelify').configure({
          modules  : 'commonStrict',
          stage    : 0,
          plugins  : ['babel-plugin-espower']
        })
      ],
      debug : true,
      extensions : ['.js']
    },

    browsers : ['Chrome', 'Firefox'],

    autoWatch : true,

    reporters : ['dots']
  });
};
