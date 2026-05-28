import 'zone.js';

import { bootstrapApplication } from '@angular/platform-browser';

import {
  provideRouter,
  withInMemoryScrolling
} from '@angular/router';

import { provideZoneChangeDetection } from '@angular/core';

import { routes } from './app/app.routes';

import { App } from './app/app';

console.log("MAIN TS CARGANDO");

bootstrapApplication(App, {

  providers: [

    provideZoneChangeDetection({
      eventCoalescing: true
    }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      })
    )
  ]
})
.catch((err) => console.error(err));