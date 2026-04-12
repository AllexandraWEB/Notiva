import { DOCUMENT } from '@angular/common';
import { mergeApplicationConfig, ApplicationConfig, inject } from '@angular/core';
import { WA_WINDOW } from '@ng-web-apis/common';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    {
      provide: WA_WINDOW,
      useFactory: (): Window => {
        const document = inject(DOCUMENT);
        const windowRef = (document.defaultView ?? globalThis) as Window & typeof globalThis;

        if (typeof windowRef.requestAnimationFrame !== 'function') {
          windowRef.requestAnimationFrame = ((callback: (time: number) => void): number => {
            return setTimeout(() => callback(Date.now()), 16) as unknown as number;
          }) as typeof windowRef.requestAnimationFrame;
        }

        if (typeof windowRef.cancelAnimationFrame !== 'function') {
          windowRef.cancelAnimationFrame = ((handle: number): void => {
            clearTimeout(handle as unknown as ReturnType<typeof setTimeout>);
          }) as typeof windowRef.cancelAnimationFrame;
        }

        return windowRef;
      },
    },
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
