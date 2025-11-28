import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { API } from './api';

// Ensure we request a CSRF token from the backend on app start so the
// `csrftoken` cookie is set. The API axios instance in `src/api/index.js`
// will read the cookie and add the X-CSRFToken header for unsafe requests.
async function init() {
  try {
    const apiRoot = (process.env.REACT_APP_API_URL || 'http://localhost:8000').replace(/\/$/, '');
    // GET CSRF token endpoint. We parse the JSON response and set the axios
    // instance default header `X-CSRFToken` to be robust in dev when cookies
    // may not be available to document.cookie reliably.
    const resp = await fetch(`${apiRoot}/api/auth/csrf/`, { method: 'GET', credentials: 'include' });
    try {
      const data = await resp.json();
      if (data && data.csrfToken) {
        // Set the axios instance header so subsequent axios requests include
        // the CSRF token even if the cookie isn't visible via document.cookie.
        API.defaults.headers['X-CSRFToken'] = data.csrfToken;
      }
    } catch (e) {
      // If parsing fails, ignore — the axios interceptor will still try to
      // read the cookie. We don't block rendering for CSRF fetch failures.
    }
  } catch (err) {
    // Don't block render on CSRF fetch failure; log for debugging.
    // Subsequent calls will fail until a valid CSRF cookie is present.
    // eslint-disable-next-line no-console
    console.warn('Failed to fetch CSRF token on init:', err);
  }

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
}

init();
