import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetModalHeightService } from '../../../../../../shared/common-service/set-modal-height.service';
import { GlobalValidator } from '../../../../../../shared/form-validation/validators';
import { MaintenanceCallingModel } from '../../../../../../core/models/maintenance-operation/maintenance-calling.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'new-accessory-car',
  templateUrl: './new-accessory-car.component.html',
  styleUrls: ['./new-accessory-car.component.scss']
})
export class NewAccessoryCarComponent implements OnInit {
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  modalHeight: number;
  selectedData: MaintenanceCallingModel;

  constructor(
    private modalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedData) {
    this.selectedData = selectedData;
    this.buildForm();
    this.modal.show();
    this.onResize();
  }

  reset() {
    this.form = undefined;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    this.modal.hide();
    this.close.emit(this.form.value);
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      errorModel: [undefined],
      accessoriesType: [undefined],
      errorAmount: [undefined],
      errorNote: [undefined],
      errorVin: [undefined],
      licensePlates: [undefined],
      errorName: [undefined],
      errorAddress: [undefined],
      errorCity: [undefined],
      errorPhone: [undefined, GlobalValidator.phoneFormat],
      errorEmail: [undefined, Validators.compose([GlobalValidator.emailFormat, GlobalValidator.maxLength(50)])],
      errorDistrict: [undefined],
      companyName: [undefined],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}
