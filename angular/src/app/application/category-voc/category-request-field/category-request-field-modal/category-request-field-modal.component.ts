import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { CategoryRequestFieldModel } from '../../../../core/models/category-voc/category-request-field.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'category-request-field-modal',
  templateUrl: './category-request-field-modal.component.html',
  styleUrls: ['./category-request-field-modal.component.scss'],
})
export class CategoryRequestFieldModalComponent implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  modalHeight: number;
  selectedRowData: CategoryRequestFieldModel;

  constructor(
    private formBuilder: FormBuilder,
    private setModalHeight: SetModalHeightService,
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  open(selectedRowData?) {
    this.buildForm();
    this.modal.show();
    this.selectedRowData = selectedRowData;
  }

  onResize() {
    this.modalHeight = this.setModalHeight.onResize();
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
      codeRequestField: [undefined],
      nameRequestFieldVN: [undefined],
      nameRequestFieldEN: [undefined],
      status: [undefined],
      stt: [undefined],
      description: [undefined],
    });
  }
}
