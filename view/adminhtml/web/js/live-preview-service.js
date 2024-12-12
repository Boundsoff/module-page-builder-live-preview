/*eslint-disable */
/* jscs:disable */
function _createForOfIteratorHelperLoose(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: !0 } : { done: !1, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
define(["Magento_PageBuilder/js/events", "knockout", "jquery", "Magento_PageBuilder/js/config"], function (_events, _knockout, _jquery, _config) {
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
    _proto.fetchContent = function fetchContent(storeCode, content) {
      var url = _config.getConfig('directive_filter_url');
      var request = {
        method: 'POST',
        data: {
          storeCode: storeCode,
          content: content
        }
      };
      return _jquery.ajax(url, request);
    };
    _proto.afterMasterFormatRender = function afterMasterFormatRender(_ref) {
      var _this3 = this;
      var value = _ref.value;
      this.masterContentRendered = value;
      if (!this.clients.size || !this.peer.open) {
        return;
      }
      var _loop = function _loop() {
        var _step$value = _step.value,
          connection = _step$value[0],
          client = _step$value[1];
        _this3.fetchContent(client.storeViewCode, _this3.masterContentRendered).then(function (content) {
          var messageData = {
            content: content
          };
          var message = {
            topic: 'RENDER',
            data: messageData
          };
          connection.send(message);
        });
      };
      for (var _iterator = _createForOfIteratorHelperLoose(this.clients.entries()), _step; !(_step = _iterator()).done;) {
        _loop();
      }
    };
    _proto.onRegister = function onRegister(connection, data) {
      var client = this.clients.get(connection);
      client.storeViewCode = data.storeViewCode;
      var counter = this.counter();
      counter[client.storeViewCode] = counter[client.storeViewCode] || 0;
      counter[client.storeViewCode] += 1;
      this.counter(counter);
      this.fetchContent(client.storeViewCode, this.masterContentRendered).then(function (content) {
        var messageData = {
          content: content
        };
        var message = {
          topic: 'RENDER',
          data: messageData
        };
        connection.send(message);
      });
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