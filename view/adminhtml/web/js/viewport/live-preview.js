/*eslint-disable */
/* jscs:disable */
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
define(["Magento_PageBuilder/js/config", "knockout"], function (_config, _knockout) {
  var LivePreview = /*#__PURE__*/function () {
    "use strict";

    function LivePreview(pageBuilder) {
      var _this = this;
      this.template = 'Boundsoff_PageBuilderLivePreview/viewport/live-preview';
      this.storeActive = _knockout.observable(null);
      this.copyStatus = _knockout.observable('Copy ©');
      this.icomoonFeed = 'Boundsoff_PageBuilderLivePreview/icomoon/feed.svg';
      this.pageBuilder = pageBuilder;
      document.addEventListener('click', this.onDocClick.bind(this));
      this.storeShown = _knockout.computed(function () {
        return !!_this.storeActive();
      });
    }
    var _proto = LivePreview.prototype;
    _proto.getTemplate = function getTemplate() {
      return this.template;
    };
    _proto.bindDialog = function bindDialog(modelElement) {
      this.dialogElement = modelElement;
    };
    _proto.onPreviewClick = function onPreviewClick(_, event) {
      if (!this.dialogElement.open) {
        event.stopPropagation();
        this.dialogElement.show();
      }
    };
    _proto.setStoreActive = function setStoreActive(store) {
      this.storeActive(store);
    };
    _proto.copyLink = function copyLink() {
      var _this2 = this;
      // noinspection JSIgnoredPromiseFromCall
      this.copyStatus('Copied ✔');
      navigator.clipboard.writeText(this.previewLink).then(function () {
        setTimeout(function () {
          _this2.copyStatus('Copy ©');
        }, 5000);
      });
    };
    _proto.onDocClick = function onDocClick(event) {
      var _this$dialogElement;
      if (!((_this$dialogElement = this.dialogElement) != null && _this$dialogElement.open)) {
        return;
      }
      var element = event.target;
      do {
        if (element.isEqualNode(this.dialogElement)) {
          return;
        }
        element = element.parentElement;
      } while (element);
      this.dialogElement.close();
    };
    return _createClass(LivePreview, [{
      key: "srcIcomoonFeed",
      get: function get() {
        var themeUrl = _config.getConfig('theme_url');
        return themeUrl + "/" + this.icomoonFeed;
      }
    }, {
      key: "stores",
      get: function get() {
        return _config.getConfig('stores');
      }
    }, {
      key: "previewLink",
      get: function get() {
        var _this$storeActive;
        return (((_this$storeActive = this.storeActive()) == null ? void 0 : _this$storeActive.baseUrl) || '').replace(':peer-id:', this.pageBuilder.livePreviewPeerId);
      }
    }, {
      key: "storeViewCounter",
      get: function get() {
        return this.pageBuilder.storeViewCounter;
      }
    }]);
  }();
  return LivePreview;
});
//# sourceMappingURL=live-preview.js.map