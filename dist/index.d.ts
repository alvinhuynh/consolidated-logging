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
    id: string;
}
interface InputFocusLogEvent extends BaseLogEvent {
    type: InputFocusLogEventType;
}
interface InputFocusMetaData {
    type: InputFocusLogEventType;
    id: string;
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
    sendLogEvent(event: LogEvent): void;
    setupLogEvent(event: EventMetaData): void;
    setupInputChangeLogEvent(inputChangeMetaData: InputChangeMetaData): void;
    setupInputFocusEvent(inputFocusMetaData: InputFocusMetaData): void;
    setupNavigateLogEvent(): void;
}
export default ConsolidatedLogger;
