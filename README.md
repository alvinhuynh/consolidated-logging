# consolidated-logging

Installation
```
npm install consolidated-logging
```

Usage

```
import ConsolidatedLogger from 'consolidated-logging';

const consolidatedLogger = new ConsolidatedLogger({
    apiHost: 'http://apihost.com',
});

```

API
````

Tracking one time custom events:

sendCustomLogEvent({ type, data })


Tracking the duration of time an active event spanned.

startCustomTimeDurationLogEvent({ type, data })
stopCustomTimeDurationLogEvent({ type, data })


Built-in supported events:

Each time the value of the input field changes:
setupInputChangeLogEvent({ selector, data })

The amount of time the user is focused on a given input field:
setupInputFocusEvent({ selector, data })
````

Other considerations:

All events are fired assuming that the user is online and connected to the internet. In the event,
that this is not the case, then the events are persisted locally until the user comes back online.

