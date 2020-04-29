import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { CategoryCarTypeModel } from '../../../../core/models/category-voc/category-car-type.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'specifications-modal',
  templateUrl: './specifications-modal.component.html',
  styleUrls: ['./specifications-modal.component.scss'],
})
export class SpecificationsModalComponent implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  selectedRowData: CategoryCarTypeModel;
  modalHeight;

  constructor(
    private formBuilder: FormBuilder,
    private setModalHeight: SetModalHeightService,
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  open(selectedRowData?) {
    this.selectedRowData = selectedRowData;
    this.buildForm();
    this.modal.show();
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
      categoryParent: [undefined],
      nameCategory: [undefined],
      description: [undefined],
      status: [undefined],
    });
  }
}
