import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx'
import "./main.css";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/astroWrap/">
      <MantineProvider>
        <ModalsProvider>
          <App />
        </ModalsProvider>
      </MantineProvider>
    </BrowserRouter>
  </StrictMode>,
)
