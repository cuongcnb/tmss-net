import {NgModule} from '@angular/core';

import {HomeComponent} from './home.component';
import {HomeRoutingModule} from './home-routing.module';
import {SharedModule} from '../shared/shared.module';
import {ServicesReportModule} from '../application/services-report/services-report.module';
import {QueuingSystemModule} from '../application/queuing-system/queuing-system.module';
import {KeyboardShortcutsModule} from 'ng-keyboard-shortcuts';

@NgModule({
  imports: [
    SharedModule,
    HomeRoutingModule,
    ServicesReportModule,
    QueuingSystemModule,
    KeyboardShortcutsModule
  ],
  declarations: [
    HomeComponent
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule {
}
