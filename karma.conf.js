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
      debug : true,
      extensions : ['.js']
    },

    browsers : ['Firefox'],

    autoWatch : true,

    reporters : ['dots']
  });
};
