/*eslint-disable */
/* jscs:disable */
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(t, o) { t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
define(["Boundsoff_PageBuilderLivePreview/js/viewport/live-preview", "Boundsoff_PageBuilderLivePreview/js/live-preview-service"], function (_livePreview, _livePreviewService) {
  function _default(base) {
    return /*#__PURE__*/function (_base) {
      "use strict";

      function PageBuilderMixin(config, initialValue) {
        var _this;
        _this = _base.call(this, config, initialValue) || this;
        _this.livePreview = new _livePreview(_this);
        if (_this.isStageReady()) {
          _this.startLivePreviewService();
        } else {
          _this.isStageReady.subscribe(function () {
            _this.startLivePreviewService();
          });
        }
        return _this;
      }
      _inheritsLoose(PageBuilderMixin, _base);
      var _proto = PageBuilderMixin.prototype;
      _proto.startLivePreviewService = function startLivePreviewService() {
        this.livePreviewService = new _livePreviewService(this);
      };
      return _createClass(PageBuilderMixin, [{
        key: "viewportTemplate",
        get: function get() {
          return "Boundsoff_PageBuilderLivePreview/viewport/switcher";
        }
      }, {
        key: "livePreviewPeerId",
        get: function get() {
          return this.livePreviewService.peerId;
        }
      }]);
    }(base);
  }
  return _default;
});
//# sourceMappingURL=page-builder-mixin.js.map