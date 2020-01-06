"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollMenu = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ANCHOR_REGEX = /^#.*$/;

var ScrollMenu =
/*#__PURE__*/
function () {
  function ScrollMenu(_ref) {
    var _this = this;

    var links = _ref.links,
        _ref$offsetMediaQueri = _ref.offsetMediaQueries,
        offsetMediaQueries = _ref$offsetMediaQueri === void 0 ? [] : _ref$offsetMediaQueri;

    _classCallCheck(this, ScrollMenu);

    _defineProperty(this, "_linkClickHandler", function (e) {
      e.preventDefault();

      _this._revealTarget(_this.elements[_this._getKeyFromLink(e.currentTarget)]);
    });

    _defineProperty(this, "_offsetMediaQueryListener", function () {
      _this._determineOffset();

      _this._resetIntersectionObserver();
    });

    _defineProperty(this, "_determineOffset", function () {
      if (_this.offsetMediaQueries.length === 0) return;
      var hasMatched = false;

      _this.offsetMediaQueries.forEach(function (mq) {
        if (!hasMatched && mq.mql.matches) {
          hasMatched = true;
          _this.scrollOffset = mq.scrollOffset;
          _this.rootMargin = mq.rootMargin;
        }
      });
    });

    this.intersectionObserver = null;
    this.scrollOffset = 0;
    this.rootMargin = "0px 0px 0px 0px";
    this.elements = links.reduce(function (acc, link) {
      var targetSelector = _this._getKeyFromLink(link);

      if (_this._testAnchorString(targetSelector)) {
        acc[targetSelector] = {
          link: link,
          target: document.querySelector(targetSelector)
        };
      }

      return acc;
    }, {});
    this.offsetMediaQueries = offsetMediaQueries.map(function (omq) {
      var mql = window.matchMedia(omq.mediaQuery);
      mql.addListener(_this._offsetMediaQueryListener);
      return _objectSpread({}, omq, {
        mql: mql
      });
    });

    this._determineOffset();

    this._connectIntersectionObserver();

    this._addEventListeners();
  }

  _createClass(ScrollMenu, [{
    key: "_getKeyFromLink",
    value: function _getKeyFromLink(link) {
      return link.getAttribute("href");
    }
  }, {
    key: "_getKeyFromTarget",
    value: function _getKeyFromTarget(target) {
      return "#" + target.id;
    }
  }, {
    key: "_testAnchorString",
    value: function _testAnchorString(value) {
      return ANCHOR_REGEX.test(value);
    }
  }, {
    key: "_connectIntersectionObserver",
    value: function _connectIntersectionObserver() {
      var _this2 = this;

      this.intersectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          _this2._updateLinkState(_this2.elements[_this2._getKeyFromTarget(entry.target)], entry.isIntersecting && entry.intersectionRatio >= 0.5);
        });
      }, {
        rootMargin: this.rootMargin,
        threshold: [0, 0.5, 1]
      });
    }
  }, {
    key: "_disconnectIntersectionObserver",
    value: function _disconnectIntersectionObserver() {
      this.intersectionObserver.disconnect();
      delete this.intersectionObserver;
    }
  }, {
    key: "_resetIntersectionObserver",
    value: function _resetIntersectionObserver() {
      this._disconnectIntersectionObserver();

      this._connectIntersectionObserver();

      for (var key in this.elements) {
        this.intersectionObserver.observe(this.elements[key].target);
      }
    }
  }, {
    key: "_addEventListeners",
    value: function _addEventListeners() {
      for (var key in this.elements) {
        this.elements[key].link.addEventListener("click", this._linkClickHandler);
        this.intersectionObserver.observe(this.elements[key].target);
      }
    }
  }, {
    key: "_revealTarget",
    value: function _revealTarget(element) {
      var bodyTopOffset = document.body.getBoundingClientRect().top;
      var targetTopOffset = element.target.getBoundingClientRect().top;
      window.scrollTo({
        top: targetTopOffset - bodyTopOffset + this.scrollOffset,
        behavior: "smooth"
      });
    }
  }, {
    key: "_updateLinkState",
    value: function _updateLinkState(element, active) {
      element.link.dataset.active = active;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._disconnectIntersectionObserver();

      for (var key in this.elements) {
        this.elements[key].link.removeEventListener("click", this._linkClickHandler);
      }
    }
  }]);

  return ScrollMenu;
}();

exports.ScrollMenu = ScrollMenu;