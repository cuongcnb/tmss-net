import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { CategoryCarTypeModel } from '../../../../core/models/category-voc/category-car-type.model';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'car-model-modal',
  templateUrl: './car-model-modal.component.html',
  styleUrls: ['./car-model-modal.component.scss'],
})
export class CarModelModalComponent implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  selectedRowData: CategoryCarTypeModel;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private setModalHeight: SetModalHeightService,
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeight.onResize();
  }

  open(selectedRowData?) {
    this.selectedRowData = selectedRowData;
    this.buildForm();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  resetForm() {
    this.form.reset();
  }

  close() {
    this.modal.hide();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      nameCarType: [undefined],
      codeCarModel: [undefined],
      codeMarketing: [undefined],
      nameCarModel: [undefined],
      status: [undefined],
      stt: [undefined],
    });
  }
}
