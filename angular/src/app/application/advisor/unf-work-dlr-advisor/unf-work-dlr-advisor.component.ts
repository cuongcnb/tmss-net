import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {EmployeeCommonApi} from '../../../api/common-api/employee-common.api';
import {UnfWorkAdvisorApi} from '../../../api/advisor/unf-work-advisor.api';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {LoadingService} from '../../../shared/loading/loading.service';
import {EventBusService} from '../../../shared/common-service/event-bus.service';
import {TMSSTabs} from '../../../core/constains/tabs';
import {forkJoin} from 'rxjs';
import {CustomerApi} from '../../../api/customer/customer.api';
import {DlrConfigApi} from '../../../api/common-api/dlr-config.api';
import {RoStateForUnfWork} from '../../../core/constains/ro-state';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'unf-work-dlr-advisor',
  templateUrl: './unf-work-dlr-advisor.component.html',
  styleUrls: ['./unf-work-dlr-advisor.component.scss']
})
export class UnfWorkDlrAdvisorComponent implements OnInit, OnChanges {
  tabs: Array<any>;
  selectedTab;
  form: FormGroup;
  advisors;
  fieldAppointmentInDay;
  appointmentInDayParams;
  selectedappointmentInDay;
  appointmentCusReq;
  unfinishWorkCusReq;
  fieldParts;
  partsAppointmentParams;
  partsUnfinishJobParams;

  fieldUnfinishWork;
  unfinishWorkParams;
  selectedUnfinishWork;

  fieldJob;
  jobParams;
  costDealer;
  isShowQuotation;

