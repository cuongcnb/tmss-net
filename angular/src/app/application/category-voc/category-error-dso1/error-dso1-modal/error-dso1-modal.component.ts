import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { CategoryErrorDso1Model } from '../../../../core/models/category-voc/category-error-dso1.model';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'error-dso1-modal',
  templateUrl: './error-dso1-modal.component.html',
  styleUrls: ['./error-dso1-modal.component.scss'],
})
export class ErrorDso1ModalComponent implements OnInit {

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

  onResize() {
    this.modalHeight = this.setModalHeight.onResize();
  }

  reset() {
    this.form = undefined;
  }

  open(selectedData?) {
    this.selectedRowData = selectedData;
    this.modal.show();
    this.buildForm();
  }

  resetForm() {
    this.form.reset();
  }

  close() {
    this.modal.hide();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      codeDSO1: [undefined],
      nameDSO1EN: [undefined],
      nameDSO1VN: [undefined],
      status: [undefined],
      stt: [undefined],
      description: [undefined],
    });
  }
}
