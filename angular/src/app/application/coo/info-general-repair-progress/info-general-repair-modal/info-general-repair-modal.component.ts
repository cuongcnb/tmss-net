import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {ProgressState, RoType} from '../../../../core/constains/progress-state';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {PendingReasonApi} from '../../../../api/pending-reason/pending-reason.api';
import {RoWshopApi} from '../../../../api/ro-wshop/ro-wshop.api';
import {RoWshopActApi} from '../../../../api/ro-wshop/ro-wshop-act.api';
import {TechWshopApi} from '../../../../api/tech-wshop/tech-wshop.api';
import {ShopCommonApi} from '../../../../api/common-api/shop-common.api';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {EventBusService} from '../../../../shared/common-service/event-bus.service';
import {RepairOrderApi} from '../../../../api/quotation/repair-order.api';
import {pick} from 'lodash';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'info-general-repair-modal',
  templateUrl: './info-general-repair-modal.component.html',
  styleUrls: ['./info-general-repair-modal.component.scss']
})
export class InfoGeneralRepairModalComponent implements OnInit, OnDestroy {
  @Output() refreshList = new EventEmitter();
  @Output() refreshRoNoPlanList = new EventEmitter();
  @ViewChild('modal', {static: false}) modal;
  @ViewChild('repairAriseModal', {static: false}) repairAriseModal;
  form: FormGroup;
  reasonForm: FormGroup;
  modalHeight: number;
  repairPlanData;
  shops: Array<any> = [];
  reasons: Array<any> = [];
  isFromWaitingList: boolean;
  state = ProgressState.plan;
  ProgressState = ProgressState;
  subscription;
  stopPosition;

  jobFieldGrid;
  partFieldGrid;

  constructor(
    public dataFormatService: DataFormatService,
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
    private repairOrderApi: RepairOrderApi
  ) {
    this.jobFieldGrid = [
      {headerName: 'Nội dung công việc', headerTooltip: 'Nội dung công việc', field: 'jobsname'}
    ];
    this.partFieldGrid = [
      {headerName: 'Phụ tùng', headerTooltip: 'Phụ tùng', field: 'partsname'},
      {headerName: 'Số lượng', headerTooltip: 'Số lượng', field: 'qty'}
    ];
  }

  ngOnInit() {
    // this.subscription = this.eventBusService.on('openRepairPlanModal').subscribe(val => {
    //   this.stopPosition = val.stopPosition || null;
    //   this.initDataWhenOpenModal(val.roId, val.state, false, val.wshopId);
    // });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
    this.modal.hide();
  }

  initDataWhenOpenModal(roId, state, isFromWaitingList, shopIndex?) {
    this.state = state;
    this.isFromWaitingList = isFromWaitingList;
    this.getRepairPlan(roId, shopIndex);
    this.shopApi.getAllSccShop().subscribe(shops => this.shops = shops);
    this.pendingReasonApi.getAll().subscribe(reasons => this.reasons = reasons.map(item => {
      return {
        text: item.name,
        value: item.id
      };
    }));
  }

  open(roId, state, isFromWaitingList, shopIndex?) {
    this.stopPosition = null;
    this.initDataWhenOpenModal(roId, state, isFromWaitingList, shopIndex);
  }

