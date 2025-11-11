import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import React from 'react'
import AppWithProviders from './Providers'
const rootElement = document.getElementById('root')!;
import {HeroUIProvider} from "@heroui/react";
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <HeroUIProvider>
  <BrowserRouter>
      <AppWithProviders />
    </BrowserRouter>
    </HeroUIProvider>
  
  </StrictMode>
);