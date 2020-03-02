var ConsolidatedLogger = /** @class */ (function () {
    function ConsolidatedLogger() {
        this.lastPopStateDocumentLocationTime = null;
        this.lastPopStateDocumentLocationPathName = null;
    }
    ConsolidatedLogger.prototype._sendLogEvent = function (event) {
        fetch(ConsolidatedLogger.config.apiHost, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });
    };
    ConsolidatedLogger.prototype.setupLogEvent = function (event) {
        if (event.type === 'input-change') {
            this._setupInputChangeLogEvent(event);
        }
        else if (event.type === 'input-focus') {
            this._setupInputFocusEvent(event);
        }
        else if (event.type === 'navigate') {
            this._setupNavigateLogEvent();
        }
    };
    ConsolidatedLogger.prototype._setupInputChangeLogEvent = function (inputChangeMetaData) {
        var _this = this;
        var input = document.querySelector(inputChangeMetaData.selector);
        input.addEventListener('input', function (event) {
            _this._sendLogEvent({
                type: 'input-change',
                time: Date.now(),
            });
        });
    };
    ConsolidatedLogger.prototype._setupInputFocusEvent = function (inputFocusMetaData) {
        var _this = this;
        var input = document.querySelector(inputFocusMetaData.selector);
        var hasFocused = false;
        input.addEventListener('focus', function (event) {
            hasFocused = true;
            _this._sendLogEvent({
                type: 'input-focus',
                time: Date.now(),
            });
        });
        input.addEventListener('blur', function (event) {
            if (hasFocused) {
                _this._sendLogEvent({
                    type: 'input-focus',
                    time: Date.now(),
                });
                hasFocused = false;
            }
        });
    };
    ConsolidatedLogger.prototype._setupNavigateLogEvent = function () {
        var _this = this;
        window.onpopstate = function (event) {
            if (!_this.lastPopStateDocumentLocationTime) {
                _this.lastPopStateDocumentLocationTime = Date.now();
                _this.lastPopStateDocumentLocationPathName =
                    document.location.pathname;
            }
            else {
                _this._sendLogEvent({
                    type: 'navigate',
                    time: Date.now() - _this.lastPopStateDocumentLocationTime,
                    path: _this.lastPopStateDocumentLocationPathName,
                });
                _this.lastPopStateDocumentLocationTime = null;
                _this.lastPopStateDocumentLocationPathName = null;
            }
        };
    };
    ConsolidatedLogger.config = {
        apiHost: 'https://localhost:8080',
    };
    return ConsolidatedLogger;
}());
export default ConsolidatedLogger;
//# sourceMappingURL=index.js.map