import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { ModalDirective } from 'ngx-bootstrap';
import { CategoryCarTypeModel } from '../../../../core/models/category-voc/category-car-type.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'car-type-modal',
  templateUrl: './car-type-modal.component.html',
  styleUrls: ['./car-type-modal.component.scss'],
})
export class CarTypeModalComponent implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  modalHeight: number;
  selectedRowData: CategoryCarTypeModel;

  constructor(
    private formBuilder: FormBuilder,
    private setModalHeight: SetModalHeightService,
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  reset() {
    this.form = undefined;
  }

  onResize() {
    this.modalHeight = this.setModalHeight.onResize();
  }

  resetForm() {
    this.form.reset();
  }

  close() {
    this.modal.hide();
  }

  open(selectedRowData?) {
    this.buildForm();
    this.modal.show();
    this.selectedRowData = selectedRowData;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      codeCarType: [undefined],
      codeMarketing: [undefined],
      nameCarType: [undefined],
      description: [undefined],
      status: [undefined],
      stt: [undefined],
    });
  }
}
