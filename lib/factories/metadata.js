// Generated by CoffeeScript 1.9.3
module.exports.fragments_$meta = function() {
  return [];
};

module.exports.fragments_getMeta = function(fragments_$meta) {
  return function() {
    return fragments_$meta;
  };
};

module.exports.fragments_pushMeta = function(fragments_$meta) {
  return function(attrs) {
    return fragments_$meta.push(attrs);
  };
};
