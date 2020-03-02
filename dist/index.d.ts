declare type InputChangeLogEventType = 'input-change';
declare type InputFocusLogEventType = 'input-focus';
declare type CustomLogEventType = string;
declare type LogEventData = Object;
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
interface InputChangeMetaData extends InputMetaData {
}
interface InputFocusLogEvent extends BaseLogEvent {
    type: InputFocusLogEventType;
    selector: string;
}
interface InputFocusMetaData extends InputMetaData {
}
interface CustomMetaData extends BaseMetaData {
    type: CustomLogEventType;
}
declare type LogEvent = InputChangeLogEvent | InputFocusLogEvent | CustomLogEvent | CustomTimeDurationLogEvent;
interface CustomLogEvent extends BaseLogEvent {
    type: CustomLogEventType;
}
interface CustomTimeDurationLogEvent extends BaseLogEvent {
    type: CustomLogEventType;
}
interface ConsolidatedLoggerConfig {
    apiHost?: string;
}
declare class ConsolidatedLogger {
    config: ConsolidatedLoggerConfig;
    alreadyLoggedEvents: Array<LogEvent>;
    currentlyActiveEvents: Array<CustomTimeDurationLogEvent>;
    handleConnectionChange: (event: Event) => void;
    constructor(consolidatedLoggerConfig: ConsolidatedLoggerConfig);
    _sendLogEvent(event: LogEvent): void;
    sendCustomLogEvent(event: CustomMetaData): void;
    startCustomTimeDurationLogEvent(event: CustomMetaData): void;
    stopCustomTimeDurationLogEvent(event: CustomMetaData): void;
    setupInputChangeLogEvent(inputChangeMetaData: InputChangeMetaData): void;
    setupInputFocusEvent(inputFocusMetaData: InputFocusMetaData): void;
}
export default ConsolidatedLogger;
