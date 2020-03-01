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

type LogEvent = InputChangeLogEvent | InputFocusLogEvent | NavigateLogEvent;

type EventMetaData =
    | InputChangeMetaData
    | InputFocusMetaData
    | NavigateMetaData;
