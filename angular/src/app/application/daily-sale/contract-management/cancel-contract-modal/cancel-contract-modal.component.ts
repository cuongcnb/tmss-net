import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContractManagementService} from '../../../../api/daily-sale/contract-management.service';
import { IeCalculateDateService } from '../../../../shared/common-service/ie-calculate-date.service';
import { LookupCodes } from '../../../../core/constains/lookup-codes';
import { LookupDataModel } from '../../../../core/models/base.model';
import { LookupService} from '../../../../api/lookup/lookup.service';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { FormStoringService } from '../../../../shared/common-service/form-storing.service';
import { StorageKeys } from '../../../../core/constains/storageKeys';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cancel-contract-modal',
  templateUrl: './cancel-contract-modal.component.html',
  styleUrls: ['./cancel-contract-modal.component.scss']
})
export class CancelContractModalComponent implements OnInit {
  @ViewChild('cancelContractModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  modalHeight: number;
  reasons: Array<LookupDataModel>;
  selectedFollowUpId: number;
  canUndoCancel: boolean;
  cancelFormType: string;

  constructor(
    private formBuilder: FormBuilder,
    private contractManagementService: ContractManagementService,
    private ieCalculateDateService: IeCalculateDateService,
    private swalAlertService: ToastService,
    private formStoringService: FormStoringService,
    private loadingService: LoadingService,
    private lookupService: LookupService,
    private setModalHeightService: SetModalHeightService
  ) {
  }

  get currentUser() {
    return this.formStoringService.get(StorageKeys.currentUser);
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(selectedFollowUpId) {
    this.selectedFollowUpId = selectedFollowUpId;
    this.lookupService.getDataByCode(LookupCodes.cancel_reason).subscribe(reasons => this.reasons = reasons);
    this.contractManagementService.getCancelData(selectedFollowUpId).subscribe(val => {
      val.cancelDateNew = val.cancelDate;
      this.buildForm(val);
    });
    this.modal.show();
  }

  undoCancel() {
    this.loadingService.setDisplay(true);
    this.contractManagementService.unCancelContract(this.selectedFollowUpId, this.form.value.all).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.close.emit();
      this.modal.hide();
    });
  }

  approveUndoCancel() {
    this.loadingService.setDisplay(true);
    this.contractManagementService.approveUncancelContract(this.selectedFollowUpId).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.close.emit();
      this.modal.hide();
    });
  }

  rejectUndoCancel() {
    this.loadingService.setDisplay(true);
    this.contractManagementService.rejectUncancelContract(this.selectedFollowUpId).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.close.emit();
      this.modal.hide();
    });
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    this.loadingService.setDisplay(true);
    this.contractManagementService.cancelContract(this.selectedFollowUpId, this.form.value).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessModal();
      this.close.emit();
      this.modal.hide();
    });
  }

  approveCancel() {
    this.loadingService.setDisplay(true);
    this.contractManagementService.approveCancelContract(this.selectedFollowUpId).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.close.emit();
      this.modal.hide();
    });
  }

  rejectCancel() {
    this.loadingService.setDisplay(true);
    this.contractManagementService.rejectCancelContract(this.selectedFollowUpId).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.close.emit();
      this.modal.hide();
    });
  }

  private buildForm(val) {
    this.canUndoCancel = val.cancelDate || val.cancelDateNew;
    if (val.cancelDate) {
      if (val.cancelDateNew) {
        this.cancelFormType = 'undoCancel';
      }
    } else {
      if (val.cancelDateNew) {
        this.cancelFormType = 'cancel';
      }
    }
    // this.form.get('cancelDateNew').setValue(val.cancelDate);
    this.form = this.formBuilder.group({
      customerName: [{value: undefined, disabled: true}],
      contractNo: [{value: undefined, disabled: true}],
      wodDate: [{value: undefined, disabled: true}],
      grade: [{value: undefined, disabled: true}],
      gradeProduction: [{value: undefined, disabled: true}],
      color: [{value: undefined, disabled: true}],
      interiorColor: [{value: undefined, disabled: true}],
      estimatedDate: [{value: undefined, disabled: true}],
      salesDate: [{value: undefined, disabled: true}],
      cancelDateNew: [undefined, Validators.compose([GlobalValidator.depositDate, GlobalValidator.required])],
      cancelTypeId: [undefined, GlobalValidator.required],
      cancelReasonText: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50)])],
      all: [false]
    });

    this.form.patchValue(val);
  }
}
