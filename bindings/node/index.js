try {
  module.exports = require('../../build/Release/tree_sitter_utl_binding');
} catch (e1) {
  if (e1.code !== 'MODULE_NOT_FOUND') {
    throw e1;
  }
  try {
    module.exports = require('../../build/Debug/tree_sitter_utl_binding');
  } catch (e2) {
    if (e2.code !== 'MODULE_NOT_FOUND') {
      throw e2;
    }
    throw e1;
  }
}

try {
  module.exports.nodeTypeInfo = require('../../src/node-types.json');
} catch (_) {}