  updatePlan() {
    const data = pick(this.form.value, ['fromDatetime', 'toDatetime', 'id', 'wshopId']);
    this.loadingService.setDisplay(true);
    this.roWshopApi.changePlanScc(data, this.form.value.isCarWash === true ? 'Y' : 'N'
      , this.form.value.isCusWait === true ? 'Y' : 'N'
      , this.form.value.isTakeParts === true ? 'Y' : 'N',
      this.form.value.qcLevel).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.refreshList.emit();
      this.modal.hide();
    });
  }

  getRepairPlan(roId, shopIndex?) {
    this.loadingService.setDisplay(true);
    this.roWshopApi.getRepairPlan(roId).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.state = res.information.state;
      this.modal.show();
      this.onResize();
      this.buildForm(res.information, shopIndex);
      this.buildReasonForm(res.information);
      this.repairPlanData = res;
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
    if (this.repairPlanData.jobsList.length) {
      params.api.setRowData(this.repairPlanData.jobsList);
    }
  }

  callbackGridPart(params) {
    if (this.repairPlanData.partsList.length) {
      params.api.setRowData(this.repairPlanData.partsList);
    }
  }

  startJob() {
    if (!this.form.value.wshopId) {
      this.swalAlertService.openFailToast('Bạn phải nhập khoang');
      return;
    }

    // const apiCall = (this.state === ProgressState.stopOutside || this.state === ProgressState.stopInside) ?
    //   this.roWshopActApi.changeStateJobScc({
    //       id: this.form.value.roWshopActId,
    //       wshopActId: this.form.value.wshopId,
    //       state: ProgressState.actual
    //     }, this.form.value.isCarWash === true ? 'Y' : 'N',
    //     this.form.value.isCusWait === true ? 'Y' : 'N',
    //     this.form.value.isTakeParts === true ? 'Y' : 'N',
    //     this.form.value.qcLevel) :
    //   this.roWshopActApi.startSccJob({
    //       id: this.form.value.id,
    //       wshopId: this.form.value.wshopId,
    //       fromDatetime: new Date(this.form.get('fromDatetime').value).getTime(),
    //       toDatetime: new Date(this.form.get('toDatetime').value).getTime()
    //     }, this.form.value.isCarWash === true ? 'Y' : 'N',
    //     this.form.value.isCusWait === true ? 'Y' : 'N',
    //     this.form.value.isTakeParts === true ? 'Y' : 'N',
    //     this.form.value.qcLevel);

    // this.loadingService.setDisplay(true);
    // apiCall.subscribe(() => {
    //   this.loadingService.setDisplay(false);
    //   this.modal.hide();
    //   this.refreshList.emit();
    // });
  }

  finishJob() {
    this.loadingService.setDisplay(true);
    this.roWshopActApi.finishSccJob({id: this.form.value.roWshopActId},
      this.form.value.isCarWash === true ? 'Y' : 'N',
      this.form.value.isCusWait === true ? 'Y' : 'N',
      this.form.value.isTakeParts === true ? 'Y' : 'N',
      this.form.value.qcLevel).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.modal.hide();
      this.refreshList.emit();
    });
  }

  freePlanScc() {
    this.loadingService.setDisplay(true);
    this.roWshopActApi.freePlanScc({id: this.form.value.id},
      this.form.value.isCarWash === true ? 'Y' : 'N',
      this.form.value.isCusWait === true ? 'Y' : 'N',
      this.form.value.isTakeParts === true ? 'Y' : 'N',
      this.form.value.qcLevel).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.modal.hide();
      this.refreshList.emit();
      this.refreshRoNoPlanList.emit();
    });
  }

  activePlanScc() {
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
        id: this.form.value.id,
        wshopId: this.form.value.wshopId,
        fromDatetime: this.form.value.fromDatetime,
        toDatetime: this.form.value.toDatetime
      }, this.form.value.isCarWash === true ? 'Y' : 'N',
      this.form.value.isCusWait === true ? 'Y' : 'N',
      this.form.value.isTakeParts === true ? 'Y' : 'N',
      this.form.value.qcLevel).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.modal.hide();
      this.refreshList.emit();
      this.refreshRoNoPlanList.emit();
    });
  }

  stopJob() {
    const data = {
      id: this.form.value.roWshopActId,
      state: this.reasonForm.value.isRelease ? ProgressState.stopOutside : ProgressState.stopInside,
      pendingReasonText: null,
      pendingReasonId: null
    };
    const reason = this.reasonForm.value.reason;
    if (typeof reason === 'string') {
      data.pendingReasonText = reason;
    } else if (typeof reason === 'number') {
      data.pendingReasonId = reason;
    }
    if ((!data.pendingReasonText || data.pendingReasonText.trim() === '') && !data.pendingReasonId) {
      this.swalAlertService.openWarningToast('Cần lý do để dừng công việc');
      return;
    }

    this.loadingService.setDisplay(true);
    // this.roWshopActApi.changeStateJobScc(data,
    //   this.form.value.isCarWash === true ? 'Y' : 'N',
    //   this.form.value.isCusWait === true ? 'Y' : 'N',
    //   this.form.value.isTakeParts === true ? 'Y' : 'N',
    //   this.form.value.qcLevel).subscribe(() => {
    //   this.loadingService.setDisplay(false);
    //   this.modal.hide();
    //   this.refreshList.emit();
    // });
  }

  removePlan() {
    this.loadingService.setDisplay(true);
    this.roWshopApi.removePlanScc(this.form.value.id).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.modal.hide();
      this.refreshList.emit();
      this.refreshRoNoPlanList.emit();
    });
  }

  private buildForm(val, shopIndex?) {
    this.form = this.formBuilder.group({
      id: [undefined],
      registerno: [undefined],
      repairorderno: [undefined],
      empName: [undefined],
      isPriority: [undefined],
      cusName: [undefined],
      mobil: [undefined],
      tel: [undefined],
      cmName: [undefined],
      km: [undefined],
      getInDate: [{value: undefined, disabled: true}],
      printDate: [{value: undefined, disabled: true}],
      gxDate: [{value: undefined, disabled: true}],
      fromDatetime: [undefined],
      toDatetime: [undefined],
      state: [undefined],
      wshopId: [undefined],
      roWshopActId: [undefined],
      roWshopId: [undefined],
      ktv: [{value: undefined, disabled: true}],

      isCusWait: [undefined],
      isCarWash: [undefined],
      isTakeParts: [undefined]
    });
    this.form.patchValue(Object.assign({}, val, {
      isPriority: val.isPriority && val.isPriority === 'Y',
      isCusWait: val.isCusWait && val.isCusWait === 'Y',
      wshopId: shopIndex ? shopIndex : val.wshopId
    }));

    if (shopIndex && shopIndex > 0) {
      this.getTechByWshopId(shopIndex, RoType.SCC);
    }

    this.form.get('wshopId').valueChanges.subscribe(id => {
      if (id && id > 0) {
        this.getTechByWshopId(id, RoType.SCC);
      }
    });
    this.form.get('isPriority').valueChanges.subscribe(isPriority => {
      const data = this.form.value;
      const obj = {
        carWash: (data.isCarWash) ? 'Y' : 'N',
        cuswait: (data.isCusWait) ? 'Y' : 'N',
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
    this.reasonForm = this.formBuilder.group({
      reason: [data.pendingReasonId || undefined],
      isRelease: [data.state === ProgressState.stopOutside],
      description: null
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
}
