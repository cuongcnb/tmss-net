import {Component, OnInit, ViewChild} from '@angular/core';
import {EventBusService} from '../common-service/event-bus.service';
import {TMSSTabs} from '../../core/constains/tabs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'layout-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  @ViewChild('inOutGateReport', {static: false}) inOutGateReport;
  @ViewChild('warrantyDailyClaimReport', {static: false}) warrantyDailyClaimReport;
  @ViewChild('isLaborWages', {static: false}) isLaborWages;
  @ViewChild('isLaborWagesNation', {static: false}) isLaborWagesNation;
  @ViewChild('progressReportModal', {static: false}) progressReportModal;
  @ViewChild('progressChoosingModal', {static: false}) progressChoosingModal;
  @ViewChild('progressReport', {static: false}) progressReport;
  @ViewChild('importDataSurvey', {static: false}) importDataSurvey;
  @ViewChild('userListFunctionReport', {static: false}) userListFunctionReport;
  // warranty
  @ViewChild('vehicleRegistrationModal', {static: false}) vehicleRegistrationModal;
  @ViewChild('dlrUnclaimOrderModal', {static: false}) dlrUnclaimOrderModal;
  @ViewChild('contractFilterStartModal', {static: false}) contractFilterStartModal;
  @ViewChild('islistDealCar', {static: false}) islistDealCar;

  // SERVICE REPORT
  @ViewChild('customerServiceReport', {static: false}) customerServiceReport;
  @ViewChild('reportByMonth', {static: false}) reportByMonth;
  @ViewChild('reportInRangeDate', {static: false}) reportInRangeDate;
  @ViewChild('reportByAccessory', {static: false}) reportByAccessory;
  @ViewChild('reportWithTab', {static: false}) reportWithTab;
  @ViewChild('stockInventoryReportByPrice', {static: false}) stockInventoryReportByPrice;
  @ViewChild('partImportExportHistoryReport', {static: false}) partImportExportHistoryReport;
  @ViewChild('partImportExportReport', {static: false}) partImportExportReport;
  @ViewChild('partAmountAdjustmentReport', {static: false}) partAmountAdjustmentReport;
  @ViewChild('partSupplyRateByPartCodeReport', {static: false}) partSupplyRateByPartCodeReport;
  @ViewChild('partsCheckInventoryReport', {static: false}) partsCheckInventoryReport;
  @ViewChild('accessoryInventoryCheckReport', {static: false}) accessoryInventoryCheckReport;
  @ViewChild('outputReport', {static: false}) outputReport;
  @ViewChild('accessorySellingReport', {static: false}) accessorySellingReport;

  @ViewChild('partsSupplyRatioReport', {static: false}) partsSupplyRatioReport;
  @ViewChild('reportReceive', {static: false}) reportReceive;
  @ViewChild('roGeneralByDayReport', {static: false}) roGeneralByDayReport;
  @ViewChild('retailSalesReport', {static: false}) retailSalesReport;
  @ViewChild('oweTmvReport', {static: false}) oweTmvReport;
  @ViewChild('decentralizedInspectionAgentQuality', {static: false}) decentralizedInspectionAgentQuality;
  @ViewChild('partRetailGeneralReport', {static: false}) partRetailGeneralReport;
  @ViewChild('serviceRateAndRoFillReport', {static: false}) serviceRateAndRoFillReport;
  @ViewChild('roListWithFullPart', {static: false}) roListWithFullPart;
  @ViewChild('roUnfinishedReport', {static: false}) roUnfinishedReport;
  @ViewChild('timeStoreBo', {static: false}) timeStoreBo;
  @ViewChild('orderOfDlrToTmv', {static: false}) orderOfDlrToTmv;
  @ViewChild('listRoPartBoNotEnough', {static: false}) listRoPartBoNotEnough;
  @ViewChild('vehicleSummaryReport', {static: false}) vehicleSummaryReport;
  @ViewChild('appointmentReport', {static: false}) appointmentReport;

  @ViewChild('dlrReport', {static: false}) dlrReport;
  @ViewChild('cbuFilterStartModal', {static: false}) cbuFilterStartModal;
  @ViewChild('ckdFilterStartModal', {static: false}) ckdFilterStartModal;
  @ViewChild('vehicleArrivalFilterModal', {static: false}) vehicleArrivalFilterModal;
  @ViewChild('deliveryFilterStartModal', {static: false}) deliveryFilterStartModal;

  isPerfectScrollbar: boolean;
  isAlwaysShowSubmenu: boolean;
  reportFunction;
  tMSSTabs = TMSSTabs;
  constructor(private eventBus: EventBusService) {}

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    const bodyClassList = document.body.classList;

    if (window.innerWidth < 980) {
      bodyClassList.add('navigation-small');
    }
    this.isPerfectScrollbar = !(bodyClassList.contains('navigation-small') || window.innerWidth < 980);
  }

  openFilterModal(val) {
    this.reportFunction = val.reportFunction;
    setTimeout(() => this[val.modal].open(val.reportType));
  }

  collapseSidebar() {
    const bodyClassList = document.body.classList;
    this.isAlwaysShowSubmenu = !bodyClassList.contains('navigation-small');
    bodyClassList.contains('navigation-small') ? bodyClassList.remove('navigation-small') : bodyClassList.add('navigation-small');
    this.onResize();
  }

  openComponentAfterCloseModal(code, filterStartForm?) {
    console.log(filterStartForm)
    this.eventBus.emit({
      type: 'openComponent',
      functionCode: code,
      value: filterStartForm,
    });
  }
}
