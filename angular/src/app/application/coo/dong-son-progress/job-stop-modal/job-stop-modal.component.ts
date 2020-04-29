import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { PendingReasonApi } from '../../../../api/pending-reason/pending-reason.api';
import { EventBusService } from '../../../../shared/common-service/event-bus.service';
import { RoWshopActApi } from '../../../../api/ro-wshop/ro-wshop-act.api';
import { LoadingService } from '../../../../shared/loading/loading.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'job-stop-modal',
  templateUrl: './job-stop-modal.component.html',
  styleUrls: ['./job-stop-modal.component.scss'],
})
export class JobStopModalComponent implements OnInit, OnDestroy {
  @Output() choose = new EventEmitter();
  @ViewChild('modal', {static: false}) modal;
  form: FormGroup;
  modalHeight: number;
  reasons: Array<any> = [];
  subscription;
  dataBinding;

  constructor(
    private pendingReasonApi: PendingReasonApi,
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private eventBusService: EventBusService,
    private roWshopActApi: RoWshopActApi,
    private loadingService: LoadingService,
  ) {
  }

  ngOnInit() {
    this.subscription = this.eventBusService.on('openRepairDSPlanModal').subscribe(val => {
      this.dataBinding = val;
      this.open();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  open() {
    this.pendingReasonApi.getAll().subscribe(reasons => this.reasons = reasons.map(item => {
      return {
        text: item.name,
        value: item.id,
      };
    }));
    this.buildForm();
    this.modal.show();
  }

  chooseReason() {
    const data = this.form.value;
    if (!data.pendingReasonId) {
      this.swalAlertService.openWarningToast('Cần lý do để dừng công việc');
      return;
    }
    if (this.dataBinding) {
      data.empId = this.dataBinding.empId;
      data.id = this.dataBinding.id;
      data.roWshopActId = this.dataBinding.roWshopActId;
      data.state = this.dataBinding.state;
      this.modal.hide();
      this.loadingService.setDisplay(true);
      this.roWshopActApi.changeStateJobDs(data).subscribe(() => {
        this.loadingService.setDisplay(false);
        this.refreshSearch();
      }, () => {
        this.refreshSearch();
      }, () => {
        this.modal.hide();
      });
    } else {
      this.choose.emit(data);
      this.modal.hide();
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      pendingReasonId: [undefined],
      pendingReasonText: null,
    });
  }

  close() {
    this.modal.hide();
    this.reasons = [];

  }

  private refreshSearch() {
    this.eventBusService.emit({
      type: 'searchProgress',
      progressType: 'ds',
    });
  }

}
