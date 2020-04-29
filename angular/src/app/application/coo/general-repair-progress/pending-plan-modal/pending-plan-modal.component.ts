import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ViewRef} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {findLast} from 'lodash';

import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {EventBusService} from '../../../../shared/common-service/event-bus.service';
import {RoWshopApi} from '../../../../api/ro-wshop/ro-wshop.api';
import {ShopCommonApi} from '../../../../api/common-api/shop-common.api';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {RoWshopActApi} from '../../../../api/ro-wshop/ro-wshop-act.api';
import {TechWshopApi} from '../../../../api/tech-wshop/tech-wshop.api';
import {NameProgressByState, ProgressState} from '../../../../core/constains/progress-state';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {PendingReasonApi} from '../../../../api/pending-reason/pending-reason.api';
import {RepairOrderApi} from '../../../../api/quotation/repair-order.api';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {forkJoin} from 'rxjs';
import {TitleApi} from '../../../../api/common-api/title.api';
import { ActionTypeEmployee } from '../../../../core/constains/repair-progress';
import { WorkShopModel} from '../../../../core/models/repair-progress/wshop.model';
import {Times} from '../../../../core/constains/times';

import * as $ from 'jquery';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'pending-plan-modal',
  templateUrl: './pending-plan-modal.component.html',
  styleUrls: ['./pending-plan-modal.component.scss']
})
export class PendingPlanModalComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() refreshList = new EventEmitter();
  @Output() refreshRoNoPlanList = new EventEmitter();
  @ViewChild('pendingModal', {static: false}) modal;

  form: FormGroup;
  reasonForm: FormGroup;
  modalHeight: number;
  repairPlanData;
  employeeList = [];
  shops: Array<any> = [];
  shopsSelect: Array<any> = [];
  techWShop: Array<any> = [];
  reasons: Array<any> = [];
  isFromWaitingList: boolean;
  state = ProgressState.plan;
  ProgressState = ProgressState;
  NameProgressByState = NameProgressByState;
  subscription;
  changePlanToWorking;
  completeWorking;

  isCollapsedOther = false;
  isCollapsedFollow = false;
  isCollapsedPlan = false;
  isCollapsedWS = false;
  disableStartAll = true;
  disableEndAll = true;
  jobFieldGrid;
  partFieldGrid;
  wshop: WorkShopModel;
  actionTypeEmployee = ActionTypeEmployee;
  data_modal: any;

  constructor(
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private pendingReasonApi: PendingReasonApi,
    private roWshopApi: RoWshopApi,
    private roWshopActApi: RoWshopActApi,
    private techWshopApi: TechWshopApi,
    private shopApi: ShopCommonApi,
    private loadingService: LoadingService,
    private setModalHeightService: SetModalHeightService,
    private eventBusService: EventBusService,
    private repairOrderApi: RepairOrderApi,
    public dataFormatService: DataFormatService,
    private cdr: ChangeDetectorRef,
    private titleApi: TitleApi
  ) {
    this.jobFieldGrid = [
      {headerName: 'Mã công việc', headerTooltip: 'Mã công việc', field: 'jobcode'},
      {headerName: 'Tên công việc', headerTooltip: 'Tên công việc', field: 'jobsname'}
    ];
    this.partFieldGrid = [
      {headerName: 'Phụ tùng', headerTooltip: 'Phụ tùng', field: 'partsname'},
      {headerName: 'Số lượng', headerTooltip: 'Số lượng', field: 'qty'}
    ];
  }

  ngOnInit() {
    this.subscription = this.eventBusService.on('openStoppedPlanModal').subscribe(val => {
      this.initDataWhenOpenModal(val.data, val.shops);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!(this.cdr as ViewRef).destroyed) {
        this.cdr.detectChanges();
      }
    }, 0);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  close() {
    if (this.isFromWaitingList) {
      this.loadingService.setDisplay(true);
      this.refreshRoNoPlanList.emit();
    }
    this.refreshList.emit();
    this.employeeList = [];
    this.modal.hide();
  }


  initDataWhenOpenModal(val, shops) {
    this.data_modal = val;
    this.shops = shops;
    // this.loadingService.setDisplay(false);
    this.buildForm();
    this.modal.show();
    this.onResize();
  }

  open(val, shops) {
    this.initDataWhenOpenModal(val, shops);
  }


  callbackGridJob(params) {
    if (this.repairPlanData.jobsList.length) {
      // const data = this.repairPlanData.jobsList.filter(it => it.status === 'Y');
      params.api.setRowData(this.repairPlanData.jobsList);
    }
  }

  callbackGridPart(params) {
    if (this.repairPlanData.partsList.length) {
      params.api.setRowData(this.repairPlanData.partsList);
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      fromTime: [this.dataFormatService.formatDate(new Date())],
      wshopId: [this.data_modal.wshopId]
    });
    console.log(this.form.value.fromDateTime)
    // this.form.patchValue(this.data_modal);
    
  }

  initDataEmployee() {
    for (let i = 0; i < this.employeeList.length; i++) {
      this.employeeList[i].actionType = this.actionTypeEmployee.add_or_update;
      if (this.employeeList[i].actualFromTime || this.employeeList[i].actualToTime) {
        this.employeeList[i].disable_start_button = true;
      } else {
        this.disableStartAll = false;
        this.employeeList[i].disable_start_button = false;
      }

      if (this.employeeList[i].actualToTime) {
        this.employeeList[i].disable_end_button = true;
      } else {
        this.disableEndAll = false;
        this.employeeList[i].disable_end_button = false;
      }
    }
  }

  getEmployee(data) {
    for (let i = 0; i < data.length; i++) this.employeeList.push(data[i]);
  }

  removeEmployee(emp, index) {
    if (this.state == this.ProgressState.actual) {
      this.swalAlertService.openFailToast("Xe đang thực hiện, không thể thay đổi kế hoạch!");
    } else {
      if (emp.new_employ) this.employeeList.splice(index, 1);
      else {
        emp.actionType = this.actionTypeEmployee.remove;
      }
    }
    
  }
  

  getDateValue(time) {
    if(!time) return null;
    else return time;
  }

  getEmploylistInWs() {
    if (this.form) {
      this.employeeList = [];
      for (let i = 0; i < this.techWShop.length; i++) {
        if (this.techWShop[i].wshopId == this.form.value.wshopId) {
          this.employeeList.push(this.techWShop[i]);
        }
      }
    }
    
  }

  caculateToTime() {
    let a = Math.round(this.form.value.fromDateTime.getTime() + Number(this.data_modal.estimateTime) * Times.minTimeStamp)
    console.log(a)
  }
  createJobScc() {
    let toTime = Math.round(this.form.value.fromTime + Number(this.data_modal.estimateTime) * Times.minTimeStamp);
    let data = {
      fromDatetime: this.form.value.fromTime,
      toDatetime: toTime,
      wpId: this.data_modal.wpId,
      wshopId: this.form.value.wshopId
    }
    this.roWshopActApi.activePlanScc(data).subscribe(() => {
      this.swalAlertService.openSuccessToast("Tạo kế hoạch thành công");
      this.refreshList.emit();
      this.employeeList = [];
      this.modal.hide();
    });
    
  }
}
