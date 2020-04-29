import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {ProgressState} from '../../../../core/constains/progress-state';
import {EventBusService} from '../../../../shared/common-service/event-bus.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {EmployeeCommonApi} from '../../../../api/common-api/employee-common.api';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {RoWshopApi} from '../../../../api/ro-wshop/ro-wshop.api';
import {RoWshopActApi} from '../../../../api/ro-wshop/ro-wshop-act.api';
import {RepairOrderApi} from '../../../../api/quotation/repair-order.api';
import {forkJoin} from 'rxjs';
import {maxBy, minBy} from 'lodash';
import {JobTypes} from '../../../../core/constains/job-type';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'info-dongson-modal',
  templateUrl: './info-dongson-modal.component.html',
  styleUrls: ['./info-dongson-modal.component.scss']
})
export class InfoDongsonModalComponent implements OnInit, OnDestroy {
  @Output() refreshList = new EventEmitter();
  @Output() refreshRoNoPlanList = new EventEmitter();
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('jobStopModal', {static: false}) jobStopModal;
  @ViewChild('jobAriseModal', {static: false}) jobAriseModal;
  form: FormGroup;
  modalHeight: number;
  fieldGrid;
  params;
  selectedData;
  roId: number;
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

  constructor(
    public dataFormatService: DataFormatService,
    private formBuilder: FormBuilder,
    private eventBusService: EventBusService,
    private loadingService: LoadingService,
    private empApi: EmployeeCommonApi,
    private setModalHeight: SetModalHeightService,
    private swalAlertService: ToastService,
    private roWshopApi: RoWshopApi,
    private roWshopActApi: RoWshopActApi,
    private repairOrderApi: RepairOrderApi
  ) {
  }

  ngOnInit() {
    // this.subscription = this.eventBusService.on('openDsModal').subscribe(val => {
    //   this.open(val.roId);
    // });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onResize() {
    this.modalHeight = this.setModalHeight.onResize();
  }

  open(roId, isRefreshRoAfterClose?) {
    this.roId = roId;
    this.isRefreshRoAfterClose = isRefreshRoAfterClose;
    this.getDsPlan(roId);
    this.modal.show();
  }

  close() {
    if (this.isRefreshRoAfterClose) {
      this.loadingService.setDisplay(true);
      this.refreshRoNoPlanList.emit();
    }
    this.isRefreshRoAfterClose = false;
    this.refreshList.emit();
    this.modal.hide();
  }

