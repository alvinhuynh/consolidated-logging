var ConsolidatedLogger = /** @class */ (function () {
    function ConsolidatedLogger() {
        this.eventCache = {};
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
    ConsolidatedLogger.prototype.startCustomLogEvent = function (event) {
        this.eventCache[event.type] = {
            type: event.type,
            start: Date.now(),
        };
    };
    ConsolidatedLogger.prototype.stopCustomLogEvent = function (event) {
        var customEvent = this.eventCache[event.type];
        customEvent.end = Date.now();
        this._sendLogEvent(customEvent);
    };
    ConsolidatedLogger.prototype.setupLogEvent = function (event) {
        if (event.type === 'input-change') {
            this._setupInputChangeLogEvent(event);
        }
        else if (event.type === 'input-focus') {
            this._setupInputFocusEvent(event);
        }
    };
    ConsolidatedLogger.prototype._setupInputChangeLogEvent = function (inputChangeMetaData) {
        var _this = this;
        var input = document.querySelector(inputChangeMetaData.selector);
        input.addEventListener('input', function (event) {
            _this._sendLogEvent({
                type: 'input-change',
                time: Date.now(),
                selector: inputChangeMetaData.selector,
            });
        });
    };
    ConsolidatedLogger.prototype._setupInputFocusEvent = function (inputFocusMetaData) {
        var _this = this;
        var input = document.querySelector(inputFocusMetaData.selector);
        var hasFocused = false;
        input.addEventListener('focus', function (event) {
            hasFocused = true;
        });
        input.addEventListener('blur', function (event) {
            if (hasFocused) {
                _this._sendLogEvent({
                    type: 'input-focus',
                    time: Date.now(),
                    selector: inputFocusMetaData.selector,
                });
                hasFocused = false;
            }
        });
    };
    ConsolidatedLogger.config = {
        apiHost: 'https://localhost:8080',
    };
    return ConsolidatedLogger;
}());
export default new ConsolidatedLogger();
//# sourceMappingURL=index.js.map