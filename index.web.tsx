// index.web.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import AdminApp from './components/admin/AdminApp';

const rootEl = document.getElementById('root');

if (rootEl) {
  createRoot(rootEl).render(<AdminApp />);
}
