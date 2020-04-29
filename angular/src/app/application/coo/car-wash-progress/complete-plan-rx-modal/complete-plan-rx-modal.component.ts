import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { PendingReasonApi } from '../../../../api/pending-reason/pending-reason.api';
import { EventBusService } from '../../../../shared/common-service/event-bus.service';
import { RoWshopActApi } from '../../../../api/ro-wshop/ro-wshop-act.api';
import { LoadingService } from '../../../../shared/loading/loading.service';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'complete-plan-rx-modal',
  templateUrl: './complete-plan-rx-modal.component.html',
  styleUrls: ['./complete-plan-rx-modal.component.scss'],
})
export class CompletePlanRxModalComponent implements OnInit, OnDestroy {
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
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private eventBusService: EventBusService,
    private roWshopActApi: RoWshopActApi,
    private loadingService: LoadingService,
    private dataFormatService: DataFormatService,
  ) {
  }

  ngOnInit() {
    this.subscription = this.eventBusService.on('openCompletePlanRxModal').subscribe(val => {
      console.log("fffaaa")
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
    obj.actualId = this.data_modal.id;
    this.loadingService.setDisplay(true);

    this.roWshopActApi.finishRxJob(obj).subscribe(res => {
      this.swalAlertService.openSuccessToast("Hoàn thành xe thành công!")
      this.close();
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

}
