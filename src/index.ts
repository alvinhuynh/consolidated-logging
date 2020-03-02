type InputChangeLogEventType = 'input-change';
type InputFocusLogEventType = 'input-focus';
type CustomLogEventType = string;

type LogEventData = Object;

interface BaseLogEvent {
    time?: number;
    start?: number;
    end?: number;
    data?: LogEventData;
}

interface BaseMetaData {
    data?: LogEventData;
}

interface InputMetaData extends BaseMetaData {
    selector: string;
}

interface InputChangeLogEvent extends BaseLogEvent {
    type: InputChangeLogEventType;
    selector: string;
}

interface InputChangeMetaData extends InputMetaData {}

interface InputFocusLogEvent extends BaseLogEvent {
    type: InputFocusLogEventType;
    selector: string;
}

interface InputFocusMetaData extends InputMetaData {}

interface CustomMetaData extends BaseMetaData {
    type: CustomLogEventType;
}

type LogEvent =
    | InputChangeLogEvent
    | InputFocusLogEvent
    | CustomLogEvent
    | CustomTimeDurationLogEvent;

interface CustomLogEvent extends BaseLogEvent {
    type: CustomLogEventType;
}

interface CustomTimeDurationLogEvent extends BaseLogEvent {
    type: CustomLogEventType;
}

interface ConsolidatedLoggerConfig {
    apiHost?: string;
}

class ConsolidatedLogger {
    config: ConsolidatedLoggerConfig = {
        apiHost: 'https://localhost:8080',
    };

    alreadyLoggedEvents: Array<LogEvent> = [];
    currentlyActiveEvents: Array<CustomTimeDurationLogEvent> = [];
    isOnline = true;

    handleConnectionChange(event: Event) {
        if (event.type === 'online') {
            this.isOnline = true;
            const numberOfalreadyLoggedEvents = this.alreadyLoggedEvents.length;

            for (let i = 0; i < numberOfalreadyLoggedEvents; i++) {
                const logEvent = this.alreadyLoggedEvents.pop();
                this._sendLogEvent(logEvent);
            }
        } else if (event.type === 'offline') {
            this.isOnline = false;
        }
    }

    constructor(consolidatedLoggerConfig: ConsolidatedLoggerConfig) {
        this.config = {
            ...this.config,
            ...consolidatedLoggerConfig,
        };

        window.addEventListener('online', this.handleConnectionChange);
        window.addEventListener('offline', this.handleConnectionChange);
    }

    _sendLogEvent(event: LogEvent) {
        if (this.isOnline) {
            fetch(this.config.apiHost, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
            });
        } else {
            this.alreadyLoggedEvents.push(event);
        }
    }

    sendCustomLogEvent(event: CustomMetaData) {
        this._sendLogEvent({
            ...event,
            time: Date.now(),
        });
    }

    startCustomTimeDurationLogEvent(event: CustomMetaData) {
        this.currentlyActiveEvents.push({
            ...event,
            start: Date.now(),
        });
    }

    stopCustomTimeDurationLogEvent(event: CustomMetaData) {
        const customEventIndex = this.currentlyActiveEvents.findIndex(
            (currentlyActiveEvent: CustomTimeDurationLogEvent) =>
                currentlyActiveEvent.type === event.type
        );

        const customEvent = this.currentlyActiveEvents[customEventIndex];

        if (customEvent) {
            customEvent.end = Date.now();
            this._sendLogEvent(customEvent);
            this.currentlyActiveEvents.splice(customEventIndex, 1);
        }
    }

    setupInputChangeLogEvent(inputChangeMetaData: InputChangeMetaData) {
        const input = document.querySelector(inputChangeMetaData.selector);

        input.addEventListener('input', () => {
            this._sendLogEvent({
                ...inputChangeMetaData,
                type: 'input-change',
                time: Date.now(),
            });
        });
    }

    setupInputFocusEvent(inputFocusMetaData: InputFocusMetaData) {
        const input = document.querySelector(inputFocusMetaData.selector);
        let hasFocused = false;

        input.addEventListener('focus', () => {
            hasFocused = true;
        });

        input.addEventListener('blur', () => {
            if (hasFocused) {
                this._sendLogEvent({
                    ...inputFocusMetaData,
                    type: 'input-focus',
                    time: Date.now(),
                });
                hasFocused = false;
            }
        });
    }
}

export default ConsolidatedLogger;
