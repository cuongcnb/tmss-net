import {Component, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {EmployeeCommonApi} from '../../../api/common-api/employee-common.api';
import {UnfWorkAdvisorApi} from '../../../api/advisor/unf-work-advisor.api';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {LoadingService} from '../../../shared/loading/loading.service';
import {EventBusService} from '../../../shared/common-service/event-bus.service';
import {CustomerApi} from '../../../api/customer/customer.api';
import {RoWshopApi} from '../../../api/ro-wshop/ro-wshop.api';
import {forkJoin} from 'rxjs';
import {TechWshopApi} from '../../../api/tech-wshop/tech-wshop.api';
import {ShopCommonApi} from '../../../api/common-api/shop-common.api';
import { RoType } from '../../../core/constains/progress-state';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'info-general-repair-progress',
  templateUrl: './info-general-repair-progress.component.html',
  styleUrls: ['./info-general-repair-progress.component.scss']
})
export class InfoGeneralRepairProgressComponent implements OnInit, OnChanges {
  @ViewChild('infoDongsonModal', {static: false}) infoDongsonModal;
  @ViewChild('infoGeneralRepairModal', {static: false}) infoGeneralRepairModal;
  tabs: Array<any>;
  selectedTab;
  form: FormGroup;
  advisors;
  division;

  field;

  waittingJobSccParams;
  selectedWaittingJobSccParams;

  jobSccParams;
  selectedJobScc;

  waittingJobBpParams;
  selectedWaittingJobBpParams;

  progressBpParams;
  selectedProgressBpParams;


  fieldJob;

  jobPendingParams;
  selectedJobPendingParams;

  waitHandingParams;
  selectedWaitHandingParams;

  listRoType = [1, 2];

