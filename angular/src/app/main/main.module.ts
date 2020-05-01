import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { CountoModule } from 'angular2-counto';
import { ModalModule, TabsModule, TooltipModule, BsDropdownModule, PopoverModule } from 'ngx-bootstrap';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainRoutingModule } from './main-routing.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { BsDatepickerModule, BsDatepickerConfig, BsDaterangepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxBootstrapDatePickerConfigService } from 'assets/ngx-bootstrap/ngx-bootstrap-datepicker-config.service';
import { SharedModule } from '@app/shared/shared.module';
import { ServicesReportModule } from '@app/application/services-report/services-report.module';
import { QueuingSystemModule } from '@app/application/queuing-system/queuing-system.module';
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';

NgxBootstrapDatePickerConfigService.registerNgxBootstrapDatePickerLocales();

@NgModule({
    imports: [
        // CommonModule,
        // FormsModule,
        // ModalModule,
        // TabsModule,
        // TooltipModule,
        // AppCommonModule,
        // UtilsModule,
        // MainRoutingModule,
        // CountoModule,
        // NgxChartsModule,
        // BsDatepickerModule.forRoot(),
        // BsDropdownModule.forRoot(),
        // PopoverModule.forRoot()
        SharedModule,
        MainRoutingModule,
        ServicesReportModule,
        QueuingSystemModule,
        KeyboardShortcutsModule
    ],
    declarations: [
        DashboardComponent
    ],
    providers: [
        // { provide: BsDatepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerConfig },
        // { provide: BsDaterangepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDaterangepickerConfig },
        // { provide: BsLocaleService, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerLocale }
    ]
})
export class MainModule { }
