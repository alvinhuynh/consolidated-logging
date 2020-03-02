declare type InputChangeLogEventType = 'input-change';
declare type InputFocusLogEventType = 'input-focus';
declare type CustomLogEventType = string;
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
declare type LogEvent = InputChangeLogEvent | InputFocusLogEvent | CustomLogEvent;
declare type EventMetaData = InputChangeMetaData | InputFocusMetaData;
interface CustomLogEvent {
    type: CustomLogEventType;
    start?: number;
    end?: number;
}
declare class ConsolidatedLogger {
    static config: {
        apiHost: string;
    };
    eventCache: Record<CustomLogEventType, CustomLogEvent>;
    _sendLogEvent(event: LogEvent): void;
    startCustomLogEvent(event: CustomMetaData): void;
    stopCustomLogEvent(event: CustomMetaData): void;
    setupLogEvent(event: EventMetaData): void;
    _setupInputChangeLogEvent(inputChangeMetaData: InputChangeMetaData): void;
    _setupInputFocusEvent(inputFocusMetaData: InputFocusMetaData): void;
}
declare const _default: ConsolidatedLogger;
export default _default;
