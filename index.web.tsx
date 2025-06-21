// index.web.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import AdminApp from './components/admin/AdminApp';

const root = document.getElementById('root');

if (root) {
  ReactDOM.render(<AdminApp />, root);
}
