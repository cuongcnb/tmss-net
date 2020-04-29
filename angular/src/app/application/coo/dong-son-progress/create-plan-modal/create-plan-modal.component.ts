import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { PendingReasonApi } from '../../../../api/pending-reason/pending-reason.api';
import { EventBusService } from '../../../../shared/common-service/event-bus.service';
import { RoWshopActApi } from '../../../../api/ro-wshop/ro-wshop-act.api';
import { LoadingService } from '../../../../shared/loading/loading.service';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {ShopCommonApi} from '../../../../api/common-api/shop-common.api';
import {RoWshopApi} from '../../../../api/ro-wshop/ro-wshop.api';
import {McopperPaintApi} from '../../../../api/common-api/mcopper-paint.api';
import { BpGroupApi } from '../../../../api/bp-group/bp-group.api';
import { ConfirmService } from '../../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'create-plan-modal',
  templateUrl: './create-plan-modal.component.html',
  styleUrls: ['./create-plan-modal.component.scss'],
})
export class CreatePlanModalComponent implements OnInit, OnDestroy {
  @Output() choose = new EventEmitter();
  @ViewChild('modal', {static: false}) modal;
  @Output() refreshList = new EventEmitter();
  @Output() refreshRoNoPlanList = new EventEmitter();
  form: FormGroup;
  modalHeight: number;
  listWhopFree =  [];
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
    this.subscription = this.eventBusService.on('openCreatePlanModal').subscribe(val => {
      this.initDataWhenOpenModal(val);
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
    this.shopCommonApi.getAllDsShop().subscribe(resp => {
      resp.map(it => {
        it.wshopId = it.id;
        return it;
      });
      this.listWhopFree = resp;
    });
    this.bpGroupApi.getBpGroups().subscribe(res => {
      this.listBpGroups = res;
      this.loadingService.setDisplay(false);
    })

    this.mcopperPaintApi.getListByDealer().subscribe(res => {
      this.listDsDefault = res.filter(it => it.status === 'Y');
      this.typeDs = this.listDsDefault[0].id;
      this.buildForm();
    });
    
    this.modal.show();
  }

  createPlan() {
    let obj = this.form.value;
    obj.wpId = this.data_modal.wpId;
    this.loadingService.setDisplay(true);

    this.roWshopApi.createNewPlanDs(obj).subscribe(res => {
      if (res && res.code == 6059) {
        this.confirmService.openConfirmModal('Cảnh báo', `Đã có kế hoạch cho xe ${res.data[0].registerNod} ở công đoạn ${res.data[0].bpId} tại tổ ${res.data[0].bpGroup}! 
        Bạn có muốn xóa kế hoạch cũ, tạo kế hoạch mới không?`).subscribe(() => {
          obj['ignoreCheck'] = true;
          this.roWshopApi.createNewPlanDs(obj).subscribe(() => {
            this.swalAlertService.openSuccessToast("Tạo kế hoạch thành công");
            this.close();
          });
        }, () => {
          this.swalAlertService.openSuccessToast("Tạo kế hoạch thành công");
          this.close();
        });
      } else {
        this.swalAlertService.openSuccessToast("Tạo kế hoạch thành công");
        this.close();
      }
      
    }, () => this.loadingService.setDisplay(false));
    
    this.roWshopApi.createNewPlanDs(this.form.value).subscribe(res => {
      this.swalAlertService.openSuccessToast("Tạo kế hoạch thành công");
      this.close();
    })
  }
  

  private buildForm() {
    this.form = this.formBuilder.group({
      fromDatetime: [this.dataFormatService.formatDate(new Date())],
      wshopId: [this.data_modal.wshopId],
      bpId: [this.typeDs],
      bpGroupId: [this.data_modal.bpGroupId],
    });
  }

  close() {
    // if (this.isRefreshRoAfterClose) {
    //   this.loadingService.setDisplay(true);
    //   this.refreshRoNoPlanList.emit();
    // }
    // this.isRefreshRoAfterClose = false;
    this.refreshRoNoPlanList.emit();
    this.refreshList.emit();
    this.modal.hide();
  }

  getWshopName() {
    for (let i = 0; i < this.listWhopFree.length; i++) {
      if (this.form.value.wshopId ==  this.listWhopFree[i].wshopId) 
      return this.listWhopFree[i].wsCode;
    }
    return "";
  }
}
