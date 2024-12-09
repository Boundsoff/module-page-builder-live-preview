/*eslint-disable */
/* jscs:disable */
define(["pako"], function (_pako) {
  var _default = /*#__PURE__*/function () {
    "use strict";

    function _default() {}
    _default.encode = function encode(data) {
      var encoded = JSON.stringify(data);
      var compressed = _pako.gzip(encoded);
      return new Blob([compressed], {
        type: 'application/json'
      });
    };
    _default.decode = function decode(data) {
      return data.arrayBuffer().then(function (buffer) {
        return new Uint8Array(buffer);
      }).then(function (bufferArray) {
        return _pako.ungzip(bufferArray, {
          to: 'string'
        });
      }).then(function (encoded) {
        return JSON.parse(encoded);
      });
    };
    return _default;
  }();
  return _default;
});
//# sourceMappingURL=live-preview-encoder.js.map