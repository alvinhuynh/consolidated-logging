!(function(t) {
    var e = {};
    function n(o) {
        if (e[o]) return e[o].exports;
        var a = (e[o] = { i: o, l: !1, exports: {} });
        return t[o].call(a.exports, a, a.exports, n), (a.l = !0), a.exports;
    }
    (n.m = t),
        (n.c = e),
        (n.d = function(t, e, o) {
            n.o(t, e) ||
                Object.defineProperty(t, e, { enumerable: !0, get: o });
        }),
        (n.r = function(t) {
            'undefined' != typeof Symbol &&
                Symbol.toStringTag &&
                Object.defineProperty(t, Symbol.toStringTag, {
                    value: 'Module',
                }),
                Object.defineProperty(t, '__esModule', { value: !0 });
        }),
        (n.t = function(t, e) {
            if ((1 & e && (t = n(t)), 8 & e)) return t;
            if (4 & e && 'object' == typeof t && t && t.__esModule) return t;
            var o = Object.create(null);
            if (
                (n.r(o),
                Object.defineProperty(o, 'default', {
                    enumerable: !0,
                    value: t,
                }),
                2 & e && 'string' != typeof t)
            )
                for (var a in t)
                    n.d(
                        o,
                        a,
                        function(e) {
                            return t[e];
                        }.bind(null, a)
                    );
            return o;
        }),
        (n.n = function(t) {
            var e =
                t && t.__esModule
                    ? function() {
                          return t.default;
                      }
                    : function() {
                          return t;
                      };
            return n.d(e, 'a', e), e;
        }),
        (n.o = function(t, e) {
            return Object.prototype.hasOwnProperty.call(t, e);
        }),
        (n.p = ''),
        n((n.s = 0));
})([
    function(t, e, n) {
        'use strict';
        n.r(e);
        var o = (function() {
            function t() {
                (this.lastPopStateDocumentLocationTime = null),
                    (this.lastPopStateDocumentLocationPathName = null);
            }
            return (
                (t.prototype.sendLogEvent = function(e) {
                    fetch(t.config.apiHost, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(e),
                    });
                }),
                (t.prototype.setupLogEvent = function(t) {
                    'input-change' === t.type
                        ? this.setupInputChangeLogEvent(t)
                        : 'input-focus' === t.type
                        ? this.setupInputFocusEvent(t)
                        : 'navigate' === t.type && this.setupNavigateLogEvent();
                }),
                (t.prototype.setupInputChangeLogEvent = function(t) {
                    var e = this;
                    document
                        .querySelector(t.id)
                        .addEventListener('input', function(t) {
                            e.sendLogEvent({
                                type: 'input-change',
                                time: Date.now(),
                            });
                        });
                }),
                (t.prototype.setupInputFocusEvent = function(t) {
                    var e = this,
                        n = document.querySelector(t.id);
                    n.addEventListener('focus', function(t) {
                        e.sendLogEvent({
                            type: 'input-change',
                            time: Date.now(),
                        });
                    }),
                        n.addEventListener('blur', function(t) {
                            e.sendLogEvent({
                                type: 'input-change',
                                time: Date.now(),
                            });
                        });
                }),
                (t.prototype.setupNavigateLogEvent = function() {
                    var t = this;
                    window.onpopstate = function(e) {
                        t.lastPopStateDocumentLocationTime
                            ? (t.sendLogEvent({
                                  type: 'navigate',
                                  time:
                                      Date.now() -
                                      t.lastPopStateDocumentLocationTime,
                                  path: t.lastPopStateDocumentLocationPathName,
                              }),
                              (t.lastPopStateDocumentLocationTime = null),
                              (t.lastPopStateDocumentLocationPathName = null))
                            : ((t.lastPopStateDocumentLocationTime = Date.now()),
                              (t.lastPopStateDocumentLocationPathName =
                                  document.location.pathname));
                    };
                }),
                (t.config = { apiHost: 'localhost:8080' }),
                t
            );
        })();
        e.default = o;
    },
]);
