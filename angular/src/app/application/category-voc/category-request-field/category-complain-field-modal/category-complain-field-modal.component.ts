import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { ModalDirective } from 'ngx-bootstrap';
import { CategoryComplainFieldModel } from '../../../../core/models/category-voc/category-complain-field.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'category-complain-field-modal',
  templateUrl: './category-complain-field-modal.component.html',
  styleUrls: ['./category-complain-field-modal.component.scss'],
})
export class CategoryComplainFieldModalComponent implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  modalHeight: number;
  selectedRowData: CategoryComplainFieldModel;

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
      codeComplainField: [undefined],
      nameComplainFieldVN: [undefined],
      nameComplainFieldEN: [undefined],
      status: [undefined],
      stt: [undefined],
      description: [undefined],
    });
  }
}
