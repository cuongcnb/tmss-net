import { PermissionCheckerService } from '@abp/auth/permission-checker.service';
import { Injector, ElementRef, Component, OnInit, ViewEncapsulation, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppMenu } from './app-menu';
import { AppNavigationService } from './app-navigation.service';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MenuOptions } from '@metronic/app/core/_base/layout/directives/menu.directive';
import { StorageKeys } from '@app/core/constains/storageKeys';
import { FormStoringService } from '@app/shared/common-service/form-storing.service';
import { AppMenuItem } from './app-menu-item';
import { EventBusService } from '@app/shared/common-service/event-bus.service';
import { TMSSTabs } from '@app/core/constains/tabs';

@Component({
    templateUrl: './side-bar-menu.component.html',
    selector: 'side-bar-menu',
    encapsulation: ViewEncapsulation.None
})
export class SideBarMenuComponent extends AppComponentBase implements OnInit, AfterViewInit {

    menu: AppMenu = null;

    currentRouteUrl = '';
    insideTm: any;
    outsideTm: any;

    currentUser: any;
    menuList: any[];

    allTabs: Array<string>;
    functionsNeedFilterFirst: Array<any> = [];
    functionsModal: Array<any> = [];

    menuOptions: MenuOptions = {
        // vertical scroll
        scroll: null,

        // submenu setup
        submenu: {
            desktop: {
                default: 'dropdown',
                state: {
                    body: 'kt-aside--minimize',
                    mode: 'dropdown'
                }
            },
            tablet: 'accordion', // menu set to accordion in tablet mode
            mobile: 'accordion' // menu set to accordion in mobile mode
        },

        // accordion setup
        accordion: {
            expandAll: false // allow having multiple expanded accordions in the menu
        }
    };

    constructor(
        injector: Injector,
        private el: ElementRef,
        private router: Router,
        public permission: PermissionCheckerService,
        private _appNavigationService: AppNavigationService,
        @Inject(DOCUMENT) private document: Document,
        private render: Renderer2,
        private eventBus: EventBusService,
        private formStoringService: FormStoringService) {
        super(injector);
    }

