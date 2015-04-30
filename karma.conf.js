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
          stage    : 0,
          plugins  : ['babel-plugin-espower']
        })
      ],
      extensions : ['.js']
    },

    browsers : ['Chrome'],

    customLaunchers : {
      chromeTravisCI : {
        base  : 'Chrome',
        flags : ['--no-sandbox']
      }
    },

    autoWatch : true,

    reporters : ['dots']
  });

  // Custom configuration for Travis-CI
  if (process.env.TRAVIS) {
    config.browsers = ['chromeTravisCI'];
  }
};
