import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { isEqual } from 'lodash';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dealer-balance-edit-modal',
  templateUrl: './dealer-balance-edit-modal.component.html',
  styleUrls: ['./dealer-balance-edit-modal.component.scss']
})
export class DealerBalanceEditModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  selectedDealerBalance;

  constructor(
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private dataFormatService: DataFormatService,
  ) { }

  ngOnInit() {
  }

  open(selectedDealerBalance) {
    this.selectedDealerBalance = selectedDealerBalance;
    this.buildForm();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  private convertStringToInt(val) {
    if (val) {
      if (typeof val === 'string') {
        return parseInt(val.replace(/,/g, ''), 10);
      } else {
        return val;
      }
    }
    return null;
  }

  confirm() {
    if (this.form.invalid) {
      return;
    }
    const val = this.form.value.adjustment;
    if (isEqual(val, this.selectedDealerBalance.adjustment)) {
      this.swalAlertService.openFailModal('Your input is not changed. If you do not want to change value, click "Cancel"', 'Same Input');
      return;
    }
    const emmitValue = this.selectedDealerBalance;
    emmitValue.adjustment = this.convertStringToInt(val);
    this.close.emit(emmitValue);
    this.modal.hide();
  }

  private buildForm() {
    const adjustment = this.selectedDealerBalance.adjustment;
    this.form = this.formBuilder.group({
      adjustment: [adjustment, Validators.compose([GlobalValidator.positiveAndNegInteger, Validators.required, GlobalValidator.maxLength(15)])]
    });
    if (adjustment) {
      this.dataFormatService.formatMoneyForm(this.form, 'adjustment');
    }
  }

}
