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

type LogEvent = InputChangeLogEvent | InputFocusLogEvent | CustomLogEvent;

type EventMetaData = InputChangeMetaData | InputFocusMetaData;

interface CustomLogEvent {
    type: CustomLogEventType;
    start?: number;
    end?: number;
}

class ConsolidatedLogger {
    static config = {
        apiHost: 'https://localhost:8080',
    };

    eventCache: Record<CustomLogEventType, CustomLogEvent> = {};

    _sendLogEvent(event: LogEvent) {
        fetch(ConsolidatedLogger.config.apiHost, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });
    }

    startCustomLogEvent(event: CustomMetaData) {
        this.eventCache[event.type] = {
            type: event.type,
            start: Date.now(),
        };
    }

    stopCustomLogEvent(event: CustomMetaData) {
        const customEvent = this.eventCache[event.type];
        customEvent.end = Date.now();
        this._sendLogEvent(customEvent);
    }

    setupLogEvent(event: EventMetaData) {
        if (event.type === 'input-change') {
            this._setupInputChangeLogEvent(event);
        } else if (event.type === 'input-focus') {
            this._setupInputFocusEvent(event);
        }
    }

    _setupInputChangeLogEvent(inputChangeMetaData: InputChangeMetaData) {
        const input = document.querySelector(inputChangeMetaData.selector);

        input.addEventListener('input', (event: Event) => {
            this._sendLogEvent({
                type: 'input-change',
                time: Date.now(),
                selector: inputChangeMetaData.selector,
            });
        });
    }

    _setupInputFocusEvent(inputFocusMetaData: InputFocusMetaData) {
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

export default new ConsolidatedLogger();
