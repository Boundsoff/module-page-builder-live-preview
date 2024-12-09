/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/events", "Boundsoff_PageBuilderLivePreview/js/live-preview-encoder"], function (_events, _livePreviewEncoder) {
  // @ts-ignore
  var _default = /*#__PURE__*/function () {
    "use strict";

    function _default(pageBuilder) {
      var _this = this;
      this.clients = new Map();
      this.pageBuilder = pageBuilder;
      window.addEventListener('beforeunload', function () {
        _this.socket.close();
      }, {
        passive: true
      });
      var url = new URL(location.origin);
      url.pathname = "/page-builder/preview/" + this.pageBuilder.id + "/";
      url.protocol = 'wss';
      this.socket = new WebSocket(url.toString());
      this.socket.addEventListener('message', this.onSocketMessage.bind(this));
      _events.on("stage:" + this.pageBuilder.stage.id + ":masterFormatRenderAfter", this.afterMasterFormatRender.bind(this));
    }
    var _proto = _default.prototype;
    _proto.afterMasterFormatRender = function afterMasterFormatRender(_ref) {
      var value = _ref.value;
      if (!this.clients.size) {
        return;
      }
      var socketMessage = {
        topic: LivePreviewTopic.render,
        data: {
          value: value
        }
      };
      var data = _livePreviewEncoder.encode(socketMessage);
      this.socket.send(data);
    };
    _proto.onSocketMessage = function onSocketMessage(event) {
      var _this2 = this;
      _livePreviewEncoder.decode(event.data).then(function (data) {
        switch (data.topic) {
          case LivePreviewTopic.connect:
            _this2.onConnect(data.data);
            break;
          case LivePreviewTopic.close:
            _this2.onClose(data.data);
            break;
          default:
            console.warn("Undefined socket message type.");
            break;
        }
      });
    };
    _proto.onConnect = function onConnect(data) {
      if (this.clients.has(data.id)) {
        console.warn('already got this socket client');
      }
      this.clients.set(data.id, data);
    };
    _proto.onClose = function onClose(data) {
      if (!this.clients.has(data.id)) {
        console.warn("client wasn't even register");
      }
      this.clients.delete(data.id);
    };
    return _default;
  }();
  return _default;
});
//# sourceMappingURL=live-preview-service.js.map