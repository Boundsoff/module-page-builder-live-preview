/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/events", "Boundsoff_PageBuilderLivePreview/js/peerjs-types"], function (_events, _peerjsTypes) {
  // @ts-ignore
  var _default = /*#__PURE__*/function () {
    "use strict";

    function _default(pageBuilder) {
      var _this = this;
      this.clients = new Map();
      this.pageBuilder = pageBuilder;
      window.addEventListener('beforeunload', function () {
        Array.from(_this.clients.keys()).forEach(function (connection) {
          return connection.close();
        });
        _this.clients.clear();
        _this.peer.disconnect();
      }, {
        passive: true
      });
      this.peer = new _peerjsTypes.Peer();
      this.peer.on('connection', this.connect.bind(this));
      _events.on("stage:" + this.pageBuilder.stage.id + ":masterFormatRenderAfter", this.afterMasterFormatRender.bind(this));
    }
    var _proto = _default.prototype;
    _proto.connect = function connect(connection) {
      var _this2 = this;
      if (this.clients.has(connection.connectionId)) {
        console.warn('already got this socket client');
      }
      connection.on('open', function () {
        connection.on('data', _this2.data.bind(_this2, connection));
      });
      this.clients.set(connection, {
        storeViewCode: '-'
      });
    };
    _proto.data = function data(connection, _data) {
      switch (_data.topic) {
        case LivePreviewTopic.register:
          this.onRegister(connection, _data.data);
          break;
        case LivePreviewTopic.close:
          this.onClose(connection);
          break;
        default:
          console.warn("Undefined socket message type.");
          break;
      }
    };
    _proto.afterMasterFormatRender = function afterMasterFormatRender(_ref) {
      var value = _ref.value;
      if (!this.clients.size || !this.peer.open) {
        return;
      }
      var socketMessage = {
        topic: LivePreviewTopic.render,
        data: {
          value: value
        }
      };
      Array.from(this.clients.keys()).forEach(function (connection) {
        return connection.send(socketMessage);
      });
    };
    _proto.onRegister = function onRegister(connection, data) {
      var client = this.clients.get(connection);
      client.storeViewCode = data.storeViewCode;
    };
    _proto.onClose = function onClose(connection) {
      this.clients.delete(connection);
      connection.close();
    };
    return _default;
  }();
  return _default;
});
//# sourceMappingURL=live-preview-service.js.map