type InputChangeLogEventType = 'input-change';
type InputFocusLogEventType = 'input-focus';
type NavigateLogEventType = 'navigate';

interface BaseLogEvent {
    time: number;
}

interface InputChangeLogEvent extends BaseLogEvent {
    type: InputChangeLogEventType;
}

interface InputChangeMetaData {
    type: InputChangeLogEventType;
    selector: string;
}

interface InputFocusLogEvent extends BaseLogEvent {
    type: InputFocusLogEventType;
}

interface InputFocusMetaData {
    type: InputFocusLogEventType;
    selector: string;
}

interface NavigateLogEvent extends BaseLogEvent {
    type: NavigateLogEventType;
    path: string;
}

interface NavigateMetaData {
    type: NavigateLogEventType;
}

type LogEvent = InputChangeLogEvent | InputFocusLogEvent | NavigateLogEvent;

type EventMetaData =
    | InputChangeMetaData
    | InputFocusMetaData
    | NavigateMetaData;

class ConsolidatedLogger {
    static config = {
        apiHost: 'https://localhost:8080',
    };
    lastPopStateDocumentLocationTime: number | null = null;
    lastPopStateDocumentLocationPathName: string | null = null;

    _sendLogEvent(event: LogEvent) {
        fetch(ConsolidatedLogger.config.apiHost, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });
    }

    setupLogEvent(event: EventMetaData) {
        if (event.type === 'input-change') {
            this._setupInputChangeLogEvent(event);
        } else if (event.type === 'input-focus') {
            this._setupInputFocusEvent(event);
        } else if (event.type === 'navigate') {
            this._setupNavigateLogEvent();
        }
    }

    _setupInputChangeLogEvent(inputChangeMetaData: InputChangeMetaData) {
        const input = document.querySelector(inputChangeMetaData.selector);

        input.addEventListener('input', (event: Event) => {
            this._sendLogEvent({
                type: 'input-change',
                time: Date.now(),
            });
        });
    }

    _setupInputFocusEvent(inputFocusMetaData: InputFocusMetaData) {
        const input = document.querySelector(inputFocusMetaData.selector);
        let hasFocused = false;

        input.addEventListener('focus', (event: Event) => {
            hasFocused = true;
            this._sendLogEvent({
                type: 'input-focus',
                time: Date.now(),
            });
        });

        input.addEventListener('blur', (event: Event) => {
            if (hasFocused) {
                this._sendLogEvent({
                    type: 'input-focus',
                    time: Date.now(),
                });
                hasFocused = false;
            }
        });
    }

    _setupNavigateLogEvent() {
        window.onpopstate = (event: PopStateEvent) => {
            if (!this.lastPopStateDocumentLocationTime) {
                this.lastPopStateDocumentLocationTime = Date.now();
                this.lastPopStateDocumentLocationPathName =
                    document.location.pathname;
            } else {
                this._sendLogEvent({
                    type: 'navigate',
                    time: Date.now() - this.lastPopStateDocumentLocationTime,
                    path: this.lastPopStateDocumentLocationPathName,
                });

                this.lastPopStateDocumentLocationTime = null;
                this.lastPopStateDocumentLocationPathName = null;
            }
        };
    }
}

export default ConsolidatedLogger;
