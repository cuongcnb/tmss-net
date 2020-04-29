import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { DispatchChangeRequestService} from '../../../../api/swapping/dispatch-change-request.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { ConfirmService } from '../../../../shared/confirmation/confirm.service';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dispatch-change-approve-modal',
  templateUrl: './dispatch-change-approve-modal.component.html',
  styleUrls: ['./dispatch-change-approve-modal.component.scss']
})
export class DispatchChangeApproveModalComponent implements OnInit {
  @ViewChild('dispatchChangeApproveModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  isAdvanceRequest: boolean;
  selectedVehicle;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private dispatchChangeRequestService: DispatchChangeRequestService,
    private confirmationService: ConfirmService,
  ) {
  }

  ngOnInit() {
  }

  open(selectedVehicle, text?: string) {
    this.isAdvanceRequest = !!text;
    this.selectedVehicle = selectedVehicle;
    this.modal.show();
    this.buildForm();
  }

  reset() {
    this.form = undefined;
  }

  save() {
    if (this.form.valid && this.selectedVehicle) {
      let apiCall;
      const value = Object.assign({}, this.form.value, {
        vehicleId: this.selectedVehicle.id,
        changeType: this.isAdvanceRequest ? 'Dispatch_advance_request' : 'Dispatch_change_request',
        modifyDate: this.selectedVehicle.modifyDate
      });
      if (this.form.value.action === 'approve') {
        apiCall = this.dispatchChangeRequestService.approveChangeDispatch(value);
      } else if (this.form.value.action === 'reject') {
        apiCall = this.dispatchChangeRequestService.rejectChangeDispatch(value);
      } else {
        apiCall = this.dispatchChangeRequestService.newPlanChangeDispatch(value);
      }
      this.loadingService.setDisplay(true);
      apiCall.subscribe(() => {
        this.close.emit();
        this.modal.hide();
        this.swalAlertService.openSuccessModal();
        this.loadingService.setDisplay(false);
      }, err => {
        if (err.status === 522) {
          this.confirmationService.openConfirmModal(
            'Bản ghi đang được sử dụng',
            'Bạn phải reload lại dữ liệu trước khi update. Bạn có đồng ý reload lại dữ liệu không?')
            .subscribe(() => {
              this.modal.hide();
              this.close.emit();
            }, () => {
            });
        }
      });
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      action: [undefined, GlobalValidator.required],
      changeDate: [undefined, GlobalValidator.required],
    });
    this.form.get('changeDate').disable();
    this.form.get('action').valueChanges.subscribe(val => {
      if (val && val !== 'newPlan') {
        this.form.get('changeDate').disable();
      } else {
        this.form.get('changeDate').enable();
      }
    });
  }
}
