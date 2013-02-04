require.config({
  baseUrl: '/javascripts/',
  paths: {
    jquery: 'components/jquery/jquery',
    underscore: 'components/underscore/underscore',
    backbone: 'components/backbone/backbone',
    mocha: 'components/mocha/mocha',
    expect: 'components/expect.js/expect',
    specs: 'app/test/specs',
    lib: 'app/lib',
  },
  shim: {
    underscore : {
      exports: '_'
    },
    mocha: {
      deps: ['expect'],
      exports: 'mocha',
    },
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    },
    handlebars: {
      exports: 'Handlebars'
    }
  }
})

define(function(require) {
  // specs
  var viewcontroller = require('specs/lib/viewController')
  mocha.run()
})