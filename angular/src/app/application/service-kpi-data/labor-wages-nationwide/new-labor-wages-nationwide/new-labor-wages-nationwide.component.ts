import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ServiceKpiDataModel } from '../../../../core/models/service-kpi-data/service-kpi-data.model';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'new-labor-wages-nationwide',
  templateUrl: './new-labor-wages-nationwide.component.html',
  styleUrls: ['./new-labor-wages-nationwide.component.scss']
})
export class NewLaborWagesNationwideComponent implements OnInit {
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  modalHeight: number;
  selectedData: ServiceKpiDataModel;

  constructor(
    private modalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedData?) {
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

  resetForm() {
    this.form.reset();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      sortAgency: [{value: 1, disabled: true}],
      packageName: [undefined],
      isCalculate: [undefined],
      isSTT: [undefined],
      isRevenue: [undefined],
      isRevenueTo: [undefined],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}
