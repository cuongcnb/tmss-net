import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, Input} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap';
import {forkJoin} from 'rxjs';
import {maxBy, minBy} from 'lodash';

import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {EventBusService} from '../../../../shared/common-service/event-bus.service';
import {RoWshopApi} from '../../../../api/ro-wshop/ro-wshop.api';
import {PendingReasonApi} from '../../../../api/pending-reason/pending-reason.api';
import {ProgressState} from '../../../../core/constains/progress-state';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {JobTypes} from '../../../../core/constains/job-type';
import {EmployeeCommonApi} from '../../../../api/common-api/employee-common.api';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {RoWshopActApi} from '../../../../api/ro-wshop/ro-wshop-act.api';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {RepairOrderApi} from '../../../../api/quotation/repair-order.api';
import {McopperPaintApi} from '../../../../api/common-api/mcopper-paint.api';
import {ShopCommonApi} from '../../../../api/common-api/shop-common.api';
import {AllowIn, ShortcutEventOutput, ShortcutInput} from 'ng-keyboard-shortcuts';
import {WshopDSModel} from '../../../../core/models/repair-progress/wshop-ds.model';
import { BpGroupApi } from '../../../../api/bp-group/bp-group.api';
import {Times} from '../../../../core/constains/times';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dong-son-progress-modal',
  templateUrl: './dong-son-progress-modal.component.html',
  styleUrls: ['./dong-son-progress-modal.component.scss']
})
export class DongSonProgressModalComponent implements OnInit, OnDestroy {
  @Output() refreshList = new EventEmitter();
  @Output() refreshRoNoPlanList = new EventEmitter();
  @Input() openOnEvenbus = true;
  @ViewChild('modal', { static: false }) modal: ModalDirective;
  @ViewChild('jobStopModal', { static: false }) jobStopModal;
  @ViewChild('jobAriseModal', { static: false }) jobAriseModal;
  form: FormGroup;
  reasonForm: FormGroup;
  modalHeight: number;
  fieldGrid;
  params;
  selectedData;
  wpId: number;
  id: number;
  isCollapsed = true;
  jobs;
  subscription;
  ProgressState = ProgressState;
  isRefreshRoAfterClose: boolean;
  jobRemoveIds: Array<any> = [];
  currentJob;
  currentPlan;
  dataPlan;
  state;
  dataJob;
  timeDistance = 5 * 60 * 1000;  // Default 5min
  listDsDefault;
  listWhopFree = [];
  keyboardShortcuts: Array<ShortcutInput> = [];
  information;
  bpGroups;
  dsPlanData;
  jobFieldGrid;
  partFieldGrid;
  finishLoadData: false;
  wshop: any;
  reasons;
  val;
  listBpGroups = [];
  disabled_form = false;
  continueWorking;
  changePlanToWorking;
  completeWorking;
  stopWorking;
  planId;

