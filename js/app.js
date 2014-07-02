define([
  "jquery",
  "backbone",
  "router",
  "cookies",
  "util/logger",
  "util/config"
],function($,Backbone,Router,_,Logger,Config) {

  $.cookie.json = true;
  $.cookie.defaults.path = "/";
  $.cookie.defaults.domain = Config.get("cookieDomain","none");

  return {
    initialize: function() {
      var router = Router;
      Logger.verbose("App init");
      Backbone.App = router.initialize();
    }
  };
});
