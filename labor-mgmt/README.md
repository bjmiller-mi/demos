## Labor Mgmt Demo

### Key Notes
- The timeclock punch uses SQL OUTPUT to capture the events. Used instead of a
  trigger since the trigger could also pick up name edits or other changes
  should the functionality be expanded.
- Timeclock React component updates the cache directly on success, rather than
  invalidating and refetching, keeping the list in sync without an extra round
  trip.
- Manage Vacation React component uses the hook to compose the data from
  multiple endpoints for the datagrid


### How to Run
From bash:

```
% docker compose up --build
```

In the browser, go to `http://localhost:5173`.
