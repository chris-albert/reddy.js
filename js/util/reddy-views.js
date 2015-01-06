define([
  "util/reddy"
],function(Reddy) {
  return Reddy.scope(function($,Backbone,_,Handlebars,Logger,Config) {

    var ReddyRootView = Backbone.View.extend({
      templateBase           : Config.get("templateBase"),
      templateExtension      : Config.get("templateExtension"),
      cssDirectory           : Config.get("cssDirectory"),
      templateName           : null,
      template               : null,
      templateLoadedCallbacks: null,
      partials               : null,
      data                   : null,
      route                  : null,
      query                  : null,
      css                    : null,
      initialize: function(options) {
        this.route = options.route;
        this.query = options.query;
        this.templateLoadedCallbacks = [];
        var self = this;
        if(_.isArray(this.css)) {
          this.addTemplateLoadedCallback(function() {
            _.each(self.css,function(i) {
              self.loadCss(i);
            });
          });
        }
        require(_.union([this.getTemplatePath()],this.getPartials()),
          function(t) {
            self.renderPartials(_.rest(arguments));
            self.template = Handlebars.compile(t);
            self.callTemplateLoadedCallbacks();
          }
        );
      },
      renderPartials: function(partials) {
        _.each(partials,function(partial) {
          if(_.isFunction(partial)) partial();
        });
      },
      getPartials: function() {
        if(_.isArray(this.partials)) return this.partials;
        else return [];
      },
      getTemplatePath: function() {
        return "text!" + this.templateBase + this.getTemplateName() +
          "." + this.templateExtension;
      },
      getTemplateName: function() {
        if(this.templateName == null) return this.route;
        else return this.templateName;
      },
      addTemplateLoadedCallback: function(func,args) {
        this.templateLoadedCallbacks.push(func);
        if(!_.isNull(this.template)) {
          this.callTemplateLoadedCallbacks(args);
        }
      },
      callTemplateLoadedCallbacks: function(args) {
        var self = this;
        _.each(this.templateLoadedCallbacks,function(func) {
          if(_.isFunction(func)) {
            func.call(self,args);
          }
        })
      },
      render: function() {
        this.rootRender();
      },
      rootRender: function() {
        this.addTemplateLoadedCallback(this.renderTemplate);
      },
      renderTemplate: function() {
        Logger.info("ReddyView.renderTemplate");
        this.$el.html(this.template(this.data));
      },
      loadCss: function(url) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = this.cssDirectory + url;
        document.getElementsByTagName("head")[0].appendChild(link);
      }
    });

    var ReddyAuthView = ReddyRootView.extend({
      tokenName: "wt",
      redirectPath: "login",
      onAfterControllerInitialize: function() {
        if(!this.validateToken()) {
          Logger.info("ReddyAuthView.onAfterControllerInitialize: Invalid token");
          Backbone.history.navigate(this.redirectPath, true);
        }
      },
      validateToken: function() {
        var token = this.getToken();
        return !_.isUndefined(token) && !_.isNull(token) && !_.isEmpty(token);
      },
      getToken: function() {
        return $.cookie(this.tokenName);
      }
    });

    var Generic = {
      el: $(".container"),
      partials: [Config.get("generic.partials")]
    };

    var GenericView     = ReddyRootView.extend(Generic);
    var GenericAuthView = ReddyAuthView.extend(Generic);

    return {
      View           : ReddyRootView,
      AuthView       : ReddyAuthView,
      GenericView    : GenericView,
      GenericAuthView: GenericAuthView,
      scope: function(func) {
        Reddy.scope(func);
      }
    };
  });
});