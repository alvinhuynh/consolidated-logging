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
declare type LogEvent = InputChangeLogEvent | InputFocusLogEvent | CustomLogEvent | CustomTimeDurationLogEvent;
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
declare class ConsolidatedLogger {
    config: ConsolidatedLoggerConfig;
    alreadyLoggedEvents: Array<LogEvent>;
    currentlyActiveEvents: Array<CustomTimeDurationLogEvent>;
    isOnline: boolean;
    handleConnectionChange(event: Event): void;
    constructor(consolidatedLoggerConfig: ConsolidatedLoggerConfig);
    _sendLogEvent(event: LogEvent): void;
    sendCustomLogEvent(event: CustomMetaData): void;
    startCustomTimeDurationLogEvent(event: CustomMetaData): void;
    stopCustomTimeDurationLogEvent(event: CustomMetaData): void;
    setupInputChangeLogEvent(inputChangeMetaData: InputChangeMetaData): void;
    setupInputFocusEvent(inputFocusMetaData: InputFocusMetaData): void;
}
export default ConsolidatedLogger;
