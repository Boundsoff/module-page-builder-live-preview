/*eslint-disable */
/* jscs:disable */
define(["knockout"], function (_knockout) {
  var LivePreviewService = /*#__PURE__*/function () {
    "use strict";

    function LivePreviewService(peerId, storeCode) {
      var _this = this;
      this.content = _knockout.observable('<code>Loading...</code>');
      this.storeCode = storeCode;
      this.peer = new Peer();
      this.peer.on('open', function () {
        _this.connection = _this.peer.connect(peerId);
        _this.connection.on('data', _this.connectionData.bind(_this));
        _this.connection.on('open', _this.connectionOpen.bind(_this));
        window.addEventListener('beforeunload', function () {
          _this.connection.close();
          _this.peer.disconnect();
        }, {
          passive: true
        });
      });
    }
    var _proto = LivePreviewService.prototype;
    _proto.connectionOpen = function connectionOpen() {
      var data = {
        storeViewCode: this.storeCode
      };
      var message = {
        topic: 'REGISTER',
        data: data
      };
      this.connection.send(message);
    };
    _proto.connectionData = function connectionData(data) {
      switch (data.topic) {
        case 'CLOSE':
          this.peer.disconnect();
          break;
        case 'RENDER':
          var content = data.data.content;
          this.content(content);
          break;
        default:
          console.warn('unhandled peer connection data message');
          break;
      }
    };
    return LivePreviewService;
  }();
  return LivePreviewService;
});
//# sourceMappingURL=live-preview-service.js.map