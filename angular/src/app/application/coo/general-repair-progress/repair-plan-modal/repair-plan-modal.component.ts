import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ViewRef, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { findLast } from 'lodash';

import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { EventBusService } from '../../../../shared/common-service/event-bus.service';
import { RoWshopApi } from '../../../../api/ro-wshop/ro-wshop.api';
import { ShopCommonApi } from '../../../../api/common-api/shop-common.api';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { RoWshopActApi } from '../../../../api/ro-wshop/ro-wshop-act.api';
import { TechWshopApi } from '../../../../api/tech-wshop/tech-wshop.api';
import { NameProgressByState, ProgressState, RoType } from '../../../../core/constains/progress-state';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { PendingReasonApi } from '../../../../api/pending-reason/pending-reason.api';
import { RepairOrderApi } from '../../../../api/quotation/repair-order.api';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { forkJoin } from 'rxjs';
import { TitleApi } from '../../../../api/common-api/title.api';
import { ActionTypeEmployee } from '../../../../core/constains/repair-progress';
import { WorkShopModel } from '../../../../core/models/repair-progress/wshop.model';
import { ConfirmService } from '../../../../shared/confirmation/confirm.service';
import * as moment from 'moment';
declare var $: any;
declare var jQuery: any;


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'repair-plan-modal',
  templateUrl: './repair-plan-modal.component.html',
  styleUrls: ['./repair-plan-modal.component.scss']
})
export class RepairPlanModalComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() refreshList = new EventEmitter();
  @Output() refreshRoNoPlanList = new EventEmitter();
  @Input() openOnEvenbus = true;
  @ViewChild('repairPlanModal', { static: false }) modal;
  @ViewChild('repairAriseModal', { static: false }) repairAriseModal;
  @ViewChild('employeeListModal', { static: false }) employeeListModal;

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
  stopPosition;
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
  jobs = [];
  jobsDefault = [];
  information;
  id;
  data_time = {};
  actionTypeEmployee = ActionTypeEmployee;
  planId: any;
  actualId: any;
  disabled_form = false;
  wait_employess = [];
  messeage_notification = "";
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
    private titleApi: TitleApi,
    private confirmService: ConfirmService,
  ) {
    this.jobFieldGrid = [
      { headerName: 'Mã công việc', headerTooltip: 'Mã công việc', field: 'jobcode' },
      { headerName: 'Tên công việc', headerTooltip: 'Tên công việc', field: 'jobsname' }
    ];
    this.partFieldGrid = [
      { headerName: 'Phụ tùng', headerTooltip: 'Phụ tùng', field: 'partsname' },
      { headerName: 'Số lượng', headerTooltip: 'Số lượng', field: 'qty' }
    ];
  }

  ngOnInit() {
    if (this.openOnEvenbus) {
      this.subscription = this.eventBusService.on('openRepairPlanModal').subscribe(val => {
        this.stopPosition = val.stopPosition || null;
        this.changePlanToWorking = val.changePlanToWorking || null;
        this.completeWorking = val.completeWorking || null;
        console.log(val)
        this.initDataWhenOpenModal(val.planId, val.state, false, val.wshopId, val.id, val.actualId);
      });
    }

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

  get canStart() {
    return this.state !== ProgressState.complete && this.state !== ProgressState.actual;
  }

  get canStop() {
    return this.state !== ProgressState.complete && this.state !== ProgressState.plan;
  }

  close() {
    if (this.isFromWaitingList) {
      this.loadingService.setDisplay(true);
      this.refreshRoNoPlanList.emit();
    }
    this.refreshList.emit();
    this.disabled_form = false;
    this.employeeList = [];
    this.wait_employess = [];
    this.openCollapsed();
    this.employeeListModal.close();
    this.modal.hide();
  }


  initDataWhenOpenModal(planId, state, isFromWaitingList, shopIndex?, id?, actualId?) {
    this.state = state;
    this.id = id;
    this.actualId = actualId;
    this.isFromWaitingList = isFromWaitingList;
    this.planId = planId;

    if ([ProgressState.performed, ProgressState.stopInside, ProgressState.stopOutside, ProgressState.complete].includes(state)) {
      this.disabled_form = true;
    }
    this.techWshopApi.getTechWshopByDlr(RoType.SCC).subscribe(res => this.techWShop = res.filter(it => it)),
      this.pendingReasonApi.getAll().subscribe(reasons => this.reasons = reasons.map(item => {
        return {
          text: item.name,
          value: item.id
        };
      }));
    forkJoin([
      this.shopApi.getAllSccShop(),
      this.techWshopApi.getTechWshopByDlr(RoType.SCC),
      this.roWshopApi.getRepairPlan(planId, this.actualId, this.state)
    ]).subscribe(res => {
      this.techWShop = res[1].filter(it => it) || [];

      this.shops = res[0].map(shop => {
        return {
          ...shop, ...{
            emps: res[1] && res[1].length ? res[1].filter(item => item && item.wshopId === shop.id) : []
          }
        };
      });

      this.information = res[2].information;
      this.jobs = res[2].information ? res[2].information.listPlans : [];
      this.employeeList = res[2].employeeList ? res[2].employeeList : [];
      this.wshop = res[2].wshop ? res[2].wshop : {};

      this.initDataEmployee();

      if (this.jobs) {
        const lastEl = findLast(this.jobs, el => {
          return el.roWshopId === id;
        });
        this.jobs.map(it => {
          const shop = this.shops.find(item => item.id === it.wshopId);
          it.empName = shop ? shop.emps.map(itt => itt.empName).join(',') : '';
          it.disabled = (lastEl && it.id === lastEl.id && it.roWshopId === lastEl.roWshopId);
          return it;
        });
        this.jobsDefault = this.jobs;
      }
      this.loadingService.setDisplay(false);
      this.modal.show();
      this.onResize();
      this.buildForm(res[2].information, shopIndex);
      this.buildReasonForm(res[2].information);
      this.repairPlanData = res[2];
    });
  }

  open(wpId, state, isFromWaitingList, shopIndex?, id?) {
    this.stopPosition = null;
    this.initDataWhenOpenModal(wpId, state, isFromWaitingList, shopIndex, id);
  }

  updatePlan(data) {
    if (this.form.invalid) {
      return;
    }
    const obj = {
      id: data.id,
      fromDatetime: data.fromDatetime,
      toDatetime: data.toDatetime,
      wshopId: data.wshopId
    };
    this.loadingService.setDisplay(true);
    this.roWshopApi.changePlanScc(obj,
      this.form.value.isCarWash === true ? 'Y' : 'N',
      this.form.value.isCusWait === true ? 'Y' : 'N',
      this.form.value.isTakeParts === true ? 'Y' : 'N',
      this.form.value.qcLevel).subscribe(() => {
        this.loadingService.setDisplay(false);
        this.refreshList.emit();
        this.disabled_form = false;
        this.openCollapsed();
        this.modal.hide();
      });
  }

  getTechByWshopId(id, roType) {
    if (id) {
      this.techWshopApi.getTechByWshopId(id, roType).subscribe(emps => {
        if (emps && emps.length) {
          let result = '';
          emps.map((emp, idx) => result += `${idx ? ', ' : ''}${emp.empName}`);
          this.form.patchValue({
            ktv: result
          });
        } else {
          this.form.patchValue({
            ktv: ''
          });
        }
      });
    }
  }

  callbackGridJob(params) {
    if (this.repairPlanData.jobsList && this.repairPlanData.jobsList.length) {
      // const data = this.repairPlanData.jobsList.filter(it => it.status === 'Y');
      params.api.setRowData(this.repairPlanData.jobsList);
    }
  }

  callbackGridPart(params) {
    if (this.repairPlanData.partsList.length) {
      params.api.setRowData(this.repairPlanData.partsList);
    }
  }

  // startJob(data) {
  //   if (this.form.invalid) {
  //     return;
  //   }
  //   if (!this.form.value.wshopId) {
  //     this.swalAlertService.openFailToast('Bạn phải nhập khoang');
  //     return;
  //   }
  // plan.wshopId = this.form.value.roWshopActId
  //   const apiCall = (this.state === ProgressState.stopOutside || this.state === ProgressState.stopInside) ?
  //     this.roWshopActApi.changeStateJobScc({
  //         id: data.id,
  //         wshopActId: data.roWshopsId,
  //         state: ProgressState.actual
  //       }, this.form.value.isCarWash === true ? 'Y' : 'N',
  //       this.form.value.isCusWait === true ? 'Y' : 'N',
  //       this.form.value.isTakeParts === true ? 'Y' : 'N',
  //       this.form.value.qcLevel) :
  //     this.roWshopActApi.startSccJob({
  //         id: data.id,
  //         wshopId: data.wshopId,
  //         fromDatetime: data.fromDatetime,
  //         toDatetime: data.toDatetime
  //       },
  //       this.form.value.isCarWash === true ? 'Y' : 'N',
  //       this.form.value.isCusWait === true ? 'Y' : 'N',
  //       this.form.value.isTakeParts === true ? 'Y' : 'N',
  //       this.form.value.qcLevel);

  //   this.loadingService.setDisplay(true);
  //   apiCall.subscribe(() => {
  //     this.loadingService.setDisplay(false);
  //     this.modal.hide();
  //     this.refreshList.emit();
  //   });
  // }

  finishJob(data) {
    if (this.form.invalid) {
      return;
    }
    this.loadingService.setDisplay(true);
    this.roWshopActApi.finishSccJob({ id: data.id }, this.form.value.isCarWash === true ? 'Y' : 'N',
      this.form.value.isCusWait === true ? 'Y' : 'N',
      this.form.value.isTakeParts === true ? 'Y' : 'N',
      this.form.value.qcLevel).subscribe(() => {
        this.loadingService.setDisplay(false);
        this.swalAlertService.openSuccessToast();
        this.disabled_form = false;
        this.openCollapsed();
        this.modal.hide();
        this.refreshList.emit();
      });
  }

  freePlanScc(plan) {
    if (this.form.invalid) {
      return;
    }
    this.loadingService.setDisplay(true);
    this.roWshopActApi.freePlanScc({ id: plan.id },
      this.form.value.isCarWash === true ? 'Y' : 'N',
      this.form.value.isCusWait === true ? 'Y' : 'N',
      this.form.value.isTakeParts === true ? 'Y' : 'N',
      this.form.value.qcLevel).subscribe(() => {
        this.loadingService.setDisplay(false);
        this.disabled_form = false;
        this.openCollapsed();
        this.modal.hide();
        this.refreshList.emit();
        this.refreshRoNoPlanList.emit();
      });
  }

  activePlanScc(data) {
    if (this.form.invalid) {
      return;
    }
    if (!this.form.value.fromDatetime || !this.form.value.toDatetime || (this.form.value.fromDatetime === 0 && this.form.value.toDatetime === 0)) {
      this.swalAlertService.openFailToast('Bạn phải nhập giờ bắt đầu và kết thúc');
      return;
    }

    if (!this.form.value.wshopId) {
      this.swalAlertService.openFailToast('Bạn phải nhập khoang');
      return;
    }

    this.loadingService.setDisplay(true);
    this.roWshopActApi.activePlanScc({
      id: data.id,
      wshopId: data.wshopId,
      fromDatetime: data.fromDatetime,
      toDatetime: data.toDatetime
    },
      this.form.value.isCarWash === true ? 'Y' : 'N',
      this.form.value.isCusWait === true ? 'Y' : 'N',
      this.form.value.isTakeParts === true ? 'Y' : 'N',
      this.form.value.qcLevel).subscribe(() => {
        this.loadingService.setDisplay(false);
        this.disabled_form = false;
        this.openCollapsed();
        this.modal.hide();
        this.refreshList.emit();
        this.refreshRoNoPlanList.emit();
      });
  }

  stopJobScc(data?) {
    const obj = {
      actualStartedId: this.actualId,
      newState: this.reasonForm.value.isRelease ? ProgressState.stopOutside : ProgressState.stopInside,
      pendingReasonNote: this.reasonForm.value.pendingReasonNote,
      pendingReasonType: this.reasonForm.value.pendingReasonType,
      fromDateTime: this.reasonForm.value.fromDateTime,
    };

    if (!obj.pendingReasonType) {
      this.swalAlertService.openWarningToast('Cần lý do để dừng công việc');
      return;
    }

    this.loadingService.setDisplay(true);
    this.roWshopActApi.changeStateJobScc(obj).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.disabled_form = false;
      this.openCollapsed();
      this.modal.hide();
      this.refreshList.emit();
    });
  }

  removePlan() {
    this.loadingService.setDisplay(true);
    this.roWshopApi.removePlanScc(this.form.value.id).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.disabled_form = false;
      this.openCollapsed();
      this.modal.hide();
      this.refreshList.emit();
      this.refreshRoNoPlanList.emit();
    });
  }

  private buildForm(val, shopIndex?) {
    console.log(this.wshop)
    this.form = this.formBuilder.group({
      id: [{ value: undefined, disabled: this.disabled_form }],
      registerno: [{ value: undefined, disabled: this.disabled_form }],
      repairorderno: [{ value: undefined, disabled: this.disabled_form }],
      empName: [{ value: undefined, disabled: true }],
      cusName: [{ value: undefined, disabled: this.disabled_form }],
      mobil: [{ value: undefined, disabled: this.disabled_form }],
      tel: [{ value: undefined, disabled: this.disabled_form }],
      cmName: [{ value: undefined, disabled: this.disabled_form }],
      km: [{ value: undefined, disabled: this.disabled_form }],
      getInDate: [{ value: undefined, disabled: true }],
      printDate: [{ value: undefined, disabled: true }],
      gxDate: [{ value: undefined, disabled: true }],
      fromDatetime: [{ value: undefined, disabled: true }],
      toDatetime: [{ value: undefined, disabled: true }],
      state: [{ value: undefined, disabled: true }],
      wshopId: [{ value: undefined, disabled: true }],
      roWshopActId: [{ value: undefined, disabled: true }],
      roWshopId: [{ value: undefined, disabled: true }],
      ktv: [{ value: undefined, disabled: true }],
      isCusWait: [{ value: undefined, disabled: true }],

      isPriority: [{ value: undefined, disabled: true }],
      isCarWash: [{ value: undefined, disabled: true }],
      isTakeParts: [{ value: undefined, disabled: true }],
      qcLevel: [{ value: undefined, disabled: true }, GlobalValidator.required],
      planFromTime: [this.wshop.planFromTime ? this.wshop.planFromTime : null, GlobalValidator.required],
      planToTime: [this.wshop.planToTime ? this.wshop.planToTime : null, GlobalValidator.required],
    });
    this.form.patchValue({ val });
    this.form.patchValue(Object.assign({}, val, {
      isCusWait: val.isCusWait && val.isCusWait === 'Y',
      isPriority: val.isPriority && val.isPriority === 'Y',
      isTakeParts: val.isTakeParts && val.isTakeParts === 'Y',
      isCarWash: val.isCarWash && val.isCarWash === 'Y',
      wshopId: shopIndex ? shopIndex : val.wshopId,
      empName: val.createdByAdvisor
    }));

    if (shopIndex && shopIndex > 0) {
      this.getTechByWshopId(shopIndex, RoType.SCC);
    }

    if (this.form.value.wshopId) {
      this.getTechByWshopId(this.form.value.wshopId, RoType.SCC);
    }

    this.form.get('wshopId').valueChanges.subscribe(id => {
      if (id && id > 0) {
        this.getTechByWshopId(id, RoType.SCC);
      }
    });
    this.form.get('isPriority').valueChanges.subscribe(isPriority => {
      const data = this.form.value;
      const obj = {
        isCarWash: (data.isCarWash) ? 'Y' : 'N',
        isCusWait: (data.isCusWait) ? 'Y' : 'N',
        isPriority: (isPriority) ? 'Y' : 'N',
        km: data.km
      };
      this.loadingService.setDisplay(true);
      this.repairOrderApi.techUpdate(val.roId, obj).subscribe(res => {
        this.loadingService.setDisplay(false);
        this.swalAlertService.openSuccessToast();
      });
    });
  }

  private buildReasonForm(data) {
    let fromDateTime = new Date();
    if ([ProgressState.stopInside, ProgressState.stopOutside].includes(data.state)) {
      fromDateTime = data.fromDateTime || new Date();
    } else if([ProgressState.performed, ProgressState.complete].includes(data.state)) {
      fromDateTime = null;
    }
    this.reasonForm = this.formBuilder.group({
      pendingReasonType: [{ value: data.pendingReasonId || undefined, disabled: this.disabled_form }],
      isRelease: [{ value: data.state === ProgressState.stopOutside, disabled: this.disabled_form }],
      pendingReasonNote: [{ value: data.pendingReasonText || undefined, disabled: this.disabled_form }],
      fromDateTime: [{ value: fromDateTime, disabled: this.disabled_form }]
    });
    if (this.stopPosition && this.stopPosition === 'inside') {
      this.reasonForm.patchValue({
        isRelease: false
      });
    }
    if (this.stopPosition && this.stopPosition === 'outside') {
      this.reasonForm.patchValue({
        isRelease: true
      });
    }
  }

  addNewJob() {
    if (this.form.value.state !== 0) {
      return;
    }
    const obj = {
      wsName: null,
      fromDatetime: new Date().getTime(),
      toDatetime: new Date().getTime()
    };
    this.jobs.push(obj);
  }

  removeJob(plan, index) {
    if (plan.id) {
      return;
    }
    this.jobs.splice(index, 1);
  }

  changeWshop(wsName, idx) {
    for (let i = 0; i < this.jobs.length; i++) {
      if (Number(this.jobs[i].wsName) === Number(wsName) && i !== idx) {
        this.swalAlertService.openWarningToast('Khoang đã được lên kế hoạch');
        this.jobs[idx].wsName = null;
        return;
      }
    }
    const data = this.shops.find(it => Number(it.id) === Number(wsName));
    this.jobs[idx].wsName = Number(wsName);
    this.jobs[idx].empName = data ? data.emps.map(it => it.empName).join(',') : '';
  }

  cloneData() {
    const data = this.jobs.filter(it => it.isStart === 'Y' && it.state === 0);
    this.roWshopApi.clonePlan(data,
      this.form.value.isCarWash === true ? 'Y' : 'N',
      this.form.value.isCusWait === true ? 'Y' : 'N',
      this.form.value.isTakeParts === true ? 'Y' : 'N',
      this.form.value.qcLevel).subscribe(res => {

      });
  }

  initDataEmployee() {
    this.disableEndAll = true;
    this.disableStartAll = true;
    for (let i = 0; i < this.employeeList.length; i++) {
      this.employeeList[i].actionType = this.actionTypeEmployee.add_or_update;
      this.employeeList[i].disable_start_button = this.getDisableStartButton(this.employeeList[i])
      this.employeeList[i].disable_end_button = this.getDisableEndButton(this.employeeList[i]);
    }

    for (let i = 0; i < this.employeeList.length; i++) {
      if (!this.employeeList[i].disable_start_button) this.disableStartAll = false;
      if (!this.employeeList[i].disable_end_button) {
        this.disableEndAll = false;
      }
    }
    // this.employeeList.sort((a, b) => {
    //   if(a.actualFromTime < b.actualFromTime) { return -1; }
    //   if(a.actualFromTime > b.actualFromTime) { return 1; }
    //   return 0;
    // });
    // console.log
  }

  getEmployee(data) {
    for (let i = 0; i < data.length; i++) this.employeeList.push(data[i]);
    this.initDataEmployee();
  }

  removeEmployee(emp, index) {
    if (!this.disabled_form) {
      if (emp.new_employ) {
        this.employeeList.splice(index, 1);
      } else {
        if (this.ProgressState.actual == this.state) {
          let total_employees = 0;
          for (let i = 0; i < this.employeeList.length; i++) {
            if (this.employeeList[i].actionType == this.actionTypeEmployee.add_or_update) {
              total_employees++;
            }
          }
          // Xe ở trạng thái Đang thực hiện hoặc Kết thúc không cho phép KTV cuối cùng ra khỏi danh sách sửa chữa.)
          if (total_employees == 1) {
            this.swalAlertService.openFailToast("Không thể xóa hết tất cả các KTV!");
          } else emp.actionType = this.actionTypeEmployee.remove;
        } else emp.actionType = this.actionTypeEmployee.remove;
      }
    } else if (this.state == this.ProgressState.performed) {
      let total_employees = 0;
      for (let i = 0; i < this.employeeList.length; i++) {
        if (this.employeeList[i].actionType == this.actionTypeEmployee.add_or_update) {
          total_employees++;
        }
      }
      // Xe ở trạng thái Đang thực hiện hoặc Kết thúc không cho phép KTV cuối cùng ra khỏi danh sách sửa chữa.)
      if (total_employees == 1) {
        this.swalAlertService.openFailToast("Không thể xóa hết tất cả các KTV!");
      } else emp.actionType = this.actionTypeEmployee.remove;
    }


  }
  changePlanScc() {
    let data = {
      fromDatetime: this.form.value.planFromTime,
      toDatetime: this.form.value.planToTime,
      id: this.planId,
      isStart: "N",
      wshopId: this.wshop.wshopId,
    }
    console.log(this.wshop)
    this.roWshopApi.changePlanScc(data).subscribe(res => {
      this.swalAlertService.openSuccessToast("Thay đổi kế hoạch thành công");
      this.reLoadPlanScc();
    });
  }

  reLoadPlanScc() {
    this.roWshopApi.getRepairPlan(this.planId, this.actualId).subscribe(res => {
      this.information = res.information;
      this.jobs = res.information ? res.information.listPlans : [];

      if (this.employeeList.length) {
        this.sortEmps(res.employeeList ? res.employeeList : [])
      } else this.employeeList = res.employeeList ? res.employeeList : [];

      this.wshop = res.wshop ? res.wshop : {};
      // thêm các nhân viên đã chọn nhưng chưa được lưu kế hoạch sửa chữa

      for (let i = 0; i < this.wait_employess.length; i++) {
        // kiểm tra xem đã có nhân viên này chưa
        let exist_emp = false;
        for (let j = 0; j < this.employeeList.length; j++) {
          if (this.employeeList[j].empId == this.wait_employess[i].empId) exist_emp = true;
        }
        if (!exist_emp) this.employeeList.push(this.wait_employess[i]);
      }
      this.wait_employess = [];
      this.initDataEmployee();
    });
  }

  changeEmployeePlan() {
    if (this.employeeList.length == 0) {
      this.swalAlertService.openInfoToast("Chưa có kỹ thuật viên");
      return;
    }
    let data = {
      planId: this.planId,
      employees: this.employeeList,
    }
    // kiem tra xem co nhan viên nào bị xóa ko
    let check_remove = false;
    for (let i = 0; i < this.employeeList.length; i++) {
      if (this.employeeList[i].actionType == this.actionTypeEmployee) {
        check_remove = true;
      }
    }

    //kiem tra xem tat ca cac nhan vien chua bi xoa da ket thuc cong viec chua
    let finish_job = true;

    for (let i = 0; i < this.employeeList.length; i++) {
      if (this.employeeList[i].actionType != this.actionTypeEmployee.remove && !this.employeeList[i].actualToTime) {
        finish_job = false;
      }
    }
    // chi tra xem tat khi trang thai xe là đang thực hiện
    if (this.state != ProgressState.actual || this.employeeList.length == 0) {
      finish_job = false;
    }

    if (finish_job && check_remove) {
      this.confirmService.openConfirmModal('Công việc sẽ được chuyển trạng thái sang hoàn thành, bạn có chắc chắn thực hiện thao tác này?').subscribe(res => {
        this.roWshopApi.changeEmployeePlan(data).subscribe(res => {
          this.swalAlertService.openSuccessToast("Thay đổi kỹ thuật viên thành công");
          this.reLoadPlanScc();
        });
      });
    } else {
      this.roWshopApi.changeEmployeePlan(data).subscribe(res => {
        this.swalAlertService.openSuccessToast("Thay đổi kỹ thuật viên thành công");
        this.reLoadPlanScc();
      });
    }
  }

  startJobScc(emp, index) {
    let employees = [];
    employees.push(emp);
    let data = {
      planId: this.planId,
      employees: employees,
    }

    // lưu lại các nhân viên mới đc thêm vào nhưng chưa đc bắt đầu
    for (let i = 0; i < this.employeeList.length; i++) {
      if (this.employeeList[i].new_employ && i != index) this.wait_employess.push(this.employeeList[i])
    }

    this.roWshopActApi.startJobScc(data).subscribe(res => {
      if (res.code == 300) {
        let messesges = "";
        for (let i = 0; i < res.data.length; i++) {
          if (i < res.data.length - 1) {
            messesges += `Kỹ thuật viên ${res.data[i].empName} đang thực hiện công việc ở xe ${res.data[i].registerno} \n`
          } else {
            messesges += `Kỹ thuật viên ${res.data[i].empName} đang thực hiện công việc ở xe ${res.data[i].registerno}. Bạn có muốn dừng việc sửa chữa của KTV ở khoang hiện tại để bắt đầu sửa chữa ở khoang ${this.wshop.wsCode} không?`
          }
        }
        this.confirmService.openConfirmModal(messesges).subscribe(res => {
          let employees = [];
          employees.push(emp);
          let data = {
            planId: this.planId,
            employees: employees,
            acceptCheck: true
          }
          this.loadingService.setDisplay(true);
          this.roWshopActApi.startJobScc(data).subscribe(res => {
            this.loadingService.setDisplay(false);
            this.actualId = res.newActualId;
            this.swalAlertService.openSuccessToast("Bắt đầu thành công");
            this.reLoadPlanScc();
          });
        });
      } else if (res.code == 400) {
        this.messeage_notification = "";
        for (let i = 0; i < res.data.length; i++) {
          if (i < res.data.length - 1) {
            this.messeage_notification += `Kỹ thuật viên ${res.data[i].empName} đang thực hiện công việc ở xe ${res.data[i].registerno} \n`
          } else {
            this.messeage_notification += `Kỹ thuật viên ${res.data[i].empName} đang thực hiện công việc ở xe ${res.data[i].registerno}`
          }
        }
        jQuery('#warningEmployeeRepairModal').modal('show')
      } else {
        this.actualId = res.newActualId;
        this.swalAlertService.openSuccessToast("Bắt đầu thành công");
        this.reLoadPlanScc();
      }

    });
  }

  startAllJobScc() {
    let employees = [];
    for (let i = 0; i < this.employeeList.length; i++) {
      if (!this.employeeList[i].actualFromTime) this.employeeList[i].actualFromTime = new Date().getTime();
      if (!this.employeeList[i].disable_start_button) {
        employees.push(this.employeeList[i])
      }
    }

    employees.sort((a, b) => {
      if (a.actualFromTime < b.actualFromTime) { return -1; }
      if (a.actualFromTime > b.actualFromTime) { return 1; }
      return 0;
    });
    let data = {
      planId: this.planId,
      employees: employees,
    }

    let data_save_employees = {
      planId: this.planId,
      employees: this.employeeList,
    }

    this.roWshopApi.changeEmployeePlan(data_save_employees).subscribe(res => {
      this.roWshopActApi.startJobScc(data).subscribe(res => {
        if (res.code == 300) {
          let messesges = "";
          for (let i = 0; i < res.data.length; i++) {
            if (i < res.data.length - 1) {
              messesges += `Kỹ thuật viên ${res.data[i].empName} đang thực hiện công việc ở xe ${res.data[i].registerno} \n`
            } else {
              messesges += `Kỹ thuật viên ${res.data[i].empName} đang thực hiện công việc ở xe ${res.data[i].registerno}. Bạn có muốn dừng việc sửa chữa của KTV ở khoang hiện tại để bắt đầu sửa chữa ở khoang ${this.wshop.wsCode} không?`
            }
          }
          this.confirmService.openConfirmModal(messesges).subscribe(res => {
            let data_save_employees = {
              planId: this.planId,
              employees: this.employeeList,
              acceptCheck: true
            }
            this.roWshopActApi.startJobScc(data_save_employees).subscribe(res => {
              this.actualId = res.newActualId;
              this.swalAlertService.openSuccessToast("Bắt đầu thành công");
              this.reLoadPlanScc();
            });
          });
        } else if (res.code == 400) {
          this.messeage_notification = "";
          for (let i = 0; i < res.data.length; i++) {
            if (i < res.data.length - 1) {
              this.messeage_notification += `Kỹ thuật viên ${res.data[i].empName} đang thực hiện công việc ở xe ${res.data[i].registerno} \n`
            } else {
              this.messeage_notification += `Kỹ thuật viên ${res.data[i].empName} đang thực hiện công việc ở xe ${res.data[i].registerno}`
            }
          }
          jQuery('#warningEmployeeRepairModal').modal('show')
        } else {
          this.actualId = res.newActualId;
          this.swalAlertService.openSuccessToast("Bắt đầu thành công");
          this.reLoadPlanScc();
        }
      });
    });

  }

  finishJobScc(emp, index) {
    let employees = [];
    employees.push(emp);
    let data = {
      actualId: this.actualId,
      employees: employees,
    }


    //kiem tra xem tat ca cac nhan vien chua bi xoa da ket thuc cong viec chua
    let finish_job = true;

    for (let i = 0; i < this.employeeList.length; i++) {
      if (i != index && this.employeeList[i].actionType != this.actionTypeEmployee.remove && !this.employeeList[i].actualToTime) {
        finish_job = false;
      }
    }
    // chi tra xem tat khi trang thai xe là đang thực hiện
    if (this.state != ProgressState.actual || this.employeeList.length == 0) {
      finish_job = false;
    }
    if (finish_job) {
      this.confirmService.openConfirmModal('Công việc sẽ được chuyển trạng thái sang hoàn thành, bạn có chắc chắn thực hiện thao tác này?').subscribe(res => {
        this.loadingService.setDisplay(true);
        this.roWshopActApi.finishJobScc(data).subscribe(res => {
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessToast("Kết thúc thành công");
          this.reLoadPlanScc();
        });
      });
    } else {
      this.loadingService.setDisplay(true);
      this.roWshopActApi.finishJobScc(data).subscribe(res => {
        this.loadingService.setDisplay(false);
        this.swalAlertService.openSuccessToast("Kết thúc thành công");
        this.reLoadPlanScc();
      });
    }

  }

  finishAllJobScc(emp) {
    this.confirmService.openConfirmModal('Xác nhận', 'Bạn có muốn kết thúc xe?').subscribe(() => {
      let employees = [];
      for (let i = 0; i < this.employeeList.length; i++) {
        if (!this.employeeList[i].disable_end_button) {
          employees.push(this.employeeList[i])
        }
      }

      employees.sort((a, b) => {
        if (a.actualToTime > b.actualToTime) { return -1; }
        if (a.actualToTime < b.actualToTime) { return 1; }
        return 0;
      });

      let data = {
        actualId: this.actualId,
        employees: employees,
      }
      this.roWshopActApi.finishJobScc(data).subscribe(res => {
        this.swalAlertService.openSuccessToast("Kết thúc xe và nhân viên thành công");
        this.reLoadPlanScc();
      });
    });
  }

  getDateValue(time) {
    if (!time) return null;
    else return time;
  }

  getDisableStartButton(emp) {
    if (emp.new_employ) return false;
    if (emp.actualFromTime) return true;
    if (!emp.actualFromTime) return false;
    if (!emp.actualFromTime && !emp.actualToTime) return false;
  }

  getDisableEndButton(emp) {
    if (emp.new_employ) return true;
    if (emp.actualToTime) return true;
    if (!emp.actualFromTime && !emp.actualToTime) return true;
    if (!emp.actualToTime) return false;
  }

  getDisable(actualFromTime) {
    if (actualFromTime) return true
    else return false;
  }

  openCollapsed() {
    this.isCollapsedOther = false;
    this.isCollapsedFollow = false;
    this.isCollapsedPlan = false;
    this.isCollapsedWS = false;
  }

  sortEmps(emps) {
    console.log(this.employeeList)
    let temp_emps = [];
    for (let i = 0; i < this.employeeList.length; i++) {
      for (let j = 0; j < emps.length; j++) {
        if (emps[j].empId == this.employeeList[i].empId) {
          temp_emps.push(emps[j]);
          break;
        }
      }
    }
    this.cdr.detectChanges();
    this.employeeList = temp_emps;
  }
}
