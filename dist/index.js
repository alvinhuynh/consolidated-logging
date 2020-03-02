var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var ConsolidatedLogger = /** @class */ (function () {
    function ConsolidatedLogger(consolidatedLoggerConfig) {
        this.config = {
            apiHost: 'https://localhost:8080',
        };
        this.alreadyLoggedEvents = [];
        this.currentlyActiveEvents = [];
        this.isOnline = true;
        this.config = __assign(__assign({}, this.config), consolidatedLoggerConfig);
        window.addEventListener('online', this.handleConnectionChange);
        window.addEventListener('offline', this.handleConnectionChange);
    }
    ConsolidatedLogger.prototype.handleConnectionChange = function (event) {
        if (event.type === 'online') {
            this.isOnline = true;
            var numberOfalreadyLoggedEvents = this.alreadyLoggedEvents.length;
            for (var i = 0; i < numberOfalreadyLoggedEvents; i++) {
                var logEvent = this.alreadyLoggedEvents.pop();
                this._sendLogEvent(logEvent);
            }
        }
        else if (event.type === 'offline') {
            this.isOnline = false;
        }
    };
    ConsolidatedLogger.prototype._sendLogEvent = function (event) {
        if (this.isOnline) {
            fetch(this.config.apiHost, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
            });
        }
        else {
            this.alreadyLoggedEvents.push(event);
        }
    };
    ConsolidatedLogger.prototype.sendCustomLogEvent = function (event) {
        this._sendLogEvent(__assign(__assign({}, event), { time: Date.now() }));
    };
    ConsolidatedLogger.prototype.startCustomTimeDurationLogEvent = function (event) {
        this.currentlyActiveEvents.push({
            type: event.type,
            start: Date.now(),
        });
    };
    ConsolidatedLogger.prototype.stopCustomTimeDurationLogEvent = function (event) {
        var customEventIndex = this.currentlyActiveEvents.findIndex(function (currentlyActiveEvent) {
            return currentlyActiveEvent.type === event.type;
        });
        var customEvent = this.currentlyActiveEvents[customEventIndex];
        if (customEvent) {
            customEvent.end = Date.now();
            this._sendLogEvent(customEvent);
            this.currentlyActiveEvents.splice(customEventIndex, 1);
        }
    };
    ConsolidatedLogger.prototype.setupInputChangeLogEvent = function (inputChangeMetaData) {
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
    ConsolidatedLogger.prototype.setupInputFocusEvent = function (inputFocusMetaData) {
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
    return ConsolidatedLogger;
}());
export default ConsolidatedLogger;
//# sourceMappingURL=index.js.map