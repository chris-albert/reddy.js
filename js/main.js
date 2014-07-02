require.config({
  paths: {
    jquery    : "libs/jquery.min",
    bootstrap : "libs/bootstrap.min",
    underscore: "libs/underscore.min",
    backbone  : "libs/backbone.min",
    handlebars: "libs/handlebars.min",
    cookies   : "libs/jquery.cookie",
    underscoreString: "libs/underscore.strings"
  },
  shim: {
    handlebars: {
      exports: 'Handlebars'
    },
    underscoreString: ["underscore"],
    "cookies": ["jquery"]
  }
});

require(["app"],function(App){
  App.initialize();
});
