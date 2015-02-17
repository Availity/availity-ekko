var _ = require('lodash');

var utils = {

  /**
   * Get/set the value of a nested property
   *
   * Usage:
   *
   * var obj = {
   *    a: {
   *      b: {
   *        c: {
   *          d: ['e', 'f', 'g']
   *        }
   *      }
   *    }
   *  };
   *
   *  // Get deep value
   *  deep(obj, 'a.b.c.d[2]'); // 'g'
   *
   *  // Set deep value
   *  deep(obj, 'a.b.c.d[2]', 'george');
   *
   *  // Get the deep value
   *  deep(obj, 'a.b.c.d[2]'); // 'george'
   *
   * @param  {[type]} obj   [description]
   * @param  {[type]} key   [description]
   * @param  {[type]} value [description]
   * @return {[type]}       [description]
   */
  deep: function(obj, key, value) {

    var keys = key.replace(/\[(["']?)([^\1]+?)\1?\]/g, '.$2').replace(/^\./, '').split('.');
    var root;
    var i = 0;
    var n = keys.length;

    // Set deep value
    if (arguments.length > 2) {

      root = obj;
      n--;

      while (i < n) {
        key = keys[i++];
        obj = obj[key] = _.isObject(obj[key]) ? obj[key] : {};
      }

      obj[keys[i]] = value;

      value = root;

    // Get deep value
    } else {
      while ((obj = obj[keys[i++]]) !== null && i < n) {
        if(!obj) {
          break;
        }
        continue;
      }
      value = i < n ? void 0 : obj;
    }

    return value;
  },




  /**
   * Extracts a deeply nested properties from an object or array.
   *
   * Usage:
   *
   * var arr = [{
   *   deeply: {
   *     nested: 'foo'
   *   }
   * }, {
   *   deeply: {
   *     nested: 'bar'
   *   }
   * }];
   * pluckDeep(arr, 'deeply.nested'); // ['foo', 'bar']
   *
   * @param  {Object} obj Object
   * @param  {String} key seperated by '.'
   * @return {Array} Array of values matching key
   */
  pluckDeep: function(obj, key) {
    var self = this;
    return _.map(obj, function(value) {
      return self.deep(value, key);
    });
  }

};

module.exports = utils;