  constructor(private formBuilder: FormBuilder,
              private employeeCommonApi: EmployeeCommonApi,
              private unfWorkAdvisorApi: UnfWorkAdvisorApi,
              private dataFormatService: DataFormatService,
              private loadingService: LoadingService,
              private eventBus: EventBusService,
              private customerApi: CustomerApi,
              private techWshopApi: TechWshopApi,
              private shopApi: ShopCommonApi,
              private roWshopApi: RoWshopApi) {
    this.field = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        cellRenderer: params => params.rowIndex + 1,
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        maxWidth: 40
      },
      {
        headerName: 'Số RO',
        headerTooltip: 'Số RO',
        field: 'repairorderno'
      },
      {headerName: 'Biến số xe', headerTooltip: 'Biến số xe', field: 'registerno'},
      {headerName: 'Model', headerTooltip: 'Model', field: 'fullmodel'},
      {
        headerName: 'TGBD',
        headerTooltip: 'TGBD',
        field: 'fromDate',
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value)
      },
      {
        headerName: 'TGKT', headerTooltip: 'TGKT', field: 'toDate',
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value)
      },
      {
        headerName: 'DKGX', headerTooltip: 'DKGX', field: 'cardelivery',
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value)
      },
      {headerName: 'CVDV', headerTooltip: 'Cố vấn dịch vụ', field: 'empName', minWidth: 200},
      {headerName: 'KTV', headerTooltip: 'KTV', field: 'techName'},
      {headerName: 'Yêu cầu', headerTooltip: 'Yêu cầu', field: 'notes'}
    ];

    this.fieldJob = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        cellRenderer: params => params.rowIndex + 1,
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        maxWidth: 40
      },
      {
        headerName: 'Số RO',
        headerTooltip: 'Số RO',
        field: 'repairorderno'
      },
      {
        headerName: 'Kiểu RO',
        headerTooltip: 'Kiểu RO',
        field: 'rotype',
        valueFormatter: params => params.value === '2' ? 'Sửa chữa chung' : 'Đồng sơn'
      },
      {headerName: 'Biến số xe', headerTooltip: 'Biến số xe', field: 'registerno'},
      {headerName: 'Model', headerTooltip: 'Model', field: 'fullmodel'},
      {
        headerName: 'TGBD', headerTooltip: 'TGBD', field: 'fromDate',
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value)
      },
      {
        headerName: 'TGKT', headerTooltip: 'TGKT', field: 'toDate',
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value)
      },
      {
        headerName: 'DKGX',
        headerTooltip: 'DKGX',
        field: 'cardelivery',
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value)
      },

      {headerName: 'CVDV', headerTooltip: 'Cố vấn dịch vụ', field: 'empName', minWidth: 200},
      {headerName: 'KTV', headerTooltip: 'KTV', field: 'techName'},
      {headerName: 'Yêu cầu', headerTooltip: 'Yêu cầu', field: 'reasoncontent'}
    ];

  }

  ngOnInit() {
    this.employeeCommonApi.getEmpIsAdvisor().subscribe(val => {
      if (val) {
        this.advisors = val;
      }
    });

    this.employeeCommonApi.getEmpByCurrentDlr().subscribe(val => {
      if (val) {
        this.division = val;
      }
    });
    this.buildForm();
    this.initTabs();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  selectTab(tab) {
    this.selectedTab = tab;
    this.waittingJobSccParams.api.sizeColumnsToFit();
    this.jobSccParams.api.sizeColumnsToFit();
    this.jobPendingParams.api.sizeColumnsToFit();
    this.progressBpParams.api.sizeColumnsToFit();
    this.waitHandingParams.api.sizeColumnsToFit();
    this.waittingJobBpParams.api.sizeColumnsToFit();

  }

  private initTabs() {
    this.tabs = ['1. Chờ giao việc - SCC', '2. Tiến độ - SCC', '3. Chờ giao việc - BP', '4. Tiến độ - BP', '5. Công việc dừng', '6. Chờ giao KH'];
    this.selectedTab = this.tabs[0];
  }


  callbackWaittingJobScc(params) {
    this.waittingJobSccParams = params;
    this.waittingJobSccParams.api.setRowData([]);
  }

  callbackWaittingJobBp(params) {
    this.waittingJobBpParams = params;
    this.waittingJobBpParams.api.setRowData([]);
  }

  callbackJobPending(params) {
    this.jobPendingParams = params;
    this.jobPendingParams.api.setRowData([]);
  }

  callbackWaitHanding(params) {
    this.waitHandingParams = params;
    this.waitHandingParams.api.setRowData([]);
  }

  callbackProgressBp(params) {
    this.progressBpParams = params;
    this.progressBpParams.api.setRowData([]);
  }

  getWaittingJobSccParams() {
    const selected = this.waittingJobSccParams.api.getSelectedRows();
    if (selected) {
      this.selectedWaittingJobSccParams = selected[0];
    }
  }

  getWaittingJobBpParams() {
    const selected = this.waittingJobBpParams.api.getSelectedRows();
    if (selected) {
      this.selectedWaittingJobBpParams = selected[0];
    }
  }

  getProgressBpParams() {
    const selected = this.progressBpParams.api.getSelectedRows();
    if (selected) {
      this.selectedProgressBpParams = selected[0];
    }
  }

  getJobPendingParams() {
    const selected = this.jobPendingParams.api.getSelectedRows();
    if (selected) {
      this.selectedJobPendingParams = selected[0];
    }
  }

  getWaitHandingParams() {
    const selected = this.waitHandingParams.api.getSelectedRows();
    if (selected) {
      this.selectedWaitHandingParams = selected[0];
    }
  }


  callbackJobScc(params) {
    this.jobSccParams = params;
    this.jobSccParams.api.setRowData([]);
  }

  getJobScc() {
    const selected = this.jobSccParams.api.getSelectedRows();
    if (selected) {
      this.selectedJobScc = selected[0];
    }
  }

  searchWaittingJobScc() {
    const obj = {
      empId: this.form.get('empId').value,
      registerno: this.form.get('registerno').value,
      repairorderno: this.form.get('repairorderno').value
    };
    this.roWshopApi.searchRepairInfo('scc', obj).subscribe(res => {
      if (res) {
        this.waittingJobSccParams.api.setRowData(res);
      }
    });

  }

  searchWaittingJobBp() {
    const obj = {
      empId: this.form.get('waittingJobBpEmpId').value,
      registerno: this.form.get('waittingJobBpRegisterno').value,
      repairorderno: this.form.get('waittingJobBpRepairorderno').value
    };
    this.roWshopApi.searchRepairInfo('ds', obj).subscribe(res => {
      if (res) {
        this.waittingJobBpParams.api.setRowData(res);
      }
    });

  }

  private buildForm() {
    this.form = this.formBuilder.group({
      empId: null,
      registerno: [null],
      repairorderno: [null],

      // JobScc
      jobSccEmpId: null,
      jobSccRegisterno: [null],
      jobSccRepairorderno: [null],
      jobSccTechId: [null],

      // WaittingJobBp
      waittingJobBpEmpId: null,
      waittingJobBpRegisterno: [null],
      waittingJobBpRepairorderno: [null],

      // ProgressBp
      progressBpEmpId: null,
      progressBpRegisterno: [null],
      progressBpRepairorderno: [null],
      progressBpTechId: [null],

      // WaitHanding
      waitHandingEmpId: null,
      waitHandingRegisterno: [null],
      waitHandingRepairorderno: [null],
      waitHandingTechId: [null],
      waitHandingRoType: [null],

      customerReviews: [{value: null, disabled: true}],
      waitPart: [{value: null, disabled: true}],
      waitDs: [{value: null, disabled: true}],
      waitOutsource: [{value: null, disabled: true}],
      reason: [{value: null, disabled: true}],

      // JobPending
      jobPendingEmpId: null,
      jobPendingRegisterno: [null],
      jobPendingRepairorderno: [null],
      jobPendingTechId: [null],
      jobPendingRoType: [null]
    });
  }

  searchJobScc() {
    const obj = {
      empId: this.form.get('jobSccEmpId').value,
      techId: this.form.get('jobSccTechId').value,
      registerno: this.form.get('jobSccRegisterno').value,
      repairorderno: this.form.get('jobSccRepairorderno').value
    };
    this.roWshopApi.searchActualInfo('scc', obj).subscribe(res => {
      if (res) {
        res.forEach(it => it.techName = (it.empList ? it.empList.map(i => i.empName) : []).join(', '));
        this.jobSccParams.api.setRowData(res);
      }
    });

  }

  searchProgressBp() {
    const obj = {
      empId: this.form.get('progressBpEmpId').value,
      techId: this.form.get('progressBpTechId').value,
      registerno: this.form.get('progressBpRegisterno').value,
      repairorderno: this.form.get('progressBpRepairorderno').value
    };
    this.roWshopApi.searchActualInfo('ds', obj).subscribe(res => {
      if (res) {
        res.forEach(it => it.techName = (it.empList ? it.empList.map(i => i.empName) : []).join(', '));
        this.progressBpParams.api.setRowData(res);
      }
    });

  }

  searchWaitHanding() {
    const obj = {
      empId: this.form.get('waitHandingEmpId').value,
      techId: this.form.get('waitHandingTechId').value,
      registerno: this.form.get('waitHandingRegisterno').value,
      repairorderno: this.form.get('waitHandingRepairorderno').value,
      roType: this.form.get('waitHandingRoType').value
    };
    this.roWshopApi.searchWaitDelivery(obj).subscribe(res => {
      if (res) {
        res.forEach(it => it.techName = (it.empList ? it.empList.map(i => i.empName) : []).join(', '));
        this.waitHandingParams.api.setRowData(res);
      }
    });

  }

  searchJobPending() {
    const obj = {
      empId: this.form.get('jobPendingEmpId').value,
      techId: this.form.get('jobPendingTechId').value,
      registerno: this.form.get('jobPendingRegisterno').value,
      repairorderno: this.form.get('jobPendingRepairorderno').value,
      roType: this.form.get('jobPendingRoType').value
    };
    forkJoin([
      this.shopApi.getAllSccShop(),
      this.techWshopApi.getTechWshopByDlr(RoType.SCC),
      this.roWshopApi.searchPedingWork(obj),
    ]).subscribe(res => {
      let techWShop;
      techWShop = res[1] ? res[1] : [];
      let shops;
      shops = res[0] ? res[0] : [];
      let jobs;
      jobs = res[2] ? res[2] : [];
      jobs.map(it => {
        const shop = shops.find(itt => itt.wshopId === it.mapId);
        const emp = techWShop.filter(itt => itt.wshopId === it.mapId);
        if (shop) {
          it.wsName = shop.wsName;
        }

        if (emp) {
          const listEmpName = [];
          emp.forEach(itt => listEmpName.push(itt.empName));
          it.techName = listEmpName.join(', ');
        }
      });
      this.form.patchValue({
        customerReviews: res[2].filter(it => it.brtype === '1').length,
        waitPart: res[2].filter(it => it.brtype === '2').length,
        waitDs: res[2].filter(it => it.brtype === '3').length,
        waitOutsource: res[2].filter(it => it.brtype === '4').length,
        reason: res[2].filter(it => it.brtype === '5').length
      });
      res.forEach(it => it.techName = (it.empList ? it.empList.map(i => i.empName) : []).join(', '));
      this.jobPendingParams.api.setRowData(jobs);
    });
    // this.roWshopApi.searchPedingWork(obj).subscribe(res => {
    //   if (res) {
    //     this.form.patchValue({
    //       customerReviews: res.filter(it => it.brtype === '1').length,
    //       waitPart: res.filter(it => it.brtype === '2').length,
    //       waitDs: res.filter(it => it.brtype === '3').length,
    //       waitOutsource: res.filter(it => it.brtype === '4').length,
    //       reason: res.filter(it => it.brtype === '5').length
    //     });
    //     res.forEach(it => it.techName = (it.empList ? it.empList.map(i => i.empName) : []).join(', '));
    //     this.jobPendingParams.api.setRowData(res);
    //   }
    // });

  }

  /*---------------------------*/

  cellDoubleClickedDS(params) {
    this.infoDongsonModal.open(params.data.wpId);
  }

  cellDoubleClickedSCC(params) {
    this.infoGeneralRepairModal.open(params.data.wpId, null, null, params.data.mapId, params.data.roWshopId);
  }

  cellDoubleClick(params) {
    params.data.rotype === '1' ? this.infoDongsonModal.open(params.data.wpId) : this.infoGeneralRepairModal.open(params.data.wpId);
  }

}
