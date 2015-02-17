/**
 * https://github.com/coolaj86/javascript-noop/blob/5ee341adfe227d10f332c13b4fdff7a8976b3a3f/noop/index.js
 *
 */
module.exports = {

  noop: function() {
    // do nothing
  },

  doop: function(cb, args, context) {
    if(typeof cb === 'function') {
      return cb.apply(context, args);
    }
  }
};