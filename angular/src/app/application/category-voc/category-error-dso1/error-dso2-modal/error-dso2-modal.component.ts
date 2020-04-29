import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { CategoryErrorDso1Model } from '../../../../core/models/category-voc/category-error-dso1.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'error-dso2-modal',
  templateUrl: './error-dso2-modal.component.html',
  styleUrls: ['./error-dso2-modal.component.scss'],
})
export class ErrorDso2ModalComponent implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  modalHeight: number;
  selectedRowData: CategoryErrorDso1Model;

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

  open(selectedData?) {
    this.selectedRowData = selectedData;
    this.buildForm();
    this.modal.show();
  }

  resetForm() {
    this.form.reset();
  }

  close() {
    this.modal.hide();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      codeDSO2: [undefined],
      nameDSO2VN: [undefined],
      nameDSO2EN: [undefined],
      codeDSO1: [undefined],
      status: [undefined],
      stt: [undefined],
      description: [undefined],
    });
  }
}
