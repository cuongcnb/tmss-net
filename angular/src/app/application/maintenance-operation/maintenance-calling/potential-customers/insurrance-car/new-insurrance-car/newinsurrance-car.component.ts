import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../../../../shared/common-service/set-modal-height.service';
import { MaintenanceCallingModel } from '../../../../../../core/models/maintenance-operation/maintenance-calling.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'newinsurrance-car',
  templateUrl: './newinsurrance-car.component.html',
  styleUrls: ['./newinsurrance-car.component.scss']
})
export class NewinsurranceCarComponent implements OnInit {
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
    this.onResize();
    this.buildForm();
    this.modal.show();
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
      licensePlates: [undefined],
      errorVin: [undefined],
      insurranceType: [undefined],
      dateTimeHM: [undefined],
      dateTimeHH: [undefined],
      dateTimeM: [undefined],
      errorCompany: [undefined],
      insuranceBranch: [undefined],
      errorNote: [undefined],
      errorDislable: [{value: undefined, disabled: true}],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}
