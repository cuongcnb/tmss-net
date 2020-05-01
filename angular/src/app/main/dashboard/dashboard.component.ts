import { Component, Injector, ViewEncapsulation, ChangeDetectorRef, QueryList, ViewChildren, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DashboardCustomizationConst } from '@app/shared/common/customizable-dashboard/DashboardCustomizationConsts';
import { StorageKeys } from '@app/core/constains/storageKeys';
import { FormStoringService } from '@app/shared/common-service/form-storing.service';
import { EventBusService } from '@app/shared/common-service/event-bus.service';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { TMSSTabs } from '@app/core/constains/tabs';
import { FilterFormCode } from '@app/core/constains/filter-form-code';
import { CustomerModel } from '@app/core/models/advisor/customer';
import { ShortcutInput } from 'ng-keyboard-shortcuts';
import { setClickedRow } from '@app/application/advisor/customer-info/proposal/proposal.component';
import { HomeApi } from '@app/api/home.api';
import { GridTableService } from '@app/shared/common-service/grid-table.service';
import { ConfirmService } from '@app/shared/confirmation/confirm.service';
import { remove } from 'lodash';

const tabChangeObserver = new ReplaySubject(1);
const focusedCells: Array<any> = [];

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class DashboardComponent extends AppComponentBase {
    @ViewChildren('dynamic_tab') tabElements: QueryList<any>;
    @ViewChild('receptionist', { static: false }) receptionist;
    @ViewChild('receivingVehicle', { static: false }) receivingVehicle;
    @ViewChild('generalRepairProgress', { static: false }) generalRepairProgress;
    @ViewChild('dongSonProgress', { static: false }) dongSonProgress;
    @ViewChild('dongSonProgressByCar', { static: false }) dongSonProgressByCar;
    @ViewChild('dongSonProgressByWshop', { static: false }) dongSonProgressByWshop;
    @ViewChild('tabCustomerInfo', { static: false }) tabCustomerInfo;
    @ViewChild('carWashProgress', { static: false }) carWashProgress;
    @ViewChild('booking', { static: false }) booking;
    @ViewChild('gateInOut', { static: false }) gateInOut;
    @ViewChild('cashierBlock', { static: false }) cashierBlock;
    @ViewChild('proposal', { static: false }) proposal;
    @ViewChild('tabFocus', { static: false }) tabFocus;

    dashboardName = DashboardCustomizationConst.dashboardNames.defaultTenantDashboard;
    checkRemoveTab = false;
    // proposal: any;
    shortcuts: Array<ShortcutInput> = [];
    fieldGrid;
    // funcInterval;
    selectedData;
    params;
    selectedTab;
    paginationParams;
    data;
    dataTable: Array<any>;
    paginationTotalsData;
    hide;
    tMSSTabs = TMSSTabs;
    tabs: Array<any>;
    activeTabs: Array<any> = [];
    activeTabTypes: Array<any> = [];
    activeTabTypesFromStorage: Array<any> = [];
    isLoadTabsFromStorage: boolean;
    registerNo: string;
    dataProgress: string;
    customerInfo: CustomerModel;
    carInformation;
    orderNo;
    // Part Export
    partExportInitialData: {
        ro: string,
        type: number,
        plate: string,
        searchOnStart: boolean,
    };
    ref: Array<any> = [];

    filterFormCode = FilterFormCode;
    filterStartForm;
    currentUser;
    dataOrderBo;
    canOpenMultipleTabs: Array<string> = [];
    proposalReopenHook = {};
    proposalCloseHook = {};
    selectDataPartsRetail = [];
    lazyLoadTabs = [];
    notService = [];
    currentFilterFormType: string;

    constructor(
        injector: Injector,
        private eventBus: EventBusService,
        private formStoringService: FormStoringService,
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef,
        private homeService: HomeApi,
        private gridTableService: GridTableService,
        private confirmService: ConfirmService,
    ) {
        super(injector);

        this.currentUser = this.formStoringService.get(StorageKeys.currentUser);

        window.addEventListener('storage', (event) => {
            if (event.storageArea === localStorage) {
                const token = localStorage.getItem(StorageKeys.currentUser);
                if (!token) {
                    document.body.classList.add('login');
                    this.router.navigate(['/auth/login']);
                }
            }
        }, false);
    }

    ngOnInit() {
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                tabChangeObserver.next(this.selectedTab);
            }
        });

        this.watchTabChange();
        // những tab có thể bật ra nhiều
        this.canOpenMultipleTabs = [TMSSTabs.proposal];

        this.eventBus.on('clickLogo').subscribe(() => this.showMenu());
        this.checkTabActive();
        this.fieldGrid = [
            { headerName: 'STT', field: 'stt', width: 100 },
            { headerName: 'Số xe', field: 'registerNo' },
            { headerName: 'Họ tên', field: 'empName' },
            { headerName: 'Thời gian tiếp nhận', field: 'startTime' },
            { headerName: 'Cố vấn dịch vụ', field: 'name' }
        ];
        this.initTabs();
        const tabs: Array<any> = this.getDealerTabs(this.formStoringService.get(StorageKeys.activeTabs));
        this.formStoringService.set(StorageKeys.activeTabs, tabs);
        if (tabs) {
            this.isLoadTabsFromStorage = true;
            this.activeTabs = tabs.filter(it => !it.name.includes('Báo giá'));
            this.activeTabTypes = tabs.map(item => item.functionCode);
            if (this.activeTabs.length) {
                if (this.formStoringService.get(StorageKeys.selectedTab) && this.formStoringService.get(StorageKeys.selectedTab).startsWith(TMSSTabs.proposal)) {
                    this.formStoringService.set(StorageKeys.selectedTab, this.activeTabs[this.activeTabs.length - 1].tab);
                }
                this.selectedTab = this.formStoringService.get(StorageKeys.selectedTab);
                this.activeTabTypesFromStorage = [this.selectedTab];
            } else {
                this.showMenu();
            }
        }
        this.currentFilterFormType = this.formStoringService.get(StorageKeys.currentFilterFormType);

        this.eventBus.on('openComponent').subscribe(val => {
            this.onBtnCloseMenu();
            this.selectedTab = val.functionCode;
            this.filterStartForm = (val.value && val.value.form) ? val.value.form : val.value;
            this.currentFilterFormType = (val.value && val.value.type) ? val.value.type : null;
            // this.functionLogApi.addFunctionLog({ funcCode: val.functionCode }).subscribe(res => {

            // });
            this.formStoringService.set(StorageKeys.selectedTab, this.selectedTab);
            const selected = this.tabs.find(item => item.tab === val.functionCode);
            if (this.canOpenMultipleTabs.indexOf(selected.tab) > -1) {
                switch (val.functionCode) {
                    // riêng trường hợp màn hình Báo giá sẽ bật ra nhiều tab
                    case TMSSTabs.proposal:
                        const registerNo = () => {
                            if (!val || !val.customerInfo) {
                                return '';
                            }
                            return !!val.customerInfo.registerNo ? val.customerInfo.registerNo : val.customerInfo.booking.registerno;
                        };
                        const nameProposal = `Báo giá - ${registerNo()}`;
                        const proposal = this.activeTabs.find(it => it.name === nameProposal);
                        if (proposal) {
                            this.selectTab(proposal.tab);
                            return;
                        }
                        const tabName = TMSSTabs.proposal + '-' + registerNo();
                        this.selectedTab = tabName;
                        // currentTab = tabName;
                        this.activeTabs.push({
                            name: nameProposal,
                            tab: tabName,
                            inputs: {
                                carInformation: val.carInformation,
                                customerInfo: val.customerInfo
                            }
                        });
                        this.setKeyboardShortcuts(this.selectedTab);
                        break;
                    default:
                        break;
                }
            } else {
                // currentTab = selected.tab;
                selected.inputs = {};
                switch (selected.tab) {
                    case TMSSTabs.agencyContactQuestions:
                        selected.inputs.isAgencyContactQuestions = true;
                        break;
                    case TMSSTabs.categoryComplainField:
                        selected.inputs.categoryComplainField = 'categoryComplainField';
                        break;
                    case TMSSTabs.categoryComplainProblem:
                        selected.inputs.categoryComplainProblem = 'categoryComplainProblem';
                        break;
                    case TMSSTabs.categoryPhenomenaDamaged:
                        selected.inputs.phenomenaDamaged = true;
                        break;
                    case TMSSTabs.categoryErrorDSO2:
                        selected.inputs.errorDSO2 = true;
                        break;
                    case TMSSTabs.categoryReasonDSO1:
                        selected.inputs.reasonDSO1 = true;
                        break;
                    case TMSSTabs.categoryReasonDSO2:
                        selected.inputs.reasonDSO2 = true;
                        break;
                    case TMSSTabs.categoryCarModel:
                        selected.inputs.carModel = true;
                        break;
                    case TMSSTabs.categorySpecifications:
                        selected.inputs.specifications = true;
                        break;
                    case TMSSTabs.dlrBoPartsExport:
                        if (val.data) {
                            selected.inputs.partExportInitialData = {
                                ro: val.data.repairOrderNo,
                                type: val.data.type ? val.data.type : 0,
                                plate: val.data.plate,
                                searchOnStart: val.data.searchOnStart
                            };
                        }
                        break;
                    case TMSSTabs.dlrRoLackOfParts:
                        selected.inputs.orderNo = this.orderNo;
                        break;
                    case TMSSTabs.dlrPartsReceiveNonToyota:
                        selected.inputs.isDlrPartsReceiveNonToyota = true;
                        break;
                    case TMSSTabs.dlrPartsRetailNewTabOrder:
                        if (val.selectDataPartsRetail) {
                            selected.inputs.selectDataPartsRetail = val.selectDataPartsRetail;
                        }
                        break;
                    case TMSSTabs.generalRepairProgress:
                        if (val.data) {
                            selected.inputs.dataProgress = val.data;
                        }
                        break;
                    case TMSSTabs.booking:
                        if (val.customerInfo) {
                            selected.inputs.customerInfo = val.customerInfo;
                        }
                        break;
                    case TMSSTabs.webSsiSurveyList:
                        selected.inputs.webList = true;
                        break;
                    case TMSSTabs.webSsiSurveyHandle:
                        selected.inputs.webHandle = true;
                        break;
                    case TMSSTabs.webCsiSurveyList:
                        selected.inputs.webCsiList = true;
                        break;
                    case TMSSTabs.webCsiSurveyHandle:
                        selected.inputs.webCsiHandle = true;
                        break;
                    case TMSSTabs.csiSurveyResult:
                        selected.inputs.csiResult = true;
                        break;
                    case TMSSTabs.csiDataList:
                        selected.inputs.dataList = true;
                        break;
                    case TMSSTabs.blackListCsi:
                        selected.inputs.blackList = true;
                        break;
                    case TMSSTabs.manageComplainPotential:
                        selected.inputs.manageComplainPotential = true;
                        break;
                    case TMSSTabs.maintenanceLetter:
                        selected.inputs.letter = true;
                        break;
                    case TMSSTabs.maintenanceCallingNotContact:
                        selected.inputs.isCallingNotContact = true;
                        break;
                    case TMSSTabs.trackCustomerBuyCarNotBack:
                        selected.inputs.isBuyCar = true;
                        break;
                    case TMSSTabs.contactAfterDays15:
                        selected.inputs.isContactAfterDays15 = true;
                        break;
                    case TMSSTabs.contactAfterDays55:
                        selected.inputs.isContactAfterDays55 = true;
                        break;
                    case TMSSTabs.contactMaintenanceRemind:
                        selected.inputs.isContactMaintenanceRemind = true;
                        break;
                    case TMSSTabs.dlrBoPartsRequest:
                        if (val.data) {
                            selected.inputs.data = val.data;
                        }
                        break;
                    case TMSSTabs.customerInfo:
                        if (val.registerNo) {
                            selected.inputs.registerNo = val.registerNo;
                        }
                        break;
                    case TMSSTabs.tmvDayoff:
                        selected.inputs.isTMV = true;
                        break;
                    case TMSSTabs.vehicleArrival:
                    case TMSSTabs.contractManagement:
                    case TMSSTabs.changeDelivery:
                        selected.inputs.currentFilterFormType = this.currentFilterFormType;
                        selected.inputs.filterStartForm = this.filterStartForm;
                        break;
                    case TMSSTabs.cbuVehicleInfo:
                        selected.inputs.isCbu = true;
                        selected.inputs.currentFilterFormType = this.currentFilterFormType;
                        selected.inputs.filterStartForm = this.filterStartForm;
                        selected.inputs.selectedTab = TMSSTabs.cbuVehicleInfo;
                        break;
                    case TMSSTabs.ckdVehicleInfo:
                        selected.inputs.currentFilterFormType = this.currentFilterFormType;
                        selected.inputs.filterStartForm = this.filterStartForm;
                        selected.inputs.selectedTab = TMSSTabs.ckdVehicleInfo;
                        break;

                    default:
                        break;
                }

                this.runCustomFunction(selected.tab);

                const exist = this.activeTabs.find(item => item.tab === selected.tab);
                if (!exist) {
                    this.activeTabs.push(selected);
                    this.activeTabTypes.push(selected.tab);
                    this.activeTabTypesFromStorage.push(selected.tab);
                    this.formStoringService.set(StorageKeys.activeTabs, this.activeTabs);
                    this.setActiveTab(selected.tab, selected.name);
                } else {
                    exist.inputs = selected.inputs;
                }

                if (this.isLoadTabsFromStorage) {
                    const selectedTab = this.activeTabTypesFromStorage.find(item => item === val.functionCode);
                    if (!selectedTab) {
                        this.activeTabTypesFromStorage.push(val.functionCode);
                    }
                }
            }
        });

        this.eventBus.on('openViewProposalComponent').subscribe(val => {
            this.onBtnCloseMenu();
            this.selectedTab = val.functionCode;
            this.formStoringService.set(StorageKeys.selectedTab, this.selectedTab);
            const selected = this.tabs.find(item => item.tab === val.functionCode);
            selected.inputs = {};
            if (val.carInformation) {
                selected.inputs.carInformation = val.carInformation;
            }

            const exist = this.activeTabs.find(item => item.tab === selected.tab);
            if (!exist) {
                this.activeTabs.push(selected);
                this.activeTabTypes.push(selected.tab);
                this.activeTabTypesFromStorage.push(selected.tab);
                this.formStoringService.set(StorageKeys.activeTabs, this.activeTabs);
            } else {
                exist.inputs = selected.inputs;
            }

            if (this.isLoadTabsFromStorage) {
                const selectedTab = this.activeTabTypesFromStorage.find(item => item === val.functionCode);
                if (!selectedTab) {
                    this.activeTabTypesFromStorage.push(val.functionCode);
                }
            }

            this.setKeyboardShortcuts(this.selectedTab);
        });
        this.openLastActiveTab();
    }

    ngAfterViewInit(): void {
        this.setKeyboardShortcuts(this.selectedTab);
        this.changeDetectorRef.detectChanges();
    }

    setKeyboardShortcuts(selectedTab) {
        if (!selectedTab) {
            return;
        }
        if (selectedTab.startsWith(TMSSTabs.proposal)) {
            this.shortcuts = [];
            setClickedRow(null, null, null, true);
            setTimeout(() => {
                const component = this.tabElements.find((e) => e.tab === selectedTab);
                if (component && component.componentRef && component.componentRef.instance && component.componentRef.instance.keyboardShortcuts) {
                    this.shortcuts = [...component.componentRef.instance.keyboardShortcuts];
                }
            });
            return;
        }
        switch (selectedTab) {
            case TMSSTabs.gateInOut:
                this.shortcuts = this.gateInOut ? [...this.gateInOut.keyboardShortcuts] : [];
                break;
            case TMSSTabs.booking:
                this.shortcuts = this.booking ? [...this.booking.keyboardShortcuts] : [];
                break;
            case TMSSTabs.cashier:
                this.shortcuts = this.cashierBlock ? [...this.cashierBlock.keyboardShortcuts] : [];
                break;
            default:
                break;
        }
    }

    setShortcuts(keyboardShortcuts) {
        this.shortcuts = [...keyboardShortcuts];
    }

    checkTabActive() {
        if (this.currentUser.userName === 'SYMANAGEMENT') {
            this.hide = false;
            return;
        }
        const activeTabs = this.formStoringService.get(StorageKeys.activeTabs);
        if (activeTabs && activeTabs.length > 0) {
            this.hide = false;
        } else {
            this.hide = true;
            this.searchData();
            this.getDataReload();
        }
    }

    onBtnCloseMenu() {
        this.hide = false;
    }

    showMenu() {
        if (this.currentUser.userName === 'SYMANAGEMENT') {
            this.hide = false;
            return;
        }
        this.hide = true;
        this.searchData();
        this.getDataReload();
    }


    changePaginationParams(paginationParams) {
        if (!this.dataTable) {
            return;
        }
        this.paginationParams = paginationParams;
        this.searchDataTable();
    }

    searchDataTable() {
        this.homeService.getDataTable(this.paginationParams).subscribe(res => {
            this.dataTable = res.list;
            this.paginationTotalsData = res.total;
            if (this.params) {
                this.params.api.setRowData((this.dataTable) ? this.gridTableService.addSttToData(this.dataTable) : []);
            }
            this.gridTableService.selectFirstRow(this.params);
        });
    }

    searchData() {
        this.homeService.getData().subscribe(res => this.data = res);
    }

    getDataReload() {
        // this.funcInterval = setInterval(() => {
        //   this.searchData();
        //   this.searchDataTable();
        // }, 60000);
    }

    callbackGrid(params) {
        this.params = params;
        this.searchDataTable();
    }

    getParams() {
        const selectedData = this.params.api.getSelectedRows();
        if (selectedData) {
            this.selectedData = selectedData[0];
        }
    }

    isLoadComponent(tab) {
        return this.isLoadTabsFromStorage ? this.activeTabTypesFromStorage.indexOf(tab) > -1 : this.activeTabTypes.indexOf(tab) > -1;
    }

    selectTab(tab, event?) {
        this.setActiveTab(tab);
        if (event) {
            event.stopPropagation();
        }
        if (!!this.checkRemoveTab) {
            this.checkRemoveTab = !this.checkRemoveTab;
            return;
        }
        this.registerNo = undefined;
        this.shortcuts = [];
        this.selectTabIndex(tab);
    }

    selectTabIndex(tab) {
        // currentTab = tab;
        tabChangeObserver.next(tab);
        this.selectedTab = tab;
        // những tab chỉ bật 1 lần
        this.formStoringService.set(StorageKeys.selectedTab, this.selectedTab);
        if (this.isLoadTabsFromStorage) {
            const selectedTab = this.activeTabTypesFromStorage.find(item => item === tab);
            if (!selectedTab) {
                this.activeTabTypesFromStorage.push(tab);
            }
        }
        if (tab === TMSSTabs.gateInOut && this.gateInOut) {
            this.setKeyboardShortcuts(tab);
        }
        if (tab === TMSSTabs.booking) {
            this.setKeyboardShortcuts(tab);
        }
        if (tab === TMSSTabs.cashier) {
            this.setKeyboardShortcuts(tab);
        }
        if (tab === TMSSTabs.receptionist && this.receptionist) {
            this.receptionist.forceReload();
        }
        if (tab === TMSSTabs.receivingVehicle && this.receivingVehicle) {
            this.receivingVehicle.loadData();
        }
        this.runCustomFunction(tab);
        if (tab === TMSSTabs.progressCustomer) {
            this.removeTab(tab);
            window.open('/progress-customers', '_blank');
        }
        if (tab === TMSSTabs.screenWaitReception) {
            this.removeTab(tab);
            window.open('/screen-wait-reception', '_blank');
        }
        this.setKeyboardShortcuts(tab);
    }


    removeTab(tab) {
        this.shortcuts = [];
        const tabIndex = this.activeTabs.findIndex(activeTab => activeTab.tab === tab);
        if (tabIndex === 0 && this.activeTabs.length === 0) {
            this.showMenu();
        }
        if (!tab.startsWith(TMSSTabs.proposal) || tab.startsWith(TMSSTabs.quotationAccount)) {
            remove(this.activeTabTypes, type => type === tab);
            remove(this.activeTabTypesFromStorage, type => type === tab);
            this.formStoringService.set(StorageKeys.activeTabs, this.activeTabs);
            this.removeIndex(tabIndex, tab);
        } else {
            this.checkRemoveTab = true;
            const component = this.tabElements.find((e) => e.tab === tab);
            if (component && component.componentRef && component.componentRef.instance) {
                const selectorForm = component.componentRef.instance.content.nativeElement;
                if (selectorForm.dataset && selectorForm.dataset.dirty === 'true' && selectorForm.dataset.state && Number(selectorForm.dataset.state) >= 1) {
                    this.confirmService.openConfirmModal('Có dữ liệu thay đổi.Sẽ bị xóa khi thoát. Bạn có chắc chắn muốn thoát?').subscribe(() => {
                        component.componentRef.instance.clear.emit();
                        this.removeIndex(tabIndex, tab);
                    }, () => {
                    });
                } else {
                    component.componentRef.instance.clear.emit();
                    this.removeIndex(tabIndex, tab);
                }
            } else {
                this.removeIndex(tabIndex, tab);
            }
        }

    }

    triggerMouseEvent(event, tab) {
        // middle mouse
        if (event.which === 2) {
            this.removeTab(tab);
        }
    }

    removeIndex(tabIndex, tab) {
        this.activeTabs = this.activeTabs.filter(activeTab => activeTab.tab !== tab);
        if (tabIndex > 0 && tabIndex === this.activeTabs.length - 1) {
            --tabIndex;
        }
        remove(this.activeTabs, item => item.tab === tab);
        if (tabIndex === 0 && !this.activeTabs.length) {
            this.formStoringService.clear(StorageKeys.selectedTab);
        } else {
            this.selectedTab = this.activeTabs[tabIndex === 0 && this.activeTabs.length > 0 ? 0 : tabIndex - 1].tab;
            this.selectTab(this.selectedTab);
        }
        if (tab === this.tMSSTabs.dlrBoPartsExport) {
            this.partExportInitialData = {
                ro: null,
                type: null,
                plate: null,
                searchOnStart: null
            };
        }
        if (tab === this.tMSSTabs.dlrBoPartsRequest) {
            this.dataOrderBo = {};
        }
        switch (tab) {
            case TMSSTabs.contractManagement: {
                this.formStoringService.clear(StorageKeys.contractFilterStartModal);
                break;
            }
            case TMSSTabs.vehicleArrival: {
                this.formStoringService.clear(StorageKeys.vehicleArrivalFilterStart);
                break;
            }
            case TMSSTabs.cbuVehicleInfo: {
                this.formStoringService.clear(StorageKeys.cbuFilterStartModal);
                break;
            }
            case TMSSTabs.ckdVehicleInfo: {
                this.formStoringService.clear(StorageKeys.ckdFilterStartModal);
                break;
            }
        }
    }

    clearCustomer() {
        this.customerInfo = null;
    }

    clearCarInfo() {
        this.carInformation = null;
    }

    runDynamicOutput(events) {
        if (events) {
            events.forEach(e => {
                if (e.name && e.param) {
                    if (Array.isArray(e.param)) {
                        this[e.name]([...e.param]);
                    } else if (typeof e.param === 'object') {
                        this[e.name]({ ...e.params });
                    } else {
                        this[e.name](e.params);
                    }
                }
            });
        }
    }

    canLazyLoad(activeTabs) {
        return activeTabs.filter(tab => this.lazyLoadTabs.includes(tab.tab) || tab.tab.startsWith(TMSSTabs.proposal));
    }

    isService(tabs) {
        return tabs.filter(tab => !this.notService.includes(tab.tab));
    }

    nonService(tabs) {
        return tabs.filter(tab => this.notService.includes(tab.tab));
    }

    runCustomFunction(tab) {
        setTimeout(() => {
            const component = this.tabElements.find((e) => e.tab === tab);
            if (component) {
                component.runCustomFunction();
            }
        });
    }

    ngOnDestroy() {
        // clearInterval(this.funcInterval);
    }

    private initTabs() {
        this.tabs = [
            // DLR Khai báo danh mục
            { name: 'Danh sách tỉnh thành', tab: TMSSTabs.provinceList },
            { name: 'Danh sách quận huyện', tab: TMSSTabs.districtList },
            { name: 'Dealer IP Config', tab: TMSSTabs.dealerIpConfig },
            { name: 'Khai báo danh mục công việc', tab: TMSSTabs.repairJobMaster },
            { name: 'Gán công việc GJ cho xe', tab: TMSSTabs.applyJobForCarMaster },
            { name: 'Gán công việc BP cho xe', tab: TMSSTabs.applyBPJobForCarMaster },
            { name: 'Danh Mục Nhân viên', tab: TMSSTabs.staffCatalog },
            { name: 'Danh Mục Đơn vị', tab: TMSSTabs.unitCatalog },
            { name: 'Danh Mục Đơn vị', tab: TMSSTabs.unitCatalog },
            { name: 'Danh Mục Khoang sửa chữa', tab: TMSSTabs.repairCavity },
            { name: 'Khai báo tham số hoạt động đại lý', tab: TMSSTabs.parameterOperationAgent },
            { name: 'Khai báo tổ/nhóm đồng sơn ', tab: TMSSTabs.wshopBpGroup },
            { name: 'Quản lý gói công việc GJ', tab: TMSSTabs.generalRepair },
            { name: 'Danh sách Model', tab: TMSSTabs.modelDeclaration },
            { name: 'Danh mục nhà cung cấp', tab: TMSSTabs.supplierManagement },
            { name: 'Danh sách công ty Bảo Hiểm', tab: TMSSTabs.insuranceCompany },
            { name: 'Quản lý chiến dịch đại lý', tab: TMSSTabs.agentCampaignManagement },
            { name: 'Danh mục ngân hàng', tab: TMSSTabs.bankCatalog },
            { name: 'Khai báo chân trang', tab: TMSSTabs.dealerFooter },
            { name: 'Bàn cố vấn', tab: TMSSTabs.deskAdvisor },
            { name: 'Khai báo tầng', tab: TMSSTabs.dlrFloor },
            { name: 'Sắp Xếp Thứ Tự Tiếp Nhận Khách Hàng Dịch Vụ', tab: TMSSTabs.collocationCustomer },
            { name: 'TEST Forecast Order', tab: TMSSTabs.forecastOrder },
            { name: 'TEST BO Follow Up CVDV', tab: TMSSTabs.followOrder },
            { name: 'Quản lý công việc ĐS', tab: TMSSTabs.dsManagement },
            { name: 'Chiến dịch của đại lý', tab: TMSSTabs.campaignDlr },
            { name: 'Labor Rate Maintenance', tab: TMSSTabs.laborRateMaintenance },

            // DLR Advisor
            { name: 'Thông tin khách hàng', tab: TMSSTabs.customerInfo },
            { name: 'Bảng theo dõi tiến độ', tab: TMSSTabs.progressTrackingTable },
            { name: 'Trạng thái khoang', tab: TMSSTabs.cavityStatus },
            { name: 'Trạng thái kỹ thuật viên', tab: TMSSTabs.technicianStatus },
            { name: 'Báo giá', tab: TMSSTabs.proposal },
            { name: 'Phiếu hẹn', tab: TMSSTabs.booking },
            { name: 'Chuẩn hóa thông tin khách hàng', tab: TMSSTabs.standardizeCustomerInfo },
            { name: 'Sửa thông tin khách hàng', tab: TMSSTabs.changeCustomerInfo },
            { name: 'Công việc dang dở của CVDV', tab: TMSSTabs.unfWorkDlrAdv },
            { name: 'Hồ sơ sửa chữa', tab: TMSSTabs.repairProfile },
            { name: 'Tạo báo giá/ Quyết toán kết hợp', tab: TMSSTabs.quotationAccount },
            { name: 'Lưu trữ báo giá', tab: TMSSTabs.storageQuotation },
            { name: 'Lưu trữ gói công việc', tab: TMSSTabs.storageJobPackage },
            { name: 'Chi tiết báo giá', tab: TMSSTabs.viewProposal },

            //  DLR Coo
            { name: 'Thông tin tiến độ sửa chữa ', tab: TMSSTabs.infoGeneralRepairProgress },
            { name: 'Tiến độ sửa chữa chung', tab: TMSSTabs.generalRepairProgress },
            { name: 'Tiến độ sửa chữa Đồng sơn', tab: TMSSTabs.dongsonProgress },
            { name: 'Tiến độ đồng sơn theo xe', tab: TMSSTabs.dongsonProgressByCar },
            { name: 'Tiến độ đồng sơn theo khoang', tab: TMSSTabs.dongsonProgressByWshop },
            { name: 'Lịch sử xe dừng', tab: TMSSTabs.vehicleHistory },
            { name: 'Báo cáo tiến độ', tab: TMSSTabs.progressReport },
            { name: 'Tiến độ rửa xe', tab: TMSSTabs.carWash },
            { name: 'Tiến độ kỹ thuật viên', tab: TMSSTabs.emp },

            // DLR - Cashier
            { name: 'Thu ngân', tab: TMSSTabs.cashier },
            { name: 'Xe chưa quyết toán ra cổng', tab: TMSSTabs.carNotSettlementToOutGate },

            // Dlr warranty
            { name: 'DLR Claim Status Report', tab: TMSSTabs.dlrClaimReport },
            { name: 'Vehicle Registration', tab: TMSSTabs.vehicleRegistration },
            { name: 'Quản lý thông tin chiến dịch TMV', tab: TMSSTabs.campaignManagementTmv },
            { name: 'Khai báo tham số giờ công bảo hành', tab: TMSSTabs.warrantyTimeSheetDeclare },
            { name: 'Theo dõi sửa chữa bảo hành', tab: TMSSTabs.warrantyFollowUp },
            { name: 'Update Km', tab: TMSSTabs.updateKm },
            { name: 'Thông tin bảo hành', tab: TMSSTabs.warrantyInformation },
            { name: 'Claim Status Report', tab: TMSSTabs.claimStatusReport },
            { name: 'Phân công theo dõi bảo hành', tab: TMSSTabs.warrantyAssign },
            { name: 'Tỷ giá', tab: TMSSTabs.exchangeRateMaintenance },
            { name: 'Sublet Type Maintenance', tab: TMSSTabs.subletTypeMaintenance },
            { name: 'Kiểm tra công việc bảo hành', tab: TMSSTabs.warrantyCheckWmi },
            { name: 'T1/T2/T3 Warning List', tab: TMSSTabs.t1t2t3WarningList },
            { name: 'Vendor Maintenance', tab: TMSSTabs.vendorMaintenance },
            { name: 'Đăng ký bảo hành xe', tab: TMSSTabs.warrantyVehicleRegistration },
            { name: 'Bảo hành xe đã bán', tab: TMSSTabs.soldVehicleMaintenance },
            // TMV warranty
            { name: 'DS xe đã thực hiện chiến dịch', tab: TMSSTabs.campaignVehComplete },
            { name: 'DS xe ĐL thông báo khách hàng', tab: TMSSTabs.campaignFollowRemind },
            { name: 'DS xe ĐL y/c thực hiện chiến dịch', tab: TMSSTabs.campaignFollowUp },
            // { name: 'Warranty Claim Judgement', tab: TMSSTabs.warrantyClaimJudgement },
            // DLR - Parts Management
            { name: 'Đặt hàng BO cho lệnh sửa chữa', tab: TMSSTabs.dlrBoPartsRequest },
            { name: 'Xuất phụ tùng', tab: TMSSTabs.dlrBoPartsExport },
            { name: 'Theo dõi đơn hàng BO', tab: TMSSTabs.dlrBoPartsFollowup },
            { name: 'Màn hình theo dõi đơn hàng BO (NVPT)', tab: TMSSTabs.dlrBoPartsFollowupNvpt },
            { name: 'Màn hình theo dõi đơn hàng BO (CVDV)', tab: TMSSTabs.dlrBoPartsFollowupCvdv },
            { name: 'Chuyển RO quyết toán về LSC', tab: TMSSTabs.moveRoSettlementToRepair },
            { name: 'Xuất phụ tùng cho RO thiếu phụ tùng', tab: TMSSTabs.dlrRoLackOfParts },
            { name: 'Đặt hàng cho dự trữ tồn kho', tab: TMSSTabs.dlrPartsOrderForStoring },
            { name: 'Bán lẻ phụ tùng', tab: TMSSTabs.dlrPartsRetail },
            { name: 'Tạo/Sửa bán lẻ phụ tùng', tab: TMSSTabs.dlrPartsRetailNewTabOrder },
            { name: 'Đặt hàng thủ công', tab: TMSSTabs.dlrPartsManualOrder },
            { name: 'Tạo đơn hàng thủ công', tab: TMSSTabs.newManualTabOrder },
            { name: 'Đặt hàng đặc biệt', tab: TMSSTabs.dlrPartsSpecialOrder },
            { name: 'Đặt hàng kế hoạch', tab: TMSSTabs.dlrPartsPrePlanOrder },
            { name: 'Điều chỉnh tăng giảm phụ tùng', tab: TMSSTabs.dlrPartsInStockAdjustment },
            { name: 'Trạng thái hàng lưu kho', tab: TMSSTabs.dlrPartsInStockStatus },
            { name: 'Quản lý thông tin phụ tùng', tab: TMSSTabs.dlrPartsInfoManagement },
            { name: 'Gửi yêu cầu hủy đơn hàng', tab: TMSSTabs.dlrPartsCancelOrderRequest },
            { name: 'Nhận hàng tự động', tab: TMSSTabs.dlrPartsReceiveAuto },
            { name: 'Nhận hàng Thủ công', tab: TMSSTabs.dlrPartsReceiveManual },
            { name: 'Nhận hàng cho phụ tùng Non-Toyota', tab: TMSSTabs.dlrPartsReceiveNonToyota },
            { name: 'Thông tin hàng sắp về', tab: TMSSTabs.dlrPartsUpcommingInfo },
            { name: 'Tra cứu thông tin phụ tùng', tab: TMSSTabs.dlrPartsLookupInfo },
            { name: 'Tìm kiếm lệnh có phụ từng xuất chưa đủ', tab: TMSSTabs.dlrPartsExportLackLookup },
            { name: 'Theo dõi trình trạng hủy phụ tùng', tab: TMSSTabs.dlrPartsCancelChecking },
            { name: 'Rao bán phụ tùng đang DeadStock', tab: TMSSTabs.dlrDeadStockPartForSale },
            { name: 'Tìm kiếm phụ tùng DeadStock rao bán', tab: TMSSTabs.dlrDeadStockPartSearching },
            { name: 'Gửi Claim (Sai, thừa, thiếu, hỏng)', tab: TMSSTabs.dlrSendClaim },
            { name: 'Sửa vị trí PT đang Prepick', tab: TMSSTabs.dlrPartsRepairPositionPrepick },
            { name: 'Tính MIP', tab: TMSSTabs.dlrMipCalculate },
            { name: 'Theo dõi và xử lý đơn đặt hàng tồn', tab: TMSSTabs.dlrOnhandOrderFollowup },
            { name: 'Hỏi mã, giá PT', tab: TMSSTabs.partsCheckPriceCode },
            { name: 'Lịch sử nhập phụ tùng', tab: TMSSTabs.partsReciveHistory },
            { name: 'Lịch sử xuất phụ tùng', tab: TMSSTabs.partShippingHistory },
            { name: 'Import MIP', tab: TMSSTabs.mipImport },
            { name: 'Đặt hàng phụ tùng chuyên biệt Lexus', tab: TMSSTabs.orderForLexusPart },
            { name: 'Đơn hàng đại lý gửi Lexus', tab: TMSSTabs.partsNonLexusOrderLexus },
            { name: 'Thiết lập công thức tính MIP', tab: TMSSTabs.setupFormulaMIP },
            { name: 'Bán phụ tùng của đại lý cho TMV', tab: TMSSTabs.partSaleDlrToTmv },
            { name: 'Lexus trả hàng cho đại lý', tab: TMSSTabs.lexusReturnToDealer },

            // DLR - FIR & MRS
            { name: 'Định nghĩa các mốc cần  bảo dưỡng', tab: TMSSTabs.dlrListOfMaintenanceMilestones },
            { name: 'Danh sách khách hàng cần nhắc bảo dưỡng', tab: TMSSTabs.dlrListOfCustomersRequiringMaintenance },
            {
                name: 'Định nghĩa các mốc cần liên hệ sau sửa chữa',
                tab: TMSSTabs.dlrListOfMilestonesNeedToBeRequireAfterRepair
            },
            { name: 'Cập nhật sau xử lý', tab: TMSSTabs.firModifyAfterProcess },

            {
                name: 'Danh sách khách hàng cần liên lạc sau sửa chữa - FIR',
                tab: TMSSTabs.dlrListOfCustomersToContactAfterRepair
            },
            { name: 'Liên hệ khách hàng sau sửa chữa', tab: TMSSTabs.contactAfterRepair },

            // QUEUING
            { name: 'Quản lý xe ra-vào đại lý', tab: TMSSTabs.gateInOut },
            { name: 'Sắp xếp thứ tự tiếp nhận KH dịch vụ', tab: TMSSTabs.collocationCustomer },
            { name: 'Lễ tân', tab: TMSSTabs.receptionist },
            { name: 'Tiếp nhận xe ra vào của CVDV', tab: TMSSTabs.receivingVehicle },
            { name: 'Xe ra vào', tab: TMSSTabs.vehicleInModal },
            { name: 'Tiến độ khách hàng', tab: TMSSTabs.progressCustomer },
            { name: 'Màn hình chờ tiếp nhận', tab: TMSSTabs.screenWaitReception },

            // SYSTEM
            { name: 'Khai báo NSD và phân nhóm', tab: TMSSTabs.systemUserAndGroupDefinition },
            { name: 'Khai báo nhóm NSD và quyền hạn', tab: TMSSTabs.userGroupAndAuthority },
            { name: 'Khai báo các chức năng hệ thống', tab: TMSSTabs.systemFunctionList },
            { name: 'Khai báo user và phân quyền', tab: TMSSTabs.userManagement },
            { name: 'Khai báo IP', tab: TMSSTabs.declareIp },

            // MAINTENANCE_CALLING
            { name: 'Gọi điện nhắc bảo dưỡng', tab: TMSSTabs.maintenanceCalling },
            { name: 'Gọi điện nhắc BD- DS chưa liên hệ', tab: TMSSTabs.maintenanceCallingNotContact },
            { name: 'Nhắn tin nhắc bảo dưỡng', tab: TMSSTabs.maintenanceMessage },
            { name: 'Gửi thư nhắc bảo dưỡng', tab: TMSSTabs.maintenanceLetter },

            // WORDS_1K
            { name: 'Liên lạc sau 15 ngày giao xe (D + 15)', tab: TMSSTabs.contactAfterDays15 },
            { name: 'Liên lạc nhắc bảo dưỡng 1K dự kiến (D1K - 3)', tab: TMSSTabs.contactMaintenanceRemind },
            { name: 'Liên lạc sau 55 ngày giao xe (D + 55)', tab: TMSSTabs.contactAfterDays55 },

            // SEARCH-EXTRACT-DATA
            { name: 'TÌm kiếm khách hàng', tab: TMSSTabs.searchCustomer },
            { name: 'TÌm kiếm cuộc gọi', tab: TMSSTabs.callSearch },
            { name: 'Danh sách KH đặt hẹn', tab: TMSSTabs.listCustomerAppointment },
            { name: 'Danh sách giao xe', tab: TMSSTabs.islistDealCar },
            { name: 'Khách hàng dịch vụ', tab: TMSSTabs.customerService },
            { name: 'Khách hàng mua xe mới', tab: TMSSTabs.customerBuyNewCar },

            // TRACK_CUSTOMER
            { name: 'Theo dõi khách hàng dịch vụ chưa quay lại', tab: TMSSTabs.trackCustomerNotBack },
            { name: 'Theo dõi khách hàng mua xe chưa quay lại', tab: TMSSTabs.trackCustomerBuyCarNotBack },

            // MANAGE_VOC
            { name: 'Quản lý thắc mắc/yêu cầu', tab: TMSSTabs.manageQuestionRequest },
            { name: 'Quản lý ý kiến không hài lòng/khiếu nại', tab: TMSSTabs.manageDiscontentComplain },
            { name: 'Quản lý các khiếu nại tiềm ẩn', tab: TMSSTabs.manageComplainPotential },
            { name: 'Tham khảo xử lý khiếu nại', tab: TMSSTabs.referHandlingComplain },
            { name: 'Lịch sử cập nhật khiếu nại', tab: TMSSTabs.historyUpdateComplain },
            { name: 'DS khiếu nại đang giải quyết tại TMV', tab: TMSSTabs.listComplainHandleTMV },
            { name: 'DS thắc mắc khiếu nại từ CRAM', tab: TMSSTabs.listRequestComlainCRAM },
            { name: 'Quản lý FAQ', tab: TMSSTabs.manageFAQ },
            { name: 'Quản lý tài liệu hỗ trợ', tab: TMSSTabs.manageDocumentSupport },
            { name: 'Tra cứu tài liệu hỗ trợ', tab: TMSSTabs.searchDocumentSupport },

            // SSI_SURVEY
            { name: 'Danh sách khách hàng khảo sát SSI', tab: TMSSTabs.ssiSurveyList },
            { name: 'Xử lý khách hàng khảo sát SSI', tab: TMSSTabs.ssiSurveyHandle },
            { name: '[Web] - DS khách hàng khảo sát SSI', tab: TMSSTabs.webSsiSurveyList },
            { name: '[Web] - Xử lý khách hàng khảo sát SSI', tab: TMSSTabs.webSsiSurveyHandle },
            { name: 'Kết quả khảo sát SSI [Danh sách]', tab: TMSSTabs.surveyResultList },
            { name: 'Black list', tab: TMSSTabs.blackList },
            { name: 'Nhóm dữ liệu SSI', tab: TMSSTabs.ssiDataList },
            { name: 'Import kết quả khảo sát', tab: TMSSTabs.importDataSurvey },


            // CSI_SURVEY
            { name: 'Xử lý khách hàng khảo sát CSI', tab: TMSSTabs.csiSurveyHandle },
            { name: 'Danh sách khách hàng khảo sát CSI', tab: TMSSTabs.csiSurveyList },
            { name: '[Web] Danh sách khách hàng khảo sát CSI', tab: TMSSTabs.webCsiSurveyList },
            { name: '[Web] Xử lý khách hàng khảo sát CSI', tab: TMSSTabs.webCsiSurveyHandle },
            { name: 'Kết quả khảo sát CSI [Danh sách]', tab: TMSSTabs.csiSurveyResult },
            { name: 'Black list', tab: TMSSTabs.blackListCsi },
            { name: 'Nhóm dữ liệu', tab: TMSSTabs.csiDataList },

            // SSI_CSI_SURVEY_RESULT
            { name: 'Kết quả khảo sát CSI', tab: TMSSTabs.csiSsiSurveyResult },
            { name: 'Kết quả khảo sát SSI', tab: TMSSTabs.ssiCsiSurveyResult },
            { name: 'Kết quả khảo sát Web SSI', tab: TMSSTabs.webSsiCsiSurveyResult },
            { name: 'Kết quả khảo sát Web CSI', tab: TMSSTabs.webCsiSsiSurveyResult },
            { name: 'Import kết quả khảo sát Web SSI [Danh sách]', tab: TMSSTabs.webSsiImportResultSurvey },
            { name: 'Import kết quả khảo sát Web CSI [Danh sách]', tab: TMSSTabs.webCsiImportResultSurvey },


            // FIR_CATEGORY
            { name: 'Câu hỏi liên hệ FIR', tab: TMSSTabs.firContactQuestions },
            { name: 'Câu hỏi liên hệ Đại lý', tab: TMSSTabs.agencyContactQuestions },
            { name: 'Danh mục lĩnh vực lỗi', tab: TMSSTabs.listErrorField },
            { name: 'Danh mục bộ phận gây lỗi', tab: TMSSTabs.listPartError },
            { name: 'Danh mục mã lỗi', tab: TMSSTabs.isErrorCode },
            { name: 'Danh mục nguyên nhân lỗi', tab: TMSSTabs.errorCause },
            { name: 'Danh mục lý do không liên lạc được', tab: TMSSTabs.reasonNotContact },


            // CATEGORY_VOC
            { name: 'Danh mục lĩnh vực thắc mắc [Danh sách]', tab: TMSSTabs.categoryRequestField },
            { name: 'Danh mục vấn đề thắc mắc [Danh sách]', tab: TMSSTabs.categoryRequestProblem },
            { name: 'Danh mục lĩnh vực khiếu nại [Danh sách]', tab: TMSSTabs.categoryComplainField },
            { name: 'Danh mục vấn đề khiếu nại [Danh sách]', tab: TMSSTabs.categoryComplainProblem },
            { name: 'Danh mục bộ phận hư hỏng/Quy trình [Danh sách]', tab: TMSSTabs.categoryPartsDamaged },
            { name: 'Danh mục hiện tượng hư hỏng/Quy trình phụ [Danh sách]', tab: TMSSTabs.categoryPhenomenaDamaged },
            { name: 'Danh mục loại lỗi 1 DSO', tab: TMSSTabs.categoryErrorDSO1 },
            { name: 'Danh mục loại lỗi 2 DSO', tab: TMSSTabs.categoryErrorDSO2 },
            { name: 'Danh mục nguyên nhân 1 DSO', tab: TMSSTabs.categoryReasonDSO1 },
            { name: 'Danh mục nguyên nhân 2 DSO', tab: TMSSTabs.categoryReasonDSO2 },
            { name: 'Danh mục dòng xe', tab: TMSSTabs.categoryCarType },
            { name: 'Danh mục loại xe', tab: TMSSTabs.categoryCarModel },
            { name: 'Danh mục thông số kĩ thuật', tab: TMSSTabs.categorySpecifications },

            // SERVICE KPI DATA - Cập nhật/điều chỉnh dữ liệu KPI dịch vụ
            { name: 'Cập nhật dữ liệu dịch vụ', tab: TMSSTabs.updateDvData },
            { name: 'Quyết toán lệnh nợ phụ tùng', tab: TMSSTabs.isSettlementDebtAccessory },
            { name: 'Nhập liệu theo định dạng DL nguồn - Sau giảm giá', tab: TMSSTabs.isInputFormatData },
            { name: 'Nhập liệu số hóa đơn', tab: TMSSTabs.isInputInvoice },
            { name: 'Nhập liệu theo định dạng DL nguồn - Trước giảm giá', tab: TMSSTabs.isInputFormatDataBefore },

            // KAIZEN API
            { name: 'Cập nhật dữ liệu dịch vụ Kaizen Api', tab: TMSSTabs.isUpdateKzServiceData },

            // DLR NEW PART
            { name: 'Đơn hàng đại lý gửi Lexus', tab: TMSSTabs.isOrderSentLexus },
            { name: 'Nhận hàng tự động PT chuyên biệt lexus', tab: TMSSTabs.partsReceiveAutoLexus },
            { name: 'Nhận hàng thủ công PT chuyên biệt lexus', tab: TMSSTabs.partsReceiveManualLexus },
            { name: 'Đặt hàng phụ tùng chuyên biệt Lexus', tab: TMSSTabs.isOrderSpecializedLaxus },
            { name: 'Lịch sử nhập hàng của đại lý LEXUS', tab: TMSSTabs.lexusPartsReceiveHistory },

            // SRV-MASTER

            { name: 'Quản lý đại lý đặt phụ tùng Lexus', tab: TMSSTabs.dlrOrderToLexusManagement },
            { name: 'Danh sách Đại lý đặt phụ tùng chuyên biệt lên Lexus', tab: TMSSTabs.listOfDlrOrderToLexus },
            { name: 'Quản lý giá phụ tùng chuyên biệt Lexus', tab: TMSSTabs.lexusPartsPriceManagement },

            // NEW INFOMATION
            { name: 'Tin tức & khuyến mãi', tab: TMSSTabs.isNewPromotion },
            { name: 'Đăng kí lái thử', tab: TMSSTabs.regisTestDrive },

            // ---------------------------------SALE---------------------------
            { name: 'Dealer list', tab: TMSSTabs.dealerList },
            { name: 'Dealer group', tab: TMSSTabs.dealerGroup },
            { name: 'Dealer address delivery', tab: TMSSTabs.dealerAddressDelivery },
            { name: 'Arrival lead time', tab: TMSSTabs.arrivalLeadTime },
            { name: 'Audio management', tab: TMSSTabs.audioManagement },
            { name: 'Insurance company', tab: TMSSTabs.insuranceCompany },
            { name: 'Invoice lead time', tab: TMSSTabs.invoiceLeadtime },
            { name: 'Bank management', tab: TMSSTabs.bankManagement },
            { name: 'Money define', tab: TMSSTabs.moneyDefine },
            { name: 'Provinces', tab: TMSSTabs.provinceList },
            { name: 'District list', tab: TMSSTabs.districtList },
            { name: 'Model list management', tab: TMSSTabs.modelList },
            { name: 'Grade production', tab: TMSSTabs.gradeProduction },
            { name: 'Petrol management', tab: TMSSTabs.petrolManagement },
            { name: 'Yard management', tab: TMSSTabs.yardManagement },
            { name: 'Yard location ', tab: TMSSTabs.yardLocation },
            { name: 'Yard area', tab: TMSSTabs.yardRegion },
            { name: 'Color list', tab: TMSSTabs.colorList },
            { name: 'Color assignment', tab: TMSSTabs.colorAssignment },
            { name: 'Mean of transportation', tab: TMSSTabs.meanOfTransportation },
            { name: 'Logistics company', tab: TMSSTabs.logisticsCompany },
            { name: 'DLR day off', tab: TMSSTabs.dlrDayoff },
            { name: 'TMV day off', tab: TMSSTabs.tmvDayoff },
            // {name: 'Quản lý bảo hiểm', tab: TMSSTabs.insuranceManagement},
            // Daily Sale
            { name: 'Vehicle Arrival', tab: TMSSTabs.vehicleArrival },
            { name: 'Cs Change Information', tab: TMSSTabs.csChangeInformation },
            { name: 'Contract Management', tab: TMSSTabs.contractManagement },
            { name: 'CBU Vehicle Information', tab: TMSSTabs.cbuVehicleInfo },
            { name: 'CKD Vehicle Information', tab: TMSSTabs.ckdVehicleInfo },
            { name: `Dealer's Balance`, tab: TMSSTabs.dealersBalance },
            { name: `Payment Followup`, tab: TMSSTabs.paymentFollowup },
            { name: `Change Contact Information`, tab: TMSSTabs.changeContactInformation },
            // Admin
            { name: `Danh sách cột số liệu`, tab: TMSSTabs.columnList },
            { name: `Gắn cột dữ liệu cho form`, tab: TMSSTabs.formColumn },
            { name: `Tạo nhóm cột số liệu`, tab: TMSSTabs.formGroup },
            { name: `Phân quyền dữ liệu`, tab: TMSSTabs.userColumn },
            { name: `Change Delivery`, tab: TMSSTabs.changeDelivery },
            // Fleet Sale
            { name: `Fleet Sale Application`, tab: TMSSTabs.fleetSaleApplicationTMV },
            // {name: `TMV Sales Target`, tab: TMSSTabs.tmvSalesTarget},
            // {name: `DLR Sales Plan`, tab: TMSSTabs.dlrSalesPlan},
            // {name: `DLR Order`, tab: TMSSTabs.dlrSaleOrder},
            // {name: `TMV Allocation`, tab: TMSSTabs.tmvSaleAllocation},
            // {name: `DLR Color Order`, tab: TMSSTabs.dlrSaleColorOrder},
            { name: `Fleet Customer`, tab: TMSSTabs.fleetCustomer },
            { name: `Dealer Ip Config`, tab: TMSSTabs.dealerIpConfig },
            { name: `Check Vehicles Logs`, tab: TMSSTabs.checkLogVehicles },
            // Swapping
            { name: this.formStoringService.get(StorageKeys.currentUser).isAdmin ? `TMV Vehicle Information` : `DLR Vehicle Information`, tab: TMSSTabs.dlrVehicleInformation },
            { name: `Nationwide Selling List`, tab: TMSSTabs.nationwideSellingList },
            { name: `Nationwide Buying List`, tab: TMSSTabs.nationwideBuyingList },
            { name: `Nationwide Buying List`, tab: TMSSTabs.buyingPendingList },
            { name: `Searching Vehicle`, tab: TMSSTabs.searchingVehicle },
            { name: `Swapping Vehicle`, tab: TMSSTabs.swappingVehicle },
            { name: `Dispatch Change Request`, tab: TMSSTabs.dispatchChangeRequest },
            { name: `Sell/Swap Report`, tab: TMSSTabs.sellSwapReport },
            { name: `Sell/Buy Matching`, tab: TMSSTabs.sellBuyMatching },
            { name: `Advance Report`, tab: TMSSTabs.advanceReport },
            // Dealer
            { name: `Fleet Sale Application`, tab: TMSSTabs.dlrFleetSaleApplication },
            // dlr master data
            { name: `Sales Group Management`, tab: TMSSTabs.salesGroup },
            { name: `Sales Person Management`, tab: TMSSTabs.salesPerson },
            // dlr order
            // {name: 'Dlr Order', tab: TMSSTabs.dlrOrderSumary},
            // {name: 'CKD First Order', tab: TMSSTabs.ckdOrder},
            // {name: 'CBU First Order', tab: TMSSTabs.cbuOrder},
            // {name: 'CKD Second Order', tab: TMSSTabs.secondCkdOrder},
            // {name: 'CBU Second Order', tab: TMSSTabs.secondCbuOrder},
            { name: 'Dealer Order Config', tab: TMSSTabs.dealerOrderConfig },
            { name: 'Dealer Version Type', tab: TMSSTabs.dealerVersionType },
            { name: 'Chỉ tiêu BH TMV', tab: TMSSTabs.dealerSalesTarget },
            { name: 'Kế hoạch BH đại lý', tab: TMSSTabs.dealerSalesPlan },
            { name: 'Đặt hàng đại lý', tab: TMSSTabs.dealerOrder },
            { name: 'Phân xe đại lý', tab: TMSSTabs.dealerAllocation },
            { name: 'Đặt màu CBU', tab: TMSSTabs.dealerCbuColorOrder },
            { name: 'Dữ liệu raw rundown', tab: TMSSTabs.dealerRunDown },
            { name: 'Chỉ tiêu BH TMV fleet', tab: TMSSTabs.dealerSalesTargetFleet },
            { name: 'Nenkei', tab: TMSSTabs.dealerNenkei },
            //
            // {name: 'Khai báo NSD và phân nhóm', tab: TMSSTabs.systemUserAndGroupDefinition},
            // {name: 'Khai báo nhóm NSD và quyền hạn', tab: TMSSTabs.userGroupAndAuthority},
            // {name: 'Khai báo các chức năng hệ thống', tab: TMSSTabs.systemFunctionList},
            // dlr swapping
            { name: 'Swapping Vehicle', tab: TMSSTabs.swappingVehicle },
            { name: 'Dispatch Change Request', tab: TMSSTabs.dispatchChangeRequest },
            { name: 'Sell-Swap Report', tab: TMSSTabs.sellSwapReport }
        ];
    }

    private watchTabChange(): void {
        tabChangeObserver.subscribe(tab => {
            for (const cell of focusedCells) {
                if (cell.tab === tab && cell.focusCell && cell.focusCell.column) {
                    const editing = cell.editing;
                    cell.focusCellParams.api.clearFocusedCell();
                    this.gridTableService.setFocusCellDontEdit(cell.focusCellParams, cell.focusCell.column.colId, Number(cell.focusCell.rowIndex));
                    setTimeout(() => {
                        this.gridTableService.setFocusCell(
                            cell.focusCellParams,
                            cell.focusCell.column.colId,
                            null,
                            Number(cell.focusCell.rowIndex),
                            editing
                        );
                    }, 100);
                    break;
                }
            }
        });
    }

    /**
     * Call when all localstorage had setted to update active state
     * @param name
     * Use this param when new tab has been created
     */
    private setActiveTab(tab, name?): void {
        const activeTabs = this.formStoringService.get(StorageKeys.activeTabs);
        const dealerId = this.formStoringService.get(StorageKeys.currentUser).dealerId;
        this.deactivateTab(activeTabs, dealerId);
        if (name) {
            for (const aT of activeTabs) {
                if (!aT.dealerId && aT.tab === tab && aT.name === name) {
                    aT.dealerId = dealerId;
                    aT.active = true;
                } else if (!aT.dealerId) {
                    aT.dealerId = dealerId;
                    aT.active = false;
                }
            }
        } else {
            for (const aT of activeTabs) {
                if (aT.dealerId === dealerId && aT.tab === tab) {
                    aT.active = true;
                    break;
                }
            }
        }
        this.formStoringService.set(StorageKeys.activeTabs, activeTabs);
    }

    private deactivateTab(activeTabs, dealerId): void {
        for (const aT of activeTabs) {
            if (aT.dealerId && aT.dealerId === dealerId) {
                aT.active = false;
            }
        }
        this.formStoringService.set(StorageKeys.activeTabs, activeTabs);
    }

    private getDealerTabs(tabs): Array<any> | null {
        if (tabs) {
            const dealerId = this.formStoringService.get(StorageKeys.currentUser).dealerId;
            const dealerTabs = [];
            const lastDealerTabs = [];
            for (const aT of tabs) {
                if (aT.dealerId === dealerId) {
                    dealerTabs.push(aT);
                } else {
                    lastDealerTabs.push(aT);
                }
            }
            if (!this.formStoringService.get('TMSS_Last_Dealer_Tabs')) {
                this.formStoringService.set('TMSS_Last_Dealer_Tabs', lastDealerTabs);
            }
            return dealerTabs;
        } else {
            return null;
        }
    }

    private openLastActiveTab() {
        const activeTabs = this.formStoringService.get(StorageKeys.activeTabs);
        const dealerId = this.formStoringService.get(StorageKeys.currentUser).dealerId;
        if (!activeTabs || !dealerId) {
            return;
        }
        for (const aT of activeTabs) {
            if (aT.dealerId === dealerId && aT.active) {
                this.selectTab(aT.tab);
                break;
            }
        }
    }
}
