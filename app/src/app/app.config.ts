import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor-v2';

import { routes } from './app.routes';
import { Auth } from './core/auth';
import { UserDb } from './core/user-db';
import { DbUserService } from '../services/dbUserService';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: NGX_MONACO_EDITOR_CONFIG,
      useValue: {
        baseUrl: 'assets/monaco',
        defaultOptions: {
          scrollBeyondLastLine: false,
          fontSize: 14,
          minimap: { enabled: false },
        },
      },
    },
    Auth,
    UserDb,
    DbUserService,
  ],
};
