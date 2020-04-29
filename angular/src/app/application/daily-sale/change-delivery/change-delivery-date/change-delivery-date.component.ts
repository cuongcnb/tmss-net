import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ContractManagementService} from '../../../../api/daily-sale/contract-management.service';
import {IeCalculateDateService} from '../../../../shared/common-service/ie-calculate-date.service';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'change-delivery-date',
  templateUrl: './change-delivery-date.component.html',
  styleUrls: ['./change-delivery-date.component.scss']
})
export class ChangeDeliveryDateComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  modalHeight: number;
  selectedFollowUpId: number;
  isChangeDelivery: boolean;
  // minDate;
  // daysDisabled = [0];

  constructor(
    private formBuilder: FormBuilder,
    private contractManagementService: ContractManagementService,
    private ieCalculateDateService: IeCalculateDateService,
    private swalAlertService: ToastService,
    private loadingService: LoadingService,
    private setModalHeightService: SetModalHeightService
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(selectedFollowUpId, isChangeDelivery?) {
    this.isChangeDelivery = isChangeDelivery;
    this.selectedFollowUpId = selectedFollowUpId;
    this.contractManagementService.getChangeDelivery(selectedFollowUpId).subscribe(val => {
      this.buildForm(val);
    });
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    this.loadingService.setDisplay(true);
    this.contractManagementService.updateChangeDelivery(this.selectedFollowUpId, this.form.value).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessModal();
      this.close.emit();
      this.modal.hide();
    });
  }

  private buildForm(val) {
    this.form = this.formBuilder.group({
      id: [undefined],
      deliveryDate: [undefined, GlobalValidator.required],
      contractNo: [{value: undefined, disabled: true}],
      frameNo: [{value: undefined, disabled: true}],
      grade: [{value: undefined, disabled: true}],
      salesDate: [{value: undefined, disabled: true}],
      contactName: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(255)])],
      contactAddress: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(255)])],
      contactTel: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50)])]
    });
    // if ([1, 2, 3, 4].includes(new Date().getDay())) {
    //   this.minDate = new Date(new Date().setDate(new Date().getDate() - 5));
    // } else {
    //   this.minDate = new Date(new Date().setDate(new Date().getDate() - 4));
    // }
    this.form.patchValue(val);
  }
}

