# Migration Audit

This document compares the current React Native implementation inside `/app` and `/components` with the original `base44_original` export located under `base44_original/src`.

## Missing or Partial Features

### Pages
- **Home/index**: new implementation lacks automatic redirect to active events and does not check for expired events the way the original `Home.jsx` did.
- **Discovery**: the original page implements filtering, likes and detailed profile modals. The current `Discovery.tsx` only shows mocked profiles and is missing the guide modal, filters and like logic.
- **Layout**: the web version (`Layout.jsx`) handled notifications, feedback surveys and navigation. The mobile repo contains `LayoutScreen.tsx` but it is unused in routing.
- **Matches**: mostly ported but session values were read from global variables which were never set. Unread message polling and notification updates were partially implemented.
- **ChatModal**: behaviour mostly matches the original but also relied on global session values.

### Components
Most original components exist as TypeScript counterparts. However many (e.g. `ProfileDetailModal`, `FirstTimeGuideModal`, `QRScanner` etc.) are not referenced anywhere in `/app` yet.

### Admin
The admin dashboard is present but simplified. Analytics, feedback and event modals exist but the web entry (`index.web.tsx`) only renders a placeholder `AdminApp`.

## Critical Issues
- **Session Handling**: `ChatModal` and `Matches` expected `global.session_id` and `global.event_id`, causing runtime errors. These are now loaded from `AsyncStorage` via a new `utils/session.ts` helper.
- **Feature Parity**: Discovery and Layout pages lack the extensive logic from the original export, resulting in reduced user experience (no filtering or onboarding guide, no toasts, no feedback modal triggers).
- **Unused Components**: Several UI components are unused in the mobile app which suggests features like profile detail viewing or QR scanning are still missing.

## Recommended Next Steps
1. Integrate `LayoutScreen` with the Expo Router `_layout.tsx` and migrate the notification logic from the original `Layout.jsx`.
2. Port the filtering and like flow from `Discovery.jsx` and include the missing modals (`ProfileDetailModal`, `FirstTimeGuideModal`, `ProfileFilters`).
3. Hook up the admin components to real routes in the web entry and implement downloads/analytics similar to the original `admin.jsx`.

