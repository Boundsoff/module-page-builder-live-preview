/*eslint-disable */
/* jscs:disable */
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
define(["Magento_PageBuilder/js/events", "knockout"], function (_events, _knockout) {
  // @ts-ignore
  var _default = /*#__PURE__*/function () {
    "use strict";

    function _default(pageBuilder) {
      var _this = this;
      this.counter = _knockout.observable({});
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
      this.peer = new Peer();
      this.peer.on('connection', this.connect.bind(this));
      _events.on("stage:" + this.pageBuilder.stage.id + ":masterFormatRenderAfter", this.afterMasterFormatRender.bind(this));
    }
    var _proto = _default.prototype;
    _proto.connect = function connect(connection) {
      var _this2 = this;
      if (this.clients.has(connection)) {
        console.warn('already got this socket client');
      }
      connection.on('open', function () {
        connection.on('data', _this2.data.bind(_this2, connection));
      });
      connection.on('close', this.onClose.bind(this, connection));
      this.clients.set(connection, {
        storeViewCode: '-'
      });
    };
    _proto.data = function data(connection, _data) {
      switch (_data.topic) {
        case 'REGISTER':
          this.onRegister(connection, _data.data);
          break;
        case 'CLOSE':
          this.onClose(connection);
          break;
        default:
          console.warn("Undefined socket message type.");
          break;
      }
    };
    _proto.afterMasterFormatRender = function afterMasterFormatRender(_ref) {
      var value = _ref.value;
      this.masterContentRendered = value;
      if (!this.clients.size || !this.peer.open) {
        return;
      }
      var messageData = {
        content: this.masterContentRendered
      };
      var message = {
        topic: 'RENDER',
        data: messageData
      };
      Array.from(this.clients.keys()).forEach(function (connection) {
        return connection.send(message);
      });
    };
    _proto.onRegister = function onRegister(connection, data) {
      var client = this.clients.get(connection);
      client.storeViewCode = data.storeViewCode;
      var messageData = {
        content: this.masterContentRendered
      };
      var message = {
        topic: 'RENDER',
        data: messageData
      };
      connection.send(message);
      var counter = this.counter();
      counter[client.storeViewCode] = counter[client.storeViewCode] || 0;
      counter[client.storeViewCode] += 1;
      this.counter(counter);
    };
    _proto.onClose = function onClose(connection) {
      var client = this.clients.get(connection);
      var counter = this.counter();
      counter[client.storeViewCode] = counter[client.storeViewCode] || 0;
      counter[client.storeViewCode] = Math.max(counter[client.storeViewCode] - 1, 0);
      this.counter(counter);
      this.clients.delete(connection);
      connection.close();
    };
    return _createClass(_default, [{
      key: "peerId",
      get: function get() {
        return this.peer.id;
      }
    }]);
  }();
  return _default;
});
//# sourceMappingURL=live-preview-service.js.map