import ConsolidatedLogger from './index';

let consolidatedLogger: ConsolidatedLogger;
const now = 1530518207007;

beforeAll(() => {
    Object.defineProperty(window, 'addEventListener', {
        value: jest.fn(),
    });
    global.fetch = jest.fn();
    global.Date.now = jest.fn(() => now);
    consolidatedLogger = new ConsolidatedLogger({
        apiHost: 'http://localhost:8000',
    });
});

describe('_sendLogEvent', () => {
    test('it should make api call if connection is online', () => {
        global.navigator = {
            onLine: true,
        };
        consolidatedLogger._sendLogEvent({
            type: 'input-focus',
            selector: '#custom-input',
        });
        expect(consolidatedLogger.alreadyLoggedEvents).toEqual([]);
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    test('it should store event if connection is not online', () => {
        global.navigator = {
            onLine: false,
        };
        consolidatedLogger._sendLogEvent({
            type: 'input-focus',
            selector: '#custom-input',
        });
        expect(consolidatedLogger.alreadyLoggedEvents).toEqual([
            {
                selector: '#custom-input',
                type: 'input-focus',
            },
        ]);
    });
});

describe('sendCustomLogEvent', () => {
    test('it should be call _sendLogEvent with correct fields', () => {
        consolidatedLogger._sendLogEvent = jest.fn();
        consolidatedLogger.sendCustomLogEvent({
            type: 'custom-event',
        });
        expect(consolidatedLogger._sendLogEvent).toHaveBeenCalledTimes(1);
        expect(consolidatedLogger._sendLogEvent).toHaveBeenCalledWith({
            type: 'custom-event',
            time: now,
        });
    });
});

describe('startCustomTimeDurationLogEvent', () => {
    test('it should populate currentlyActiveEvents with new log event', () => {
        consolidatedLogger.startCustomTimeDurationLogEvent({
            type: 'custom-event',
        });
        expect(consolidatedLogger.currentlyActiveEvents).toEqual([
            {
                start: now,
                type: 'custom-event',
            },
        ]);
    });
});

describe('stopCustomTimeDurationLogEvent', () => {
    test('it should call _sendLogEvent with the start and end time and clear the currentlyActiveEvents entry', () => {
        consolidatedLogger._sendLogEvent = jest.fn();
        consolidatedLogger.stopCustomTimeDurationLogEvent({
            type: 'custom-event',
        });
        expect(consolidatedLogger.currentlyActiveEvents).toEqual([]);
        expect(consolidatedLogger._sendLogEvent).toHaveBeenCalledWith({
            type: 'custom-event',
            start: now,
            end: now,
        });
    });
});

describe('setupInputChangeLogEvent', () => {
    test('it should call _sendLogEvent with the correct fields', () => {
        let inputCallbackFunction: () => void;
        consolidatedLogger._sendLogEvent = jest.fn();
        global.document.querySelector = jest.fn(() => {
            return {
                addEventListener: (eventType, callbackFunction) => {
                    inputCallbackFunction = callbackFunction;
                },
            };
        });

        consolidatedLogger.setupInputChangeLogEvent({
            selector: '#custom-input',
        });

        if (inputCallbackFunction) {
            inputCallbackFunction();
        }

        expect(consolidatedLogger._sendLogEvent).toHaveBeenCalledWith({
            type: 'input-change',
            selector: '#custom-input',
            time: now,
        });
    });
});

describe('setupInputFocusEvent', () => {
    test('it should call _sendLogEvent with the correct fields', () => {
        let inputFocusCallbackFunction: () => void;
        let inputBlurCallbackFunction: () => void;
        consolidatedLogger._sendLogEvent = jest.fn();
        global.document.querySelector = jest.fn(() => {
            return {
                addEventListener: (
                    eventType: string,
                    callbackFunction: () => void
                ) => {
                    if (eventType === 'focus') {
                        inputFocusCallbackFunction = callbackFunction;
                    } else if (eventType === 'blur') {
                        inputBlurCallbackFunction = callbackFunction;
                    }
                },
            };
        });

        consolidatedLogger.setupInputFocusEvent({
            selector: '#custom-input',
        });

        if (inputFocusCallbackFunction) {
            inputFocusCallbackFunction();
        }

        if (inputBlurCallbackFunction) {
            inputBlurCallbackFunction();
        }

        expect(consolidatedLogger._sendLogEvent).toHaveBeenCalledWith({
            type: 'input-focus',
            selector: '#custom-input',
            time: now,
        });
    });
});