    ngOnInit() {
        this.currentUser = this.formStoringService.get(StorageKeys.currentUser);
        this.menuList = this.currentUser.menuList.filter(it => it.code.indexOf('Warrantly') < 0);

        // this.menu = this._appNavigationService.getMenu();
        this.menu = new AppMenu('MainMenu', 'MainMenu', this.buildMenuItems(this.menuList));

        // this.currentRouteUrl = this.router.url.split(/[?#]/)[0];

        // this.router.events
        //     .pipe(filter(event => event instanceof NavigationEnd))
        //     .subscribe(event => this.currentRouteUrl = this.router.url.split(/[?#]/)[0]);

        this.allTabs = Object.values(TMSSTabs);

        this.functionsNeedFilterFirst = [
            TMSSTabs.dlrUnclaimOrder,
            TMSSTabs.progressTrackingTable,
            TMSSTabs.progressReport,
            TMSSTabs.carOutPortGeneralReport,
            TMSSTabs.partImportExportHistoryReport,
            TMSSTabs.partImportExportReport,
            TMSSTabs.partAmountAdjustmentReport,
            TMSSTabs.partSupplyRateByPartCodeReport,
            TMSSTabs.partsSupplyRatioReport,
            TMSSTabs.reportReceive,
            TMSSTabs.receiveReport,
            TMSSTabs.roGeneralByDayReport,
            TMSSTabs.partsCheckInventoryReport,
            TMSSTabs.accessoryInventoryCheckReport,
            TMSSTabs.outputReport,
            TMSSTabs.accessorySellingReport,
            TMSSTabs.retailSalesReport,
            TMSSTabs.oweTmvReport,
            TMSSTabs.decentralizedInspectionAgentQuality,
            TMSSTabs.serviceRateAndRoFillReport,
            TMSSTabs.partRetailGeneralReport,
            TMSSTabs.roListWithFullPart,
            TMSSTabs.roUnfinishedReport,
            TMSSTabs.timeStoreBo,
            TMSSTabs.orderOfDlrToTmv,
            TMSSTabs.listRoPartBoNotEnough,
            TMSSTabs.warrantyDailyClaimReport,
            TMSSTabs.isLaborWages,
            TMSSTabs.isLaborWagesNation,
            TMSSTabs.islistDealCar,
            TMSSTabs.importDataSurvey,
            TMSSTabs.vehicleSummaryReport,
            TMSSTabs.appointmentReport,
            TMSSTabs.reportSpecialCases,
            TMSSTabs.contractManagement, TMSSTabs.vehicleArrival, TMSSTabs.cbuVehicleInfo, TMSSTabs.ckdVehicleInfo,
            TMSSTabs.reportSpecialCases, TMSSTabs.reportWrongDeliveryDate, TMSSTabs.reportNotHaveDeliveryDate, TMSSTabs.changeDelivery,
            TMSSTabs.importDataSurvey,
            TMSSTabs.vehicleSummaryReport,
            TMSSTabs.userListFunctionReport
        ];
        this.functionsModal = [
            { code: TMSSTabs.dlrUnclaimOrder, modal: 'dlrUnclaimOrderModal' },
            { code: TMSSTabs.carOutPortGeneralReport, modal: 'inOutGateReport' },
            { code: TMSSTabs.warrantyDailyClaimReport, modal: 'warrantyDailyClaimReport' },
            { code: TMSSTabs.userListFunctionReport, modal: 'userListFunctionReport' },
            { code: TMSSTabs.isLaborWages, modal: 'isLaborWages' },
            { code: TMSSTabs.isLaborWagesNation, modal: 'isLaborWagesNation' },
            { code: TMSSTabs.progressTrackingTable, modal: 'progressChoosingModal' },
            { code: TMSSTabs.progressReport, modal: 'progressReport' },
            { code: TMSSTabs.islistDealCar, modal: 'islistDealCar' },
            { code: TMSSTabs.importDataSurvey, modal: 'importDataSurvey' },
            { code: TMSSTabs.partImportExportHistoryReport, modal: 'partImportExportHistoryReport' },
            { code: TMSSTabs.partImportExportReport, modal: 'partImportExportReport' },
            { code: TMSSTabs.partAmountAdjustmentReport, modal: 'partAmountAdjustmentReport' },
            { code: TMSSTabs.partSupplyRateByPartCodeReport, modal: 'partSupplyRateByPartCodeReport' },
            { code: TMSSTabs.partsCheckInventoryReport, modal: 'partsCheckInventoryReport' },
            { code: TMSSTabs.partsSupplyRatioReport, modal: 'partsSupplyRatioReport' },
            { code: TMSSTabs.accessoryInventoryCheckReport, modal: 'accessoryInventoryCheckReport' },
            { code: TMSSTabs.outputReport, modal: 'outputReport' },
            { code: TMSSTabs.accessorySellingReport, modal: 'accessorySellingReport' },
            { code: TMSSTabs.retailSalesReport, modal: 'retailSalesReport' },
            { code: TMSSTabs.reportReceive, modal: 'reportReceive' },
            { code: TMSSTabs.roGeneralByDayReport, modal: 'roGeneralByDayReport' },
            { code: TMSSTabs.oweTmvReport, modal: 'oweTmvReport' },
            { code: TMSSTabs.decentralizedInspectionAgentQuality, modal: 'decentralizedInspectionAgentQuality' },
            { code: TMSSTabs.serviceRateAndRoFillReport, modal: 'serviceRateAndRoFillReport' },
            { code: TMSSTabs.partRetailGeneralReport, modal: 'partRetailGeneralReport' },
            { code: TMSSTabs.roUnfinishedReport, modal: 'roUnfinishedReport' },
            { code: TMSSTabs.roListWithFullPart, modal: 'roListWithFullPart' },
            { code: TMSSTabs.timeStoreBo, modal: 'timeStoreBo' },
            { code: TMSSTabs.orderOfDlrToTmv, modal: 'orderOfDlrToTmv' },
            { code: TMSSTabs.listRoPartBoNotEnough, modal: 'listRoPartBoNotEnough' },
            { code: TMSSTabs.vehicleSummaryReport, modal: 'vehicleSummaryReport' },
            { code: TMSSTabs.appointmentReport, modal: 'appointmentReport' },
            {
                code: TMSSTabs.contractManagement,
                modal: 'contractFilterStartModal'
            }, {
                code: TMSSTabs.vehicleArrival,
                modal: 'vehicleArrivalFilterModal'
            }, {
                code: TMSSTabs.cbuVehicleInfo,
                modal: 'cbuFilterStartModal'
            }, {
                code: TMSSTabs.ckdVehicleInfo,
                modal: 'ckdFilterStartModal'
            }, {
                code: TMSSTabs.changeDelivery,
                modal: 'deliveryFilterStartModal'
            }, {
                code: TMSSTabs.reportSpecialCases,
                reportFunction: 'dlrReportSpecialCases',
                modal: 'dlrReport'
            }, {
                code: TMSSTabs.reportWrongDeliveryDate,
                reportFunction: 'reportWrongDeliveryDate',
                modal: 'dlrReport'
            }, {
                code: TMSSTabs.reportNotHaveDeliveryDate,
                reportFunction: 'reportNotHaveDeliveryDate',
                modal: 'dlrReport'
            },
            { code: TMSSTabs.listRoPartBoNotEnough, modal: 'listRoPartBoNotEnough' },
            { code: TMSSTabs.listRoPartBoNotEnough, modal: 'listRoPartBoNotEnough' },
            { code: TMSSTabs.vehicleSummaryReport, modal: 'vehicleSummaryReport' }
        ];
    }

