define([
  "underscore",
  "text!../../config/app.json"
],function(_,json) {
  var config = JSON.parse(json);
  return {
    get: function(key,defaultValue) {
      defaultValue = defaultValue || null;
      if(key.indexOf(".") !== -1) return this.recursiveLookup(key.split("."),defaultValue);
      else return this.lookup(key,defaultValue);
    },
    recursiveLookup: function(keys,defaultValue) {
      var i = config;
      _.each(keys,function(key) {
        if(_.isUndefined(i[key])) {
          i = defaultValue;
        } else {
          i = i[key];
        }
      });
      return i;
    },
    lookup: function(key,defaultValue) {
      if(_.isUndefined(config[key])) return defaultValue;
      else return config[key];
    },
    baseUrl: function() {
      return this.get("baseUrl","No base url found");
    },
    viewBaseUrl: function() {
      return this.get("viewBaseUrl","No view base url found");
    }
  };
});