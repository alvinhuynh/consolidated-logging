class ConsolidatedLogger {
    static config = {
        apiHost: 'localhost:8080',
    };

    lastPopStateDocumentLocationTime: number | null = null;
    lastPopStateDocumentLocationPathName: string | null = null;

    sendLogEvent(event: LogEvent) {
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
            this.setupInputChangeLogEvent(event);
        } else if (event.type === 'input-focus') {
            this.setupInputFocusEvent(event);
        } else if (event.type === 'navigate') {
            this.setupNavigateLogEvent();
        }
    }

    setupInputChangeLogEvent(inputChangeMetaData: InputChangeMetaData) {
        const input = document.querySelector(inputChangeMetaData.id);

        input.addEventListener('input', (event: Event) => {
            this.sendLogEvent({
                type: 'input-change',
                time: Date.now(),
            });
        });
    }

    setupInputFocusEvent(inputFocusMetaData: InputFocusMetaData) {
        const input = document.querySelector(inputFocusMetaData.id);

        input.addEventListener('focus', (event: Event) => {
            this.sendLogEvent({
                type: 'input-change',
                time: Date.now(),
            });
        });

        input.addEventListener('blur', (event: Event) => {
            this.sendLogEvent({
                type: 'input-change',
                time: Date.now(),
            });
        });
    }

    setupNavigateLogEvent() {
        window.onpopstate = (event: PopStateEvent) => {
            if (!this.lastPopStateDocumentLocationTime) {
                this.lastPopStateDocumentLocationTime = Date.now();
                this.lastPopStateDocumentLocationPathName =
                    document.location.pathname;
            } else {
                this.sendLogEvent({
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

export default new ConsolidatedLogger();
