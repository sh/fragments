// Generated by CoffeeScript 1.9.3
var CAMELCASED_STATUS_CODES, camelcasedName, fn, fn1, identifier, statusCode,
  slice = [].slice;

CAMELCASED_STATUS_CODES = require('../status-codes');

module.exports.fragments_setStatus = function(fragments_res) {
  return function(value) {
    return fragments_res.statusCode = value;
  };
};

fn = function(statusCode, identifier) {
  var factory;
  factory = function(fragments_setStatus) {
    return function() {
      return fragments_setStatus(statusCode);
    };
  };
  module.exports["fragments_setStatus" + statusCode] = factory;
  return module.exports["fragments_setStatus" + identifier] = factory;
};
for (statusCode in CAMELCASED_STATUS_CODES) {
  identifier = CAMELCASED_STATUS_CODES[statusCode];
  fn(statusCode, identifier);
}

fn1 = function(statusCode, camelcasedName) {
  var factory;
  factory = function(fragments_setStatus, fragments_end, fragments_http) {
    return function() {
      var args, data;
      data = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      fragments_setStatus(statusCode);
      if (statusCode !== 204) {
        if (data == null) {
          data = fragments_http.STATUS_CODES[statusCode];
        }
      }
      return fragments_end.apply(null, [data].concat(slice.call(args)));
    };
  };
  module.exports["fragments_end" + statusCode] = factory;
  return module.exports["fragments_end" + camelcasedName] = factory;
};
for (statusCode in CAMELCASED_STATUS_CODES) {
  camelcasedName = CAMELCASED_STATUS_CODES[statusCode];
  fn1(statusCode, camelcasedName);
}

['HTML', 'JSON', 'XML', 'Text', 'React'].forEach(function(content) {
  var results;
  results = [];
  for (statusCode in CAMELCASED_STATUS_CODES) {
    camelcasedName = CAMELCASED_STATUS_CODES[statusCode];
    results.push((function(statusCode, camelcasedName) {
      var factory;
      factory = function(fragments_setStatus, endX) {
        return function() {
          var args;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          fragments_setStatus(statusCode);
          return endX.apply(null, args);
        };
      };
      factory.__inject = ['fragments_setStatus', "fragments_end" + content];
      module.exports["fragments_end" + statusCode + content] = factory;
      return module.exports["fragments_end" + camelcasedName + content] = factory;
    })(statusCode, camelcasedName));
  }
  return results;
});