  getDsPlan(roId) {
    this.roWshopApi.getPlanDs(roId).subscribe(res => {
      if (res && res.job.length > 0) {
        this.state = res.job[0].state;
      }
      this.dataJob = res.job ? res.job : [];
      this.dataPlan = res.data ? res.data : [];
      this.onResize();
      this.buildForm(res.data);
      this.empApi.getDsEmp().subscribe(emps => {
        this.jobs = this.initJobs(emps, res.job);
        this.jobs.forEach(job => this.calculateJobRangeTimes(job));
        this.form.patchValue({
          service: this.jobs.filter(item => item.plans.length).map(item => item.name).toString()
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
    job.plans.push({jobType: job.typeId});
    job.isShowPlan = true;
    this.jobs.forEach(item => this.calculateJobRangeTimes(item));
    this.form.patchValue({
      service: this.jobs.filter(item => item.plans.length).map(item => item.name).toString()
    });
  }

  removeJob(job, idx) {
    if (job.plans[idx].id) {
      if (job.plans[idx].state) {
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

  accept() {
    const data = this.jobs.filter(item => item.plans.length).map(item => item.plans).flat();
    if (!data || !data.length) {
      this.swalAlertService.openFailToast('Cần ít nhất 1 công việc');
      return;
    }

    if (data.find(item => !item.empId || !item.fromDatetime || !item.toDatetime)) {
      this.swalAlertService.openFailToast('Cần điền đủ thông tin KTV và thời gian bắt đầu, kết thúc cho các công việc');
      return;
    }

    const apis = [];
    const planJobs = data.filter(item => (!item.newState && !item.state) || Number(item.newState) === ProgressState.plan);
    if (planJobs.length) {
      apis.push(this.roWshopApi.createPlanDs(planJobs, this.roId,
        this.form.value.isCarWash,
        this.form.value.isCusWait,
        this.form.value.isTakeParts,
        this.form.value.qcLevel));
    }

    const newActualJobs = data.filter(item => Number(item.state) === ProgressState.plan && Number(item.newState) === ProgressState.actual);
    if (newActualJobs.length) {
      apis.push(this.roWshopActApi.startJobDs(newActualJobs.map(item => item.id)));
    }

    const continueActualJobs = data.filter
    (item => Number(item.state) !== ProgressState.plan && Number(item.newState) === ProgressState.actual);
    if (continueActualJobs.length) {
      apis.push(this.roWshopActApi.changeStateJobDs(this.transformArray(continueActualJobs)));
    }

    const stopJobs = data.filter(item => Number(item.newState) === ProgressState.stopInside);
    if (stopJobs.length) {
      apis.push(this.roWshopActApi.changeStateJobDs(this.transformArray(stopJobs)));
    }

    const completeJobs = data.filter(item => Number(item.newState) === ProgressState.complete);
    if (completeJobs.length) {
      apis.push(this.roWshopActApi.finishJobDs(completeJobs.map(item => item.roWshopActId)));
    }

    if (this.jobRemoveIds.length) {
      apis.push(this.roWshopActApi.disableJobDs(this.jobRemoveIds));
    }

    this.loadingService.setDisplay(true);
    forkJoin(apis).subscribe(() => {
      this.jobRemoveIds = [];
      this.loadingService.setDisplay(false);
      this.refreshList.emit();
      this.refreshRoNoPlanList.emit();
      this.modal.hide();
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
    return JobTypes.map(type => {
      const plans = jobs.filter(item => item.jobType === type.id);
      return {
        typeId: type.id,
        name: type.name,
        emps: emps.filter(item => item.typeJob === type.id),
        isShowPlan: plans.length,
        fromDatetime: '',
        toDatetime: '',
        plans
      };
    });
  }

  private buildForm(data) {
    this.form = this.formBuilder.group({
      cusName: [{value: data.cusName, disabled: true}],
      registerno: [{value: data.registerno, disabled: true}],
      mobil: [{value: data.mobil, disabled: true}],
      openroDate: [{value: this.dataFormatService.parseTimestampToFullDate(data.openroDate), disabled: true}],
      closeroDate: [{value: this.dataFormatService.parseTimestampToFullDate(data.closeroDate), disabled: true}],
      notes: [{value: data.notes, disabled: true}],
      service: [{value: undefined, disabled: true}],
      prioritize: [data.isPriority === 'Y'],
      empName: [{value: data.empName, disabled: true}],
      isCusWait: [data.isCusWait === 'Y'],
      isCarWash: [data.isCarWash === 'Y'],
      isTakeParts: [data.isTakeParts === 'Y'],
      isPriority: [data.isPriority === 'Y'],
      qcLevel: [data.qcLevel]
    });

    this.form.get('isPriotity').valueChanges.subscribe(prioritize => {
      const dataForm = this.form.value;
      const obj = {
        isCarWash: (dataForm.isCarWash) ? 'Y' : 'N',
        isCusWait: (dataForm.isCusWait) ? 'Y' : 'N',
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

  onBtnFinish() {
    const jobUnfinish = this.dataJob.find(it => it.state !== 4);
    if (jobUnfinish) {
      this.swalAlertService.openFailToast('Tất cả công việc chưa hoàn thành');
      return;
    }
    this.loadingService.setDisplay(true);
    this.roWshopActApi.finishWshopAct(this.dataPlan.roId).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.refreshList.emit();
      this.modal.hide();
      this.swalAlertService.openSuccessToast();
    });
  }
}
