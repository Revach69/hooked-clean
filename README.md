# Hooked Mobile & Admin App

This repository contains a cross‑platform application built with **Expo**, **React Native** and **expo-router**. It communicates with the [Base44](https://base44.co) API and also includes a simple web admin panel.

## Project Structure

```
app/           Mobile screens handled by expo-router
components/    Reusable UI components and admin modals
api/           Base44 SDK wrappers and helpers
hooks/         Custom hooks (color scheme, theming)
lib/, utils/   Shared utilities
index.web.tsx  Entry for the web admin panel
```

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the Expo development server

   ```bash
   npm run start
   ```

3. Optional platform shortcuts

   ```bash
   npm run android   # run on Android device or emulator
   npm run ios       # run on iOS device or simulator
   npm run web       # run the admin panel in the browser
   ```

## Building

Use the standard Expo build or EAS workflow for producing production binaries or a static web build.

## Support

For help with the Base44 SDK or the application templates please contact [app@base44.com](mailto:app@base44.com).
