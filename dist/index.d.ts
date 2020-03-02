declare type InputChangeLogEventType = 'input-change';
declare type InputFocusLogEventType = 'input-focus';
declare type NavigateLogEventType = 'navigate';
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
declare type LogEvent = InputChangeLogEvent | InputFocusLogEvent | NavigateLogEvent;
declare type EventMetaData = InputChangeMetaData | InputFocusMetaData | NavigateMetaData;
declare class ConsolidatedLogger {
    static config: {
        apiHost: string;
    };
    lastPopStateDocumentLocationTime: number | null;
    lastPopStateDocumentLocationPathName: string | null;
    _sendLogEvent(event: LogEvent): void;
    setupLogEvent(event: EventMetaData): void;
    _setupInputChangeLogEvent(inputChangeMetaData: InputChangeMetaData): void;
    _setupInputFocusEvent(inputFocusMetaData: InputFocusMetaData): void;
    _setupNavigateLogEvent(): void;
}
export default ConsolidatedLogger;
