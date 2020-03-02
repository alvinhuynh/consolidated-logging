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
        var _this = this;
        this.config = {
            apiHost: 'https://localhost:8080',
        };
        this.alreadyLoggedEvents = [];
        this.currentlyActiveEvents = [];
        this.handleConnectionChange = function (event) {
            if (event.type === 'online') {
                var numberOfalreadyLoggedEvents = _this.alreadyLoggedEvents.length;
                for (var i = 0; i < numberOfalreadyLoggedEvents; i++) {
                    _this._sendLogEvent(_this.alreadyLoggedEvents.pop());
                }
            }
        };
        this.config = __assign(__assign({}, this.config), consolidatedLoggerConfig);
        window.addEventListener('online', this.handleConnectionChange);
        window.addEventListener('offline', this.handleConnectionChange);
    }
    ConsolidatedLogger.prototype._sendLogEvent = function (event) {
        if (navigator.onLine) {
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
        this.currentlyActiveEvents.push(__assign(__assign({}, event), { start: Date.now() }));
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
        input.addEventListener('input', function () {
            _this._sendLogEvent(__assign(__assign({}, inputChangeMetaData), { type: 'input-change', time: Date.now() }));
        });
    };
    ConsolidatedLogger.prototype.setupInputFocusEvent = function (inputFocusMetaData) {
        var _this = this;
        var input = document.querySelector(inputFocusMetaData.selector);
        var hasFocused = false;
        input.addEventListener('focus', function () {
            hasFocused = true;
        });
        input.addEventListener('blur', function () {
            if (hasFocused) {
                _this._sendLogEvent(__assign(__assign({}, inputFocusMetaData), { type: 'input-focus', time: Date.now() }));
                hasFocused = false;
            }
        });
    };
    return ConsolidatedLogger;
}());
export default ConsolidatedLogger;
//# sourceMappingURL=index.js.map