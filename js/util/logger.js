define([
  "backbone",
  "underscore",
  "util/config"
],function(Backbone,_,config) {

  var logger = Backbone.Model.extend({
    levelPrecedence: {
      "CRITICAL": 0,
      "ERROR"   : 1,
      "WARN"    : 2,
      "INFO"    : 3,
      "VERBOSE" : 4
    },
    logLevel: config.get("logLevel","ERROR"),
    logLevelIndex: 0,
    initialize: function() {
      this.logLevelIndex = this.levelIndex(this.logLevel);
    },
    logger: function(msg) {
      console.log(msg)
    },
    log: function(level,args) {
      if(this.isLoggable(level)) {
        this.logger(this.formatMessage(level,args));
      }
    },
    formatMessage: function(level,args) {
      return level + ": " + _.map(args,function(arg) {
        if(_.isUndefined(arg)) {
          return "undefined";
        }else if(_.isNull(arg)) {
          return "null";
        }else if(_.isObject(arg) || _.isArray(arg)) {
          return JSON.stringify(arg);
        }else if(_.isString(arg)){
          return arg;
        }else if(_.isFunction(arg.toString)){
          return arg.toString();
        }else {
          return "unknown";
        }
      }).join(" - ");
    },
    isLoggable: function(level) {
      return this.levelIndex(level) <= this.logLevelIndex;
    },
    levelIndex: function(level) {
      if(_.isUndefined(this.levelPrecedence[level])) return 0;
      else return this.levelPrecedence[level];
    }
  });

  var Logger = new logger();

  return {
    critical: function() {
      Logger.log("CRITICAL",arguments);
    },
    error: function() {
      Logger.log("ERROR",arguments);
    },
    warn: function() {
      Logger.log("WARN",arguments);
    },
    info: function() {
      Logger.log("INFO",arguments);
    },
    verbose: function() {
      Logger.log("VERBOSE",arguments);
    }
  };
});