    ngAfterViewInit(): void {
        this.scrollToCurrentMenuElement();
    }

    buildMenuItems(functionList) {
        const menuItems: AppMenuItem[] = [];

        functionList.forEach((item) => {
            const menuItem = new AppMenuItem(item.code || item.functionName,
                '',
                '',
                item.code || item.menuCode,
                this.buildMenuItems(item.list || []),
                false,
                item);
            menuItems.push(menuItem);
        });

        return menuItems;
    }

    showMenuItem(menuItem): boolean {
        return this._appNavigationService.showMenuItem(menuItem);
    }

    isMenuItemIsActive(item): boolean {
        if (item.items.length) {
            return this.isMenuRootItemIsActive(item);
        }

        if (!item.route) {
            return false;
        }

        // dashboard
        if (item.route !== '/' && this.currentRouteUrl.startsWith(item.route)) {
            return true;
        }

        return this.currentRouteUrl.replace(/\/$/, '') === item.route.replace(/\/$/, '');
    }

    isMenuRootItemIsActive(item): boolean {
        let result = false;

        for (const subItem of item.items) {
            result = this.isMenuItemIsActive(subItem);
            if (result) {
                return true;
            }
        }

        return false;
    }

    /**
	 * Use for fixed left aside menu, to show menu on mouseenter event.
	 * @param e Event
	 */
    mouseEnter(e: Event) {
        if (!this.currentTheme.baseSettings.menu.allowAsideMinimizing) {
            return;
        }

        // check if the left aside menu is fixed
        if (document.body.classList.contains('kt-aside--fixed')) {
            if (this.outsideTm) {
                clearTimeout(this.outsideTm);
                this.outsideTm = null;
            }

            this.insideTm = setTimeout(() => {
                // if the left aside menu is minimized
                if (document.body.classList.contains('kt-aside--minimize') && KTUtil.isInResponsiveRange('desktop')) {
                    // show the left aside menu
                    this.render.removeClass(document.body, 'kt-aside--minimize');
                    this.render.addClass(document.body, 'kt-aside--minimize-hover');
                }
            }, 50);
        }
    }

    /**
     * Use for fixed left aside menu, to show menu on mouseenter event.
     * @param e Event
     */
    mouseLeave(e: Event) {
        if (!this.currentTheme.baseSettings.menu.allowAsideMinimizing) {
            return;
        }

        if (document.body.classList.contains('kt-aside--fixed')) {
            if (this.insideTm) {
                clearTimeout(this.insideTm);
                this.insideTm = null;
            }

            this.outsideTm = setTimeout(() => {
                // if the left aside menu is expand
                if (document.body.classList.contains('kt-aside--minimize-hover') && KTUtil.isInResponsiveRange('desktop')) {
                    // hide back the left aside menu
                    this.render.removeClass(document.body, 'kt-aside--minimize-hover');
                    this.render.addClass(document.body, 'kt-aside--minimize');
                }
            }, 100);
        }
    }

    scrollToCurrentMenuElement(): void {
        const path = location.pathname;
        const menuItem = document.querySelector('a[href=\'' + path + '\']');
        if (menuItem) {
            menuItem.scrollIntoView({ block: 'center' });
        }
    }

    openComponent(event, item: AppMenuItem) {
        const functionCode = item.parameters.functionCode;
        if (!functionCode) {
            return;
        }

        event.stopPropagation();

        if (this.allTabs.indexOf(functionCode) < 0) {
            return;
        }
        if (this.functionsNeedFilterFirst.indexOf(functionCode) > -1) {
            const funcSelected = this.functionsModal.find(func => func.code === functionCode);
            // this.openFilterModal.emit({
            //     modal: funcSelected.modal,
            //     reportFunction: funcSelected.reportFunction,
            //     reportType: funcSelected.menuName
            // });
            this.eventBus.emit({
                type: 'openModal',
                funcSelected: funcSelected
            });
            console.log(funcSelected);
        } else if (functionCode === 'SCREEN_WAIT_RECEPTION') {
            window.open('/screen-wait-reception', '_blank');
        } else {
            functionCode === 'PROGRESS_CUSTOMER'
                ? window.open('/progress-customers', '_blank')
                : this.eventBus.emit({
                    type: 'openComponent',
                    functionCode: functionCode
                });
        }
    }
}
