import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SideBars} from '../../core/constains/sidebars';
import {EventBusService} from '../common-service/event-bus.service';
import {FormStoringService} from '../common-service/form-storing.service';
import {StorageKeys} from '../../core/constains/storageKeys';
import {TMSSTabs} from '../../core/constains/tabs';
import {SidebarMenuModel} from '../../core/models/base.model';
import {CurrentUser} from '../../home/home.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sidebar-item',
  templateUrl: './sidebar-item.component.html'
})
export class SidebarItemComponent implements OnInit {
  @Input() isAlwaysShowSubmenu: boolean;
  @Output() openFilterModal = new EventEmitter();
  currentUser = CurrentUser;
  systemAdminMenuList: Array<SidebarMenuModel>;
  currentSidebar: SideBars;
  functionsNeedFilterFirst: Array<any> = [];
  functionsModal: Array<any> = [];
  allTabs: Array<string>;

  constructor(
    private eventBus: EventBusService,
    private formStoringService: FormStoringService) {
  }

  openComponent(event, item) {
    event.stopPropagation();
    if (this.allTabs.indexOf(item.functionCode) < 0) {
      return;
    }
    if (this.functionsNeedFilterFirst.indexOf(item.functionCode) > -1) {
      const funcSelected = this.functionsModal.find(func => func.code === item.functionCode);
      this.openFilterModal.emit({
        modal: funcSelected.modal,
        reportFunction: funcSelected.reportFunction,
        reportType: funcSelected.menuName
      });
    } else if (item.functionCode === 'SCREEN_WAIT_RECEPTION') {
      window.open('/screen-wait-reception', '_blank');
    } else {
      item.functionCode === 'PROGRESS_CUSTOMER'
        ? window.open('/progress-customers', '_blank')
        : this.eventBus.emit({
          type: 'openComponent',
          functionCode: item.functionCode
        });
    }
  }

  changeSidebarMenu(menu) {
    this.currentSidebar = (this.currentSidebar === menu.code) ? null : menu.code;
    this.formStoringService.set(StorageKeys.activeSidebar, (this.currentSidebar !== menu.code) ? null : menu.code);
  }

  onResize(event) {
    this.isAlwaysShowSubmenu = (event.target.innerWidth < 992);
  }

  checkShowSubmenu(menu) {
    return menu && this.currentSidebar === menu.code;
  }

  get menuList() {
    return this.currentUser.userName === 'SYMANAGEMENT'
      ? this.systemAdminMenuList
      : this.currentUser.menuList.filter(it => it.code.indexOf('Warrantly') < 0);
  }

