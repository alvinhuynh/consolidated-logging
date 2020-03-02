"use strict";
exports.__esModule = true;
var ConsolidatedLogger = /** @class */ (function () {
    function ConsolidatedLogger() {
        this.lastPopStateDocumentLocationTime = null;
        this.lastPopStateDocumentLocationPathName = null;
    }
    ConsolidatedLogger.prototype.sendLogEvent = function (event) {
        fetch(ConsolidatedLogger.config.apiHost, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
        });
    };
    ConsolidatedLogger.prototype.setupLogEvent = function (event) {
        if (event.type === 'input-change') {
            this.setupInputChangeLogEvent(event);
        }
        else if (event.type === 'input-focus') {
            this.setupInputFocusEvent(event);
        }
        else if (event.type === 'navigate') {
            this.setupNavigateLogEvent();
        }
    };
    ConsolidatedLogger.prototype.setupInputChangeLogEvent = function (inputChangeMetaData) {
        var _this = this;
        var input = document.querySelector(inputChangeMetaData.id);
        input.addEventListener('input', function (event) {
            _this.sendLogEvent({
                type: 'input-change',
                time: Date.now()
            });
        });
    };
    ConsolidatedLogger.prototype.setupInputFocusEvent = function (inputFocusMetaData) {
        var _this = this;
        var input = document.querySelector(inputFocusMetaData.id);
        input.addEventListener('focus', function (event) {
            _this.sendLogEvent({
                type: 'input-change',
                time: Date.now()
            });
        });
        input.addEventListener('blur', function (event) {
            _this.sendLogEvent({
                type: 'input-change',
                time: Date.now()
            });
        });
    };
    ConsolidatedLogger.prototype.setupNavigateLogEvent = function () {
        var _this = this;
        window.onpopstate = function (event) {
            if (!_this.lastPopStateDocumentLocationTime) {
                _this.lastPopStateDocumentLocationTime = Date.now();
                _this.lastPopStateDocumentLocationPathName =
                    document.location.pathname;
            }
            else {
                _this.sendLogEvent({
                    type: 'navigate',
                    time: Date.now() - _this.lastPopStateDocumentLocationTime,
                    path: _this.lastPopStateDocumentLocationPathName
                });
                _this.lastPopStateDocumentLocationTime = null;
                _this.lastPopStateDocumentLocationPathName = null;
            }
        };
    };
    ConsolidatedLogger.config = {
        apiHost: 'localhost:8080'
    };
    return ConsolidatedLogger;
}());
exports["default"] = ConsolidatedLogger;
