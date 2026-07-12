import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import DesignerApp from './DesignerApp.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DesignerApp />
  </StrictMode>,
);