  constructor(private formBuilder: FormBuilder,
              private employeeCommonApi: EmployeeCommonApi,
              private unfWorkAdvisorApi: UnfWorkAdvisorApi,
              private dataFormatService: DataFormatService,
              private loadingService: LoadingService,
              private eventBus: EventBusService,
              private customerApi: CustomerApi,
              private dlrConfigApi: DlrConfigApi) {
    this.fieldAppointmentInDay = [
      {
        headerName: 'Thời gian',
        headerTooltip: 'Thời gian',
        field: 'arriveDate',
        width: 300,
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value)
      },
      {headerName: 'Số phiếu hẹn', headerTooltip: 'Số phiếu hẹn', field: 'dlrNo'},
      {headerName: 'Biến số xe', headerTooltip: 'Biến số xe', field: 'registerNo'},
      {headerName: 'Tên khách hàng', headerTooltip: 'Tên khách hàng', field: 'cusvisitName'},
      {headerName: 'Số điện thoại', headerTooltip: 'Số điện thoại', field: 'cusvisitTel', cellClass: ['text-right', 'cell-border', 'cell-readonly']},
      {headerName: 'Tình trạng hẹn', headerTooltip: 'Tình trạng hẹn', field: 'appointmentStatus'}
    ];
    this.fieldParts = [
      {headerName: 'Mã phụ tùng', headerTooltip: 'Mã phụ tùng', field: 'partscode'},
      {headerName: 'Tên phụ tùng', headerTooltip: 'Tên phụ tùng', field: 'partsname', width: 350},
      {headerName: 'C/hãng', headerTooltip: 'C/hãng', field: 'genuine'},
      {headerName: 'Loại PT', headerTooltip: 'Loại phụ tùng', field: 'gtypeCode'},
      {headerName: 'Đơn vị', headerTooltip: 'Đơn vị', field: 'unitName'},
      {headerName: 'Số lượng', headerTooltip: 'Số lượng', field: 'qty', cellClass: ['text-right', 'cell-border', 'cell-readonly']},
      {headerName: 'Thuế', headerTooltip: 'Thuế', field: 'taxRate', cellClass: ['text-right', 'cell-border', 'cell-readonly']},
      {
        headerName: 'Tổng tiền',
        headerTooltip: 'Tổng tiền',
        valueGetter: (params) => {
          return params.data.cost + params.data.cost * params.data.taxRate / 100;
        },
        cellClass: ['text-right', 'cell-border', 'cell-readonly'],
        tooltip: params => this.dataFormatService.moneyFormat(Math.round(params.value)),
        valueFormatter: params => this.dataFormatService.moneyFormat(Math.round(params.value))
      }
    ];
    this.fieldUnfinishWork = [
      {
        headerName: 'Ngày mở LSC',
        headerTooltip: 'Ngày mở LSC',
        field: 'openDate',
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value)
      },
      {headerName: 'Số LSC', headerTooltip: 'Số LSC', field: 'roNum'},
      {
        headerName: 'Biển số xe', headerTooltip: 'Biển số xe', field: 'registerNo',
        cellStyle: (params) => {
          if (params.data.arrivedate - new Date().getTime() > 0.250008 * 60 * 60 * 1000) {
            return {backgroundColor: 'yellow !important'};
          } else if (new Date().getTime() - params.data.arrivedate > 0.250008 * 60 * 60 * 1000) {
            return {backgroundColor: 'red !important'};
          } else if (params.data.arrivedate - new Date().getTime() <= 0.250008 * 60 * 60 * 1000) {
            return (params.data.status === 'X') ? {backgroundColor: 'blue !important'} : {backgroundColor: 'yellow !important'};
          }
        }
      },
      {headerName: 'Tên khách hàng', headerTooltip: 'Tên khách hàng', field: 'cusName'},
      {headerName: 'Số điện thoại', headerTooltip: 'Số điện thoại', field: 'cusTel', cellClass: ['text-right', 'cell-border', 'cell-readonly']},
      {headerName: 'Mã số thuế', headerTooltip: 'Mã số thuế', field: 'cusTaxCode'},
      {
        headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'roState',
        valueFormatter: params => {
          const matchData = RoStateForUnfWork.find(state => state.id === params.value);
          return matchData ? matchData.name : '';
        }
      }
    ];
    this.fieldJob = [
      {headerName: 'Kiểu CV', headerTooltip: 'Kiểu CV', field: 'wtypeName'},
      {headerName: 'Công việc', headerTooltip: 'Công việc', field: 'jobsname'},
      {headerName: 'Giờ công', headerTooltip: 'Giờ công', field: 'actualtime', cellClass: ['text-right', 'cell-border', 'cell-readonly']},
      {headerName: 'Thuế', headerTooltip: 'Thuế', field: 'taxRate', cellClass: ['text-right', 'cell-border', 'cell-readonly']},
      {
        headerName: 'Tổng tiền', headerTooltip: 'Tổng tiền', field: 'total', cellClass: ['text-right', 'cell-border', 'cell-readonly'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      }
    ];
  }

  ngOnInit() {
    this.employeeCommonApi.getEmpIsAdvisor().subscribe(val => {
      if (val) {
        this.advisors = val;
      }
    });
    this.buildForm();
    this.initTabs();
    this.getDealerConfig();
    this.isShowQuotation = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  selectTab(tab) {
    this.selectedTab = tab;
    this.appointmentInDayParams.api.sizeColumnsToFit();
    this.partsAppointmentParams.api.sizeColumnsToFit();
    this.unfinishWorkParams.api.sizeColumnsToFit();
    this.jobParams.api.sizeColumnsToFit();
    this.partsUnfinishJobParams.api.sizeColumnsToFit();
  }

  private initTabs() {
    this.tabs = ['Khách hẹn trong ngày', 'Công việc đang làm dở'];
    this.selectedTab = this.tabs[0];
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      date: [new Date()],
      advisorId: [undefined]
    });
  }

  getDealerConfig() {
    // this.dlrConfigApi.getByCurrentDealer().subscribe(res => {this.costDealer = (res) ? res[0].cost : 0;});
    this.dlrConfigApi.getCurrentByDealer().subscribe(res => {this.costDealer = (res) ? (res.cost || 0) : 0;});
  }

  search() {
    this.loadingService.setDisplay(true);
    if (this.selectedTab === this.tabs[0]) {
      this.unfWorkAdvisorApi.searchAppointment(this.form.value).subscribe(val => {
        if (val) {
          this.selectedappointmentInDay = null;
          this.partsAppointmentParams.api.setRowData([]);
          this.appointmentCusReq = null;
          this.appointmentInDayParams.api.setRowData(val);
          if (val.length) {
            this.appointmentInDayParams.api.getModel().rowsToDisplay[0].setSelected(true);
          }
        }
        this.loadingService.setDisplay(false);
      });
    } else {
      this.unfWorkAdvisorApi.searchUnfinishWork(this.form.value, this.isShowQuotation).subscribe(val => {
        if (val) {
          this.selectedUnfinishWork = null;
          this.partsUnfinishJobParams.api.setRowData([]);
          this.jobParams.api.setRowData([]);
          this.unfinishWorkCusReq = null;
          this.unfinishWorkParams.api.setRowData(val);
          if (val.length) {
            this.unfinishWorkParams.api.getModel().rowsToDisplay[0].setSelected(true);
          }
        }
        this.loadingService.setDisplay(false);
      });
    }
  }

  callbackAppointmentInDay(params) {
    this.appointmentInDayParams = params;
  }

  getAppointmentInDayParams() {
    const selected = this.appointmentInDayParams.api.getSelectedRows();
    if (selected) {
      this.selectedappointmentInDay = selected[0];
      this.selectAppointmentInDay();
    }
  }

  callbackPartAppointment(params) {
    this.partsAppointmentParams = params;
  }

  selectAppointmentInDay() {
    this.loadingService.setDisplay(true);
    this.appointmentCusReq = this.selectedappointmentInDay.requestDesc;

    this.unfWorkAdvisorApi.searchAppParts(this.selectedappointmentInDay.apmId).subscribe(val => {
      if (val) {
        this.partsAppointmentParams.api.setRowData(val);
      }
      this.loadingService.setDisplay(false);
    });
  }

  callbackUnfinishWork(params) {
    this.unfinishWorkParams = params;
    // this.unfinishWorkParams.api.setRowData([{
    //   registerNo: '12323131',
    //   arrivedate: new Date('03/20/2019').getTime(),
    // }])
  }

  getUnfinishWorkParams() {
    const selected = this.unfinishWorkParams.api.getSelectedRows();
    if (selected) {
      this.selectedUnfinishWork = selected[0];
      this.selectUnfinishWork();
    }
  }

  selectUnfinishWork() {
    this.loadingService.setDisplay(true);
    this.unfinishWorkCusReq = this.selectedUnfinishWork.reqDesc;
    forkJoin([
      this.unfWorkAdvisorApi.searchRoParts(this.selectedUnfinishWork.id),
      this.unfWorkAdvisorApi.searchJob(this.selectedUnfinishWork.id)
    ]).subscribe(res => {
      this.partsUnfinishJobParams.api.setRowData(res[0]);
      this.jobParams.api.setRowData(res[1]);
      this.loadingService.setDisplay(false);
    });


    // this.unfWorkAdvisorApi.seachParts(this.selectedUnfinishWork['cusvisitId']).subscribe(val => {
    //   if (val && val.length) {
    //     this.partsUnfinishJobParams.api.setRowData(val)
    //     this.loadingService.setDisplay(false)
    //   }
    // })
    // this.unfWorkAdvisorApi.searchJob(this.selectedUnfinishWork['id']).subscribe(val => {
    //   if (val && val.length) {
    //     this.jobParams.setRowData(val)
    //     this.loadingService.setDisplay(false)
    //   }
    // })
  }

  callbackJob(params) {
    this.jobParams = params;
  }

  callbackPartUnfinishJob(params) {
    this.partsUnfinishJobParams = params;
  }

  openProposal() {
    const obj = {
      cusId: this.selectedUnfinishWork.cusType === 1 ? Number(this.selectedUnfinishWork.cusId) : this.selectedUnfinishWork.customerId,
      roId: Number(this.selectedUnfinishWork.id),
      vehiclesId: Number(this.selectedUnfinishWork.vhcId),
      cusvsId: Number(this.selectedUnfinishWork.cusvisitId)
    };
    this.loadingService.setDisplay(true);
    this.customerApi.getCustomerDetail(obj).subscribe(val => {
      this.loadingService.setDisplay(false);
      this.eventBus.emit({
        type: 'openComponent',
        functionCode: TMSSTabs.proposal,
        customerInfo: Object.assign(val, {registerNo: this.selectedUnfinishWork.registerNo})
      })
      ;
    });
  }
}
