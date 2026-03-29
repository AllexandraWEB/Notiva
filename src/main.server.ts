import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

// Node SSR does not provide browser animation frame APIs.
// if (typeof globalThis.requestAnimationFrame !== 'function') {
//     globalThis.requestAnimationFrame = (callback: FrameRequestCallback): number => {
//         return setTimeout(() => callback(Date.now()), 16) as unknown as number;
//     };
// }

// if (typeof globalThis.cancelAnimationFrame !== 'function') {
//     globalThis.cancelAnimationFrame = (handle: number): void => {
//         clearTimeout(handle as unknown as ReturnType<typeof setTimeout>);
//     };
// }

const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(App, config, context);

export default bootstrap;
