# Migration Audit

This document compares the current React Native implementation inside `/app` and `/components` with the original `base44_original` export located under `base44_original/src`.

## Missing or Partial Features

### Pages
- **Home/index**: previously lacked logic to verify existing sessions. The screen now checks event dates via the API before redirecting.
- **Discovery**: originally only displayed mocked data. Profiles now load from the backend with like support and the first-time guide and detail modal have been restored. Filtering is still missing.
- **Layout**: notification and feedback logic has been ported and the screen wraps the router so toasts display as on the web version.
- **Matches**: mostly ported but session values were read from global variables which were never set. Unread message polling and notification updates were partially implemented.
- **ChatModal**: behaviour mostly matches the original but also relied on global session values.

### Components
Most original components exist as TypeScript counterparts. However many (e.g. `ProfileDetailModal`, `FirstTimeGuideModal`, `QRScanner` etc.) are not referenced anywhere in `/app` yet.

### Admin
The admin dashboard is present but simplified. Analytics, feedback and event modals exist but the web entry (`index.web.tsx`) only renders a placeholder `AdminApp`.

## Critical Issues
- **Session Handling**: `ChatModal` and `Matches` expected `global.session_id` and `global.event_id`, causing runtime errors. These are now loaded from `AsyncStorage` via a new `utils/session.ts` helper.
- **Feature Parity**: Many flows were incomplete. Layout now polls for notifications and Discovery loads real profiles with matching logic. Filtering still needs work.
- **Unused Components**: Several UI pieces remain unused which suggests features like QR scanning and advanced filters are still missing.

## Recommended Next Steps
1. Finish the filtering UI in Discovery and wire up unused components like `ProfileFilters` and `QRScanner`.
2. Hook up the admin components to real routes in the web entry and implement downloads/analytics similar to the original `admin.jsx`.

