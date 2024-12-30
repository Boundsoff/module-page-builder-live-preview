/*eslint-disable */
/* jscs:disable */
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
define(["Boundsoff_PageBuilderLivePreview/js/model/stores", "Magento_PageBuilder/js/config"], function (_stores, _config) {
  var StoreOptions = /*#__PURE__*/function () {
    "use strict";

    function StoreOptions(options, depth) {
      var _this = this;
      if (depth === void 0) {
        depth = 1;
      }
      this.storeViewCounter = _stores.counter;
      this.template = 'Boundsoff_PageBuilderLivePreview/viewport/live-preview/store-options';
      this.options = options.map(function (it) {
        if (Array.isArray(it.value)) {
          return {
            isStore: false,
            label: it.label,
            value: new StoreOptions(it.value, depth + 1),
            depth: depth
          };
        }
        return {
          isStore: true,
          label: it.label,
          value: _this.stores.get(it.value),
          depth: depth
        };
      });
    }
    var _proto = StoreOptions.prototype;
    _proto.getTemplate = function getTemplate() {
      return this.template;
    };
    _proto.setStoreActive = function setStoreActive(store) {
      (0, _stores.active)(store);
    };
    return _createClass(StoreOptions, [{
      key: "stores",
      get: function get() {
        var stores = new Map();
        for (var _i = 0, _Object$values = Object.values(_config.getConfig('stores')); _i < _Object$values.length; _i++) {
          var store = _Object$values[_i];
          stores.set(store.id.toString(), store);
        }
        return stores;
      }
    }]);
  }();
  return StoreOptions;
});
//# sourceMappingURL=store-options.js.map