  constructor(
    private formBuilder: FormBuilder,
    private eventBusService: EventBusService,
    private loadingService: LoadingService,
    private empApi: EmployeeCommonApi,
    private setModalHeight: SetModalHeightService,
    public dataFormatService: DataFormatService,
    private swalAlertService: ToastService,
    private roWshopApi: RoWshopApi,
    private roWshopActApi: RoWshopActApi,
    private repairOrderApi: RepairOrderApi,
    private mcopperPaintApi: McopperPaintApi,
    private shopCommonApi: ShopCommonApi,
    private pendingReasonApi: PendingReasonApi,
    private bpGroupApi: BpGroupApi,
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
    if (this.openOnEvenbus) {
      this.subscription = this.eventBusService.on('openDsModal').subscribe(val => {
        this.id = val.id;
        this.val = val;
        this.planId = val.planId;
        this.continueWorking = val.continueWorking || null;
        this.changePlanToWorking = val.changePlanToWorking || null;
        this.completeWorking = val.completeWorking || null;
        this.stopWorking = val.stopWorking || null;
        this.state = val.state;
        if ([ProgressState.performed, ProgressState.stopInside, ProgressState.stopOutside, ProgressState.complete].includes(val.state)) {
          this.disabled_form = true;
        }

        this.open(val.planId);
      });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onResize() {
    this.modalHeight = this.setModalHeight.onResize();
  }

  open(planId, isRefreshRoAfterClose?, id?) {
    this.id = id;
    this.getListDs();
    this.isRefreshRoAfterClose = isRefreshRoAfterClose;
    this.modal.show();
    this.getDsPlan(planId);
  }

  close() {
    if (this.isRefreshRoAfterClose) {
      this.loadingService.setDisplay(true);
      this.refreshRoNoPlanList.emit();
    }
    this.isRefreshRoAfterClose = false;
    this.refreshList.emit();
    this.disabled_form = false;
    this.modal.hide();
  }

  getListDs() {
    this.mcopperPaintApi.getListByDealer().subscribe(res => {
      this.listDsDefault = res.filter(it => it.status === 'Y');
    });
  }

  getDsPlan(planId) {
    this.dataPlan = [];
    this.roWshopApi.getPlanDs(planId, this.val.actualId, this.val.state).subscribe(res => {
      this.dataJob = res.jobsList ? res.jobsList : [];
      this.dataPlan = res.information ? res.information : [];
      this.state = res.state;

      if ([ProgressState.performed, ProgressState.stopInside, ProgressState.stopOutside, ProgressState.complete].includes(this.state)) {
        this.disabled_form = true;
      }

      this.bpGroups = res.bpGroups ? res.bpGroups : null;
      this.dsPlanData = res ? res : null;
      this.wshop = (res.wshop && res.wshop.length > 0)? res.wshop[0] : {};
      this.onResize();
      this.buildForm(res.information);
      this.buildReasonForm(res.information)
      this.pendingReasonApi.getAll().subscribe(reasons => this.reasons = reasons.map(item => {
        return {
          text: item.name,
          value: item.id
        };
      }));

      this.bpGroupApi.getBpGroups().subscribe(res => {
        this.listBpGroups = res;
        this.loadingService.setDisplay(false);
      })
      this.empApi.getDsEmp().subscribe(emps => {

        this.jobs = this.initJobs(emps, res.jobsList);
        this.jobs.forEach(job => this.calculateJobRangeTimes(job));
        this.form.patchValue({
          service: this.jobs.filter(item => item.plans.length).map(item => item.name).toString()
        });
        this.shopCommonApi.getAllDsShop().subscribe(resp => {
          resp.map(it => {
            it.wshopId = it.id;
            return it;
          });
          this.listWhopFree = resp;
        });
      });
    });
  }

  onChoose(data) {
    const planIndex = this.currentJob.plans.findIndex(item => item.id === this.currentPlan.id);
    const jobIndex = this.jobs.findIndex(item => item.id === this.currentJob.id);
    this.jobs[jobIndex].plans[planIndex] = Object.assign({}, this.currentJob.plans[planIndex], data, {
      state: ProgressState.stopInside
    });
  }

  changeState($event, plan, job) {
    plan.newState = $event.target.value;
    if (plan.state && $event.target.value === '2') {
      this.currentPlan = plan;
      this.currentJob = job;
      this.jobStopModal.open();
    } else {
      plan.pendingReasonText = null;
      plan.pendingReasonId = null;
      plan.pendingReasonValue = null;
    }
  }

  addNewJob(job) {
    job.plans.push({ jobType: job.typeId });
    job.isShowPlan = true;
    const dataBefore = this.jobs.filter(it => it.toDatetime && it.toDatetime > 0);
    this.jobs.forEach(item => this.calculateJobRangeTimes(item));
    this.jobs.map(it => {
      if (it.typeId === job.typeId) {
        it.fromDateTime = (dataBefore.length > 0)
          ? dataBefore[dataBefore.length - 1].toDatetime + this.timeDistance : new Date().getTime();
        it.plans[0].fromDatetime = (dataBefore.length > 0) ?
          dataBefore[dataBefore.length - 1].toDatetime + this.timeDistance : new Date().getTime();
      }
      return it;
    }
    );
    this.form.patchValue({
      service: this.jobs.filter(item => item.plans.length).map(item => item.name).toString()
    });
  }

  removeJob(job, idx) {
    if (job.plans[idx].id) {
      if (job.plans[idx].state && job.plans[idx].state !== 5) {
        this.swalAlertService.openFailToast('Chỉ có thể xóa kế hoạch');
        return;
      }

      this.jobRemoveIds.push(job.plans[idx].id);
    }

    job.plans.splice(idx, 1);
    this.jobs.forEach(item => this.calculateJobRangeTimes(item));
    this.form.patchValue({
      service: this.jobs.filter(item => item.plans.length).map(item => item.name).toString()
    });
  }
  // tính thời gian bắt đầu và kết thúc của các công việc (Đồng, sơn, nền,...) dựa trên các plan con
  calculateJobRangeTimes(job) {
    const earliestPlan = minBy(job.plans.map(plan => plan.fromDatetime), date => date);
    const lastestPlan = maxBy(job.plans.map(plan => plan.toDatetime), date => date);
    job.fromDatetime = earliestPlan ? earliestPlan : '';
    job.toDatetime = lastestPlan ? lastestPlan : '';
  }


  // biến newState thành state
  private transformArray(arr) {
    const result = [];
    arr.forEach(item => {
      result.push(Object.assign({}, ...item, {
        state: item.newState ? item.newState : (item.state ? item.state : ProgressState.plan)
      }));
    });
    return result;
  }

  private initJobs(emps, jobs) {
    return this.listDsDefault.map(type => {
      const plans = jobs.filter(item => item.jobType === type.id);
      return {
        typeId: type.id,
        name: type.name,
        emps,
        isShowPlan: plans.length,
        fromDatetime: '',
        toDatetime: '',
        plans
      };
    });
  }

  checkKmAndQc() {
    let errorMessage = '';
    if (!this.form.get('qcLevel').value) {
      errorMessage += ' Cấp QC,';
      this.form.get('qcLevel').setErrors({ requiredOnCondition: true });
    } else {
      this.form.get('qcLevel').setErrors(null);
    }
    if (errorMessage) {
      errorMessage = 'Bạn phải nhập' + errorMessage;
      this.swalAlertService.openWarningToast(errorMessage.substring(0, errorMessage.length - 1));
      return false;
    }
    return true;
  }

  private buildForm(data) {
    this.form = this.formBuilder.group({
      cusName: [{ value: data.cusName, disabled: true }],
      registerno: [{ value: data.registerno, disabled: true }],
      mobil: [{ value: data.mobil, disabled: true }],
      openroDate: [{ value: this.dataFormatService.parseTimestampToFullDate(data.openroDate), disabled: true }],
      closeroDate: [{ value: this.dataFormatService.parseTimestampToFullDate(data.closeroDate), disabled: true }],
      notes: [{ value: data.notes, disabled: true }],
      service: [{ value: undefined, disabled: true }],
      isPriority: [data.isPriority === 'Y'],
      empName: [{ value: data.empName, disabled: true }],
      repairorderno: [{ value: data.repairorderno, disabled: true }],
      cmName: [{ value: data.cmName, disabled: true }],
      km: [{ value: data.km, disabled: true }],
      wshopId:  [this.wshop? this.wshop.wshopId : undefined],
      bpGroupId: [this.bpGroups? this.bpGroups.bpGroupId : undefined],
      pfromTime: [this.bpGroups? this.bpGroups.pfromTime : undefined],
      ptoTime: [this.bpGroups? this.bpGroups.ptoTime : undefined],
      afromTime: [this.bpGroups? this.bpGroups.afromTime : undefined],
      atoTime: [this.bpGroups? this.bpGroups.atoTime : undefined],

      isCusWait: [data.isCusWait === 'Y'],
      isCarWash: [data.isCarWash === 'Y'],
      isTakeParts: [data.isTakeParts === 'Y'],
      qcLevel: [data.qcLevel || 1],
      new_afromTime: [new Date().getTime()]
    });

    this.form.get('isPriority').valueChanges.subscribe(prioritize => {
      const dataForm = this.form.value;
      const obj = {
        carWash: (dataForm.isCarWash) ? 'Y' : 'N',
        cusWait: (dataForm.isCusWait) ? 'Y' : 'N',
        isPriority: (prioritize) ? 'Y' : 'N',
        km: data.km
      };
      this.loadingService.setDisplay(true);
      this.repairOrderApi.techUpdate(data.roId, obj).subscribe(res => {
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
      pendingReasonType: [data.pendingReasonId || undefined],
      isRelease: [data.state === ProgressState.stopOutside],
      pendingReasonNote: [data.pendingReasonText? data.pendingReasonText : ""],
      fromDateTime: [fromDateTime]
    });
  }

  onBtnFinish() {
    const jobUnfinish = this.dataJob.find(it => it.state !== 4);
    if (jobUnfinish) {
      this.swalAlertService.openFailToast('Tất cả công việc chưa hoàn thành');
      return;
    }
    this.loadingService.setDisplay(true);
    this.roWshopActApi.finishWshopAct(this.dataPlan.roId).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast("Dừng công việc thành công");
      this.close();
      
    });
  }

  getDateValue(time) {
    if(!time) return null;
    else return time;
  }

  changePlanDs() {
    let toDatetime = this.form.value.ptoTime;
    if (this.bpGroups.bpGroupId != this.form.value.bpGroupId && this.form.value.bpGroupId) {
      toDatetime = this.val.estimateTime ? this.form.value.pfromTime + Number(this.val.estimateTime) * Times.minTimeStamp : this.form.value.pfromTime.valueOf()
    }
    console.log(new Date(toDatetime))
    let data = {
      fromDatetime: this.form.value.pfromTime,
      toDatetime: toDatetime,
      wpId: this.val.wpId,
      bpGroupId: this.form.value.bpGroupId,
      id: this.val.id,
      wshopId: this.form.value.wshopId
    }
    this.roWshopApi.changePlanDs(data).subscribe(res =>{
      this.planId = res.newPlanId;
      this.swalAlertService.openSuccessToast("Thay đổi kế hoạch thành công")
    });
  }

  changeWshopAndBpGroup() {
    if(this.form.value.bpGroupId !== this.bpGroups.bpGroupId || this.form.value.wshopId !== this.val.wshopId) {
      let data = {
        fromDatetime: this.wshop.actualFromTime,
        toDatetime: this.wshop.planToTime,
        wpId: this.val.wpId,
        bpGroupId: this.form.value.bpGroupId,
        wshopId: this.form.value.wshopId,
        id: this.val.actualId,
      }
      this.roWshopApi.changeActualDs(data).subscribe(res =>{
        this.swalAlertService.openSuccessToast("Thay đổi khoang/tổ nhóm thành công")
      });
    }
  }

  startJob() {
    let toDatetime = this.form.value.ptoTime;
    if (this.bpGroups.bpGroupId != this.form.value.bpGroupId) {
      toDatetime = this.val.estimateTime ? this.form.value.pfromTime + Number(this.val.estimateTime) * Times.minTimeStamp : this.form.value.pfromTime.valueOf()
    }

    let obj = {
      fromDatetime: this.form.value.pfromTime,
      toDatetime: toDatetime,
      wpId: this.val.wpId,
      bpGroupId: this.form.value.bpGroupId,
      id: this.val.id,
      wshopId: this.form.value.wshopId
    }
    this.roWshopApi.changePlanDs(obj).subscribe(res =>{
      this.planId = res.newPlanId;
      let data = {
        planId: this.planId,
        actualId: null,
        bpGroupId: this.form.value.bpGroupId,
        planFromTime: this.form.value.pfromTime,
        planToTime: this.form.value.ptoTime,
        actualFromTime: this.form.value.afromTime,
        actualToTime: this.form.value.atoTime,
      }
      this.roWshopActApi.startJobDs(data).subscribe(res => {
        if (res && res.actualId) this.val.actualId = res.actualId;
        this.getDsPlan(this.val.id);
        this.val.actualId = res.actualId;
        this.swalAlertService.openSuccessToast("Bắt đầu công việc thành công");
      })
    });

  }

  finishJob() {
    let data = {
      planToTime: this.form.value.ptoTime,
      actualId: this.val.actualId,
    }
    this.roWshopActApi.finishJobDs(data).subscribe(res => {
      this.getDsPlan(this.val.planId);
      this.swalAlertService.openSuccessToast("Kết thúc công việc thành công");
    })
  }

  stopJob() {
    const obj = {
      actualStartedId: this.val.actualId,
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
    this.roWshopActApi.changeStateJobDs(obj).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.disabled_form = false;
      this.close();
    });
  }
  callbackGridJob(params) {
    if (this.dataJob) {
      params.api.setRowData(this.dataJob);
    }
  }

  callbackGridPart(params) {
    if (this.dsPlanData.partsList.length) {
      params.api.setRowData(this.dsPlanData.partsList);
    }
  }
  continueJob() {
    this.loadingService.setDisplay(true);
    if (this.state === ProgressState.stopInside) {
      let obj = {
        actualStartedId: this.val.actualId,
        newState: 1,
        bpGroupId: this.form.value.bpGroupId,
        fromTime: this.form.value.afromTime,
      };

      if (this.continueWorking) obj.fromTime = this.form.value.new_afromTime;
      this.roWshopActApi.changeStateJobDs(obj).subscribe(() => {
        this.loadingService.setDisplay(false);
        this.disabled_form = false;
        this.refreshRoNoPlanList.emit();
        this.close();
      });
    } else if (this.state === ProgressState.stopOutside){
      let obj = {

        actualId: this.val.actualId,
        bpGroupId: this.form.value.bpGroupId,
        actualFromTime: this.form.value.afromTime,
        wshopId: this.form.value.wshopId
      };
      if (this.continueWorking) obj.actualFromTime = this.form.value.new_afromTime;
      this.roWshopActApi.continueJobDSOutSide(obj).subscribe(() => {
        this.loadingService.setDisplay(false);
        this.disabled_form = false;
        this.refreshRoNoPlanList.emit();
        this.close();
      });
    } else {
      this.loadingService.setDisplay(false);
    }
    
  }

  showAllTab() {
    if (!this.changePlanToWorking && !this.completeWorking && !this.continueWorking && !this.stopWorking) return true;
    else return false;
  }

  getWshopName() {
    for (let i = 0; i < this.listWhopFree.length; i++) {
      if (this.form.value.wshopId ==  this.listWhopFree[i].wshopId) 
      return this.listWhopFree[i].wsCode;
    }
    return "";
  }
}
