import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { PendingReasonApi } from '../../../../api/pending-reason/pending-reason.api';
import { EventBusService } from '../../../../shared/common-service/event-bus.service';
import { RoWshopActApi } from '../../../../api/ro-wshop/ro-wshop-act.api';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';
import { ShopCommonApi } from '../../../../api/common-api/shop-common.api';
import { RoWshopApi } from '../../../../api/ro-wshop/ro-wshop.api';
import { McopperPaintApi } from '../../../../api/common-api/mcopper-paint.api';
import { BpGroupApi } from '../../../../api/bp-group/bp-group.api';
import { ConfirmService } from '../../../../shared/confirmation/confirm.service';

const VEHICLE_IN_PROGRESS = 6066;
const PLAN_THIS_CAR_ALREADY_EXIST = 6061;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'complete-plan-modal',
  templateUrl: './complete-plan-modal.component.html',
  styleUrls: ['./complete-plan-modal.component.scss'],
})
export class CompletePlanModalComponent implements OnInit, OnDestroy {
  @Output() choose = new EventEmitter();
  @ViewChild('vehicleInProgressModal', {static: false}) vehicleInProgressModal;
  @ViewChild('modal', { static: false }) modal;
  @Output() refreshList = new EventEmitter();
  @Output() refreshRoNoPlanList = new EventEmitter();
  form: FormGroup;
  modalHeight: number;
  listWhopFree = [];
  listBpGroups = [];
  subscription;
  dataBinding;
  data_modal;
  shops;
  typeDs;
  listDsDefault = [];

  isRefreshRoAfterClose: boolean;


  constructor(
    private pendingReasonApi: PendingReasonApi,
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private eventBusService: EventBusService,
    private roWshopActApi: RoWshopActApi,
    private loadingService: LoadingService,
    private dataFormatService: DataFormatService,
    private shopCommonApi: ShopCommonApi,
    private bpGroupApi: BpGroupApi,
    private roWshopApi: RoWshopApi,
    private mcopperPaintApi: McopperPaintApi,
    private confirmService: ConfirmService,
  ) {
  }

  ngOnInit() {
    this.subscription = this.eventBusService.on('openCompletePlanModal').subscribe(val => {
      this.initDataWhenOpenModal(val.data);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  open(val) {
    this.initDataWhenOpenModal(val);
  }

  initDataWhenOpenModal(val) {
    this.data_modal = val;
    this.buildForm();
    this.modal.show();
  }

  completePlan() {
    let obj = this.form.value;
    obj.wpId = this.data_modal.wpId;
    this.loadingService.setDisplay(true);

    this.roWshopApi.carSuccess(false, obj).subscribe(res => {
      if (res && (res.code === VEHICLE_IN_PROGRESS || res.code === PLAN_THIS_CAR_ALREADY_EXIST)) {
        this.vehicleInProgressModal.open(res.data);
        this.close();
      } else {
        this.close();
        this.confirmService.openConfirmModal('Thông báo', 'Bạn có muốn kết thúc sửa chữa cho xe hay không?')
          .subscribe(() => {
            this.completeRequest(obj);
          });
      }
    });
  }


  private buildForm() {
    this.form = this.formBuilder.group({
      toTime: [this.dataFormatService.formatDate(new Date())],
    });
  }

  close() {
    this.refreshRoNoPlanList.emit();
    this.refreshList.emit();
    this.modal.hide();
  }

  completeRequest(data) {
    this.loadingService.setDisplay(true);
    this.roWshopApi.carSuccess(true, data).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast("Hoàn thành xe thành công!")
      this.close();
    })
  }

}
