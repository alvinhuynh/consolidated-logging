type InputChangeLogEventType = 'input-change';
type InputFocusLogEventType = 'input-focus';
type CustomLogEventType = string;

interface BaseLogEvent {
    time: number;
}

interface InputChangeLogEvent extends BaseLogEvent {
    type: InputChangeLogEventType;
    selector: string;
}

interface InputChangeMetaData {
    type: InputChangeLogEventType;
    selector: string;
}

interface InputFocusLogEvent extends BaseLogEvent {
    type: InputFocusLogEventType;
    selector: string;
}

interface InputFocusMetaData {
    type: InputFocusLogEventType;
    selector: string;
}

interface CustomMetaData {
    type: CustomLogEventType;
}

type LogEvent =
    | InputChangeLogEvent
    | InputFocusLogEvent
    | CustomLogEvent
    | CustomTimeDurationLogEvent;

interface CustomLogEvent {
    type: CustomLogEventType;
    time: number;
}

interface CustomTimeDurationLogEvent {
    type: CustomLogEventType;
    start: number;
    end?: number;
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
            type: event.type,
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

        input.addEventListener('input', (event: Event) => {
            this._sendLogEvent({
                type: 'input-change',
                time: Date.now(),
                selector: inputChangeMetaData.selector,
            });
        });
    }

    setupInputFocusEvent(inputFocusMetaData: InputFocusMetaData) {
        const input = document.querySelector(inputFocusMetaData.selector);
        let hasFocused = false;

        input.addEventListener('focus', (event: Event) => {
            hasFocused = true;
        });

        input.addEventListener('blur', (event: Event) => {
            if (hasFocused) {
                this._sendLogEvent({
                    type: 'input-focus',
                    time: Date.now(),
                    selector: inputFocusMetaData.selector,
                });
                hasFocused = false;
            }
        });
    }
}

export default ConsolidatedLogger;
