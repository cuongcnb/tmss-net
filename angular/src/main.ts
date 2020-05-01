import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'moment-timezone';
import 'moment/min/locales.min';
import { environment } from './environments/environment';
import { hmrBootstrap } from './hmr';
import './polyfills.ts';
import { RootModule } from './root.module';
import { LicenseManager } from 'ag-grid-enterprise/main';
import 'hammerjs';

LicenseManager.setLicenseKey('Evaluation_License-_Not_For_Production_Valid_Until_25_August_2019__MTU2NjY4NzYwMDAwMA==d375b77243a314f97ad493a7492af9ea');

if (environment.production) {
    enableProdMode();
}

const bootstrap = () => {
    return platformBrowserDynamic().bootstrapModule(RootModule);
};

/* "Hot Module Replacement" is enabled as described on
 * https://medium.com/@beeman/tutorial-enable-hrm-in-angular-cli-apps-1b0d13b80130#.sa87zkloh
 */

if (environment.hmr) {
    if (module['hot']) {
        hmrBootstrap(module, bootstrap); //HMR enabled bootstrap
    } else {
        console.error('HMR is not enabled for webpack-dev-server!');
        console.log('Are you using the --hmr flag for ng serve?');
    }
} else {
    bootstrap(); //Regular bootstrap
}
