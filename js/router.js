define([
  "jquery",
  "backbone",
  "underscore",
  "util/logger",
  "util/config",
  "util/reddy",
  "util/reddy-views"
],function($,Backbone,_,Logger,config,Reddy,Views) {

  var ViewManager = Backbone.Model.extend({
    routes: {
      "": "home"
    },
    currentView: null,
    initialize: function() {
      Logger.info("ViewManager.initialize");
    },
    route: function(route,queryString) {
      var routeName = route,
          query     = _.toQueryParams(queryString);
      Logger.info("ViewManager.route: route [" + route +
        "] with query [" + JSON.stringify(query) + "]");
      if(!_.isUndefined(this.routes[route])) {
        routeName = this.routes[route];
      }
      Logger.info("ViewManager.route: Routing to [" + routeName + "]");
      this.loadController(routeName,query);
    },
    loadController: function(route,query) {
      var self = this;
      self.callCurrentViewFunc("onBeforeTemplateLoad");
      require([config.get("viewBaseUrl") + route],function(View) {
        self.createController(View,route,query);
      },function(err) {
        self.loadControllerError(err,route,query);
      });
    },
    loadControllerError: function(err,route,query) {
      Logger.info("ViewManager.loadController: Error loading controller");
      //If there is an error finding a controller, reddy will try and load
      //the default view with the template name of the route
      var view = Views.GenericView.extend({
        templateName: route
      });
      this.createController(view,route,query);
    },
    createController: function(controller,route,query) {
      this.callCurrentViewFunc("onAfterControllerLoad");
      this.cleanUpView();
      this.callCurrentViewFunc("onBeforeControllerInitialize");
      this.currentView = new controller({
        route: route,
        query: query
      });
      this.callCurrentViewFunc("onAfterControllerInitialize");
      this.callCurrentViewFunc("onBeforeTemplateRender");
      this.currentView.render();
      this.callCurrentViewFunc("onAfterTemplateRender");
    },
    callCurrentViewFunc: function(func,args) {
      if(!_.isUndefined(this.currentView) && this.currentView !== null &&
          _.isFunction(this.currentView[func])) {
        this.currentView[func].apply(this.currentView,args);
      }
    },
    cleanUpView: function() {
      if(!_.isUndefined(self.currentView)) {
        this.currentView.remove();
        this.currentView.unbind();
      }
    }
  });

  var AppRouter = Backbone.Router.extend({
    viewManager: null,
    routes: {
      "*catchAll": "catchAll"
    },
    initialize: function() {
      this.viewManager = new ViewManager();
    },
    catchAll: function(route,query) {
      if(_.isNull(route)) route = "";
      if(_.isNull(query)) query = "";
      this.viewManager.route(route,query);
    }
  });

  return {
    initialize: function() {
      var router = new AppRouter();
      Backbone.history.start();
      return router;
    }
  };
});