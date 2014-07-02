define([
  "jquery",
  "backbone",
  "underscore",
  "handlebars",
  "util/logger",
  "util/config",
  "underscoreStrings"
],function($,Backbone,_,Handlebars,Logger,Config,underscoreStrings) {
  return {
    $              : $,
    Backbone       : Backbone,
    _              : _,
    Handlebars     : Handlebars,
    Logger         : Logger,
    Config         : Config,
    scope: function(func) {
      if(_.isFunction(func)) {
        return func($,Backbone,_,Handlebars,Logger,Config);
      }
      return null;
    }
  }
});