  ngOnInit() {
    const currentActiveSidebar = this.formStoringService.get(StorageKeys.activeSidebar);
    if (currentActiveSidebar) {
      this.currentSidebar = currentActiveSidebar;
    }
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
      {code: TMSSTabs.dlrUnclaimOrder, modal: 'dlrUnclaimOrderModal'},
      {code: TMSSTabs.carOutPortGeneralReport, modal: 'inOutGateReport'},
      {code: TMSSTabs.warrantyDailyClaimReport, modal: 'warrantyDailyClaimReport'},
      {code: TMSSTabs.userListFunctionReport, modal: 'userListFunctionReport'},
      {code: TMSSTabs.isLaborWages, modal: 'isLaborWages'},
      {code: TMSSTabs.isLaborWagesNation, modal: 'isLaborWagesNation'},
      {code: TMSSTabs.progressTrackingTable, modal: 'progressChoosingModal'},
      {code: TMSSTabs.progressReport, modal: 'progressReport'},
      {code: TMSSTabs.islistDealCar, modal: 'islistDealCar'},
      {code: TMSSTabs.importDataSurvey, modal: 'importDataSurvey'},
      {code: TMSSTabs.partImportExportHistoryReport, modal: 'partImportExportHistoryReport'},
      {code: TMSSTabs.partImportExportReport, modal: 'partImportExportReport'},
      {code: TMSSTabs.partAmountAdjustmentReport, modal: 'partAmountAdjustmentReport'},
      {code: TMSSTabs.partSupplyRateByPartCodeReport, modal: 'partSupplyRateByPartCodeReport'},
      {code: TMSSTabs.partsCheckInventoryReport, modal: 'partsCheckInventoryReport'},
      {code: TMSSTabs.partsSupplyRatioReport, modal: 'partsSupplyRatioReport'},
      {code: TMSSTabs.accessoryInventoryCheckReport, modal: 'accessoryInventoryCheckReport'},
      {code: TMSSTabs.outputReport, modal: 'outputReport'},
      {code: TMSSTabs.accessorySellingReport, modal: 'accessorySellingReport'},
      {code: TMSSTabs.retailSalesReport, modal: 'retailSalesReport'},
      {code: TMSSTabs.reportReceive, modal: 'reportReceive'},
      {code: TMSSTabs.roGeneralByDayReport, modal: 'roGeneralByDayReport'},
      {code: TMSSTabs.oweTmvReport, modal: 'oweTmvReport'},
      {code: TMSSTabs.decentralizedInspectionAgentQuality, modal: 'decentralizedInspectionAgentQuality'},
      {code: TMSSTabs.serviceRateAndRoFillReport, modal: 'serviceRateAndRoFillReport'},
      {code: TMSSTabs.partRetailGeneralReport, modal: 'partRetailGeneralReport'},
      {code: TMSSTabs.roUnfinishedReport, modal: 'roUnfinishedReport'},
      {code: TMSSTabs.roListWithFullPart, modal: 'roListWithFullPart'},
      {code: TMSSTabs.timeStoreBo, modal: 'timeStoreBo'},
      {code: TMSSTabs.orderOfDlrToTmv, modal: 'orderOfDlrToTmv'},
      {code: TMSSTabs.listRoPartBoNotEnough, modal: 'listRoPartBoNotEnough'},
      {code: TMSSTabs.vehicleSummaryReport, modal: 'vehicleSummaryReport'},
      {code: TMSSTabs.appointmentReport, modal: 'appointmentReport'},
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
      {code: TMSSTabs.listRoPartBoNotEnough, modal: 'listRoPartBoNotEnough'},
      {code: TMSSTabs.listRoPartBoNotEnough, modal: 'listRoPartBoNotEnough'},
      {code: TMSSTabs.vehicleSummaryReport, modal: 'vehicleSummaryReport'}
    ];
    // {
    //   code: 'DLR Service Report',
    //   list: [
    //     {
    //       functionName: 'Báo cáo lịch sử xuất nhập phụ tùng',
    //       functionCode: TMSSTabs.accessoryImportExportHistoryReport,
    //       needFilterFirst: 'reportInRangeDate',
    //       menuName: 'accessoryImportExportHistoryReport'
    //     },
    //     {
    //       functionName: 'BC kiểm kê PT tồn kho',
    //       functionCode: TMSSTabs.accessoryInventoryCheckReport,
    //       needFilterFirst: 'stockInventoryReportByPrice',
    //       menuName: 'accessoryInventoryCheckReport'
    //     },
    //     {
    //       functionName: 'BC xuất hàng',
    //       functionCode: TMSSTabs.outputReport,
    //       needFilterFirst: 'reportByAccessory',
    //       menuName: 'outputReport'
    //     },
    //     {
    //       functionName: 'BC lịch sử bán hàng 1 PT',
    //       functionCode: TMSSTabs.accessorySellingReport,
    //       needFilterFirst: 'reportByAccessory',
    //       menuName: 'accessorySellingReport'
    //     },
    //     {
    //       name: 'BC xuất bán lẻ',
    //       functionCode: TMSSTabs.retailSalesReport,
    //       needFilterFirst: 'reportByAccessory',
    //       menuName: 'retailSalesReport'
    //     },
    //     {
    //       name: 'BC đặt hàng của đại lý lên TMV',
    //       functionCode: TMSSTabs.dealerBookingToTmvReport,
    //       needFilterFirst: 'reportInRangeDate',
    //       menuName: 'dealerBookingToTmvReport'
    //     },
    //     {
    //       name: 'BC nhận hàng',
    //       functionCode: TMSSTabs.receiveReport,
    //       needFilterFirst: 'reportByAccessory',
    //       menuName: 'receiveReport'
    //     },
    //     {
    //       name: 'BC điều chỉnh số lượng PT',
    //       functionCode: TMSSTabs.accessoryAmountAdjustReport,
    //       needFilterFirst: 'reportInRangeDate',
    //       menuName: 'accessoryAmountAdjustReport'
    //     },
    //     {
    //       name: 'BC xuất nhập PT',
    //       functionCode: TMSSTabs.accessoryImportExportReport,
    //       needFilterFirst: 'reportByAccessory',
    //       menuName: 'accessoryImportExportReport'
    //     },
    //     {
    //       name: 'BC hàng TMV còn nợ',
    //       functionCode: TMSSTabs.tmvOutstandingReport,
    //       needFilterFirst: 'reportByAccessory',
    //       menuName: 'tmvOutstandingReport'
    //     },
    //     {
    //       name: 'BC tổng hợp đặt hẹn theo ngày',
    //       functionCode: TMSSTabs.bookReportByDay,
    //       needFilterFirst: 'reportWithTab',
    //       menuName: 'bookReportByDay'
    //     },
    //     {
    //       name: 'BC xe ra cổng',
    //       functionCode: TMSSTabs.carOutPortReport,
    //       needFilterFirst: 'reportInRangeDate',
    //       menuName: 'carOutPortReport'
    //     },
    //     {
    //       name: 'BC tỉ lệ cung cấp PT',
    //       functionCode: TMSSTabs.accessoryRateReport,
    //       needFilterFirst: 'reportInRangeDate',
    //       menuName: 'accessoryRateReport'
    //     },
    //     {
    //       name: 'BC tổng hợp RO theo ngày',
    //       functionCode: TMSSTabs.roGeneralReportByDay,
    //       needFilterFirst: 'reportInRangeDate',
    //       menuName: 'roGeneralReportByDay'
    //     },
    //     {
    //       name: 'BC tổng hợp bán lẻ PT',
    //       functionCode: TMSSTabs.accessoryRetailGeneralReport,
    //       needFilterFirst: 'reportInRangeDate',
    //       menuName: 'accessoryRetailGeneralReport'
    //     },
    //     {
    //       name: 'BC Service rate và R/O Fill rate theo ngày/năm',
    //       functionCode: TMSSTabs.serviceRateAndRoFillReportByYear,
    //       needFilterFirst: 'reportWithTab',
    //       menuName: 'serviceRateAndRoFillReportByYear'
    //     },
    //     {
    //       name: 'Danh sách RO chưa hoàn thành',
    //       functionCode: TMSSTabs.roUnfinishedReport,
    //       needFilterFirst: 'reportByMonth',
    //       menuName: 'roUnfinishedReport'
    //     },
    //     {
    //       name: 'BC tổng hợp liên hệ sau sữa chữa',
    //       functionCode: TMSSTabs.contactAfterRepairGeneralReport,
    //       needFilterFirst: 'reportInRangeDate',
    //       menuName: 'contactAfterRepairGeneralReport'
    //     },
    //     {
    //       name: 'BC kiểm kê tồn kho theo giá đích danh',
    //       functionCode: TMSSTabs.stockInventoryReportByPrice,
    //       needFilterFirst: 'stockInventoryReportByPrice',
    //       menuName: 'stockInventoryReportByPrice'
    //     },
    //     {
    //       name: 'Thời gian lưu kho hàng BO',
    //       functionCode: TMSSTabs.boStorageTime,
    //       needFilterFirst: 'reportInRangeDate',
    //       menuName: 'boStorageTime'
    //     },
    //     {
    //       name: 'Tỉ lệ cung cấp PT theo RO',
    //       functionCode: TMSSTabs.rateOfSupplyAccessoryByRo,
    //       needFilterFirst: 'reportByMonth',
    //       menuName: 'rateOfSupplyAccessoryByRo'
    //     },
    //     {
    //       name: 'Tỉ lệ cung cấp PT theo mã PT',
    //       functionCode: TMSSTabs.rateOfSupplyAccessoryByAccessoryCode,
    //       needFilterFirst: 'reportByMonth',
    //       menuName: 'rateOfSupplyAccessoryByAccessoryCode'
    //     },
    //     {
    //       name: 'BC lượt xe, khách hàng dịch vụ',
    //       functionCode: TMSSTabs.customerServiceReport,
    //       needFilterFirst: 'customerServiceReport'
    //     },
    //     {
    //       name: 'Danh sách RO có PT về đủ',
    //       functionCode: TMSSTabs.roListWithEnoughAccessory,
    //       needFilterFirst: 'reportInRangeDate',
    //       menuName: 'roListWithEnoughAccessory'
    //     },
    //     {
    //       name: 'Danh sách RO có PT về chưa đủ',
    //       functionCode: TMSSTabs.roListWithNotEnoughAccessory,
    //       needFilterFirst: 'reportInRangeDate',
    //       menuName: 'roListWithNotEnoughAccessory'
    //     },
    //     {
    //       name: 'BC phân cấp kiểm tra chất lượng theo đại lý',
    //       functionCode: TMSSTabs.checkQualityReportByDealer,
    //       needFilterFirst: 'reportInRangeDate',
    //       menuName: 'checkQualityReportByDealer'
    //     },
    //   ]
    // }

    this.systemAdminMenuList = [
      {
        code: 'System admin',
        list: [
          {functionName: 'Khai báo các chức năng hệ thống', functionCode: TMSSTabs.systemFunctionList},
          {functionName: 'Khai báo NSD và phân nhóm', functionCode: TMSSTabs.systemUserAndGroupDefinition},
          {functionName: 'Khai báo nhóm NSD và quyền hạn', functionCode: TMSSTabs.userGroupAndAuthority},
          {functionName: 'Khai báo IP', functionCode: TMSSTabs.declareIp}
          // {functionName: 'Khai báo user và phân quyền', functionCode: TMSSTabs.userManagement}
        ]
      }];

  }
}
