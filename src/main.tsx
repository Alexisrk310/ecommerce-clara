import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

window.onerror = (message, source, lineno, colno, error) => {
  console.error('GLOBAL ERROR:', message, { source, lineno, colno, error });
  const container = document.getElementById('root');
  if (container) {
    container.innerHTML = `<div style="padding: 40px; color: #e11d48; font-family: sans-serif; background: #fff1f2; min-height: 100vh;">
      <h2 style="font-serif">Critical Runtime Error</h2>
      <p style="font-weight: bold;">${message}</p>
      <div style="margin-top: 20px; font-size: 12px; color: #9f1239;">
        <p>Source: ${source}:${lineno}:${colno}</p>
        <pre style="background: white; padding: 20px; border: 1px solid #fda4af; overflow: auto; max-height: 50vh;">${error?.stack || 'No stack trace available'}</pre>
      </div>
      <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #e11d48; color: white; border: none; cursor: pointer;">Reload Application</button>
    </div>`;
  }
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
